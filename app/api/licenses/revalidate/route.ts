import { CustomError, SubscriptionNotFoundError } from "@/app/api/_errors";
import { RedeemLicense } from "@/domains/RedeemLicense";
import { Subscription, SubscriptionWithoutID } from "@/domains/Subscription";
import { revokeRoleFromUser } from "@/utils/discord";
import { fetchSubscription } from "@/utils/gumroad";
import { client } from "@/utils/prisma";

export const POST = async (req: Request) => {
  try {
    const { license_key } = await req.json();
    console.log(`Revalidate license: ${license_key}`);
    const data = await client.subscription.findFirst({
      where: { license_key },
    });

    if (!data) {
      console.log("Subscription not found");
      throw new SubscriptionNotFoundError(
        "Subscription not found by license key:" + license_key,
      );
    }

    const current = Subscription.reconstruct(data);

    const nowData = await fetchSubscription(current.subscriptionId);
    if (nowData.success === false) {
      console.error(nowData.message);
      throw new SubscriptionNotFoundError(
        "Failed to fetch subscription data:" + current.subscriptionId,
      );
    }

    const now = SubscriptionWithoutID.createFromUnmarshalledSubscription(
      nowData.subscriber,
    );

    await client.$transaction(async (prisma) => {
      // update subscription
      await prisma.subscription.update({
        data: now.toDB(),
        where: { id: current.id },
      });

      // TODO: payment failed to success
      if (!now.isAlive()) {
        console.log("Subscription is not alive");
        // disable all licenses
        const redeemLicenses = (
          await prisma.redeemLicense.findMany({
            where: { subscription_id: current.subscriptionId },
          })
        ).map((item) => RedeemLicense.reconstruct(item));

        for (const license of redeemLicenses) {
          if (license.isEnable()) {
            // disable license
            await prisma.redeemLicense.update({
              data: {
                status: "disabled",
              },
              where: { id: license.id },
            });
            // revoke discord roles (external)
            for (const role of license.discordGrantRoles) {
              await revokeRoleFromUser(license.discordId, role);
            }
          }
        }
      }
    });

    return Response.json({ success: true, message: "Success" });
  } catch (err) {
    console.log(err);
    if (err instanceof CustomError) {
      return Response.json(
        { success: false, message: err.message, code: err.code },
        { status: 500 },
      );
    }
    return Response.json({ success: false, message: "Error" }, { status: 500 });
  }
};

import { SubscriptionNotFoundError } from "@/app/api/_errors";
import { RedeemLicense } from "@/domains/RedeemLicense";
import { Subscription, SubscriptionWithoutID } from "@/domains/Subscription";
import { revokeRoleFromUser } from "@/utils/discord";
import { fetchSubscription } from "@/utils/gumroad";
import { client } from "@/utils/prisma";

const fetchSubscriptionByLicenseKey = async (
  licenseKey: string,
): Promise<Subscription> => {
  const data = await client.subscription.findFirst({
    where: { license_key: licenseKey },
  });

  if (!data) {
    console.log("Subscription not found");
    throw new SubscriptionNotFoundError(
      "Subscription not found by license key:" + licenseKey,
    );
  }

  const subscription = Subscription.reconstruct(data);
  return subscription;
};

const prepare = async (
  licenseKey: string,
): Promise<{
  subscription: Subscription;
  data: SubscriptionWithoutID;
}> => {
  const subscription = await fetchSubscriptionByLicenseKey(licenseKey);
  const res = await fetchSubscription(subscription.subscriptionId);
  if (res.success === false) {
    console.error(res.message);
    throw new SubscriptionNotFoundError(
      "Failed to fetch subscription data:" + subscription.subscriptionId,
    );
  }

  const data = SubscriptionWithoutID.createFromUnmarshalledSubscription(
    res.subscriber,
  );
  return { subscription, data };
};

const store = async (
  subscription: Subscription,
  data: SubscriptionWithoutID,
): Promise<void> => {
  await client.$transaction(async (prisma) => {
    // update subscription
    await prisma.subscription.update({
      data: data.toDB(),
      where: { id: subscription.id },
    });

    // TODO: payment failed to success
    if (!data.isAlive()) {
      console.log("Subscription is not alive");
      // disable all licenses
      const redeemLicenses = (
        await prisma.redeemLicense.findMany({
          where: { subscription_id: subscription.subscriptionId },
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
};

export const execute = async (licenseKey: string): Promise<void> => {
  const { subscription, data } = await prepare(licenseKey);

  await store(subscription, data);
};

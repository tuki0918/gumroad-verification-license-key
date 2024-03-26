import {
  CustomError,
  FailedToVerifyLicenseKeyError,
  InvalidLicenseKeyError,
  LicenseKeyAlreadyExistsError,
  LicenseKeyDisabledError,
  SubscriptionIsNotAliveError,
} from "@/app/api/_errors";
import { RedeemLicenseWithoutID } from "@/domains/RedeemLicense";
import { SubscriptionWithoutID } from "@/domains/Subscription";
import { assignRoleToUser } from "@/utils/discord";
import {
  fetchSubscription,
  isLicenseKeyFormat,
  verifyLicense,
} from "@/utils/gumroad";
import { client } from "@/utils/prisma";

export const POST = async (req: Request) => {
  // NOTE: License key can be redeemed as long as it is valid
  try {
    const { product_id, license_key, discord_id } = await req.json();
    console.log(`Redeem license: ${license_key}: ${discord_id}`);

    if (!isLicenseKeyFormat(license_key)) {
      throw new InvalidLicenseKeyError(
        "Invalid license key format:" + license_key,
      );
    }

    const count = await client.redeemLicense.count({
      where: { code: license_key, discord_id },
    });
    if (count > 0) {
      console.log("License already exists key:", license_key, "exists:", count);
      throw new LicenseKeyAlreadyExistsError(
        "You have already used this license key.",
      );
    }

    const res = await verifyLicense(product_id, license_key);
    if (res.success === false) {
      const text = "This license key has been disabled.";
      if (res.message === text) {
        throw new LicenseKeyDisabledError(text);
      }

      throw new FailedToVerifyLicenseKeyError("Failed to verify license key.");
    }

    const { uses, purchase: data } = res;
    console.log("Verified license key:", license_key, "uses:", uses);

    const redeemLicense = RedeemLicenseWithoutID.createFromUnmarshalledPurchase(
      data,
      discord_id,
      [],
    );

    let subscription: SubscriptionWithoutID | null = null;
    // Create subscription if exists
    if (redeemLicense.subscriptionId !== null) {
      const subscriptionId = redeemLicense.subscriptionId;
      const subscriptionData = await fetchSubscription(subscriptionId);
      if (subscriptionData.success === false) {
        console.error(subscriptionData.message);
        throw new Error("Failed to fetch subscription data:" + subscriptionId);
      }
      // Create subscription
      subscription = SubscriptionWithoutID.createFromUnmarshalledSubscription(
        subscriptionData.subscriber,
      );
    }

    if (!subscription?.isAlive()) {
      const text = "Subscription is not alive";
      console.log(text);
      throw new SubscriptionIsNotAliveError(text);
    }

    if (process.env.DISCORD_GRANT_COMMON_ROLE_ID !== undefined) {
      redeemLicense.addDiscordGrantRole(
        process.env.DISCORD_GRANT_COMMON_ROLE_ID,
      );
    }
    if (data.custom_fields?.discord_grant_role !== undefined) {
      redeemLicense.addDiscordGrantRole(data.custom_fields.discord_grant_role);
    }

    await client.$transaction(async (prisma) => {
      // Create or Update subscription if exists
      if (subscription !== null) {
        const data = await prisma.subscription.findFirst({
          where: { subscription_id: subscription.subscriptionId },
        });
        if (data !== null) {
          // Update subscription
          await prisma.subscription.update({
            data: subscription.toDB(),
            where: { id: data.id },
          });
        } else {
          // Create subscription
          await prisma.subscription.create({ data: subscription.toDB() });
        }
      }
      // Create redeem license
      await prisma.redeemLicense.create({ data: redeemLicense.toDB() });
      // Discord grant roles (external)
      for (const role of redeemLicense.discordGrantRoles) {
        await assignRoleToUser(redeemLicense.discordId, role);
      }
    });

    return Response.json({
      success: true,
      message: "Success",
      data: {
        discord_id: redeemLicense.discordId,
        discord_grant_roles: redeemLicense.discordGrantRoles,
      },
    });
  } catch (err) {
    console.log(err);
    if (err instanceof CustomError) {
      return Response.json(
        { success: false, message: err.message, code: err.code },
        { status: 500 },
      );
    }
    return Response.json(
      { success: false, message: "Error", code: "UNKNOWN" },
      { status: 500 },
    );
  }
};

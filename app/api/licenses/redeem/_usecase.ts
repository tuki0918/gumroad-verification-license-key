import {
  FailedToVerifyLicenseKeyError,
  InvalidLicenseKeyError,
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

const DISCORD_GRANT_COMMON_ROLE_ID = process.env.DISCORD_GRANT_COMMON_ROLE_ID;

const fetchRedeemLicense = async (
  productId: string,
  licenseKey: string,
  discordId: string,
) => {
  if (!isLicenseKeyFormat(licenseKey)) {
    throw new InvalidLicenseKeyError(
      "Invalid license key format:" + licenseKey,
    );
  }

  const res = await verifyLicense(productId, licenseKey);
  if (res.success === false) {
    const text = "This license key has been disabled.";
    if (res.message === text) {
      throw new LicenseKeyDisabledError(text);
    }
    throw new FailedToVerifyLicenseKeyError("Failed to verify license key.");
  }

  const { uses, purchase } = res;
  console.log("Verified license key:", licenseKey, "uses:", uses);

  const redeemLicense = RedeemLicenseWithoutID.createFromUnmarshalledPurchase(
    purchase,
    discordId,
    [],
    "enable",
  );

  if (purchase.custom_fields?.discord_grant_role !== undefined) {
    redeemLicense.addDiscordGrantRole(
      purchase.custom_fields.discord_grant_role,
    );
  }

  return redeemLicense;
};

const prepare = async (
  productId: string,
  licenseKey: string,
  discordId: string,
): Promise<{
  redeemLicense: RedeemLicenseWithoutID;
  subscription: SubscriptionWithoutID | null;
}> => {
  const redeemLicense = await fetchRedeemLicense(
    productId,
    licenseKey,
    discordId,
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

  return { redeemLicense, subscription };
};

const store = async (
  redeemLicense: RedeemLicenseWithoutID,
  subscription: SubscriptionWithoutID | null,
): Promise<void> => {
  await client.$transaction(async (prisma) => {
    const license = await prisma.redeemLicense.findFirst({
      where: { code: redeemLicense.code, discord_id: redeemLicense.discordId },
    });

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

    // Create or Update redeem license
    if (license !== null) {
      await prisma.redeemLicense.update({
        data: redeemLicense.toDB(),
        where: { id: license.id },
      });
    } else {
      await prisma.redeemLicense.create({ data: redeemLicense.toDB() });
    }

    // Discord grant roles (external)
    for (const role of redeemLicense.discordGrantRoles) {
      await assignRoleToUser(redeemLicense.discordId, role);
    }
  });
};

export const execute = async (params: {
  productId: string;
  licenseKey: string;
  discordId: string;
}): Promise<{
  redeemLicense: RedeemLicenseWithoutID;
  subscription: SubscriptionWithoutID | null;
}> => {
  const { productId, licenseKey, discordId } = params;
  const { redeemLicense, subscription } = await prepare(
    productId,
    licenseKey,
    discordId,
  );

  // grant common role
  if (DISCORD_GRANT_COMMON_ROLE_ID !== undefined) {
    redeemLicense.addDiscordGrantRole(DISCORD_GRANT_COMMON_ROLE_ID);
  }

  await store(redeemLicense, subscription);

  return { redeemLicense, subscription };
};

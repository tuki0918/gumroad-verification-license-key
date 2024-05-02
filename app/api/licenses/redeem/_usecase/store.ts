import { RedeemLicenseWithoutID } from "@/domains/RedeemLicense";
import { SubscriptionWithoutID } from "@/domains/Subscription";
import { PrismaTransactionalClient } from "@/libs/prisma";
import { PrismaClient } from "@prisma/client";

export const store = async (
  db: PrismaClient | PrismaTransactionalClient,
  redeemLicense: RedeemLicenseWithoutID,
  subscription: SubscriptionWithoutID | null,
): Promise<void> => {
  const license = await db.redeemLicense.findFirst({
    where: { code: redeemLicense.code, discord_id: redeemLicense.discordId },
  });

  // Create or Update subscription if exists
  if (subscription !== null) {
    const data = await db.subscription.findFirst({
      where: { subscription_id: subscription.subscriptionId },
    });
    if (data !== null) {
      // Update subscription
      await db.subscription.update({
        data: subscription.toDB(),
        where: { id: data.id },
      });
    } else {
      // Create subscription
      await db.subscription.create({ data: subscription.toDB() });
    }
  }

  // Create or Update redeem license
  if (license !== null) {
    await db.redeemLicense.update({
      data: redeemLicense.toDB(),
      where: { id: license.id },
    });
  } else {
    await db.redeemLicense.create({ data: redeemLicense.toDB() });
  }
};

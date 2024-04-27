import { RedeemLicenseWithoutID } from "@/domains/RedeemLicense";
import { SubscriptionWithoutID } from "@/domains/Subscription";
import { assignRoleToUser } from "@/libs/discord";
import prisma from "@/libs/prisma";

export const store = async (
  redeemLicense: RedeemLicenseWithoutID,
  subscription: SubscriptionWithoutID | null,
): Promise<void> => {
  await prisma.$transaction(async (client) => {
    const license = await client.redeemLicense.findFirst({
      where: { code: redeemLicense.code, discord_id: redeemLicense.discordId },
    });

    // Create or Update subscription if exists
    if (subscription !== null) {
      const data = await client.subscription.findFirst({
        where: { subscription_id: subscription.subscriptionId },
      });
      if (data !== null) {
        // Update subscription
        await client.subscription.update({
          data: subscription.toDB(),
          where: { id: data.id },
        });
      } else {
        // Create subscription
        await client.subscription.create({ data: subscription.toDB() });
      }
    }

    // Create or Update redeem license
    if (license !== null) {
      await client.redeemLicense.update({
        data: redeemLicense.toDB(),
        where: { id: license.id },
      });
    } else {
      await client.redeemLicense.create({ data: redeemLicense.toDB() });
    }

    // Discord grant roles (external)
    for (const role of redeemLicense.discordGrantRoles) {
      await assignRoleToUser(redeemLicense.discordId, role);
    }
  });
};

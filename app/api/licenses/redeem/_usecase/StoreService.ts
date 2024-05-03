import { RedeemLicenseWithoutID } from "@/domains/RedeemLicense";
import { SubscriptionWithoutID } from "@/domains/Subscription";
import { PrismaTransactionalClient } from "@/libs/prisma";
import { PrismaClient } from "@prisma/client";

export interface StoreServiceInterface {
  execute(
    redeemLicense: RedeemLicenseWithoutID,
    subscription: SubscriptionWithoutID | null,
  ): Promise<void>;
}

export class StoreService implements StoreServiceInterface {
  constructor(private readonly db: PrismaClient | PrismaTransactionalClient) {}

  async execute(
    redeemLicense: RedeemLicenseWithoutID,
    subscription: SubscriptionWithoutID | null,
  ): Promise<void> {
    const license = await this.db.redeemLicense.findFirst({
      where: { code: redeemLicense.code, discord_id: redeemLicense.discordId },
    });

    // Create or Update subscription if exists
    if (subscription !== null) {
      const data = await this.db.subscription.findFirst({
        where: { subscription_id: subscription.subscriptionId },
      });
      if (data !== null) {
        // Update subscription
        await this.db.subscription.update({
          data: subscription.toDB(),
          where: { id: data.id },
        });
      } else {
        // Create subscription
        await this.db.subscription.create({ data: subscription.toDB() });
      }
    }

    // Create or Update redeem license
    if (license !== null) {
      await this.db.redeemLicense.update({
        data: redeemLicense.toDB(),
        where: { id: license.id },
      });
    } else {
      await this.db.redeemLicense.create({ data: redeemLicense.toDB() });
    }
  }
}

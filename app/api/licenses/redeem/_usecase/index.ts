import { RedeemLicenseWithoutID } from "@/domains/RedeemLicense";
import { SubscriptionWithoutID } from "@/domains/Subscription";
import { assignRoleToUser } from "@/libs/discord";
import { PrismaClient } from "@prisma/client";
import { PrepareServiceInterface } from "./PrepareService";
import { StoreService } from "./StoreService";

const DISCORD_GRANT_COMMON_ROLE_ID = process.env.DISCORD_GRANT_COMMON_ROLE_ID;

export interface UseCaseInterface {
  execute(
    productId: string,
    licenseKey: string,
    discordId: string,
  ): Promise<{
    redeemLicense: RedeemLicenseWithoutID;
    subscription: SubscriptionWithoutID | null;
  }>;
}

export class RedeemUseCase implements UseCaseInterface {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly prepareService: PrepareServiceInterface,
  ) {}

  async execute(
    productId: string,
    licenseKey: string,
    discordId: string,
  ): Promise<{
    redeemLicense: RedeemLicenseWithoutID;
    subscription: SubscriptionWithoutID | null;
  }> {
    const { redeemLicense, subscription } = await this.prepareService.execute(
      productId,
      licenseKey,
      discordId,
    );

    // grant common role
    if (DISCORD_GRANT_COMMON_ROLE_ID !== undefined) {
      redeemLicense.addDiscordGrantRole(DISCORD_GRANT_COMMON_ROLE_ID);
    }

    // transaction
    await this.prisma.$transaction(async (client) => {
      const storeService = new StoreService(client);
      await storeService.execute(redeemLicense, subscription);
      // Discord grant roles (external)
      for (const role of redeemLicense.discordGrantRoles) {
        await assignRoleToUser(redeemLicense.discordId, role);
      }
    });

    return { redeemLicense, subscription };
  }
}

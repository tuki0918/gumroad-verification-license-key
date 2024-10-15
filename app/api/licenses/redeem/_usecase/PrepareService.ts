import { SubscriptionIsNotAliveError } from "@/app/_exceptions";
import { RedeemLicenseWithoutID } from "@/domains/RedeemLicense";
import { SubscriptionWithoutID } from "@/domains/Subscription";
import { GumroadGetSubscriptionService } from "@/domains/services/GumroadGetSubscriptionService";
import { GumroadVerifyRedeemLicenseService } from "@/domains/services/GumroadVerifyRedeemLicenseService";

export interface PrepareServiceInterface {
  execute(
    productId: string,
    licenseKey: string,
    discordId: string,
  ): Promise<{
    redeemLicense: RedeemLicenseWithoutID;
    subscription: SubscriptionWithoutID | null;
  }>;
}

export class PrepareService implements PrepareServiceInterface {
  constructor(
    private readonly gumroadVRLService: GumroadVerifyRedeemLicenseService,
    private readonly gumroadGSService: GumroadGetSubscriptionService,
  ) {}

  async execute(
    productId: string,
    licenseKey: string,
    discordId: string,
  ): Promise<{
    redeemLicense: RedeemLicenseWithoutID;
    subscription: SubscriptionWithoutID | null;
  }> {
    const redeemLicense = await this.gumroadVRLService.execute(
      productId,
      licenseKey,
      discordId,
    );

    // Return redeemLicense if subscriptionId is null
    if (redeemLicense.subscriptionId === null) {
      return { redeemLicense, subscription: null };
    }

    // Get subscription if exists
    const subscription: SubscriptionWithoutID =
      await this.gumroadGSService.execute(
        redeemLicense.subscriptionId,
        licenseKey,
      );

    if (!subscription.isAlive()) {
      const text = "Subscription is not alive";
      console.log(text);
      throw new SubscriptionIsNotAliveError(text);
    }

    return { redeemLicense, subscription };
  }
}

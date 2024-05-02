import {
  FailedToVerifyLicenseKeyError,
  InvalidLicenseKeyError,
  LicenseKeyDisabledError,
} from "@/app/_exceptions";
import { RedeemLicenseWithoutID } from "@/domains/RedeemLicense";
import { isLicenseKeyFormat, verifyLicense } from "@/libs/gumroad";

export interface GumroadVerifyRedeemLicenseServiceInterface {
  execute(
    productId: string,
    licenseKey: string,
    discordId: string,
  ): Promise<RedeemLicenseWithoutID>;
}

export class GumroadVerifyRedeemLicenseService
  implements GumroadVerifyRedeemLicenseServiceInterface
{
  async execute(
    productId: string,
    licenseKey: string,
    discordId: string,
  ): Promise<RedeemLicenseWithoutID> {
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
    );

    return redeemLicense;
  }
}

import {
  FailedToVerifyLicenseKeyError,
  InvalidLicenseKeyError,
  LicenseKeyDisabledError,
} from "@/app/_exceptions";
import { RedeemLicenseWithoutID } from "@/domains/RedeemLicense";
import * as gumroad from "@/libs/gumroad";
import { createMockPurchase } from "@/mocks/factories/gumroad";
import type { ApiVerifyLicenseResponse } from "@/types/gumroad";
import { GumroadVerifyRedeemLicenseService } from "./GumroadVerifyRedeemLicenseService";

describe("GumroadVerifyRedeemLicenseService", () => {
  describe("execute", () => {
    test("should fetch and redeem a license", async () => {
      const productId = "product-id";
      const licenseKey = "12345678-12345678-12345678-12345678";
      const discordId = "discord-id";
      const verifyLicenseData: ApiVerifyLicenseResponse = {
        success: true,
        uses: 1,
        purchase: createMockPurchase({
          custom_fields: {
            discord_grant_role: "role-id",
          },
        }),
      };

      const expectedRedeemLicense =
        RedeemLicenseWithoutID.createFromUnmarshalledPurchase(
          verifyLicenseData.purchase,
          discordId,
        );

      const verifyLicenseMock = vi
        .spyOn(gumroad, "verifyLicense")
        .mockResolvedValue(verifyLicenseData);

      const service = new GumroadVerifyRedeemLicenseService();
      const redeemLicense = await service.execute(
        productId,
        licenseKey,
        discordId,
      );

      expect(redeemLicense).toEqual(expectedRedeemLicense);
      expect(verifyLicenseMock).toHaveBeenCalledWith(productId, licenseKey);
    });

    test("should throw InvalidLicenseKeyError for invalid license key format", async () => {
      const productId = "product-id";
      const licenseKey = "invalid-license-key";
      const discordId = "discord-id";
      const verifyLicenseData: ApiVerifyLicenseResponse = {
        success: false,
        message: "",
      };

      const verifyLicenseMock = vi
        .spyOn(gumroad, "verifyLicense")
        .mockResolvedValue(verifyLicenseData);

      const service = new GumroadVerifyRedeemLicenseService();
      await expect(
        service.execute(productId, licenseKey, discordId),
      ).rejects.toThrow(InvalidLicenseKeyError);

      expect(verifyLicenseMock).not.toHaveBeenCalled();
    });

    test("should throw LicenseKeyDisabledError for disabled license key", async () => {
      const productId = "product-id";
      const licenseKey = "12345678-12345678-12345678-12345678";
      const discordId = "discord-id";
      const verifyLicenseData: ApiVerifyLicenseResponse = {
        success: false,
        message: "This license key has been disabled.",
      };

      const verifyLicenseMock = vi
        .spyOn(gumroad, "verifyLicense")
        .mockResolvedValue(verifyLicenseData);

      const service = new GumroadVerifyRedeemLicenseService();
      await expect(
        service.execute(productId, licenseKey, discordId),
      ).rejects.toThrow(LicenseKeyDisabledError);

      expect(verifyLicenseMock).toHaveBeenCalledWith(productId, licenseKey);
    });

    test("should throw FailedToVerifyLicenseKeyError for failed verification", async () => {
      const productId = "product-id";
      const licenseKey = "12345678-12345678-12345678-12345678";
      const discordId = "discord-id";
      const verifyLicenseData: ApiVerifyLicenseResponse = {
        success: false,
        message: "Invalid license key",
      };

      const verifyLicenseMock = vi
        .spyOn(gumroad, "verifyLicense")
        .mockResolvedValue(verifyLicenseData);

      const service = new GumroadVerifyRedeemLicenseService();
      await expect(
        service.execute(productId, licenseKey, discordId),
      ).rejects.toThrow(FailedToVerifyLicenseKeyError);

      expect(verifyLicenseMock).toHaveBeenCalledWith(productId, licenseKey);
    });
  });
});

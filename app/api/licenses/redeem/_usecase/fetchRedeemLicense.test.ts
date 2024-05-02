import {
  FailedToVerifyLicenseKeyError,
  InvalidLicenseKeyError,
  LicenseKeyDisabledError,
} from "@/app/api/_errors";
import { RedeemLicenseWithoutID } from "@/domains/RedeemLicense";
import { createMockPurchase } from "@/mocks/factories/gumroad";
import type {
  ApiResponseError,
  ApiVerifyLicenseResponse,
} from "@/types/gumroad";
import { fetchRedeemLicense } from "./fetchRedeemLicense";

describe("fetchRedeemLicense", () => {
  test("should fetch and redeem a license", async () => {
    const productId = "your-product-id";
    const licenseKey = "12345678-12345678-12345678-12345678";
    const discordId = "your-discord-id";
    const expectedResponse: ApiVerifyLicenseResponse = {
      success: true,
      uses: 1,
      purchase: createMockPurchase({
        custom_fields: {
          discord_grant_role: "your-role-id",
        },
      }),
    };

    const expectedRedeemLicense =
      RedeemLicenseWithoutID.createFromUnmarshalledPurchase(
        expectedResponse.purchase,
        discordId,
      );

    vi.spyOn(global, "fetch").mockImplementation(
      async () =>
        new Response(JSON.stringify(expectedResponse), { status: 200 }),
    );

    const redeemLicense = await fetchRedeemLicense(
      productId,
      licenseKey,
      discordId,
    );

    expect(redeemLicense).toEqual(expectedRedeemLicense);
    // TODO: verifyLicense should be called with productId and licenseKey
  });

  test("should throw InvalidLicenseKeyError for invalid license key format", async () => {
    const productId = "your-product-id";
    const licenseKey = "invalid-license-key";
    const discordId = "your-discord-id";

    const expectedResponse: ApiResponseError = {
      success: false,
      message: "",
    };

    vi.spyOn(global, "fetch").mockImplementation(
      async () =>
        new Response(JSON.stringify(expectedResponse), { status: 500 }),
    );

    vi.spyOn(console, "error").mockImplementationOnce(() => {});

    await expect(
      fetchRedeemLicense(productId, licenseKey, discordId),
    ).rejects.toThrow(InvalidLicenseKeyError);
  });

  test("should throw LicenseKeyDisabledError for disabled license key", async () => {
    const productId = "your-product-id";
    const licenseKey = "12345678-12345678-12345678-12345678";
    const discordId = "your-discord-id";

    const expectedResponse: ApiResponseError = {
      success: false,
      message: "This license key has been disabled.",
    };

    vi.spyOn(global, "fetch").mockImplementation(
      async () =>
        new Response(JSON.stringify(expectedResponse), { status: 500 }),
    );

    vi.spyOn(console, "error").mockImplementationOnce(() => {});

    await expect(
      fetchRedeemLicense(productId, licenseKey, discordId),
    ).rejects.toThrow(LicenseKeyDisabledError);
  });

  test("should throw FailedToVerifyLicenseKeyError for failed verification", async () => {
    const productId = "your-product-id";
    const licenseKey = "12345678-12345678-12345678-12345678";
    const discordId = "your-discord-id";

    const expectedResponse: ApiResponseError = {
      success: false,
      message: "Invalid license key",
    };

    vi.spyOn(global, "fetch").mockImplementation(
      async () =>
        new Response(JSON.stringify(expectedResponse), { status: 500 }),
    );

    vi.spyOn(console, "error").mockImplementationOnce(() => {});

    await expect(
      fetchRedeemLicense(productId, licenseKey, discordId),
    ).rejects.toThrow(FailedToVerifyLicenseKeyError);
  });
});

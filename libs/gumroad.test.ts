import {
  fetchSubscription,
  isLicenseKeyFormat,
  verifyLicense,
} from "@/libs/gumroad";
import {
  createMockPurchase,
  createMockSubscriber,
} from "@/mocks/factories/gumroad";
import type {
  ApiResponseError,
  ApiSubscriptionResponse,
  ApiVerifyLicenseResponse,
} from "@/types/gumroad";

describe("Date Utils", () => {
  describe("isLicenseKeyFormat", () => {
    test("should return true for valid license key format", () => {
      const validLicenseKey = "12345678-12345678-12345678-12345678";
      const result = isLicenseKeyFormat(validLicenseKey);
      expect(result).toBe(true);
    });

    test("should return false for invalid license key format", () => {
      const invalidLicenseKey = "invalid-key";
      const result = isLicenseKeyFormat(invalidLicenseKey);
      expect(result).toBe(false);
    });
  });

  describe("verifyLicense", () => {
    test("should return the API response for a valid license", async () => {
      const productId = "product-id";
      const licenseKey = "valid-license-key";
      const expectedResponse: ApiVerifyLicenseResponse = {
        success: true,
        uses: 1,
        purchase: createMockPurchase(),
      };

      vi.spyOn(global, "fetch").mockImplementation(
        async () =>
          new Response(JSON.stringify(expectedResponse), { status: 200 }),
      );

      const response = await verifyLicense(productId, licenseKey);
      expect(response).toEqual(expectedResponse);
    });

    test("should log an error for an invalid license", async () => {
      const productId = "product-id";
      const licenseKey = "invalid-license-key";
      const expectedResponse: ApiResponseError = {
        success: false,
        message: "Invalid license key",
      };

      vi.spyOn(global, "fetch").mockImplementation(
        async () =>
          new Response(JSON.stringify(expectedResponse), { status: 500 }),
      );

      vi.spyOn(console, "error").mockImplementationOnce(() => {});

      const response = await verifyLicense(productId, licenseKey);
      expect(response).toEqual(expectedResponse);
      expect(console.error).toHaveBeenCalledWith(expectedResponse);
    });
  });

  describe("fetchSubscription", () => {
    test("should return the API response for a valid subscription ID", async () => {
      const subscriptionId = "valid-subscription-id";
      const expectedResponse: ApiSubscriptionResponse = {
        success: true,
        subscriber: createMockSubscriber(),
      };

      vi.spyOn(global, "fetch").mockImplementation(
        async () =>
          new Response(JSON.stringify(expectedResponse), { status: 200 }),
      );

      const response = await fetchSubscription(subscriptionId);
      expect(response).toEqual(expectedResponse);
    });

    test("should log an error for an invalid subscription ID", async () => {
      const subscriptionId = "invalid-subscription-id";
      const expectedResponse: ApiResponseError = {
        success: false,
        message: "Invalid subscription ID",
      };

      vi.spyOn(global, "fetch").mockImplementation(
        async () =>
          new Response(JSON.stringify(expectedResponse), { status: 500 }),
      );

      vi.spyOn(console, "error").mockImplementationOnce(() => {});

      const response = await fetchSubscription(subscriptionId);
      expect(response).toEqual(expectedResponse);
      expect(console.error).toHaveBeenCalledWith(expectedResponse);
    });
  });
});

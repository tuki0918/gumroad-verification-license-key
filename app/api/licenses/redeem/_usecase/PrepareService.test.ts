import { SubscriptionIsNotAliveError } from "@/app/_exceptions";
import { RedeemLicenseWithoutID } from "@/domains/RedeemLicense";
import { SubscriptionWithoutID } from "@/domains/Subscription";
import { GumroadGetSubscriptionServiceInterface } from "@/domains/services/GumroadGetSubscriptionService";
import { GumroadVerifyRedeemLicenseServiceInterface } from "@/domains/services/GumroadVerifyRedeemLicenseService";
import {
  createMockPurchase,
  createMockSubscriber,
} from "@/mocks/factories/gumroad";
import { Mock } from "vitest";
import { PrepareService } from "./PrepareService";

describe("PrepareService", () => {
  let service: PrepareService;
  let gumroadVRLService: GumroadVerifyRedeemLicenseServiceInterface;
  let gumroadGSService: GumroadGetSubscriptionServiceInterface;

  beforeEach(() => {
    gumroadVRLService = {
      execute: vi.fn(),
    } as GumroadVerifyRedeemLicenseServiceInterface;
    gumroadGSService = {
      execute: vi.fn(),
    } as GumroadGetSubscriptionServiceInterface;
    service = new PrepareService(gumroadVRLService, gumroadGSService);
  });

  describe("execute", () => {
    it("should return redeemLicense and null subscription", async () => {
      const productId = "product-id";
      const licenseKey = "license-key";
      const discordId = "discord-id";
      const redeemLicense =
        RedeemLicenseWithoutID.createFromUnmarshalledPurchase(
          createMockPurchase({
            subscription_id: null,
          }),
          discordId,
        );
      (gumroadVRLService.execute as Mock).mockResolvedValue(redeemLicense);

      const result = await service.execute(productId, licenseKey, discordId);

      expect(result).toEqual({ redeemLicense, subscription: null });
      expect(gumroadVRLService.execute).toHaveBeenCalledWith(
        productId,
        licenseKey,
        discordId,
      );

      expect(gumroadGSService.execute).not.toHaveBeenCalled();
    });

    it("should return redeemLicense and subscription", async () => {
      const productId = "product-id";
      const licenseKey = "license-key";
      const discordId = "discord-id";
      const redeemLicense =
        RedeemLicenseWithoutID.createFromUnmarshalledPurchase(
          createMockPurchase({
            subscription_id: "subscription-id",
          }),
          discordId,
        );

      const subscription =
        SubscriptionWithoutID.createFromUnmarshalledSubscription({
          ...createMockSubscriber(),
          license_key: licenseKey,
        });
      (gumroadVRLService.execute as Mock).mockResolvedValue(redeemLicense);
      (gumroadGSService.execute as Mock).mockResolvedValue(subscription);

      const result = await service.execute(productId, licenseKey, discordId);

      expect(result).toEqual({ redeemLicense, subscription });
      expect(gumroadVRLService.execute).toHaveBeenCalledWith(
        productId,
        licenseKey,
        discordId,
      );
      expect(gumroadGSService.execute).toHaveBeenCalledWith(
        redeemLicense.subscriptionId,
        licenseKey,
      );
    });

    it("should throw SubscriptionIsNotAliveError", async () => {
      const productId = "product-id";
      const licenseKey = "license-key";
      const discordId = "discord-id";
      const redeemLicense =
        RedeemLicenseWithoutID.createFromUnmarshalledPurchase(
          createMockPurchase({
            subscription_id: "subscription-id",
          }),
          discordId,
        );

      const subscription =
        SubscriptionWithoutID.createFromUnmarshalledSubscription({
          ...createMockSubscriber({ status: "cancelled" }),
          license_key: licenseKey,
        });
      (gumroadVRLService.execute as Mock).mockResolvedValue(redeemLicense);
      (gumroadGSService.execute as Mock).mockResolvedValue(subscription);

      await expect(
        service.execute(productId, licenseKey, discordId),
      ).rejects.toThrow(SubscriptionIsNotAliveError);
    });
  });
});

import { FailedToFetchSubscriptionError } from "@/app/_exceptions";
import { SubscriptionWithoutID } from "@/domains/Subscription";
import * as gumroad from "@/libs/gumroad";
import { createMockSubscriber } from "@/mocks/factories/gumroad";
import type { ApiSubscriptionResponse } from "@/types/gumroad";
import { GumroadGetSubscriptionService } from "./GumroadGetSubscriptionService";

describe("GumroadGetSubscriptionService", () => {
  describe("execute", () => {
    test("should return a subscription", async () => {
      const licenseKey = "valid-license-key";
      const subscriptionId = "valid-subscription-id";
      const subscriptionData: ApiSubscriptionResponse = {
        success: true,
        subscriber: createMockSubscriber(),
      };
      const service = new GumroadGetSubscriptionService();
      const fetchSubscriptionMock = vi
        .spyOn(gumroad, "fetchSubscription")
        .mockResolvedValue(subscriptionData);

      const result = await service.execute(subscriptionId, licenseKey);

      expect(fetchSubscriptionMock).toHaveBeenCalledWith(subscriptionId);
      expect(result).toEqual(
        SubscriptionWithoutID.createFromUnmarshalledSubscription({
          ...subscriptionData.subscriber,
          license_key: licenseKey,
        }),
      );
    });

    test("should throw FailedToFetchSubscriptionError for failed fetch", async () => {
      const licenseKey = "invalid-license-key";
      const subscriptionId = "invalid-subscription-id";
      const subscriptionData: ApiSubscriptionResponse = {
        success: false,
        message: "Invalid subscription ID",
      };

      const service = new GumroadGetSubscriptionService();
      const fetchSubscriptionMock = vi
        .spyOn(gumroad, "fetchSubscription")
        .mockResolvedValue(subscriptionData);

      await expect(service.execute(subscriptionId, licenseKey)).rejects.toThrow(
        FailedToFetchSubscriptionError,
      );

      expect(fetchSubscriptionMock).toHaveBeenCalledWith(subscriptionId);
    });
  });
});

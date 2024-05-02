import { SubscriptionIsNotAliveError } from "@/app/_exceptions";
import { RedeemLicenseWithoutID } from "@/domains/RedeemLicense";
import { SubscriptionWithoutID } from "@/domains/Subscription";
import * as fetchSubscriptionX from "@/libs/gumroad";
import {
  createMockPurchase,
  createMockSubscriber,
} from "@/mocks/factories/gumroad";
import type { ApiSubscriptionResponse } from "@/types/gumroad";
import * as fetchRedeemLicenseX from "./fetchRedeemLicense";
import { prepare } from "./prepare";

describe("prepare", () => {
  test("should return redeemLicense and subscription", async () => {
    const productId = "product-id";
    const licenseKey = "valid-license-key";
    const discordId = "discord-id";

    const redeemLicense = RedeemLicenseWithoutID.createFromUnmarshalledPurchase(
      createMockPurchase(),
      discordId,
    );

    const subscriptionData: ApiSubscriptionResponse = {
      success: true,
      subscriber: createMockSubscriber(),
    };
    const fetchRedeemLicenseMock = vi
      .spyOn(fetchRedeemLicenseX, "fetchRedeemLicense")
      .mockResolvedValue(redeemLicense);
    const fetchSubscriptionMock = vi
      .spyOn(fetchSubscriptionX, "fetchSubscription")
      .mockResolvedValue(subscriptionData);

    const result = await prepare(productId, licenseKey, discordId);

    expect(fetchRedeemLicenseMock).toHaveBeenCalledWith(
      productId,
      licenseKey,
      discordId,
    );
    expect(fetchSubscriptionMock).toHaveBeenCalledWith(
      redeemLicense.subscriptionId,
    );
    expect(result.redeemLicense).toEqual(redeemLicense);
    expect(result.subscription).toEqual(
      SubscriptionWithoutID.createFromUnmarshalledSubscription(
        subscriptionData.subscriber,
      ),
    );
    expect(result.subscription?.isAlive()).toBe(true);
  });

  test("should throw SubscriptionIsNotAliveError if subscription is not alive", async () => {
    const productId = "product-id";
    const licenseKey = "valid-license-key";
    const discordId = "discord-id";

    const redeemLicense = RedeemLicenseWithoutID.createFromUnmarshalledPurchase(
      createMockPurchase(),
      discordId,
    );

    const subscriptionData: ApiSubscriptionResponse = {
      success: true,
      subscriber: createMockSubscriber({
        status: "cancelled",
      }),
    };
    const fetchRedeemLicenseMock = vi
      .spyOn(fetchRedeemLicenseX, "fetchRedeemLicense")
      .mockResolvedValue(redeemLicense);
    const fetchSubscriptionMock = vi
      .spyOn(fetchSubscriptionX, "fetchSubscription")
      .mockResolvedValue(subscriptionData);

    await expect(
      prepare(productId, licenseKey, discordId),
    ).rejects.toThrowError(SubscriptionIsNotAliveError);
  });
});

import { SubscriptionIsNotAliveError } from "@/app/api/_errors";
import { RedeemLicenseWithoutID } from "@/domains/RedeemLicense";
import { SubscriptionWithoutID } from "@/domains/Subscription";
import { fetchSubscription } from "@/libs/gumroad";
import { fetchRedeemLicense } from "./fetchRedeemLicense";

export const prepare = async (
  productId: string,
  licenseKey: string,
  discordId: string,
): Promise<{
  redeemLicense: RedeemLicenseWithoutID;
  subscription: SubscriptionWithoutID | null;
}> => {
  const redeemLicense = await fetchRedeemLicense(
    productId,
    licenseKey,
    discordId,
  );

  let subscription: SubscriptionWithoutID | null = null;
  // Create subscription if exists
  if (redeemLicense.subscriptionId !== null) {
    const subscriptionId = redeemLicense.subscriptionId;
    const subscriptionData = await fetchSubscription(subscriptionId);
    if (subscriptionData.success === false) {
      console.error(subscriptionData.message);
      throw new Error("Failed to fetch subscription data:" + subscriptionId);
    }
    // Create subscription
    subscription = SubscriptionWithoutID.createFromUnmarshalledSubscription(
      subscriptionData.subscriber,
    );
  }

  if (!subscription?.isAlive()) {
    const text = "Subscription is not alive";
    console.log(text);
    throw new SubscriptionIsNotAliveError(text);
  }

  return { redeemLicense, subscription };
};

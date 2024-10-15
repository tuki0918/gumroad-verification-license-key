import { FailedToFetchSubscriptionError } from "@/app/_exceptions";
import { SubscriptionWithoutID } from "@/domains/Subscription";
import { fetchSubscription } from "@/libs/gumroad";

export interface GumroadGetSubscriptionServiceInterface {
  execute(
    subscriptionId: string,
    licenseKey: string,
  ): Promise<SubscriptionWithoutID>;
}

export class GumroadGetSubscriptionService
  implements GumroadGetSubscriptionServiceInterface
{
  async execute(
    subscriptionId: string,
    licenseKey: string,
  ): Promise<SubscriptionWithoutID> {
    const subscriptionData = await fetchSubscription(subscriptionId);
    if (subscriptionData.success === false) {
      console.error(subscriptionData.message);
      throw new FailedToFetchSubscriptionError(
        "Failed to fetch subscription data:" + subscriptionId,
      );
    }

    // case: License key is undefined
    if (!subscriptionData.subscriber.license_key) {
      console.info("License key is undefined:", subscriptionId);
    }

    const subscription =
      SubscriptionWithoutID.createFromUnmarshalledSubscription(
        // HOTFIX: license_key is not included in this response in some cases
        { ...subscriptionData.subscriber, license_key: licenseKey },
      );
    return subscription;
  }
}

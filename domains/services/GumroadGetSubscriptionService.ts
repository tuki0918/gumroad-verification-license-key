import { FailedToFetchSubscriptionError } from "@/app/_exceptions";
import { SubscriptionWithoutID } from "@/domains/Subscription";
import { fetchSubscription } from "@/libs/gumroad";

export interface GumroadGetSubscriptionServiceInterface {
  execute(subscriptionId: string): Promise<SubscriptionWithoutID>;
}

export class GumroadGetSubscriptionService
  implements GumroadGetSubscriptionServiceInterface
{
  async execute(subscriptionId: string): Promise<SubscriptionWithoutID> {
    const subscriptionData = await fetchSubscription(subscriptionId);
    if (subscriptionData.success === false) {
      console.error(subscriptionData.message);
      throw new FailedToFetchSubscriptionError(
        "Failed to fetch subscription data:" + subscriptionId,
      );
    }

    const subscription =
      SubscriptionWithoutID.createFromUnmarshalledSubscription(
        subscriptionData.subscriber,
      );
    return subscription;
  }
}

type UnmarshalledCard = {
  visual: null;
  type: null;
  bin: null;
  expiry_month: null;
  expiry_year: null;
};

export type UnmarshalledPurchase = {
  seller_id: string;
  product_id: string;
  product_name: string;
  permalink: string;
  product_permalink: string;
  short_product_id: string;
  /** @deprecated WARNING */
  email: string;
  price: number;
  gumroad_fee: number;
  currency: string;
  quantity: number;
  discover_fee_charged: boolean;
  can_contact: boolean;
  referrer: string;
  /** @deprecated WARNING */
  card: UnmarshalledCard;
  order_number: number;
  sale_id: string;
  sale_timestamp: string;
  purchaser_id: string;
  /** @deprecated null value unconfirmed */
  subscription_id: string | null;
  variants: string;
  license_key: string;
  is_multiseat_license: boolean;
  ip_country: string;
  recurrence: string;
  is_gift_receiver_purchase: boolean;
  refunded: boolean;
  disputed: boolean;
  dispute_won: boolean;
  id: string;
  created_at: string;
  custom_fields: {
    discord_grant_role?: string;
  };
  subscription_ended_at: string | null;
  subscription_cancelled_at: string | null;
  subscription_failed_at: string | null;
};

type UnmarshalledSubscriberStatus =
  | "alive"
  | "pending_cancellation"
  | "pending_failure"
  | "failed_payment"
  | "fixed_subscription_period_ended"
  | "cancelled";

export type UnmarshalledSubscriber = {
  id: string;
  product_id: string;
  product_name: string;
  user_id: string;
  /** @deprecated WARNING */
  user_email: string;
  purchase_ids: string[];
  created_at: string;
  user_requested_cancellation_at: string | null;
  charge_occurrence_count: number | null;
  recurrence: string;
  cancelled_at: string | null;
  ended_at: string | null;
  failed_at: string | null;
  free_trial_ends_at: string | null;
  license_key?: string;
  status: UnmarshalledSubscriberStatus;
};

type ApiResponseSuccess<T> = T & {
  success: true;
};

type ApiResponseError = {
  success: false;
  message: string;
};

type ApiResponse<T> = ApiResponseSuccess<T> | ApiResponseError;

export type ApiVerifyLicenseResponse = ApiResponse<{
  uses: number;
  purchase: UnmarshalledPurchase;
}>;

export type ApiSubscriptionResponse = ApiResponse<{
  subscriber: UnmarshalledSubscriber;
}>;

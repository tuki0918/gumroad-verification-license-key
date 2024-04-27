import { UnmarshalledPurchase, UnmarshalledSubscriber } from "@/types/gumroad";

const defaultPurchase: UnmarshalledPurchase = {
  seller_id: "test_seller_id",
  product_id: "test_product_id",
  product_name: "test_product_name",
  permalink: "test_permalink",
  product_permalink: "test_product_permalink",
  short_product_id: "test_short_product_id",
  email: "test_email",
  price: 1,
  gumroad_fee: 1,
  currency: "test_currency",
  quantity: 1,
  discover_fee_charged: true,
  can_contact: true,
  referrer: "test_referrer",
  card: {
    visual: null,
    type: null,
    bin: null,
    expiry_month: null,
    expiry_year: null,
  },
  order_number: 1,
  sale_id: "test_sale_id",
  sale_timestamp: "2020-01-01T00:00:00Z",
  purchaser_id: "test_purchaser_id",
  subscription_id: "test_subscription_id",
  variants: "test_variants",
  license_key: "test_license_key",
  is_multiseat_license: true,
  ip_country: "test_ip_country",
  recurrence: "test_recurrence",
  is_gift_receiver_purchase: true,
  refunded: true,
  disputed: true,
  dispute_won: true,
  id: "test_id",
  created_at: "test_created_at",
  custom_fields: {
    discord_grant_role: "test_discord_grant_role",
  },
  subscription_ended_at: null,
  subscription_cancelled_at: null,
  subscription_failed_at: null,
};

const defaultSubscriber: UnmarshalledSubscriber = {
  id: "test_id",
  product_id: "test_product_id",
  product_name: "test_product_name",
  user_id: "test_user_id",
  user_email: "test_user_email",
  purchase_ids: ["test_purchase_id"],
  created_at: "2020-01-01T00:00:00Z",
  user_requested_cancellation_at: null,
  charge_occurrence_count: null,
  recurrence: "test_recurrence",
  cancelled_at: null,
  ended_at: null,
  failed_at: null,
  free_trial_ends_at: null,
  license_key: "test_license_key",
  status: "alive",
};

export const createMockPurchase = (
  overwrites: Partial<UnmarshalledPurchase> = {},
) => ({
  ...defaultPurchase,
  ...overwrites,
});

export const createMockSubscriber = (
  overwrites: Partial<UnmarshalledSubscriber> = {},
) => ({
  ...defaultSubscriber,
  ...overwrites,
});

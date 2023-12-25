type Card = {
  visual: null;
  type: null;
  bin: null;
  expiry_month: null;
  expiry_year: null;
};

type Purchase = {
  seller_id: string;
  product_id: string;
  product_name: string;
  permalink: string;
  product_permalink: string;
  short_product_id: string;
  email: string;
  price: number;
  gumroad_fee: number;
  currency: string;
  quantity: number;
  discover_fee_charged: boolean;
  can_contact: boolean;
  referrer: string;
  card: Card;
  order_number: number;
  sale_id: string;
  sale_timestamp: string;
  purchaser_id: string;
  subscription_id: string;
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
  custom_fields: any[];
  subscription_ended_at: string | null;
  subscription_cancelled_at: string | null;
  subscription_failed_at: string | null;
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
  purchase: Purchase;
}>;

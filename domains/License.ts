import { formatJSTDay } from "utils/date";
import { z } from "zod";

const LicenseSchema = z.object({
  id: z.number(),
  key: z.string().max(255),
  order_number: z.string(),
  purchased_at: z.date(),
  product_id: z.string(),
  product_name: z.string(),
  product_permalink: z.string(),
  variants: z.string().nullable(),
  price: z.number(),
  quantity: z.number(),
  currency: z.string().toUpperCase(),
  recurrence: z.string(),
  refunded: z.boolean(),
  subscription_ended_at: z.date().nullable(),
  subscription_cancelled_at: z.date().nullable(),
  subscription_failed_at: z.date().nullable(),
});

const LicenseStatusSchema = z.union([
  z.literal("Active"),
  z.literal("Canceled"),
  z.literal("Failed"),
  z.literal("Ended"),
]);

type LicenseType = z.infer<typeof LicenseSchema>;
type LicenseStatusType = z.infer<typeof LicenseStatusSchema>;

export class License {
  #id: number;
  #key: string;
  #order_number: string;
  #purchased_at: Date;
  #product_id: string;
  #product_name: string;
  #product_permalink: string;
  #variants: string | null;
  #price: number;
  #quantity: number;
  #currency: string;
  #recurrence: string;
  #refunded: boolean;
  #subscription_ended_at: Date | null;
  #subscription_cancelled_at: Date | null;
  #subscription_failed_at: Date | null;

  private constructor(data: LicenseType) {
    this.#id = data.id;
    this.#key = data.key;
    this.#order_number = data.order_number;
    this.#purchased_at = data.purchased_at;
    this.#product_id = data.product_id;
    this.#product_name = data.product_name;
    this.#product_permalink = data.product_permalink;
    this.#variants = data.variants;
    this.#price = data.price;
    this.#quantity = data.quantity;
    this.#currency = data.currency;
    this.#recurrence = data.recurrence;
    this.#refunded = data.refunded;
    this.#subscription_ended_at = data.subscription_ended_at;
    this.#subscription_cancelled_at = data.subscription_cancelled_at;
    this.#subscription_failed_at = data.subscription_failed_at;
  }

  static create(data: LicenseType): License {
    const validatedData = LicenseSchema.parse(data);
    return new License(validatedData);
  }

  get id() {
    return this.#id;
  }

  get key() {
    return this.#key;
  }

  get order_number() {
    return this.#order_number;
  }

  get purchased_at() {
    return this.#purchased_at;
  }

  get product_id() {
    return this.#product_id;
  }

  get product_name() {
    return this.#product_name;
  }

  get product_permalink() {
    return this.#product_permalink;
  }

  get variants() {
    return this.#variants;
  }

  get price() {
    return this.#price;
  }

  get quantity() {
    return this.#quantity;
  }

  get currency() {
    return this.#currency;
  }

  get recurrence() {
    return this.#recurrence;
  }

  get refunded() {
    return this.#refunded;
  }

  get subscription_ended_at() {
    return this.#subscription_ended_at;
  }

  get subscription_cancelled_at() {
    return this.#subscription_cancelled_at;
  }

  get subscription_failed_at() {
    return this.#subscription_failed_at;
  }

  recurrence_day(): number {
    return Number(formatJSTDay(this.#purchased_at));
  }

  status(now: Date = new Date()): LicenseStatusType {
    if (
      this.#subscription_cancelled_at &&
      this.#subscription_cancelled_at < now
    ) {
      return "Canceled";
    }
    if (this.#subscription_failed_at && this.#subscription_failed_at < now) {
      return "Failed";
    }
    if (this.#subscription_ended_at && this.#subscription_ended_at < now) {
      return "Ended";
    }
    return "Active";
  }

  // toObject(): XXX {
  //   return {
  //     id: this.#id,
  //   };
  // }
}

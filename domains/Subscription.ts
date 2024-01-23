import type { Subscriber } from "@/types/gumroad";
import { parseToUTCDate } from "@/utils/date";
import { Prisma } from "@prisma/client";
import { formatJSTDay } from "utils/date";
import { z } from "zod";

const SubscriptionStatusSchema = z.union([
  z.literal("alive"),
  z.literal("pending_cancellation"),
  z.literal("pending_failure"),
  z.literal("failed_payment"),
  z.literal("fixed_subscription_period_ended"),
  z.literal("cancelled"),
]);

const SubscriptionSchema = z.object({
  id: z.number(),
  subscription_id: z.string(),
  product_id: z.string(),
  product_name: z.string(),
  // user_id: z.string(),
  // purchase_ids: z.array(z.string()),
  started_at: z.date(),
  user_requested_cancellation_at: z.date().nullable(),
  charge_occurrence_count: z.number().nullable(),
  recurrence: z.string().toUpperCase(),
  cancelled_at: z.date().nullable(),
  ended_at: z.date().nullable(),
  failed_at: z.date().nullable(),
  free_trial_ends_at: z.date().nullable(),
  license_key: z.string(),
  status: SubscriptionStatusSchema,
});

const SubscriptionWithoutIDSchema = SubscriptionSchema.omit({ id: true });

type SubscriptionWithoutIDType = z.infer<typeof SubscriptionWithoutIDSchema>;
type SubscriptionType = z.infer<typeof SubscriptionSchema>;
export type SubscriptionStatusType = z.infer<typeof SubscriptionStatusSchema>;

export class SubscriptionWithoutID {
  readonly subscriptionId: string;
  readonly productId: string;
  readonly productName: string;
  // readonly userId: string;
  // readonly purchaseIds: string[];
  readonly startedAt: Date;
  readonly userRequestedCancellationAt: Date | null;
  readonly chargeOccurrenceCount: number | null;
  readonly recurrence: string;
  readonly cancelledAt: Date | null;
  readonly endedAt: Date | null;
  readonly failedAt: Date | null;
  readonly freeTrialEndsAt: Date | null;
  readonly licenseKey: string;
  readonly status: SubscriptionStatusType;

  protected constructor(data: SubscriptionWithoutIDType) {
    this.subscriptionId = data.subscription_id;
    this.productId = data.product_id;
    this.productName = data.product_name;
    // this.userId = data.user_id;
    // this.purchaseIds = data.purchase_ids;
    this.startedAt = data.started_at;
    this.userRequestedCancellationAt = data.user_requested_cancellation_at;
    this.chargeOccurrenceCount = data.charge_occurrence_count;
    this.recurrence = data.recurrence;
    this.cancelledAt = data.cancelled_at;
    this.endedAt = data.ended_at;
    this.failedAt = data.failed_at;
    this.freeTrialEndsAt = data.free_trial_ends_at;
    this.licenseKey = data.license_key;
    this.status = data.status;
  }

  static create(data: SubscriptionWithoutIDType): SubscriptionWithoutID {
    const validatedData = SubscriptionWithoutIDSchema.parse(data);
    return new SubscriptionWithoutID(validatedData);
  }

  static reconstruct(data: SubscriptionWithoutIDType): SubscriptionWithoutID {
    return SubscriptionWithoutID.create(data);
  }

  static createFromSubscriptionResponse(
    data: Subscriber,
  ): SubscriptionWithoutID {
    return SubscriptionWithoutID.create({
      subscription_id: data.id,
      product_id: data.product_id,
      product_name: data.product_name,
      // user_id: data.user_id,
      // purchase_ids: data.purchase_ids,
      started_at: parseToUTCDate(data.created_at),
      user_requested_cancellation_at:
        data.user_requested_cancellation_at === null
          ? null
          : parseToUTCDate(data.user_requested_cancellation_at),
      charge_occurrence_count: data.charge_occurrence_count,
      recurrence: data.recurrence,
      cancelled_at:
        data.cancelled_at === null ? null : parseToUTCDate(data.cancelled_at),
      ended_at: data.ended_at === null ? null : parseToUTCDate(data.ended_at),
      failed_at:
        data.failed_at === null ? null : parseToUTCDate(data.failed_at),
      free_trial_ends_at:
        data.free_trial_ends_at === null
          ? null
          : parseToUTCDate(data.free_trial_ends_at),
      license_key: data.license_key,
      status: data.status,
    });
  }

  isAlive(): boolean {
    return (
      this.status === "alive" ||
      this.status === "pending_cancellation" ||
      this.status === "pending_failure"
    );
  }

  recurrenceSortWord(): string {
    return this.recurrence.substring(0, 1);
  }

  recurrenceDay(): number {
    return Number(formatJSTDay(this.startedAt));
  }

  toDB(): Prisma.SubscriptionUncheckedCreateInput {
    return {
      subscription_id: this.subscriptionId,
      product_id: this.productId,
      product_name: this.productName,
      // user_id: this.userId,
      // purchase_ids: this.purchaseIds,
      started_at: this.startedAt,
      recurrence: this.recurrence,
      license_key: this.licenseKey,
      user_requested_cancellation_at: this.userRequestedCancellationAt,
      charge_occurrence_count: this.chargeOccurrenceCount,
      cancelled_at: this.cancelledAt,
      ended_at: this.endedAt,
      failed_at: this.failedAt,
      free_trial_ends_at: this.freeTrialEndsAt,
      status: this.status,
    };
  }
}

export class Subscription extends SubscriptionWithoutID {
  readonly id: number;

  private constructor(data: SubscriptionType) {
    super(data);
    this.id = data.id;
  }

  static create(data: SubscriptionType): Subscription {
    const validatedData = SubscriptionSchema.parse(data);
    return new Subscription(validatedData);
  }

  static reconstruct(data: SubscriptionType): Subscription {
    return Subscription.create(data);
  }
}

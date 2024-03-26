import type { UnmarshalledSubscriber } from "@/types/gumroad";
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
  recurrence: z.string(),
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
  private readonly _subscriptionId: string;
  private _productId: string;
  private _productName: string;
  // private _userId: string;
  // private _purchaseIds: string[];
  private _startedAt: Date;
  private _userRequestedCancellationAt: Date | null;
  private _chargeOccurrenceCount: number | null;
  private _recurrence: string;
  private _cancelledAt: Date | null;
  private _endedAt: Date | null;
  private _failedAt: Date | null;
  private _freeTrialEndsAt: Date | null;
  private _licenseKey: string;
  private _status: SubscriptionStatusType;

  protected constructor(data: SubscriptionWithoutIDType) {
    this._subscriptionId = data.subscription_id;
    this._productId = data.product_id;
    this._productName = data.product_name;
    // this._userId = data.user_id;
    // this._purchaseIds = data.purchase_ids;
    this._startedAt = data.started_at;
    this._userRequestedCancellationAt = data.user_requested_cancellation_at;
    this._chargeOccurrenceCount = data.charge_occurrence_count;
    this._recurrence = data.recurrence;
    this._cancelledAt = data.cancelled_at;
    this._endedAt = data.ended_at;
    this._failedAt = data.failed_at;
    this._freeTrialEndsAt = data.free_trial_ends_at;
    this._licenseKey = data.license_key;
    this._status = data.status;
  }

  static create(data: SubscriptionWithoutIDType): SubscriptionWithoutID {
    const validatedData = SubscriptionWithoutIDSchema.parse(data);
    return new SubscriptionWithoutID(validatedData);
  }

  static reconstruct(data: SubscriptionWithoutIDType): SubscriptionWithoutID {
    return SubscriptionWithoutID.create(data);
  }

  static createFromUnmarshalledSubscription(
    data: UnmarshalledSubscriber,
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

  get subscriptionId(): string {
    return this._subscriptionId;
  }

  get productId(): string {
    return this._productId;
  }

  get productName(): string {
    return this._productName;
  }

  get startedAt(): Date {
    return this._startedAt;
  }

  get userRequestedCancellationAt(): Date | null {
    return this._userRequestedCancellationAt;
  }

  get chargeOccurrenceCount(): number | null {
    return this._chargeOccurrenceCount;
  }

  get recurrence(): string {
    return this._recurrence;
  }

  get cancelledAt(): Date | null {
    return this._cancelledAt;
  }

  get endedAt(): Date | null {
    return this._endedAt;
  }

  get failedAt(): Date | null {
    return this._failedAt;
  }

  get freeTrialEndsAt(): Date | null {
    return this._freeTrialEndsAt;
  }

  get licenseKey(): string {
    return this._licenseKey;
  }

  get status(): SubscriptionStatusType {
    return this._status;
  }

  isAlive(): boolean {
    return (
      this._status === "alive" ||
      this._status === "pending_cancellation" ||
      this._status === "pending_failure"
    );
  }

  recurrenceSortWord(): string {
    return this._recurrence.toUpperCase().substring(0, 1);
  }

  recurrenceDay(): number {
    return Number(formatJSTDay(this._startedAt));
  }

  toDB(): Prisma.SubscriptionUncheckedCreateInput {
    return {
      subscription_id: this._subscriptionId,
      product_id: this._productId,
      product_name: this._productName,
      // user_id: this._userId,
      // purchase_ids: this._purchaseIds,
      started_at: this._startedAt,
      recurrence: this._recurrence,
      license_key: this._licenseKey,
      user_requested_cancellation_at: this._userRequestedCancellationAt,
      charge_occurrence_count: this._chargeOccurrenceCount,
      cancelled_at: this._cancelledAt,
      ended_at: this._endedAt,
      failed_at: this._failedAt,
      free_trial_ends_at: this._freeTrialEndsAt,
      status: this._status,
    };
  }
}

export class Subscription extends SubscriptionWithoutID {
  private readonly _id: number;

  private constructor(data: SubscriptionType) {
    super(data);
    this._id = data.id;
  }

  static create(data: SubscriptionType): Subscription {
    const validatedData = SubscriptionSchema.parse(data);
    return new Subscription(validatedData);
  }

  static reconstruct(data: SubscriptionType): Subscription {
    return Subscription.create(data);
  }

  get id(): number {
    return this._id;
  }

  isEqual(other: Subscription): boolean {
    return this._id === other.id;
  }
}

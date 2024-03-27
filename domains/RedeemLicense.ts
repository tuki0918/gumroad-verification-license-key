import type { UnmarshalledPurchase } from "@/types/gumroad";
import { parseToUTCDate } from "@/utils/date";
import { Prisma } from "@prisma/client";
import { z } from "zod";

const RedeemLicenseStatusSchema = z.union([
  z.literal("enable"),
  z.literal("disabled"),
]);

const RedeemLicenseSchema = z.object({
  id: z.number(),
  code: z.string(),
  purchased_at: z.date(),
  product_id: z.string(),
  product_name: z.string(),
  product_permalink: z.string(),
  variants: z.string().nullable(),
  price: z.number(),
  quantity: z.number(),
  currency: z.string().toUpperCase(),
  recurrence: z.string(),
  status: RedeemLicenseStatusSchema,
  discord_id: z.string(),
  discord_grant_roles: z.array(z.string()),
  subscription_id: z.string().nullable(),
});

const RedeemLicenseWithoutIDSchema = RedeemLicenseSchema.omit({ id: true });

type RedeemLicenseWithoutIDType = z.infer<typeof RedeemLicenseWithoutIDSchema>;
type RedeemLicenseType = z.infer<typeof RedeemLicenseSchema>;
type RedeemLicenseStatusType = z.infer<typeof RedeemLicenseStatusSchema>;

export class RedeemLicenseWithoutID {
  private readonly _code: string;
  private _purchasedAt: Date;
  private _productId: string;
  private _productName: string;
  private _productPermalink: string;
  private _variants: string | null;
  private _price: number;
  private _quantity: number;
  private _currency: string;
  private _recurrence: string;
  private _status: RedeemLicenseStatusType;
  private readonly _discordId: string;
  private _discordGrantRoles: string[];
  private readonly _subscriptionId: string | null;

  protected constructor(data: RedeemLicenseWithoutIDType) {
    this._code = data.code;
    this._purchasedAt = data.purchased_at;
    this._productId = data.product_id;
    this._productName = data.product_name;
    this._productPermalink = data.product_permalink;
    this._variants = data.variants;
    this._price = data.price;
    this._quantity = data.quantity;
    this._currency = data.currency;
    this._recurrence = data.recurrence;
    this._status = data.status;
    this._discordId = data.discord_id;
    this._discordGrantRoles = [...new Set(data.discord_grant_roles)];
    this._subscriptionId = data.subscription_id;
  }

  static create(data: RedeemLicenseWithoutIDType): RedeemLicenseWithoutID {
    const validatedData = RedeemLicenseWithoutIDSchema.parse(data);
    return new RedeemLicenseWithoutID(validatedData);
  }

  static reconstruct(data: RedeemLicenseWithoutIDType): RedeemLicenseWithoutID {
    return RedeemLicenseWithoutID.create(data);
  }

  static createFromUnmarshalledPurchase(
    data: UnmarshalledPurchase,
    discordId: string,
    discordGrantRoles: string[],
    status: RedeemLicenseStatusType = "enable",
  ): RedeemLicenseWithoutID {
    return RedeemLicenseWithoutID.create({
      code: data.license_key,
      purchased_at: parseToUTCDate(data.sale_timestamp),
      product_id: data.product_id,
      product_name: data.product_name,
      product_permalink: data.product_permalink,
      variants: data.variants,
      price: data.price,
      quantity: data.quantity,
      currency: data.currency,
      recurrence: data.recurrence,
      status,
      discord_id: discordId,
      discord_grant_roles: discordGrantRoles,
      subscription_id: data.subscription_id,
    });
  }

  get code(): string {
    return this._code;
  }

  get purchasedAt(): Date {
    return this._purchasedAt;
  }

  get productId(): string {
    return this._productId;
  }

  get productName(): string {
    return this._productName;
  }

  get productPermalink(): string {
    return this._productPermalink;
  }

  get variants(): string | null {
    return this._variants;
  }

  get price(): number {
    return this._price;
  }

  get quantity(): number {
    return this._quantity;
  }

  get currency(): string {
    return this._currency;
  }

  get recurrence(): string {
    return this._recurrence;
  }

  get status(): RedeemLicenseStatusType {
    return this._status;
  }

  get discordId(): string {
    return this._discordId;
  }

  get discordGrantRoles(): string[] {
    return this._discordGrantRoles;
  }

  get subscriptionId(): string | null {
    return this._subscriptionId;
  }

  isEnable(): boolean {
    return this._status === "enable";
  }

  addDiscordGrantRole(role: string): void {
    this._discordGrantRoles.push(role);
  }

  toDB(): Prisma.RedeemLicenseUncheckedCreateInput {
    return {
      code: this._code,
      purchased_at: this._purchasedAt,
      product_id: this._productId,
      product_name: this._productName,
      product_permalink: this._productPermalink,
      variants: this._variants,
      price: this._price,
      quantity: this._quantity,
      currency: this._currency,
      recurrence: this._recurrence,
      status: this._status,
      discord_id: this._discordId,
      discord_grant_roles: this._discordGrantRoles,
      subscription_id: this._subscriptionId,
    };
  }
}

export class RedeemLicense extends RedeemLicenseWithoutID {
  private readonly _id: number;

  private constructor(data: RedeemLicenseType) {
    super(data);
    this._id = data.id;
  }

  static create(data: RedeemLicenseType): RedeemLicense {
    const validatedData = RedeemLicenseSchema.parse(data);
    return new RedeemLicense(validatedData);
  }

  static reconstruct(data: RedeemLicenseType): RedeemLicense {
    return RedeemLicense.create(data);
  }

  get id(): number {
    return this._id;
  }

  isEqual(other: RedeemLicense): boolean {
    return this._id === other.id;
  }
}

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
  readonly code: string;
  readonly purchasedAt: Date;
  readonly productId: string;
  readonly productName: string;
  readonly productPermalink: string;
  readonly variants: string | null;
  readonly price: number;
  readonly quantity: number;
  readonly currency: string;
  readonly recurrence: string;
  readonly status: RedeemLicenseStatusType;
  readonly discordId: string;
  readonly discordGrantRoles: string[];
  readonly subscriptionId: string | null;

  protected constructor(data: RedeemLicenseWithoutIDType) {
    this.code = data.code;
    this.purchasedAt = data.purchased_at;
    this.productId = data.product_id;
    this.productName = data.product_name;
    this.productPermalink = data.product_permalink;
    this.variants = data.variants;
    this.price = data.price;
    this.quantity = data.quantity;
    this.currency = data.currency;
    this.recurrence = data.recurrence;
    this.status = data.status;
    this.discordId = data.discord_id;
    this.discordGrantRoles = [...new Set(data.discord_grant_roles)];
    this.subscriptionId = data.subscription_id;
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

  isEnable(): boolean {
    return this.status === "enable";
  }

  toDB(): Prisma.RedeemLicenseUncheckedCreateInput {
    return {
      code: this.code,
      purchased_at: this.purchasedAt,
      product_id: this.productId,
      product_name: this.productName,
      product_permalink: this.productPermalink,
      variants: this.variants,
      price: this.price,
      quantity: this.quantity,
      currency: this.currency,
      recurrence: this.recurrence,
      status: this.status,
      discord_id: this.discordId,
      discord_grant_roles: this.discordGrantRoles,
      subscription_id: this.subscriptionId,
    };
  }
}

export class RedeemLicense extends RedeemLicenseWithoutID {
  readonly id: number;

  private constructor(data: RedeemLicenseType) {
    super(data);
    this.id = data.id;
  }

  static create(data: RedeemLicenseType): RedeemLicense {
    const validatedData = RedeemLicenseSchema.parse(data);
    return new RedeemLicense(validatedData);
  }

  static reconstruct(data: RedeemLicenseType): RedeemLicense {
    return RedeemLicense.create(data);
  }
}

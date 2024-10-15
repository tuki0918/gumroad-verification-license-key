import { RedeemLicenseWithoutID } from "@/domains/RedeemLicense";
import { SubscriptionWithoutID } from "@/domains/Subscription";
import {
  createMockPurchase,
  createMockSubscriber,
} from "@/mocks/factories/gumroad";
import { PrismaClient } from "@prisma/client";
import { Mock } from "vitest";
import { StoreService, StoreServiceInterface } from "./StoreService";
describe("StoreService", () => {
  let service: StoreServiceInterface;
  let db: PrismaClient;

  beforeEach(() => {
    db = {
      redeemLicense: {
        findFirst: vi.fn(),
        update: vi.fn(),
        create: vi.fn(),
      },
      subscription: {
        findFirst: vi.fn(),
        update: vi.fn(),
        create: vi.fn(),
      },
    } as any;
    service = new StoreService(db);
  });

  describe("execute", () => {
    it("should create license", async () => {
      const redeemLicense =
        RedeemLicenseWithoutID.createFromUnmarshalledPurchase(
          createMockPurchase(),
          "discord-id",
        );
      const subscription: SubscriptionWithoutID | null = null;

      (db.redeemLicense.findFirst as Mock).mockResolvedValue(null);
      (db.subscription.findFirst as Mock).mockResolvedValue(null);

      await service.execute(redeemLicense, subscription);

      expect(db.redeemLicense.findFirst).toHaveBeenCalledWith({
        where: {
          code: redeemLicense.code,
          discord_id: redeemLicense.discordId,
        },
      });
      expect(db.subscription.findFirst).not.toHaveBeenCalled();
      expect(db.subscription.update).not.toHaveBeenCalled();
      expect(db.subscription.create).not.toHaveBeenCalled();
      expect(db.redeemLicense.update).not.toHaveBeenCalled();
      expect(db.redeemLicense.create).toHaveBeenCalledWith({
        data: redeemLicense.toDB(),
      });
    });

    it("should create license and subscription", async () => {
      const redeemLicense =
        RedeemLicenseWithoutID.createFromUnmarshalledPurchase(
          createMockPurchase(),
          "discord-id",
        );
      const subscription =
        SubscriptionWithoutID.createFromUnmarshalledSubscription({
          ...createMockSubscriber(),
          license_key: "license-key",
        });

      (db.redeemLicense.findFirst as Mock).mockResolvedValue(null);
      (db.subscription.findFirst as Mock).mockResolvedValue(null);

      await service.execute(redeemLicense, subscription);

      expect(db.redeemLicense.findFirst).toHaveBeenCalledWith({
        where: {
          code: redeemLicense.code,
          discord_id: redeemLicense.discordId,
        },
      });
      expect(db.subscription.findFirst).toHaveBeenCalledWith({
        where: { subscription_id: subscription.subscriptionId },
      });
      expect(db.subscription.update).not.toHaveBeenCalled();
      expect(db.subscription.create).toHaveBeenCalledWith({
        data: subscription.toDB(),
      });
      expect(db.redeemLicense.update).not.toHaveBeenCalled();
      expect(db.redeemLicense.create).toHaveBeenCalledWith({
        data: redeemLicense.toDB(),
      });
    });

    it("should create license and update subscription", async () => {
      const redeemLicenseWithoutID =
        RedeemLicenseWithoutID.createFromUnmarshalledPurchase(
          createMockPurchase(),
          "discord-id",
        );

      const subscriptionWithoutID =
        SubscriptionWithoutID.createFromUnmarshalledSubscription({
          ...createMockSubscriber(),
          license_key: "license-key",
        });

      (db.redeemLicense.findFirst as Mock).mockResolvedValue(null);
      (db.subscription.findFirst as Mock).mockResolvedValue({ id: 222 });

      await service.execute(redeemLicenseWithoutID, subscriptionWithoutID);

      expect(db.redeemLicense.findFirst).toHaveBeenCalledWith({
        where: {
          code: redeemLicenseWithoutID.code,
          discord_id: redeemLicenseWithoutID.discordId,
        },
      });
      expect(db.subscription.findFirst).toHaveBeenCalledWith({
        where: { subscription_id: subscriptionWithoutID.subscriptionId },
      });
      expect(db.subscription.update).toHaveBeenCalledWith({
        data: subscriptionWithoutID.toDB(),
        where: { id: 222 },
      });
      expect(db.subscription.create).not.toHaveBeenCalled();
      expect(db.redeemLicense.update).not.toHaveBeenCalled();
      expect(db.redeemLicense.create).toHaveBeenCalledWith({
        data: redeemLicenseWithoutID.toDB(),
      });
    });

    it("should update license and subscription", async () => {
      const redeemLicenseWithoutID =
        RedeemLicenseWithoutID.createFromUnmarshalledPurchase(
          createMockPurchase(),
          "discord-id",
        );

      const subscriptionWithoutID =
        SubscriptionWithoutID.createFromUnmarshalledSubscription({
          ...createMockSubscriber(),
          license_key: "license-key",
        });

      (db.redeemLicense.findFirst as Mock).mockResolvedValue({ id: 111 });
      (db.subscription.findFirst as Mock).mockResolvedValue({ id: 222 });

      await service.execute(redeemLicenseWithoutID, subscriptionWithoutID);

      expect(db.redeemLicense.findFirst).toHaveBeenCalledWith({
        where: {
          code: redeemLicenseWithoutID.code,
          discord_id: redeemLicenseWithoutID.discordId,
        },
      });
      expect(db.subscription.findFirst).toHaveBeenCalledWith({
        where: { subscription_id: subscriptionWithoutID.subscriptionId },
      });
      expect(db.subscription.update).toHaveBeenCalledWith({
        data: subscriptionWithoutID.toDB(),
        where: { id: 222 },
      });
      expect(db.subscription.create).not.toHaveBeenCalled();
      expect(db.redeemLicense.update).toHaveBeenCalledWith({
        data: redeemLicenseWithoutID.toDB(),
        where: { id: 111 },
      });
      expect(db.redeemLicense.create).not.toHaveBeenCalled();
    });
  });
});

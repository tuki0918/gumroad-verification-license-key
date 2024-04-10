"use client";
import RedeemLicenseList, {
  RedeemLicenseItem,
} from "@/components/RedeemLicenseList";
import FilterMenu from "@/components/ui/FilterMenu";
import { RedeemLicense } from "@/domains/RedeemLicense";
import { Subscription, SubscriptionStatusType } from "@/domains/Subscription";
import { Prisma } from "@prisma/client";
import { FC, useEffect, useMemo, useState } from "react";

export type AdminDashboardProps = {
  data: Prisma.SubscriptionGetPayload<{
    include: {
      redeemLicenses: true;
    };
  }>[];
};

const checkboxList: SubscriptionStatusType[] = [
  "alive",
  "pending_cancellation",
  "pending_failure",
  "failed_payment",
  "fixed_subscription_period_ended",
  "cancelled",
];

const AdminDashboard: FC<AdminDashboardProps> = ({ data }) => {
  const items: RedeemLicenseItem[] = useMemo(() => {
    return data.map((item) => {
      return {
        subscription: Subscription.reconstruct(item),
        redeemLicenses: item.redeemLicenses.map((redeemLicense) =>
          RedeemLicense.reconstruct(redeemLicense),
        ),
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      };
    });
  }, [data]);

  const [filteredItems, setFilteredItems] =
    useState<RedeemLicenseItem[]>(items);
  const [statusFilteres, setStatusFilteres] = useState<
    SubscriptionStatusType[]
  >([
    "alive",
    "pending_cancellation",
    "pending_failure",
    // "failed_payment",
    // "fixed_subscription_period_ended",
    // "cancelled",
  ]);

  useEffect(() => {
    const filteredItems = items.filter((item) => {
      return statusFilteres.includes(item.subscription.status);
    });
    setFilteredItems(filteredItems);
  }, [items, statusFilteres]);

  return (
    <div>
      <div className="my-4">
        <FilterMenu
          checkboxList={checkboxList}
          filters={statusFilteres}
          setFilters={setStatusFilteres}
          namespace="SubscriptionStatus"
        />
      </div>
      <div className="my-4 text-right">{filteredItems.length} items found.</div>
      <div className="my-4">
        <RedeemLicenseList items={filteredItems} />
      </div>
    </div>
  );
};

export default AdminDashboard;

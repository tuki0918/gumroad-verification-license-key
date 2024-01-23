"use client";
import { SubscriptionStatusType } from "@/domains/Subscription";
import { FC, useCallback } from "react";
const SubscriptionStatusFilter: FC<{
  statusFilteres: SubscriptionStatusType[];
  setStatusFilteres: (list: SubscriptionStatusType[]) => void;
}> = ({ setStatusFilteres, statusFilteres }) => {
  const checkboxList: SubscriptionStatusType[] = [
    "alive",
    "pending_cancellation",
    "pending_failure",
    "failed_payment",
    "fixed_subscription_period_ended",
    "cancelled",
  ];

  const handleStatusChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value as SubscriptionStatusType;
      if (event.target.checked) {
        setStatusFilteres([...statusFilteres, value]);
      } else {
        setStatusFilteres(statusFilteres.filter((status) => status !== value));
      }
    },
    [setStatusFilteres, statusFilteres],
  );

  return (
    <div className="flex flex-row items-center justify-center space-x-4">
      {checkboxList.map((status) => {
        return (
          <div key={status}>
            <label>
              <input
                type="checkbox"
                value={status}
                checked={statusFilteres.includes(status)}
                onChange={handleStatusChange}
              />
              <span className="label-text p-2">{status}</span>
            </label>
          </div>
        );
      })}
    </div>
  );
};

export default SubscriptionStatusFilter;

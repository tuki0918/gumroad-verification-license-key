import RevalidateButton from "@/components/RevalidateButton";
import FilterMenu from "@/components/ui/FilterMenu";
import { RedeemLicense } from "@/domains/RedeemLicense";
import { Subscription } from "@/domains/Subscription";
import { FC, useMemo, useState } from "react";
import { formatJSTDate, formatJSTDateTime, formatJSTTimeAgo } from "utils/date";

export type RedeemLicenseItem = {
  subscription: Subscription;
  redeemLicenses: RedeemLicense[];
  createdAt: Date;
  updatedAt: Date;
};

type FilteredFieldsType = "license_key" | "product";
const checkboxList: FilteredFieldsType[] = ["license_key", "product"];

const RedeemLicenseList: FC<{
  items: RedeemLicenseItem[];
}> = ({ items }) => {
  const [filteredFields, setFilteredFields] = useState<FilteredFieldsType[]>(
    [],
  );
  const isVisibleLicenseKeyField = useMemo(
    () => filteredFields.includes("license_key"),
    [filteredFields],
  );

  const isVisibleProductField = useMemo(
    () => filteredFields.includes("product"),
    [filteredFields],
  );

  return (
    <div>
      <div className="my-4">
        <FilterMenu
          checkboxList={checkboxList}
          filters={filteredFields}
          setFilters={setFilteredFields}
        />
      </div>
      <div className="my-4">
        <table className="table table-xs">
          <thead>
            <tr>
              <th className="text-center">Act</th>
              <th>Id</th>
              <th>Started At</th>
              {isVisibleLicenseKeyField && <th>License Key</th>}
              <th className="text-center">Status</th>
              {isVisibleProductField && <th>Product</th>}
              <th className="text-center">Redeems</th>
              <th className="text-center">Recurrence</th>
              <th>Ended At</th>
              <th>Cancelled At</th>
              <th>Failed At</th>
              <th>Free Trial Ends At</th>
              {/* <th>Created At</th> */}
              <th>Updated At</th>
              {/* <th>Comment</th> */}
            </tr>
          </thead>
          <tbody>
            {items.map((item, key) => (
              <tr
                key={key}
                className={
                  item.subscription.isAlive() ? "hover" : "bg-base-200"
                }
              >
                <td className="text-center">
                  <RevalidateButton code={item.subscription.licenseKey} />
                </td>
                <td>{item.subscription.id}</td>
                <td>
                  <div
                    className="tooltip"
                    data-tip={formatJSTDateTime(item.subscription.startedAt)}
                  >
                    {formatJSTDate(item.subscription.startedAt)}
                  </div>
                </td>
                {isVisibleLicenseKeyField && (
                  <td>{item.subscription.licenseKey}</td>
                )}
                <td className="text-center">
                  <div className="tooltip" data-tip={item.subscription.status}>
                    <span className="badge badge-ghost badge-sm">
                      {item.subscription.isAlive()
                        ? "✅"
                        : item.subscription.status}
                    </span>
                  </div>
                </td>
                {isVisibleProductField && (
                  <td>{item.subscription.productName}</td>
                )}
                <td className="text-center">
                  <div className="flex items-center justify-center">
                    {item.redeemLicenses.map((redeemLicense, key) => (
                      <div
                        key={key}
                        className="tooltip"
                        data-tip={`discordId: ${redeemLicense.discordId}`}
                      >
                        <span className="badge badge-ghost badge-sm">
                          {redeemLicense.isEnable() ? "✅" : "❌"}
                        </span>
                      </div>
                    ))}
                  </div>
                </td>
                <td className="text-center">
                  <span className="badge badge-ghost badge-sm">
                    {item.subscription.recurrenceSortWord()} (
                    {item.subscription.recurrenceDay()})
                  </span>
                </td>
                <td>
                  {item.subscription.endedAt === null ? (
                    ""
                  ) : (
                    <div
                      className="tooltip"
                      data-tip={formatJSTDateTime(item.subscription.endedAt)}
                    >
                      {formatJSTDate(item.subscription.endedAt)}
                    </div>
                  )}
                </td>
                <td>
                  {item.subscription.cancelledAt === null ? (
                    ""
                  ) : (
                    <div
                      className="tooltip"
                      data-tip={formatJSTDateTime(
                        item.subscription.cancelledAt,
                      )}
                    >
                      {formatJSTDate(item.subscription.cancelledAt)}
                    </div>
                  )}
                </td>
                <td>
                  {item.subscription.failedAt === null ? (
                    ""
                  ) : (
                    <div
                      className="tooltip"
                      data-tip={formatJSTDateTime(item.subscription.failedAt)}
                    >
                      {formatJSTDate(item.subscription.failedAt)}
                    </div>
                  )}
                </td>
                <td>
                  {item.subscription.freeTrialEndsAt === null ? (
                    ""
                  ) : (
                    <div
                      className="tooltip"
                      data-tip={formatJSTDateTime(
                        item.subscription.freeTrialEndsAt,
                      )}
                    >
                      {formatJSTDate(item.subscription.freeTrialEndsAt)}
                    </div>
                  )}
                </td>
                {/* <td>
                <div
                  className="tooltip"
                  data-tip={formatJSTDateTime(item.createdAt)}
                >
                  {formatJSTTimeAgo(item.createdAt)}
                </div>
              </td> */}
                <td>
                  <div
                    className="tooltip"
                    data-tip={formatJSTDateTime(item.updatedAt)}
                  >
                    {formatJSTTimeAgo(item.updatedAt, "ja")}
                  </div>
                </td>
                {/* <td></td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RedeemLicenseList;

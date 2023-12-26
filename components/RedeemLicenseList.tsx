import { License } from "@/domains/License";
import { FC } from "react";
import { formatJSTDate, formatJSTDateTime } from "utils/date";

const RedeemLicenseList: FC<{
  items: License[];
}> = ({ items }) => {
  return (
    <div>
      <table className="table">
        <thead>
          <tr>
            <th className="text-center">Edit</th>
            <th>Order Number</th>
            <th className="text-center">Purchased At</th>
            <th>License Key</th>
            <th className="text-center">Status</th>
            <th>Product</th>
            <th className="text-center">Price</th>
            <th className="text-center">Quantity</th>
            <th className="text-center">Recurrence</th>
            <th className="text-center">Recurrence Day</th>
            <th className="text-center">S_Ended At</th>
            <th className="text-center">S_Cancelled At</th>
            <th className="text-center">S_Failed At</th>
            {/* <th>Comment</th> */}
          </tr>
        </thead>
        <tbody>
          {items.map((item, key) => (
            <tr key={key}>
              <td className="text-center">
                <button className="btn btn-ghost btn-xs">●</button>
              </td>
              <td>{item.order_number}</td>
              <td className="text-center">
                <div
                  className="tooltip"
                  data-tip={formatJSTDateTime(item.purchased_at)}
                >
                  {formatJSTDate(item.purchased_at)}
                </div>
              </td>
              <td>{item.key}</td>
              <td className="text-center">
                <span className="badge badge-ghost badge-sm">
                  {item.status()}
                </span>
              </td>
              <td>
                <div className="flex items-center gap-3">
                  <div>
                    <div className="font-bold">{item.product_name}</div>
                    <div className="text-sm opacity-50">{item.variants}</div>
                  </div>
                </div>
              </td>
              <td className="text-center">
                {item.price} {item.currency}
              </td>
              <td className="text-center">{item.quantity}</td>
              <td className="text-center">
                <span className="badge badge-ghost badge-sm">
                  {item.recurrence}
                </span>
              </td>
              <td className="text-center">{item.recurrence_day()}</td>
              <td className="text-center">
                {item.subscription_ended_at === null ? (
                  ""
                ) : (
                  <div
                    className="tooltip"
                    data-tip={formatJSTDateTime(item.subscription_ended_at)}
                  >
                    {formatJSTDate(item.subscription_ended_at)}
                  </div>
                )}
              </td>
              <td className="text-center">
                {item.subscription_cancelled_at === null ? (
                  ""
                ) : (
                  <div
                    className="tooltip"
                    data-tip={formatJSTDateTime(item.subscription_cancelled_at)}
                  >
                    {formatJSTDate(item.subscription_cancelled_at)}
                  </div>
                )}
              </td>
              <td className="text-center">
                {item.subscription_failed_at === null ? (
                  ""
                ) : (
                  <div
                    className="tooltip"
                    data-tip={formatJSTDateTime(item.subscription_failed_at)}
                  >
                    {formatJSTDate(item.subscription_failed_at)}
                  </div>
                )}
              </td>
              {/* <td className="text-center"></td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RedeemLicenseList;

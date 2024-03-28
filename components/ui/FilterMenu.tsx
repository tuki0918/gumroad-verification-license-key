import { useTranslations } from "next-intl";
import { useCallback } from "react";

type FilterMenuType = string;
interface FilterMenuProps<T extends FilterMenuType> {
  checkboxList: T[];
  filters: T[];
  setFilters: (list: T[]) => void;
  namespace?: string;
}

const FilterMenu = <T extends FilterMenuType>({
  checkboxList,
  filters,
  setFilters,
  namespace,
}: FilterMenuProps<T>): JSX.Element => {
  const t = useTranslations("FilterMenu");

  const handleStatusChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value as T;
      if (event.target.checked) {
        setFilters([...filters, value]);
      } else {
        setFilters(filters.filter((status) => status !== value));
      }
    },
    [setFilters, filters],
  );

  return (
    <div className="flex flex-row items-center justify-center space-x-4">
      {checkboxList.map((status) => {
        return (
          <div key={status}>
            <label className="label cursor-pointer">
              <input
                className="checkbox"
                type="checkbox"
                value={status}
                checked={filters.includes(status)}
                onChange={handleStatusChange}
              />
              <span className="label-text p-2">
                {namespace ? t(`${namespace}/${status}`) : status}
              </span>
            </label>
          </div>
        );
      })}
    </div>
  );
};

export default FilterMenu;

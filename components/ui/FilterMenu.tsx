import { useCallback } from "react";

type FilterMenuType = string;
interface FilterMenuProps<T extends FilterMenuType> {
  checkboxList: T[];
  filters: T[];
  setFilters: (list: T[]) => void;
}

const FilterMenu = <T extends FilterMenuType>({
  checkboxList,
  filters,
  setFilters,
}: FilterMenuProps<T>): JSX.Element => {
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
            <label>
              <input
                type="checkbox"
                value={status}
                checked={filters.includes(status)}
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

export default FilterMenu;

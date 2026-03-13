export interface FilterOption {
  label: string;
  value: string | number;
}

export interface FilterConfig<T> {
  key: keyof T;
  label: string;
  options: FilterOption[];
  placeholder?: string;
}

interface FiltersBarProps<T> {
  filters: T;
  configs: FilterConfig<T>[];
  onFilterChange: (key: keyof T, value: string | number | undefined) => void;
}

function FiltersBar<T extends Record<string, any>>({
  filters,
  configs,
  onFilterChange,
}: FiltersBarProps<T>) {
  return (
    <div className="bg-white/90 backdrop-blur border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-wrap gap-6 items-end">
      {configs.map((config) => (
        <div key={String(config.key)} className="flex flex-col gap-1">
          <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider ml-1">
            {config.label}
          </label>

          <select
            className="bg-gray-50 border border-gray-200 text-sm font-medium rounded-xl px-4 py-2.5
            focus:ring-2 focus:ring-blue-100 focus:border-blue-200 outline-none transition-all"
            value={filters[config.key] ?? ""}
            onChange={(e) =>
              onFilterChange(
                config.key,
                e.target.value === "" ? undefined : e.target.value,
              )
            }
          >
            <option value="">
              {config.placeholder || `All ${config.label}`}
            </option>

            {config.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}

export default FiltersBar;

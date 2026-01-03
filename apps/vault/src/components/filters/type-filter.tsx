"use client";

type TypeFilterProps = {
  value: string | null;
  onChange: (type: string | null) => void;
  counts: {
    all: number;
    component: number;
    section: number;
    template: number;
  };
};

const typeOptions = [
  { value: null, label: "All" },
  { value: "component", label: "Components" },
  { value: "section", label: "Sections" },
  { value: "template", label: "Templates" },
] as const;

export function TypeFilter({ value, onChange, counts }: TypeFilterProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
        Type
      </h3>
      <div className="space-y-1">
        {typeOptions.map((option) => {
          const count = option.value === null ? counts.all : counts[option.value];
          const isSelected = value === option.value;

          return (
            <label
              key={option.label}
              className={`flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors ${
                isSelected
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <input
                type="radio"
                name="type-filter"
                checked={isSelected}
                onChange={() => onChange(option.value)}
                className="sr-only"
              />
              <span
                className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                  isSelected
                    ? "border-gray-900 bg-gray-900"
                    : "border-gray-300"
                }`}
              >
                {isSelected && (
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                )}
              </span>
              <span className="flex-1">{option.label}</span>
              <span className="text-xs text-gray-400">{count}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

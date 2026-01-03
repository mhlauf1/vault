"use client";

export type Background = "white" | "grid" | "dots";

type BackgroundToggleProps = {
  value: Background;
  onChange: (background: Background) => void;
};

const backgrounds: { value: Background; label: string }[] = [
  { value: "white", label: "White" },
  { value: "grid", label: "Grid" },
  { value: "dots", label: "Dots" },
];

export function BackgroundToggle({ value, onChange }: BackgroundToggleProps) {
  return (
    <div className="flex items-center rounded-lg border border-gray-200 bg-gray-50 p-0.5">
      {backgrounds.map((bg) => (
        <button
          key={bg.value}
          onClick={() => onChange(bg.value)}
          className={`flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition-colors ${
            value === bg.value
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
          title={bg.label}
        >
          <BackgroundIcon background={bg.value} />
        </button>
      ))}
    </div>
  );
}

function BackgroundIcon({ background }: { background: Background }) {
  if (background === "white") {
    return (
      <div className="h-3.5 w-3.5 rounded border border-gray-300 bg-white" />
    );
  }

  if (background === "grid") {
    return (
      <div className="h-3.5 w-3.5 rounded border border-gray-300 bg-white bg-[linear-gradient(to_right,#e5e5e5_1px,transparent_1px),linear-gradient(to_bottom,#e5e5e5_1px,transparent_1px)] bg-[size:3px_3px]" />
    );
  }

  return (
    <div className="h-3.5 w-3.5 rounded border border-gray-300 bg-white bg-[radial-gradient(#d4d4d4_1px,transparent_1px)] bg-[size:3px_3px]" />
  );
}

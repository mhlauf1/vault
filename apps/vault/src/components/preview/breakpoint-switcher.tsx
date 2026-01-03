"use client";

export type Breakpoint = "mobile" | "tablet" | "desktop";

type BreakpointSwitcherProps = {
  value: Breakpoint;
  onChange: (breakpoint: Breakpoint) => void;
};

const breakpoints: { value: Breakpoint; label: string; width: number }[] = [
  { value: "mobile", label: "Mobile", width: 375 },
  { value: "tablet", label: "Tablet", width: 768 },
  { value: "desktop", label: "Desktop", width: 1280 },
];

export function BreakpointSwitcher({ value, onChange }: BreakpointSwitcherProps) {
  return (
    <div className="flex items-center rounded-lg border border-gray-200 bg-gray-50 p-0.5">
      {breakpoints.map((bp) => (
        <button
          key={bp.value}
          onClick={() => onChange(bp.value)}
          className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
            value === bp.value
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
          title={`${bp.label} (${bp.width}px)`}
        >
          <BreakpointIcon breakpoint={bp.value} />
          <span className="hidden sm:inline">{bp.label}</span>
        </button>
      ))}
    </div>
  );
}

function BreakpointIcon({ breakpoint }: { breakpoint: Breakpoint }) {
  if (breakpoint === "mobile") {
    return (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
        />
      </svg>
    );
  }

  if (breakpoint === "tablet") {
    return (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
        />
      </svg>
    );
  }

  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  );
}

"use client";

import { Suspense } from "react";
import type { Meta } from "@repo/registry/schema";
import { BreakpointSwitcher, type Breakpoint } from "../preview/breakpoint-switcher";
import { ThemeToggle, type Theme } from "../preview/theme-toggle";
import { BackgroundToggle, type Background } from "../preview/background-toggle";
import { PreviewErrorBoundary } from "../preview/error-boundary";

type PreviewCanvasProps = {
  item: Meta | null;
  breakpoint: Breakpoint;
  onBreakpointChange: (breakpoint: Breakpoint) => void;
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
  background: Background;
  onBackgroundChange: (background: Background) => void;
  children?: React.ReactNode;
};

const breakpointWidths: Record<Breakpoint, number> = {
  mobile: 375,
  tablet: 768,
  desktop: 1280,
};

export function PreviewCanvas({
  item,
  breakpoint,
  onBreakpointChange,
  theme,
  onThemeChange,
  background,
  onBackgroundChange,
  children,
}: PreviewCanvasProps) {
  const backgroundStyles: Record<Background, string> = {
    white: "bg-white",
    grid: "bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:20px_20px]",
    dots: "bg-white bg-[radial-gradient(#d4d4d4_1px,transparent_1px)] bg-[size:20px_20px]",
  };

  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden bg-gray-100">
      {/* Toolbar */}
      <div className="flex h-12 items-center justify-between border-b border-gray-200 bg-white px-4">
        <div className="flex items-center gap-2">
          <BreakpointSwitcher value={breakpoint} onChange={onBreakpointChange} />
        </div>
        <div className="flex items-center gap-2">
          <BackgroundToggle value={background} onChange={onBackgroundChange} />
          <div className="mx-2 h-5 w-px bg-gray-200" />
          <ThemeToggle value={theme} onChange={onThemeChange} />
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex flex-1 items-start justify-center overflow-auto p-8">
        {item ? (
          <div
            className={`mx-auto overflow-hidden rounded-lg border border-gray-200 shadow-sm transition-all duration-300 ${backgroundStyles[background]} ${theme === "dark" ? "dark" : ""}`}
            style={{ width: breakpointWidths[breakpoint], minHeight: 200 }}
          >
            <PreviewErrorBoundary>
              <Suspense fallback={<PreviewSkeleton />}>
                {children}
              </Suspense>
            </PreviewErrorBoundary>
          </div>
        ) : (
          <EmptyPreview />
        )}
      </div>
    </div>
  );
}

function EmptyPreview() {
  return (
    <div className="flex h-64 w-full max-w-md items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white">
      <div className="text-center">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
          />
        </svg>
        <p className="mt-2 text-sm text-gray-500">Select an item to preview</p>
      </div>
    </div>
  );
}

function PreviewSkeleton() {
  return (
    <div className="flex h-64 w-full items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
    </div>
  );
}

"use client";

import { useState } from "react";
import type { Meta } from "@repo/registry/schema";

type TagFilterProps = {
  tags: string[];
  selectedTags: string[];
  onChange: (tags: string[]) => void;
  items: Meta[];
};

export function TagFilter({
  tags,
  selectedTags,
  onChange,
  items,
}: TagFilterProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  // Calculate count for each tag
  const getTagCount = (tag: string) =>
    items.filter((item) => item.tags.includes(tag)).length;

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onChange(selectedTags.filter((t) => t !== tag));
    } else {
      onChange([...selectedTags, tag]);
    }
  };

  return (
    <div className="space-y-2 pt-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between text-xs font-semibold uppercase tracking-wider text-gray-500"
      >
        <span>Tags</span>
        <svg
          className={`h-4 w-4 transition-transform ${
            isExpanded ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isExpanded && (
        <div className="space-y-1">
          {tags.map((tag) => {
            const isSelected = selectedTags.includes(tag);
            const count = getTagCount(tag);

            return (
              <label
                key={tag}
                className={`flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors ${
                  isSelected
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleTag(tag)}
                  className="sr-only"
                />
                <span
                  className={`flex h-4 w-4 items-center justify-center rounded border ${
                    isSelected
                      ? "border-gray-900 bg-gray-900"
                      : "border-gray-300"
                  }`}
                >
                  {isSelected && (
                    <svg
                      className="h-3 w-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </span>
                <span className="flex-1">{tag}</span>
                <span className="text-xs text-gray-400">{count}</span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}

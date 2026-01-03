"use client";

import { useState } from "react";
import type { Meta } from "@repo/registry/schema";

type CollectionFilterProps = {
  collections: string[];
  selectedCollections: string[];
  onChange: (collections: string[]) => void;
  items: Meta[];
};

export function CollectionFilter({
  collections,
  selectedCollections,
  onChange,
  items,
}: CollectionFilterProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  // Calculate count for each collection
  const getCollectionCount = (collection: string) =>
    items.filter((item) => item.collections.includes(collection)).length;

  const toggleCollection = (collection: string) => {
    if (selectedCollections.includes(collection)) {
      onChange(selectedCollections.filter((c) => c !== collection));
    } else {
      onChange([...selectedCollections, collection]);
    }
  };

  return (
    <div className="space-y-2 pt-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between text-xs font-semibold uppercase tracking-wider text-gray-500"
      >
        <span>Collections</span>
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
          {collections.map((collection) => {
            const isSelected = selectedCollections.includes(collection);
            const count = getCollectionCount(collection);

            return (
              <label
                key={collection}
                className={`flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors ${
                  isSelected
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleCollection(collection)}
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
                <span className="flex-1">{collection}</span>
                <span className="text-xs text-gray-400">{count}</span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}

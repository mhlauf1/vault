"use client";

import type { Meta } from "@repo/registry/schema";
import { SearchInput } from "../ui/search-input";
import { TypeFilter } from "../filters/type-filter";
import { TagFilter } from "../filters/tag-filter";
import { CollectionFilter } from "../filters/collection-filter";

type SidebarProps = {
  items: Meta[];
  selectedId: string | null;
  onSelectItem: (id: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  typeFilter: string | null;
  onTypeFilterChange: (type: string | null) => void;
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  selectedCollections: string[];
  onCollectionsChange: (collections: string[]) => void;
};

export function Sidebar({
  items,
  selectedId,
  onSelectItem,
  searchQuery,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  selectedTags,
  onTagsChange,
  selectedCollections,
  onCollectionsChange,
}: SidebarProps) {
  // Extract unique tags and collections from all items
  const allTags = [...new Set(items.flatMap((item) => item.tags))].sort();
  const allCollections = [
    ...new Set(items.flatMap((item) => item.collections)),
  ].sort();

  // Count items by type
  const typeCounts = {
    all: items.length,
    component: items.filter((i) => i.type === "component").length,
    section: items.filter((i) => i.type === "section").length,
    template: items.filter((i) => i.type === "template").length,
  };

  return (
    <aside className="flex h-full w-[280px] flex-col border-r border-gray-200 bg-white">
      {/* Logo / Title */}
      <div className="flex h-14 items-center border-b border-gray-200 px-4">
        <h1 className="text-lg font-semibold text-gray-900">UI Vault</h1>
      </div>

      {/* Search */}
      <div className="border-b border-gray-200 p-4">
        <SearchInput value={searchQuery} onChange={onSearchChange} />
      </div>

      {/* Filters */}
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-1 p-4">
          {/* Type Filter */}
          <TypeFilter
            value={typeFilter}
            onChange={onTypeFilterChange}
            counts={typeCounts}
          />

          {/* Tags Filter */}
          {allTags.length > 0 && (
            <TagFilter
              tags={allTags}
              selectedTags={selectedTags}
              onChange={onTagsChange}
              items={items}
            />
          )}

          {/* Collections Filter */}
          {allCollections.length > 0 && (
            <CollectionFilter
              collections={allCollections}
              selectedCollections={selectedCollections}
              onChange={onCollectionsChange}
              items={items}
            />
          )}
        </div>
      </div>

      {/* Item List */}
      <div className="flex-1 overflow-y-auto border-t border-gray-200">
        <ItemList
          items={items}
          selectedId={selectedId}
          onSelectItem={onSelectItem}
        />
      </div>
    </aside>
  );
}

type ItemListProps = {
  items: Meta[];
  selectedId: string | null;
  onSelectItem: (id: string) => void;
};

function ItemList({ items, selectedId, onSelectItem }: ItemListProps) {
  if (items.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center text-sm text-gray-500">
        No items found
      </div>
    );
  }

  return (
    <div className="py-2">
      {items.map((item) => (
        <ItemRow
          key={item.id}
          item={item}
          isSelected={item.id === selectedId}
          onSelect={() => onSelectItem(item.id)}
        />
      ))}
    </div>
  );
}

type ItemRowProps = {
  item: Meta;
  isSelected: boolean;
  onSelect: () => void;
};

function ItemRow({ item, isSelected, onSelect }: ItemRowProps) {
  const typeColors = {
    component: "bg-blue-100 text-blue-700",
    section: "bg-green-100 text-green-700",
    template: "bg-purple-100 text-purple-700",
  };

  return (
    <button
      onClick={onSelect}
      className={`w-full px-4 py-2.5 text-left transition-colors ${
        isSelected
          ? "bg-gray-100 border-l-2 border-l-gray-900"
          : "hover:bg-gray-50 border-l-2 border-l-transparent"
      }`}
    >
      <div className="flex items-center gap-2">
        <span
          className={`inline-flex shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium uppercase ${typeColors[item.type]}`}
        >
          {item.type.slice(0, 3)}
        </span>
        <span className="truncate text-sm font-medium text-gray-900">
          {item.name}
        </span>
      </div>
    </button>
  );
}

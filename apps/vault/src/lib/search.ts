import Fuse, { type IFuseOptions } from "fuse.js";
import type { Meta } from "@repo/registry/schema";

const fuseOptions: IFuseOptions<Meta> = {
  keys: [
    { name: "name", weight: 2 },
    { name: "description", weight: 1 },
    { name: "tags", weight: 1.5 },
    { name: "collections", weight: 1 },
  ],
  threshold: 0.3,
  includeScore: true,
};

export function createSearchIndex(items: Meta[]) {
  return { fuse: new Fuse(items, fuseOptions), items };
}

export function searchItems(
  index: { fuse: Fuse<Meta>; items: Meta[] },
  query: string,
  filters?: {
    type?: string | null;
    tags?: string[];
    collections?: string[];
    status?: string[];
  }
): Meta[] {
  const { fuse, items } = index;

  // Get base results
  let results: Meta[] = query
    ? fuse.search(query).map((r) => r.item)
    : [...items];

  // Apply type filter
  if (filters?.type) {
    results = results.filter((item) => item.type === filters.type);
  }

  // Apply tag filter (OR logic - match any selected tag)
  if (filters?.tags && filters.tags.length > 0) {
    results = results.filter((item) =>
      filters.tags!.some((tag) => item.tags.includes(tag))
    );
  }

  // Apply collection filter (OR logic)
  if (filters?.collections && filters.collections.length > 0) {
    results = results.filter((item) =>
      filters.collections!.some((col) => item.collections.includes(col))
    );
  }

  // Apply status filter
  if (filters?.status && filters.status.length > 0) {
    results = results.filter((item) => filters.status!.includes(item.status));
  }

  return results;
}

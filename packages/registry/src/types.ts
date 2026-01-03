export type { Meta, ItemTypeEnum, ItemStatusEnum } from "./schema";

export type IndexEntry = {
  id: string;
  type: "component" | "section" | "template";
  name: string;
  description: string;
  tags: string[];
  collections: string[];
  status: "draft" | "ready" | "deprecated";
  createdAt: string;
  updatedAt: string;
  tech: {
    styling: string[];
    motion?: string[];
    icons?: string[];
    other?: string[];
  };
  path: string;
  hasReadme: boolean;
};

export type RegistryIndex = {
  items: IndexEntry[];
  generatedAt: string;
};

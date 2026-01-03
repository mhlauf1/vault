import { z } from "zod";

export const ItemType = z.enum(["component", "section", "template"]);

export const ItemStatus = z.enum(["draft", "ready", "deprecated"]);

export const TechStack = z.object({
  styling: z.array(z.string()).default(["tailwind"]),
  motion: z.array(z.string()).optional(),
  icons: z.array(z.string()).optional(),
  other: z.array(z.string()).optional(),
});

export const MetaSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/, "ID must be lowercase with hyphens"),
  type: ItemType,
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(500),
  tags: z.array(z.string()).min(1),
  collections: z.array(z.string()).default([]),
  status: ItemStatus.default("draft"),
  createdAt: z.string(),
  updatedAt: z.string(),
  tech: TechStack.default({ styling: ["tailwind"] }),
  previewHeight: z.number().optional(),
});

export type Meta = z.infer<typeof MetaSchema>;
export type ItemTypeEnum = z.infer<typeof ItemType>;
export type ItemStatusEnum = z.infer<typeof ItemStatus>;

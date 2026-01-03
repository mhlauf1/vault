# Personal UI Vault — Complete Implementation Specification

> **Project:** Relume-lite Workbench for personal component/section/template management  
> **Stack:** Next.js 15 (App Router) + Turborepo + pnpm + Tailwind CSS 4  
> **Last Updated:** 2026-01-03  
> **Status:** Planning Complete → Ready for Implementation

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Architecture Decisions (Locked)](#2-architecture-decisions-locked)
3. [Monorepo Structure](#3-monorepo-structure)
4. [Registry System](#4-registry-system)
5. [Meta Schema (Zod)](#5-meta-schema-zod)
6. [Standalone Section Standard](#6-standalone-section-standard)
7. [Vault App (Workbench UI)](#7-vault-app-workbench-ui)
8. [Copy Source Implementation](#8-copy-source-implementation)
9. [Registry Indexing](#9-registry-indexing)
10. [Preview Rendering](#10-preview-rendering)
11. [Templates (v1 Catalog)](#11-templates-v1-catalog)
12. [Implementation Phases](#12-implementation-phases)
13. [Starter Items](#13-starter-items)
14. [Acceptance Criteria](#14-acceptance-criteria)
15. [Future Extensions](#15-future-extensions)

---

## 1. Project Overview

### 1.1 What This Is

A personal Next.js "workbench" application where you can:

- Browse your own **Components**, **Sections**, and **Templates**
- See live, interactive previews with responsive breakpoints
- Click **Copy Source** to get clean, typed TSX ready to paste into any project
- Filter by type, tags, collections, and status
- Never worry about dependency hell — every section is 100% standalone

### 1.2 Core Value Proposition

| Pain Point | Solution |
|------------|----------|
| Component libraries require npm installs | Copy-paste ownership model |
| Sections have internal imports that break | Every section is self-contained |
| Hard to find your own past work | Searchable, filterable vault |
| No live preview of your components | Interactive preview canvas |

### 1.3 Non-Goals (v1)

- Public access / authentication
- Database for user data
- Payment processing
- CLI tool for installation
- Package publishing

---

## 2. Architecture Decisions (Locked)

These decisions are **final** and should not be revisited during implementation:

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Package Manager | pnpm | Fast, disk-efficient, great monorepo support |
| Monorepo Tool | Turborepo | Simple config, great caching, Next.js native |
| Framework | Next.js 15 (App Router) | RSC for fast loads, server actions for file reads |
| Styling | Tailwind CSS 4 | Utility-first, consistent with target projects |
| TypeScript | Strict mode | Catch errors early, better DX |
| Data Strategy | File-based (no DB) | Simplicity, source-of-truth in code |
| Copy Behavior | Full TSX source | No CLI, no transforms, just copy |
| Section Rule | 100% standalone | No internal imports in copied code |

---

## 3. Monorepo Structure

```
vault-workspace/
├── .github/
│   └── workflows/           # CI (lint, typecheck, build)
├── apps/
│   └── vault/               # Next.js 15 Workbench UI
│       ├── app/
│       │   ├── layout.tsx
│       │   ├── page.tsx              # Workbench home
│       │   ├── items/
│       │   │   └── [type]/
│       │   │       └── [id]/
│       │   │           └── page.tsx  # Item detail view
│       │   └── api/
│       │       └── source/
│       │           └── route.ts      # Source file reader
│       ├── components/
│       │   ├── layout/
│       │   │   ├── sidebar.tsx
│       │   │   ├── preview-canvas.tsx
│       │   │   └── detail-panel.tsx
│       │   ├── ui/                   # Vault's own UI components
│       │   └── preview/
│       │       └── error-boundary.tsx
│       ├── lib/
│       │   ├── registry.ts           # Registry loading utilities
│       │   ├── search.ts             # Fuse.js search
│       │   └── clipboard.ts          # Copy utilities
│       ├── tailwind.config.ts
│       └── next.config.ts
├── packages/
│   ├── registry/                     # Your items live here
│   │   ├── src/
│   │   │   ├── items/
│   │   │   │   ├── components/
│   │   │   │   ├── sections/
│   │   │   │   └── templates/
│   │   │   ├── schema.ts             # Zod meta schema
│   │   │   └── types.ts              # Shared types
│   │   ├── scripts/
│   │   │   └── build-index.ts        # Index generator
│   │   ├── dist/
│   │   │   └── index.json            # Generated index
│   │   └── package.json
│   ├── eslint-config/                # Shared ESLint
│   │   ├── base.js
│   │   └── package.json
│   └── tsconfig/                     # Shared TypeScript
│       ├── base.json
│       ├── nextjs.json
│       └── package.json
├── turbo.json
├── pnpm-workspace.yaml
├── package.json
├── .prettierrc
└── README.md
```

---

## 4. Registry System

### 4.1 Item Types

| Type | Description | Self-Contained? |
|------|-------------|-----------------|
| **Component** | Small UI pieces (cards, widgets, buttons) | Optional |
| **Section** | Page sections (Hero, Pricing, FAQ) | **Required** |
| **Template** | Multi-page starters | N/A (catalog only v1) |

### 4.2 Item Folder Structure

Every item follows this structure:

```
items/
└── sections/
    └── hero-split-image/
        ├── meta.ts          # Required: metadata
        ├── preview.tsx      # Required: vault preview component
        ├── source.tsx       # Required: the code users copy
        └── README.md        # Optional: usage notes
```

### 4.3 File Responsibilities

| File | Purpose | Consumed By |
|------|---------|-------------|
| `meta.ts` | Metadata for indexing/filtering | Index generator, Vault UI |
| `preview.tsx` | React component for live preview | Vault preview canvas |
| `source.tsx` | Clean, standalone code to copy | Copy Source endpoint |
| `README.md` | Usage notes, variants, tips | Detail panel |

---

## 5. Meta Schema (Zod)

### 5.1 Schema Definition

```typescript
// packages/registry/src/schema.ts
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
  createdAt: z.string().date(),
  updatedAt: z.string().date(),
  tech: TechStack.default({ styling: ["tailwind"] }),
  previewHeight: z.number().optional(), // Custom preview height if needed
});

export type Meta = z.infer<typeof MetaSchema>;
export type ItemType = z.infer<typeof ItemType>;
export type ItemStatus = z.infer<typeof ItemStatus>;
```

### 5.2 Example meta.ts

```typescript
// packages/registry/src/items/sections/hero-split-image/meta.ts
import type { Meta } from "../../../schema";

export const meta: Meta = {
  id: "hero-split-image",
  type: "section",
  name: "Hero — Split Image",
  description: "Classic hero with headline left, image right. Includes CTA buttons with hover states.",
  tags: ["hero", "saas", "marketing", "landing"],
  collections: ["SaaS Landing", "Marketing"],
  status: "ready",
  createdAt: "2026-01-03",
  updatedAt: "2026-01-03",
  tech: {
    styling: ["tailwind"],
  },
};
```

---

## 6. Standalone Section Standard

### 6.1 The Golden Rule

> **Every section's `source.tsx` must compile and render in ANY Next.js + Tailwind project with zero modifications.**

This means:
- No imports from other registry items
- No imports from the vault app
- All sub-components defined inline or in the same file
- Only external imports allowed: React, Next.js, and explicitly listed dependencies (framer-motion, lucide-react, etc.)

### 6.2 Section Source Template

```typescript
// packages/registry/src/items/sections/hero-split-image/source.tsx

// ============================================
// Hero — Split Image
// A classic hero section with headline and image
// ============================================

type HeroSplitImageProps = {
  headline: string;
  subheadline?: string;
  primaryCta?: {
    label: string;
    href: string;
  };
  secondaryCta?: {
    label: string;
    href: string;
  };
  image: {
    src: string;
    alt: string;
  };
};

export function HeroSplitImage({
  headline,
  subheadline = "Supporting copy that explains your value proposition in a sentence or two.",
  primaryCta = { label: "Get Started", href: "#" },
  secondaryCta = { label: "Learn More", href: "#" },
  image,
}: HeroSplitImageProps) {
  return (
    <section className="py-20 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Content */}
          <div className="flex flex-col gap-6">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              {headline}
            </h1>
            <p className="text-lg text-gray-600 lg:text-xl">
              {subheadline}
            </p>
            <div className="flex flex-wrap gap-4">
              <Button href={primaryCta.href}>{primaryCta.label}</Button>
              <Button href={secondaryCta.href} variant="secondary">
                {secondaryCta.label}
              </Button>
            </div>
          </div>

          {/* Image */}
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gray-100">
            <img
              src={image.src}
              alt={image.alt}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// Internal Components (included for standalone use)
// ============================================

type ButtonProps = {
  children: React.ReactNode;
  href: string;
  variant?: "primary" | "secondary";
};

function Button({ children, href, variant = "primary" }: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-semibold transition-colors";
  
  const variants = {
    primary: "bg-gray-900 text-white hover:bg-gray-800",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
  };

  return (
    <a href={href} className={`${baseStyles} ${variants[variant]}`}>
      {children}
    </a>
  );
}
```

### 6.3 Props Pattern

| Pattern | Do This | Not This |
|---------|---------|----------|
| Required props | `headline: string` | `headline?: string` with fallback |
| Optional with defaults | `subheadline = "Default text"` | `const DEFAULTS = { ... }` |
| Complex objects | Inline type definition | Separate exported type |
| Internal components | Define after main export | Import from elsewhere |

---

## 7. Vault App (Workbench UI)

### 7.1 Route Structure

```
/                           # Workbench home (redirects to /items)
/items                      # All items view
/items?type=section         # Filtered by type
/items?tag=hero             # Filtered by tag
/items/[type]/[id]          # Item detail view
```

### 7.2 Layout Design (Three-Panel)

```
┌─────────────────────────────────────────────────────────────────┐
│  Logo                                              Theme Toggle │
├──────────────┬─────────────────────────────┬────────────────────┤
│              │                             │                    │
│   SIDEBAR    │      PREVIEW CANVAS         │    DETAIL PANEL    │
│   (280px)    │      (flex-1)               │    (360px)         │
│              │                             │                    │
│  ┌────────┐  │  ┌─────────────────────┐   │  ┌──────────────┐  │
│  │ Search │  │  │                     │   │  │ Name         │  │
│  └────────┘  │  │                     │   │  │ Description  │  │
│              │  │    Live Preview     │   │  │ Tags         │  │
│  FILTERS     │  │                     │   │  │              │  │
│  ○ Components│  │                     │   │  │ ┌──────────┐ │  │
│  ○ Sections  │  │                     │   │  │ │Copy Code │ │  │
│  ○ Templates │  │                     │   │  │ └──────────┘ │  │
│              │  │                     │   │  │              │  │
│  TAGS        │  └─────────────────────┘   │  │ README.md    │  │
│  □ hero      │                             │  │ content      │  │
│  □ pricing   │  [Mobile] [Tablet] [Desktop]│  │ rendered     │  │
│  □ faq       │                             │  │ here         │  │
│              │                             │  │              │  │
│  COLLECTIONS │                             │  └──────────────┘  │
│  □ SaaS      │                             │                    │
│  □ Marketing │                             │                    │
│              │                             │                    │
├──────────────┴─────────────────────────────┴────────────────────┤
│  Items: 24 total • 12 sections • 10 components • 2 templates    │
└─────────────────────────────────────────────────────────────────┘
```

### 7.3 Preview Canvas Features

| Feature | Implementation |
|---------|----------------|
| Breakpoint Switcher | Mobile (375px), Tablet (768px), Desktop (1280px) |
| Theme Toggle | Light/Dark mode via CSS variables |
| Background Toggle | White / Subtle grid / Dots pattern |
| Zoom Control | 50% / 75% / 100% (optional v1.1) |
| Fullscreen | Expand preview to full viewport |

### 7.4 Component Breakdown

```typescript
// apps/vault/components/layout/sidebar.tsx
- SearchInput (instant filter)
- TypeFilter (radio: all/components/sections/templates)
- TagFilter (checkbox multi-select)
- CollectionFilter (checkbox multi-select)
- StatusFilter (checkbox: draft/ready)
- ItemList (virtualized for performance)

// apps/vault/components/layout/preview-canvas.tsx
- BreakpointSwitcher
- ThemeToggle
- BackgroundToggle
- PreviewFrame (iframe or div with width constraints)
- ErrorBoundary wrapper

// apps/vault/components/layout/detail-panel.tsx
- ItemHeader (name, status badge)
- ItemDescription
- TagList
- TechStackBadges
- CopySourceButton
- CopyPathButton
- ReadmeViewer (markdown renderer)
```

---

## 8. Copy Source Implementation

### 8.1 Server Route

```typescript
// apps/vault/app/api/source/route.ts
import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const id = searchParams.get("id");

  if (!type || !id) {
    return NextResponse.json(
      { error: "Missing type or id" },
      { status: 400 }
    );
  }

  // Validate type
  if (!["component", "section", "template"].includes(type)) {
    return NextResponse.json(
      { error: "Invalid type" },
      { status: 400 }
    );
  }

  // Construct path (pluralize type for folder)
  const pluralType = type === "component" ? "components" : 
                     type === "section" ? "sections" : "templates";
  
  const sourcePath = path.join(
    process.cwd(),
    "..",
    "..",
    "packages",
    "registry",
    "src",
    "items",
    pluralType,
    id,
    "source.tsx"
  );

  try {
    const source = await readFile(sourcePath, "utf-8");
    
    // Ensure trailing newline
    const cleanSource = source.endsWith("\n") ? source : source + "\n";
    
    return NextResponse.json({ source: cleanSource });
  } catch (error) {
    return NextResponse.json(
      { error: "Source file not found" },
      { status: 404 }
    );
  }
}
```

### 8.2 Client Copy Utility

```typescript
// apps/vault/lib/clipboard.ts
import { toast } from "sonner"; // or your toast library

export async function copySource(type: string, id: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/source?type=${type}&id=${id}`);
    
    if (!response.ok) {
      throw new Error("Failed to fetch source");
    }
    
    const { source } = await response.json();
    await navigator.clipboard.writeText(source);
    
    toast.success("Source copied to clipboard");
    return true;
  } catch (error) {
    toast.error("Failed to copy source");
    return false;
  }
}
```

---

## 9. Registry Indexing

### 9.1 Index Generator Script

```typescript
// packages/registry/scripts/build-index.ts
import { readdir, readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import { MetaSchema, type Meta } from "../src/schema";

type IndexEntry = Meta & {
  path: string;
  hasReadme: boolean;
};

async function buildIndex() {
  const itemsDir = path.join(__dirname, "..", "src", "items");
  const outputDir = path.join(__dirname, "..", "dist");
  const outputPath = path.join(outputDir, "index.json");
  
  const index: IndexEntry[] = [];
  const errors: string[] = [];

  // Process each type directory
  for (const typeDir of ["components", "sections", "templates"]) {
    const typePath = path.join(itemsDir, typeDir);
    
    try {
      const items = await readdir(typePath);
      
      for (const itemId of items) {
        const itemPath = path.join(typePath, itemId);
        const metaPath = path.join(itemPath, "meta.ts");
        
        try {
          // Dynamic import of meta
          const { meta } = await import(metaPath);
          
          // Validate with Zod
          const validated = MetaSchema.parse(meta);
          
          // Check for README
          const hasReadme = await fileExists(path.join(itemPath, "README.md"));
          
          index.push({
            ...validated,
            path: `items/${typeDir}/${itemId}`,
            hasReadme,
          });
        } catch (error) {
          errors.push(`Error processing ${typeDir}/${itemId}: ${error}`);
        }
      }
    } catch {
      // Type directory doesn't exist yet, skip
    }
  }

  // Ensure output directory exists
  await mkdir(outputDir, { recursive: true });
  
  // Write index
  await writeFile(
    outputPath,
    JSON.stringify({ items: index, generatedAt: new Date().toISOString() }, null, 2)
  );

  console.log(`✓ Generated index with ${index.length} items`);
  
  if (errors.length > 0) {
    console.warn("Warnings:");
    errors.forEach((e) => console.warn(`  - ${e}`));
  }
}

async function fileExists(path: string): Promise<boolean> {
  try {
    await readFile(path);
    return true;
  } catch {
    return false;
  }
}

buildIndex();
```

### 9.2 Index Schema

```json
{
  "items": [
    {
      "id": "hero-split-image",
      "type": "section",
      "name": "Hero — Split Image",
      "description": "Classic hero with headline left, image right.",
      "tags": ["hero", "saas", "marketing"],
      "collections": ["SaaS Landing"],
      "status": "ready",
      "createdAt": "2026-01-03",
      "updatedAt": "2026-01-03",
      "tech": { "styling": ["tailwind"] },
      "path": "items/sections/hero-split-image",
      "hasReadme": true
    }
  ],
  "generatedAt": "2026-01-03T12:00:00.000Z"
}
```

### 9.3 Search Implementation

```typescript
// apps/vault/lib/search.ts
import Fuse from "fuse.js";
import type { IndexEntry } from "@repo/registry/types";

const fuseOptions = {
  keys: [
    { name: "name", weight: 2 },
    { name: "description", weight: 1 },
    { name: "tags", weight: 1.5 },
    { name: "collections", weight: 1 },
  ],
  threshold: 0.3,
  includeScore: true,
};

export function createSearchIndex(items: IndexEntry[]) {
  return new Fuse(items, fuseOptions);
}

export function searchItems(
  fuse: Fuse<IndexEntry>,
  query: string,
  filters?: {
    type?: string;
    tags?: string[];
    collections?: string[];
    status?: string[];
  }
): IndexEntry[] {
  let results = query
    ? fuse.search(query).map((r) => r.item)
    : fuse.getIndex().docs as IndexEntry[];

  // Apply filters
  if (filters?.type) {
    results = results.filter((item) => item.type === filters.type);
  }
  if (filters?.tags?.length) {
    results = results.filter((item) =>
      filters.tags!.some((tag) => item.tags.includes(tag))
    );
  }
  if (filters?.collections?.length) {
    results = results.filter((item) =>
      filters.collections!.some((col) => item.collections.includes(col))
    );
  }
  if (filters?.status?.length) {
    results = results.filter((item) =>
      filters.status!.includes(item.status)
    );
  }

  return results;
}
```

---

## 10. Preview Rendering

### 10.1 Preview Map Generation

```typescript
// packages/registry/scripts/build-preview-map.ts
// Generates a map of item IDs to dynamic import functions

import { readdir, writeFile } from "fs/promises";
import path from "path";

async function buildPreviewMap() {
  const itemsDir = path.join(__dirname, "..", "src", "items");
  const outputPath = path.join(__dirname, "..", "src", "preview-map.ts");

  const imports: string[] = [];
  const entries: string[] = [];

  for (const typeDir of ["components", "sections", "templates"]) {
    const typePath = path.join(itemsDir, typeDir);
    
    try {
      const items = await readdir(typePath);
      
      for (const itemId of items) {
        const key = `${typeDir}/${itemId}`;
        imports.push(
          `"${key}": () => import("./items/${typeDir}/${itemId}/preview"),`
        );
      }
    } catch {
      // Directory doesn't exist
    }
  }

  const content = `// Auto-generated - do not edit
export const previewMap: Record<string, () => Promise<{ default: React.ComponentType }>> = {
  ${imports.join("\n  ")}
};
`;

  await writeFile(outputPath, content);
  console.log("✓ Generated preview map");
}

buildPreviewMap();
```

### 10.2 Preview Wrapper Component

```typescript
// apps/vault/components/preview/preview-renderer.tsx
"use client";

import { Suspense, lazy, useState, useEffect } from "react";
import { previewMap } from "@repo/registry/preview-map";
import { PreviewErrorBoundary } from "./error-boundary";
import { PreviewSkeleton } from "./skeleton";

type Props = {
  itemPath: string; // e.g., "sections/hero-split-image"
  breakpoint: "mobile" | "tablet" | "desktop";
  theme: "light" | "dark";
};

const breakpointWidths = {
  mobile: 375,
  tablet: 768,
  desktop: 1280,
};

export function PreviewRenderer({ itemPath, breakpoint, theme }: Props) {
  const [PreviewComponent, setPreviewComponent] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    const loader = previewMap[itemPath];
    if (loader) {
      loader().then((mod) => setPreviewComponent(() => mod.default));
    }
  }, [itemPath]);

  if (!PreviewComponent) {
    return <PreviewSkeleton />;
  }

  return (
    <PreviewErrorBoundary>
      <div
        className={`mx-auto transition-all duration-300 ${theme === "dark" ? "dark" : ""}`}
        style={{ width: breakpointWidths[breakpoint] }}
      >
        <Suspense fallback={<PreviewSkeleton />}>
          <PreviewComponent />
        </Suspense>
      </div>
    </PreviewErrorBoundary>
  );
}
```

### 10.3 Error Boundary

```typescript
// apps/vault/components/preview/error-boundary.tsx
"use client";

import { Component, type ReactNode } from "react";

type Props = {
  children: ReactNode;
};

type State = {
  hasError: boolean;
  error: Error | null;
};

export class PreviewErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[200px] items-center justify-center rounded-lg border border-red-200 bg-red-50 p-8">
          <div className="text-center">
            <p className="text-sm font-medium text-red-800">Preview Error</p>
            <p className="mt-1 text-xs text-red-600">
              {this.state.error?.message || "Failed to render preview"}
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

---

## 11. Templates (v1 Catalog)

### 11.1 v1 Scope

Templates in v1 are **catalog-only**:

- Display metadata and description
- Show static screenshot or simple preview
- "Download" button shows "Coming Soon" tooltip
- README with contents/structure info

### 11.2 Template Meta Example

```typescript
// packages/registry/src/items/templates/saas-landing-v1/meta.ts
import type { Meta } from "../../../schema";

export const meta: Meta = {
  id: "saas-landing-v1",
  type: "template",
  name: "SaaS Landing Page",
  description: "Complete landing page with hero, features, pricing, testimonials, FAQ, and footer sections.",
  tags: ["saas", "landing", "marketing", "complete"],
  collections: ["Templates"],
  status: "draft", // Templates start as draft until download is ready
  createdAt: "2026-01-03",
  updatedAt: "2026-01-03",
  tech: {
    styling: ["tailwind"],
    motion: ["framer-motion"],
  },
};
```

### 11.3 Template Preview (Screenshot-Based)

```typescript
// packages/registry/src/items/templates/saas-landing-v1/preview.tsx
import Image from "next/image";

export default function SaasLandingV1Preview() {
  return (
    <div className="space-y-4">
      <Image
        src="/templates/saas-landing-v1/preview.png"
        alt="SaaS Landing Page Preview"
        width={1280}
        height={800}
        className="rounded-lg border"
      />
      <div className="text-sm text-gray-500">
        <p className="font-medium">Includes:</p>
        <ul className="mt-1 list-inside list-disc">
          <li>Hero with split image</li>
          <li>Feature grid (3 columns)</li>
          <li>Pricing table (3 tiers)</li>
          <li>Testimonial carousel</li>
          <li>FAQ accordion</li>
          <li>Footer with links</li>
        </ul>
      </div>
    </div>
  );
}
```

---

## 12. Implementation Phases

### Phase 1: Foundation (Milestone 1)

**Goal:** Working monorepo with basic vault app showing items

| Task | Description | Estimate |
|------|-------------|----------|
| 1.1 | Initialize pnpm workspace + Turborepo | 30 min |
| 1.2 | Create shared tsconfig package | 15 min |
| 1.3 | Create shared eslint-config package | 15 min |
| 1.4 | Create registry package structure | 30 min |
| 1.5 | Add Zod schema for meta | 20 min |
| 1.6 | Create 1 example component (testimonial-card) | 30 min |
| 1.7 | Create 1 example section (hero-split-image) | 45 min |
| 1.8 | Create 1 example template (saas-landing-v1 placeholder) | 20 min |
| 1.9 | Initialize Next.js 15 vault app | 30 min |
| 1.10 | Create basic page that lists items | 45 min |

**Acceptance:** `pnpm dev` runs vault app, shows 3 items in a list

### Phase 2: Workbench UI (Milestone 2)

**Goal:** Three-panel layout with filtering and preview

| Task | Description | Estimate |
|------|-------------|----------|
| 2.1 | Create sidebar layout component | 45 min |
| 2.2 | Implement search input with Fuse.js | 30 min |
| 2.3 | Add type filter (radio buttons) | 20 min |
| 2.4 | Add tag filter (checkboxes) | 30 min |
| 2.5 | Add collection filter | 20 min |
| 2.6 | Create preview canvas component | 45 min |
| 2.7 | Add breakpoint switcher | 30 min |
| 2.8 | Add theme toggle (light/dark) | 30 min |
| 2.9 | Create detail panel component | 45 min |
| 2.10 | Add README markdown rendering | 30 min |
| 2.11 | Wire up item selection → preview | 30 min |
| 2.12 | Add error boundary for previews | 20 min |

**Acceptance:** Can filter items, see live preview, read README

### Phase 3: Copy Source (Milestone 3)

**Goal:** Working copy-to-clipboard functionality

| Task | Description | Estimate |
|------|-------------|----------|
| 3.1 | Create /api/source route | 30 min |
| 3.2 | Create clipboard utility | 15 min |
| 3.3 | Add Copy Source button to detail panel | 20 min |
| 3.4 | Add Copy Path button | 10 min |
| 3.5 | Add toast notifications | 15 min |
| 3.6 | Test copied code compiles in fresh project | 30 min |

**Acceptance:** Copy a section, paste into fresh Next.js app, it renders

### Phase 4: Index Generator (Milestone 4)

**Goal:** Automated index generation from filesystem

| Task | Description | Estimate |
|------|-------------|----------|
| 4.1 | Create build-index.ts script | 45 min |
| 4.2 | Create build-preview-map.ts script | 30 min |
| 4.3 | Add Turborepo task for index generation | 15 min |
| 4.4 | Update vault app to consume index.json | 30 min |
| 4.5 | Add "recently updated" sorting | 20 min |
| 4.6 | Validate all metas on build | 20 min |

**Acceptance:** Add new item folder → run build → appears in vault

### Phase 5: Polish (Milestone 5)

**Goal:** Production-quality experience

| Task | Description | Estimate |
|------|-------------|----------|
| 5.1 | Prettier formatting for copied code | 30 min |
| 5.2 | Add loading states throughout | 30 min |
| 5.3 | Add keyboard shortcuts (Cmd+K search, Cmd+C copy) | 45 min |
| 5.4 | Visual polish on vault UI | 60 min |
| 5.5 | Add background toggle for preview | 20 min |
| 5.6 | Add item count stats in footer | 15 min |
| 5.7 | Performance optimization (virtualized list) | 45 min |

**Acceptance:** Vault feels polished, fast, and professional

---

## 13. Starter Items

### 13.1 Components (2)

| ID | Name | Description |
|----|------|-------------|
| `testimonial-card` | Testimonial Card | Quote with avatar, name, title, motion hover |
| `feature-card` | Feature Card | Icon, heading, description |

### 13.2 Sections (3)

| ID | Name | Description |
|----|------|-------------|
| `hero-split-image` | Hero — Split Image | Headline left, image right, CTAs |
| `pricing-grid` | Pricing Grid | 3-tier pricing cards with feature lists |
| `faq-accordion` | FAQ Accordion | Expandable Q&A items |

### 13.3 Templates (1)

| ID | Name | Description |
|----|------|-------------|
| `saas-landing-v1` | SaaS Landing Page | Complete landing (hero + features + pricing + faq + footer) |

---

## 14. Acceptance Criteria

### 14.1 Overall Success

- [ ] Open vault in <3 seconds on localhost
- [ ] Find any item in <10 seconds via search/filter
- [ ] Previews render without errors for all items
- [ ] Copied code compiles in fresh Next.js + Tailwind project
- [ ] Adding new item = create folder + files, run build

### 14.2 Per-Phase Checklists

**Phase 1 Complete When:**
- [ ] `pnpm install` succeeds
- [ ] `pnpm dev` starts vault app
- [ ] 3 example items render in list
- [ ] Preview loads for each item

**Phase 2 Complete When:**
- [ ] Three-panel layout renders correctly
- [ ] Search filters items in real-time
- [ ] Type/tag/collection filters work
- [ ] Breakpoint switcher changes preview width
- [ ] Theme toggle switches light/dark

**Phase 3 Complete When:**
- [ ] Copy Source button copies TSX to clipboard
- [ ] Toast confirms copy
- [ ] Pasted code renders in fresh project

**Phase 4 Complete When:**
- [ ] `pnpm build:index` generates index.json
- [ ] New items appear after rebuild
- [ ] Invalid meta shows build error

**Phase 5 Complete When:**
- [ ] Copied code is Prettier-formatted
- [ ] Keyboard shortcuts work
- [ ] Vault feels polished

---

## 15. Future Extensions

### 15.1 Near-Term (v1.1)

- [ ] Favorites / pinboard
- [ ] "Copy JSX usage" button
- [ ] More example items (10+)
- [ ] Screenshot automation for templates
- [ ] Syntax highlighting in README code blocks

### 15.2 Medium-Term (v2)

- [ ] Template ZIP download
- [ ] Multiple variants per item (style themes)
- [ ] Figma export annotations
- [ ] VS Code extension

### 15.3 Long-Term (v3+)

- [ ] Public mode + authentication
- [ ] Payment integration
- [ ] User submissions
- [ ] AI-powered search
- [ ] Component composition builder

---

## Appendix A: Commands Reference

```bash
# Install dependencies
pnpm install

# Start development
pnpm dev

# Build all packages
pnpm build

# Generate registry index
pnpm --filter @repo/registry build:index

# Lint
pnpm lint

# Type check
pnpm typecheck

# Add a new workspace package
pnpm create turbo@latest --package-manager pnpm
```

---

## Appendix B: Environment Variables

```bash
# apps/vault/.env.local

# None required for v1 (file-based, no DB)
# Future: Analytics, Auth, etc.
```

---

## Appendix C: Tech Stack Summary

| Category | Technology | Version |
|----------|------------|---------|
| Runtime | Node.js | 20+ |
| Package Manager | pnpm | 8+ |
| Monorepo | Turborepo | 2+ |
| Framework | Next.js | 15 |
| Language | TypeScript | 5.3+ |
| Styling | Tailwind CSS | 4.0 |
| Validation | Zod | 3.22+ |
| Search | Fuse.js | 7+ |
| Markdown | react-markdown | 9+ |
| Toasts | sonner | 1+ |

---

*Document maintained by Claude Code. Last updated: 2026-01-03*

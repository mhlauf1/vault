"use client";

import { useState, useMemo, useCallback, useEffect, lazy, Suspense } from "react";
import { meta as testimonialCardMeta } from "@repo/registry/items/components/testimonial-card/meta";
import { meta as heroSplitImageMeta } from "@repo/registry/items/sections/hero-split-image/meta";
import { meta as saasLandingMeta } from "@repo/registry/items/templates/saas-landing-v1/meta";
import type { Meta } from "@repo/registry/schema";

import { Sidebar } from "@/components/layout/sidebar";
import { PreviewCanvas } from "@/components/layout/preview-canvas";
import { DetailPanel } from "@/components/layout/detail-panel";
import { createSearchIndex, searchItems } from "@/lib/search";
import type { Breakpoint } from "@/components/preview/breakpoint-switcher";
import type { Theme } from "@/components/preview/theme-toggle";
import type { Background } from "@/components/preview/background-toggle";

// Hardcoded items for Phase 2 (will be replaced by index.json in Phase 4)
const allItems: Meta[] = [
  testimonialCardMeta,
  heroSplitImageMeta,
  saasLandingMeta,
];

// Preview components map (Phase 2 - hardcoded, will be generated in Phase 4)
const TestimonialCardPreview = lazy(
  () => import("@repo/registry/items/components/testimonial-card/preview")
);
const HeroSplitImagePreview = lazy(
  () => import("@repo/registry/items/sections/hero-split-image/preview")
);
const SaasLandingPreview = lazy(
  () => import("@repo/registry/items/templates/saas-landing-v1/preview")
);

const previewComponents: Record<string, React.LazyExoticComponent<React.ComponentType>> = {
  "testimonial-card": TestimonialCardPreview,
  "hero-split-image": HeroSplitImagePreview,
  "saas-landing-v1": SaasLandingPreview,
};

// README content map (Phase 2 - would be loaded from files in Phase 4)
const readmeContent: Record<string, string> = {
  "testimonial-card": `# Testimonial Card

A clean testimonial card component with avatar support and subtle hover animation.

## Props

- \`quote\` (string, required): The testimonial text
- \`author\` (object, required): Author information
  - \`name\` (string): Author's name
  - \`title\` (string): Author's job title
  - \`avatar\` (string, optional): URL to avatar image

## Usage

\`\`\`tsx
<TestimonialCard
  quote="This product changed our workflow..."
  author={{
    name: "John Doe",
    title: "CEO, Company",
    avatar: "/avatar.jpg"
  }}
/>
\`\`\`
`,
  "hero-split-image": `# Hero — Split Image

A classic hero section with headline on the left and image on the right. Includes primary and secondary CTA buttons.

## Props

- \`headline\` (string, required): Main heading text
- \`subheadline\` (string): Supporting text
- \`primaryCta\` (object): Primary button
- \`secondaryCta\` (object): Secondary button
- \`image\` (object, required): Hero image

## Features

- Fully responsive layout
- Built-in Button component
- Customizable CTAs
- Optimized image container
`,
  "saas-landing-v1": `# SaaS Landing Page Template

A complete landing page template for SaaS products.

## Includes

- Hero section with split image
- Feature grid (3 columns)
- Pricing table (3 tiers)
- Testimonial carousel
- FAQ accordion
- Footer with links

## Status

Template download coming soon. Currently available for preview only.
`,
};

export default function Workbench() {
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);

  // Selection state
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Preview state
  const [breakpoint, setBreakpoint] = useState<Breakpoint>("desktop");
  const [theme, setTheme] = useState<Theme>("light");
  const [background, setBackground] = useState<Background>("white");

  // Copy state
  const [isCopying, setIsCopying] = useState(false);
  const [copySuccess, setCopySuccess] = useState<boolean | null>(null);

  // Platform detection for keyboard shortcuts
  const [isMac, setIsMac] = useState(false);
  useEffect(() => {
    setIsMac(navigator.platform?.includes("Mac") ?? false);
  }, []);

  // Create search index
  const searchIndex = useMemo(() => createSearchIndex(allItems), []);

  // Filter items
  const filteredItems = useMemo(() => {
    return searchItems(searchIndex, searchQuery, {
      type: typeFilter,
      tags: selectedTags,
      collections: selectedCollections,
    });
  }, [searchIndex, searchQuery, typeFilter, selectedTags, selectedCollections]);

  // Get selected item
  const selectedItem = useMemo(
    () => allItems.find((item) => item.id === selectedId) || null,
    [selectedId]
  );

  // Get preview component
  const PreviewComponent = selectedId ? previewComponents[selectedId] : null;

  // Get README content
  const readme = selectedId ? readmeContent[selectedId] || null : null;

  // Handle copy source
  const handleCopySource = useCallback(async () => {
    if (!selectedItem || selectedItem.type === "template") return;

    setIsCopying(true);
    setCopySuccess(null);

    try {
      // Fetch source from API (to be implemented in Phase 3)
      // For now, show success after delay
      const response = await fetch(
        `/api/source?type=${selectedItem.type}&id=${selectedItem.id}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch source");
      }

      const { source } = await response.json();
      await navigator.clipboard.writeText(source);
      setCopySuccess(true);
    } catch (error) {
      console.error("Copy failed:", error);
      setCopySuccess(false);
    } finally {
      setIsCopying(false);
      // Reset success state after delay
      setTimeout(() => setCopySuccess(null), 2000);
    }
  }, [selectedItem]);

  // Handle copy path
  const handleCopyPath = useCallback(async () => {
    if (!selectedItem) return;

    const pluralType =
      selectedItem.type === "component"
        ? "components"
        : selectedItem.type === "section"
          ? "sections"
          : "templates";

    const path = `items/${pluralType}/${selectedItem.id}/source.tsx`;

    try {
      await navigator.clipboard.writeText(path);
    } catch (error) {
      console.error("Copy path failed:", error);
    }
  }, [selectedItem]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K to focus search
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        const searchInput = document.querySelector<HTMLInputElement>(
          'input[placeholder="Search items..."]'
        );
        searchInput?.focus();
      }

      // Arrow up/down to navigate items
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        const currentIndex = filteredItems.findIndex(
          (item) => item.id === selectedId
        );
        let newIndex: number;

        if (e.key === "ArrowDown") {
          newIndex =
            currentIndex < filteredItems.length - 1 ? currentIndex + 1 : 0;
        } else {
          newIndex =
            currentIndex > 0 ? currentIndex - 1 : filteredItems.length - 1;
        }

        if (filteredItems[newIndex]) {
          setSelectedId(filteredItems[newIndex].id);
        }
      }

      // Escape to clear selection
      if (e.key === "Escape") {
        setSelectedId(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [filteredItems, selectedId]);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-gray-50">
      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          items={filteredItems}
          selectedId={selectedId}
          onSelectItem={setSelectedId}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          typeFilter={typeFilter}
          onTypeFilterChange={setTypeFilter}
          selectedTags={selectedTags}
          onTagsChange={setSelectedTags}
          selectedCollections={selectedCollections}
          onCollectionsChange={setSelectedCollections}
        />

        {/* Preview Canvas */}
        <PreviewCanvas
          item={selectedItem}
          breakpoint={breakpoint}
          onBreakpointChange={setBreakpoint}
          theme={theme}
          onThemeChange={setTheme}
          background={background}
          onBackgroundChange={setBackground}
        >
          {PreviewComponent && (
            <Suspense
              fallback={
                <div className="flex h-64 items-center justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
                </div>
              }
            >
              <PreviewComponent />
            </Suspense>
          )}
        </PreviewCanvas>

        {/* Detail Panel */}
        <DetailPanel
          item={selectedItem}
          readme={readme}
          onCopySource={handleCopySource}
          onCopyPath={handleCopyPath}
          isCopying={isCopying}
          copySuccess={copySuccess}
        />
      </div>

      {/* Footer */}
      <footer className="flex h-10 items-center justify-between border-t border-gray-200 bg-white px-4 text-xs text-gray-500">
        <div className="flex items-center gap-4">
          <span>{allItems.length} items</span>
          <span className="text-gray-300">|</span>
          <span>
            {allItems.filter((i) => i.type === "component").length} components
          </span>
          <span className="text-gray-300">|</span>
          <span>
            {allItems.filter((i) => i.type === "section").length} sections
          </span>
          <span className="text-gray-300">|</span>
          <span>
            {allItems.filter((i) => i.type === "template").length} templates
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-400">
            <kbd className="rounded bg-gray-100 px-1.5 py-0.5 font-mono">
              {isMac ? "⌘" : "Ctrl"}
            </kbd>
            <span className="mx-1">+</span>
            <kbd className="rounded bg-gray-100 px-1.5 py-0.5 font-mono">K</kbd>
            <span className="ml-1.5">Search</span>
          </span>
        </div>
      </footer>
    </div>
  );
}

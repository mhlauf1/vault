# Personal UI Vault — Task Breakdown

> **For:** Claude Code Sub-Agent Execution
> **Reference:** [SPEC.md](./SPEC.md) | [SECURITY.md](./SECURITY.md)
> **Status Legend:** ⬜ Not Started | 🔄 In Progress | ✅ Complete | ⏸️ Blocked

---

## Phase 1: Foundation

### 1.1 Initialize Monorepo
**Status:** ✅
**Estimate:** 30 min

```
Create vault-workspace directory with:
- pnpm-workspace.yaml
- turbo.json
- package.json (root)
- .gitignore
- .npmrc (for pnpm settings)

Commands to run:
- mkdir vault-workspace && cd vault-workspace
- pnpm init
- Configure workspace structure
```

**Acceptance:**
- [x] `pnpm install` runs without error
- [x] Turborepo config recognizes workspaces

---

### 1.2 Create tsconfig Package
**Status:** ✅
**Estimate:** 15 min

```
packages/tsconfig/
├── base.json
├── nextjs.json
├── react-library.json
└── package.json
```

**Acceptance:**
- [x] Other packages can extend from `@repo/tsconfig/base.json`

---

### 1.3 Create eslint-config Package
**Status:** ✅
**Estimate:** 15 min

```
packages/eslint-config/
├── base.js
├── next.js
├── react-internal.js
└── package.json
```

**Acceptance:**
- [x] `pnpm lint` works from root

---

### 1.4 Create Registry Package Structure
**Status:** ✅
**Estimate:** 30 min

```
packages/registry/
├── src/
│   ├── items/
│   │   ├── components/
│   │   │   └── .gitkeep
│   │   ├── sections/
│   │   │   └── .gitkeep
│   │   └── templates/
│   │       └── .gitkeep
│   ├── schema.ts
│   └── types.ts
├── scripts/
│   └── .gitkeep
├── package.json
└── tsconfig.json
```

**Acceptance:**
- [x] Package compiles with `pnpm build`
- [x] Types export correctly

---

### 1.5 Add Zod Schema
**Status:** ✅
**Estimate:** 20 min

**File:** `packages/registry/src/schema.ts`

Implement:
- ItemType enum
- ItemStatus enum
- TechStack object
- MetaSchema (full validation)
- Export types

**Acceptance:**
- [x] Schema validates correct meta objects
- [x] Schema rejects invalid meta objects
- [x] Types are exported for use

---

### 1.6 Create Example Component: testimonial-card
**Status:** ✅
**Estimate:** 30 min

```
packages/registry/src/items/components/testimonial-card/
├── meta.ts
├── preview.tsx
├── source.tsx
└── README.md
```

**Source requirements:**
- Props: quote, author (name, title, avatar)
- Tailwind styling
- Subtle hover animation (scale or shadow)

**Acceptance:**
- [x] meta.ts validates against schema
- [x] preview.tsx renders component
- [x] source.tsx is self-contained

---

### 1.7 Create Example Section: hero-split-image
**Status:** ✅
**Estimate:** 45 min

```
packages/registry/src/items/sections/hero-split-image/
├── meta.ts
├── preview.tsx
├── source.tsx
└── README.md
```

**Source requirements:**
- Props: headline, subheadline, primaryCta, secondaryCta, image
- Internal Button component
- Responsive grid layout
- 100% standalone

**Acceptance:**
- [x] Passes standalone test (paste into fresh project)
- [x] Preview renders correctly
- [x] Mobile/tablet/desktop responsive

---

### 1.8 Create Example Template: saas-landing-v1
**Status:** ✅
**Estimate:** 20 min

```
packages/registry/src/items/templates/saas-landing-v1/
├── meta.ts
├── preview.tsx (screenshot-based)
└── README.md
```

**Note:** No source.tsx for v1 templates

**Acceptance:**
- [x] meta.ts validates
- [x] preview.tsx shows placeholder/screenshot

---

### 1.9 Initialize Next.js Vault App
**Status:** ✅
**Estimate:** 30 min

```bash
cd apps
pnpm create next-app vault --typescript --tailwind --app --src-dir --import-alias "@/*"
```

**Configure:**
- Update package.json name to `@repo/vault`
- Set up Tailwind to include registry paths
- Configure tsconfig to extend shared config
- Add registry as dependency

**Acceptance:**
- [x] `pnpm dev --filter @repo/vault` starts app
- [x] Tailwind works
- [x] Can import from registry package

---

### 1.10 Create Basic Items List Page
**Status:** ✅
**Estimate:** 45 min

**File:** `apps/vault/app/page.tsx`

Implement:
- Read items from registry (hardcoded import for now)
- Display as simple list with name, type, description
- Click item → log to console (navigation in Phase 2)

**Acceptance:**
- [x] Shows 3 example items
- [x] Each item shows name, type, description

---

## Phase 2: Workbench UI

### 2.1 Create Sidebar Layout
**Status:** ✅
**Estimate:** 45 min

**File:** `apps/vault/src/components/layout/sidebar.tsx`

Implement:
- Fixed width (280px)
- Logo/title at top
- Container for filters
- Scrollable item list area

**Acceptance:**
- [x] Sidebar renders
- [x] Scrolls independently

---

### 2.2 Implement Search with Fuse.js
**Status:** ✅
**Estimate:** 30 min

**Files:**
- `apps/vault/src/lib/search.ts`
- `apps/vault/src/components/ui/search-input.tsx`

Implement:
- Fuse.js configuration
- Search input with debounce (300ms)
- Real-time filtering

**Acceptance:**
- [x] Typing filters items
- [x] Clear button resets

---

### 2.3 Add Type Filter
**Status:** ✅
**Estimate:** 20 min

**File:** `apps/vault/src/components/filters/type-filter.tsx`

Implement:
- Radio buttons: All, Components, Sections, Templates
- Updates URL params
- Shows count per type

**Acceptance:**
- [x] Selecting type filters list
- [x] "All" shows everything

---

### 2.4 Add Tag Filter
**Status:** ✅
**Estimate:** 30 min

**File:** `apps/vault/src/components/filters/tag-filter.tsx`

Implement:
- Collect all unique tags from items
- Checkbox multi-select
- AND/OR toggle (default OR)

**Acceptance:**
- [x] Tags show with counts
- [x] Selecting tags filters list

---

### 2.5 Add Collection Filter
**Status:** ✅
**Estimate:** 20 min

**File:** `apps/vault/src/components/filters/collection-filter.tsx`

Implement:
- Collect all unique collections
- Checkbox multi-select

**Acceptance:**
- [x] Collections filter works

---

### 2.6 Create Preview Canvas
**Status:** ✅
**Estimate:** 45 min

**File:** `apps/vault/src/components/layout/preview-canvas.tsx`

Implement:
- Centered preview area
- Max-width container with transition
- Toolbar for controls
- Preview render area

**Acceptance:**
- [x] Preview area displays
- [x] Has placeholder when no item selected

---

### 2.7 Add Breakpoint Switcher
**Status:** ✅
**Estimate:** 30 min

**File:** `apps/vault/src/components/preview/breakpoint-switcher.tsx`

Implement:
- Buttons: Mobile (375), Tablet (768), Desktop (1280)
- Updates preview container width
- Visual indicator for selected

**Acceptance:**
- [x] Clicking changes preview width
- [x] Transition is smooth

---

### 2.8 Add Theme Toggle
**Status:** ✅
**Estimate:** 30 min

**File:** `apps/vault/src/components/preview/theme-toggle.tsx`

Implement:
- Light/Dark toggle
- Applies `dark` class to preview container
- Icons for each mode

**Acceptance:**
- [x] Toggle switches theme
- [x] Preview content responds to theme

---

### 2.9 Create Detail Panel
**Status:** ✅
**Estimate:** 45 min

**File:** `apps/vault/src/components/layout/detail-panel.tsx`

Implement:
- Fixed width (360px)
- Item name + status badge
- Description
- Tags as pills
- Tech stack badges
- Action buttons area
- README area

**Acceptance:**
- [x] Shows selected item details
- [x] Scrolls independently

---

### 2.10 Add README Rendering
**Status:** ✅
**Estimate:** 30 min

**Dependencies:** `react-markdown`, `remark-gfm`

**File:** `apps/vault/src/components/ui/readme-viewer.tsx`

Implement:
- Fetch README.md content
- Render markdown with syntax highlighting
- Handle missing README gracefully

**Acceptance:**
- [x] README displays formatted
- [x] Code blocks have syntax highlighting

---

### 2.11 Wire Up Item Selection
**Status:** ✅
**Estimate:** 30 min

Implement:
- Click item in sidebar → update URL
- URL change → load preview + details
- Keyboard navigation (up/down arrows)

**Acceptance:**
- [x] Clicking item updates view
- [x] URL reflects selected item
- [x] Deep linking works

---

### 2.12 Add Error Boundary
**Status:** ✅
**Estimate:** 20 min

**File:** `apps/vault/src/components/preview/error-boundary.tsx`

Implement:
- Class component with error boundary
- Friendly error UI
- "Retry" button
- Dev mode: show stack trace

**Acceptance:**
- [x] Broken preview shows error UI
- [x] Can recover from errors

---

## Phase 3: Copy Source

### 3.1 Create /api/source Route
**Status:** ⬜  
**Estimate:** 30 min

**File:** `apps/vault/app/api/source/route.ts`

Implement:
- GET handler with type + id params
- Validate inputs
- Read source.tsx from filesystem
- Return raw text content
- Handle file not found

**Acceptance:**
- [ ] `/api/source?type=section&id=hero-split-image` returns TSX
- [ ] Invalid params return 400
- [ ] Missing file returns 404

---

### 3.2 Create Clipboard Utility
**Status:** ⬜  
**Estimate:** 15 min

**File:** `apps/vault/lib/clipboard.ts`

Implement:
- `copySource(type, id)` function
- Fetch from API
- Write to clipboard
- Return success/failure

**Acceptance:**
- [ ] Function copies text to clipboard
- [ ] Works in all browsers

---

### 3.3 Add Copy Source Button
**Status:** ⬜  
**Estimate:** 20 min

**File:** Update `detail-panel.tsx`

Implement:
- "Copy Source" button
- Loading state while fetching
- Success/error feedback
- Icon (clipboard)

**Acceptance:**
- [ ] Button triggers copy
- [ ] Shows loading during fetch
- [ ] Shows success state

---

### 3.4 Add Copy Path Button
**Status:** ⬜  
**Estimate:** 10 min

Implement:
- "Copy Path" secondary button
- Copies relative path to source file

**Acceptance:**
- [ ] Copies path like `items/sections/hero-split-image/source.tsx`

---

### 3.5 Add Toast Notifications
**Status:** ⬜  
**Estimate:** 15 min

**Dependency:** `sonner`

Implement:
- Toast provider in layout
- Success toast: "Source copied to clipboard"
- Error toast: "Failed to copy source"

**Acceptance:**
- [ ] Toast appears on copy
- [ ] Toast auto-dismisses

---

### 3.6 Test Copied Code
**Status:** ⬜  
**Estimate:** 30 min

Manual test:
1. Create fresh Next.js + Tailwind project
2. Copy hero-split-image source
3. Paste into page.tsx
4. Verify it compiles and renders

**Acceptance:**
- [ ] No TypeScript errors
- [ ] No missing imports
- [ ] Renders correctly

---

## Phase 4: Index Generator

### 4.1 Create build-index.ts Script
**Status:** ⬜  
**Estimate:** 45 min

**File:** `packages/registry/scripts/build-index.ts`

Implement:
- Scan items directories
- Import and validate each meta.ts
- Generate index.json with all items
- Log warnings for invalid items

**Acceptance:**
- [ ] Script runs without error
- [ ] Generates valid index.json
- [ ] Validates all metas

---

### 4.2 Create build-preview-map.ts Script
**Status:** ⬜  
**Estimate:** 30 min

**File:** `packages/registry/scripts/build-preview-map.ts`

Implement:
- Generate preview-map.ts
- Dynamic imports for each item's preview
- Export map of id → loader function

**Acceptance:**
- [ ] Generates valid TypeScript
- [ ] All previews importable

---

### 4.3 Add Turborepo Task
**Status:** ⬜  
**Estimate:** 15 min

**File:** Update `turbo.json`

Implement:
- `build:index` task for registry
- Run before vault build
- Cache appropriately

**Acceptance:**
- [ ] `pnpm build:index` works
- [ ] Runs as dependency of vault build

---

### 4.4 Update Vault to Use Index
**Status:** ⬜  
**Estimate:** 30 min

Implement:
- Load index.json at build time
- Replace hardcoded imports
- Generate static params for routes

**Acceptance:**
- [ ] Items load from index
- [ ] No hardcoded item list

---

### 4.5 Add Recently Updated Sorting
**Status:** ⬜  
**Estimate:** 20 min

Implement:
- Sort by updatedAt descending
- "Recently Updated" section in sidebar
- Show top 5 recent items

**Acceptance:**
- [ ] Recent items appear first
- [ ] Section shows correctly

---

### 4.6 Validate Metas on Build
**Status:** ⬜  
**Estimate:** 20 min

Implement:
- Fail build if any meta is invalid
- Clear error message with file path
- List all validation errors

**Acceptance:**
- [ ] Invalid meta fails build
- [ ] Error shows which file

---

## Phase 5: Polish

### 5.1 Prettier Formatting
**Status:** ⬜  
**Estimate:** 30 min

Implement:
- Format source before returning from API
- Use Prettier with TypeScript parser
- Consistent formatting

**Acceptance:**
- [ ] Copied code is formatted
- [ ] No extra whitespace

---

### 5.2 Add Loading States
**Status:** ⬜  
**Estimate:** 30 min

Implement:
- Skeleton for item list
- Skeleton for preview
- Skeleton for detail panel
- Loading spinner for copy

**Acceptance:**
- [ ] All areas have loading states
- [ ] No layout shift

---

### 5.3 Add Keyboard Shortcuts
**Status:** ⬜  
**Estimate:** 45 min

Implement:
- `Cmd/Ctrl + K` → Focus search
- `Cmd/Ctrl + C` → Copy source (when item selected)
- `↑/↓` → Navigate items
- `Enter` → Select item
- `Escape` → Clear selection

**Acceptance:**
- [ ] All shortcuts work
- [ ] Shortcuts shown in UI hints

---

### 5.4 Visual Polish
**Status:** ⬜  
**Estimate:** 60 min

Implement:
- Smooth transitions
- Hover states
- Focus rings
- Border treatments
- Typography hierarchy

**Acceptance:**
- [ ] UI looks professional
- [ ] Consistent design language

---

### 5.5 Add Background Toggle
**Status:** ⬜  
**Estimate:** 20 min

Implement:
- White / Grid / Dots backgrounds
- Toggle in preview toolbar
- Helps visualize spacing

**Acceptance:**
- [ ] All backgrounds work
- [ ] Persists selection

---

### 5.6 Add Stats Footer
**Status:** ⬜  
**Estimate:** 15 min

Implement:
- Total items count
- Count per type
- Last updated timestamp

**Acceptance:**
- [ ] Footer shows accurate stats

---

### 5.7 Virtualized List
**Status:** ⬜  
**Estimate:** 45 min

**Dependency:** `@tanstack/react-virtual`

Implement:
- Virtual scrolling for item list
- Handles 100+ items smoothly
- Maintains scroll position

**Acceptance:**
- [ ] Large lists scroll smoothly
- [ ] Memory usage stays low

---

## Quick Reference

### Running Tasks

Each task should be executed by a Claude Code sub-agent:

```
Task: [Task Number] [Task Name]
Spec: See SPEC.md section [X]
Files to create/modify: [list]
```

### After Each Task

1. Run `pnpm build` to verify no errors
2. Run `pnpm lint` to check code quality
3. Test the specific acceptance criteria
4. Update task status in this file

### Task Dependencies

```
1.1 → 1.2 → 1.3 → 1.4 → 1.5
                    ↓
              1.6, 1.7, 1.8
                    ↓
                   1.9
                    ↓
                   1.10
                    ↓
            Phase 2 (any order within phase)
                    ↓
            Phase 3 (sequential)
                    ↓
            Phase 4 (sequential)
                    ↓
            Phase 5 (any order)
```

---

## Progress Tracking

| Phase | Tasks | Complete | Progress |
|-------|-------|----------|----------|
| 1. Foundation | 10 | 10 | ██████████ 100% |
| 2. Workbench UI | 12 | 12 | ██████████ 100% |
| 3. Copy Source | 6 | 0 | ░░░░░░░░░░ 0% |
| 4. Index Generator | 6 | 0 | ░░░░░░░░░░ 0% |
| 5. Polish | 7 | 0 | ░░░░░░░░░░ 0% |
| **Total** | **41** | **22** | █████░░░░░ 54% |

### Phase 1 Status Summary - COMPLETE

| Task | Status | Notes |
|------|--------|-------|
| 1.1 Initialize Monorepo | ✅ | pnpm-workspace.yaml, turbo.json configured |
| 1.2 tsconfig Package | ✅ | base.json, nextjs.json, react-library.json |
| 1.3 eslint-config Package | ✅ | base.js configured |
| 1.4 Registry Package | ✅ | Structure and package.json complete |
| 1.5 Zod Schema | ✅ | Full MetaSchema with validation |
| 1.6 testimonial-card | ✅ | Component with meta, preview, source, README |
| 1.7 hero-split-image | ✅ | Section with standalone source, internal Button |
| 1.8 saas-landing-v1 | ✅ | Template placeholder with preview |
| 1.9 Vault App | ✅ | Integrated with monorepo as @repo/vault |
| 1.10 Items List Page | ✅ | Shows 3 items with type/status badges, tags |

### Phase 2 Status Summary - COMPLETE

| Task | Status | Notes |
|------|--------|-------|
| 2.1 Sidebar Layout | ✅ | Fixed width, logo, filters, scrollable list |
| 2.2 Search with Fuse.js | ✅ | Debounced search input with real-time filtering |
| 2.3 Type Filter | ✅ | Radio buttons with counts |
| 2.4 Tag Filter | ✅ | Checkbox multi-select with counts |
| 2.5 Collection Filter | ✅ | Checkbox multi-select |
| 2.6 Preview Canvas | ✅ | Centered preview with toolbar controls |
| 2.7 Breakpoint Switcher | ✅ | Mobile/Tablet/Desktop with smooth transitions |
| 2.8 Theme Toggle | ✅ | Light/Dark mode toggle |
| 2.9 Detail Panel | ✅ | Item info, tags, tech stack, actions |
| 2.10 README Rendering | ✅ | react-markdown with syntax highlighting |
| 2.11 Item Selection | ✅ | Click to select, keyboard navigation |
| 2.12 Error Boundary | ✅ | Error UI with retry, dev mode stack trace |

---

*Last updated: 2026-01-03*

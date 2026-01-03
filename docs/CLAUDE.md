# CLAUDE.md - Project Context for Claude Code

## Project Overview

**Personal UI Vault** - A Relume-lite workbench for browsing, previewing, and copying personal UI components/sections/templates.

## Tech Stack

- **Monorepo:** Turborepo + pnpm workspaces
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS 4
- **Validation:** Zod
- **Search:** Fuse.js

## Key Directories

```
vault-workspace/
├── apps/vault/              # Next.js workbench app
├── packages/registry/       # Items (components, sections, templates)
├── packages/tsconfig/       # Shared TS config
├── packages/eslint-config/  # Shared linting
└── docs/                    # SPEC.md and TASKS.md
```

## Critical Rules

### 1. Sections Must Be Standalone

Every section's `source.tsx` must work in ANY Next.js + Tailwind project with zero modifications:

- ❌ No imports from other registry items
- ❌ No imports from vault app
- ✅ Internal sub-components defined in same file
- ✅ Only React, Next.js, and declared dependencies (framer-motion, etc.)

### 2. Item Structure

Every item requires:
```
items/{type}/{id}/
├── meta.ts      # Required - metadata
├── preview.tsx  # Required - vault preview
├── source.tsx   # Required - code users copy
└── README.md    # Optional - usage notes
```

### 3. Meta Schema

```typescript
{
  id: "lowercase-with-hyphens",
  type: "component" | "section" | "template",
  name: "Display Name",
  description: "Brief description (max 500 chars)",
  tags: ["at", "least", "one"],
  collections: [],           // optional
  status: "draft" | "ready", // default: draft
  createdAt: "YYYY-MM-DD",
  updatedAt: "YYYY-MM-DD",
  tech: { styling: ["tailwind"] }
}
```

## Common Commands

```bash
# Development
pnpm dev                    # Start all dev servers
pnpm dev --filter @repo/vault  # Start vault only

# Building
pnpm build                  # Build all packages
pnpm build:index            # Generate registry index

# Linting & Types
pnpm lint                   # Run ESLint
pnpm typecheck              # Run TypeScript check
```

## Task Execution Pattern

When executing tasks from TASKS.md:

1. Read the task description and acceptance criteria
2. Reference SPEC.md for detailed requirements
3. Implement the task
4. Run `pnpm build` to verify
5. Run `pnpm lint` to check quality
6. Test acceptance criteria
7. Update task status in TASKS.md

## File Naming Conventions

- **Components/Sections:** lowercase-with-hyphens (e.g., `hero-split-image`)
- **React components:** PascalCase (e.g., `HeroSplitImage`)
- **Files:** lowercase or kebab-case (e.g., `preview-canvas.tsx`)

## Testing Standalone Sections

After creating a section, verify it works:

1. Create fresh Next.js + Tailwind project
2. Copy `source.tsx` contents
3. Paste into a page component
4. Verify: No TS errors, renders correctly

## Reference Documents

- **SPEC.md** - Complete implementation specification
- **TASKS.md** - Granular task breakdown with status tracking

## Notes for Sub-Agents

- Always check current task status in TASKS.md before starting
- Update task status to 🔄 when starting, ✅ when complete
- If blocked, update to ⏸️ and note the blocker
- Reference SPEC.md section numbers in commit messages
- Run build verification after each task

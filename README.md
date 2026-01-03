# Personal UI Vault

A personal component/section/template workbench. Browse, preview, and copy source code for your UI library.

## Quick Start

```bash
# Install dependencies
pnpm install

# Start development
pnpm dev

# Build all packages
pnpm build

# Generate registry index
pnpm build:index
```

## Project Structure

```
vault-workspace/
├── apps/
│   └── vault/          # Next.js workbench UI
├── packages/
│   ├── registry/       # Components, sections, templates
│   ├── eslint-config/  # Shared ESLint config
│   └── tsconfig/       # Shared TypeScript config
└── docs/
    ├── SPEC.md         # Full specification
    └── TASKS.md        # Task breakdown
```

## Adding New Items

1. Create folder in `packages/registry/src/items/{type}/{id}/`
2. Add `meta.ts`, `preview.tsx`, `source.tsx`
3. Run `pnpm build:index`

See [SPEC.md](./docs/SPEC.md) for details.
# vault

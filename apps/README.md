# Apps

## vault

The main workbench UI. Initialize with:

```bash
cd apps
pnpm create next-app vault --typescript --tailwind --app --src-dir --import-alias "@/*"
```

Then configure:
1. Update `package.json` name to `@repo/vault`
2. Add `@repo/registry` as dependency
3. Update `tailwind.config.ts` to include registry paths
4. Update `tsconfig.json` to extend `@repo/tsconfig/nextjs.json`

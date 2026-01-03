import { readdir, writeFile, mkdir, access } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { MetaSchema } from "../src/schema.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

type IndexEntry = {
  id: string;
  type: string;
  name: string;
  description: string;
  tags: string[];
  collections: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
  tech: Record<string, string[]>;
  path: string;
  hasReadme: boolean;
};

async function fileExists(filepath: string): Promise<boolean> {
  try {
    await access(filepath);
    return true;
  } catch {
    return false;
  }
}

async function buildIndex() {
  const itemsDir = path.join(__dirname, "..", "src", "items");
  const outputDir = path.join(__dirname, "..", "dist");
  const outputPath = path.join(outputDir, "index.json");

  const index: IndexEntry[] = [];
  const errors: string[] = [];

  const typeDirs = ["components", "sections", "templates"];

  for (const typeDir of typeDirs) {
    const typePath = path.join(itemsDir, typeDir);

    if (!(await fileExists(typePath))) {
      continue;
    }

    const items = await readdir(typePath);

    for (const itemId of items) {
      if (itemId.startsWith(".")) continue;

      const itemPath = path.join(typePath, itemId);
      const metaPath = path.join(itemPath, "meta.ts");

      if (!(await fileExists(metaPath))) {
        errors.push(`Missing meta.ts: ${typeDir}/${itemId}`);
        continue;
      }

      try {
        // Use dynamic import to load the meta file
        const metaModule = await import(metaPath);
        const meta = metaModule.meta;

        if (!meta) {
          errors.push(`No 'meta' export found: ${typeDir}/${itemId}`);
          continue;
        }

        // Validate with Zod
        const validated = MetaSchema.parse(meta);

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
  }

  // Ensure output directory exists
  await mkdir(outputDir, { recursive: true });

  // Write index
  await writeFile(
    outputPath,
    JSON.stringify(
      {
        items: index,
        generatedAt: new Date().toISOString(),
      },
      null,
      2
    )
  );

  console.log(`✓ Generated index with ${index.length} items`);

  if (errors.length > 0) {
    console.warn("\nWarnings:");
    errors.forEach((e) => console.warn(`  - ${e}`));
  }
}

buildIndex().catch(console.error);

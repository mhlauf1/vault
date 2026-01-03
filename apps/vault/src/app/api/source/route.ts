import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const id = searchParams.get("id");

  if (!type || !id) {
    return NextResponse.json({ error: "Missing type or id" }, { status: 400 });
  }

  // Validate type
  if (!["component", "section", "template"].includes(type)) {
    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  }

  // Validate id (prevent path traversal)
  if (!/^[a-z0-9-]+$/.test(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  // Construct path (pluralize type for folder)
  const pluralType =
    type === "component"
      ? "components"
      : type === "section"
        ? "sections"
        : "templates";

  const sourcePath = path.join(
    process.cwd(),
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
    console.error("Failed to read source file:", error);
    return NextResponse.json(
      { error: "Source file not found" },
      { status: 404 }
    );
  }
}

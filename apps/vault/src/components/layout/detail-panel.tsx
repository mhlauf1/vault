"use client";

import type { Meta } from "@repo/registry/schema";
import { ReadmeViewer } from "../ui/readme-viewer";

type DetailPanelProps = {
  item: Meta | null;
  readme: string | null;
  onCopySource: () => void;
  onCopyPath: () => void;
  isCopying: boolean;
  copySuccess: boolean | null;
};

export function DetailPanel({
  item,
  readme,
  onCopySource,
  onCopyPath,
  isCopying,
  copySuccess,
}: DetailPanelProps) {
  if (!item) {
    return (
      <aside className="flex h-full w-[360px] flex-col border-l border-gray-200 bg-white">
        <div className="flex h-full items-center justify-center text-sm text-gray-500">
          Select an item to view details
        </div>
      </aside>
    );
  }

  const statusColors = {
    draft: "bg-yellow-100 text-yellow-700",
    ready: "bg-green-100 text-green-700",
    deprecated: "bg-gray-100 text-gray-700",
  };

  return (
    <aside className="flex h-full w-[360px] flex-col border-l border-gray-200 bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-lg font-semibold text-gray-900">{item.name}</h2>
          <span
            className={`inline-flex shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[item.status]}`}
          >
            {item.status}
          </span>
        </div>
        <p className="mt-2 text-sm text-gray-600">{item.description}</p>
      </div>

      {/* Metadata */}
      <div className="border-b border-gray-200 p-4 space-y-4">
        {/* Tags */}
        <div>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Tags
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Collections */}
        {item.collections.length > 0 && (
          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Collections
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {item.collections.map((collection) => (
                <span
                  key={collection}
                  className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-600"
                >
                  {collection}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Tech Stack */}
        <div>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Tech Stack
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {item.tech.styling.map((tech) => (
              <TechBadge key={tech} label={tech} />
            ))}
            {item.tech.motion?.map((tech) => (
              <TechBadge key={tech} label={tech} />
            ))}
            {item.tech.icons?.map((tech) => (
              <TechBadge key={tech} label={tech} />
            ))}
            {item.tech.other?.map((tech) => (
              <TechBadge key={tech} label={tech} />
            ))}
          </div>
        </div>

        {/* Dates */}
        <div className="flex gap-4 text-xs text-gray-500">
          <span>Created: {item.createdAt}</span>
          <span>Updated: {item.updatedAt}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex gap-2">
          <button
            onClick={onCopySource}
            disabled={isCopying || item.type === "template"}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
              copySuccess === true
                ? "bg-green-600 text-white"
                : copySuccess === false
                  ? "bg-red-600 text-white"
                  : "bg-gray-900 text-white hover:bg-gray-800"
            } disabled:cursor-not-allowed disabled:opacity-50`}
          >
            {isCopying ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Copying...</span>
              </>
            ) : copySuccess === true ? (
              <>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Copied!</span>
              </>
            ) : copySuccess === false ? (
              <>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>Failed</span>
              </>
            ) : (
              <>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                <span>{item.type === "template" ? "Coming Soon" : "Copy Source"}</span>
              </>
            )}
          </button>
          <button
            onClick={onCopyPath}
            className="flex items-center justify-center rounded-lg border border-gray-200 px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            title="Copy path to source file"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* README */}
      <div className="flex-1 overflow-y-auto p-4">
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
          Documentation
        </h3>
        <ReadmeViewer content={readme} />
      </div>
    </aside>
  );
}

function TechBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-medium text-purple-600">
      {label}
    </span>
  );
}

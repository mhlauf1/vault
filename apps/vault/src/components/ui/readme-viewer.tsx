"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type ReadmeViewerProps = {
  content: string | null;
};

export function ReadmeViewer({ content }: ReadmeViewerProps) {
  if (!content) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center text-sm text-gray-500">
        No documentation available
      </div>
    );
  }

  return (
    <div className="prose prose-sm prose-gray max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="mb-3 mt-6 text-lg font-semibold text-gray-900 first:mt-0">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="mb-2 mt-5 text-base font-semibold text-gray-900">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mb-2 mt-4 text-sm font-semibold text-gray-900">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="mb-3 text-sm text-gray-600">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="mb-3 list-inside list-disc space-y-1 text-sm text-gray-600">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-3 list-inside list-decimal space-y-1 text-sm text-gray-600">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="text-sm text-gray-600">{children}</li>,
          code: ({ className, children }) => {
            const isInline = !className;
            if (isInline) {
              return (
                <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs text-gray-800">
                  {children}
                </code>
              );
            }
            return (
              <code className="block overflow-x-auto rounded-lg bg-gray-900 p-3 font-mono text-xs text-gray-100">
                {children}
              </code>
            );
          },
          pre: ({ children }) => (
            <pre className="mb-3 overflow-x-auto rounded-lg bg-gray-900 p-3">
              {children}
            </pre>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {children}
            </a>
          ),
          blockquote: ({ children }) => (
            <blockquote className="mb-3 border-l-2 border-gray-300 pl-3 text-sm italic text-gray-600">
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <table className="mb-3 w-full border-collapse text-sm">{children}</table>
          ),
          th: ({ children }) => (
            <th className="border border-gray-200 bg-gray-50 px-3 py-2 text-left font-medium text-gray-900">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-gray-200 px-3 py-2 text-gray-600">
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

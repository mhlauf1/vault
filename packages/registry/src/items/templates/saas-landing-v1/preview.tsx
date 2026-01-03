export default function SaasLandingV1Preview() {
  return (
    <div className="space-y-6 p-8">
      {/* Preview placeholder */}
      <div className="relative aspect-video overflow-hidden rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8">
          <div className="rounded-full bg-gray-200 p-4">
            <svg
              className="h-8 w-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <p className="text-sm text-gray-500">Template Preview Coming Soon</p>
        </div>
      </div>

      {/* Sections list */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-gray-900">Included Sections</h3>
        <ul className="mt-4 space-y-2 text-sm text-gray-600">
          <li className="flex items-center gap-2">
            <CheckIcon />
            Hero with split image layout
          </li>
          <li className="flex items-center gap-2">
            <CheckIcon />
            Feature grid (3 columns)
          </li>
          <li className="flex items-center gap-2">
            <CheckIcon />
            Pricing table (3 tiers)
          </li>
          <li className="flex items-center gap-2">
            <CheckIcon />
            Testimonial carousel
          </li>
          <li className="flex items-center gap-2">
            <CheckIcon />
            FAQ accordion
          </li>
          <li className="flex items-center gap-2">
            <CheckIcon />
            Footer with navigation links
          </li>
        </ul>
      </div>

      {/* Coming soon badge */}
      <div className="rounded-lg bg-amber-50 p-4">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-amber-100 p-2">
            <svg
              className="h-4 w-4 text-amber-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-amber-800">Coming Soon</p>
            <p className="text-xs text-amber-600">
              Template download will be available in a future update
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg
      className="h-4 w-4 text-green-500"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}

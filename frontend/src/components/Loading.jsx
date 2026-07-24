import React from "react";

export default function Loading() {
  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 p-12 max-w-4xl mx-auto my-6 text-center">
      <div className="inline-flex items-center justify-center p-4 bg-blue-50 rounded-full mb-4">
        <svg
          className="animate-spin h-8 w-8 text-blue-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-slate-800">Analyzing website...</h3>
      <p className="text-sm text-slate-500 mt-1">
        Fetching HTML source, checking SEO, accessibility, links, and security headers.
      </p>
    </div>
  );
}

import React from "react";

export default function OverviewCard({ report }) {
  if (!report) return null;

  const url = report.url || "N/A";
  const status = report.status || 200;
  const title = report.title || report.metadata?.title || report.seo?.title || "Not Found";
  const description =
    report.description ||
    report.metadata?.description ||
    report.seo?.description ||
    "No meta description present";

  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 max-w-4xl mx-auto mb-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <span>🌐</span> Overall Information
        </h2>
        <span
          className={`px-3 py-1 text-xs font-semibold rounded-full ${
            status >= 200 && status < 300
              ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
              : "bg-amber-100 text-amber-800 border border-amber-200"
          }`}
        >
          Status {status}
        </span>
      </div>

      <div className="space-y-3 text-sm">
        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            Audited URL
          </span>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline font-mono text-xs sm:text-sm break-all"
          >
            {url}
          </a>
        </div>

        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            Page Title
          </span>
          <p className="text-slate-800 font-medium bg-slate-50 p-2.5 rounded-lg border border-slate-100">
            {title || <span className="text-slate-400 italic">No Title Found</span>}
          </p>
        </div>

        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            Meta Description
          </span>
          <p className="text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
            {description || (
              <span className="text-slate-400 italic">No Description Found</span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

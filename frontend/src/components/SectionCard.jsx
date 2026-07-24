import React from "react";

export default function SectionCard({ title, icon = "📌", data }) {
  if (!data || (typeof data === "object" && Object.keys(data).length === 0)) {
    return null;
  }

  // Format key into human-readable label
  const formatLabel = (key) => {
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());
  };

  // Helper to format values
  const renderValue = (val) => {
    if (val === true) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-800">
          Yes / True
        </span>
      );
    }
    if (val === false) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-600">
          No / False
        </span>
      );
    }
    if (val === null || val === undefined || val === "") {
      return <span className="text-slate-400 italic">Not set</span>;
    }
    if (typeof val === "object") {
      return (
        <pre className="text-xs bg-slate-50 p-2 rounded border border-slate-100 overflow-x-auto text-slate-700">
          {JSON.stringify(val, null, 2)}
        </pre>
      );
    }
    return <span className="font-medium text-slate-800 break-words">{String(val)}</span>;
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 p-5 flex flex-col h-full">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-3">
        <span className="text-lg">{icon}</span>
        <h3 className="font-bold text-slate-800 text-base">{title}</h3>
      </div>

      <div className="space-y-2.5 flex-1">
        {typeof data === "object" && !Array.isArray(data) ? (
          Object.entries(data).map(([key, value]) => (
            <div
              key={key}
              className="flex flex-col sm:flex-row sm:items-center justify-between text-xs sm:text-sm py-1 border-b border-slate-50 last:border-0 gap-1"
            >
              <span className="text-slate-500 font-medium">{formatLabel(key)}:</span>
              <div className="sm:text-right">{renderValue(value)}</div>
            </div>
          ))
        ) : (
          <div className="text-sm">{renderValue(data)}</div>
        )}
      </div>
    </div>
  );
}

import React from "react";

export default function Navbar() {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white py-4 px-6 shadow-md">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span className="text-blue-500">🔍</span> Website Audit Tool
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Inspect SEO, accessibility, headings, links & performance
          </p>
        </div>
        <div className="text-xs text-slate-500 font-mono">v1.0.0</div>
      </div>
    </header>
  );
}

import React from "react";
import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 p-12 max-w-4xl mx-auto my-6 text-center">
      <div className="inline-flex items-center justify-center p-4 bg-blue-50 rounded-full mb-4">
        <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
      </div>
      <h3 className="text-lg font-semibold text-slate-800">Analyzing website...</h3>
      <p className="text-sm text-slate-500 mt-1">
        Fetching HTML source, checking SEO, accessibility, links, and security headers.
      </p>
    </div>
  );
}

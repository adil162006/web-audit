import React, { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";

export default function UrlForm({ onSubmit, loading }) {
  const [inputUrl, setInputUrl] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputUrl.trim()) return;
    onSubmit(inputUrl.trim());
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 max-w-4xl mx-auto my-6">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
          placeholder="Enter website URL (e.g. example.com or https://google.com)"
          disabled={loading}
          className="flex-1 px-4 py-3 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-slate-100 text-sm sm:text-base"
        />
        <button
          type="submit"
          disabled={loading || !inputUrl.trim()}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium rounded-lg shadow transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap text-sm sm:text-base"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin h-5 w-5 text-white" />
              <span>Auditing...</span>
            </>
          ) : (
            <>
              <span>Audit Website</span>
              <ArrowRight className="h-5 w-5" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}

import React from "react";

export default function ErrorMessage({ error }) {
  if (!error) return null;

  const message = typeof error === "string" ? error : error.message || "Invalid URL";
  const status = typeof error === "object" ? error.status : 404;

  const is404 =
    status === 404 ||
    message.includes("404") ||
    message.toLowerCase().includes("invalid url") ||
    message.toLowerCase().includes("not found");

  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-4xl mx-auto my-6 text-red-700 shadow-sm flex items-start gap-4">
      <div className="bg-red-100 p-3 rounded-lg text-red-600 font-bold text-lg flex items-center justify-center min-w-14 shrink-0">
        {is404 ? "404" : "Error"}
      </div>
      <div className="flex-1">
        <h4 className="font-bold text-base text-red-800">
          {is404 ? "404 - Invalid URL or Website Not Found" : "Audit Failed"}
        </h4>
        <p className="text-sm mt-1 text-red-600">{message}</p>
      </div>
    </div>
  );
}

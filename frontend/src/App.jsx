import React, { useState } from "react";
import Navbar from "./components/Navbar";
import UrlForm from "./components/UrlForm";
import OverviewCard from "./components/OverviewCard";
import SectionCard from "./components/SectionCard";
import Loading from "./components/Loading";
import ErrorMessage from "./components/ErrorMessage";
import { fetchAuditData } from "./services/auditApi";

export default function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [report, setReport] = useState(null);

  const handleAudit = async (url) => {
    setLoading(true);
    setError(null);
    setReport(null);

    try {
      const data = await fetchAuditData(url);
      setReport(data);
    } catch (err) {
      setError({
        message: err.message || "404 - Invalid URL or Website Not Found",
        status: err.status || 404,
      });
    } finally {
      setLoading(false);
    }
  };

  const getSeoData = () => {
    if (report?.seo) return report.seo;
    if (!report) return null;
    return {
      title: report.title || "Not found",
      description: report.description || "Not found",
      canonical: report.canonical || "Not specified",
      language: report.language || "Not specified",
    };
  };

  const getHeadingsData = () => {
    if (report?.headings) return report.headings;
    if (!report) return null;
    return {
      h1Count: report.h1Count ?? 0,
      h2Count: report.h2Count ?? 0,
    };
  };

  const getImagesData = () => {
    if (report?.images) return report.images;
    if (!report) return null;
    return {
      totalImages: report.imageCount ?? 0,
      imagesWithoutAlt: report.imagesWithoutAlt ?? 0,
    };
  };

  const getLinksData = () => {
    if (report?.links) return report.links;
    if (!report) return null;
    return {
      totalLinks: report.linkCount ?? 0,
      internalLinks: report.internalLinks ?? 0,
      externalLinks: report.externalLinks ?? 0,
    };
  };

  const getMetadataData = () => {
    if (report?.metadata) return report.metadata;
    if (!report) return null;
    return {
      title: report.title || "N/A",
      description: report.description || "N/A",
      canonical: report.canonical || "N/A",
      language: report.language || "N/A",
    };
  };

  const getAccessibilityData = () => {
    if (report?.accessibility) return report.accessibility;
    if (!report) return null;
    return {
      language: report.language || "Not set",
      imagesWithoutAlt: report.imagesWithoutAlt ?? 0,
    };
  };

  const getSecurityData = () => {
    if (report?.security) return report.security;
    if (!report) return null;
    return {
      isHttps: Boolean(report.url?.startsWith("https:")),
    };
  };

  const getPerformanceData = () => {
    if (report?.performance) return report.performance;
    if (!report) return null;
    return {
      imageCount: report.imageCount ?? 0,
      linkCount: report.linkCount ?? 0,
    };
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-16">
      <Navbar />

      <main className="px-4 sm:px-6">
        <UrlForm onSubmit={handleAudit} loading={loading} />

        {loading && <Loading />}

        {error && <ErrorMessage error={error} />}

        {report && !loading && (
          <div className="max-w-4xl mx-auto space-y-6">
            <OverviewCard report={report} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SectionCard title="SEO" icon="🎯" data={getSeoData()} />
              <SectionCard title="Metadata" icon="🏷️" data={getMetadataData()} />
              <SectionCard title="Headings" icon="📑" data={getHeadingsData()} />
              <SectionCard title="Images" icon="🖼️" data={getImagesData()} />
              <SectionCard title="Links" icon="🔗" data={getLinksData()} />
              <SectionCard title="Accessibility" icon="♿" data={getAccessibilityData()} />
              <SectionCard title="Security" icon="🛡️" data={getSecurityData()} />
              <SectionCard title="Performance" icon="⚡" data={getPerformanceData()} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

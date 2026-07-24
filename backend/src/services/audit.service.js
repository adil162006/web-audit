import axios from "axios";
import * as cheerio from "cheerio";

export const performAudit = async (rawUrl) => {
  if (!rawUrl || typeof rawUrl !== "string") {
    const err = new Error("URL is required");
    err.status = 404;
    throw err;
  }

  let url = rawUrl.trim();
  if (!/^https?:\/\//i.test(url)) {
    url = "https://" + url;
  }

  // Validate URL structure
  try {
    new URL(url);
  } catch (_e) {
    const err = new Error(`Invalid URL format: '${rawUrl}'`);
    err.status = 404;
    throw err;
  }

  try {
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      },
    });

    const $ = cheerio.load(response.data || "");

    return {
      status: response.status,
      url,
      title: $("title").text(),
      description: $('meta[name="description"]').attr("content") || "",
      h1Count: $("h1").length,
      h2Count: $("h2").length,
      imageCount: $("img").length,
      imagesWithoutAlt: $("img:not([alt])").length,
      linkCount: $("a").length,
      internalLinks: $('a[href^="/"]').length,
      externalLinks: $('a[href^="http"]').length,
      canonical: $('link[rel="canonical"]').attr("href") || "",
      language: $("html").attr("lang") || "",
    };
  } catch (error) {
    const err = new Error(
      error.response?.status === 404
        ? `Website returned 404 Not Found: ${url}`
        : `Invalid URL or website unavailable: ${error.message}`
    );
    err.status = 404;
    throw err;
  }
};
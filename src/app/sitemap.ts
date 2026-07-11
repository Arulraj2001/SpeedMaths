import { MetadataRoute } from "next";
import { articles } from "@/data/blog";
import { numberTypes } from "@/data/number-types";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://speedmaths.com";

  const staticPaths = [
    { path: "", priority: 1.0, freq: "daily" as const },
    { path: "/practice", priority: 0.9, freq: "daily" as const },
    { path: "/analytics", priority: 0.7, freq: "weekly" as const },
    { path: "/blog", priority: 0.8, freq: "daily" as const },
    { path: "/learn/tables", priority: 0.9, freq: "weekly" as const },
    { path: "/learn/squares", priority: 0.8, freq: "weekly" as const },
    { path: "/learn/cubes", priority: 0.8, freq: "weekly" as const },
    { path: "/learn/powers", priority: 0.8, freq: "weekly" as const },
    { path: "/learn/fractions", priority: 0.8, freq: "weekly" as const },
    { path: "/learn/number-types", priority: 0.8, freq: "weekly" as const },
    { path: "/tables", priority: 0.8, freq: "weekly" as const },
    { path: "/squares", priority: 0.7, freq: "weekly" as const },
    { path: "/cubes", priority: 0.7, freq: "weekly" as const },
    { path: "/fractions", priority: 0.7, freq: "weekly" as const },
    { path: "/powers", priority: 0.7, freq: "weekly" as const },
    { path: "/types-of-numbers", priority: 0.7, freq: "weekly" as const },
    { path: "/faq", priority: 0.6, freq: "monthly" as const },
    { path: "/about", priority: 0.5, freq: "monthly" as const },
    { path: "/contact", priority: 0.5, freq: "monthly" as const },
    { path: "/privacy", priority: 0.3, freq: "yearly" as const },
    { path: "/terms", priority: 0.3, freq: "yearly" as const },
    { path: "/disclaimer", priority: 0.3, freq: "yearly" as const },
    { path: "/sitemap", priority: 0.3, freq: "monthly" as const },
  ];

  const staticRecords: MetadataRoute.Sitemap = staticPaths.map((p) => ({
    url: `${baseUrl}${p.path}`,
    lastModified: new Date(),
    changeFrequency: p.freq,
    priority: p.priority,
  }));

  const tablesPaths: MetadataRoute.Sitemap = Array.from({ length: 50 }).map(
    (_, i) => ({
      url: `${baseUrl}/tables/${i + 1}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })
  );

  const blogPaths: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${baseUrl}/blog/${article.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const numberTypesPaths: MetadataRoute.Sitemap = numberTypes.map((type) => ({
    url: `${baseUrl}/learn/number-types/${type.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [
    ...staticRecords,
    ...tablesPaths,
    ...blogPaths,
    ...numberTypesPaths,
  ];
}

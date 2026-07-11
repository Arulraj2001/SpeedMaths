import { MetadataRoute } from "next";
import { articles } from "@/data/blog";
import { numberTypes } from "@/data/number-types";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://speedmaths.com";

  // Static Platform Routes
  const staticPaths = [
    "",
    "/practice",
    "/analytics",
    "/blog",
    "/learn/tables",
    "/learn/squares",
    "/learn/cubes",
    "/learn/powers",
    "/learn/fractions",
    "/learn/number-types",
    "/tables",
    "/squares",
    "/cubes",
    "/fractions",
    "/powers",
    "/types-of-numbers"
  ];

  const staticRecords: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: path === "" ? 1.0 : 0.8
  }));

  // Dynamic tables paths (/tables/1 to /tables/50)
  const tablesPaths: MetadataRoute.Sitemap = Array.from({ length: 50 }).map((_, i) => ({
    url: `${baseUrl}/tables/${i + 1}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.6
  }));

  // Dynamic blog articles paths (/blog/article-slug)
  const blogPaths: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${baseUrl}/blog/${article.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7
  }));

  // Dynamic number characteristics glossary paths (/learn/number-types/prime)
  const numberTypesPaths: MetadataRoute.Sitemap = numberTypes.map((type) => ({
    url: `${baseUrl}/learn/number-types/${type.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.6
  }));

  return [...staticRecords, ...tablesPaths, ...blogPaths, ...numberTypesPaths];
}

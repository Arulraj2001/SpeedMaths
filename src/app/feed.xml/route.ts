import { articles } from "@/data/blog";
import { SITE_URL } from "@/lib/seo";

export async function GET() {
  const baseUrl = SITE_URL;

  const rssItemsXml = articles
    .map((article) => {
      const link = `${baseUrl}/blog/${article.slug}`;
      const pubDate = new Date(article.publishedDate).toUTCString();
      return `
        <item>
          <title><![CDATA[${article.title}]]></title>
          <link>${link}</link>
          <guid>${link}</guid>
          <pubDate>${pubDate}</pubDate>
          <description><![CDATA[${article.description}]]></description>
        </item>
      `;
    })
    .join("");

  const rssFeedXml = `<?xml version="1.5" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>SpeedMaths Speed Arithmetic Blog Feed</title>
    <link>${baseUrl}/blog</link>
    <description>Master mental math hacks, Vedic calculations tricks, and GMAT/SAT/CAT arithmetic secrets.</description>
    <language>en-us</language>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
    ${rssItemsXml}
  </channel>
</rss>
`;

  return new Response(rssFeedXml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8"
    }
  });
}

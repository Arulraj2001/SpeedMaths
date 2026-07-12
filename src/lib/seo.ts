export const SITE_URL = "https://speed-maths-gamma.vercel.app";
export const SITE_NAME = "SpeedMaths";
export const SITE_DESCRIPTION =
  "Practice mental math with free interactive drills, step-by-step learning guides, blog tutorials, and progress tracking.";
export const DEFAULT_OG_IMAGE = "https://img.icons8.com/color/512/brain.png";

export function absoluteUrl(path: string) {
  return path.startsWith("http") ? path : `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function toIsoDate(value: string) {
  return new Date(value).toISOString();
}

export function buildWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
  };
}

export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: absoluteUrl("/globe.svg"),
    sameAs: ["https://github.com/Arulraj2001/SpeedMaths"],
    contactPoint: {
      "@type": "ContactPoint",
      email: "support@speedmaths.com",
      contactType: "customer support",
    },
  };
}

export function buildBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.url),
    })),
  };
}

export function buildArticleSchema(options: {
  title: string;
  description: string;
  url: string;
  publishedDate: string;
  authorName?: string;
}) {
  const authorName = options.authorName || SITE_NAME;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: options.title,
    description: options.description,
    datePublished: toIsoDate(options.publishedDate),
    author: {
      "@type": "Organization",
      name: authorName,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/globe.svg"),
      },
    },
    image: DEFAULT_OG_IMAGE,
    mainEntityOfPage: absoluteUrl(options.url),
  };
}

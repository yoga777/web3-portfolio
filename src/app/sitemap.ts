import type { MetadataRoute } from "next";

const SITE_URL = "https://web3-portfolio-eta-lemon.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}

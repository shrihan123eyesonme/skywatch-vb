import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/siteConfig";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    { path: "", priority: 1, changeFrequency: "daily" as const },
    { path: "/flood-watch", priority: 1, changeFrequency: "hourly" as const },
    { path: "/community", priority: 0.9, changeFrequency: "daily" as const },
    { path: "/forum", priority: 0.7, changeFrequency: "hourly" as const },
    { path: "/events", priority: 0.7, changeFrequency: "daily" as const },
    { path: "/login", priority: 0.3, changeFrequency: "monthly" as const },
    { path: "/signup", priority: 0.3, changeFrequency: "monthly" as const },
    { path: "/privacy", priority: 0.2, changeFrequency: "yearly" as const },
    { path: "/terms", priority: 0.2, changeFrequency: "yearly" as const },
  ];

  return routes.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}

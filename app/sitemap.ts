import type { MetadataRoute } from "next";
import { ROUTES, SITE_URL } from "@/app/lib/routes";

/*
  Generated from app/lib/routes.ts, so adding a route cannot silently omit it.

  Note there is no `priority`. Google ignores it, and the old hand-written
  values (0.95 for /martianos, 0.6 for /licensing) were invented — they signalled
  nothing except that someone had guessed.
*/
export default function sitemap(): MetadataRoute.Sitemap {
    const now = new Date();
    return ROUTES.map((r) => ({
        url: `${SITE_URL}${r.path === "/" ? "" : r.path}`,
        lastModified: now,
        changeFrequency: r.changeFrequency,
    }));
}

import { useEffect } from "react";
import { useLocation } from "wouter";
import { useI18n } from "@/i18n";
import { useSite } from "@/lib/site";
import { metaFor } from "@/seo/meta";
import { applyHead } from "@/seo/head";

/** Syncs <head> with the current page. The prerendered HTML already carries the same tags. */
export function PageMeta() {
  const [location] = useLocation();
  const { locale, t } = useI18n();
  const { site } = useSite();
  useEffect(() => {
    applyHead(metaFor(location, locale, t, site));
  }, [location, locale, t, site]);
  return null;
}

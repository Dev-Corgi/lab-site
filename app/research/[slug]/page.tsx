"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import DOMPurify from "isomorphic-dompurify";
import { useI18n } from "@/lib/i18n/context";
import { createClient } from "@/lib/supabase/client";
import { fetchResearchAreaBySlug } from "@/lib/research-area-public";

function DetailSkeleton() {
  return (
    <div className="container mx-auto px-4 lg:px-8 py-10 max-w-3xl">
      <div className="h-4 w-48 bg-muted rounded animate-pulse mb-8" />
      <div className="h-10 w-3/4 bg-muted rounded animate-pulse mb-4" />
      <div className="h-64 bg-muted/80 rounded-lg animate-pulse mb-8" />
      <div className="space-y-3">
        <div className="h-4 bg-muted rounded w-full animate-pulse" />
        <div className="h-4 bg-muted rounded w-5/6 animate-pulse" />
      </div>
    </div>
  );
}

export default function ResearchAreaDetailPage() {
  const params = useParams();
  const rawSlug = typeof params.slug === "string" ? params.slug : params.slug?.[0];
  const slug = rawSlug ? decodeURIComponent(rawSlug).trim() : "";
  const invalidSlug = !slug;

  const { language, t } = useI18n();
  const [row, setRow] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(!invalidSlug);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (invalidSlug) return;

    let cancelled = false;
    void (async () => {
      const data = await fetchResearchAreaBySlug(slug, async () => {
        const supabase = createClient();
        const { data: anonRow, error } = await supabase.from("research_areas").select("*").eq("slug", slug).maybeSingle();
        if (error) console.error("[research_areas] 상세 anon 폴백 실패:", error.message);
        return anonRow ?? null;
      });
      if (cancelled) return;
      if (!data) setNotFound(true);
      else setRow(data);
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [slug, invalidSlug]);

  const title = useMemo(() => {
    if (!row) return "";
    if (language === "ko" && typeof row.title_kr === "string" && row.title_kr) return row.title_kr;
    return String(row.title ?? "");
  }, [row, language]);

  const category = useMemo(() => {
    if (!row) return "";
    if (language === "ko" && typeof row.category_kr === "string" && row.category_kr) return row.category_kr;
    return String(row.category ?? "");
  }, [row, language]);

  const description = useMemo(() => {
    if (!row) return "";
    if (language === "ko" && typeof row.description_kr === "string" && row.description_kr) return row.description_kr;
    return String(row.description ?? "");
  }, [row, language]);

  const bodyHtmlRaw = useMemo(() => {
    if (!row) return "";
    if (language === "ko" && typeof row.body_html_kr === "string" && row.body_html_kr.trim()) return row.body_html_kr;
    return typeof row.body_html === "string" ? row.body_html : "";
  }, [row, language]);

  const safeBody = useMemo(
    () => DOMPurify.sanitize(bodyHtmlRaw, { USE_PROFILES: { html: true } }),
    [bodyHtmlRaw],
  );

  const imageUrl = row && typeof row.image_url === "string" ? row.image_url : undefined;

  if (invalidSlug) {
    return (
      <div className="container mx-auto px-4 lg:px-8 py-20 text-center">
        <p className="text-muted-foreground mb-6">{t("연구 분야를 찾을 수 없습니다.", "Research area not found.")}</p>
        <Link href="/research" className="text-primary hover:text-sky-600 text-sm font-medium">
          ← {t("연구 목록", "Back to research")}
        </Link>
      </div>
    );
  }

  if (loading) return <DetailSkeleton />;

  if (notFound || !row) {
    return (
      <div className="container mx-auto px-4 lg:px-8 py-20 text-center">
        <p className="text-muted-foreground mb-6">{t("연구 분야를 찾을 수 없습니다.", "Research area not found.")}</p>
        <Link href="/research" className="text-primary hover:text-sky-600 text-sm font-medium">
          ← {t("연구 목록", "Back to research")}
        </Link>
      </div>
    );
  }

  return (
    <article className="container mx-auto px-4 lg:px-8 py-10 max-w-3xl">
      <nav className="text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:text-foreground transition-colors">
          Home
        </Link>
        <span className="mx-1.5">/</span>
        <Link href="/research" className="hover:text-foreground transition-colors">
          {t("연구", "Research")}
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-foreground/80 truncate inline-block max-w-48 md:max-w-md align-bottom">{title}</span>
      </nav>

      <Link
        href="/research"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        {t("목록으로", "All research areas")}
      </Link>

      {category ? (
        <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-3">{category}</p>
      ) : null}
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">{title}</h1>
      {description ? <p className="text-muted-foreground leading-relaxed mb-8 border-b border-border pb-8">{description}</p> : null}

      {imageUrl ? (
        <div className="rounded-xl border border-border overflow-hidden mb-10 bg-sky-50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageUrl} alt="" className="w-full max-h-[420px] object-cover" />
        </div>
      ) : null}

      {safeBody.trim() && safeBody !== "<p></p>" ? (
        <div className="research-prose" dangerouslySetInnerHTML={{ __html: safeBody }} />
      ) : (
        <p className="text-sm text-muted-foreground italic">{t("상세 본문이 아직 없습니다.", "No detailed content yet.")}</p>
      )}
    </article>
  );
}

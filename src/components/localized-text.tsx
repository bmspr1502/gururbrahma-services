"use client";

import { useLanguage } from "@/context/language-context";
import { translations } from "@/lib/translations";

export function LocalizedText({ translationKey, fallback }: { translationKey: string, fallback?: string }) {
  const { t } = useLanguage();
  return <>{t(translationKey as any) || fallback}</>;
}

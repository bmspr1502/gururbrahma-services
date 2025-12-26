"use client";

import { useLanguage } from "@/context/language-context";
import { Youtube, Newspaper } from "lucide-react";

export function LatestUpdatesHeader({ type }: { type: 'videos' | 'posts' }) {
  const { t } = useLanguage();
  
  if (type === 'videos') {
    return (
      <div className="flex items-center gap-3 mb-6">
        <Youtube className="w-8 h-8 text-primary" />
        <h2 className="text-3xl font-bold">{t('latest_videos' as any) || 'Latest Videos'}</h2>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 mb-6">
      <Newspaper className="w-8 h-8 text-primary" />
      <h2 className="text-3xl font-bold">{t('recent_articles' as any) || 'Recent Articles'}</h2>
    </div>
  );
}

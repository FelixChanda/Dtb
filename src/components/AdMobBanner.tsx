import React, { useState } from 'react';
import { X, Sparkles, ExternalLink, ShieldCheck, Info } from 'lucide-react';
import { AdMobConfig } from '../types';

interface AdMobBannerProps {
  config: AdMobConfig;
  variant?: 'bottom-fixed' | 'inline-content';
  onOpenSettings?: () => void;
}

export const AdMobBanner: React.FC<AdMobBannerProps> = ({
  config,
  variant = 'inline-content',
  onOpenSettings
}) => {
  const [isDismissed, setIsDismissed] = useState(false);

  if (!config.enabled || isDismissed) {
    return null;
  }

  // Pre-configured medical & nursing sponsor formats
  const sponsorAds = [
    {
      title: 'NCLEX-RN High-Yield Question Bank 2024',
      subtitle: 'Pass your nursing licensure exam with 3,500+ case study questions & detailed rationales.',
      cta: 'Explore NCLEX Prep',
      advertiser: 'NurseMaster Exam Prep',
      tag: 'Medical Education'
    },
    {
      title: 'Littmann Cardiology IV Diagnostic Stethoscope',
      subtitle: 'Acoustic sensitivity for subtle heart sounds, murmurs & lung auscultation.',
      cta: 'Student Discount',
      advertiser: 'MedEquip Clinical Supplies',
      tag: 'Clinical Equipment'
    },
    {
      title: 'Hospital Clinical Rotations Handbook & Drug Guide',
      subtitle: 'Pocket-sized bedside reference with dosage calculators & IV drip charts.',
      cta: 'Download App',
      advertiser: 'Clinical Nursing Guides',
      tag: 'Nurse Resources'
    }
  ];

  const currentAd = sponsorAds[0];

  if (variant === 'bottom-fixed') {
    return (
      <aside
        id="admob-sticky-bottom-banner"
        aria-label="Sponsored Advertisement"
        className="fixed bottom-[52px] sm:bottom-[56px] inset-x-0 z-30 bg-white/65 dark:bg-slate-900/65 backdrop-blur-md border-t border-slate-200/60 dark:border-slate-800/60 shadow-lg px-3 py-1.5 transition-colors duration-200"
      >
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
          {/* AdMob Indicator Badge */}
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex flex-col items-start shrink-0">
              <span className="inline-flex items-center text-[10px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 leading-none">
                Ad • AdMob
              </span>
              <span className="text-[9px] text-slate-400 dark:text-slate-500 font-mono mt-0.5 hidden sm:inline">
                {config.testMode ? 'Test Ad Unit' : config.bannerUnitId.slice(0, 14) + '...'}
              </span>
            </div>

            {/* Ad Content */}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                  {currentAd.title}
                </h4>
                <span className="hidden md:inline-block text-[11px] text-teal-600 dark:text-teal-400 font-medium truncate">
                  — {currentAd.subtitle}
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                Sponsored by {currentAd.advertiser}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <a
              href="https://play.google.com/store"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-xs transition-colors whitespace-nowrap"
            >
              {currentAd.cta}
            </a>

            {onOpenSettings && (
              <button
                onClick={onOpenSettings}
                className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 px-1.5 py-1 rounded cursor-pointer hidden sm:block"
                title="Configure AdMob Unit ID & Settings"
              >
                Settings
              </button>
            )}

            <button
              onClick={() => setIsDismissed(true)}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Close Ad"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    );
  }

  // Inline Banner
  return (
    <div
      id="admob-inline-responsive-banner"
      aria-label="Advertisement Banner"
      className="w-full my-4 p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-gradient-to-r from-slate-50 via-teal-50/40 to-slate-50 dark:from-slate-900 dark:via-slate-800/80 dark:to-slate-900 shadow-xs transition-colors duration-200 relative overflow-hidden"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 leading-none">
              Ad • Google AdMob
            </span>
            <span className="text-xs font-semibold text-teal-700 dark:text-teal-400">
              {currentAd.tag}
            </span>
            {config.testMode && (
              <span className="text-[10px] text-slate-400 font-mono bg-slate-200/80 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                Test Mode
              </span>
            )}
          </div>

          <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
            {currentAd.title}
          </h4>

          <p className="text-xs text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
            {currentAd.subtitle}
          </p>

          <p className="text-[11px] text-slate-400 dark:text-slate-500">
            Sponsored by <span className="font-semibold">{currentAd.advertiser}</span>
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
          <a
            href="https://play.google.com/store"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-xs transition-colors cursor-pointer"
          >
            <span>{currentAd.cta}</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>

          <button
            onClick={() => setIsDismissed(true)}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Dismiss Ad"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

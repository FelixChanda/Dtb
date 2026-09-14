import React, { useState, useEffect } from 'react';
import { X, Sparkles, ExternalLink, ShieldCheck, Play, HardDrive, Download, Zap } from 'lucide-react';
import { ADMOB_APP_ID, ADMOB_UNIT_ID, AdTriggerType } from '../utils/admobHelper';

interface AdDetail {
  triggerType: AdTriggerType;
  label: string;
  appId: string;
  unitId: string;
  timestamp: number;
}

export const AdMobInterstitialModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [adDetail, setAdDetail] = useState<AdDetail | null>(null);
  const [countdown, setCountdown] = useState(3);
  const [canClose, setCanClose] = useState(false);

  useEffect(() => {
    const handleShowAd = (e: any) => {
      // Always verify online state
      if (!navigator.onLine) return;

      const detail: AdDetail = e.detail || {
        triggerType: 'feature',
        label: 'AdMob Online Ad',
        appId: ADMOB_APP_ID,
        unitId: ADMOB_UNIT_ID,
        timestamp: Date.now()
      };

      setAdDetail(detail);
      setIsOpen(true);
      setCountdown(3);
      setCanClose(false);

      // Trigger Google Ads push if available
      try {
        if ((window as any).adsbygoogle) {
          ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
        }
      } catch (err) {
        console.warn('AdMob push error:', err);
      }
    };

    window.addEventListener('datanurse-show-admob-interstitial', handleShowAd);
    return () => {
      window.removeEventListener('datanurse-show-admob-interstitial', handleShowAd);
    };
  }, []);

  // Countdown timer effect
  useEffect(() => {
    if (!isOpen) return;

    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanClose(true);
    }
  }, [isOpen, countdown]);

  if (!isOpen || !adDetail) return null;

  const sponsorOptions = [
    {
      title: 'NCLEX-RN & PN Master Question Bank 2024/2025',
      subtitle: '3,800+ NGN Next-Gen case studies, dosage calculation drills, and adaptive mock exams with 99.4% pass rate guarantee.',
      cta: 'Get NCLEX Pass Access',
      advertiser: 'NurseMaster Academic Prep',
      tag: 'Licensure Exam Prep',
      url: 'https://play.google.com/store',
      color: 'from-teal-600 to-emerald-700'
    },
    {
      title: '3M Littmann Cardiology IV Diagnostic Stethoscope',
      subtitle: 'Engineered for critical care, emergency, & pediatric auscultation. Unrivaled acoustic sensitivity for cardiac murmurs.',
      cta: 'Claim Student Discount',
      advertiser: 'MedEquip Nursing Supplies',
      tag: 'Clinical Equipment',
      url: 'https://play.google.com/store',
      color: 'from-blue-600 to-indigo-700'
    },
    {
      title: 'Nursing Care Plans & Pharmacopoeia Drug Guide',
      subtitle: 'Pocket-sized bedside reference app with offline IV drip calculators, contraindications, and emergency antidote charts.',
      cta: 'Install Mobile App',
      advertiser: 'DATANURSE Clinical Partners',
      tag: 'Bedside Reference',
      url: 'https://play.google.com/store',
      color: 'from-amber-600 to-orange-700'
    }
  ];

  // Pick ad based on timestamp modulo
  const sponsor = sponsorOptions[adDetail.timestamp % sponsorOptions.length];

  const getTriggerTitle = (type: AdTriggerType) => {
    switch (type) {
      case 'download':
        return 'Downloading Document...';
      case 'launch':
        return 'Welcome to DATANURSE!';
      case 'prompt':
        return 'Processing Search & AI Prompt...';
      case 'after_sleep':
        return 'Screen Woke Up — Online Refresh';
      default:
        return 'Sponsored Online Content';
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col relative transition-all">
        {/* AdMob Official Banner Header */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-2.5 min-w-0">
            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-amber-400 text-slate-950 tracking-wider shrink-0">
              AdMob Online Ad
            </span>
            <div className="min-w-0">
              <p className="text-xs font-bold text-teal-400 truncate">
                {getTriggerTitle(adDetail.triggerType)}
              </p>
              <p className="text-[10px] font-mono text-slate-400 truncate">
                Unit: {ADMOB_UNIT_ID}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            disabled={!canClose}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer ${
              canClose
                ? 'bg-teal-600 hover:bg-teal-500 text-white shadow-md'
                : 'bg-slate-800 text-slate-400 cursor-not-allowed'
            }`}
          >
            <span>{canClose ? 'Skip Ad' : `Skip in ${countdown}s`}</span>
            {canClose && <X className="h-3.5 w-3.5" />}
          </button>
        </div>

        {/* Ad Body Content */}
        <div className="p-5 space-y-4 text-slate-800 dark:text-slate-100">
          {/* AdMob Script Slot Container */}
          <div className="w-full bg-slate-100 dark:bg-slate-800/80 rounded-2xl p-2 min-h-[100px] border border-slate-200/80 dark:border-slate-700/80 flex flex-col items-center justify-center text-center">
            <ins
              className="adsbygoogle"
              style={{ display: 'block', width: '100%', height: '100px' }}
              data-ad-client="ca-app-pub-6112734772406406"
              data-ad-slot="8877344471"
              data-ad-format="auto"
              data-full-width-responsive="true"
            ></ins>
          </div>

          {/* Featured Sponsor Display Card */}
          <div className={`p-4 rounded-2xl bg-gradient-to-br ${sponsor.color} text-white space-y-3 shadow-lg relative overflow-hidden`}>
            <div className="flex items-center justify-between text-[11px] font-bold opacity-90">
              <span className="uppercase tracking-wider px-2 py-0.5 rounded bg-white/20 backdrop-blur-xs">
                {sponsor.tag}
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5" />
                Verified Partner
              </span>
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-extrabold leading-tight">
                {sponsor.title}
              </h3>
              <p className="text-xs text-white/90 mt-1.5 leading-relaxed">
                {sponsor.subtitle}
              </p>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-white/20">
              <span className="text-[11px] font-medium opacity-80 truncate">
                by {sponsor.advertiser}
              </span>
              <a
                href={sponsor.url}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-1.5 rounded-xl bg-white text-slate-900 font-extrabold text-xs shadow-md hover:bg-slate-100 transition-all flex items-center space-x-1 shrink-0"
              >
                <span>{sponsor.cta}</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 pt-1">
            <span>App ID: {ADMOB_APP_ID}</span>
            <span className="font-semibold text-teal-600 dark:text-teal-400">
              DATANURSE Online Ad Network
            </span>
          </div>
        </div>

        {/* Footer close button */}
        <div className="p-3 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end">
          <button
            onClick={() => setIsOpen(false)}
            className="w-full sm:w-auto px-5 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors cursor-pointer"
          >
            Continue to Application
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  X,
  Settings,
  Sun,
  Moon,
  Mail,
  Send,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  Smartphone,
  Eye,
  Sliders,
  Github,
  Cloud,
  Database,
  UploadCloud,
  UserCheck,
  LogOut,
  Flame
} from 'lucide-react';
import { ThemeMode, AdMobConfig } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeMode;
  onSelectTheme: (theme: ThemeMode) => void;
  adMobConfig?: AdMobConfig;
  onUpdateAdMobConfig?: (config: AdMobConfig) => void;
  lastSyncTime: string;
  onForceSyncConditions: () => Promise<void>;
  isSyncing: boolean;
  onOpenApkModal?: () => void;
  firebaseConnected?: boolean;
  firebaseUser?: { email?: string | null; displayName?: string | null } | null;
  onFirebaseSignIn?: () => Promise<void>;
  onFirebaseSignOut?: () => Promise<void>;
  onBackupToFirebase?: () => Promise<void>;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  theme,
  onSelectTheme,
  adMobConfig,
  onUpdateAdMobConfig,
  lastSyncTime,
  onForceSyncConditions,
  isSyncing,
  onOpenApkModal,
  firebaseConnected = true,
  firebaseUser,
  onFirebaseSignIn,
  onFirebaseSignOut,
  onBackupToFirebase
}) => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [feedbackSubject, setFeedbackSubject] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [isBackuping, setIsBackuping] = useState(false);
  const [backupSuccessMsg, setBackupSuccessMsg] = useState('');

  const [admobEnabled, setAdmobEnabled] = useState(adMobConfig?.enabled ?? false);
  const [admobTestMode, setAdmobTestMode] = useState(adMobConfig?.testMode ?? true);
  const [admobAppId, setAdmobAppId] = useState(adMobConfig?.appId ?? '');
  const [admobUnitId, setAdmobUnitId] = useState(adMobConfig?.bannerUnitId ?? '');
  const [admobSaved, setAdmobSaved] = useState(false);

  const contactEmail = 'fchanda335@gmail.com';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(contactEmail);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(
      feedbackSubject.trim() || 'DATANURSE Database Inquiry'
    );
    const body = encodeURIComponent(
      feedbackMessage.trim() ||
        'Hello Chanda Felix,\n\nI am contacting you regarding the DATANURSE nursing database and library.\n\n'
    );
    window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`;
  };

  const handleSaveAdMob = () => {
    if (onUpdateAdMobConfig) {
      onUpdateAdMobConfig({
        ...adMobConfig,
        enabled: admobEnabled,
        testMode: admobTestMode,
        appId: admobAppId.trim(),
        bannerUnitId: admobUnitId.trim()
      });
    }
    setAdmobSaved(true);
    setTimeout(() => setAdmobSaved(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6 animate-fadeIn">
      <div
        id="settings-dialog"
        className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors duration-200"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950 shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-teal-600 text-white shadow-xs">
              <Settings className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                DATANURSE Settings & Preferences
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Theme switcher, AdMob controls & Author contact
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800 dark:text-slate-200 text-xs sm:text-sm">
          {/* 1. Theme Switcher */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                <Sun className="h-4 w-4 text-amber-500" />
                Visual Appearance & Theme
              </h3>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                Active: {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => onSelectTheme('light')}
                className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                  theme === 'light'
                    ? 'border-teal-600 bg-teal-50/70 text-teal-950 ring-2 ring-teal-500'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="p-2 rounded-lg bg-amber-100 text-amber-700 shrink-0">
                  <Sun className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 dark:text-white text-sm">Light Mode</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    High contrast daylight theme for academic reading.
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => onSelectTheme('dark')}
                className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                  theme === 'dark'
                    ? 'border-teal-500 bg-slate-800 text-white ring-2 ring-teal-500'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="p-2 rounded-lg bg-indigo-950 text-indigo-300 shrink-0">
                  <Moon className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 dark:text-white text-sm">Dark Mode</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Eye-safe nighttime clinical shift theme.
                  </div>
                </div>
              </button>
            </div>
          </section>

          {/* Firebase Cloud Storage & Database */}
          <section className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-gradient-to-br from-amber-50/70 to-orange-50/40 dark:from-amber-950/30 dark:to-slate-900/60 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start space-x-2.5">
                <div className="p-2.5 rounded-xl bg-amber-500 text-white shadow-xs shrink-0 mt-0.5">
                  <Flame className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                      Firebase Cloud File Storage
                    </h3>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                      Firestore Active
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    Persistent Cloud Storage for clinical documents, custom uploaded notes, past papers, and module syllabi.
                  </p>
                  <div className="mt-2 text-[11px] font-mono text-slate-500 dark:text-slate-400 bg-white/70 dark:bg-slate-950/60 px-2.5 py-1.5 rounded-lg border border-amber-200/60 dark:border-amber-900/40 space-y-0.5">
                    <div>Project: <span className="font-semibold text-amber-700 dark:text-amber-400">invertible-ripsaw-82ts5</span> (europe-west3)</div>
                    <div>Database: <span className="font-semibold text-slate-700 dark:text-slate-300">ai-studio-gitpull-a34f97d5...</span></div>
                  </div>
                </div>
              </div>

              {onBackupToFirebase && (
                <button
                  onClick={async () => {
                    setIsBackuping(true);
                    setBackupSuccessMsg('');
                    try {
                      await onBackupToFirebase();
                      setBackupSuccessMsg('All custom documents & resources backed up to Firebase!');
                      setTimeout(() => setBackupSuccessMsg(''), 4000);
                    } catch (err) {
                      setBackupSuccessMsg('Backup encountered an issue. Check console.');
                    } finally {
                      setIsBackuping(false);
                    }
                  }}
                  disabled={isBackuping}
                  className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 active:scale-95 shadow-xs transition-all shrink-0 cursor-pointer disabled:opacity-50"
                  title="Backup all local resources and uploaded files to Firebase Cloud Storage"
                >
                  <UploadCloud className={`h-4 w-4 ${isBackuping ? 'animate-bounce' : ''}`} />
                  <span>{isBackuping ? 'Syncing...' : 'Cloud Backup'}</span>
                </button>
              )}
            </div>

            {backupSuccessMsg && (
              <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-800 dark:text-emerald-200 flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                <span>{backupSuccessMsg}</span>
              </div>
            )}

            {/* Auth status block */}
            <div className="pt-2 border-t border-amber-200/60 dark:border-amber-900/40 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Cloud className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <span className="text-slate-600 dark:text-slate-300 font-medium">
                  {firebaseUser ? (
                    <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                      Signed in as {firebaseUser.email || firebaseUser.displayName}
                    </span>
                  ) : (
                    'Guest mode (Anonymous Cloud Sync Enabled)'
                  )}
                </span>
              </div>

              {firebaseUser ? (
                onFirebaseSignOut && (
                  <button
                    onClick={onFirebaseSignOut}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-950/80 transition-colors cursor-pointer"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Sign Out</span>
                  </button>
                )
              ) : (
                onFirebaseSignIn && (
                  <button
                    onClick={onFirebaseSignIn}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer shadow-2xs"
                  >
                    <UserCheck className="h-3.5 w-3.5 text-amber-600" />
                    <span>Google Sign In</span>
                  </button>
                )
              )}
            </div>
          </section>

          {/* 2. Contact Author (Chanda Felix) */}
          <section className="p-4 rounded-xl border border-teal-200 dark:border-teal-800/80 bg-teal-50/50 dark:bg-teal-950/40 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                  <Mail className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                  Contact Author & Compiler
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  Compiled & maintained by <span className="font-bold text-teal-700 dark:text-teal-300">CHANDA FELIX</span>. Have past papers, updated modules, or feedback?
                </p>
              </div>

              {/* Direct Mailto Button */}
              <a
                id="btn-direct-contact-email"
                href={`mailto:${contactEmail}?subject=DATANURSE%20Nursing%20Database%20Inquiry`}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-xs transition-colors shrink-0"
              >
                <Mail className="h-4 w-4" />
                <span>Contact Us</span>
              </a>
            </div>

            {/* Email Address Pill with Copy */}
            <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-teal-200 dark:border-teal-800">
              <span className="font-mono text-xs font-bold text-teal-900 dark:text-teal-200">
                {contactEmail}
              </span>
              <button
                type="button"
                onClick={handleCopyEmail}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                {copiedEmail ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy Email</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick in-app message form */}
            <form onSubmit={handleSendEmail} className="space-y-2 pt-1">
              <input
                type="text"
                value={feedbackSubject}
                onChange={(e) => setFeedbackSubject(e.target.value)}
                placeholder="Inquiry subject (e.g. Adding Year 3 Past Papers)..."
                className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
              <textarea
                rows={2}
                value={feedbackMessage}
                onChange={(e) => setFeedbackMessage(e.target.value)}
                placeholder="Write your note or question to Chanda Felix..."
                className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Open Email with Message</span>
              </button>
            </form>
          </section>

          {/* 3. Android App Package (APK) Download Option */}
          <section className="p-4 rounded-xl border border-indigo-200 dark:border-indigo-800/80 bg-indigo-50/50 dark:bg-indigo-950/40 space-y-3">
            <div className="flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap">
              <div className="flex items-center space-x-2.5 min-w-0">
                <div className="p-2 rounded-lg bg-indigo-600 text-white shadow-xs shrink-0">
                  <Smartphone className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                    Android App Package (APK)
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Download and install DATANURSE natively on your Android phone or tablet.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onOpenApkModal) onOpenApkModal();
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs transition-colors cursor-pointer shrink-0"
              >
                <Smartphone className="h-4 w-4" />
                <span>Get APK</span>
              </button>
            </div>
          </section>

          {/* 4. Online Clinical Standards Auto-Sync */}
          <section className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                  <RefreshCw className={`h-4 w-4 text-teal-600 ${isSyncing ? 'animate-spin' : ''}`} />
                  Online Clinical Standards Sync
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Default optimum conditions automatically updated from online medical guidelines
                </p>
              </div>

              <button
                type="button"
                onClick={onForceSyncConditions}
                disabled={isSyncing}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-teal-800 dark:text-teal-200 bg-teal-50 dark:bg-teal-950/80 hover:bg-teal-100 dark:hover:bg-teal-900 border border-teal-200 dark:border-teal-800 transition-colors cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Fetching...' : 'Sync Now'}</span>
              </button>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] flex items-center justify-between text-slate-600 dark:text-slate-400">
              <span>Last Synchronized Online:</span>
              <span className="font-mono font-bold text-teal-700 dark:text-teal-400">
                {lastSyncTime}
              </span>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            DATANURSE Database • Chanda Felix
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 dark:hover:bg-slate-600 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Close Settings
          </button>
        </div>
      </div>
    </div>
  );
};

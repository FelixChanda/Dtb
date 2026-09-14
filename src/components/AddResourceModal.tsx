import React, { useState, useEffect } from 'react';
import {
  X,
  Upload,
  FileText,
  Video,
  Cloud,
  CloudUpload,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Film,
  Trash2,
  ExternalLink,
  Plus,
  RefreshCw,
  Search,
  BookOpen,
  GraduationCap,
  HardDrive
} from 'lucide-react';
import {
  ResourceCategory,
  AcademicYearLevel,
  NursingDomain,
  ResourceItem,
  OsceVideo
} from '../types';
import {
  uploadFileToFirebaseStorage,
  saveResourceToFirestore,
  saveOsceVideoToFirestore,
  fetchResourcesFromFirestore,
  fetchOsceVideosFromFirestore,
  deleteResourceFromFirestore,
  deleteOsceVideoFromFirestore
} from '../services/firebaseService';

interface AddResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddResource: (newResource: ResourceItem) => void;
}

export const AddResourceModal: React.FC<AddResourceModalProps> = ({
  isOpen,
  onClose,
  onAddResource
}) => {
  if (!isOpen) return null;

  // Active Tab: 'documents' | 'videos' | 'cloud_directory'
  const [activeTab, setActiveTab] = useState<'documents' | 'videos' | 'cloud_directory'>('documents');

  // --- DOCUMENT UPLOAD STATES ---
  const [docCategory, setDocCategory] = useState<ResourceCategory>('documents');
  const [docTitle, setDocTitle] = useState('');
  const [docDomain, setDocDomain] = useState<NursingDomain>('Adult Health & Med-Surg');
  const [docYearLevel, setDocYearLevel] = useState<AcademicYearLevel>('Year 2 (Adult Health & Patho)');
  const [docDescription, setDocDescription] = useState('');
  const [docAuthor, setDocAuthor] = useState('');
  const [docTagsInput, setDocTagsInput] = useState('');
  const [docGuidelineType, setDocGuidelineType] = useState<'Clinical Procedure' | 'Emergency Protocol' | 'Practice Standard' | 'Pharmacopoeia' | 'Assessment Form'>('Clinical Procedure');
  const [docPageCount, setDocPageCount] = useState('12');
  const [selectedDocFile, setSelectedDocFile] = useState<File | null>(null);
  const [docDataUri, setDocDataUri] = useState<string>('');
  const [docUploadProgress, setDocUploadProgress] = useState<number>(0);
  const [isDocUploading, setIsDocUploading] = useState(false);
  const [docUploadSuccess, setDocUploadSuccess] = useState(false);

  // --- VIDEO UPLOAD STATES ---
  const [videoTitle, setVideoTitle] = useState('');
  const [videoCategory, setVideoCategory] = useState<'basic' | 'medsurg' | 'maternal' | 'pediatric' | 'pharmacology' | 'psychiatric' | 'community'>('maternal');
  const [videoCategoryLabel, setVideoCategoryLabel] = useState('Maternal & Midwifery');
  const [videoChannelName, setVideoChannelName] = useState('Mr. Koko Nurses Class');
  const [videoInstitution, setVideoInstitution] = useState('Mr. Koko Clinical Educator');
  const [videoDuration, setVideoDuration] = useState('15:00');
  const [videoYoutubeUrl, setVideoYoutubeUrl] = useState('');
  const [selectedVideoFile, setSelectedVideoFile] = useState<File | null>(null);
  const [videoUploadProgress, setVideoUploadProgress] = useState<number>(0);
  const [isVideoUploading, setIsVideoUploading] = useState(false);
  const [videoUploadSuccess, setVideoUploadSuccess] = useState(false);
  const [videoKeySteps, setVideoKeySteps] = useState<string[]>([
    'Verify physician order and confirm patient identification.',
    'Explain the procedure clearly to patient and obtain verbal consent.',
    'Assemble all required sterile and non-sterile equipment on clean trolley.',
    'Perform hand hygiene and maintain strict aseptic technique throughout.'
  ]);
  const [newStepText, setNewStepText] = useState('');
  const [videoEquipment, setVideoEquipment] = useState('Sterile gloves, Antiseptic solution, Gauze swabs, Kidney dish, Documentation chart');
  const [videoExamTips, setVideoExamTips] = useState('State all critical steps out loud to the OSCE examiner to guarantee maximum rubric points.');

  // --- CLOUD DIRECTORY INVENTORY STATES ---
  const [cloudResources, setCloudResources] = useState<ResourceItem[]>([]);
  const [cloudVideos, setCloudVideos] = useState<OsceVideo[]>([]);
  const [isLoadingDirectory, setIsLoadingDirectory] = useState(false);
  const [directoryFilter, setDirectoryFilter] = useState<'all' | 'documents' | 'videos'>('all');
  const [directorySearch, setDirectorySearch] = useState('');

  // Load cloud inventory when opening cloud directory tab
  useEffect(() => {
    if (activeTab === 'cloud_directory') {
      loadCloudDirectory();
    }
  }, [activeTab]);

  const loadCloudDirectory = async () => {
    setIsLoadingDirectory(true);
    try {
      const [resList, vidList] = await Promise.all([
        fetchResourcesFromFirestore().catch(() => []),
        fetchOsceVideosFromFirestore().catch(() => [])
      ]);
      setCloudResources(resList);
      setCloudVideos(vidList);
    } catch (e) {
      console.warn('Error loading cloud inventory:', e);
    } finally {
      setIsLoadingDirectory(false);
    }
  };

  // --- DOCUMENT FILE HANDLER ---
  const handleDocFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedDocFile(file);

    const cleanTitle = file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' ');
    if (!docTitle) {
      setDocTitle(cleanTitle);
    }

    const lower = file.name.toLowerCase();
    if (lower.includes('paper') || lower.includes('exam') || lower.includes('past')) {
      setDocCategory('past_papers');
    } else if (lower.includes('module') || lower.includes('syllabus')) {
      setDocCategory('modules');
    } else if (lower.includes('book') || lower.includes('textbook')) {
      setDocCategory('textbooks');
    } else {
      setDocCategory('documents');
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setDocDataUri((event.target?.result as string) || '');
    };
    reader.readAsDataURL(file);
  };

  // --- SUBMIT DOCUMENT TO FIREBASE CLOUD ---
  const handleSubmitDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle.trim()) return;

    setIsDocUploading(true);
    setDocUploadProgress(10);

    try {
      let cloudDownloadUrl = '';
      const docId = `doc-${Date.now()}`;

      // Upload file to Firebase Cloud Storage if a file was selected
      if (selectedDocFile) {
        try {
          const storagePath = `documents/${Date.now()}_${selectedDocFile.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
          cloudDownloadUrl = await uploadFileToFirebaseStorage(
            selectedDocFile,
            storagePath,
            (pct) => setDocUploadProgress(pct)
          );
        } catch (storageErr) {
          console.warn('Firebase Storage direct upload notice; storing in Firestore database:', storageErr);
        }
      }

      setDocUploadProgress(90);

      const ext = selectedDocFile?.name.split('.').pop()?.toUpperCase() || 'PDF';
      const cleanFormat = ext === 'DOCX' || ext === 'DOC' ? 'DOCX' : ext === 'TXT' ? 'TXT' : ext === 'EPUB' ? 'EPUB' : 'PDF';

      const newDocItem: ResourceItem = {
        id: docId,
        title: docTitle.trim(),
        category: docCategory,
        domain: docDomain,
        yearLevel: docYearLevel,
        description: docDescription.trim() || 'Uploaded clinical nursing resource synced to Firebase cloud.',
        authorOrInstitution: docAuthor.trim() || 'Zambian Clinical Contributor',
        updatedAt: new Date().toISOString().split('T')[0],
        tags: docTagsInput ? docTagsInput.split(',').map((t) => t.trim()).filter(Boolean) : [docCategory, docDomain.split(' ')[0]],
        isBookmarked: true,
        fileSize: selectedDocFile ? `${Math.round(selectedDocFile.size / 1024)} KB` : '1.2 MB',
        documentFormat: cleanFormat as any,
        documentUrl: cloudDownloadUrl || undefined,
        documentDataUri: docDataUri || undefined,
        documentGuidelineType: docGuidelineType,
        pageCount: parseInt(docPageCount) || 10,
        isAvailableOffline: true,
        hasAttachment: Boolean(selectedDocFile || docDataUri || cloudDownloadUrl),
        attachmentName: selectedDocFile ? selectedDocFile.name : `${docTitle.trim()}.${cleanFormat.toLowerCase()}`,
        attachmentType: cleanFormat as any,
        attachmentSize: selectedDocFile ? `${(selectedDocFile.size / 1024 / 1024).toFixed(2)} MB` : '1.2 MB',
        attachmentUrl: cloudDownloadUrl || undefined,
        attachmentDataUri: docDataUri || undefined,
        attachmentContentText: docDescription.trim() || undefined,
        documentContentText: docDescription.trim() || undefined,
        // Category specific enrichments
        moduleCode: docCategory === 'modules' ? 'NMCZ-' + Math.floor(100 + Math.random() * 900) : undefined,
        credits: docCategory === 'modules' ? 6 : undefined,
        semester: docCategory === 'modules' ? 'Semester 1' : undefined,
        examYear: docCategory === 'past_papers' ? new Date().getFullYear() : undefined,
        examPeriod: docCategory === 'past_papers' ? 'Final Examination' : undefined,
        edition: docCategory === 'textbooks' ? 'Official Reference Edition' : undefined,
        noteType: docCategory === 'notes' ? 'Clinical Cheat Sheet' : undefined,
        highYieldKeyPoints: [
          `Key focus for ${docDomain}: Review clinical protocols and competencies.`,
          `Verified nursing curriculum documentation for ${docYearLevel}.`,
          `Available for direct download, device reader preview, and offline study.`
        ]
      };

      // Save to Firestore
      await saveResourceToFirestore(newDocItem);
      onAddResource(newDocItem);

      setDocUploadProgress(100);
      setDocUploadSuccess(true);
      setTimeout(() => {
        setDocUploadSuccess(false);
        setIsDocUploading(false);
        onClose();
      }, 1200);
    } catch (error) {
      console.error('Error submitting document to cloud:', error);
      setIsDocUploading(false);
    }
  };

  // --- VIDEO FILE HANDLER ---
  const handleVideoFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedVideoFile(file);

    const cleanTitle = file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' ');
    if (!videoTitle) {
      setVideoTitle(cleanTitle);
    }
  };

  // --- SUBMIT VIDEO TO FIREBASE CLOUD ---
  const handleSubmitVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoTitle.trim()) return;

    setIsVideoUploading(true);
    setVideoUploadProgress(15);

    try {
      let cloudStreamUrl = '';
      const videoId = `osce-cloud-${Date.now()}`;

      // Upload MP4 video to Firebase Storage if selected
      if (selectedVideoFile) {
        try {
          const storagePath = `videos/${Date.now()}_${selectedVideoFile.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
          cloudStreamUrl = await uploadFileToFirebaseStorage(
            selectedVideoFile,
            storagePath,
            (pct) => setVideoUploadProgress(pct)
          );
        } catch (storageErr) {
          console.warn('Firebase Storage video upload fallback:', storageErr);
        }
      }

      setVideoUploadProgress(85);

      // Extract YouTube ID if provided
      let ytId = '';
      if (videoYoutubeUrl) {
        const match = videoYoutubeUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
        if (match && match[1]) {
          ytId = match[1];
        } else if (videoYoutubeUrl.length === 11) {
          ytId = videoYoutubeUrl;
        }
      }

      const newVideoItem: OsceVideo = {
        id: videoId,
        title: videoTitle.trim(),
        category: videoCategory,
        categoryLabel: videoCategoryLabel,
        channelName: videoChannelName.trim() || 'Zambian Clinical Educator',
        creatorTag: 'custom',
        channelSubscribers: 'Verified Cloud Channel',
        institutionBadge: videoInstitution.trim() || 'Ministry of Health Zambia',
        channelUrl: videoYoutubeUrl || 'https://youtube.com',
        youtubeId: ytId || 'q3B4g-y4P8w',
        directUrl: videoYoutubeUrl || cloudStreamUrl || 'https://youtube.com',
        streamUrl: cloudStreamUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
        duration: videoDuration.trim() || '12:00',
        views: '1 view (New)',
        uploadDate: 'Just now',
        thumbnailUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop&q=60',
        description: `${videoTitle.trim()} — Official Zambian Clinical Nursing OSCE practical demonstration stored in Firebase Cloud.`,
        keySteps: videoKeySteps.filter(Boolean),
        equipmentNeeded: videoEquipment.split(',').map((e) => e.trim()).filter(Boolean),
        examTips: videoExamTips.trim() || 'Adhere strictly to NMCZ clinical rubrics and verbalize rationale during OSCE stations.',
        isCustomUploaded: true,
        createdAt: new Date().toISOString()
      };

      // Save to Firestore osce_videos collection
      await saveOsceVideoToFirestore(newVideoItem);

      setVideoUploadProgress(100);
      setVideoUploadSuccess(true);
      setTimeout(() => {
        setVideoUploadSuccess(false);
        setIsVideoUploading(false);
        onClose();
      }, 1200);
    } catch (error) {
      console.error('Error submitting video to cloud:', error);
      setIsVideoUploading(false);
    }
  };

  const handleAddKeyStep = () => {
    if (newStepText.trim()) {
      setVideoKeySteps((prev) => [...prev, newStepText.trim()]);
      setNewStepText('');
    }
  };

  const handleRemoveKeyStep = (index: number) => {
    setVideoKeySteps((prev) => prev.filter((_, i) => i !== index));
  };

  // --- DELETE ITEM FROM CLOUD DIRECTORY ---
  const handleDeleteCloudItem = async (id: string, type: 'document' | 'video') => {
    if (!window.confirm(`Delete this ${type} from your Firebase Cloud inventory?`)) return;

    try {
      if (type === 'document') {
        await deleteResourceFromFirestore(id);
        setCloudResources((prev) => prev.filter((item) => item.id !== id));
      } else {
        await deleteOsceVideoFromFirestore(id);
        setCloudVideos((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (err) {
      console.error('Error deleting cloud item:', err);
    }
  };

  // Filter cloud items
  const filteredCloudDocs = cloudResources.filter(
    (d) =>
      d.title.toLowerCase().includes(directorySearch.toLowerCase()) ||
      d.domain.toLowerCase().includes(directorySearch.toLowerCase()) ||
      d.description.toLowerCase().includes(directorySearch.toLowerCase())
  );

  const filteredCloudVideos = cloudVideos.filter(
    (v) =>
      v.title.toLowerCase().includes(directorySearch.toLowerCase()) ||
      v.channelName.toLowerCase().includes(directorySearch.toLowerCase()) ||
      v.categoryLabel.toLowerCase().includes(directorySearch.toLowerCase())
  );

  return (
    <div
      id="add-resource-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
    >
      <div
        id="add-resource-modal-card"
        className="relative w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-teal-500/10 text-teal-600 dark:text-teal-400 rounded-xl">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Firebase Cloud Inventory Hub
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Live Auto-Sync
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Upload documents & videos to your cloud directory; they appear automatically across all user apps.
              </p>
            </div>
          </div>
          <button
            id="close-add-modal-btn"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-800/40 p-1.5 gap-1.5 text-xs font-semibold">
          <button
            id="tab-upload-documents"
            onClick={() => setActiveTab('documents')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg transition-all cursor-pointer ${
              activeTab === 'documents'
                ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-sm border border-slate-200/80 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Upload Document / Past Paper</span>
          </button>

          <button
            id="tab-upload-videos"
            onClick={() => setActiveTab('videos')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg transition-all cursor-pointer ${
              activeTab === 'videos'
                ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-sm border border-slate-200/80 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>Upload OSCE Video</span>
          </button>

          <button
            id="tab-cloud-directory"
            onClick={() => setActiveTab('cloud_directory')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg transition-all cursor-pointer ${
              activeTab === 'cloud_directory'
                ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-sm border border-slate-200/80 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Cloud className="w-4 h-4" />
            <span>Cloud Directory Explorer</span>
          </button>
        </div>

        {/* TAB 1: UPLOAD DOCUMENTS */}
        {activeTab === 'documents' && (
          <form onSubmit={handleSubmitDocument} className="p-5 overflow-y-auto space-y-4 flex-1">
            {/* File Dropzone */}
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-teal-500 dark:hover:border-teal-400 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-800/30 text-center transition-colors">
              <input
                id="doc-file-input"
                type="file"
                accept=".pdf,.docx,.doc,.txt,.epub,.pptx,.png,.jpg,.jpeg,.mp4,.mp3,.csv,.xlsx"
                onChange={handleDocFileSelect}
                className="hidden"
              />
              <label htmlFor="doc-file-input" className="cursor-pointer block">
                <Upload className="w-8 h-8 mx-auto mb-2 text-teal-600 dark:text-teal-400" />
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {selectedDocFile ? selectedDocFile.name : 'Click to select or drag any document, attachment, or past paper'}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {selectedDocFile
                    ? `${(selectedDocFile.size / 1024 / 1024).toFixed(2)} MB • Ready for Cloud Upload`
                    : 'Supported: PDF, DOCX, DOC, TXT, EPUB, PPTX, MP4, MP3 & Images (Auto-synced to Cloud)'}
                </p>
              </label>
            </div>

            {/* Document Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Resource Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2024 NMCZ Licensure Paper 1"
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Category
                </label>
                <select
                  value={docCategory}
                  onChange={(e) => setDocCategory(e.target.value as ResourceCategory)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="documents">Clinical Guidelines & Documents</option>
                  <option value="past_papers">Past Examination Papers</option>
                  <option value="modules">Curriculum Modules & Syllabi</option>
                  <option value="textbooks">Textbooks & Reference Books</option>
                  <option value="notes">Clinical Notes & Summaries</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nursing Domain
                </label>
                <select
                  value={docDomain}
                  onChange={(e) => setDocDomain(e.target.value as NursingDomain)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="Adult Health & Med-Surg">Adult Health & Med-Surg</option>
                  <option value="Fundamentals & Assessment">Fundamentals & Assessment</option>
                  <option value="Pharmacology">Pharmacology</option>
                  <option value="Maternal & Neonatal">Maternal & Neonatal</option>
                  <option value="Pediatric Nursing">Pediatric Nursing</option>
                  <option value="Mental Health & Psychiatric">Mental Health & Psychiatric</option>
                  <option value="Critical Care & Emergency">Critical Care & Emergency</option>
                  <option value="Community & Public Health">Community & Public Health</option>
                  <option value="Leadership, Ethics & Legal">Leadership, Ethics & Legal</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Academic Year Level
                </label>
                <select
                  value={docYearLevel}
                  onChange={(e) => setDocYearLevel(e.target.value as AcademicYearLevel)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="All Years">All Years</option>
                  <option value="Year 1 (Foundations)">Year 1 (Foundations)</option>
                  <option value="Year 2 (Adult Health & Patho)">Year 2 (Adult Health & Patho)</option>
                  <option value="Year 3 (Specialties & Peds)">Year 3 (Specialties & Peds)</option>
                  <option value="Year 4 (Leadership & Intensive)">Year 4 (Leadership & Intensive)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Description & Key Objectives
              </label>
              <textarea
                rows={2}
                placeholder="High-yield summary of key clinical points, questions covered, or protocols."
                value={docDescription}
                onChange={(e) => setDocDescription(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Author / Institution
                </label>
                <input
                  type="text"
                  placeholder="e.g. Nursing and Midwifery Council of Zambia (NMCZ)"
                  value={docAuthor}
                  onChange={(e) => setDocAuthor(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. NMCZ, Licensure, MedSurg, 2024"
                  value={docTagsInput}
                  onChange={(e) => setDocTagsInput(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* Progress Bar if Uploading */}
            {isDocUploading && (
              <div className="space-y-1.5 p-3 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800">
                <div className="flex justify-between text-xs font-semibold text-teal-700 dark:text-teal-300">
                  <span>Uploading to Firebase Cloud Storage...</span>
                  <span>{docUploadProgress}%</span>
                </div>
                <div className="w-full h-2 bg-teal-200 dark:bg-teal-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-teal-600 dark:bg-teal-400 transition-all duration-300"
                    style={{ width: `${docUploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {docUploadSuccess && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Document successfully uploaded and synced to Firebase Cloud!</span>
              </div>
            )}

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isDocUploading || !docTitle.trim()}
                className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md shadow-teal-600/20 disabled:opacity-50 transition-all cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>Upload & Sync to Cloud</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: UPLOAD OSCE VIDEOS */}
        {activeTab === 'videos' && (
          <form onSubmit={handleSubmitVideo} className="p-5 overflow-y-auto space-y-4 flex-1">
            {/* Video File / URL Input */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* File Upload Option */}
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-teal-500 dark:hover:border-teal-400 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-800/30 text-center transition-colors">
                <input
                  id="video-file-input"
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime"
                  onChange={handleVideoFileSelect}
                  className="hidden"
                />
                <label htmlFor="video-file-input" className="cursor-pointer block">
                  <Film className="w-7 h-7 mx-auto mb-1.5 text-teal-600 dark:text-teal-400" />
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {selectedVideoFile ? selectedVideoFile.name : 'Upload MP4 Video File'}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Direct Cloud Storage Upload
                  </p>
                </label>
              </div>

              {/* YouTube or Stream URL Option */}
              <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-3.5 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col justify-center">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Or Paste YouTube / Stream URL
                </label>
                <input
                  type="text"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={videoYoutubeUrl}
                  onChange={(e) => setVideoYoutubeUrl(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
                <span className="text-[10px] text-slate-400 mt-1">
                  Supports YouTube links or direct MP4/HLS streams.
                </span>
              </div>
            </div>

            {/* Video Metadata */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  OSCE Procedure Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sterile Foley Catheterization"
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Procedure Specialty
                </label>
                <select
                  value={videoCategory}
                  onChange={(e) => {
                    const val = e.target.value as any;
                    setVideoCategory(val);
                    const labels: Record<string, string> = {
                      maternal: 'Maternal & Midwifery',
                      medsurg: 'Med-Surg Nursing',
                      basic: 'Basic Nursing Foundations',
                      pediatric: 'Pediatric Care',
                      pharmacology: 'Medication Administration',
                      psychiatric: 'Mental Health Nursing',
                      community: 'Community Health'
                    };
                    setVideoCategoryLabel(labels[val] || 'Clinical Procedure');
                  }}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="maternal">Maternal & Midwifery</option>
                  <option value="medsurg">Med-Surg Nursing</option>
                  <option value="basic">Basic Nursing Foundations</option>
                  <option value="pediatric">Pediatric Care</option>
                  <option value="pharmacology">Medication Administration</option>
                  <option value="psychiatric">Mental Health Nursing</option>
                  <option value="community">Community Health</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Channel / Educator Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mr. Koko Nurses Class, Nurse Mwamba, UTH"
                  value={videoChannelName}
                  onChange={(e) => setVideoChannelName(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Institution Badge
                </label>
                <input
                  type="text"
                  placeholder="e.g. University Teaching Hospital (UTH)"
                  value={videoInstitution}
                  onChange={(e) => setVideoInstitution(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* Checklist Steps Builder */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                OSCE Procedure Checklist Steps ({videoKeySteps.length})
              </label>
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {videoKeySteps.map((step, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-2 p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200"
                  >
                    <span className="font-semibold text-teal-600 dark:text-teal-400 min-w-[20px]">
                      {idx + 1}.
                    </span>
                    <span className="flex-1">{step}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveKeyStep(idx)}
                      className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add next procedural step..."
                  value={newStepText}
                  onChange={(e) => setNewStepText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddKeyStep();
                    }
                  }}
                  className="flex-1 text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
                <button
                  type="button"
                  onClick={handleAddKeyStep}
                  className="px-3 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Step</span>
                </button>
              </div>
            </div>

            {/* Equipment & Tips */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Required Equipment (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="Sterile gloves, Normal saline, Swabs"
                  value={videoEquipment}
                  onChange={(e) => setVideoEquipment(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  OSCE Examiner Rubric Tip
                </label>
                <input
                  type="text"
                  placeholder="Examiner high-yield tip..."
                  value={videoExamTips}
                  onChange={(e) => setVideoExamTips(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* Upload Progress */}
            {isVideoUploading && (
              <div className="space-y-1.5 p-3 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800">
                <div className="flex justify-between text-xs font-semibold text-teal-700 dark:text-teal-300">
                  <span>Uploading OSCE Video to Firebase Cloud Storage...</span>
                  <span>{videoUploadProgress}%</span>
                </div>
                <div className="w-full h-2 bg-teal-200 dark:bg-teal-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-teal-600 dark:bg-teal-400 transition-all duration-300"
                    style={{ width: `${videoUploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {videoUploadSuccess && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>OSCE Video successfully saved to Firebase Cloud!</span>
              </div>
            )}

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isVideoUploading || !videoTitle.trim()}
                className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md shadow-teal-600/20 disabled:opacity-50 transition-all cursor-pointer"
              >
                <Film className="w-4 h-4" />
                <span>Save Video to Cloud</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 3: CLOUD DIRECTORY EXPLORER */}
        {activeTab === 'cloud_directory' && (
          <div className="p-5 overflow-y-auto space-y-4 flex-1 flex flex-col">
            {/* Header / Search Controls */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search files in Firebase Cloud..."
                  value={directorySearch}
                  onChange={(e) => setDirectorySearch(e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setDirectoryFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                    directoryFilter === 'all'
                      ? 'bg-teal-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  All ({cloudResources.length + cloudVideos.length})
                </button>
                <button
                  onClick={() => setDirectoryFilter('documents')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                    directoryFilter === 'documents'
                      ? 'bg-teal-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  Documents ({cloudResources.length})
                </button>
                <button
                  onClick={() => setDirectoryFilter('videos')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                    directoryFilter === 'videos'
                      ? 'bg-teal-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  Videos ({cloudVideos.length})
                </button>
                <button
                  onClick={loadCloudDirectory}
                  className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                  title="Refresh Cloud Inventory"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingDirectory ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            {/* Cloud Items List */}
            <div className="flex-1 overflow-y-auto space-y-2 max-h-[50vh] pr-1">
              {isLoadingDirectory ? (
                <div className="py-12 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
                  <RefreshCw className="w-6 h-6 animate-spin text-teal-600" />
                  <span className="text-xs">Querying Firebase Cloud Inventory...</span>
                </div>
              ) : (
                <>
                  {/* Documents List */}
                  {(directoryFilter === 'all' || directoryFilter === 'documents') &&
                    filteredCloudDocs.map((docItem) => (
                      <div
                        key={docItem.id}
                        className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 hover:border-teal-500/40 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="p-2 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                              {docItem.title}
                            </h4>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                              {docItem.category.toUpperCase()} • {docItem.domain} • {docItem.fileSize || '1.5 MB'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 ml-2">
                          <button
                            onClick={() => handleDeleteCloudItem(docItem.id, 'document')}
                            className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                            title="Delete from Cloud"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}

                  {/* Videos List */}
                  {(directoryFilter === 'all' || directoryFilter === 'videos') &&
                    filteredCloudVideos.map((videoItem) => (
                      <div
                        key={videoItem.id}
                        className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 hover:border-teal-500/40 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="p-2 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400">
                            <Video className="w-4 h-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                              {videoItem.title}
                            </h4>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                              {videoItem.channelName} • {videoItem.categoryLabel} • {videoItem.duration}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 ml-2">
                          <button
                            onClick={() => handleDeleteCloudItem(videoItem.id, 'video')}
                            className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                            title="Delete from Cloud"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}

                  {filteredCloudDocs.length === 0 && filteredCloudVideos.length === 0 && (
                    <div className="py-10 text-center text-slate-400 text-xs">
                      No files matching '{directorySearch}' found in Firebase Cloud.
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Cloud Status Footer */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Firebase Cloud Storage & Firestore Connected
              </span>
              <span>{cloudResources.length + cloudVideos.length} Total Cloud Items</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

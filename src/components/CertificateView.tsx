import React, { useState } from 'react';
import { 
  Award, 
  Download, 
  Printer, 
  ShieldCheck, 
  Share2, 
  CheckCircle, 
  Star, 
  Calendar, 
  Hash, 
  QrCode,
  CreditCard,
  Sparkles,
  Upload,
  Layers,
  Eye,
  FileCheck,
  ArrowLeft,
  Lock
} from 'lucide-react';
import { Course, User, CustomCertificate, CertificateSettings } from '../types/astronomy';
import { generateCertificatePNG } from '../utils/certificateGenerator';
import { DEFAULT_CERTIFICATE_SETTINGS } from '../data/initialCourses';

interface CertificateViewProps {
  currentUser: User;
  courses: Course[];
  completedLessons: number[];
  customCertificates?: CustomCertificate[];
  activeCustomTemplate?: string;
  certificateSettings?: CertificateSettings;
  onNavigateToUploadCertificate?: () => void;
  onNavigateToAdmin?: () => void;
  onBackToCourses?: () => void;
  isAdminUnlocked?: boolean;
}

export const CertificateView: React.FC<CertificateViewProps> = ({
  currentUser,
  courses,
  completedLessons,
  customCertificates = [],
  activeCustomTemplate,
  certificateSettings = DEFAULT_CERTIFICATE_SETTINGS,
  onNavigateToUploadCertificate,
  onNavigateToAdmin,
  onBackToCourses,
  isAdminUnlocked = false,
}) => {
  const [selectedTrackTitle, setSelectedTrackTitle] = useState('Comprehensive Observational Astronomy Fellowship');
  const [activeViewMode, setActiveViewMode] = useState<'certificate' | 'idcard' | 'custom_list'>('certificate');
  const [useCustomTemplateBg, setUseCustomTemplateBg] = useState(Boolean(activeCustomTemplate));
  const [isCopied, setIsCopied] = useState(false);

  const verificationHash = 'SEC-ASTR-99482-B26';
  const currentDate = 'September 26, 2026';

  const handleDownloadPNG = () => {
    generateCertificatePNG(
      currentUser.name,
      currentUser.memberId,
      selectedTrackTitle,
      currentDate,
      verificationHash,
      useCustomTemplateBg ? activeCustomTemplate : undefined,
      certificateSettings
    );
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(
      `https://astronomy.org/verify?cert=${verificationHash}&member=${encodeURIComponent(currentUser.memberId)}`
    );
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-in fade-in">
      {/* Top Friendly Navigation Bar */}
      {onBackToCourses && (
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800/80 no-print">
          <button
            onClick={onBackToCourses}
            className="group inline-flex items-center gap-2 px-4 py-2 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-500 text-slate-200 hover:text-white rounded-xl text-xs font-semibold tracking-wide transition shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 text-cyan-400 group-hover:-translate-x-1 transition-transform" />
            <span>← BACK TO COURSES</span>
          </button>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span>MEMBER ID: <strong className="text-cyan-400">{currentUser.memberId}</strong></span>
          </div>
        </div>
      )}

      {/* View Header & Action Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 no-print">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Award className="w-7 h-7 text-indigo-400" />
            Official Society Certification
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Personalized academic credentials, verifiable diplomas, and official society observatory identification.
          </p>
        </div>

        {/* View Switcher: Certificate vs ID Card vs Verified Uploads */}
        <div className="flex flex-wrap items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveViewMode('certificate')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              activeViewMode === 'certificate'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Award className="w-3.5 h-3.5 inline mr-1.5" />
            Diploma
          </button>

          <button
            onClick={() => setActiveViewMode('idcard')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              activeViewMode === 'idcard'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5 inline mr-1.5" />
            Observatory Pass
          </button>

          <button
            onClick={() => setActiveViewMode('custom_list')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              activeViewMode === 'custom_list'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-purple-300 hover:text-white'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5 inline mr-1.5" />
            Verified Registry ({customCertificates.length})
          </button>
        </div>
      </div>

      {/* Track Selector & Action Buttons (no-print) */}
      {activeViewMode === 'certificate' && (
        <div className="bg-[#090d16] border border-slate-800/90 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 no-print shadow-xl">
          <div className="flex flex-wrap items-center gap-3">
            <label className="text-xs font-mono text-slate-400">COURSE TRACK:</label>
            <select
              value={selectedTrackTitle}
              onChange={(e) => setSelectedTrackTitle(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-medium"
            >
              <option value="Comprehensive Observational Astronomy Fellowship">
                Comprehensive Observational Astronomy Fellowship
              </option>
              {courses.map((course) => (
                <option key={course.id} value={course.title}>
                  {course.title}
                </option>
              ))}
            </select>

            {activeCustomTemplate && (
              <label className="flex items-center gap-2 text-xs text-purple-300 bg-purple-950/40 px-3 py-1.5 rounded-xl border border-purple-800/40 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useCustomTemplateBg}
                  onChange={(e) => setUseCustomTemplateBg(e.target.checked)}
                  className="rounded accent-purple-500"
                />
                <span>Use Custom Template</span>
              </label>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* ONLY ADMIN CAN UPLOAD CERTIFICATES */}
            {isAdminUnlocked && onNavigateToUploadCertificate && (
              <button
                onClick={onNavigateToUploadCertificate}
                className="px-3.5 py-2 bg-purple-900/60 hover:bg-purple-800 border border-purple-700/60 text-purple-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>+ Upload Certificate (Admin)</span>
              </button>
            )}

            <button
              onClick={handleShare}
              className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition"
              title="Copy cryptographic verification link"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{isCopied ? 'Link Copied!' : 'Share'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>

            <button
              onClick={handleDownloadPNG}
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-900/30 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PNG</span>
            </button>
          </div>
        </div>
      )}

      {/* DIPLOMA VIEW */}
      {activeViewMode === 'certificate' && (
        <div 
          className="certificate-print-container relative border-2 border-indigo-500/40 rounded-3xl p-8 sm:p-12 md:p-16 text-center shadow-2xl overflow-hidden transition"
          style={{
            backgroundImage: useCustomTemplateBg && activeCustomTemplate 
              ? `linear-gradient(rgba(5, 8, 18, 0.4), rgba(3, 4, 8, 0.7)), url(${activeCustomTemplate})` 
              : 'radial-gradient(ellipse at center, #0c1222 0%, #060913 60%, #020408 100%)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Subtle Celestial Star Background Accents */}
          <div className="absolute top-6 left-6 text-indigo-400/20 text-4xl font-serif select-none pointer-events-none">★</div>
          <div className="absolute top-6 right-6 text-indigo-400/20 text-4xl font-serif select-none pointer-events-none">✦</div>
          <div className="absolute bottom-6 left-6 text-indigo-400/20 text-4xl font-serif select-none pointer-events-none">✦</div>
          <div className="absolute bottom-6 right-6 text-indigo-400/20 text-4xl font-serif select-none pointer-events-none">★</div>

          {/* Thin Inner Frame */}
          <div className="border border-indigo-400/20 rounded-2xl p-6 sm:p-10 relative bg-black/25 backdrop-blur-[1px]">
            {/* Header Lockup */}
            <div className="space-y-1 mb-6">
              <p className="text-[11px] tracking-[0.25em] text-cyan-400 uppercase font-mono font-semibold">
                {certificateSettings.societyName.toUpperCase()}
              </p>
              <p className="text-[10px] text-slate-400 tracking-wider uppercase font-mono">
                {certificateSettings.facultyName.toUpperCase()}
              </p>
            </div>

            {/* Award Title */}
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white tracking-wide mb-3">
              {certificateSettings.certificateTitle}
            </h2>

            <p className="text-xs text-slate-300 max-w-md mx-auto mb-6">
              This official credential certifies that registered fellow
            </p>

            {/* Dynamic Name and ID Stamping */}
            <div className="my-6">
              <p className="text-3xl sm:text-5xl font-serif text-indigo-200 font-bold tracking-tight inline-block border-b-2 border-indigo-500/60 pb-2">
                {currentUser.name}
              </p>
              <p className="text-xs font-mono text-cyan-300 mt-3 tracking-widest uppercase">
                MEMBERSHIP ID: {currentUser.memberId}
              </p>
            </div>

            {/* Curriculum Track Body Text */}
            <div className="max-w-xl mx-auto space-y-3 mb-10 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <p>
                Has successfully completed the theoretical syllabus and observational requirements in
              </p>
              <p className="text-base sm:text-lg font-semibold text-white tracking-normal font-sans">
                "{selectedTrackTitle}"
              </p>
              <p className="text-xs text-slate-400">
                {certificateSettings.citationBody}
              </p>
            </div>

            {/* Gold Society Seal in Center */}
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-200 p-0.5 shadow-xl shadow-amber-950/40">
                <div className="w-full h-full rounded-full bg-[#0a0f1d] flex flex-col items-center justify-center border border-amber-400/50">
                  <Star className="w-5 h-5 text-amber-300 fill-amber-300" />
                  <span className="text-[8px] font-mono tracking-widest text-amber-200 mt-1 uppercase">{certificateSettings.sealText.toUpperCase()}</span>
                  <span className="text-[7px] text-amber-400/80 font-mono">{certificateSettings.sealYear}</span>
                </div>
              </div>
            </div>

            {/* Signatures & Verification Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-slate-800 text-xs">
              <div className="space-y-1">
                <p className="font-serif italic text-slate-300 text-base">{certificateSettings.signatory1Name}</p>
                <div className="w-28 h-px bg-slate-700 mx-auto" />
                <p className="font-semibold text-white text-[11px]">{certificateSettings.signatory1Title}</p>
                <p className="text-[10px] text-slate-500 font-mono">Date: {currentDate}</p>
              </div>

              <div className="flex flex-col items-center justify-center space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-[11px] font-semibold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>BLOCKCHAIN VERIFIED</span>
                </div>
                <p className="text-[9px] font-mono text-slate-500 truncate max-w-[180px]">
                  HASH: {verificationHash}
                </p>
                <p className="text-[9px] text-slate-500">Official Society Registry</p>
              </div>

              <div className="space-y-1">
                <p className="font-serif italic text-slate-300 text-base">{certificateSettings.signatory2Name}</p>
                <div className="w-28 h-px bg-slate-700 mx-auto" />
                <p className="font-semibold text-white text-[11px]">{certificateSettings.signatory2Title}</p>
                <p className="text-[10px] text-slate-500 font-mono">Accredited Fellow</p>
              </div>
            </div>

            {/* Admin Quick Edit Shortcut */}
            {isAdminUnlocked && onNavigateToAdmin && (
              <div className="mt-8 pt-4 border-t border-slate-800/80 flex justify-center no-print">
                <button
                  onClick={onNavigateToAdmin}
                  className="px-4 py-2 bg-purple-950/80 hover:bg-purple-900 border border-purple-600/50 hover:border-purple-400 text-purple-200 rounded-xl text-xs font-semibold flex items-center gap-2 transition shadow-md"
                >
                  <Award className="w-4 h-4 text-purple-400" />
                  <span>Admin: Customize Certificate Signatories & Titles</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* PASS / ID CARD VIEW */}
      {activeViewMode === 'idcard' && (
        <div className="max-w-md mx-auto bg-gradient-to-br from-slate-900 via-indigo-950/70 to-slate-950 border-2 border-indigo-500/50 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

          {/* Card Header */}
          <div className="flex items-center justify-between border-b border-indigo-500/30 pb-4 mb-5">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">🔭</span>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">ASTRONOMY SOCIETY</h4>
                <p className="text-[9px] font-mono text-indigo-400">OFFICIAL OBSERVATORY CREDENTIAL</p>
              </div>
            </div>
            <span className="text-[9px] font-mono bg-indigo-900/60 text-indigo-300 px-2 py-0.5 rounded border border-indigo-700/50">
              ACTIVE
            </span>
          </div>

          {/* Member Details */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-indigo-900/80 border border-indigo-400/60 flex items-center justify-center text-3xl shadow-inner shrink-0 overflow-hidden">
              {currentUser.photoUrl ? (
                <img src={currentUser.photoUrl} alt="Member Avatar" className="w-full h-full object-cover" />
              ) : (
                <span>{currentUser.avatar}</span>
              )}
            </div>

            <div className="overflow-hidden">
              <p className="text-base font-bold text-white truncate">{currentUser.name}</p>
              <p className="text-xs text-slate-400">{currentUser.email}</p>
              <div className="mt-1.5 inline-block text-[10px] font-mono bg-indigo-500/20 text-cyan-300 px-2 py-0.5 rounded">
                ID: {currentUser.memberId}
              </div>
            </div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 space-y-2 text-xs font-mono text-slate-400 mb-5">
            <div className="flex justify-between">
              <span>Member Tier:</span>
              <strong className="text-indigo-300">{currentUser.tier}</strong>
            </div>
            <div className="flex justify-between">
              <span>Joined Date:</span>
              <span className="text-slate-300">{currentUser.joinedDate}</span>
            </div>
            <div className="flex justify-between">
              <span>Telescope Clearance:</span>
              <span className="text-emerald-400">Class-IV Research</span>
            </div>
          </div>

          <div className="border-t border-indigo-500/30 pt-4 flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span>Authorized by Director</span>
            <div className="flex items-center gap-1 text-slate-400">
              <QrCode className="w-4 h-4" />
              <span>SCAN ACCESS</span>
            </div>
          </div>
        </div>
      )}

      {/* CUSTOM CERTIFICATES LIST VIEW */}
      {activeViewMode === 'custom_list' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-purple-400" />
                Verified Society Certificates Registry
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Official certificates and external accreditations verified for registered members.
              </p>
            </div>

            {isAdminUnlocked && onNavigateToUploadCertificate && (
              <button
                onClick={onNavigateToUploadCertificate}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition shadow-lg shadow-purple-600/20"
              >
                <Upload className="w-4 h-4" />
                <span>Upload New Certificate (Admin)</span>
              </button>
            )}
          </div>

          {customCertificates.length === 0 ? (
            <div className="bg-[#090d16] border border-slate-800 rounded-3xl p-10 text-center space-y-3">
              <Award className="w-12 h-12 mx-auto text-slate-600" />
              <p className="text-sm font-medium text-white">No custom certificates in registry</p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Completed diplomas and awards uploaded by observatory administrators will appear here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {customCertificates.map((cert) => (
                <div
                  key={cert.id}
                  className="bg-[#090d16] border border-slate-800 hover:border-purple-500/50 rounded-2xl p-5 space-y-4 transition shadow-lg"
                >
                  <div className="aspect-[4/3] bg-slate-950 rounded-xl overflow-hidden flex items-center justify-center p-2 border border-slate-800">
                    {cert.fileUrl ? (
                      <img
                        src={cert.fileUrl}
                        alt={cert.courseTitle}
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <Award className="w-10 h-10 text-purple-400" />
                    )}
                  </div>

                  <div>
                    <h4 className="font-semibold text-white text-sm">{cert.courseTitle}</h4>
                    <p className="text-xs text-slate-400">{cert.issuerOrg}</p>
                  </div>

                  <div className="text-[11px] font-mono text-slate-400 space-y-1 pt-2 border-t border-slate-800">
                    <div className="flex justify-between">
                      <span>Recipient:</span>
                      <span className="text-white">{cert.recipientName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Serial:</span>
                      <span className="text-purple-400">{cert.certificateNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Date:</span>
                      <span>{cert.issueDate}</span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between gap-2">
                    <a
                      href={cert.fileUrl}
                      download={cert.fileName || 'certificate.png'}
                      className="flex-1 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-medium text-center flex items-center justify-center gap-1.5 transition"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

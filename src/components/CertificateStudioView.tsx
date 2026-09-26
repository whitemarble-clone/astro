import React, { useState, useRef } from 'react';
import { 
  Award, 
  Upload, 
  Download, 
  Printer, 
  Share2, 
  CheckCircle, 
  ShieldCheck, 
  FileText, 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  Eye, 
  Sparkles, 
  X,
  CreditCard,
  QrCode,
  Calendar,
  Layers,
  ChevronRight,
  ArrowLeft,
  Lock,
  ShieldAlert
} from 'lucide-react';
import { Course, User, CustomCertificate } from '../types/astronomy';
import { fileToDataUrl, formatFileSize } from '../utils/mediaStorage';

interface CertificateStudioViewProps {
  currentUser: User;
  courses: Course[];
  customCertificates: CustomCertificate[];
  onAddCustomCertificate: (cert: CustomCertificate) => void;
  onDeleteCustomCertificate: (certId: string) => void;
  onSetCustomTemplate: (templateDataUrl: string) => void;
  activeCustomTemplate?: string;
  onBackToCourses: () => void;
  isAdminUnlocked: boolean;
  onPromptAdminPassword: () => void;
}

export const CertificateStudioView: React.FC<CertificateStudioViewProps> = ({
  currentUser,
  courses,
  customCertificates,
  onAddCustomCertificate,
  onDeleteCustomCertificate,
  onSetCustomTemplate,
  activeCustomTemplate,
  onBackToCourses,
  isAdminUnlocked,
  onPromptAdminPassword,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'template' | 'vault'>('upload');
  
  // Upload Custom Certificate Form
  const [certTitle, setCertTitle] = useState('');
  const [recipientName, setRecipientName] = useState(currentUser.name);
  const [recipientId, setRecipientId] = useState(currentUser.memberId);
  const [issuerOrg, setIssuerOrg] = useState('International Astronomical Society');
  const [issueDate, setIssueDate] = useState('September 26, 2026');
  const [certNumber, setCertNumber] = useState(`CERT-${Math.floor(100000 + Math.random() * 900000)}`);
  const [notes, setNotes] = useState('Awarded for meritorious contributions to telescopic observation and astrophotography.');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedFileDataUrl, setUploadedFileDataUrl] = useState<string>('');
  const [selectedCourseId, setSelectedCourseId] = useState<number | undefined>(courses[0]?.id);
  
  // Custom Template Upload Form
  const [templateFile, setTemplateFile] = useState<File | null>(null);
  const [templateDataUrl, setTemplateDataUrl] = useState<string>(activeCustomTemplate || '');
  const [previewCert, setPreviewCert] = useState<CustomCertificate | null>(null);
  const [successNotice, setSuccessNotice] = useState('');

  const certFileInputRef = useRef<HTMLInputElement>(null);
  const templateFileInputRef = useRef<HTMLInputElement>(null);

  // If user is a normal member and not admin, block adding certificates!
  if (!isAdminUnlocked) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 pt-10 text-center animate-in fade-in">
        <div className="p-8 sm:p-10 bg-slate-900 border border-purple-500/40 rounded-3xl shadow-2xl space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-purple-950 border border-purple-500/50 mx-auto flex items-center justify-center text-purple-300">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-mono text-purple-400 uppercase tracking-widest bg-purple-950/80 px-3 py-1 rounded-full border border-purple-800/40">
              ADMINISTRATIVE PRIVILEGE REQUIRED
            </span>
            <h2 className="text-2xl font-bold text-white">Normal Members Cannot Add Certificates</h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-lg mx-auto">
              Uploading custom diplomas, awards, or modifying master certificate templates is restricted to Observatory Administrators only.
              Normal members can view and download their earned course diplomas in the Certificates section.
            </p>
          </div>

          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs text-slate-400 text-left space-y-1.5 font-mono">
            <div className="text-purple-300 font-semibold flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-purple-400" />
              <span>Security Rule: Admin Access Protected</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Only verified administrators with the security key (<code className="text-cyan-400">AstroEdncAdmin</code>) can upload certificates, change templates, or remove documents.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={onBackToCourses}
              className="w-full sm:w-auto px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>← Back to Courses</span>
            </button>

            <button
              onClick={onPromptAdminPassword}
              className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-purple-900/40 flex items-center justify-center gap-2 transition"
            >
              <Lock className="w-4 h-4" />
              <span>Enter Admin Password to Unlock</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Handle certificate file selection (Image or PDF)
  const handleCertFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFile(file);
    try {
      const dataUrl = await fileToDataUrl(file);
      setUploadedFileDataUrl(dataUrl);

      if (!certTitle) {
        const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        setCertTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
      }
    } catch (err) {
      console.error('Failed to read file:', err);
    }
  };

  // Handle template file selection
  const handleTemplateFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setTemplateFile(file);
    try {
      const dataUrl = await fileToDataUrl(file);
      setTemplateDataUrl(dataUrl);
      onSetCustomTemplate(dataUrl);
      setSuccessNotice('Custom certificate template updated! Official diplomas will now render on your uploaded background.');
      setTimeout(() => setSuccessNotice(''), 5000);
    } catch (err) {
      console.error('Failed to read template file:', err);
    }
  };

  // Submit new certificate
  const handleSubmitCertificate = (e: React.FormEvent) => {
    e.preventDefault();

    if (!uploadedFileDataUrl) {
      alert('Please upload your certificate image or document file.');
      return;
    }

    if (!certTitle.trim() || !recipientName.trim()) {
      alert('Please fill in certificate title and recipient name.');
      return;
    }

    const newCert: CustomCertificate = {
      id: `cert_${Date.now()}`,
      courseId: selectedCourseId,
      courseTitle: certTitle.trim(),
      recipientName: recipientName.trim(),
      memberId: recipientId.trim() || currentUser.memberId,
      issueDate: issueDate.trim() || 'September 2026',
      certificateNumber: certNumber.trim() || `CERT-${Date.now()}`,
      fileUrl: uploadedFileDataUrl,
      fileName: uploadedFile?.name || 'custom-certificate.png',
      fileType: uploadedFile?.type.includes('pdf') ? 'pdf' : 'image',
      issuerOrg: issuerOrg.trim(),
      notes: notes.trim(),
      uploadedBy: currentUser.name,
      verified: true,
    };

    onAddCustomCertificate(newCert);

    setSuccessNotice(`Certificate "${certTitle}" successfully added to registry!`);
    setTimeout(() => setSuccessNotice(''), 5000);

    // Reset
    setCertTitle('');
    setUploadedFile(null);
    setUploadedFileDataUrl('');
    if (certFileInputRef.current) certFileInputRef.current.value = '';
    setActiveTab('vault');
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto animate-in fade-in">
      {/* Top Friendly Navigation Bar with Back Button */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <button
          onClick={onBackToCourses}
          className="group inline-flex items-center gap-2 px-4 py-2 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-500 text-slate-200 hover:text-white rounded-xl text-xs font-semibold tracking-wide transition shadow-sm"
        >
          <ArrowLeft className="w-4 h-4 text-cyan-400 group-hover:-translate-x-1 transition-transform" />
          <span>← BACK TO COURSES</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs bg-purple-950/80 text-purple-300 border border-purple-700/60 px-2.5 py-1 rounded-full font-mono flex items-center gap-1.5">
            <Lock className="w-3 h-3 text-purple-400" />
            <span>Admin Mode Active (Upload & Delete Enabled)</span>
          </span>
        </div>
      </div>

      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-950/40 via-slate-900 to-indigo-950/40 border border-purple-500/30 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-purple-400 font-mono text-xs uppercase tracking-wider">
            <Award className="w-4 h-4 text-purple-400" />
            <span>Dedicated Certificate Adding & Upload Studio</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Add Your Own Certificates & Credentials
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm max-w-2xl">
            Upload your organization's custom certificate scans, existing course awards, or blank certificate templates to personalize with member names, verification seals, and barcodes.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 bg-black/60 p-1.5 rounded-xl border border-slate-800 self-stretch sm:self-auto justify-center">
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
              activeTab === 'upload'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Certificate</span>
          </button>

          <button
            onClick={() => setActiveTab('template')}
            className={`px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
              activeTab === 'template'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Custom Template</span>
          </button>

          <button
            onClick={() => setActiveTab('vault')}
            className={`px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
              activeTab === 'vault'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Vault ({customCertificates.length})</span>
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {successNotice && (
        <div className="bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 px-4 py-3 rounded-2xl flex items-center justify-between text-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successNotice}</span>
          </div>
          <button
            onClick={() => setSuccessNotice('')}
            className="text-emerald-400 hover:text-emerald-200 text-xs font-mono"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* TAB 1: UPLOAD COMPLETED CERTIFICATE */}
      {activeTab === 'upload' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Uploader Form (7 cols) */}
          <div className="lg:col-span-7 bg-[#090d16] border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-6 shadow-xl">
            <div className="pb-4 border-b border-slate-800">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Upload className="w-5 h-5 text-purple-400" />
                Upload Completed Certificate Image / Document
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Have an existing certificate from your astronomy club, university, or observatory? Upload it here to link to your profile.
              </p>
            </div>

            <form onSubmit={handleSubmitCertificate} className="space-y-5">
              {/* File Dropzone */}
              <div className="space-y-2">
                <label className="block text-xs font-mono text-purple-400 uppercase tracking-wider">
                  Select Certificate File (.png, .jpg, .webp, .pdf)
                </label>
                <div
                  onClick={() => certFileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center gap-2 ${
                    uploadedFileDataUrl
                      ? 'border-purple-500 bg-purple-950/20'
                      : 'border-slate-800 hover:border-slate-700 bg-slate-950/60'
                  }`}
                >
                  <input
                    ref={certFileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp,application/pdf"
                    onChange={handleCertFileChange}
                    className="hidden"
                  />
                  <div className="w-12 h-12 rounded-full bg-purple-950 border border-purple-500/40 flex items-center justify-center text-purple-400">
                    <Award className="w-6 h-6" />
                  </div>
                  {uploadedFile ? (
                    <div>
                      <p className="text-sm font-semibold text-white truncate max-w-sm">{uploadedFile.name}</p>
                      <p className="text-xs text-purple-400 font-mono mt-0.5">
                        {formatFileSize(uploadedFile.size)} · Ready to register
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1">Click to replace file</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm font-medium text-white">Click or drag & drop certificate image here</p>
                      <p className="text-xs text-slate-400 mt-1">
                        High resolution PNG, JPG, or PDF recommended
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Certificate Metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Certificate Award Title *</label>
                  <input
                    type="text"
                    placeholder="e.g. Master Astrophotographer Diploma"
                    value={certTitle}
                    onChange={(e) => setCertTitle(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Issuing Organization</label>
                  <input
                    type="text"
                    placeholder="e.g. Royal Observatory or Backyard Astro Club"
                    value={issuerOrg}
                    onChange={(e) => setIssuerOrg(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Recipient Name *</label>
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Member ID</label>
                  <input
                    type="text"
                    value={recipientId}
                    onChange={(e) => setRecipientId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white font-mono focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Issue Date</label>
                  <input
                    type="text"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Certificate / Serial ID</label>
                  <input
                    type="text"
                    value={certNumber}
                    onChange={(e) => setCertNumber(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white font-mono focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Associated Course Track (Optional)</label>
                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="">General Society Award / No Specific Course</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Honors / Citation Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-purple-500 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 font-semibold rounded-xl text-white text-xs shadow-lg shadow-purple-600/20 transition flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Save Certificate to Society Registry</span>
              </button>
            </form>
          </div>

          {/* Right: Live Preview Box (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#090d16] border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Eye className="w-4 h-4 text-purple-400" />
                  Live Preview
                </h3>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                  Ready to Stamp
                </span>
              </div>

              <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 aspect-[4/3] flex items-center justify-center overflow-hidden relative">
                {uploadedFileDataUrl ? (
                  <img
                    src={uploadedFileDataUrl}
                    alt="Certificate Preview"
                    className="max-w-full max-h-full object-contain rounded shadow-lg"
                  />
                ) : (
                  <div className="text-center p-6 text-slate-500 space-y-2">
                    <Award className="w-12 h-12 mx-auto stroke-1 text-slate-600" />
                    <p className="text-xs">Upload a certificate image on the left to see live rendering.</p>
                  </div>
                )}
              </div>

              {/* Quick Details Stamping Card */}
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Recipient:</span>
                  <strong className="text-white">{recipientName || '—'}</strong>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Member ID:</span>
                  <span className="text-purple-400 font-mono">{recipientId || '—'}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Serial:</span>
                  <span className="text-slate-300 font-mono">{certNumber || '—'}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Issuing Body:</span>
                  <span className="text-slate-300">{issuerOrg}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: UPLOAD CUSTOM CERTIFICATE TEMPLATE */}
      {activeTab === 'template' && (
        <div className="bg-[#090d16] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="max-w-2xl space-y-2">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-purple-400" />
              Upload Custom Certificate Template (Background)
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Have your own official society certificate design, seal, or bordered parchment graphic? Upload it as the master template. All official course completion diplomas will automatically render on top of YOUR custom template image!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="space-y-4">
              <div
                onClick={() => templateFileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition flex flex-col items-center justify-center gap-3 ${
                  templateDataUrl
                    ? 'border-purple-500 bg-purple-950/20'
                    : 'border-slate-800 hover:border-slate-700 bg-slate-950/60'
                }`}
              >
                <input
                  ref={templateFileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleTemplateFileChange}
                  className="hidden"
                />
                <div className="w-14 h-14 rounded-full bg-purple-950 border border-purple-500/40 flex items-center justify-center text-purple-400">
                  <ImageIcon className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">
                    {templateFile ? templateFile.name : 'Click to Upload Template Image'}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Recommended dimensions: 1920×1080 (16:9) or 1600×1200 (4:3) PNG or JPG
                  </p>
                </div>
              </div>

              {templateDataUrl && (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setTemplateDataUrl('');
                      onSetCustomTemplate('');
                      setSuccessNotice('Reverted to default Astronomy Society diploma style.');
                    }}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-rose-300 text-xs rounded-xl transition"
                  >
                    Reset to Default Astronomy Society Template
                  </button>
                </div>
              )}
            </div>

            {/* Template Preview */}
            <div className="space-y-3">
              <span className="text-xs font-mono text-purple-400 uppercase tracking-wider">
                Current Active Template Preview
              </span>
              <div className="aspect-[16/9] bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex items-center justify-center relative shadow-xl">
                {templateDataUrl ? (
                  <div className="w-full h-full relative">
                    <img
                      src={templateDataUrl}
                      alt="Custom Template"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center text-center p-4">
                      <p className="text-[10px] font-mono text-amber-300 bg-black/70 px-3 py-1 rounded-full uppercase tracking-widest border border-amber-500/30">
                        Active Custom Background
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-6 text-slate-500">
                    <p className="text-xs">Using standard Deep Space Society diploma styling.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CERTIFICATES VAULT WITH DELETE */}
      {activeTab === 'vault' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
            <div>
              <h2 className="text-xl font-bold text-white">Your Certificate Vault</h2>
              <p className="text-xs text-slate-400">All registered and uploaded certificates ready for inspection, download, or deletion.</p>
            </div>

            <button
              onClick={() => setActiveTab('upload')}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium rounded-xl flex items-center gap-2 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Upload Another Certificate</span>
            </button>
          </div>

          {customCertificates.length === 0 ? (
            <div className="bg-[#090d16] border border-slate-800 rounded-3xl p-12 text-center text-slate-400 space-y-3">
              <Award className="w-12 h-12 mx-auto text-slate-600" />
              <p className="text-sm font-medium text-white">No custom certificates uploaded yet</p>
              <p className="text-xs max-w-md mx-auto">
                Upload your external astronomy certificates or custom society awards using the upload tab above.
              </p>
              <button
                onClick={() => setActiveTab('upload')}
                className="mt-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs rounded-xl"
              >
                Upload First Certificate
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {customCertificates.map((cert) => (
                <div
                  key={cert.id}
                  className="bg-[#090d16] border border-slate-800 hover:border-purple-500/50 rounded-2xl overflow-hidden transition flex flex-col justify-between group shadow-lg"
                >
                  {/* Thumbnail */}
                  <div 
                    onClick={() => setPreviewCert(cert)}
                    className="aspect-[4/3] bg-slate-950 relative overflow-hidden cursor-pointer flex items-center justify-center p-3"
                  >
                    {cert.fileUrl ? (
                      <img
                        src={cert.fileUrl}
                        alt={cert.courseTitle}
                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition duration-300"
                      />
                    ) : (
                      <Award className="w-12 h-12 text-purple-400/40" />
                    )}
                    <div className="absolute top-2 right-2 bg-black/70 backdrop-blur px-2 py-0.5 rounded text-[10px] font-mono text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      <span>VERIFIED</span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-4 space-y-3">
                    <div>
                      <h4 className="text-sm font-semibold text-white group-hover:text-purple-300 transition">
                        {cert.courseTitle}
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">{cert.issuerOrg || 'Astronomical Society'}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 space-y-1 font-mono">
                      <div className="flex justify-between">
                        <span>Issued To:</span>
                        <strong className="text-white">{cert.recipientName}</strong>
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

                    {/* Actions */}
                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                      <button
                        onClick={() => setPreviewCert(cert)}
                        className="flex-1 py-1.5 bg-purple-600/80 hover:bg-purple-600 text-white rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>

                      <a
                        href={cert.fileUrl}
                        download={cert.fileName || 'certificate.png'}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition"
                        title="Download Certificate"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </a>

                      <button
                        onClick={() => {
                          if (window.confirm(`Delete certificate "${cert.courseTitle}" for ${cert.recipientName}?`)) {
                            onDeleteCustomCertificate(cert.id);
                          }
                        }}
                        className="p-1.5 bg-rose-950/70 hover:bg-rose-900 border border-rose-800/60 text-rose-300 hover:text-white rounded-lg transition"
                        title="Delete Certificate"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Lightbox / High-Res Inspector Modal */}
      {previewCert && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#090d16] border border-slate-800 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setPreviewCert(null)}
              className="absolute top-5 right-5 p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-full transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest">
                VERIFIED CREDENTIAL ARCHIVE
              </span>
              <h3 className="text-xl font-bold text-white mt-1">{previewCert.courseTitle}</h3>
              <p className="text-xs text-slate-400 font-mono">
                Awarded to {previewCert.recipientName} · ID: {previewCert.memberId} · Issued by {previewCert.issuerOrg}
              </p>
            </div>

            {/* Document display */}
            <div className="bg-slate-950 rounded-2xl border border-slate-800 p-4 flex items-center justify-center min-h-[360px] max-h-[500px]">
              {previewCert.fileUrl && (
                <img
                  src={previewCert.fileUrl}
                  alt={previewCert.courseTitle}
                  className="max-h-[460px] max-w-full object-contain rounded-lg shadow-xl"
                />
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800 text-xs font-mono">
              <div className="text-slate-400">
                <span>Certificate Token: </span>
                <span className="text-purple-400 font-bold">{previewCert.certificateNumber}</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl flex items-center gap-1.5 transition"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>

                <a
                  href={previewCert.fileUrl}
                  download={previewCert.fileName || 'certificate.png'}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl flex items-center gap-1.5 transition shadow-lg shadow-purple-600/20"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download High-Res</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

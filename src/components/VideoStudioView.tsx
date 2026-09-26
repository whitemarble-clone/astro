import React, { useState, useRef } from 'react';
import { 
  Video, 
  Upload, 
  Link, 
  Plus, 
  Trash2, 
  Play, 
  CheckCircle2, 
  Film, 
  Sparkles, 
  FileVideo, 
  Clock, 
  Layers, 
  Compass, 
  AlertCircle,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  ArrowLeft,
  Lock,
  ShieldAlert,
  Unlink
} from 'lucide-react';
import { Course, Lesson } from '../types/astronomy';
import { fileToObjectUrl, formatFileSize, formatVideoUrl } from '../utils/mediaStorage';

interface VideoStudioViewProps {
  courses: Course[];
  onAddLesson: (courseId: number, lesson: Omit<Lesson, 'id'>) => void;
  onDeleteLesson: (courseId: number, lessonId: number) => void;
  onCreateCourse: (course: Omit<Course, 'id' | 'lessons'>) => void;
  onSelectCourseToPlay: (course: Course) => void;
  onBackToCourses: () => void;
  isAdminUnlocked: boolean;
  onPromptAdminPassword: () => void;
}

export const VideoStudioView: React.FC<VideoStudioViewProps> = ({
  courses,
  onAddLesson,
  onDeleteLesson,
  onCreateCourse,
  onSelectCourseToPlay,
  onBackToCourses,
  isAdminUnlocked,
  onPromptAdminPassword,
}) => {
  // Input method: 'file' (upload own file) or 'url' (web link / youtube / vimeo)
  const [sourceType, setSourceType] = useState<'file' | 'url'>('file');

  // Form states
  const [selectedCourseId, setSelectedCourseId] = useState<number>(courses[0]?.id || 1);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoFileUrl, setVideoFileUrl] = useState<string>('');
  const [videoWebUrl, setVideoWebUrl] = useState<string>('');
  const [lessonTitle, setLessonTitle] = useState<string>('');
  const [lessonDuration, setLessonDuration] = useState<string>('');
  const [lessonDescription, setLessonDescription] = useState<string>('');
  const [targetObject, setTargetObject] = useState<string>('Deep Sky Astro Target');
  const [raCoord, setRaCoord] = useState<string>('05h 35m 17s');
  const [decCoord, setDecCoord] = useState<string>('-05° 23′ 28″');
  const [isCreatingNewCourse, setIsCreatingNewCourse] = useState(false);
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseCategory, setNewCourseCategory] = useState('Astrophotography & Imaging');
  const [successNotice, setSuccessNotice] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Quick Preset Samples
  const sampleVideos = [
    {
      title: 'James Webb Space Telescope Deep Field Breakdown',
      url: 'https://images-assets.nasa.gov/video/GSFC_20220712_JWST_Smacs/GSFC_20220712_JWST_Smacs~orig.mp4',
      duration: '04:15',
      desc: 'High-resolution analysis of gravitational lensing in galaxy cluster SMACS 0723.',
      target: 'SMACS 0723',
      ra: '07h 23m 19s',
      dec: '-73° 27′ 15″'
    },
    {
      title: 'Orion Nebula Multi-Wavelength 3D Flight',
      url: 'https://images-assets.nasa.gov/video/GSFC_20180111_Orion_Nebula/GSFC_20180111_Orion_Nebula~orig.mp4',
      duration: '03:12',
      desc: 'Volumetric visualization of the Great Orion Nebula (Messier 42) in optical and infrared.',
      target: 'M42 Orion Nebula',
      ra: '05h 35m 17s',
      dec: '-05° 23′ 28″'
    },
    {
      title: 'Equatorial Mount Polar Alignment Tutorial (YouTube)',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      duration: '18 mins',
      desc: 'Precision 3-star polar alignment for long exposure tracking without star trailing.',
      target: 'Polaris (North Star)',
      ra: '02h 31m 49s',
      dec: '+89° 15′ 51″'
    }
  ];

  // If user is a normal member and not admin, block adding videos!
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
            <h2 className="text-2xl font-bold text-white">Normal Members Cannot Add Videos</h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-lg mx-auto">
              Curriculum video uploads and link management are restricted to Observatory Administrators only.
              Normal members can watch course videos and take examinations.
            </p>
          </div>

          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs text-slate-400 text-left space-y-1.5 font-mono">
            <div className="text-purple-300 font-semibold flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-purple-400" />
              <span>Security Rule: Admin Access Protected</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Only verified administrators with the security key (<code className="text-cyan-400">AstroEdncAdmin</code>) can upload videos, manage video links, or remove content.
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

  // Handle local video file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setVideoFile(file);
    const objectUrl = fileToObjectUrl(file);
    setVideoFileUrl(objectUrl);

    if (!lessonTitle) {
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      setLessonTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
    }
    if (!lessonDuration) {
      setLessonDuration('15 mins');
    }
  };

  const handleApplySample = (sample: typeof sampleVideos[0]) => {
    setSourceType('url');
    setVideoWebUrl(sample.url);
    setLessonTitle(sample.title);
    setLessonDuration(sample.duration);
    setLessonDescription(sample.desc);
    setTargetObject(sample.target);
    setRaCoord(sample.ra);
    setDecCoord(sample.dec);
  };

  // Submit video
  const handleSubmitVideo = (e: React.FormEvent) => {
    e.preventDefault();

    let finalCourseId = selectedCourseId;

    if (isCreatingNewCourse) {
      if (!newCourseTitle.trim()) {
        alert('Please enter a title for the new course track.');
        return;
      }
      const newCourseId = Date.now();
      onCreateCourse({
        title: newCourseTitle.trim(),
        description: `Custom astronomical course track curated with uploaded video lessons.`,
        category: newCourseCategory,
        level: 'Intermediate',
        leadAstronomer: {
          name: 'Society Video Instructor',
          affiliation: 'Observational Astrophotography Board',
          callsign: 'ASTRO-CURATOR',
        },
      });
      finalCourseId = newCourseId;
      setIsCreatingNewCourse(false);
      setNewCourseTitle('');
    }

    const finalVideoUrl = sourceType === 'file' ? videoFileUrl : videoWebUrl.trim();

    if (!finalVideoUrl) {
      alert(sourceType === 'file' ? 'Please select a video file from your computer.' : 'Please enter a video URL or YouTube link.');
      return;
    }

    if (!lessonTitle.trim()) {
      alert('Please enter a lesson title.');
      return;
    }

    const newLesson: Omit<Lesson, 'id'> = {
      title: lessonTitle.trim(),
      duration: lessonDuration.trim() || '15 mins',
      videoUrl: finalVideoUrl,
      videoSource: sourceType === 'file' ? 'upload' : 'url',
      videoFileName: videoFile?.name,
      description: lessonDescription.trim() || 'Custom video lesson uploaded for the Astronomy Society course track.',
      targetObject: targetObject.trim() || 'Celestial Target',
      coordinates: {
        ra: raCoord.trim() || '05h 35m 17s',
        dec: decCoord.trim() || '-05° 23′ 28″',
        constellation: 'Deep Sky',
      },
      keyTakeaways: [
        'Proprietary instructional footage uploaded by society instructor',
        'Direct optical observation techniques and calibration review',
      ],
    };

    onAddLesson(finalCourseId, newLesson);

    setSuccessNotice(`Video lesson "${lessonTitle}" added successfully!`);
    setTimeout(() => setSuccessNotice(''), 5000);

    // Reset form
    setLessonTitle('');
    setLessonDuration('');
    setLessonDescription('');
    setVideoFile(null);
    setVideoFileUrl('');
    setVideoWebUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Collect all uploaded / custom videos across courses
  const allLessons = courses.flatMap((c) =>
    c.lessons.map((l) => ({ ...l, courseTitle: c.title, courseId: c.id, courseObj: c }))
  );

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
      <div className="bg-gradient-to-r from-cyan-950/40 via-slate-900 to-indigo-950/40 border border-cyan-500/30 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-wider">
            <Video className="w-4 h-4 text-cyan-400" />
            <span>Dedicated Video Management Studio</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Add or Remove Course Videos & Links
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm max-w-2xl">
            Upload your personal MP4/WebM astronomical video recordings, telescope astrophotography captures, YouTube video links, or external streaming URLs directly into any course track. You can also delete any obsolete video or link below.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={() => {
              const el = document.getElementById('add-video-form');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-full sm:w-auto px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/30 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Video Now</span>
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {successNotice && (
        <div className="bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 px-4 py-3 rounded-2xl flex items-center justify-between text-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
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

      {/* Main Grid: Add Video Form (Left) & Video Library with Delete/Remove (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="add-video-form">
        
        {/* Left Form: Video Adding Engine (7 cols) */}
        <div className="lg:col-span-7 bg-[#090d16] border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-6 shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Film className="w-5 h-5 text-cyan-400" />
                Video Upload & Configuration
              </h2>
              <p className="text-xs text-slate-400">
                Choose how you want to add your video file or link.
              </p>
            </div>

            {/* Source Switcher */}
            <div className="flex items-center gap-1 bg-black/60 p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setSourceType('file')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
                  sourceType === 'file'
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload File</span>
              </button>
              <button
                type="button"
                onClick={() => setSourceType('url')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
                  sourceType === 'url'
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Link className="w-3.5 h-3.5" />
                <span>Video Link / URL</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmitVideo} className="space-y-5">
            {/* Step 1: Video File Upload or URL Input */}
            {sourceType === 'file' ? (
              <div className="space-y-3">
                <label className="block text-xs font-mono text-cyan-400 uppercase tracking-wider">
                  Select Video File From Device (.mp4, .webm, .mov)
                </label>
                
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center gap-2 ${
                    videoFile
                      ? 'border-cyan-500 bg-cyan-950/20'
                      : 'border-slate-800 hover:border-slate-700 bg-slate-950/60'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/mp4,video/webm,video/ogg,video/quicktime,video/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div className="w-12 h-12 rounded-full bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                    <Upload className="w-6 h-6" />
                  </div>
                  {videoFile ? (
                    <div>
                      <p className="text-sm font-semibold text-white truncate max-w-sm">{videoFile.name}</p>
                      <p className="text-xs text-cyan-400 font-mono mt-0.5">
                        {formatFileSize(videoFile.size)} · Ready to stream in player
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1">Click to select a different file</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm font-medium text-white">Click or drag & drop video file here</p>
                      <p className="text-xs text-slate-400 mt-1">
                        Supports MP4, WebM, QuickTime (MOV), and browser compatible video streams
                      </p>
                    </div>
                  )}
                </div>

                {videoFileUrl && (
                  <div className="space-y-2">
                    <span className="text-[11px] font-mono text-slate-400">Local Video Preview:</span>
                    <div className="aspect-video bg-black rounded-xl overflow-hidden border border-slate-800">
                      <video
                        src={videoFileUrl}
                        controls
                        playsInline
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <label className="block text-xs font-mono text-cyan-400 uppercase tracking-wider">
                  Video URL / Stream Link (YouTube, Vimeo, or Direct MP4)
                </label>
                <div className="relative">
                  <input
                    type="url"
                    placeholder="e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ or https://example.com/video.mp4"
                    value={videoWebUrl}
                    onChange={(e) => setVideoWebUrl(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
                <p className="text-[11px] text-slate-400">
                  Tip: Standard YouTube watch links, youtu.be shortlinks, Vimeo, or direct .mp4 streaming files will be automatically formatted for playback.
                </p>

                {videoWebUrl && (
                  <div className="space-y-2 mt-2">
                    <span className="text-[11px] font-mono text-slate-400">URL Stream Preview:</span>
                    <div className="aspect-video bg-black rounded-xl overflow-hidden border border-slate-800">
                      {formatVideoUrl(videoWebUrl).isDirectVideo ? (
                        <video
                          src={videoWebUrl}
                          controls
                          playsInline
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <iframe
                          src={formatVideoUrl(videoWebUrl).embedUrl}
                          title="Preview"
                          className="w-full h-full border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Course Assignment */}
            <div className="pt-2 border-t border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono text-slate-300 uppercase tracking-wider">
                  Target Course Track
                </label>
                <button
                  type="button"
                  onClick={() => setIsCreatingNewCourse(!isCreatingNewCourse)}
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>{isCreatingNewCourse ? 'Select Existing Course' : '+ Create Brand New Track'}</span>
                </button>
              </div>

              {isCreatingNewCourse ? (
                <div className="p-4 bg-slate-950 rounded-xl border border-cyan-500/30 space-y-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">New Track Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Backyard Telescope Astrophotography Masterclass"
                      value={newCourseTitle}
                      onChange={(e) => setNewCourseTitle(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Category</label>
                    <select
                      value={newCourseCategory}
                      onChange={(e) => setNewCourseCategory(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                    >
                      <option value="Astrophotography & Imaging">Astrophotography & Imaging</option>
                      <option value="Observational Astronomy">Observational Astronomy</option>
                      <option value="Planetary & Lunar Science">Planetary & Lunar Science</option>
                      <option value="Radio & Spectroscopy">Radio & Spectroscopy</option>
                      <option value="Telescope Optics & Alignment">Telescope Optics & Alignment</option>
                    </select>
                  </div>
                </div>
              ) : (
                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title} ({course.lessons.length} lessons)
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Step 3: Lesson Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-mono text-slate-300 mb-1">Lesson Title *</label>
                <input
                  type="text"
                  placeholder="e.g. CMOS Gain Settings & Dark Frame Calibration"
                  value={lessonTitle}
                  onChange={(e) => setLessonTitle(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Duration</label>
                <input
                  type="text"
                  placeholder="e.g. 18 mins"
                  value={lessonDuration}
                  onChange={(e) => setLessonDuration(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Description & Field Notes</label>
              <textarea
                rows={2}
                placeholder="What observational techniques, equipment, or theory does this video cover?"
                value={lessonDescription}
                onChange={(e) => setLessonDescription(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 resize-none"
              />
            </div>

            {/* Optional Celestial Coordinates */}
            <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80 space-y-2.5">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs font-mono">
                <Compass className="w-3.5 h-3.5 text-cyan-400" />
                <span>Optional Celestial Coordinates</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Target (e.g. M31 Andromeda)"
                  value={targetObject}
                  onChange={(e) => setTargetObject(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white font-mono"
                />
                <input
                  type="text"
                  placeholder="RA: 00h 42m 44s"
                  value={raCoord}
                  onChange={(e) => setRaCoord(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white font-mono"
                />
                <input
                  type="text"
                  placeholder="DEC: +41° 16′ 09″"
                  value={decCoord}
                  onChange={(e) => setDecCoord(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white font-mono"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 font-semibold rounded-xl text-white text-xs shadow-lg shadow-cyan-600/20 transition flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Publish & Save Video Lesson</span>
            </button>
          </form>
        </div>

        {/* Right Column: Manage & Remove Existing Videos + Presets (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Quick Demo Video Presets */}
          <div className="bg-[#090d16] border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center gap-2 text-white font-semibold text-sm">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h3>Need Sample Footage to Test?</h3>
            </div>
            <p className="text-xs text-slate-400">
              Click any of these verified open-access space clips to auto-fill the form:
            </p>

            <div className="space-y-2.5">
              {sampleVideos.map((sample, idx) => (
                <div
                  key={idx}
                  onClick={() => handleApplySample(sample)}
                  className="p-3 bg-slate-950 border border-slate-800/80 hover:border-cyan-500/50 rounded-xl cursor-pointer transition group"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-white group-hover:text-cyan-400 transition">
                      {sample.title}
                    </p>
                    <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                      {sample.duration}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{sample.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Existing Videos & Links Removal Station */}
          <div className="bg-[#090d16] border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
              <div className="flex items-center gap-2 text-white font-semibold text-sm">
                <FileVideo className="w-4 h-4 text-cyan-400" />
                <h3>Existing Videos & Links ({allLessons.length})</h3>
              </div>
              <span className="text-[10px] font-mono text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-800/40">
                Admin Can Delete
              </span>
            </div>

            <p className="text-xs text-slate-400">
              As an Administrator, you have full authority to remove any lesson or obsolete video link. Click the red trash button next to any video to delete it.
            </p>

            <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
              {allLessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between gap-3 group hover:border-slate-700 transition"
                >
                  <div className="overflow-hidden flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-white truncate">{lesson.title}</span>
                      {lesson.videoSource === 'upload' ? (
                        <span className="text-[9px] bg-cyan-950 text-cyan-400 px-1.5 py-0.5 rounded font-mono border border-cyan-800/40">
                          FILE
                        </span>
                      ) : (
                        <span className="text-[9px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-mono">
                          LINK
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono mt-0.5">
                      <span className="truncate">{lesson.courseTitle}</span>
                      <span>·</span>
                      <span>{lesson.duration}</span>
                    </div>
                    {lesson.videoUrl && (
                      <p className="text-[9px] font-mono text-slate-500 truncate mt-0.5">
                        {lesson.videoUrl}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => onSelectCourseToPlay(lesson.courseObj)}
                      title="Play Course"
                      className="p-1.5 bg-indigo-600/80 hover:bg-indigo-600 text-white rounded-lg transition"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                    </button>

                    {/* Admin Delete Video / Link Button */}
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete lesson "${lesson.title}" and remove its video link?`)) {
                          onDeleteLesson(lesson.courseId, lesson.id);
                        }
                      }}
                      title="Remove this video or link"
                      className="p-1.5 bg-rose-950/70 hover:bg-rose-900 border border-rose-800/60 text-rose-300 hover:text-white rounded-lg transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

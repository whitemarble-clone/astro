import React, { useState, useRef, useEffect } from 'react';
import { 
  Settings, 
  Upload, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Video, 
  BookPlus, 
  ListOrdered, 
  Layers, 
  UserCheck, 
  Sparkles,
  ExternalLink,
  Award,
  ArrowRight,
  ArrowLeft,
  GraduationCap,
  Edit3,
  BookOpen,
  FileCheck,
  ShieldCheck,
  Download,
  AlertCircle
} from 'lucide-react';
import { Course, Lesson, User, CertificateSettings } from '../types/astronomy';
import { PRESET_ADMIN_LESSON_VIDEOS, DEFAULT_CERTIFICATE_SETTINGS } from '../data/initialCourses';
import { fileToObjectUrl } from '../utils/mediaStorage';
import { CourseEditModal } from './CourseEditModal';
import { generateCertificatePNG } from '../utils/certificateGenerator';

interface AdminDashboardProps {
  courses: Course[];
  currentUser: User;
  certificateSettings?: CertificateSettings;
  onUpdateCertificateSettings?: (settings: CertificateSettings) => void;
  onUpdateCourse?: (course: Course) => void;
  onDeleteCourse?: (courseId: number) => void;
  onAddLesson: (courseId: number, lesson: Omit<Lesson, 'id'>) => void;
  onDeleteLesson: (courseId: number, lessonId: number) => void;
  onCreateCourse: (course: Omit<Course, 'id' | 'lessons'>) => void;
  onCompleteAllLessonsDemo: () => void;
  onResetProgressDemo: () => void;
  completedLessonsCount: number;
  onNavigateToVideoStudio?: () => void;
  onNavigateToCertificateStudio?: () => void;
  onLockAdmin?: () => void;
  onBackToCourses?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  courses,
  currentUser,
  certificateSettings = DEFAULT_CERTIFICATE_SETTINGS,
  onUpdateCertificateSettings,
  onUpdateCourse,
  onDeleteCourse,
  onAddLesson,
  onDeleteLesson,
  onCreateCourse,
  onCompleteAllLessonsDemo,
  onResetProgressDemo,
  completedLessonsCount,
  onNavigateToVideoStudio,
  onNavigateToCertificateStudio,
  onLockAdmin,
  onBackToCourses,
}) => {
  // Navigation tabs in Admin Dashboard
  const [adminTab, setAdminTab] = useState<'curriculum' | 'certificate' | 'lessons' | 'tools'>('curriculum');

  // Course editing modal state
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  // Certificate Settings Form State
  const [certForm, setCertForm] = useState<CertificateSettings>(certificateSettings);
  const [certSuccessMsg, setCertSuccessMsg] = useState('');

  // Synchronize certForm if prop updates
  useEffect(() => {
    if (certificateSettings) {
      setCertForm(certificateSettings);
    }
  }, [certificateSettings]);

  // New Lesson form state
  const [targetCourseId, setTargetCourseId] = useState<number>(courses[0]?.id || 1);
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonDuration, setLessonDuration] = useState('');
  const [lessonUrl, setLessonUrl] = useState('https://www.youtube.com/embed/dQw4w9WgXcQ');
  const [lessonFile, setLessonFile] = useState<File | null>(null);
  const [lessonDescription, setLessonDescription] = useState('');
  const [lessonTarget, setLessonTarget] = useState('Deep Space Calibration Target');
  const [lessonRA, setLessonRA] = useState('05h 35m 17s');
  const [lessonDec, setLessonDec] = useState('-05° 23′ 28″');
  const [lessonSuccessMsg, setLessonSuccessMsg] = useState('');

  const adminFileInputRef = useRef<HTMLInputElement>(null);

  // New Course Track form state
  const [isCreatingTrack, setIsCreatingTrack] = useState(false);
  const [newTrackTitle, setNewTrackTitle] = useState('');
  const [newTrackCategory, setNewTrackCategory] = useState('Imaging & Hardware');
  const [newTrackLevel, setNewTrackLevel] = useState<'Introductory' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [newTrackDescription, setNewTrackDescription] = useState('');
  const [newTrackAstronomer, setNewTrackAstronomer] = useState('Prof. Valerie Vance');
  const [newTrackAffiliation, setNewTrackAffiliation] = useState('Royal Astronomical Society');
  const [newTrackCallsign, setNewTrackCallsign] = useState('RAS-901');
  const [newTrackSubjects, setNewTrackSubjects] = useState('Starlight Dispersion, Telescope Balancing, Plate Solving');
  const [trackSuccessMsg, setTrackSuccessMsg] = useState('');

  // Handle Preset Video Selection
  const handleSelectPreset = (preset: typeof PRESET_ADMIN_LESSON_VIDEOS[0]) => {
    setLessonTitle(preset.title);
    setLessonDuration(preset.duration);
    setLessonUrl(preset.url);
    setLessonDescription(preset.description);
    setLessonFile(null);
  };

  const handleAdminFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLessonFile(file);
    const objUrl = fileToObjectUrl(file);
    setLessonUrl(objUrl);
    if (!lessonTitle) {
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      setLessonTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
    }
    if (!lessonDuration) {
      setLessonDuration('15 mins');
    }
  };

  // Submit New Lesson
  const handlePublishLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonTitle.trim()) return;

    onAddLesson(Number(targetCourseId), {
      title: lessonTitle.trim(),
      duration: lessonDuration.trim() || '15 mins',
      videoUrl: lessonUrl.trim() || 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      videoSource: lessonFile ? 'upload' : 'url',
      videoFileName: lessonFile?.name,
      description: lessonDescription.trim() || 'Comprehensive observational video tutorial published by society administration.',
      targetObject: lessonTarget.trim() || 'Celestial Target',
      coordinates: {
        ra: lessonRA.trim() || '00h 00m 00s',
        dec: lessonDec.trim() || '+00° 00′ 00″',
        constellation: 'Deep Space'
      },
      keyTakeaways: [
        'Calibrated under Society peer-review standards',
        'Direct optical train and platesolving integration verified'
      ]
    });

    setLessonSuccessMsg(`Lesson "${lessonTitle}" successfully published!`);
    setLessonTitle('');
    setLessonDuration('');
    setLessonDescription('');
    setLessonFile(null);
    setTimeout(() => setLessonSuccessMsg(''), 4000);
  };

  // Submit New Track
  const handleCreateTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTrackTitle.trim()) return;

    const subjectsArray = newTrackSubjects
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    onCreateCourse({
      title: newTrackTitle.trim(),
      category: newTrackCategory,
      level: newTrackLevel,
      description: newTrackDescription.trim() || 'Advanced curriculum track established by the Society Academic Council.',
      leadAstronomer: {
        name: newTrackAstronomer.trim() || currentUser.name,
        affiliation: newTrackAffiliation.trim() || 'High-Altitude Observatory',
        callsign: newTrackCallsign.trim() || 'AST-ADM'
      },
      learningSubjects: subjectsArray.length > 0 ? subjectsArray : [
        'Fundamental Celestial Mechanics',
        'Telescope Alignment Rigor'
      ]
    });

    setTrackSuccessMsg(`Track "${newTrackTitle}" established!`);
    setNewTrackTitle('');
    setNewTrackDescription('');
    setIsCreatingTrack(false);
    setTimeout(() => setTrackSuccessMsg(''), 4000);
  };

  // Save Certificate Settings
  const handleSaveCertSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateCertificateSettings) {
      onUpdateCertificateSettings(certForm);
      setCertSuccessMsg('Official Certificate settings and signatories saved successfully!');
      setTimeout(() => setCertSuccessMsg(''), 4000);
    }
  };

  // Test certificate download with current settings
  const handleTestCertDownload = () => {
    generateCertificatePNG(
      currentUser.name,
      currentUser.memberId,
      'Astronomical Fellowship Mastery Examination',
      'September 26, 2026',
      'ADMIN-PREVIEW-2026',
      undefined,
      certForm
    );
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-in fade-in">
      {/* Top Navigation Bar with Back Button */}
      {onBackToCourses && (
        <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
          <button
            onClick={onBackToCourses}
            className="group inline-flex items-center gap-2 px-4 py-2 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-500 text-slate-200 hover:text-white rounded-xl text-xs font-semibold tracking-wide transition shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 text-cyan-400 group-hover:-translate-x-1 transition-transform" />
            <span>← BACK TO COURSES</span>
          </button>
          <span className="text-xs font-mono text-purple-400">ADMINISTRATIVE DASHBOARD</span>
        </div>
      )}

      {/* Admin Privilege Header */}
      <div className="bg-gradient-to-r from-purple-950/60 via-slate-900 to-indigo-950/60 border border-purple-500/40 p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-purple-400 mb-1">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
            <span>EXECUTIVE ADMINISTRATOR CONTROL PANEL</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Academic Curriculum & Faculty Admin</h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-xl">
            Logged in as <strong className="text-purple-300">{currentUser.name}</strong> ({currentUser.memberId}). You can change professor names, courses, student learning subjects, and official certificate signatories.
          </p>
        </div>

        {/* Action and Demo Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {onLockAdmin && (
            <button
              onClick={onLockAdmin}
              className="px-3.5 py-2 bg-rose-950/80 hover:bg-rose-900 border border-rose-500/50 rounded-xl text-xs font-semibold text-rose-200 transition shadow-sm"
              title="Lock administrative console and return to member mode"
            >
              🔒 Lock Admin Mode
            </button>
          )}
          <button
            onClick={onCompleteAllLessonsDemo}
            className="px-3.5 py-2 bg-purple-900/60 hover:bg-purple-800 border border-purple-700/60 rounded-xl text-xs font-medium text-purple-200 transition"
            title="Fast-track all lessons complete to test certificate unlock"
          >
            Mark All Completed (Demo)
          </button>
          <button
            onClick={onResetProgressDemo}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl text-xs font-medium text-slate-400 hover:text-white transition"
          >
            Reset Progress
          </button>
        </div>
      </div>

      {/* Direct Quick Launch Studios Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {onNavigateToVideoStudio && (
          <div 
            onClick={onNavigateToVideoStudio}
            className="p-5 bg-gradient-to-br from-cyan-950/40 to-slate-900 border border-cyan-500/30 hover:border-cyan-400/60 rounded-2xl cursor-pointer transition group shadow-md"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="w-9 h-9 rounded-xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                <Video className="w-5 h-5" />
              </span>
              <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition" />
            </div>
            <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition">
              Dedicated Video Adding Studio
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Upload local MP4/WebM files or paste streaming URLs into any course track with live preview.
            </p>
          </div>
        )}

        {onNavigateToCertificateStudio && (
          <div 
            onClick={onNavigateToCertificateStudio}
            className="p-5 bg-gradient-to-br from-purple-950/40 to-slate-900 border border-purple-500/30 hover:border-purple-400/60 rounded-2xl cursor-pointer transition group shadow-md"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="w-9 h-9 rounded-xl bg-purple-950 border border-purple-500/40 flex items-center justify-center text-purple-400">
                <Award className="w-5 h-5" />
              </span>
              <ArrowRight className="w-4 h-4 text-purple-400 group-hover:translate-x-1 transition" />
            </div>
            <h3 className="text-sm font-bold text-white group-hover:text-purple-300 transition">
              Dedicated Certificate Studio
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Upload organization diplomas, scans, and custom background templates to stamp diplomas.
            </p>
          </div>
        )}
      </div>

      {/* Admin Feature Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setAdminTab('curriculum')}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition whitespace-nowrap ${
            adminTab === 'curriculum'
              ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-950'
              : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Professors, Courses & Subjects ({courses.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('certificate')}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition whitespace-nowrap ${
            adminTab === 'certificate'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-950'
              : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Certificate & Signatories Customizer</span>
        </button>

        <button
          onClick={() => setAdminTab('lessons')}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition whitespace-nowrap ${
            adminTab === 'lessons'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-950'
              : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Video className="w-4 h-4" />
          <span>Publish Lessons & Videos</span>
        </button>

        <button
          onClick={() => setAdminTab('tools')}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition whitespace-nowrap ${
            adminTab === 'tools'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950'
              : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>New Track & Quick Tools</span>
        </button>
      </div>

      {/* TAB 1: CURRICULUM, PROFESSORS & LEARNING SUBJECTS */}
      {adminTab === 'curriculum' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-[#090d16] border border-cyan-500/30 rounded-2xl">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-cyan-400" />
                <span>Academic Courses, Lead Professors & Subjects Management</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                You can change any professor's name, affiliation, course description, category, level, and the subjects students learn.
              </p>
            </div>

            <button
              onClick={() => setIsCreatingTrack(true)}
              className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition shrink-0 shadow-md shadow-cyan-950"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Course Track</span>
            </button>
          </div>

          {/* List of Courses for Editing */}
          <div className="grid grid-cols-1 gap-4">
            {courses.map((course) => (
              <div 
                key={course.id}
                className="bg-[#090d16] border border-slate-800/90 rounded-2xl p-5 hover:border-cyan-500/50 transition space-y-4 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
                        {course.category}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800/50">
                        {course.level}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">
                        {course.lessons.length} Lessons
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white">
                      {course.title}
                    </h3>

                    <p className="text-xs text-slate-400 line-clamp-2">
                      {course.description}
                    </p>
                  </div>

                  {/* Edit Course & Professor Button */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setEditingCourse(course)}
                      className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition shadow-md shadow-cyan-950"
                      title="Change Professor Name, Course Details & Subjects"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Course & Professor</span>
                    </button>

                    {onDeleteCourse && courses.length > 1 && (
                      <button
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to delete course "${course.title}"?`)) {
                            onDeleteCourse(course.id);
                          }
                        }}
                        className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-950/50 border border-transparent hover:border-rose-800/40 rounded-xl transition"
                        title="Delete Course Track"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Professor Info Bar */}
                <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
                      <UserCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 font-mono">PROFESSOR / INSTRUCTOR</div>
                      <span className="font-semibold text-white">{course.leadAstronomer.name}</span>
                      <span className="text-slate-400 text-[11px] ml-1.5">({course.leadAstronomer.affiliation})</span>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 px-2 py-0.5 rounded">
                    CALLSIGN: {course.leadAstronomer.callsign}
                  </span>
                </div>

                {/* Subjects Student Learns */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    <span className="flex items-center gap-1.5 text-cyan-300">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Subjects Which Students Learn:</span>
                    </span>
                    <button
                      onClick={() => setEditingCourse(course)}
                      className="text-xs text-cyan-400 hover:underline capitalize"
                    >
                      + Manage Subjects
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {course.learningSubjects && course.learningSubjects.length > 0 ? (
                      course.learningSubjects.map((subj, idx) => (
                        <span 
                          key={idx}
                          className="text-[11px] bg-slate-950 border border-slate-800 text-slate-300 px-2.5 py-1 rounded-lg"
                        >
                          {subj}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-500 italic">
                        No subjects specified. Click "Edit Course & Professor" to add.
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: CERTIFICATE & SIGNATORIES CUSTOMIZER */}
      {adminTab === 'certificate' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="p-5 bg-[#090d16] border border-purple-500/30 rounded-2xl">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-400" />
              <span>Official Certificate Template & Signatory Customizer</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Admin can configure the Society Name, Faculty, Diploma Award Title, Citation text, Signatory Professors & Titles, and Seal stamping for all student graduation certificates.
            </p>
          </div>

          {certSuccessMsg && (
            <div className="p-3.5 bg-emerald-950/80 border border-emerald-500/50 rounded-2xl flex items-center gap-2 text-emerald-200 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{certSuccessMsg}</span>
            </div>
          )}

          <form onSubmit={handleSaveCertSettings} className="bg-[#090d16] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            {/* Society & Faculty Metadata */}
            <div className="space-y-4">
              <h3 className="text-xs font-mono text-cyan-400 tracking-wider uppercase border-b border-slate-800 pb-2">
                1. Organization & Faculty Header
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Society Name (Top Header)
                  </label>
                  <input
                    type="text"
                    required
                    value={certForm.societyName}
                    onChange={(e) => setCertForm({ ...certForm, societyName: e.target.value })}
                    className="w-full bg-[#060913] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Academic Faculty / Department
                  </label>
                  <input
                    type="text"
                    required
                    value={certForm.facultyName}
                    onChange={(e) => setCertForm({ ...certForm, facultyName: e.target.value })}
                    className="w-full bg-[#060913] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 transition"
                  />
                </div>
              </div>
            </div>

            {/* Certificate Title & Citation */}
            <div className="space-y-4">
              <h3 className="text-xs font-mono text-purple-400 tracking-wider uppercase border-b border-slate-800 pb-2">
                2. Diploma Title & Achievement Citation
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Certificate Award Title
                  </label>
                  <input
                    type="text"
                    required
                    value={certForm.certificateTitle}
                    onChange={(e) => setCertForm({ ...certForm, certificateTitle: e.target.value })}
                    className="w-full bg-[#060913] border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white font-semibold focus:outline-none focus:border-purple-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Citation Body Text (Scientific achievements verified)
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={certForm.citationBody}
                    onChange={(e) => setCertForm({ ...certForm, citationBody: e.target.value })}
                    className="w-full bg-[#060913] border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-purple-500 transition"
                  />
                </div>
              </div>
            </div>

            {/* Professor Signatories */}
            <div className="space-y-4">
              <h3 className="text-xs font-mono text-indigo-400 tracking-wider uppercase border-b border-slate-800 pb-2">
                3. Academic Signatories (Professors on Certificate)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Signatory 1 */}
                <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 space-y-3">
                  <div className="text-xs font-bold text-indigo-300">Signatory 1 (Director / Chief Professor)</div>
                  
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">
                      Professor Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={certForm.signatory1Name}
                      onChange={(e) => setCertForm({ ...certForm, signatory1Name: e.target.value })}
                      className="w-full bg-[#060913] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">
                      Official Title / Chair
                    </label>
                    <input
                      type="text"
                      required
                      value={certForm.signatory1Title}
                      onChange={(e) => setCertForm({ ...certForm, signatory1Title: e.target.value })}
                      className="w-full bg-[#060913] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 transition"
                    />
                  </div>
                </div>

                {/* Signatory 2 */}
                <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 space-y-3">
                  <div className="text-xs font-bold text-indigo-300">Signatory 2 (Examination Chair / Professor)</div>
                  
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">
                      Professor Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={certForm.signatory2Name}
                      onChange={(e) => setCertForm({ ...certForm, signatory2Name: e.target.value })}
                      className="w-full bg-[#060913] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">
                      Official Title / Academic Board
                    </label>
                    <input
                      type="text"
                      required
                      value={certForm.signatory2Title}
                      onChange={(e) => setCertForm({ ...certForm, signatory2Title: e.target.value })}
                      className="w-full bg-[#060913] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 transition"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Seal text & Year */}
            <div className="space-y-4">
              <h3 className="text-xs font-mono text-amber-400 tracking-wider uppercase border-b border-slate-800 pb-2">
                4. Official Verification Seal
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Seal Stamped Text
                  </label>
                  <input
                    type="text"
                    required
                    value={certForm.sealText}
                    onChange={(e) => setCertForm({ ...certForm, sealText: e.target.value })}
                    className="w-full bg-[#060913] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 transition font-mono uppercase"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Seal Academic Year
                  </label>
                  <input
                    type="text"
                    required
                    value={certForm.sealYear}
                    onChange={(e) => setCertForm({ ...certForm, sealYear: e.target.value })}
                    className="w-full bg-[#060913] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 transition font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Save Buttons & Preview */}
            <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleTestCertDownload}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-2 transition"
                title="Download a test PNG certificate with your custom signatories & names"
              >
                <Download className="w-4 h-4 text-cyan-400" />
                <span>Download Sample Certificate PNG</span>
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition shadow-lg shadow-purple-950"
              >
                <FileCheck className="w-4 h-4" />
                <span>Save Official Certificate Settings</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: PUBLISH LESSONS & VIDEOS */}
      {adminTab === 'lessons' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Preset Astronomical Video Lessons Picker */}
          <div className="bg-[#090d16] border border-cyan-500/30 rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">Preset Astronomy Videos</h3>
              </div>
              <span className="text-xs font-mono text-cyan-400 bg-cyan-950/80 px-2.5 py-1 rounded-full border border-cyan-800/50">
                1-Click Quick Fill
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {PRESET_ADMIN_LESSON_VIDEOS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className="p-3.5 bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-2xl text-left transition group space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-mono text-cyan-400 text-[11px]">{preset.duration}</span>
                    <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">Preset</span>
                  </div>
                  <h4 className="text-xs font-semibold text-white group-hover:text-cyan-300 transition line-clamp-1">
                    {preset.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2">
                    {preset.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* New Lesson Publishing Form */}
          <section className="bg-[#090d16] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Video className="w-5 h-5 text-indigo-400" />
                  <span>Publish New Video Lesson to Curriculum</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Upload local MP4 files or attach embed streaming links to any society course track.
                </p>
              </div>
              <span className="text-xs font-mono text-indigo-400 bg-indigo-950/80 px-2.5 py-1 rounded-full border border-indigo-800/50">
                Admin Exclusive
              </span>
            </div>

            {lessonSuccessMsg && (
              <div className="p-4 bg-emerald-950/60 border border-emerald-500/40 rounded-2xl flex items-center gap-3 text-emerald-200 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{lessonSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handlePublishLesson} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-2">
                    Target Course Track *
                  </label>
                  <select
                    value={targetCourseId}
                    onChange={(e) => setTargetCourseId(Number(e.target.value))}
                    className="w-full bg-[#060913] border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition"
                  >
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        Track {c.id}: {c.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-2">
                    Lesson Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={lessonTitle}
                    onChange={(e) => setLessonTitle(e.target.value)}
                    placeholder="e.g. Narrowband Filter Stacking"
                    className="w-full bg-[#060913] border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-2">
                    Estimated Duration
                  </label>
                  <input
                    type="text"
                    value={lessonDuration}
                    onChange={(e) => setLessonDuration(e.target.value)}
                    placeholder="e.g. 18 mins"
                    className="w-full bg-[#060913] border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>
              </div>

              {/* Video Source Option */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 bg-slate-950/70 border border-slate-800/80 rounded-2xl">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-2">
                    Option A: Local Video File (MP4, WebM)
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => adminFileInputRef.current?.click()}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 rounded-xl text-xs font-medium flex items-center gap-2 transition"
                    >
                      <Upload className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{lessonFile ? 'Change File' : 'Browse Video'}</span>
                    </button>
                    <input
                      ref={adminFileInputRef}
                      type="file"
                      accept="video/*"
                      onChange={handleAdminFileChange}
                      className="hidden"
                    />
                    {lessonFile && (
                      <span className="text-xs text-slate-300 truncate max-w-[200px] font-mono">
                        {lessonFile.name}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-2">
                    Option B: Video Stream URL
                  </label>
                  <input
                    type="url"
                    value={lessonUrl}
                    onChange={(e) => {
                      setLessonUrl(e.target.value);
                      setLessonFile(null);
                    }}
                    placeholder="https://www.youtube.com/embed/..."
                    className="w-full bg-[#060913] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 transition font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2">
                  Lesson Scientific Description
                </label>
                <textarea
                  rows={3}
                  value={lessonDescription}
                  onChange={(e) => setLessonDescription(e.target.value)}
                  placeholder="Detail the observational techniques, equipment, and key findings taught in this video lesson..."
                  className="w-full bg-[#060913] border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500 transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-2">
                    Astronomical Target Name
                  </label>
                  <input
                    type="text"
                    value={lessonTarget}
                    onChange={(e) => setLessonTarget(e.target.value)}
                    placeholder="e.g. M42 Orion Nebula"
                    className="w-full bg-[#060913] border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-2">
                    Right Ascension (RA)
                  </label>
                  <input
                    type="text"
                    value={lessonRA}
                    onChange={(e) => setLessonRA(e.target.value)}
                    placeholder="e.g. 05h 35m 17s"
                    className="w-full bg-[#060913] border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-2">
                    Declination (DEC)
                  </label>
                  <input
                    type="text"
                    value={lessonDec}
                    onChange={(e) => setLessonDec(e.target.value)}
                    placeholder="e.g. -05° 23′ 28″"
                    className="w-full bg-[#060913] border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition font-mono"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition shadow-lg shadow-indigo-950"
                >
                  <Plus className="w-4 h-4" />
                  <span>Publish Lesson to Course Track</span>
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {/* TAB 4: NEW TRACK & TOOLS */}
      {adminTab === 'tools' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Create Track Form */}
          <div className="bg-[#090d16] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <BookPlus className="w-5 h-5 text-purple-400" />
                  <span>Establish New Academic Course Track</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Create a new course with custom professor credentials and student learning subjects.
                </p>
              </div>
            </div>

            {trackSuccessMsg && (
              <div className="p-4 bg-emerald-950/60 border border-emerald-500/40 rounded-2xl flex items-center gap-3 text-emerald-200 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{trackSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleCreateTrack} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Track Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTrackTitle}
                    onChange={(e) => setNewTrackTitle(e.target.value)}
                    placeholder="e.g. Exoplanet Transit Photometry"
                    className="w-full bg-[#060913] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Category
                  </label>
                  <select
                    value={newTrackCategory}
                    onChange={(e) => setNewTrackCategory(e.target.value)}
                    className="w-full bg-[#060913] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 transition"
                  >
                    <option value="Imaging & Hardware">Imaging & Hardware</option>
                    <option value="Celestial Mechanics">Celestial Mechanics</option>
                    <option value="Solar System">Solar System</option>
                    <option value="Radio Astronomy">Radio Astronomy</option>
                    <option value="Astrophysics & Cosmology">Astrophysics & Cosmology</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Difficulty Level
                  </label>
                  <select
                    value={newTrackLevel}
                    onChange={(e) => setNewTrackLevel(e.target.value as any)}
                    className="w-full bg-[#060913] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 transition"
                  >
                    <option value="Introductory">Introductory</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              {/* Professor credentials for this new course */}
              <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Professor / Lead Astronomer Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTrackAstronomer}
                    onChange={(e) => setNewTrackAstronomer(e.target.value)}
                    placeholder="e.g. Prof. Valerie Vance"
                    className="w-full bg-[#060913] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Professor Affiliation
                  </label>
                  <input
                    type="text"
                    value={newTrackAffiliation}
                    onChange={(e) => setNewTrackAffiliation(e.target.value)}
                    placeholder="e.g. Royal Astronomical Society"
                    className="w-full bg-[#060913] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Professor Callsign
                  </label>
                  <input
                    type="text"
                    value={newTrackCallsign}
                    onChange={(e) => setNewTrackCallsign(e.target.value)}
                    placeholder="e.g. RAS-901"
                    className="w-full bg-[#060913] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 transition font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Subjects Students Learn (Comma separated)
                </label>
                <input
                  type="text"
                  value={newTrackSubjects}
                  onChange={(e) => setNewTrackSubjects(e.target.value)}
                  placeholder="e.g. Starlight Dispersion, Telescope Balancing, Plate Solving"
                  className="w-full bg-[#060913] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Description / Scientific Scope
                </label>
                <textarea
                  rows={2}
                  value={newTrackDescription}
                  onChange={(e) => setNewTrackDescription(e.target.value)}
                  placeholder="Overview of this track curriculum..."
                  className="w-full bg-[#060913] border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-purple-500 transition"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition shadow-md shadow-purple-950"
                >
                  <Plus className="w-4 h-4" />
                  <span>Establish Track</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Course Edit Modal */}
      {editingCourse && (
        <CourseEditModal
          course={editingCourse}
          isOpen={Boolean(editingCourse)}
          onClose={() => setEditingCourse(null)}
          onSave={(updated) => {
            if (onUpdateCourse) {
              onUpdateCourse(updated);
            }
          }}
        />
      )}
    </div>
  );
};

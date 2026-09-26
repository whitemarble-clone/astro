import React, { useState } from 'react';
import { 
  Search, 
  PlayCircle, 
  BookOpen, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  Filter, 
  ChevronRight, 
  Video, 
  Plus, 
  HelpCircle, 
  Award, 
  Lock, 
  Edit3, 
  GraduationCap, 
  UserCheck 
} from 'lucide-react';
import { Course, User } from '../types/astronomy';
import heroNebulaImg from '../assets/images/astro_hero_nebula_1790412477914.jpg';
import { CourseEditModal } from './CourseEditModal';

interface CoursesViewProps {
  courses: Course[];
  currentUser: User;
  completedLessons: number[];
  onSelectCourse: (course: Course) => void;
  onOpenCertificate: () => void;
  onNavigateToAddVideo?: () => void;
  onOpenQuiz: (course: Course) => void;
  isAdminUnlocked: boolean;
  onUpdateCourse?: (course: Course) => void;
  onNavigateToAdmin?: () => void;
}

export const CoursesView: React.FC<CoursesViewProps> = ({
  courses,
  currentUser,
  completedLessons,
  onSelectCourse,
  onOpenCertificate,
  onNavigateToAddVideo,
  onOpenQuiz,
  isAdminUnlocked,
  onUpdateCourse,
  onNavigateToAdmin,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const categories = ['All', 'Imaging & Hardware', 'Celestial Mechanics', 'Solar System', 'Radio Astronomy'];

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.leadAstronomer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (course.learningSubjects && course.learningSubjects.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())));
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalLessons = courses.reduce((acc, c) => acc + c.lessons.length, 0);
  const completedCount = completedLessons.length;
  const overallPercentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Hero Section with Generated Nebula Asset */}
      <section className="relative rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-[#090d16]">
        <div className="absolute inset-0">
          <img
            src={heroNebulaImg}
            alt="Deep space nebula astrophotography"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center opacity-40 mix-blend-screen"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#060811] via-[#060811]/90 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#060811] via-transparent to-transparent" />
        </div>

        <div className="relative p-6 sm:p-10 max-w-2xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <span>OBSERVATORY CURRICULUM</span>
            <span aria-hidden="true">·</span>
            <span>EPOCH J2026.5</span>
            <span aria-hidden="true">·</span>
            <span>MEMBERS & ADMIN VAULT</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white leading-tight text-balance">
            Astronomy Society Research & Learning Tracks
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Watch astronomical masterclasses, solve scientific quizzes, upload your member profile picture, and earn verified honors from participating in society events.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs">
            <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-xl px-4 py-2.5 flex items-center gap-3">
              <span className="text-cyan-400 font-mono text-base font-bold tabular-nums">{completedCount}/{totalLessons}</span>
              <span className="text-slate-400">Lessons Completed</span>
            </div>

            <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-xl px-4 py-2.5 flex items-center gap-3">
              <span className="text-indigo-400 font-mono text-base font-bold tabular-nums">{overallPercentage}%</span>
              <span className="text-slate-400">Overall Progress</span>
            </div>

            {isAdminUnlocked && onNavigateToAdmin && (
              <button
                onClick={onNavigateToAdmin}
                className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-medium flex items-center gap-2 transition shadow-lg shadow-purple-950"
              >
                <GraduationCap className="w-4 h-4" />
                <span>Manage Faculty & Courses</span>
              </button>
            )}

            {isAdminUnlocked && onNavigateToAddVideo && (
              <button
                onClick={onNavigateToAddVideo}
                className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-medium flex items-center gap-2 transition shadow-lg shadow-cyan-950"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add Your Own Video</span>
              </button>
            )}

            {completedCount > 0 && (
              <button
                onClick={onOpenCertificate}
                className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white rounded-xl font-medium flex items-center gap-2 transition shadow-lg shadow-indigo-950"
              >
                <span>View Certificates</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Category Segmented Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="flex items-center gap-3 min-w-[260px]">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search tracks, subjects, professors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#090d16] border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          {isAdminUnlocked && onNavigateToAddVideo && (
            <button
              onClick={onNavigateToAddVideo}
              className="hidden sm:flex px-3 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 rounded-xl text-xs font-medium items-center gap-1.5 transition whitespace-nowrap"
            >
              <Video className="w-3.5 h-3.5 text-cyan-400" />
              <span>Add Video</span>
            </button>
          )}
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCourses.map((course) => {
          const courseCompletedCount = course.lessons.filter((l) => completedLessons.includes(l.id)).length;
          const isFullyCompleted = course.lessons.length > 0 && courseCompletedCount === course.lessons.length;
          const coursePercent = course.lessons.length > 0 ? Math.round((courseCompletedCount / course.lessons.length) * 100) : 0;
          const hasUploadedVideos = course.lessons.some((l) => l.videoSource === 'upload');
          const quizScore = currentUser.quizScores ? currentUser.quizScores[course.id] : undefined;

          return (
            <article
              key={course.id}
              className="bg-[#090d16] border border-slate-800/90 rounded-2xl p-6 hover:border-slate-700 transition flex flex-col justify-between group shadow-sm hover:shadow-xl hover:shadow-indigo-950/20"
            >
              <div className="space-y-4">
                {/* Header metadata */}
                <div className="flex items-center justify-between gap-2 text-xs text-slate-500 font-mono">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span>{course.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-slate-400">{course.level}</span>
                    {hasUploadedVideos && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="text-cyan-400 font-mono text-[10px] bg-cyan-950/70 px-1.5 py-0.5 rounded border border-cyan-800/40">
                          Custom Video
                        </span>
                      </>
                    )}
                  </div>

                  {isAdminUnlocked && (
                    <button
                      onClick={() => setEditingCourse(course)}
                      className="px-2.5 py-1 bg-cyan-950 hover:bg-cyan-900 border border-cyan-700/60 hover:border-cyan-400 text-cyan-300 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition shadow-sm"
                      title="Admin: Change Professor name, course metadata, and subjects"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Edit Course</span>
                    </button>
                  )}
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition">
                    {course.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed line-clamp-2">
                    {course.description}
                  </p>
                </div>

                {/* Subjects Which Students Learn */}
                {course.learningSubjects && course.learningSubjects.length > 0 && (
                  <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/70 space-y-1.5">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-cyan-400" />
                      <span>Subjects Students Learn:</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {course.learningSubjects.map((subj, idx) => (
                        <span 
                          key={idx}
                          className="text-[11px] bg-[#060913] text-slate-300 border border-slate-800 px-2 py-0.5 rounded-md"
                        >
                          {subj}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Progress bar */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-xs text-slate-400 font-mono">
                    <span>PROGRESS: {courseCompletedCount}/{course.lessons.length} LESSONS</span>
                    <span className="tabular-nums">{coursePercent}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full transition-all duration-300"
                      style={{ width: `${coursePercent}%` }}
                    />
                  </div>
                </div>

                {/* Lead Astronomer / Professor & Quiz Badge Indicator */}
                <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
                    <div>
                      <span className="text-slate-200 font-medium">{course.leadAstronomer.name}</span>
                      <span className="text-slate-500 text-[11px] ml-1">({course.leadAstronomer.affiliation})</span>
                    </div>
                  </div>

                  {quizScore !== undefined && (
                    <span className={`font-mono text-[10px] px-2 py-0.5 rounded border ${
                      quizScore >= 70 ? 'bg-emerald-950 text-emerald-300 border-emerald-800/40' : 'bg-rose-950 text-rose-300 border-rose-800/40'
                    }`}>
                      Quiz: {quizScore}%
                    </span>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-6 mt-2 flex items-center gap-2.5">
                <button
                  onClick={() => onSelectCourse(course)}
                  className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition shadow-lg shadow-indigo-950"
                >
                  <PlayCircle className="w-4 h-4" />
                  <span>Watch Lessons ({course.lessons.length})</span>
                </button>

                {course.quiz && (
                  <button
                    onClick={() => onOpenQuiz(course)}
                    className="px-4 py-3 bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-800 hover:border-cyan-500/50 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition shrink-0"
                    title="Take the official course quiz"
                  >
                    <HelpCircle className="w-4 h-4 text-cyan-400" />
                    <span>{quizScore !== undefined ? `${quizScore}%` : 'Take Quiz'}</span>
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {/* Course Edit Modal for in-place admin edits */}
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

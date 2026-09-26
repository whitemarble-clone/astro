import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  CheckCircle2, 
  Circle, 
  Clock, 
  ExternalLink, 
  ChevronRight, 
  ChevronLeft, 
  Compass, 
  Download, 
  FileText, 
  Sliders, 
  Volume2, 
  VolumeX, 
  Maximize2,
  Tv,
  Activity,
  Plus,
  Video,
  HelpCircle,
  Trash2,
  Lock,
  UserCheck,
  Edit3,
  Sparkles,
  GraduationCap
} from 'lucide-react';
import { Course, Lesson } from '../types/astronomy';
import { formatVideoUrl } from '../utils/mediaStorage';
import { CourseEditModal } from './CourseEditModal';

interface LessonPlayerViewProps {
  course: Course;
  completedLessons: number[];
  onToggleCompleteLesson: (lessonId: number) => void;
  onBackToCourses: () => void;
  onNavigateToSkyLabWithTarget?: (targetName: string) => void;
  onNavigateToAddVideo?: (courseId: number) => void;
  onOpenQuiz?: (course: Course) => void;
  onDeleteLesson?: (courseId: number, lessonId: number) => void;
  onLaunchStellariumWithTarget?: (targetName: string, raDec?: { ra: string; dec: string }) => void;
  isAdminUnlocked?: boolean;
  onUpdateCourse?: (course: Course) => void;
}

export const LessonPlayerView: React.FC<LessonPlayerViewProps> = ({
  course,
  completedLessons,
  onToggleCompleteLesson,
  onBackToCourses,
  onNavigateToSkyLabWithTarget,
  onNavigateToAddVideo,
  onOpenQuiz,
  onDeleteLesson,
  onLaunchStellariumWithTarget,
  isAdminUnlocked = false,
  onUpdateCourse,
}) => {
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(45);
  const [playbackSpeed, setPlaybackSpeed] = useState('1.0x');
  const [isMuted, setIsMuted] = useState(false);
  const [playerMode, setPlayerMode] = useState<'embed' | 'simulated'>('embed');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const currentLesson: Lesson | undefined = course.lessons[activeLessonIndex] || course.lessons[0];
  const isCurrentCompleted = currentLesson ? completedLessons.includes(currentLesson.id) : false;

  const videoDetails = currentLesson ? formatVideoUrl(currentLesson.videoUrl) : null;
  const isDirectFileOrMp4 = currentLesson?.videoSource === 'upload' || Boolean(videoDetails?.isDirectVideo);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && playerMode === 'simulated') {
      interval = setInterval(() => {
        setPlaybackTime((prev) => (prev >= 600 ? 0 : prev + 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playerMode]);

  if (!currentLesson) {
    return (
      <div className="p-12 text-center text-slate-400 bg-slate-900 border border-slate-800 rounded-3xl max-w-xl mx-auto space-y-4">
        <p className="text-sm font-semibold text-white">No lessons currently available for this course.</p>
        <p className="text-xs text-slate-400">All previous lessons may have been removed by an administrator.</p>
        <button 
          onClick={onBackToCourses} 
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl inline-flex items-center gap-1.5 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>← Back to Course Catalog</span>
        </button>
      </div>
    );
  }

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = Math.floor(secs % 60);
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const handleDeleteCurrentLesson = () => {
    if (!onDeleteLesson) return;
    if (window.confirm(`Are you sure you want to remove the video/lesson "${currentLesson.title}" from this course?`)) {
      onDeleteLesson(course.id, currentLesson.id);
      setActiveLessonIndex(0);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Breadcrumb & User-Friendly Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <button
          onClick={onBackToCourses}
          className="group inline-flex items-center gap-2 px-4 py-2 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-500 text-slate-200 hover:text-white rounded-xl text-xs font-semibold tracking-wide transition shadow-sm"
        >
          <ArrowLeft className="w-4 h-4 text-cyan-400 group-hover:-translate-x-1 transition-transform" />
          <span>← BACK TO ALL COURSES</span>
        </button>

        <div className="flex flex-wrap items-center gap-2.5">
          {course.quiz && onOpenQuiz && (
            <button
              onClick={() => onOpenQuiz(course)}
              className="px-3.5 py-1.5 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md transition"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Take Track Quiz</span>
            </button>
          )}

          {/* Admin Video Actions */}
          {isAdminUnlocked && onNavigateToAddVideo && (
            <button
              onClick={() => onNavigateToAddVideo(course.id)}
              className="px-3 py-1.5 bg-cyan-950/70 hover:bg-cyan-900 border border-cyan-800/60 text-cyan-300 text-xs font-medium rounded-xl flex items-center gap-1.5 transition"
            >
              <Plus className="w-3.5 h-3.5 text-cyan-400" />
              <span>+ Add Video</span>
            </button>
          )}

          {isAdminUnlocked && onDeleteLesson && (
            <button
              onClick={handleDeleteCurrentLesson}
              className="px-3 py-1.5 bg-rose-950/80 hover:bg-rose-900 border border-rose-800/60 text-rose-300 hover:text-white text-xs font-medium rounded-xl flex items-center gap-1.5 transition"
              title="Delete current video and remove from curriculum"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remove This Video</span>
            </button>
          )}

          <span className="text-xs text-slate-400 font-mono hidden sm:inline">
            Track: <strong className="text-white font-medium">{course.title}</strong>
          </span>
          <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
            {activeLessonIndex + 1}/{course.lessons.length}
          </span>
        </div>
      </div>

      {/* Main Grid: Player Stage & Playlist */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Player & Lesson Content (Span 2) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Video Player Box */}
          <div className="bg-black rounded-3xl border border-slate-800 overflow-hidden shadow-2xl relative">
            {/* Player Mode Header */}
            <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <span className="font-mono text-slate-300 uppercase tracking-wider text-[11px] truncate">
                  {currentLesson.videoFileName ? `FILE: ${currentLesson.videoFileName}` : `STREAM: #${currentLesson.id}`} · {currentLesson.duration}
                </span>
                {currentLesson.videoSource === 'upload' && (
                  <span className="bg-cyan-950 text-cyan-400 text-[9px] px-1.5 py-0.5 rounded font-mono border border-cyan-800/40 shrink-0">
                    CUSTOM UPLOAD
                  </span>
                )}
              </div>

              {/* Mode Toggle */}
              <div className="flex items-center gap-1 bg-black/60 p-0.5 rounded-lg border border-slate-800 shrink-0">
                <button
                  onClick={() => setPlayerMode('embed')}
                  className={`px-2.5 py-1 rounded text-[11px] font-medium transition ${
                    playerMode === 'embed' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Tv className="w-3 h-3 inline mr-1" />
                  {isDirectFileOrMp4 ? 'Native Video' : 'Video Feed'}
                </button>
                <button
                  onClick={() => setPlayerMode('simulated')}
                  className={`px-2.5 py-1 rounded text-[11px] font-medium transition ${
                    playerMode === 'simulated' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Activity className="w-3 h-3 inline mr-1" />
                  Telemetry Stage
                </button>
              </div>
            </div>

            {/* Viewport Screen */}
            <div className="aspect-video w-full relative bg-slate-950 flex items-center justify-center overflow-hidden">
              {playerMode === 'embed' ? (
                isDirectFileOrMp4 ? (
                  <video
                    key={currentLesson.videoUrl}
                    src={currentLesson.videoUrl}
                    controls
                    playsInline
                    className="w-full h-full object-contain bg-black"
                  />
                ) : (
                  <iframe
                    key={currentLesson.videoUrl}
                    src={videoDetails?.embedUrl || currentLesson.videoUrl}
                    title={currentLesson.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                )
              ) : (
                /* Simulated Astronomical Telemetry Player */
                <div className="w-full h-full flex flex-col justify-between p-6 bg-gradient-to-b from-[#080c18] via-[#05070e] to-[#020307] relative">
                  <div className="absolute inset-0 pointer-events-none opacity-20">
                    <div className="w-full h-full border border-dashed border-cyan-500/40" />
                    <div className="absolute top-1/2 left-0 right-0 h-px bg-cyan-500/30" />
                    <div className="absolute left-1/2 top-0 bottom-0 w-px bg-cyan-500/30" />
                  </div>

                  <div className="flex justify-between items-start z-10">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
                        TELESCOPE CAM 01 // DIRECT OPTICAL FEED
                      </span>
                      <p className="text-white font-semibold text-lg">{currentLesson.title}</p>
                      <p className="text-xs text-slate-400 font-mono">Target: {currentLesson.targetObject || 'Celestial Coordinate'}</p>
                    </div>

                    <div className="text-right text-[11px] font-mono text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
                      <div>RA: {currentLesson.coordinates?.ra || '05h 35m 17s'}</div>
                      <div>DEC: {currentLesson.coordinates?.dec || '-05° 23′ 28″'}</div>
                    </div>
                  </div>

                  {/* Center Play Button */}
                  <div className="text-center z-10">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="w-16 h-16 rounded-full bg-indigo-600/90 hover:bg-indigo-500 text-white flex items-center justify-center shadow-xl shadow-indigo-900/50 hover:scale-105 transition transform"
                    >
                      {isPlaying ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-1" />}
                    </button>
                    <p className="text-xs text-slate-400 mt-2 font-mono">
                      {isPlaying ? 'PAUSE OBSERVATION STREAM' : 'RESUME SPECTROGRAM STREAM'}
                    </p>
                  </div>

                  {/* Player Controls Bar */}
                  <div className="z-10 bg-slate-900/90 backdrop-blur border border-slate-800 rounded-xl p-3 space-y-2">
                    <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
                      <span className="tabular-nums">{formatTime(playbackTime)}</span>
                      <input
                        type="range"
                        min="0"
                        max="600"
                        value={playbackTime}
                        onChange={(e) => setPlaybackTime(Number(e.target.value))}
                        className="flex-1 accent-indigo-500 h-1 bg-slate-800 rounded-lg cursor-pointer"
                      />
                      <span className="tabular-nums">10:00</span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setIsPlaying(!isPlaying)}
                          className="text-white hover:text-indigo-400 transition"
                        >
                          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </button>

                        <button
                          onClick={() => setIsMuted(!isMuted)}
                          className="text-slate-400 hover:text-white transition"
                        >
                          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        {['1.0x', '1.25x', '1.5x'].map((spd) => (
                          <button
                            key={spd}
                            onClick={() => setPlaybackSpeed(spd)}
                            className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition ${
                              playbackSpeed === spd ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            {spd}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Video footer bar */}
            <div className="p-4 bg-[#090d16] border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Lesson {activeLessonIndex + 1}: {currentLesson.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1 font-mono">
                  Duration: {currentLesson.duration} · Lead Affiliation: {course.leadAstronomer.affiliation}
                </p>
              </div>

              {/* Actions & Mark Complete Button */}
              <div className="flex flex-wrap items-center gap-3">
                {currentLesson.videoUrl && !currentLesson.videoUrl.startsWith('blob:') && (
                  <a
                    href={currentLesson.videoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-2 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium transition flex items-center gap-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open in Tab</span>
                  </a>
                )}

                <button
                  onClick={() => onToggleCompleteLesson(currentLesson.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition shadow-md ${
                    isCurrentCompleted
                      ? 'bg-emerald-600/90 hover:bg-emerald-500 text-white shadow-emerald-950'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-950'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isCurrentCompleted ? 'Completed ✓' : 'Mark as Completed'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Lesson Deep-Dive Details */}
          <div className="bg-[#090d16] border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-400 font-mono mb-2">
                Lesson Overview & Methodology
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                {currentLesson.description}
              </p>
            </div>

            {/* Target Astronomical Coordinates */}
            {currentLesson.coordinates && (
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-[11px] font-mono text-cyan-400">
                    TARGET CELESTIAL COORDINATES
                  </div>
                  <div className="text-sm font-semibold text-white">
                    {currentLesson.targetObject} ({currentLesson.coordinates.constellation})
                  </div>
                  <div className="flex items-center gap-4 text-xs font-mono text-slate-400 pt-0.5">
                    <span>RA: <strong className="text-slate-200">{currentLesson.coordinates.ra}</strong></span>
                    <span>DEC: <strong className="text-slate-200">{currentLesson.coordinates.dec}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {onLaunchStellariumWithTarget && (
                    <button
                      onClick={() => onLaunchStellariumWithTarget(
                        currentLesson.targetObject || 'Deep Sky Target',
                        { ra: currentLesson.coordinates?.ra || '', dec: currentLesson.coordinates?.dec || '' }
                      )}
                      className="px-3.5 py-2 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-800/60 rounded-xl text-xs font-medium text-cyan-300 hover:text-white flex items-center gap-1.5 transition"
                    >
                      <Compass className="w-4 h-4 text-cyan-400" />
                      <span>Stellarium Web</span>
                      <ExternalLink className="w-3 h-3 ml-0.5" />
                    </button>
                  )}

                  {onNavigateToSkyLabWithTarget && (
                    <button
                      onClick={() => onNavigateToSkyLabWithTarget(currentLesson.targetObject || '')}
                      className="px-3.5 py-2 bg-slate-800 hover:bg-indigo-950 hover:border-indigo-700/60 border border-slate-700 rounded-xl text-xs font-medium text-slate-200 hover:text-white flex items-center gap-1.5 transition"
                    >
                      <Compass className="w-4 h-4 text-indigo-400" />
                      <span>Sky Lab</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Key Theoretical Takeaways */}
            {currentLesson.keyTakeaways && currentLesson.keyTakeaways.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-400 font-mono">
                  Key Scientific Takeaways
                </h4>
                <ul className="space-y-2">
                  {currentLesson.keyTakeaways.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Course Professor & What Students Learn Card */}
          <div className="bg-[#090d16] border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">Course Lead Professor</div>
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    <span>{course.leadAstronomer.name}</span>
                    <span className="text-xs font-normal text-slate-400">({course.leadAstronomer.affiliation})</span>
                  </div>
                </div>
              </div>

              {isAdminUnlocked && onUpdateCourse && (
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="px-3.5 py-1.5 bg-cyan-950 hover:bg-cyan-900 border border-cyan-700/60 hover:border-cyan-400 text-cyan-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
                  title="Admin: Edit professor name, course metadata, and student learning subjects"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Admin: Edit Course & Professor</span>
                </button>
              )}
            </div>

            {/* Subjects Student Learns */}
            <div className="space-y-2">
              <div className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Subjects Students Learn in This Track:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {course.learningSubjects && course.learningSubjects.length > 0 ? (
                  course.learningSubjects.map((subject, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-slate-950 border border-slate-800 text-cyan-200 px-3 py-1 rounded-lg"
                    >
                      {subject}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-500 italic">
                    Core celestial mechanics and observational logging rigor.
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Track Playlist Sidebar */}
        <div className="space-y-6">
          <div className="bg-[#090d16] border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
              <div>
                <h3 className="text-sm font-semibold text-white">Track Lessons</h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  {completedLessons.filter((id) => course.lessons.some((l) => l.id === id)).length} of {course.lessons.length} Completed
                </p>
              </div>

              {isAdminUnlocked && onNavigateToAddVideo && (
                <button
                  onClick={() => onNavigateToAddVideo(course.id)}
                  title="Add video to this track"
                  className="p-1.5 bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800/60 rounded-lg text-xs flex items-center gap-1 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-mono">Add</span>
                </button>
              )}
            </div>

            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {course.lessons.map((lesson, idx) => {
                const isSelected = idx === activeLessonIndex;
                const isDone = completedLessons.includes(lesson.id);

                return (
                  <div
                    key={lesson.id}
                    onClick={() => setActiveLessonIndex(idx)}
                    className={`w-full text-left p-3.5 rounded-2xl border text-xs transition flex items-start justify-between gap-3 cursor-pointer group ${
                      isSelected
                        ? 'bg-indigo-950/70 border-indigo-500/80 text-white shadow-sm ring-1 ring-indigo-500/40'
                        : 'bg-slate-950/40 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleCompleteLesson(lesson.id);
                        }}
                        className="mt-0.5 hover:scale-110 transition shrink-0"
                        title={isDone ? 'Mark uncompleted' : 'Mark completed'}
                      >
                        {isDone ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-600 shrink-0" />
                        )}
                      </span>

                      <div className="min-w-0">
                        <p className={`font-medium line-clamp-1 ${isSelected ? 'text-indigo-200 font-semibold' : 'text-slate-300'}`}>
                          {idx + 1}. {lesson.title}
                        </p>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1 font-mono">
                          <Clock className="w-3 h-3" />
                          <span>{lesson.duration}</span>
                          {lesson.videoSource === 'upload' && (
                            <span className="text-[9px] text-cyan-400 bg-cyan-950 px-1 rounded">FILE</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Admin Delete Icon directly on lesson */}
                    {isAdminUnlocked && onDeleteLesson && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm(`Delete "${lesson.title}" from this course?`)) {
                            onDeleteLesson(course.id, lesson.id);
                          }
                        }}
                        title="Admin: Remove this lesson"
                        className="p-1 text-slate-500 hover:text-rose-400 hover:bg-rose-950/50 rounded transition shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Next / Previous Lesson Buttons */}
            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
              <button
                disabled={activeLessonIndex === 0}
                onClick={() => setActiveLessonIndex((prev) => Math.max(0, prev - 1))}
                className="px-3 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-slate-900 border border-slate-800 rounded-xl text-xs font-medium text-slate-300 flex items-center gap-1 transition"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Prev
              </button>

              <button
                disabled={activeLessonIndex === course.lessons.length - 1}
                onClick={() => setActiveLessonIndex((prev) => Math.min(course.lessons.length - 1, prev + 1))}
                className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 disabled:hover:bg-indigo-600 rounded-xl text-xs font-medium text-white flex items-center gap-1 transition"
              >
                Next <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Course Edit Modal */}
      {isEditModalOpen && (
        <CourseEditModal
          course={course}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
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

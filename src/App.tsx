import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Award, 
  Compass, 
  ClipboardList, 
  Settings, 
  Menu, 
  X, 
  UserCheck, 
  ShieldCheck,
  Sparkles,
  Video, 
  Upload, 
  Calendar, 
  Lock, 
  HardDrive,
  Bot,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { 
  User, 
  Course, 
  Lesson, 
  ObservationEntry, 
  CustomCertificate, 
  SocietyEvent,
  CertificateSettings
} from './types/astronomy';
import { 
  INITIAL_COURSES, 
  INITIAL_OBSERVATION_LOGS, 
  INITIAL_EVENTS, 
  ADMIN_SECURITY_PASSWORD,
  DEFAULT_CERTIFICATE_SETTINGS
} from './data/initialCourses';
import { Sidebar } from './components/Sidebar';
import { CoursesView } from './components/CoursesView';
import { LessonPlayerView } from './components/LessonPlayerView';
import { CertificateView } from './components/CertificateView';
import { VideoStudioView } from './components/VideoStudioView';
import { CertificateStudioView } from './components/CertificateStudioView';
import { AdminDashboard } from './components/AdminDashboard';
import { SkyObservationLab } from './components/SkyObservationLab';
import { ObservationLogbook } from './components/ObservationLogbook';
import { EventsView } from './components/EventsView';
import { AstroEventsCalendar } from './components/AstroEventsCalendar';
import { CosmoGuideChat } from './components/CosmoGuideChat';
import { StellariumModal } from './components/StellariumModal';
import { AdminPasswordModal } from './components/AdminPasswordModal';
import { MemberProfileModal } from './components/MemberProfileModal';
import { CourseQuizModal } from './components/CourseQuizModal';
import { DataLocationModal } from './components/DataLocationModal';

const INITIAL_CUSTOM_CERTIFICATES: CustomCertificate[] = [
  {
    id: 'cert_ras_demo_1',
    courseId: 1,
    courseTitle: 'Introduction to Astrophotography & Optical Stacking',
    recipientName: 'Astro Explorer',
    memberId: 'ASTRO-2026-0142',
    issueDate: 'September 20, 2026',
    certificateNumber: 'CERT-RAS-77291',
    issuerOrg: 'Royal Astronomical Society Research Guild',
    notes: 'Awarded for precision equatorial mount polar alignment and multi-exposure stacking of Messier 42.',
    uploadedBy: 'Society Academic Board',
    verified: true,
  }
];

export default function AstronomyLMS() {
  // Current logged in user state (with localStorage persistence)
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('astro_current_user');
    if (saved) {
      try { 
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          badges: parsed.badges || ['badge_first_flight', 'badge_astrophoto_master'],
          eventParticipations: parsed.eventParticipations || ['event_perseids_2026'],
          quizScores: parsed.quizScores || { 1: 100 },
        };
      } catch (e) { /* ignore */ }
    }
    return {
      id: 'usr_001',
      name: 'Astro Explorer',
      email: 'explorer@astronomy.org',
      role: 'member',
      memberId: 'ASTRO-2026-0142',
      avatar: '🌌',
      photoUrl: '',
      callsign: 'ASTRO-EXPLORER',
      bio: 'Deep-sky astrophotography researcher specializing in H-alpha emission nebula stacking and plate solving.',
      joinedDate: '2026-01-15',
      tier: 'Standard Fellow',
      badges: ['badge_first_flight', 'badge_astrophoto_master'],
      eventParticipations: ['event_perseids_2026'],
      quizScores: { 1: 100 },
    };
  });

  // Admin security unlock state (Protected with "AstroEdncAdmin")
  const [isAdminUnlocked, setIsAdminUnlocked] = useState<boolean>(() => {
    return sessionStorage.getItem('astro_admin_unlocked') === 'true';
  });

  const [activeTab, setActiveTab] = useState<string>('courses');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [targetForSkyLab, setTargetForSkyLab] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Gemini Chatbot & Stellarium state
  const [isGeminiChatOpen, setIsGeminiChatOpen] = useState(false);
  const [isStellariumModalOpen, setIsStellariumModalOpen] = useState(false);
  const [stellariumTarget, setStellariumTarget] = useState<string>('Orion Nebula');
  const [stellariumCoordinates, setStellariumCoordinates] = useState<{ ra: string; dec: string } | undefined>(undefined);

  // Modals state
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isDataLocationModalOpen, setIsDataLocationModalOpen] = useState(false);
  const [activeQuizCourse, setActiveQuizCourse] = useState<Course | null>(null);

  // Folder configuration location
  const [folderPath, setFolderPath] = useState<string>(() => {
    return localStorage.getItem('astro_data_folder_path') || '/astronomy-society-data/vault/';
  });

  // Society events list
  const [events, setEvents] = useState<SocietyEvent[]>(() => {
    const saved = localStorage.getItem('astro_events');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_EVENTS;
  });

  // Dynamic courses list
  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem('astro_courses');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_COURSES;
  });

  // Completed lessons list
  const [completedLessons, setCompletedLessons] = useState<number[]>(() => {
    const saved = localStorage.getItem('astro_completed_lessons');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return [101, 102, 201];
  });

  // Custom Uploaded Certificates state
  const [customCertificates, setCustomCertificates] = useState<CustomCertificate[]>(() => {
    const saved = localStorage.getItem('astro_custom_certificates');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_CUSTOM_CERTIFICATES;
  });

  // Custom Uploaded Template Background state
  const [activeCustomTemplate, setActiveCustomTemplate] = useState<string>(() => {
    return localStorage.getItem('astro_custom_template') || '';
  });

  // Certificate Diploma & Signatory Settings (Configurable by Admin)
  const [certificateSettings, setCertificateSettings] = useState<CertificateSettings>(() => {
    const saved = localStorage.getItem('astro_certificate_settings');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return DEFAULT_CERTIFICATE_SETTINGS;
  });

  // Observational logs
  const [observationLogs, setObservationLogs] = useState<ObservationEntry[]>(() => {
    const saved = localStorage.getItem('astro_obs_logs');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_OBSERVATION_LOGS;
  });

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('astro_certificate_settings', JSON.stringify(certificateSettings));
  }, [certificateSettings]);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('astro_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('astro_courses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('astro_completed_lessons', JSON.stringify(completedLessons));
  }, [completedLessons]);

  useEffect(() => {
    localStorage.setItem('astro_custom_certificates', JSON.stringify(customCertificates));
  }, [customCertificates]);

  useEffect(() => {
    localStorage.setItem('astro_data_folder_path', folderPath);
  }, [folderPath]);

  useEffect(() => {
    localStorage.setItem('astro_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    if (activeCustomTemplate) {
      localStorage.setItem('astro_custom_template', activeCustomTemplate);
    } else {
      localStorage.removeItem('astro_custom_template');
    }
  }, [activeCustomTemplate]);

  useEffect(() => {
    localStorage.setItem('astro_obs_logs', JSON.stringify(observationLogs));
  }, [observationLogs]);

  // Handle Admin Password Unlock
  const handleAdminUnlocked = () => {
    setIsAdminUnlocked(true);
    sessionStorage.setItem('astro_admin_unlocked', 'true');
    setCurrentUser((prev) => ({
      ...prev,
      role: 'admin',
      tier: 'Observatory Director',
    }));
    setIsPasswordModalOpen(false);
    setActiveTab('admin');
  };

  // Switch to Member mode (Lock Admin)
  const handleSwitchToMember = () => {
    setIsAdminUnlocked(false);
    sessionStorage.removeItem('astro_admin_unlocked');
    setCurrentUser((prev) => ({
      ...prev,
      role: 'member',
      tier: 'Standard Fellow',
    }));
    if (activeTab === 'admin' || activeTab === 'video_studio' || activeTab === 'cert_studio') {
      setActiveTab('courses');
    }
  };

  // Toggle lesson complete
  const handleToggleCompleteLesson = (lessonId: number) => {
    setCompletedLessons((prev) =>
      prev.includes(lessonId) ? prev.filter((id) => id !== lessonId) : [...prev, lessonId]
    );
  };

  // Add new lesson (Admin action / Video Studio)
  const handleAddLesson = (courseId: number, newLessonData: Omit<Lesson, 'id'>) => {
    if (!isAdminUnlocked) {
      setIsPasswordModalOpen(true);
      return;
    }

    const newLesson: Lesson = {
      ...newLessonData,
      id: Date.now(),
    };

    setCourses((prev) =>
      prev.map((c) => (c.id === courseId ? { ...c, lessons: [...c.lessons, newLesson] } : c))
    );

    if (selectedCourse && selectedCourse.id === courseId) {
      setSelectedCourse((prev) => (prev ? { ...prev, lessons: [...prev.lessons, newLesson] } : prev));
    }
  };

  // Delete lesson / remove video (Admin action)
  const handleDeleteLesson = (courseId: number, lessonId: number) => {
    if (!isAdminUnlocked) {
      setIsPasswordModalOpen(true);
      return;
    }

    setCourses((prev) =>
      prev.map((c) =>
        c.id === courseId ? { ...c, lessons: c.lessons.filter((l) => l.id !== lessonId) } : c
      )
    );

    if (selectedCourse && selectedCourse.id === courseId) {
      setSelectedCourse((prev) =>
        prev ? { ...prev, lessons: prev.lessons.filter((l) => l.id !== lessonId) } : prev
      );
    }
  };

  // Create course track (Admin action)
  const handleCreateCourse = (courseData: Omit<Course, 'id' | 'lessons'>) => {
    if (!isAdminUnlocked) {
      setIsPasswordModalOpen(true);
      return;
    }

    const newCourse: Course = {
      ...courseData,
      id: Date.now(),
      lessons: [],
    };
    setCourses((prev) => [...prev, newCourse]);
  };

  // Update Course (Admin action)
  const handleUpdateCourse = (updatedCourse: Course) => {
    if (!isAdminUnlocked) {
      setIsPasswordModalOpen(true);
      return;
    }
    setCourses((prev) => prev.map((c) => (c.id === updatedCourse.id ? updatedCourse : c)));
    if (selectedCourse?.id === updatedCourse.id) {
      setSelectedCourse(updatedCourse);
    }
  };

  // Delete Course (Admin action)
  const handleDeleteCourse = (courseId: number) => {
    if (!isAdminUnlocked) {
      setIsPasswordModalOpen(true);
      return;
    }
    setCourses((prev) => prev.filter((c) => c.id !== courseId));
    if (selectedCourse?.id === courseId) {
      setSelectedCourse(null);
    }
  };

  // Update Certificate Settings (Admin action)
  const handleUpdateCertificateSettings = (newSettings: CertificateSettings) => {
    if (!isAdminUnlocked) {
      setIsPasswordModalOpen(true);
      return;
    }
    setCertificateSettings(newSettings);
  };

  // Custom Certificate Handlers (Admin action)
  const handleAddCustomCertificate = (cert: CustomCertificate) => {
    if (!isAdminUnlocked) {
      setIsPasswordModalOpen(true);
      return;
    }
    setCustomCertificates((prev) => [cert, ...prev]);
  };

  const handleDeleteCustomCertificate = (certId: string) => {
    if (!isAdminUnlocked) {
      setIsPasswordModalOpen(true);
      return;
    }
    setCustomCertificates((prev) => prev.filter((c) => c.id !== certId));
  };

  const handleSetCustomTemplate = (templateDataUrl: string) => {
    if (!isAdminUnlocked) {
      setIsPasswordModalOpen(true);
      return;
    }
    setActiveCustomTemplate(templateDataUrl);
  };

  // Update profile
  const handleUpdateUser = (updated: Partial<User>) => {
    setCurrentUser((prev) => ({ ...prev, ...updated }));
  };

  // Event RSVP & Claim Badge
  const handleJoinEvent = (eventId: string, badgeId: string) => {
    setEvents((prev) =>
      prev.map((e) =>
        e.id === eventId
          ? {
              ...e,
              registeredMembers: e.registeredMembers.includes(currentUser.id)
                ? e.registeredMembers
                : [...e.registeredMembers, currentUser.id],
            }
          : e
      )
    );

    setCurrentUser((prev) => {
      const updatedParticipations = prev.eventParticipations.includes(eventId)
        ? prev.eventParticipations
        : [...prev.eventParticipations, eventId];

      const updatedBadges = prev.badges.includes(badgeId)
        ? prev.badges
        : [...prev.badges, badgeId];

      return {
        ...prev,
        eventParticipations: updatedParticipations,
        badges: updatedBadges,
      };
    });
  };

  // Quiz Completion & Score Processing
  const handleQuizComplete = (courseId: number, scorePercentage: number) => {
    setCurrentUser((prev) => {
      const updatedScores = {
        ...prev.quizScores,
        [courseId]: scorePercentage,
      };

      const newBadges = [...prev.badges];

      if (scorePercentage >= 70) {
        if (courseId === 1 && !newBadges.includes('badge_astrophoto_master')) {
          newBadges.push('badge_astrophoto_master');
        } else if (courseId === 2 && !newBadges.includes('badge_cartographer')) {
          newBadges.push('badge_cartographer');
        } else if (courseId === 3 && !newBadges.includes('badge_planetary_scientist')) {
          newBadges.push('badge_planetary_scientist');
        } else if (courseId === 4 && !newBadges.includes('badge_radio_astronomer')) {
          newBadges.push('badge_radio_astronomer');
        }
      }

      if (scorePercentage === 100 && !newBadges.includes('badge_quiz_ace')) {
        newBadges.push('badge_quiz_ace');
      }

      return {
        ...prev,
        quizScores: updatedScores,
        badges: newBadges,
      };
    });
  };

  // Add observation log entry
  const handleAddObservation = (entry: Omit<ObservationEntry, 'id' | 'verified'>) => {
    const newEntry: ObservationEntry = {
      ...entry,
      id: `log_${Date.now()}`,
      verified: true,
    };
    setObservationLogs((prev) => [newEntry, ...prev]);
  };

  // Restore Database from file in folder
  const handleRestoreData = (restored: any) => {
    if (restored.courses) setCourses(restored.courses);
    if (restored.customCertificates) setCustomCertificates(restored.customCertificates);
    if (restored.observationLogs) setObservationLogs(restored.observationLogs);
    if (restored.completedLessons) setCompletedLessons(restored.completedLessons);
    if (restored.currentUser) {
      setCurrentUser((prev) => ({
        ...prev,
        ...restored.currentUser,
      }));
    }
  };

  const handleCompleteAllLessonsDemo = () => {
    const allLessonIds = courses.flatMap((c) => c.lessons.map((l) => l.id));
    setCompletedLessons(allLessonIds);
  };

  const handleResetProgressDemo = () => {
    setCompletedLessons([]);
  };

  const handleNavigateToSkyLab = (targetName: string) => {
    setTargetForSkyLab(targetName);
    setActiveTab('skylab');
  };

  const handleLaunchStellariumWithTarget = (targetName: string, raDec?: { ra: string; dec: string }) => {
    setStellariumTarget(targetName);
    setStellariumCoordinates(raDec);
    setIsStellariumModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#060811] text-slate-100 flex font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* DESKTOP SIDEBAR */}
      <Sidebar
        currentUser={currentUser}
        onUpdateUser={handleUpdateUser}
        onSwitchToMember={handleSwitchToMember}
        onPromptAdminPassword={() => setIsPasswordModalOpen(true)}
        isAdminUnlocked={isAdminUnlocked}
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'courses') setSelectedCourse(null);
        }}
        onClearSelectedCourse={() => setSelectedCourse(null)}
        totalCoursesCount={courses.length}
        completedLessonsCount={completedLessons.length}
        customCertificatesCount={customCertificates.length}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        onOpenDataLocationModal={() => setIsDataLocationModalOpen(true)}
        folderPath={folderPath}
        onOpenGeminiChat={() => setIsGeminiChatOpen(true)}
        onOpenStellarium={() => {
          setStellariumTarget('Deep Sky Target');
          setIsStellariumModalOpen(true);
        }}
      />

      {/* MAIN VIEWPORT */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* TOP ACTION BAR (DESKTOP & MOBILE) */}
        <header className="bg-[#090d16]/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-8 py-3 sticky top-0 z-30 flex items-center justify-between no-print">
          <div className="flex items-center gap-3">
            <span className="text-xl md:hidden">🔭</span>
            <div className="md:hidden">
              <span className="font-semibold text-xs text-white">Astronomy Society</span>
              <p className="text-[10px] text-cyan-400 font-mono">PORTAL LMS</p>
            </div>

            {/* Desktop Quick Nav Shortcuts */}
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => {
                  setStellariumTarget('Orion Nebula');
                  setIsStellariumModalOpen(true);
                }}
                className="px-3 py-1.5 bg-indigo-950/60 hover:bg-indigo-900/80 border border-indigo-700/50 hover:border-cyan-400 text-indigo-300 hover:text-white rounded-xl text-xs font-medium flex items-center gap-1.5 transition"
                title="Open Stellarium Web Planetarium"
              >
                <Compass className="w-3.5 h-3.5 text-cyan-400" />
                <span>🔭 Stellarium Web</span>
                <ExternalLink className="w-3 h-3" />
              </button>

              <button
                onClick={() => setIsGeminiChatOpen(true)}
                className="px-3 py-1.5 bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-700/50 hover:border-cyan-400 text-cyan-300 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
                title="Ask CosmoGuide Gemini AI for help"
              >
                <Bot className="w-3.5 h-3.5 text-cyan-400" />
                <span>✨ Ask Gemini AI</span>
              </button>

              <button
                onClick={() => setActiveTab('astro_calendar')}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition ${
                  activeTab === 'astro_calendar'
                    ? 'bg-amber-600 text-white border-amber-500'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
                }`}
              >
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>Special Events 2026</span>
              </button>
            </div>
          </div>

          {/* User Status / Mode Switcher */}
          <div className="flex items-center gap-2.5">
            {isAdminUnlocked ? (
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline text-[11px] font-mono text-purple-400 bg-purple-950/80 border border-purple-800/60 px-2 py-1 rounded-lg">
                  🛡️ Admin Unlocked
                </span>
                <button
                  onClick={handleSwitchToMember}
                  className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-rose-950/80 text-rose-200 border border-rose-800 hover:bg-rose-900 transition flex items-center gap-1"
                >
                  <Lock className="w-3 h-3" />
                  <span>Lock Admin</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsPasswordModalOpen(true)}
                className="text-[11px] font-mono px-3 py-1 rounded-lg bg-slate-900 hover:bg-purple-950/50 text-slate-300 hover:text-purple-300 border border-slate-700 transition flex items-center gap-1.5"
                title="Enter password 'AstroEdncAdmin' to unlock admin control"
              >
                <Lock className="w-3 h-3 text-purple-400" />
                <span>Unlock Admin Mode</span>
              </button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 text-slate-400 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </header>

        {/* MOBILE DRAWER */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#090d16] border-b border-slate-800 p-4 space-y-2 text-xs z-30 animate-fadeIn no-print">
            <button
              onClick={() => {
                setActiveTab('courses');
                setSelectedCourse(null);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-lg font-medium flex items-center justify-between ${
                activeTab === 'courses' ? 'bg-indigo-600 text-white' : 'text-slate-300'
              }`}
            >
              <span>📚 Courses & Tracks</span>
              <span className="text-[10px] font-mono">{courses.length}</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('astro_calendar');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-lg font-medium flex items-center justify-between ${
                activeTab === 'astro_calendar' ? 'bg-cyan-600 text-white' : 'text-cyan-300'
              }`}
            >
              <span>📅 Astro Events Calendar</span>
              <span className="text-[10px] font-mono bg-cyan-950 px-1 rounded">2026</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('events');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-lg font-medium flex items-center justify-between ${
                activeTab === 'events' ? 'bg-amber-600 text-white' : 'text-slate-300'
              }`}
            >
              <span>✨ Expeditions & Badges</span>
              <span className="text-[10px] font-mono bg-amber-950 px-1 rounded">{currentUser.badges.length}</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('certificate');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-lg font-medium flex items-center justify-between ${
                activeTab === 'certificate' ? 'bg-indigo-600 text-white' : 'text-slate-300'
              }`}
            >
              <span>📜 Official Certificates</span>
            </button>

            {/* Quick interactive tools */}
            <button
              onClick={() => {
                setIsGeminiChatOpen(true);
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg font-medium bg-cyan-950 text-cyan-300 border border-cyan-800/40 flex items-center gap-2"
            >
              <Bot className="w-4 h-4 text-cyan-400" />
              <span>Ask Gemini AI Tutor</span>
            </button>

            <button
              onClick={() => {
                setStellariumTarget('Orion Nebula');
                setIsStellariumModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg font-medium bg-indigo-950 text-indigo-300 border border-indigo-800/40 flex items-center gap-2"
            >
              <Compass className="w-4 h-4 text-indigo-400" />
              <span>Launch Stellarium Web</span>
            </button>

            {/* Admin only tools */}
            {isAdminUnlocked && (
              <>
                <button
                  onClick={() => {
                    setActiveTab('video_studio');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg font-medium flex items-center justify-between ${
                    activeTab === 'video_studio' ? 'bg-purple-600 text-white' : 'text-purple-300'
                  }`}
                >
                  <span>📹 Video Studio (Admin)</span>
                  <span className="text-[10px] font-mono">Unlocked</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('cert_studio');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg font-medium flex items-center justify-between ${
                    activeTab === 'cert_studio' ? 'bg-purple-600 text-white' : 'text-purple-300'
                  }`}
                >
                  <span>📤 Certificate Studio (Admin)</span>
                  <span className="text-[10px] font-mono bg-purple-950 px-1 rounded">{customCertificates.length}</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('admin');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg font-medium ${
                    activeTab === 'admin' ? 'bg-purple-600 text-white' : 'text-purple-300'
                  }`}
                >
                  <span>⚙️ Multi-Admin Control Panel</span>
                </button>
              </>
            )}

            <button
              onClick={() => {
                setIsProfileModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg font-medium text-slate-300 hover:bg-slate-800"
            >
              <span>👤 Member Profile & Photo</span>
            </button>

            <button
              onClick={() => {
                setIsDataLocationModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg font-medium text-slate-300 hover:bg-slate-800"
            >
              <span>💾 Data Location Folder</span>
            </button>
          </div>
        )}

        {/* MAIN BODY CONTENT CONTAINER */}
        <main className="flex-1 p-5 sm:p-8 md:p-10 max-w-7xl w-full mx-auto">
          {/* TAB 1: COURSES CATALOG & VIDEO LESSON PLAYER */}
          {activeTab === 'courses' && !selectedCourse && (
            <CoursesView
              courses={courses}
              currentUser={currentUser}
              completedLessons={completedLessons}
              onSelectCourse={(course) => setSelectedCourse(course)}
              onOpenCertificate={() => setActiveTab('certificate')}
              onNavigateToAddVideo={() => {
                if (!isAdminUnlocked) {
                  setIsPasswordModalOpen(true);
                } else {
                  setActiveTab('video_studio');
                }
              }}
              onOpenQuiz={(course) => setActiveQuizCourse(course)}
              isAdminUnlocked={isAdminUnlocked}
              onUpdateCourse={handleUpdateCourse}
              onNavigateToAdmin={() => setActiveTab('admin')}
            />
          )}

          {activeTab === 'courses' && selectedCourse && (
            <LessonPlayerView
              course={selectedCourse}
              completedLessons={completedLessons}
              onToggleCompleteLesson={handleToggleCompleteLesson}
              onBackToCourses={() => setSelectedCourse(null)}
              onNavigateToSkyLabWithTarget={handleNavigateToSkyLab}
              onNavigateToAddVideo={() => {
                if (!isAdminUnlocked) {
                  setIsPasswordModalOpen(true);
                } else {
                  setActiveTab('video_studio');
                }
              }}
              onOpenQuiz={(course) => setActiveQuizCourse(course)}
              onDeleteLesson={handleDeleteLesson}
              onLaunchStellariumWithTarget={handleLaunchStellariumWithTarget}
              isAdminUnlocked={isAdminUnlocked}
              onUpdateCourse={handleUpdateCourse}
            />
          )}

          {/* TAB 2: ASTRONOMICAL SPECIAL EVENT CALENDAR */}
          {activeTab === 'astro_calendar' && (
            <AstroEventsCalendar
              onBack={() => setActiveTab('courses')}
              onLaunchStellariumWithTarget={handleLaunchStellariumWithTarget}
              onOpenLogbookWithTarget={(targetName) => {
                setActiveTab('observations');
              }}
              userRSVPs={currentUser.eventParticipations}
              onToggleRSVP={(eventId) => handleJoinEvent(eventId, 'badge_perseids_2026')}
            />
          )}

          {/* TAB 3: CAMPAIGN EVENTS & BADGES */}
          {activeTab === 'events' && (
            <EventsView
              events={events}
              currentUser={currentUser}
              onJoinEvent={handleJoinEvent}
              onNavigateToSkyLabWithTarget={handleNavigateToSkyLab}
              onBackToCourses={() => setActiveTab('courses')}
            />
          )}

          {/* TAB 4: DEDICATED VIDEO STUDIO (Protected: Normal users cannot add videos) */}
          {activeTab === 'video_studio' && (
            <VideoStudioView
              courses={courses}
              onAddLesson={handleAddLesson}
              onDeleteLesson={handleDeleteLesson}
              onCreateCourse={handleCreateCourse}
              onSelectCourseToPlay={(course) => {
                setSelectedCourse(course);
                setActiveTab('courses');
              }}
              onBackToCourses={() => setActiveTab('courses')}
              isAdminUnlocked={isAdminUnlocked}
              onPromptAdminPassword={() => setIsPasswordModalOpen(true)}
            />
          )}

          {/* TAB 5: OFFICIAL CERTIFICATES & DIPLOMAS */}
          {activeTab === 'certificate' && (
            <CertificateView
              currentUser={currentUser}
              courses={courses}
              completedLessons={completedLessons}
              customCertificates={customCertificates}
              activeCustomTemplate={activeCustomTemplate}
              certificateSettings={certificateSettings}
              onNavigateToUploadCertificate={() => {
                if (!isAdminUnlocked) {
                  setIsPasswordModalOpen(true);
                } else {
                  setActiveTab('cert_studio');
                }
              }}
              onNavigateToAdmin={() => setActiveTab('admin')}
              onBackToCourses={() => setActiveTab('courses')}
              isAdminUnlocked={isAdminUnlocked}
            />
          )}

          {/* TAB 6: DEDICATED CERTIFICATE STUDIO (Protected: Normal users cannot add certs) */}
          {activeTab === 'cert_studio' && (
            <CertificateStudioView
              currentUser={currentUser}
              courses={courses}
              customCertificates={customCertificates}
              onAddCustomCertificate={handleAddCustomCertificate}
              onDeleteCustomCertificate={handleDeleteCustomCertificate}
              onSetCustomTemplate={handleSetCustomTemplate}
              activeCustomTemplate={activeCustomTemplate}
              onBackToCourses={() => setActiveTab('courses')}
              isAdminUnlocked={isAdminUnlocked}
              onPromptAdminPassword={() => setIsPasswordModalOpen(true)}
            />
          )}

          {/* TAB 7: ADMIN DASHBOARD (Protected by AstroEdncAdmin) */}
          {activeTab === 'admin' && (
            <AdminDashboard
              courses={courses}
              currentUser={currentUser}
              certificateSettings={certificateSettings}
              onUpdateCertificateSettings={handleUpdateCertificateSettings}
              onUpdateCourse={handleUpdateCourse}
              onDeleteCourse={handleDeleteCourse}
              onAddLesson={handleAddLesson}
              onDeleteLesson={handleDeleteLesson}
              onCreateCourse={handleCreateCourse}
              onCompleteAllLessonsDemo={handleCompleteAllLessonsDemo}
              onResetProgressDemo={handleResetProgressDemo}
              completedLessonsCount={completedLessons.length}
              onNavigateToVideoStudio={() => setActiveTab('video_studio')}
              onNavigateToCertificateStudio={() => setActiveTab('cert_studio')}
              onLockAdmin={handleSwitchToMember}
              onBackToCourses={() => setActiveTab('courses')}
            />
          )}

          {/* TAB 8: SKY OBSERVATION LAB */}
          {activeTab === 'skylab' && (
            <SkyObservationLab
              initialTargetName={targetForSkyLab}
              onLogObservation={(targetName) => {
                handleAddObservation({
                  timestamp: `${new Date().toISOString().slice(0, 10)} 22:30 UTC`,
                  target: targetName,
                  catalogueId: 'SKYLAB-RES',
                  magnitude: 3.5,
                  equipment: 'Telescope Reticle Calibration Sensor',
                  skyCondition: 'Rural (Bortle 3-4)',
                  notes: `Target ${targetName} resolved in Sky Observation Lab with coordinates aligned.`,
                });
              }}
              onBackToCourses={() => setActiveTab('courses')}
              onLaunchStellarium={(target) => {
                setStellariumTarget(target);
                setIsStellariumModalOpen(true);
              }}
            />
          )}

          {/* TAB 9: OBSERVATION LOGBOOK */}
          {activeTab === 'observations' && (
            <ObservationLogbook
              logs={observationLogs}
              onAddLog={handleAddObservation}
              onBackToCourses={() => setActiveTab('courses')}
            />
          )}
        </main>
      </div>

      {/* FLOATING GEMINI AI CHAT BUTTON */}
      <div className="fixed bottom-6 right-6 z-40 no-print flex flex-col items-end gap-2">
        <button
          onClick={() => setIsGeminiChatOpen(!isGeminiChatOpen)}
          className="group relative flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-semibold text-xs rounded-full shadow-2xl shadow-cyan-500/40 hover:scale-105 transition-all duration-300 border border-cyan-400/40"
          title="Ask CosmoGuide AI Tutor (Powered by Gemini 3.8 Flash)"
        >
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping absolute -top-1 -right-1" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 absolute -top-1 -right-1" />
          <Sparkles className="w-4 h-4 text-cyan-200" />
          <span className="tracking-wide">Ask Gemini AI</span>
        </button>
      </div>

      {/* GEMINI CHATBOT MODAL / SLIDEOUT */}
      <CosmoGuideChat
        isOpen={isGeminiChatOpen}
        onClose={() => setIsGeminiChatOpen(false)}
        onLaunchStellarium={() => {
          setStellariumTarget('Orion Nebula');
          setIsStellariumModalOpen(true);
        }}
        currentTrackName={selectedCourse?.title}
      />

      {/* STELLARIUM WEB SIMULATOR MODAL */}
      <StellariumModal
        isOpen={isStellariumModalOpen}
        onClose={() => setIsStellariumModalOpen(false)}
        initialTarget={stellariumTarget}
        initialCoordinates={stellariumCoordinates}
      />

      {/* ADMIN PASSWORD SECURITY MODAL */}
      <AdminPasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onUnlockSuccess={handleAdminUnlocked}
      />

      {/* MEMBER PROFILE & BADGES MODAL */}
      <MemberProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentUser={currentUser}
        onUpdateUser={handleUpdateUser}
      />

      {/* DATA FOLDER LOCATION & INTEGRITY MODAL */}
      <DataLocationModal
        isOpen={isDataLocationModalOpen}
        onClose={() => setIsDataLocationModalOpen(false)}
        folderPath={folderPath}
        onChangeFolderPath={(newPath) => setFolderPath(newPath)}
        allData={{
          currentUser,
          courses,
          customCertificates,
          observationLogs,
          completedLessons,
        }}
        onRestoreData={handleRestoreData}
      />

      {/* COURSE QUIZ MODAL */}
      {activeQuizCourse && (
        <CourseQuizModal
          isOpen={Boolean(activeQuizCourse)}
          onClose={() => setActiveQuizCourse(null)}
          course={activeQuizCourse}
          onQuizComplete={handleQuizComplete}
        />
      )}
    </div>
  );
}

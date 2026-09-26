import React from 'react';
import { 
  BookOpen, 
  Award, 
  Compass, 
  ClipboardList, 
  Settings, 
  ChevronRight,
  Edit3,
  Video, 
  Upload, 
  Lock, 
  Calendar, 
  HardDrive, 
  Sparkles,
  Bot,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { User } from '../types/astronomy';

interface SidebarProps {
  currentUser: User;
  onUpdateUser: (updated: Partial<User>) => void;
  onSwitchToMember: () => void;
  onPromptAdminPassword: () => void;
  isAdminUnlocked: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onClearSelectedCourse: () => void;
  totalCoursesCount: number;
  completedLessonsCount: number;
  customCertificatesCount?: number;
  onOpenProfileModal: () => void;
  onOpenDataLocationModal: () => void;
  folderPath: string;
  onOpenGeminiChat?: () => void;
  onOpenStellarium?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentUser,
  onUpdateUser,
  onSwitchToMember,
  onPromptAdminPassword,
  isAdminUnlocked,
  activeTab,
  setActiveTab,
  onClearSelectedCourse,
  completedLessonsCount,
  customCertificatesCount = 0,
  onOpenProfileModal,
  onOpenDataLocationModal,
  folderPath,
  onOpenGeminiChat,
  onOpenStellarium,
}) => {
  const earnedBadgesCount = currentUser.badges?.length || 0;

  // Member primary navigation
  const memberNavItems = [
    { id: 'courses', label: 'Course Tracks', icon: BookOpen },
    { id: 'astro_calendar', label: 'Astro Special Events', icon: Calendar, badge: '2026-2027' },
    { id: 'events', label: 'Expeditions & Badges', icon: Sparkles, badge: `${earnedBadgesCount} Badges` },
    { id: 'certificate', label: 'My Certificates', icon: Award },
    { id: 'skylab', label: 'Sky Observation Lab', icon: Compass },
    { id: 'observations', label: 'Observation Logbook', icon: ClipboardList },
  ];

  // Admin restricted management items
  const adminNavItems = [
    { id: 'video_studio', label: 'Video Studio (Add/Remove)', icon: Video, badge: 'Admin Only' },
    { id: 'cert_studio', label: 'Certificate Studio', icon: Upload, badge: 'Admin Only' },
  ];

  const handleNavClick = (itemId: string, adminOnly?: boolean) => {
    if (adminOnly && !isAdminUnlocked) {
      onPromptAdminPassword();
      return;
    }
    setActiveTab(itemId);
    if (itemId === 'courses') onClearSelectedCourse();
  };

  return (
    <aside className="w-68 bg-[#090d16] border-r border-slate-800/80 p-5 flex flex-col justify-between hidden md:flex shrink-0 select-none overflow-y-auto">
      <div className="space-y-5">
        {/* Brand Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-slate-800/60">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-700 to-cyan-600 flex items-center justify-center text-white shadow-lg shadow-indigo-900/40 shrink-0">
            <span className="text-xl">🔭</span>
          </div>
          <div className="min-w-0">
            <h1 className="font-semibold text-sm tracking-tight text-white truncate">Astronomy Society</h1>
            <p className="text-[10px] text-cyan-400 font-mono tracking-wider uppercase">LMS & RESEARCH VAULT</p>
          </div>
        </div>

        {/* Member Navigation */}
        <div className="space-y-1">
          <p className="px-2 text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-1">
            Learning Curriculum
          </p>

          <nav className="space-y-1" aria-label="Main Navigation">
            {memberNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-600/90 text-white shadow-md shadow-indigo-900/30 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border shrink-0 ${
                      isActive 
                        ? 'bg-indigo-950 text-indigo-200 border-indigo-400/40' 
                        : 'bg-slate-900 text-cyan-400 border-slate-800'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Observatory Tools: Gemini AI & Stellarium */}
        <div className="space-y-1 pt-1 border-t border-slate-800/60">
          <p className="px-2 text-[10px] font-mono uppercase tracking-widest text-cyan-400/80 mb-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>Interactive Tools</span>
          </p>

          {/* Gemini AI Chatbot Trigger */}
          {onOpenGeminiChat && (
            <button
              onClick={onOpenGeminiChat}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-cyan-300 hover:text-white bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-800/40 transition group"
            >
              <div className="flex items-center gap-2.5">
                <Bot className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                <span className="font-semibold">Ask Gemini AI</span>
              </div>
              <span className="text-[9px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-700/50 px-1.5 py-0.5 rounded-full">
                Gemini 3.8
              </span>
            </button>
          )}

          {/* Stellarium Planetarium Launcher */}
          {onOpenStellarium && (
            <button
              onClick={onOpenStellarium}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-indigo-300 hover:text-white bg-indigo-950/30 hover:bg-indigo-900/40 border border-indigo-800/30 transition group"
            >
              <div className="flex items-center gap-2.5">
                <Compass className="w-4 h-4 text-indigo-400 group-hover:rotate-45 transition-transform" />
                <span>Stellarium Web App</span>
              </div>
              <ExternalLink className="w-3 h-3 text-indigo-400" />
            </button>
          )}
        </div>

        {/* Admin Tools Section (Protected by AstroEdncAdmin) */}
        <div className="space-y-1.5 pt-2 border-t border-slate-800/60">
          <div className="flex items-center justify-between px-2 text-[10px] font-mono uppercase tracking-widest">
            <span className={isAdminUnlocked ? 'text-purple-400 font-semibold' : 'text-slate-500'}>
              Admin Controls
            </span>
            <span className={`px-1.5 py-0.5 rounded text-[9px] ${
              isAdminUnlocked ? 'bg-purple-950 text-purple-300 border border-purple-800' : 'bg-slate-900 text-slate-500'
            }`}>
              {isAdminUnlocked ? 'UNLOCKED' : 'PROTECTED'}
            </span>
          </div>

          {/* Notice for normal members */}
          {!isAdminUnlocked && (
            <div className="p-2 bg-slate-950/70 rounded-xl border border-slate-800/80 text-[10px] text-slate-400 leading-tight">
              <span className="text-amber-400 font-semibold block mb-0.5">Member Restricted:</span>
              Normal users cannot add or delete videos/certificates. Unlock admin mode to edit.
            </div>
          )}

          {adminNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id, true)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-950'
                    : isAdminUnlocked
                    ? 'text-purple-300 hover:text-white hover:bg-purple-950/30'
                    : 'text-slate-500 hover:text-purple-400 hover:bg-slate-900/60'
                }`}
                title={isAdminUnlocked ? item.label : 'Requires Admin Password: AstroEdncAdmin'}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </div>

                {!isAdminUnlocked ? (
                  <Lock className="w-3 h-3 text-slate-600 shrink-0" />
                ) : (
                  <span className="text-[9px] font-mono bg-purple-950 text-purple-300 border border-purple-800/60 px-1 rounded">
                    Admin
                  </span>
                )}
              </button>
            );
          })}

          {/* Admin Dashboard Console Tab */}
          {isAdminUnlocked ? (
            <div className="pt-1 space-y-1.5">
              <button
                onClick={() => setActiveTab('admin')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  activeTab === 'admin'
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-900/40'
                    : 'text-purple-300 hover:text-white hover:bg-purple-950/30'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Settings className="w-4 h-4 text-purple-300" />
                  <span>Admin Console</span>
                </div>
                <span className="text-[9px] font-mono uppercase bg-purple-950 text-purple-200 px-1.5 py-0.5 rounded border border-purple-800/60">
                  Active
                </span>
              </button>

              <button
                onClick={onSwitchToMember}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-rose-950/40 text-slate-400 hover:text-rose-300 rounded-lg text-[10px] font-mono border border-slate-800 transition"
              >
                <Lock className="w-3 h-3" />
                <span>Lock Admin Mode</span>
              </button>
            </div>
          ) : (
            <div className="pt-1">
              <button
                onClick={onPromptAdminPassword}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-[11px] text-purple-300 hover:text-white bg-purple-950/20 hover:bg-purple-950/50 border border-dashed border-purple-800/50 transition"
                title="Enter password 'AstroEdncAdmin' to unlock admin mode"
              >
                <div className="flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-purple-400" />
                  <span>Unlock Admin</span>
                </div>
                <span className="text-[10px] text-purple-400 font-mono bg-purple-950/60 px-1.5 py-0.5 rounded border border-purple-800/40">
                  Password
                </span>
              </button>
            </div>
          )}
        </div>

        {/* Data Location Folder Widget */}
        <div className="pt-2 border-t border-slate-800/60">
          <button
            onClick={onOpenDataLocationModal}
            className="w-full p-2.5 bg-slate-950/80 hover:bg-slate-900/90 rounded-xl border border-slate-800/80 text-left transition group"
            title="Configure data location folder and view accuracy metrics"
          >
            <div className="flex items-center justify-between text-[11px] text-slate-400 group-hover:text-cyan-300">
              <span className="flex items-center gap-1.5 font-mono text-[10px]">
                <HardDrive className="w-3.5 h-3.5 text-cyan-400" />
                <span>DATA LOCATION</span>
              </span>
              <span className="text-[9px] text-emerald-400 font-mono">100% Sync</span>
            </div>
            <p className="text-[10px] font-mono text-slate-500 truncate mt-1 group-hover:text-slate-300">
              {folderPath}
            </p>
          </button>
        </div>
      </div>

      {/* Member Profile Widget */}
      <div 
        onClick={onOpenProfileModal}
        className="p-3 bg-[#05070e] rounded-2xl border border-slate-800/80 hover:border-indigo-500/50 cursor-pointer transition group select-none shadow-md mt-4"
        title="Click to customize profile picture, credentials, and review earned badges"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-xl bg-indigo-950 border border-indigo-500/50 overflow-hidden flex items-center justify-center text-sm shrink-0 shadow-inner">
              {currentUser.photoUrl ? (
                <img src={currentUser.photoUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span>{currentUser.avatar}</span>
              )}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-white group-hover:text-cyan-300 transition truncate">
                {currentUser.name}
              </p>
              <p className="text-[10px] font-mono text-cyan-400">{currentUser.memberId}</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {earnedBadgesCount > 0 && (
              <span className="text-[10px] font-mono text-amber-300 bg-amber-950/70 border border-amber-500/40 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                <span>{earnedBadgesCount}</span>
              </span>
            )}
            <Edit3 className="w-3 h-3 text-slate-500 group-hover:text-cyan-400 transition ml-1" />
          </div>
        </div>

        <div className="pt-2 mt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-mono">
          <span>ROLE: <strong className={isAdminUnlocked ? 'text-purple-400' : 'text-slate-300'}>{currentUser.role}</strong></span>
          <span className="text-cyan-400 underline decoration-cyan-500/40 underline-offset-2">Profile & Badges →</span>
        </div>
      </div>
    </aside>
  );
};

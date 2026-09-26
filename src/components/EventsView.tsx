import React, { useState } from 'react';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Award, 
  CheckCircle2, 
  Sparkles, 
  Compass, 
  Users, 
  Radio, 
  ChevronRight,
  ShieldCheck,
  ArrowLeft
} from 'lucide-react';
import { SocietyEvent, User } from '../types/astronomy';

interface EventsViewProps {
  events: SocietyEvent[];
  currentUser: User;
  onJoinEvent: (eventId: string, badgeId: string) => void;
  onNavigateToSkyLabWithTarget?: (target: string) => void;
  onBackToCourses?: () => void;
}

export const EventsView: React.FC<EventsViewProps> = ({
  events,
  currentUser,
  onJoinEvent,
  onNavigateToSkyLabWithTarget,
  onBackToCourses,
}) => {
  const [successEventNotice, setSuccessEventNotice] = useState('');

  const handleAttend = (event: SocietyEvent) => {
    onJoinEvent(event.id, event.badgeId);
    setSuccessEventNotice(`RSVP Confirmed for "${event.title}"! Earned badge: "${event.badgeName}"!`);
    setTimeout(() => setSuccessEventNotice(''), 5000);
  };

  const userParticipations = currentUser.eventParticipations || [];

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-in fade-in">
      {/* Top Friendly Navigation Bar */}
      {onBackToCourses && (
        <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
          <button
            onClick={onBackToCourses}
            className="group inline-flex items-center gap-2 px-4 py-2 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-500 text-slate-200 hover:text-white rounded-xl text-xs font-semibold tracking-wide transition shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 text-cyan-400 group-hover:-translate-x-1 transition-transform" />
            <span>← BACK TO COURSES</span>
          </button>
          <span className="text-xs font-mono text-amber-400">SOCIETY EXPEDITIONS & CAMPAIGNS</span>
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-indigo-950/40 border border-amber-500/30 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-mono text-xs uppercase tracking-wider">
            <Calendar className="w-4 h-4 text-amber-400" />
            <span>Society Field Campaigns & Observation Events</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Astronomical Expeditions & Live Events
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xl">
            Participate in live telescope campaigns, meteor watches, and deep field briefings. Members earn exclusive verified society badges by registering and participating.
          </p>
        </div>

        <div className="bg-slate-950/90 border border-slate-800 p-4 rounded-2xl text-center shrink-0">
          <span className="text-[10px] font-mono text-slate-400 uppercase block">Attended Events</span>
          <strong className="text-2xl font-bold text-amber-400 font-mono">
            {userParticipations.length}
          </strong>
        </div>
      </div>

      {/* Success Notice */}
      {successEventNotice && (
        <div className="p-4 bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs rounded-2xl flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{successEventNotice}</span>
          </div>
          <button
            onClick={() => setSuccessEventNotice('')}
            className="text-emerald-400 hover:text-emerald-200 text-xs font-mono"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Events List */}
      <div className="space-y-6">
        {events.map((event) => {
          const isAttending = userParticipations.includes(event.id);

          return (
            <article
              key={event.id}
              className={`p-6 sm:p-7 rounded-3xl border transition flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-lg ${
                isAttending
                  ? 'bg-slate-900/90 border-amber-500/40 shadow-amber-950/20'
                  : 'bg-[#090d16] border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="space-y-3 flex-1">
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                  <span className="text-amber-400 bg-amber-950/60 px-2.5 py-1 rounded-lg border border-amber-800/40 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{event.date}</span>
                  </span>
                  <span className="text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{event.time}</span>
                  </span>
                  <span className="text-slate-500">·</span>
                  <span className="text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{event.location}</span>
                  </span>
                </div>

                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                    {event.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                    {event.description}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <div className="flex items-center gap-2 p-2 bg-slate-950 rounded-xl border border-slate-800/80 text-xs">
                    <span className="text-xl">{event.badgeIcon}</span>
                    <div>
                      <span className="text-[10px] text-slate-400 font-mono uppercase block">Earnable Badge</span>
                      <strong className="text-amber-300 text-xs font-medium">{event.badgeName}</strong>
                    </div>
                  </div>

                  {event.targetObject && onNavigateToSkyLabWithTarget && (
                    <button
                      onClick={() => onNavigateToSkyLabWithTarget(event.targetObject)}
                      className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-800 rounded-xl text-xs font-mono flex items-center gap-1.5 transition"
                    >
                      <Compass className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Inspect Target ({event.targetObject})</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div className="shrink-0 self-stretch md:self-auto flex flex-col items-center gap-2">
                {isAttending ? (
                  <div className="px-5 py-3 bg-emerald-950/70 border border-emerald-500/50 rounded-2xl text-center space-y-1">
                    <span className="text-xs font-bold text-emerald-300 flex items-center justify-center gap-1.5 font-mono">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>ATTENDING ✓</span>
                    </span>
                    <p className="text-[10px] text-emerald-400/80 font-mono">Badge Awarded to Profile</p>
                  </div>
                ) : (
                  <button
                    onClick={() => handleAttend(event)}
                    className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-amber-600 to-indigo-600 hover:from-amber-500 hover:to-indigo-500 text-white font-semibold text-xs rounded-2xl shadow-lg shadow-amber-950/50 transition flex items-center justify-center gap-2"
                  >
                    <span>RSVP & Claim Badge</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};

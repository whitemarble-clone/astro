import React, { useState } from 'react';
import { Calendar, Compass, Clock, Star, Moon, Sun, Sparkles, MapPin, Eye, ArrowLeft, ExternalLink, Bookmark, CheckCircle, ShieldAlert, ChevronRight } from 'lucide-react';

export interface AstroSpecialEvent {
  id: string;
  title: string;
  category: 'meteor_shower' | 'eclipse' | 'conjunction' | 'opposition' | 'equinox';
  dateStr: string;
  peakUtc: string;
  targetConstellation: string;
  visibilityRating: 'Exceptional' | 'High' | 'Moderate';
  description: string;
  equipment: string;
  bortleRecommendation: string;
  moonIllumination: string;
  stellariumTargetName: string;
  raDec: { ra: string; dec: string };
  badgeId?: string;
}

export const ASTRONOMY_SPECIAL_EVENTS: AstroSpecialEvent[] = [
  {
    id: 'evt_perseids_2026',
    title: 'Perseid Meteor Shower Peak',
    category: 'meteor_shower',
    dateStr: 'August 12 - 13, 2026',
    peakUtc: '02:00 - 04:30 UTC',
    targetConstellation: 'Perseus (Near Mirfak & Double Cluster)',
    visibilityRating: 'Exceptional',
    description: 'One of the most prolific annual meteor displays, producing up to 100 fast, luminous meteors per hour with persistent ionization trains from comet 109P/Swift-Tuttle.',
    equipment: 'Naked Eye or Wide-Angle Astrophotography Lens (14-24mm)',
    bortleRecommendation: 'Class 1 to 4 (Dark Rural Sky)',
    moonIllumination: '12% Waxing Crescent (Near-ideal dark sky conditions)',
    stellariumTargetName: 'Perseus',
    raDec: { ra: '03h 07m', dec: '+58° 00\'' },
    badgeId: 'badge_perseids_2026'
  },
  {
    id: 'evt_lunar_eclipse_2026',
    title: 'Total Lunar Eclipse (Blood Moon)',
    category: 'eclipse',
    dateStr: 'March 3, 2026',
    peakUtc: '11:34 UTC',
    targetConstellation: 'Leo (Near Regulus)',
    visibilityRating: 'Exceptional',
    description: 'Earth passes directly between the Sun and Moon. Rayleigh-scattered sunlight refracted through Earth\'s atmosphere casts a dramatic coppery-blood red coloration over the entire lunar disc.',
    equipment: 'Any Telescope, Binoculars (7x50), or DSLR Telephoto lens',
    bortleRecommendation: 'Class 1 to 8 (Visible even from urban skies)',
    moonIllumination: '100% Full Moon in Total Umbral Shadow',
    stellariumTargetName: 'Moon',
    raDec: { ra: '10h 58m', dec: '+07° 12\'' },
    badgeId: 'badge_eclipse_2026'
  },
  {
    id: 'evt_saturn_opposition_2026',
    title: 'Saturn at Opposition',
    category: 'opposition',
    dateStr: 'September 21, 2026',
    peakUtc: 'All Night (Meridian Transit 00:00 Local)',
    targetConstellation: 'Aquarius',
    visibilityRating: 'High',
    description: 'Saturn reaches its closest orbital approach to Earth. Its rings and atmospheric bands are illuminated at maximum brightness (Seeliger effect on ring ice particles).',
    equipment: '6-inch to 10-inch Dobsonian/SCT Telescope (150x - 250x Magnification)',
    bortleRecommendation: 'Class 1 to 7',
    moonIllumination: '68% Waxing Gibbous (Low interference with bright planets)',
    stellariumTargetName: 'Saturn',
    raDec: { ra: '23h 24m', dec: '-05° 40\'' }
  },
  {
    id: 'evt_jupiter_venus_2026',
    title: 'Great Venus-Jupiter Planetary Conjunction',
    category: 'conjunction',
    dateStr: 'November 15, 2026',
    peakUtc: 'Dusk (30 mins after sunset)',
    targetConstellation: 'Virgo (Low Western Horizon)',
    visibilityRating: 'High',
    description: 'The two brightest planets in the night sky appear separated by a mere 0.3 degrees, fitting effortlessly inside the same high-power telescopic field of view.',
    equipment: 'Binoculars or Small Refractor Telescope',
    bortleRecommendation: 'Class 1 to 8 (Superb high surface brightness)',
    moonIllumination: '4% Thin Crescent',
    stellariumTargetName: 'Jupiter',
    raDec: { ra: '13h 45m', dec: '-09° 15\'' }
  },
  {
    id: 'evt_geminids_2026',
    title: 'Geminid Meteor Shower Maximum',
    category: 'meteor_shower',
    dateStr: 'December 13 - 14, 2026',
    peakUtc: '21:00 - 03:00 UTC',
    targetConstellation: 'Gemini (Near Castor & Pollux)',
    visibilityRating: 'Exceptional',
    description: 'The king of meteor showers, originating from rocky asteroid 3200 Phaethon. Yields up to 120 slow, multi-hued fireballs per hour.',
    equipment: 'Reclining Lawn Chair, Thermal Cold Gear, Wide Eye Field',
    bortleRecommendation: 'Class 1 to 3 for best fireball count',
    moonIllumination: '22% Waxing Crescent (Moon sets early)',
    stellariumTargetName: 'Castor',
    raDec: { ra: '07h 34m', dec: '+31° 53\'' }
  },
  {
    id: 'evt_solar_eclipse_2026',
    title: 'Annular Solar Eclipse (Ring of Fire)',
    category: 'eclipse',
    dateStr: 'February 17, 2026',
    peakUtc: '12:12 UTC',
    targetConstellation: 'Aquarius',
    visibilityRating: 'High',
    description: 'The Moon is near apogee and does not completely cover the solar disc, leaving an incandescent annulus "ring of fire". Requires certified ISO 12312-2 solar filters at all times.',
    equipment: 'Certified ISO 12312-2 Solar Eclipse Glasses / Dedicated White Light Solar Filter',
    bortleRecommendation: 'Daytime (Solar Target)',
    moonIllumination: '0% New Moon',
    stellariumTargetName: 'Sun',
    raDec: { ra: '22h 02m', dec: '-12° 28\'' }
  }
];

interface AstroEventsCalendarProps {
  onBack: () => void;
  onLaunchStellariumWithTarget: (targetName: string, raDec?: { ra: string; dec: string }) => void;
  onOpenLogbookWithTarget?: (targetName: string) => void;
  userRSVPs?: string[];
  onToggleRSVP?: (eventId: string) => void;
}

export const AstroEventsCalendar: React.FC<AstroEventsCalendarProps> = ({
  onBack,
  onLaunchStellariumWithTarget,
  onOpenLogbookWithTarget,
  userRSVPs = [],
  onToggleRSVP
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeEvent, setActiveEvent] = useState<AstroSpecialEvent>(ASTRONOMY_SPECIAL_EVENTS[0]);

  const filteredEvents = selectedCategory === 'all'
    ? ASTRONOMY_SPECIAL_EVENTS
    : ASTRONOMY_SPECIAL_EVENTS.filter(e => e.category === selectedCategory);

  const getCategoryBadge = (cat: AstroSpecialEvent['category']) => {
    switch (cat) {
      case 'meteor_shower':
        return <span className="bg-amber-950/80 border border-amber-500/40 text-amber-300 text-[10px] font-mono px-2 py-0.5 rounded-full flex items-center gap-1"><Sparkles className="w-3 h-3" /> Meteor Shower</span>;
      case 'eclipse':
        return <span className="bg-red-950/80 border border-red-500/40 text-red-300 text-[10px] font-mono px-2 py-0.5 rounded-full flex items-center gap-1"><Moon className="w-3 h-3" /> Eclipse Event</span>;
      case 'opposition':
        return <span className="bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-[10px] font-mono px-2 py-0.5 rounded-full flex items-center gap-1"><Star className="w-3 h-3" /> Opposition</span>;
      case 'conjunction':
        return <span className="bg-purple-950/80 border border-purple-500/40 text-purple-300 text-[10px] font-mono px-2 py-0.5 rounded-full flex items-center gap-1"><Sun className="w-3 h-3" /> Conjunction</span>;
      default:
        return <span className="bg-slate-800 text-slate-300 text-[10px] font-mono px-2 py-0.5 rounded-full">Celestial</span>;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-200">
      
      {/* Top Friendly Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <button
          onClick={onBack}
          className="group inline-flex items-center gap-2 px-4 py-2 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-500 text-slate-200 hover:text-white rounded-xl text-xs font-semibold tracking-wide transition shadow-sm"
        >
          <ArrowLeft className="w-4 h-4 text-cyan-400 group-hover:-translate-x-1 transition-transform" />
          <span>← BACK TO COURSES</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onLaunchStellariumWithTarget(activeEvent.stellariumTargetName, activeEvent.raDec)}
            className="px-4 py-2 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-700/60 text-cyan-300 hover:text-white rounded-xl text-xs font-medium flex items-center gap-2 shadow-md transition"
          >
            <Compass className="w-4 h-4 text-cyan-400" />
            <span>Launch Stellarium Simulator</span>
            <ExternalLink className="w-3 h-3 ml-0.5" />
          </button>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0d1424] via-[#11192e] to-[#090d18] border border-cyan-500/30 p-6 md:p-8 shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 bg-cyan-950/80 border border-cyan-500/40 px-3 py-1 rounded-full text-xs font-mono text-cyan-300">
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            <span>OBSERVATORY ALMANAC · 2026-2027</span>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
            Astronomical Special Events Calendar
          </h2>

          <p className="text-sm text-slate-300 leading-relaxed">
            Curated observational windows for meteor showers, planetary conjunctions, lunar occultations, and solar eclipses. Synchronized with live sky coordinates and direct <strong className="text-cyan-300">Stellarium Web</strong> simulations.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800/80 pb-3">
        {[
          { id: 'all', label: 'All Special Events' },
          { id: 'meteor_shower', label: '🌠 Meteor Showers' },
          { id: 'eclipse', label: '🌑 Eclipses' },
          { id: 'opposition', label: '🪐 Planetary Oppositions' },
          { id: 'conjunction', label: '✨ Conjunctions' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedCategory(tab.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition ${
              selectedCategory === tab.id
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Grid: Events List & Active Spotlight Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Event Cards List */}
        <div className="lg:col-span-1 space-y-3 overflow-y-auto max-h-[720px] pr-1">
          {filteredEvents.map((event) => {
            const isSelected = activeEvent.id === event.id;
            const isRSVPed = userRSVPs.includes(event.id);

            return (
              <div
                key={event.id}
                onClick={() => setActiveEvent(event)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-b from-indigo-950/70 to-slate-900 border-cyan-500/80 shadow-lg shadow-cyan-900/20 ring-1 ring-cyan-500/50'
                    : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  {getCategoryBadge(event.category)}
                  <span className="text-[11px] font-mono text-cyan-400 font-semibold">{event.dateStr}</span>
                </div>

                <h4 className="text-sm font-bold text-white mb-1">{event.title}</h4>
                <p className="text-xs text-slate-400 line-clamp-2 mb-3">{event.description}</p>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/60 font-mono">
                  <span>Target: {event.stellariumTargetName}</span>
                  <div className="flex items-center gap-1 text-cyan-400 font-sans">
                    <span>Inspect</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Full Featured Spotlight & Stellarium Launcher */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#0b101d] border border-cyan-500/30 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
            
            {/* Background Accent glow */}
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

            {/* Spotlight Header */}
            <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  {getCategoryBadge(activeEvent.category)}
                  <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-full font-mono">
                    Peak: {activeEvent.peakUtc}
                  </span>
                </div>
                <h3 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                  {activeEvent.title}
                </h3>
                <p className="text-sm text-cyan-400 font-mono mt-1">
                  📅 Scheduled Date: {activeEvent.dateStr}
                </p>
              </div>

              {/* Action Buttons: Stellarium & RSVP */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => onLaunchStellariumWithTarget(activeEvent.stellariumTargetName, activeEvent.raDec)}
                  className="px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-cyan-600/30 transition transform hover:-translate-y-0.5"
                >
                  <Compass className="w-4 h-4" />
                  <span>Simulate in Stellarium Web</span>
                  <ExternalLink className="w-3 h-3" />
                </button>

                {onToggleRSVP && (
                  <button
                    onClick={() => onToggleRSVP(activeEvent.id)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition ${
                      userRSVPs.includes(activeEvent.id)
                        ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
                        : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>{userRSVPs.includes(activeEvent.id) ? 'RSVP Confirmed ✓' : 'Bookmark Observation'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl mb-6">
              <p className="text-sm text-slate-300 leading-relaxed">
                {activeEvent.description}
              </p>
            </div>

            {/* Observational Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono mb-6">
              
              <div className="p-4 bg-slate-950/80 border border-slate-800/80 rounded-2xl space-y-1">
                <span className="text-[10px] text-cyan-400 uppercase tracking-widest flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> Celestial Coordinates
                </span>
                <p className="text-white text-sm font-semibold">{activeEvent.targetConstellation}</p>
                <p className="text-slate-400 text-xs">
                  RA: {activeEvent.raDec.ra} · Dec: {activeEvent.raDec.dec}
                </p>
              </div>

              <div className="p-4 bg-slate-950/80 border border-slate-800/80 rounded-2xl space-y-1">
                <span className="text-[10px] text-indigo-400 uppercase tracking-widest flex items-center gap-1">
                  <Moon className="w-3 h-3" /> Lunar Phase & Illumination
                </span>
                <p className="text-white text-sm font-semibold">{activeEvent.moonIllumination}</p>
                <p className="text-slate-400 text-xs">Rating: {activeEvent.visibilityRating} Clarity</p>
              </div>

              <div className="p-4 bg-slate-950/80 border border-slate-800/80 rounded-2xl space-y-1">
                <span className="text-[10px] text-emerald-400 uppercase tracking-widest flex items-center gap-1">
                  <Eye className="w-3 h-3" /> Recommended Optics
                </span>
                <p className="text-white text-xs font-semibold">{activeEvent.equipment}</p>
                <p className="text-slate-400 text-[11px]">Best magnification field</p>
              </div>

              <div className="p-4 bg-slate-950/80 border border-slate-800/80 rounded-2xl space-y-1">
                <span className="text-[10px] text-amber-400 uppercase tracking-widest flex items-center gap-1">
                  <Star className="w-3 h-3" /> Sky Dark Quality (Bortle)
                </span>
                <p className="text-white text-xs font-semibold">{activeEvent.bortleRecommendation}</p>
                <p className="text-slate-400 text-[11px]">Recommended light pollution threshold</p>
              </div>
            </div>

            {/* Quick Action to Logbook */}
            {onOpenLogbookWithTarget && (
              <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                <span className="text-slate-400">
                  Ready to record telescopic observations for {activeEvent.title}?
                </span>
                <button
                  onClick={() => onOpenLogbookWithTarget(activeEvent.title)}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-xl transition flex items-center gap-1.5"
                >
                  <span>Open Target in Observational Logbook</span>
                  <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

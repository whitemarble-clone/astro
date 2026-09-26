import React, { useState, useEffect } from 'react';
import { Compass, ZoomIn, ZoomOut, Target, Eye, Info, Crosshair, Sparkles, ArrowLeft, ExternalLink } from 'lucide-react';

interface SkyTarget {
  id: string;
  name: string;
  catalogue: string;
  type: string;
  constellation: string;
  ra: string;
  dec: string;
  magnitude: number;
  description: string;
  x: number; // percentage on sky chart 0-100
  y: number; // percentage on sky chart 0-100
  color: string;
}

const CELESTIAL_TARGETS: SkyTarget[] = [
  {
    id: 'm42',
    name: 'Orion Nebula',
    catalogue: 'M42 / NGC 1976',
    type: 'Diffuse Emission / Reflection Nebula',
    constellation: 'Orion',
    ra: '05h 35m 17.3s',
    dec: '-05° 23′ 28″',
    magnitude: 4.0,
    description: 'Star-forming interstellar nursery containing the Trapezium cluster, located 1,344 light-years distant.',
    x: 48,
    y: 58,
    color: '#818cf8'
  },
  {
    id: 'm31',
    name: 'Andromeda Galaxy',
    catalogue: 'M31 / NGC 224',
    type: 'Barred Spiral Galaxy',
    constellation: 'Andromeda',
    ra: '00h 42m 44.3s',
    dec: '+41° 16′ 09″',
    magnitude: 3.44,
    description: 'The nearest major spiral galaxy to the Milky Way, located 2.5 million light-years away and containing 1 trillion stars.',
    x: 75,
    y: 28,
    color: '#38bdf8'
  },
  {
    id: 'm45',
    name: 'Pleiades Cluster',
    catalogue: 'M45 / Seven Sisters',
    type: 'Open Star Cluster',
    constellation: 'Taurus',
    ra: '03h 47m 24.0s',
    dec: '+24° 07′ 00″',
    magnitude: 1.6,
    description: 'Striking open cluster enveloped in luminous blue reflection nebulosity caused by dust scattering interstellar starlight.',
    x: 32,
    y: 38,
    color: '#60a5fa'
  },
  {
    id: 'polaris',
    name: 'Polaris (North Star)',
    catalogue: 'Alpha Ursae Minoris',
    type: 'Multiple Star System & Cepheid Variable',
    constellation: 'Ursa Minor',
    ra: '02h 31m 49.0s',
    dec: '+89° 15′ 51″',
    magnitude: 1.98,
    description: 'The celestial anchor of northern hemisphere astrophotography polar alignment, less than 1 degree from the North Celestial Pole.',
    x: 50,
    y: 12,
    color: '#fbbf24'
  },
  {
    id: 'saturn',
    name: 'Saturn & Ring System',
    catalogue: 'Sol-06',
    type: 'Gas Giant Planetary System',
    constellation: 'Aquarius',
    ra: '22h 15m 12.0s',
    dec: '-12° 45′ 00″',
    magnitude: 0.58,
    description: 'Ring system comprising thousands of ringlets composed mostly of water ice with a trace component of tholin impurities.',
    x: 85,
    y: 68,
    color: '#fde047'
  }
];

interface SkyObservationLabProps {
  initialTargetName?: string;
  onLogObservation?: (target: string) => void;
  onBackToCourses?: () => void;
  onLaunchStellarium?: (target: string) => void;
}

export const SkyObservationLab: React.FC<SkyObservationLabProps> = ({
  initialTargetName,
  onLogObservation,
  onBackToCourses,
  onLaunchStellarium,
}) => {
  const [selectedTarget, setSelectedTarget] = useState<SkyTarget>(CELESTIAL_TARGETS[0]);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [showConstellationLines, setShowConstellationLines] = useState<boolean>(true);

  // If redirected with a specific target from a course lesson
  useEffect(() => {
    if (initialTargetName) {
      const match = CELESTIAL_TARGETS.find((t) =>
        t.name.toLowerCase().includes(initialTargetName.toLowerCase()) ||
        initialTargetName.toLowerCase().includes(t.name.toLowerCase()) ||
        t.catalogue.toLowerCase().includes(initialTargetName.toLowerCase())
      );
      if (match) setSelectedTarget(match);
    }
  }, [initialTargetName]);

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Friendly Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        {onBackToCourses ? (
          <button
            onClick={onBackToCourses}
            className="group inline-flex items-center gap-2 px-4 py-2 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-500 text-slate-200 hover:text-white rounded-xl text-xs font-semibold tracking-wide transition shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 text-cyan-400 group-hover:-translate-x-1 transition-transform" />
            <span>← BACK TO COURSES</span>
          </button>
        ) : <div />}

        {onLaunchStellarium && (
          <button
            onClick={() => onLaunchStellarium(selectedTarget.name)}
            className="px-3.5 py-2 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-800/60 rounded-xl text-xs font-medium text-cyan-300 hover:text-white flex items-center gap-1.5 transition"
          >
            <Compass className="w-4 h-4 text-cyan-400" />
            <span>Open in Stellarium Planetarium</span>
            <ExternalLink className="w-3 h-3 ml-0.5" />
          </button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Compass className="w-6 h-6 text-cyan-400" />
            Interactive Celestial Sky & Target Lab
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            PRACTICAL TELESCOPE RETICLE & COORDINATE RESOLUTION SIMULATOR
          </p>
        </div>

        {/* Toolbar toggles */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition border ${
              showGrid
                ? 'bg-slate-800 text-cyan-300 border-cyan-500/40'
                : 'bg-slate-900 text-slate-400 border-slate-800'
            }`}
          >
            Coordinate Grid
          </button>
          <button
            onClick={() => setShowConstellationLines(!showConstellationLines)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition border ${
              showConstellationLines
                ? 'bg-slate-800 text-indigo-300 border-indigo-500/40'
                : 'bg-slate-900 text-slate-400 border-slate-800'
            }`}
          >
            Constellations
          </button>
        </div>
      </div>

      {/* Main Observatory HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Star Chart Canvas Viewport */}
        <div className="lg:col-span-2 bg-[#04060d] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative flex flex-col justify-between min-h-[460px]">
          {/* Top HUD Telemetry Ribbon */}
          <div className="p-3 bg-slate-950/80 backdrop-blur border-b border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400 z-10">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-white font-semibold">VIEWPORT: {selectedTarget.name}</span>
            </div>
            <div className="flex items-center gap-4">
              <span>FOV: {(180 / zoomLevel).toFixed(1)}°</span>
              <span className="text-cyan-400">RA: {selectedTarget.ra}</span>
              <span className="text-cyan-400">DEC: {selectedTarget.dec}</span>
            </div>
          </div>

          {/* Interactive Celestial Sky Canvas */}
          <div className="relative flex-1 overflow-hidden flex items-center justify-center p-6 cursor-crosshair">
            {/* Celestial Coordinate Grid Lines */}
            {showGrid && (
              <div className="absolute inset-0 pointer-events-none opacity-20">
                <div className="w-full h-full grid grid-cols-6 grid-rows-6 border border-cyan-500/30">
                  {Array.from({ length: 36 }).map((_, i) => (
                    <div key={i} className="border border-cyan-500/20" />
                  ))}
                </div>
              </div>
            )}

            {/* Constellation overlay lines */}
            {showConstellationLines && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-indigo-400/25 stroke-1">
                <line x1="48%" y1="58%" x2="50%" y2="70%" />
                <line x1="48%" y1="58%" x2="40%" y2="52%" />
                <line x1="75%" y1="28%" x2="80%" y2="20%" />
                <line x1="32%" y1="38%" x2="48%" y2="58%" />
              </svg>
            )}

            {/* Background Ambient Stars */}
            <div className="absolute inset-0 pointer-events-none">
              {[
                [10, 20, 1], [25, 45, 1.5], [40, 15, 1], [60, 30, 2], [70, 75, 1],
                [85, 15, 1.2], [15, 80, 1.5], [90, 85, 1], [55, 85, 1.8], [30, 65, 1.2],
                [20, 35, 1], [65, 50, 1], [80, 45, 1.5], [45, 25, 1.2], [52, 40, 2]
              ].map(([x, y, r], idx) => (
                <div
                  key={idx}
                  className="absolute rounded-full bg-white opacity-60"
                  style={{ left: `${x}%`, top: `${y}%`, width: `${r * 2}px`, height: `${r * 2}px` }}
                />
              ))}
            </div>

            {/* Clickable Target Markers */}
            {CELESTIAL_TARGETS.map((target) => {
              const isTargetSelected = target.id === selectedTarget.id;
              return (
                <button
                  key={target.id}
                  onClick={() => setSelectedTarget(target)}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 group transition"
                  style={{ left: `${target.x}%`, top: `${target.y}%` }}
                >
                  <div className="relative flex items-center justify-center">
                    {/* Pulsing ring when selected */}
                    {isTargetSelected && (
                      <span className="absolute w-12 h-12 rounded-full border-2 border-dashed border-cyan-400 animate-spin" />
                    )}
                    <span
                      className="w-4 h-4 rounded-full flex items-center justify-center shadow-lg transition-transform group-hover:scale-125"
                      style={{ backgroundColor: target.color }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    </span>

                    {/* Label */}
                    <span className="absolute left-5 text-[11px] font-mono whitespace-nowrap px-1.5 py-0.5 rounded bg-slate-900/90 text-white border border-slate-800 shadow">
                      {target.name}
                    </span>
                  </div>
                </button>
              );
            })}

            {/* Telescope Reticle Crosshair at Center */}
            <div className="absolute pointer-events-none w-32 h-32 border border-cyan-500/40 rounded-full flex items-center justify-center">
              <div className="w-16 h-16 border border-cyan-500/60 rounded-full" />
              <div className="absolute w-full h-px bg-cyan-500/40" />
              <div className="absolute h-full w-px bg-cyan-500/40" />
              <div className="w-2 h-2 rounded-full bg-cyan-400/80" />
            </div>
          </div>

          {/* Bottom Zoom & Instrument Controls */}
          <div className="p-3 bg-slate-950/80 backdrop-blur border-t border-slate-800 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-3">
              <span className="text-slate-400">OPTICAL ZOOM: {zoomLevel}x</span>
              <button
                onClick={() => setZoomLevel((z) => Math.max(1, z - 0.5))}
                className="p-1.5 bg-slate-900 hover:bg-slate-800 rounded border border-slate-800 text-slate-300"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoomLevel((z) => Math.min(5, z + 0.5))}
                className="p-1.5 bg-slate-900 hover:bg-slate-800 rounded border border-slate-800 text-slate-300"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="text-slate-400">
              CLICK ANY CELESTIAL TARGET TO ALIGN SENSOR
            </div>
          </div>
        </div>

        {/* Right: Target Ephemeris & Details */}
        <div className="bg-[#090d16] border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
                  CALIBRATED OBJECT METRICS
                </span>
                <h3 className="text-xl font-bold text-white mt-0.5">{selectedTarget.name}</h3>
                <p className="text-xs font-mono text-slate-400">{selectedTarget.catalogue}</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono bg-indigo-950 text-indigo-300 px-2 py-1 rounded border border-indigo-700/60">
                  Mag: {selectedTarget.magnitude.toFixed(1)}
                </span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 space-y-1.5 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-500">Constellation:</span>
                  <span className="text-slate-200 font-semibold">{selectedTarget.constellation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Classification:</span>
                  <span className="text-slate-200">{selectedTarget.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Right Ascension:</span>
                  <span className="text-cyan-400">{selectedTarget.ra}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Declination:</span>
                  <span className="text-cyan-400">{selectedTarget.dec}</span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                  Astronomical Profile
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                  {selectedTarget.description}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Log Action */}
          <div className="pt-4 border-t border-slate-800 space-y-2">
            <button
              onClick={() => {
                if (onLogObservation) {
                  onLogObservation(selectedTarget.name);
                } else {
                  alert(`Target ${selectedTarget.name} recorded to active night observing queue!`);
                }
              }}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-md shadow-indigo-950"
            >
              <Target className="w-4 h-4" />
              <span>Record Observation in Logbook</span>
            </button>
            <p className="text-[10px] text-center font-mono text-slate-500">
              Synchronizes with Society Member Database
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

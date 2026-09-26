import React, { useState } from 'react';
import { Compass, ExternalLink, X, Globe, Sparkles, Eye, Info, Check, ArrowRight } from 'lucide-react';

interface StellariumModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTarget?: string;
  initialCoordinates?: { ra: string; dec: string };
}

export const StellariumModal: React.FC<StellariumModalProps> = ({
  isOpen,
  onClose,
  initialTarget,
  initialCoordinates
}) => {
  const [embedMode, setEmbedMode] = useState<boolean>(false);
  const stellariumBaseUrl = 'https://stellarium-web.org/';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-[#0b101d] border border-cyan-500/40 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-b border-cyan-500/30 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-600/30 border border-cyan-500/50 flex items-center justify-center text-cyan-300 shadow-md">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-wide">Stellarium Web Planetarium</h3>
                <span className="text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-500/40 px-2 py-0.5 rounded-full font-mono">
                  Official Simulator Link
                </span>
              </div>
              <p className="text-xs text-slate-400">Interactive 3D real-time sky observation & celestial coordinate tracking</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={stellariumBaseUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-cyan-600/20 transition"
            >
              <span>Launch Fullscreen App</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Target Coordinates Banner if provided */}
          {(initialTarget || initialCoordinates) && (
            <div className="bg-indigo-950/40 border border-indigo-500/30 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-mono text-cyan-400 uppercase tracking-widest">Active Curriculum Target</p>
                <h4 className="text-lg font-bold text-white mt-0.5">{initialTarget || 'Deep Sky Target'}</h4>
                {initialCoordinates && (
                  <p className="text-xs text-slate-300 font-mono mt-1">
                    Coordinates: RA {initialCoordinates.ra} · Dec {initialCoordinates.dec}
                  </p>
                )}
              </div>
              <a
                href={stellariumBaseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white rounded-xl text-xs font-medium flex items-center justify-center gap-2 shadow-lg transition"
              >
                <span>Search in Stellarium</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

          {/* Quick Guide & Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-cyan-400 font-semibold">
                <Globe className="w-4 h-4" />
                <span>Real-Time Coordinates</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Stellarium calculates the exact real-time Altitude, Azimuth, Right Ascension, and Declination matching your geographical latitude and longitude.
              </p>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-indigo-400 font-semibold">
                <Sparkles className="w-4 h-4" />
                <span>Messier & Deep Sky</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Simulate nebulae, star clusters, galaxies, and planetary rings as seen through various telescope optical eyepieces and camera sensor frames.
              </p>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <Eye className="w-4 h-4" />
                <span>Light Pollution & Bortle</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Toggle atmospheric light pollution levels to preview what you will realistically see tonight from your backyard versus a dark-sky preserve.
              </p>
            </div>
          </div>

          {/* Embedded Web Preview Option */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 text-center space-y-4">
            <div className="max-w-md mx-auto space-y-2">
              <h4 className="text-sm font-semibold text-white">Stellarium Web Integration</h4>
              <p className="text-xs text-slate-400">
                Stellarium runs as a high-performance WebGL application directly in your browser. You can launch it in a dedicated tab for the best multi-monitor astrophotography experience.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href={stellariumBaseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white rounded-xl text-sm font-semibold flex items-center gap-2 shadow-lg shadow-cyan-600/30 transition transform hover:-translate-y-0.5"
              >
                <Compass className="w-4 h-4" />
                <span>Open Stellarium Web in New Tab</span>
                <ExternalLink className="w-4 h-4 ml-1" />
              </a>

              <button
                onClick={() => setEmbedMode(!embedMode)}
                className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium transition"
              >
                {embedMode ? 'Hide Embedded Frame' : 'Load Embedded Preview Here'}
              </button>
            </div>

            {embedMode && (
              <div className="mt-4 rounded-2xl overflow-hidden border border-slate-800 h-96 w-full relative bg-black">
                <iframe
                  src={stellariumBaseUrl}
                  title="Stellarium Web"
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                />
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-950 px-6 py-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Stellarium is an open-source planetarium tool widely used in amateur & professional astronomy.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

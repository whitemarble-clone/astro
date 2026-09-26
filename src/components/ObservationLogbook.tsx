import React, { useState } from 'react';
import { ClipboardList, Plus, CheckCircle2, ShieldCheck, Eye, Calendar, Telescope, FileText, ArrowLeft } from 'lucide-react';
import { ObservationEntry } from '../types/astronomy';

interface ObservationLogbookProps {
  logs: ObservationEntry[];
  onAddLog: (newEntry: Omit<ObservationEntry, 'id' | 'verified'>) => void;
  defaultTarget?: string;
  onBackToCourses?: () => void;
}

export const ObservationLogbook: React.FC<ObservationLogbookProps> = ({
  logs,
  onAddLog,
  defaultTarget = '',
  onBackToCourses,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [target, setTarget] = useState(defaultTarget || 'Messier 42 (Orion Nebula)');
  const [catalogueId, setCatalogueId] = useState('NGC 1976');
  const [magnitude, setMagnitude] = useState('4.0');
  const [equipment, setEquipment] = useState('8" Schmidt-Cassegrain (f/10)');
  const [skyCondition, setSkyCondition] = useState<ObservationEntry['skyCondition']>('Rural (Bortle 3-4)');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!target.trim()) return;

    onAddLog({
      timestamp: `${new Date().toISOString().slice(0, 10)} ${new Date().toISOString().slice(11, 16)} UTC`,
      target: target.trim(),
      catalogueId: catalogueId.trim() || 'ASTR-OBJ',
      magnitude: parseFloat(magnitude) || 4.0,
      equipment: equipment.trim() || 'Direct Optical Observation',
      skyCondition,
      notes: notes.trim() || 'Visual observation verified under clear sky conditions.'
    });

    setIsAdding(false);
    setNotes('');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in">
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
          <span className="text-xs font-mono text-cyan-400">RESEARCH OBSERVING LOGBOOK</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <ClipboardList className="w-7 h-7 text-cyan-400" />
            Society Observational Logbook
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Empirical observing records logged by society fellows to satisfy certificate requirements.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition shadow-md shadow-indigo-950"
        >
          <Plus className="w-4 h-4" />
          <span>{isAdding ? 'Close Form' : 'Log New Observation'}</span>
        </button>
      </div>

      {/* Add Observation Form */}
      {isAdding && (
        <form
          onSubmit={handleSubmit}
          className="bg-[#090d16] border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl animate-fadeIn"
        >
          <h3 className="text-sm font-semibold text-white">Record Practical Observation</h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Target Object</label>
              <input
                type="text"
                required
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Catalogue ID</label>
              <input
                type="text"
                value={catalogueId}
                onChange={(e) => setCatalogueId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-cyan-300"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Apparent Magnitude</label>
              <input
                type="number"
                step="0.1"
                value={magnitude}
                onChange={(e) => setMagnitude(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Optical Equipment & Sensor</label>
              <input
                type="text"
                value={equipment}
                onChange={(e) => setEquipment(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Sky Quality (Bortle Scale)</label>
              <select
                value={skyCondition}
                onChange={(e) => setSkyCondition(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              >
                <option value="Pristine (Bortle 1-2)">Pristine (Bortle 1-2)</option>
                <option value="Rural (Bortle 3-4)">Rural (Bortle 3-4)</option>
                <option value="Suburban (Bortle 5-6)">Suburban (Bortle 5-6)</option>
                <option value="Urban (Bortle 7-8)">Urban (Bortle 7-8)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Visual Notes & Seeing Conditions</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Detail seeing stability, eyepiece magnification, filter used, resolved structures..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-2 bg-slate-900 text-slate-400 hover:text-white rounded-xl text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold"
            >
              Save Observation Record
            </button>
          </div>
        </form>
      )}

      {/* Observation Log Table */}
      <div className="bg-[#090d16] border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-mono text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Log ID & Date</th>
                <th className="py-3.5 px-4">Target & Catalogue</th>
                <th className="py-3.5 px-4">Magnitude</th>
                <th className="py-3.5 px-4">Equipment & Sky Quality</th>
                <th className="py-3.5 px-4">Observational Notes</th>
                <th className="py-3.5 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-900/40 transition">
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="font-mono text-cyan-400 font-medium">{log.id}</div>
                    <div className="text-[11px] text-slate-500 font-mono mt-0.5">{log.timestamp}</div>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="font-semibold text-white">{log.target}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{log.catalogueId}</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono tabular-nums text-slate-300">
                    +{log.magnitude.toFixed(1)}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="text-slate-300 font-medium">{log.equipment}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{log.skyCondition}</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 text-xs max-w-xs leading-relaxed">
                    {log.notes}
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 font-mono text-[11px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                      <ShieldCheck className="w-3 h-3" />
                      Verified
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

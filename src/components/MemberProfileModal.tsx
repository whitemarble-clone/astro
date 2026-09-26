import React, { useState, useRef } from 'react';
import { 
  User as UserIcon, 
  Upload, 
  Award, 
  ShieldCheck, 
  Check, 
  X, 
  Sparkles, 
  Star, 
  Calendar, 
  Camera, 
  CheckCircle2, 
  Lock,
  ChevronRight
} from 'lucide-react';
import { User, Badge } from '../types/astronomy';
import { ALL_BADGES } from '../data/initialCourses';
import { fileToDataUrl } from '../utils/mediaStorage';

interface MemberProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onUpdateUser: (updated: Partial<User>) => void;
}

export const MemberProfileModal: React.FC<MemberProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateUser,
}) => {
  const [name, setName] = useState(currentUser.name);
  const [memberId, setMemberId] = useState(currentUser.memberId);
  const [callsign, setCallsign] = useState(currentUser.callsign || 'ASTRO-EXPLORER');
  const [bio, setBio] = useState(currentUser.bio || 'Backyard astronomer and astrophotographer focused on deep sky emission nebulae and planetary alignment.');
  const [photoUrl, setPhotoUrl] = useState<string>(currentUser.photoUrl || '');
  const [avatar, setAvatar] = useState(currentUser.avatar);
  const [successNotice, setSuccessNotice] = useState('');

  const photoInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const presetAvatars = ['🌌', '🔭', '🪐', '☄️', '🚀', '🌟', '🌕', '🛰️', '👨‍🚀', '👩‍🚀'];

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const dataUrl = await fileToDataUrl(file);
      setPhotoUrl(dataUrl);
      setSuccessNotice('Profile photo loaded! Click Save to apply.');
      setTimeout(() => setSuccessNotice(''), 4000);
    } catch (err) {
      console.error('Failed to load profile photo:', err);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      name: name.trim(),
      memberId: memberId.trim(),
      callsign: callsign.trim(),
      bio: bio.trim(),
      photoUrl,
      avatar,
    });
    setSuccessNotice('Profile & credentials updated successfully!');
    setTimeout(() => {
      setSuccessNotice('');
      onClose();
    }, 1000);
  };

  // Badges status
  const userBadges = currentUser.badges || [];
  const earnedBadgesList = ALL_BADGES.filter((b) => userBadges.includes(b.id));
  const lockedBadgesList = ALL_BADGES.filter((b) => !userBadges.includes(b.id));

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0b0f19] border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-full bg-slate-900 border border-slate-800 transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-950 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <UserIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Member Profile & Earned Badges</h2>
            <p className="text-xs text-slate-400">
              Personalize your profile picture, credentials, and review unlocked society honors.
            </p>
          </div>
        </div>

        {successNotice && (
          <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successNotice}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Profile Picture Uploader */}
          <div className="p-5 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-4">
            <label className="block text-xs font-mono text-cyan-400 uppercase tracking-wider">
              Profile Picture / Avatar Photo
            </label>

            <div className="flex flex-col sm:flex-row items-center gap-5">
              {/* Picture Display */}
              <div className="relative group shrink-0">
                <div className="w-24 h-24 rounded-2xl bg-slate-900 border-2 border-indigo-500/60 overflow-hidden flex items-center justify-center shadow-xl">
                  {photoUrl ? (
                    <img src={photoUrl} alt="Member profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl">{avatar}</span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => photoInputRef.current?.click()}
                  className="absolute bottom-1 right-1 p-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-md transition"
                  title="Upload profile picture"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Upload Action & Preset Avatars */}
              <div className="space-y-3 flex-1 text-center sm:text-left">
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => photoInputRef.current?.click()}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-white rounded-xl border border-slate-700 flex items-center gap-1.5 transition"
                  >
                    <Upload className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Upload Custom Photo</span>
                  </button>

                  {photoUrl && (
                    <button
                      type="button"
                      onClick={() => setPhotoUrl('')}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-xs text-rose-300 rounded-xl border border-slate-800 transition"
                    >
                      Remove Photo
                    </button>
                  )}
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] text-slate-400">Or choose a space emoji avatar:</span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {presetAvatars.map((em) => (
                      <button
                        key={em}
                        type="button"
                        onClick={() => {
                          setAvatar(em);
                          setPhotoUrl('');
                        }}
                        className={`w-7 h-7 rounded-lg text-sm flex items-center justify-center transition ${
                          avatar === em && !photoUrl
                            ? 'bg-indigo-600 scale-110 shadow-sm'
                            : 'bg-slate-900 hover:bg-slate-800'
                        }`}
                      >
                        {em}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Member Credentials Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Full Member Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Membership ID</label>
              <input
                type="text"
                required
                value={memberId}
                onChange={(e) => setMemberId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Observatory Callsign</label>
              <input
                type="text"
                value={callsign}
                onChange={(e) => setCallsign(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Fellowship Tier</label>
              <input
                type="text"
                disabled
                value={currentUser.tier}
                className="w-full bg-slate-900/60 border border-slate-800 text-slate-400 rounded-xl px-3.5 py-2 text-xs font-medium cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">Observational Focus & Bio</label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          {/* EARNED BADGES SECTION */}
          <div className="pt-4 border-t border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  Earned Society Badges ({earnedBadgesList.length}/{ALL_BADGES.length})
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Earned through course completions, 100% quiz scores, and participating in live events.
                </p>
              </div>
            </div>

            {/* Unlocked Badges Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {earnedBadgesList.map((badge) => (
                <div
                  key={badge.id}
                  className="p-3 bg-gradient-to-r from-amber-950/20 via-slate-900 to-indigo-950/20 border border-amber-500/40 rounded-xl flex items-start gap-3 shadow-md"
                >
                  <span className="text-2xl p-1.5 bg-black/40 rounded-lg border border-amber-500/30">
                    {badge.icon}
                  </span>
                  <div className="overflow-hidden flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-200">{badge.name}</span>
                      <span className="text-[9px] font-mono text-amber-400 bg-amber-950/80 px-1.5 py-0.2 rounded border border-amber-800/40">
                        {badge.rarity || 'Unlocked'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{badge.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Locked Badges */}
            {lockedBadgesList.length > 0 && (
              <div className="space-y-2 pt-2">
                <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">
                  Available to Unlock ({lockedBadgesList.length}):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {lockedBadgesList.map((badge) => (
                    <div
                      key={badge.id}
                      className="p-2.5 bg-slate-950/50 border border-slate-800/80 rounded-xl flex items-center gap-2.5 opacity-60 hover:opacity-100 transition"
                    >
                      <span className="text-lg grayscale">{badge.icon}</span>
                      <div className="overflow-hidden flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] font-medium text-slate-300">{badge.name}</span>
                          <Lock className="w-2.5 h-2.5 text-slate-500" />
                        </div>
                        <p className="text-[10px] text-slate-500 truncate">{badge.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-950 transition flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save Profile Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

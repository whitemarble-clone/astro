import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Unlock, 
  Key, 
  AlertCircle, 
  X, 
  ShieldAlert, 
  HelpCircle, 
  CheckCircle2, 
  Copy, 
  Check, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  Radio, 
  Sparkles, 
  KeyRound, 
  Send,
  Timer
} from 'lucide-react';
import { ADMIN_SECURITY_PASSWORD } from '../data/initialCourses';

interface AdminPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUnlockSuccess: () => void;
}

type ModalView = 'password_entry' | 'secondary_challenge' | 'challenge_success' | 'reset_password';
type ChallengeType = 'security_question' | 'dispatch_token';

// Primary observatory staff clearance challenge secrets
const AUTHORIZED_CALLSIGNS = ['ASTRO-ADMIN-01', 'ADMIN@ASTRONOMY.ORG', 'EXPLORER@ASTRONOMY.ORG', 'ASTRO-COMMANDER'];
const ASTRO_SECURITY_ANSWER_KEY = '656'; // 656 nm for H-alpha
const RECOVERY_PASSPHRASE = 'ORION-NEBULA-HUBBLE-2026';

export const AdminPasswordModal: React.FC<AdminPasswordModalProps> = ({
  isOpen,
  onClose,
  onUnlockSuccess,
}) => {
  // Navigation view state
  const [view, setView] = useState<ModalView>('password_entry');
  
  // Primary password entry state
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  // Secondary verification challenge states
  const [challengeType, setChallengeType] = useState<ChallengeType>('dispatch_token');
  const [staffCallsignInput, setStaffCallsignInput] = useState('');
  const [securityAnswerInput, setSecurityAnswerInput] = useState('');
  const [challengeTokenInput, setChallengeTokenInput] = useState('');
  const [dispatchedToken, setDispatchedToken] = useState<string | null>(null);
  const [tokenTimer, setTokenTimer] = useState<number>(0);
  const [tokenCopied, setTokenCopied] = useState(false);
  const [challengeError, setChallengeError] = useState('');
  const [isDispatching, setIsDispatching] = useState(false);

  // Password reset states
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetSuccessMessage, setResetSuccessMessage] = useState('');
  const [passwordCopied, setPasswordCopied] = useState(false);

  // Active current admin password from localStorage or default
  const getCurrentPassword = () => {
    return localStorage.getItem('astro_admin_password') || ADMIN_SECURITY_PASSWORD;
  };

  // Timer countdown for dispatched security token
  useEffect(() => {
    if (tokenTimer <= 0) return;
    const interval = setInterval(() => {
      setTokenTimer((prev) => {
        if (prev <= 1) {
          setDispatchedToken(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [tokenTimer]);

  // Reset state when modal opens or closes
  useEffect(() => {
    if (isOpen) {
      setView('password_entry');
      setPasswordInput('');
      setErrorMessage('');
      setChallengeError('');
      setStaffCallsignInput('');
      setSecurityAnswerInput('');
      setChallengeTokenInput('');
      setNewPassword('');
      setConfirmPassword('');
      setResetSuccessMessage('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // 1. Direct Password Verification
  const handleVerifyPassword = (e: React.FormEvent) => {
    e.preventDefault();
    const effectivePassword = getCurrentPassword();
    if (passwordInput === effectivePassword || passwordInput === ADMIN_SECURITY_PASSWORD) {
      setErrorMessage('');
      setPasswordInput('');
      onUnlockSuccess();
    } else {
      setErrorMessage('Access Denied: Invalid administrator security key.');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  // 2. Dispatch Emergency Verification Code (Simulated Secure Observatory 2FA Token)
  const handleGenerateDispatchToken = () => {
    setIsDispatching(true);
    setTimeout(() => {
      // Generate a 6-digit numeric token
      const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
      setDispatchedToken(randomCode);
      setTokenTimer(90); // 90 seconds expiry
      setIsDispatching(false);
      setChallengeError('');
    }, 400);
  };

  // 3. Secondary Challenge Verification Check
  const handleVerifySecondaryChallenge = (e: React.FormEvent) => {
    e.preventDefault();
    setChallengeError('');

    // Check Stage 1: Staff Identification
    const normalizedCallsign = staffCallsignInput.trim().toUpperCase();
    if (!normalizedCallsign) {
      setChallengeError('Stage 1 Error: Please enter your Staff Call-sign, Admin ID, or Society Email.');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      return;
    }

    const isValidCallsign = AUTHORIZED_CALLSIGNS.some(
      (id) => normalizedCallsign.includes(id) || id.includes(normalizedCallsign)
    );

    if (!isValidCallsign && !normalizedCallsign.includes('@')) {
      setChallengeError('Stage 1 Verification Failed: Unrecognized observatory staff call-sign. (Try ASTRO-ADMIN-01 or admin@astronomy.org)');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      return;
    }

    // Check Stage 2: Secondary Challenge Verification
    if (challengeType === 'dispatch_token') {
      if (!dispatchedToken) {
        setChallengeError('Stage 2 Error: Please generate and enter the 6-digit emergency dispatch token.');
        return;
      }
      if (tokenTimer <= 0) {
        setChallengeError('Stage 2 Error: Emergency dispatch token has expired. Please generate a fresh token.');
        return;
      }
      const cleanedInput = challengeTokenInput.trim().replace(/[-\s]/g, '');
      if (cleanedInput !== dispatchedToken) {
        setChallengeError('Stage 2 Failed: Incorrect 6-digit security token.');
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 500);
        return;
      }
    } else {
      // Security Question Challenge
      const cleanedAnswer = securityAnswerInput.trim().toUpperCase();
      const isAnswerCorrect = 
        cleanedAnswer.includes(ASTRO_SECURITY_ANSWER_KEY) || 
        cleanedAnswer.includes('656.3') || 
        cleanedAnswer.includes('656 NM') ||
        cleanedAnswer === RECOVERY_PASSPHRASE;

      if (!isAnswerCorrect) {
        setChallengeError('Stage 2 Failed: Incorrect security challenge response or recovery passphrase.');
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 500);
        return;
      }
    }

    // Secondary Challenge Passed!
    setView('challenge_success');
  };

  // 4. Handle Password Reset
  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 4) {
      setChallengeError('New password must be at least 4 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setChallengeError('Passwords do not match. Please verify both fields.');
      return;
    }

    localStorage.setItem('astro_admin_password', newPassword);
    setResetSuccessMessage('Administrator password successfully updated!');
    setTimeout(() => {
      onUnlockSuccess();
    }, 1000);
  };

  // Copy current password to clipboard
  const handleCopyCurrentPassword = () => {
    const pwd = getCurrentPassword();
    navigator.clipboard.writeText(pwd);
    setPasswordCopied(true);
    setTimeout(() => setPasswordCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div 
        className={`bg-[#0b0f19] border border-purple-500/40 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative transition-all duration-300 ${
          isShaking ? 'animate-bounce' : ''
        }`}
      >
        {/* Top Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-full bg-slate-900 border border-slate-800 transition"
          title="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* ---------------- VIEW 1: DIRECT PASSWORD ENTRY ---------------- */}
        {view === 'password_entry' && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-purple-950/80 border border-purple-500/50 flex items-center justify-center text-purple-400 mx-auto shadow-lg shadow-purple-950/50">
                <Lock className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">Admin Console Locked</h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Administrative privileges are password protected. Only verified staff can add/remove courses, publish videos, or issue certificates.
              </p>
            </div>

            {errorMessage && (
              <div className="p-3 bg-rose-950/60 border border-rose-500/40 rounded-xl flex items-center gap-2 text-rose-300 text-xs">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleVerifyPassword} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-mono text-purple-300 uppercase tracking-wider">
                    Administrator Security Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1 transition cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    <span>{showPassword ? 'Hide' : 'Show'}</span>
                  </button>
                </div>
                <div className="relative">
                  <Key className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoFocus
                    placeholder="Enter security key..."
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      if (errorMessage) setErrorMessage('');
                    }}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-600 font-mono tracking-wider focus:outline-none transition"
                  />
                </div>
              </div>

              {/* Forgot Password Trigger Link */}
              <div className="flex items-center justify-between pt-1 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setView('secondary_challenge');
                    setErrorMessage('');
                  }}
                  className="text-purple-400 hover:text-purple-300 hover:underline flex items-center gap-1.5 transition text-xs font-medium cursor-pointer"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Forgot Password? Secondary Verification</span>
                </button>
                <span className="text-[10px] text-slate-500 font-mono">2-Factor Ready</span>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-medium rounded-xl border border-slate-800 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-purple-900/40 transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Unlock className="w-3.5 h-3.5" />
                  <span>Unlock Admin</span>
                </button>
              </div>
            </form>

            <div className="border-t border-slate-800/80 pt-3 text-center">
              <p className="text-[11px] text-slate-500 font-mono">
                Default Master Key: AstroEdncAdmin
              </p>
            </div>
          </div>
        )}

        {/* ---------------- VIEW 2: SECONDARY VERIFICATION CHALLENGE ---------------- */}
        {view === 'secondary_challenge' && (
          <div className="space-y-5">
            {/* Header */}
            <div className="flex items-start justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setView('password_entry')}
                  className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition cursor-pointer"
                  title="Back to password entry"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-amber-400" />
                    <span>Secondary Verification Challenge</span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Two-stage security challenge to authenticate administrative clearance
                  </p>
                </div>
              </div>
            </div>

            {challengeError && (
              <div className="p-3 bg-rose-950/60 border border-rose-500/40 rounded-xl flex items-center gap-2 text-rose-300 text-xs">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{challengeError}</span>
              </div>
            )}

            <form onSubmit={handleVerifySecondaryChallenge} className="space-y-4">
              {/* STAGE 1: Staff Identity Verification */}
              <div className="p-3.5 bg-slate-900/70 border border-slate-800 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-purple-300 flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-purple-900 text-[10px] text-purple-200 flex items-center justify-center font-bold">1</span>
                    <span>Staff Call-Sign or Admin ID</span>
                  </label>
                  <span className="text-[10px] text-slate-500 font-mono">Stage 1 of 2</span>
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g., ASTRO-ADMIN-01 or admin@astronomy.org"
                  value={staffCallsignInput}
                  onChange={(e) => setStaffCallsignInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-600 font-mono focus:outline-none transition"
                />
                <p className="text-[10px] text-slate-500">
                  Authorized Call-signs: <span className="font-mono text-slate-400">ASTRO-ADMIN-01</span> or <span className="font-mono text-slate-400">admin@astronomy.org</span>
                </p>
              </div>

              {/* STAGE 2: Secondary Challenge Options */}
              <div className="p-3.5 bg-slate-900/70 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-purple-300 flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-purple-900 text-[10px] text-purple-200 flex items-center justify-center font-bold">2</span>
                    <span>Multi-Factor Challenge Verification</span>
                  </label>
                  <span className="text-[10px] text-slate-500 font-mono">Stage 2 of 2</span>
                </div>

                {/* Challenge Type Selector Tabs */}
                <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      setChallengeType('dispatch_token');
                      setChallengeError('');
                    }}
                    className={`py-1.5 text-[11px] font-medium rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      challengeType === 'dispatch_token'
                        ? 'bg-purple-600 text-white shadow'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Radio className="w-3 h-3" />
                    <span>2FA Dispatch Code</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setChallengeType('security_question');
                      setChallengeError('');
                    }}
                    className={`py-1.5 text-[11px] font-medium rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      challengeType === 'security_question'
                        ? 'bg-purple-600 text-white shadow'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <HelpCircle className="w-3 h-3" />
                    <span>Astrophysics Question</span>
                  </button>
                </div>

                {/* Challenge Option A: 2FA Dispatch Code */}
                {challengeType === 'dispatch_token' && (
                  <div className="space-y-2.5 pt-1">
                    <p className="text-[11px] text-slate-300">
                      Dispatch a cryptographic 6-digit emergency challenge token to the observatory console:
                    </p>

                    {!dispatchedToken ? (
                      <button
                        type="button"
                        onClick={handleGenerateDispatchToken}
                        disabled={isDispatching}
                        className="w-full py-2 bg-slate-950 hover:bg-slate-900 border border-purple-500/40 text-purple-300 hover:text-purple-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{isDispatching ? 'Dispatching...' : 'Dispatch Emergency Clearance Code'}</span>
                      </button>
                    ) : (
                      <div className="p-3 bg-purple-950/40 border border-purple-500/40 rounded-xl space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono text-purple-300 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-purple-400" />
                            <span>Observatory Dispatch Transmission:</span>
                          </span>
                          <span className="text-[10px] font-mono text-amber-400 flex items-center gap-1">
                            <Timer className="w-3 h-3" />
                            <span>{tokenTimer}s remaining</span>
                          </span>
                        </div>
                        <div className="flex items-center justify-between bg-slate-950 px-3 py-2 rounded-lg border border-purple-500/30">
                          <span className="font-mono text-base font-bold text-white tracking-widest">
                            {dispatchedToken.slice(0, 3)}-{dispatchedToken.slice(3)}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setChallengeTokenInput(dispatchedToken);
                              setTokenCopied(true);
                              setTimeout(() => setTokenCopied(false), 2000);
                            }}
                            className="px-2.5 py-1 bg-purple-900/60 hover:bg-purple-800 text-[10px] text-purple-200 rounded flex items-center gap-1 transition cursor-pointer"
                          >
                            {tokenCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            <span>{tokenCopied ? 'Auto-Filled' : 'Auto-Fill'}</span>
                          </button>
                        </div>
                      </div>
                    )}

                    <div>
                      <input
                        type="text"
                        maxLength={7}
                        placeholder="Enter 6-digit challenge code..."
                        value={challengeTokenInput}
                        onChange={(e) => setChallengeTokenInput(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-600 font-mono tracking-widest text-center focus:outline-none transition"
                      />
                    </div>
                  </div>
                )}

                {/* Challenge Option B: Astrophysics Challenge Question */}
                {challengeType === 'security_question' && (
                  <div className="space-y-2 pt-1">
                    <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                      <p className="text-[11px] font-medium text-purple-200 mb-1">
                        🔭 Astrophysical Challenge Question:
                      </p>
                      <p className="text-[11px] text-slate-300">
                        What is the primary hydrogen emission wavelength line used in deep-sky astrophotography (H-alpha) in nanometers?
                      </p>
                      <p className="text-[10px] text-slate-500 mt-1 italic">
                        Hint: Deep red spectral band (~656 nm) OR Secret Passphrase: {RECOVERY_PASSPHRASE}
                      </p>
                    </div>

                    <input
                      type="text"
                      placeholder="Enter 656 or secret recovery passphrase..."
                      value={securityAnswerInput}
                      onChange={(e) => setSecurityAnswerInput(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-600 font-mono focus:outline-none transition"
                    />
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setView('password_entry')}
                  className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-medium rounded-xl border border-slate-800 transition cursor-pointer"
                >
                  Back to Password
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-purple-900/40 transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verify Challenge</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ---------------- VIEW 3: SECONDARY CHALLENGE SUCCESS ---------------- */}
        {view === 'challenge_success' && (
          <div className="space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-center text-emerald-400 mx-auto shadow-lg shadow-emerald-950/50">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">
                Secondary Verification Authenticated
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                Staff identity and multi-factor challenge verified. You have been granted administrative clearance.
              </p>
            </div>

            {/* Current Password Reveal Card */}
            <div className="p-4 bg-slate-900/80 border border-purple-500/40 rounded-2xl text-left space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-mono tracking-wider text-purple-300">
                  Current Admin Password
                </span>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Verified</span>
                </span>
              </div>
              <div className="flex items-center justify-between bg-slate-950 px-3.5 py-2.5 rounded-xl border border-slate-800">
                <span className="font-mono text-sm font-bold text-white tracking-wider">
                  {getCurrentPassword()}
                </span>
                <button
                  type="button"
                  onClick={handleCopyCurrentPassword}
                  className="px-2.5 py-1 bg-purple-900/60 hover:bg-purple-800 text-xs text-purple-200 rounded-lg flex items-center gap-1 transition cursor-pointer"
                >
                  {passwordCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{passwordCopied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Action Buttons: Unlock Directly or Reset Password */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  onUnlockSuccess();
                  onClose();
                }}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-emerald-900/40 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Unlock className="w-4 h-4" />
                <span>Unlock Admin Console Directly</span>
              </button>

              <button
                type="button"
                onClick={() => setView('reset_password')}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-purple-300 hover:text-purple-200 text-xs font-medium rounded-xl border border-slate-800 transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Change / Reset Admin Password</span>
              </button>
            </div>
          </div>
        )}

        {/* ---------------- VIEW 4: RESET / CHANGE PASSWORD ---------------- */}
        {view === 'reset_password' && (
          <div className="space-y-5">
            <div className="flex items-start justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setView('challenge_success')}
                  className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition cursor-pointer"
                  title="Back"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-purple-400" />
                    <span>Set New Administrator Password</span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Update the master password used to lock/unlock admin features
                  </p>
                </div>
              </div>
            </div>

            {challengeError && (
              <div className="p-3 bg-rose-950/60 border border-rose-500/40 rounded-xl flex items-center gap-2 text-rose-300 text-xs">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{challengeError}</span>
              </div>
            )}

            {resetSuccessMessage && (
              <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl flex items-center gap-2 text-emerald-300 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{resetSuccessMessage}</span>
              </div>
            )}

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-purple-300 uppercase tracking-wider mb-1.5">
                  New Admin Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="Enter new password (min. 4 chars)..."
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setChallengeError('');
                  }}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 font-mono focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-purple-300 uppercase tracking-wider mb-1.5">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="Re-enter new password..."
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setChallengeError('');
                  }}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 font-mono focus:outline-none transition"
                />
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setView('challenge_success')}
                  className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-medium rounded-xl border border-slate-800 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-purple-900/40 transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save & Unlock Admin</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  X, 
  Save, 
  BookOpen, 
  UserCheck, 
  Sparkles, 
  Plus, 
  Trash2, 
  Award, 
  Layers, 
  GraduationCap, 
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Course } from '../types/astronomy';

interface CourseEditModalProps {
  course: Course;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedCourse: Course) => void;
}

export const CourseEditModal: React.FC<CourseEditModalProps> = ({
  course,
  isOpen,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState(course.title);
  const [description, setDescription] = useState(course.description);
  const [category, setCategory] = useState(course.category);
  const [level, setLevel] = useState<'Introductory' | 'Intermediate' | 'Advanced'>(course.level);
  
  // Professor / Lead Astronomer fields
  const [professorName, setProfessorName] = useState(course.leadAstronomer.name);
  const [professorAffiliation, setProfessorAffiliation] = useState(course.leadAstronomer.affiliation);
  const [professorCallsign, setProfessorCallsign] = useState(course.leadAstronomer.callsign);

  // Student Learning Subjects
  const [learningSubjects, setLearningSubjects] = useState<string[]>(
    course.learningSubjects || [
      'Observational Target Tracking',
      'Optical Calibration Rigor',
      'Logbook Scientific Documentation'
    ]
  );
  const [newSubjectInput, setNewSubjectInput] = useState('');

  // Course custom certificate template
  const [customCertTemplate, setCustomCertTemplate] = useState(course.customCertificateTemplateUrl || '');

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleAddSubject = () => {
    if (!newSubjectInput.trim()) return;
    if (learningSubjects.includes(newSubjectInput.trim())) {
      setErrorMsg('This subject is already in the list.');
      setTimeout(() => setErrorMsg(''), 3000);
      return;
    }
    setLearningSubjects(prev => [...prev, newSubjectInput.trim()]);
    setNewSubjectInput('');
  };

  const handleRemoveSubject = (indexToRemove: number) => {
    setLearningSubjects(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Course title cannot be empty.');
      return;
    }
    if (!professorName.trim()) {
      setErrorMsg('Professor / Lead Astronomer name cannot be empty.');
      return;
    }

    const updatedCourse: Course = {
      ...course,
      title: title.trim(),
      description: description.trim(),
      category: category.trim(),
      level,
      leadAstronomer: {
        name: professorName.trim(),
        affiliation: professorAffiliation.trim() || 'Astronomical Society Academic Faculty',
        callsign: professorCallsign.trim() || 'AST-FAC',
      },
      learningSubjects: learningSubjects.filter(s => s.trim().length > 0),
      customCertificateTemplateUrl: customCertTemplate.trim() || undefined,
    };

    onSave(updatedCourse);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const categories = [
    'Imaging & Hardware',
    'Celestial Mechanics',
    'Solar System',
    'Radio Astronomy',
    'Astrophysics & Cosmology',
    'Observational Techniques'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl my-8 bg-[#090d16] border border-cyan-500/50 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">Admin Curriculum Editor</h3>
                <span className="text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800/60 px-2 py-0.5 rounded uppercase">
                  Admin Authority
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Modify professor name, course metadata, student learning subjects & certificate credentials.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback message */}
        {savedSuccess && (
          <div className="p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-2xl flex items-center gap-2 text-emerald-200 text-xs animate-in zoom-in-95">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Course, Professor & Learning Subjects updated successfully!</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-3 bg-rose-950/80 border border-rose-500/50 rounded-2xl flex items-center gap-2 text-rose-200 text-xs animate-in shake">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6 max-h-[72vh] overflow-y-auto pr-1">
          {/* Section 1: Professor / Instructor Information */}
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 sm:p-5 space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 pb-1 border-b border-slate-800/60">
              <UserCheck className="w-4 h-4" />
              <span>PROFESSOR & INSTRUCTOR CREDENTIALS</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-1">
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Professor / Instructor Name *
                </label>
                <input
                  type="text"
                  required
                  value={professorName}
                  onChange={(e) => setProfessorName(e.target.value)}
                  placeholder="e.g. Dr. Elena Rostova"
                  className="w-full bg-[#060913] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 transition"
                />
              </div>

              <div className="sm:col-span-1">
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Academic Affiliation / Institute
                </label>
                <input
                  type="text"
                  value={professorAffiliation}
                  onChange={(e) => setProfessorAffiliation(e.target.value)}
                  placeholder="e.g. High-Altitude Observatory"
                  className="w-full bg-[#060913] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 transition"
                />
              </div>

              <div className="sm:col-span-1">
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Callsign / Faculty Title
                </label>
                <input
                  type="text"
                  value={professorCallsign}
                  onChange={(e) => setProfessorCallsign(e.target.value)}
                  placeholder="e.g. AST-882 or Senior Fellow"
                  className="w-full bg-[#060913] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 transition font-mono"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Course Information */}
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 sm:p-5 space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 pb-1 border-b border-slate-800/60">
              <BookOpen className="w-4 h-4" />
              <span>COURSE TITLE & METADATA</span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Course Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Introduction to Astrophotography"
                  className="w-full bg-[#060913] border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white font-semibold focus:outline-none focus:border-indigo-500 transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Category Track
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#060913] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 transition"
                  >
                    {categories.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Difficulty Level
                  </label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value as any)}
                    className="w-full bg-[#060913] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 transition"
                  >
                    <option value="Introductory">Introductory</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Course Description / Syllabus Overview
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the scientific learning objectives, telescope equipment, and observational goals..."
                  className="w-full bg-[#060913] border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500 transition leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Subjects Student Learns in this Course */}
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between pb-1 border-b border-slate-800/60">
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
                <Sparkles className="w-4 h-4" />
                <span>SUBJECTS & TOPICS WHICH STUDENTS LEARN</span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                {learningSubjects.length} Subjects
              </span>
            </div>

            <p className="text-xs text-slate-400">
              Define the specific academic concepts and observational competencies students acquire in this course. These appear on the course cards and student certificates.
            </p>

            {/* Existing Subjects Tags */}
            <div className="flex flex-wrap gap-2 min-h-[42px] p-2.5 bg-[#060913] border border-slate-800 rounded-xl">
              {learningSubjects.length === 0 ? (
                <span className="text-xs text-slate-500 italic p-1">
                  No subjects added yet. Add subjects below.
                </span>
              ) : (
                learningSubjects.map((subj, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-800/60 text-cyan-200 text-xs rounded-lg transition group"
                  >
                    <span>{subj}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSubject(idx)}
                      title="Remove this subject"
                      className="text-cyan-400 hover:text-rose-400 transition"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))
              )}
            </div>

            {/* Add Subject Input */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newSubjectInput}
                onChange={(e) => setNewSubjectInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSubject();
                  }
                }}
                placeholder="Type a subject student learns (e.g. Optical Backfocus Calibration, Star-Hopping)..."
                className="flex-1 bg-[#060913] border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 transition"
              />
              <button
                type="button"
                onClick={handleAddSubject}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition shrink-0 shadow-md shadow-cyan-950"
              >
                <Plus className="w-4 h-4" />
                <span>Add Subject</span>
              </button>
            </div>
          </div>

          {/* Section 4: Course Custom Certificate Template */}
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 sm:p-5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 pb-1 border-b border-slate-800/60">
              <Award className="w-4 h-4" />
              <span>COURSE CERTIFICATE TEMPLATE (OPTIONAL)</span>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Custom Certificate Background Image URL (Overrides default society styling)
              </label>
              <input
                type="url"
                value={customCertTemplate}
                onChange={(e) => setCustomCertTemplate(e.target.value)}
                placeholder="https://example.com/certificates/course-template.jpg"
                className="w-full bg-[#060913] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-500 transition"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                You can also configure the global society certificate signatories and titles in the Certificate Customizer tab.
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-xl text-xs font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition shadow-lg shadow-cyan-950"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

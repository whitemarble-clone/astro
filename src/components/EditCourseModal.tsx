import React, { useState, useEffect } from 'react';
import { 
  X, 
  Save, 
  Trash2, 
  User, 
  BookOpen, 
  Sparkles, 
  GraduationCap, 
  CheckCircle2, 
  Layers, 
  Plus, 
  Minus,
  HelpCircle,
  Tag
} from 'lucide-react';
import { Course } from '../types/astronomy';

interface EditCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course | null;
  onSaveCourse: (updatedCourse: Course) => void;
  onDeleteCourse?: (courseId: number) => void;
}

export const EditCourseModal: React.FC<EditCourseModalProps> = ({
  isOpen,
  onClose,
  course,
  onSaveCourse,
  onDeleteCourse,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Imaging & Hardware');
  const [level, setLevel] = useState<'Introductory' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [description, setDescription] = useState('');
  const [professorName, setProfessorName] = useState('');
  const [professorAffiliation, setProfessorAffiliation] = useState('');
  const [professorCallsign, setProfessorCallsign] = useState('');
  const [learningSubjects, setLearningSubjects] = useState<string[]>([]);
  const [newSubjectInput, setNewSubjectInput] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (course) {
      setTitle(course.title || '');
      setCategory(course.category || 'Imaging & Hardware');
      setLevel(course.level || 'Intermediate');
      setDescription(course.description || '');
      setProfessorName(course.leadAstronomer?.name || '');
      setProfessorAffiliation(course.leadAstronomer?.affiliation || '');
      setProfessorCallsign(course.leadAstronomer?.callsign || '');
      setLearningSubjects(
        course.learningSubjects && course.learningSubjects.length > 0
          ? course.learningSubjects
          : [
              'Telescopic optical collimation and alignment',
              'Deep-sky sensor calibration and SNR optimization',
              'Empirical astronomical chart interpretation'
            ]
      );
      setSavedSuccess(false);
    }
  }, [course]);

  if (!isOpen || !course) return null;

  const handleAddSubject = () => {
    if (!newSubjectInput.trim()) return;
    setLearningSubjects((prev) => [...prev, newSubjectInput.trim()]);
    setNewSubjectInput('');
  };

  const handleRemoveSubject = (index: number) => {
    setLearningSubjects((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !professorName.trim()) {
      alert('Please provide a course title and professor/lead astronomer name.');
      return;
    }

    const updated: Course = {
      ...course,
      title: title.trim(),
      category: category.trim(),
      level,
      description: description.trim(),
      leadAstronomer: {
        name: professorName.trim(),
        affiliation: professorAffiliation.trim() || 'Astronomical Observatory Council',
        callsign: professorCallsign.trim() || 'ASTRO-FACULTY',
      },
      learningSubjects,
    };

    onSaveCourse(updated);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-[#0b101d] border border-cyan-500/40 rounded-3xl w-full max-w-2xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-b border-cyan-500/30 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-950/80 border border-purple-500/50 flex items-center justify-center text-purple-300">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Edit Course, Professor & Curriculum</h3>
                <span className="text-[10px] font-mono bg-purple-950 text-purple-300 border border-purple-800/60 px-2 py-0.5 rounded-full">
                  Admin Editor
                </span>
              </div>
              <p className="text-xs text-slate-400">Modify professor name, subject topics, and course syllabus</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 text-xs">
          {savedSuccess && (
            <div className="p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-xl flex items-center gap-2 text-emerald-300 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Course and professor details successfully updated across all student portals!</span>
            </div>
          )}

          {/* Section 1: Professor / Lead Astronomer Information */}
          <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-purple-400 font-semibold text-sm">
              <User className="w-4 h-4" />
              <h4>Lead Professor / Faculty Astronomer</h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-medium mb-1 font-mono">Professor Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Elena Rostova or Prof. Marcus Thorne"
                  value={professorName}
                  onChange={(e) => setProfessorName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1 font-mono">Academic Affiliation / Department</label>
                <input
                  type="text"
                  placeholder="e.g. High-Altitude Observatory or Chair of Astrophysics"
                  value={professorAffiliation}
                  onChange={(e) => setProfessorAffiliation(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1 font-mono">Faculty Callsign / Credentials</label>
              <input
                type="text"
                placeholder="e.g. AST-882 or PROF-CELESTIAL"
                value={professorCallsign}
                onChange={(e) => setProfessorCallsign(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* Section 2: Course & Subject Information */}
          <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm">
              <BookOpen className="w-4 h-4" />
              <h4>Course Track & Subject Settings</h4>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1 font-mono">Course Track Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Introduction to Astrophotography"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-semibold text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-medium mb-1 font-mono">Subject / Category *</label>
                <input
                  type="text"
                  placeholder="e.g. Imaging & Hardware, Celestial Mechanics..."
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
                <p className="text-[10px] text-slate-500 mt-1">You can type any custom scientific subject name.</p>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1 font-mono">Difficulty Level</label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="Introductory">Introductory</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1 font-mono">Course Track Description</label>
              <textarea
                rows={3}
                placeholder="Explain the objectives and curriculum of this course..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 resize-none leading-relaxed"
              />
            </div>
          </div>

          {/* Section 3: What Students Learn (Syllabus & Learning Subjects) */}
          <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">
                <Tag className="w-4 h-4" />
                <h4>Subjects & Skills Learned by Student</h4>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                {learningSubjects.length} Topics Configured
              </span>
            </div>

            <p className="text-[11px] text-slate-400">
              Students and members will see these specific scientific subjects and techniques highlighted on their dashboard and certificate.
            </p>

            {/* List of existing subjects */}
            <div className="space-y-2">
              {learningSubjects.map((subj, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between gap-2 p-2 bg-slate-950 rounded-xl border border-slate-800 text-slate-200"
                >
                  <span className="font-mono text-cyan-400 text-[10px] w-6">#{index + 1}</span>
                  <span className="flex-1 truncate">{subj}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSubject(index)}
                    className="p-1 text-slate-500 hover:text-rose-400 transition"
                    title="Remove this subject"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add new subject input */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                placeholder="Add new learning topic (e.g. Polar Alignment, Plate Solving)..."
                value={newSubjectInput}
                onChange={(e) => setNewSubjectInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSubject();
                  }
                }}
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
              <button
                type="button"
                onClick={handleAddSubject}
                className="px-3.5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
            {onDeleteCourse ? (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm(`Are you sure you want to permanently delete course "${course.title}"?`)) {
                    onDeleteCourse(course.id);
                    onClose();
                  }
                }}
                className="px-4 py-2 bg-rose-950/70 hover:bg-rose-900 border border-rose-800/60 text-rose-300 hover:text-white rounded-xl text-xs font-medium flex items-center gap-1.5 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Entire Course Track</span>
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-purple-900/30 transition"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save All Changes</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

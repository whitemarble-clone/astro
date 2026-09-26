import React, { useState } from 'react';
import { 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  Award, 
  RotateCcw, 
  X, 
  Sparkles, 
  ChevronRight, 
  Compass,
  AlertCircle
} from 'lucide-react';
import { Course, CourseQuiz } from '../types/astronomy';

interface CourseQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course;
  onQuizComplete: (courseId: number, scorePercentage: number) => void;
}

export const CourseQuizModal: React.FC<CourseQuizModalProps> = ({
  isOpen,
  onClose,
  course,
  onQuizComplete,
}) => {
  const quiz = course.quiz;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  if (!isOpen || !quiz || !quiz.questions || quiz.questions.length === 0) return null;

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const totalQuestions = quiz.questions.length;

  const handleSelectOption = (optionIndex: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: optionIndex,
    }));
  };

  const calculateScore = () => {
    let correctCount = 0;
    quiz.questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        correctCount++;
      }
    });
    return Math.round((correctCount / totalQuestions) * 100);
  };

  const handleSubmitQuiz = () => {
    setIsSubmitted(true);
    const score = calculateScore();
    onQuizComplete(course.id, score);
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
    setIsSubmitted(false);
    setShowExplanation(false);
  };

  const scorePercentage = isSubmitted ? calculateScore() : 0;
  const isPassed = isSubmitted && scorePercentage >= quiz.passingScore;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0b0f19] border border-indigo-500/40 rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-full bg-slate-900 border border-slate-800 transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-wider">
            <HelpCircle className="w-4 h-4 text-cyan-400" />
            <span>Official Examination Track · {course.category}</span>
          </div>
          <h2 className="text-xl font-bold text-white">{quiz.title}</h2>
          <p className="text-xs text-slate-400">
            Passing Criteria: <strong className="text-cyan-300 font-mono">{quiz.passingScore}% Accuracy</strong> to unlock official accreditation badge & certificate.
          </p>
        </div>

        {/* Quiz Body */}
        {!isSubmitted ? (
          <div className="space-y-6">
            {/* Progress indicators */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono text-slate-400">
                <span>QUESTION {currentQuestionIndex + 1} OF {totalQuestions}</span>
                <span>{Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100)}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-cyan-500 transition-all duration-300"
                  style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
                />
              </div>
            </div>

            {/* Current Question */}
            <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="text-base font-semibold text-white leading-relaxed">
                {currentQuestion.question}
              </h3>

              <div className="space-y-2.5">
                {currentQuestion.options.map((option, idx) => {
                  const isSelected = selectedAnswers[currentQuestionIndex] === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs transition flex items-center gap-3 ${
                        isSelected
                          ? 'bg-indigo-950/80 border-indigo-500 text-white font-medium shadow-md'
                          : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono shrink-0 border ${
                        isSelected ? 'bg-indigo-600 border-indigo-400 text-white' : 'border-slate-700 text-slate-400'
                      }`}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{option}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                disabled={currentQuestionIndex === 0}
                onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-30 rounded-xl text-xs text-slate-300 transition"
              >
                Previous Question
              </button>

              {currentQuestionIndex < totalQuestions - 1 ? (
                <button
                  disabled={selectedAnswers[currentQuestionIndex] === undefined}
                  onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 text-white text-xs font-semibold rounded-xl transition flex items-center gap-1.5"
                >
                  <span>Next Question</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  disabled={Object.keys(selectedAnswers).length < totalQuestions}
                  onClick={handleSubmitQuiz}
                  className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 disabled:opacity-30 text-white text-xs font-bold rounded-xl shadow-lg transition"
                >
                  Submit Final Examination
                </button>
              )}
            </div>
          </div>
        ) : (
          /* RESULT VIEW */
          <div className="space-y-6">
            <div className={`p-6 rounded-3xl border text-center space-y-3 ${
              isPassed 
                ? 'bg-gradient-to-b from-emerald-950/50 to-slate-950 border-emerald-500/50 shadow-2xl'
                : 'bg-gradient-to-b from-rose-950/40 to-slate-950 border-rose-500/40'
            }`}>
              <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center text-3xl bg-slate-900 border border-slate-800">
                {isPassed ? '🏆' : '📚'}
              </div>

              <div>
                <h3 className="text-2xl font-bold text-white">
                  {isPassed ? 'Examination Passed!' : 'Requires Review'}
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  {isPassed 
                    ? 'Congratulations! Your score meets the required threshold for accredited society certification.'
                    : `You scored below the ${quiz.passingScore}% threshold. Review key takeaways and retry.`
                  }
                </p>
              </div>

              <div className="inline-block px-5 py-2 rounded-2xl bg-black/50 border border-slate-800 text-sm font-mono font-bold">
                <span className={isPassed ? 'text-emerald-400' : 'text-rose-400'}>
                  Score: {scorePercentage}%
                </span>
                <span className="text-slate-500 text-xs ml-2">
                  ({quiz.questions.filter((q, i) => selectedAnswers[i] === q.correctIndex).length}/{totalQuestions} Correct)
                </span>
              </div>
            </div>

            {/* Answer Breakdown with Explanations */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Astronomical Accuracy Review & Explanations:
              </h4>

              <div className="space-y-3">
                {quiz.questions.map((q, idx) => {
                  const userAnswer = selectedAnswers[idx];
                  const isCorrect = userAnswer === q.correctIndex;

                  return (
                    <div
                      key={idx}
                      className={`p-4 rounded-xl border text-xs space-y-2 ${
                        isCorrect ? 'bg-emerald-950/20 border-emerald-500/30' : 'bg-rose-950/20 border-rose-500/30'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <span className="font-semibold text-white">
                          {idx + 1}. {q.question}
                        </span>
                        {isCorrect ? (
                          <span className="text-emerald-400 flex items-center gap-1 font-mono text-[11px] shrink-0">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                          </span>
                        ) : (
                          <span className="text-rose-400 flex items-center gap-1 font-mono text-[11px] shrink-0">
                            <XCircle className="w-3.5 h-3.5" /> Incorrect
                          </span>
                        )}
                      </div>

                      <div className="text-[11px] text-slate-300 space-y-0.5">
                        <p>
                          Your answer: <strong className={isCorrect ? 'text-emerald-300' : 'text-rose-300'}>
                            {q.options[userAnswer]}
                          </strong>
                        </p>
                        {!isCorrect && (
                          <p>
                            Correct answer: <strong className="text-emerald-300">{q.options[q.correctIndex]}</strong>
                          </p>
                        )}
                      </div>

                      <div className="p-2.5 bg-black/40 rounded-lg text-[11px] text-slate-400 leading-relaxed border border-slate-800">
                        <strong className="text-cyan-400 font-mono">Scientific Note: </strong>
                        {q.explanation}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl text-xs flex items-center gap-1.5 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry Exam</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


import React, { useState } from 'react';
import { QuizQuestion } from '../types';

interface QuizProps {
  topic: string;
  questions: QuizQuestion[];
  onPass: () => void;
  onCancel: () => void;
}

export const Quiz: React.FC<QuizProps> = ({ topic, questions, onPass, onCancel }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const passingScore = 2; 
  const isPassed = score >= passingScore;
  
  // Progress Calculation
  const progressPercent = ((currentIndex) / totalQuestions) * 100;

  const handleNext = () => {
    let currentScore = score;
    if (selectedOption === currentQuestion.answer) {
      currentScore = score + 1;
      setScore(currentScore);
    }

    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
    } else {
      setShowResult(true);
    }
  };

  const handleRetry = () => {
    setCurrentIndex(0);
    setScore(0);
    setSelectedOption(null);
    setShowResult(false);
  };

  if (showResult) {
    return (
      <div className="w-full max-w-lg mx-auto p-8 glass-panel rounded-2xl shadow-2xl border border-white/60 text-center animate-scale-in">
        <div className={`mx-auto w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-lg ${isPassed ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
          {isPassed ? (
             <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          ) : (
             <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          )}
        </div>
        
        <h2 className="text-3xl font-serif font-bold text-slate-800 mb-3">{isPassed ? 'Assessment Passed' : 'Assessment Failed'}</h2>
        <div className="bg-slate-50/50 rounded-lg p-4 mb-8 border border-slate-100">
            <p className="text-slate-600 font-medium">
                {isPassed 
                    ? "Congratulations! You have demonstrated sufficient knowledge to receive your certificate." 
                    : "Unfortunately, you did not meet the passing criteria. Please review the material and try again."
                }
            </p>
        </div>

        <div className="flex gap-4 justify-center">
            {isPassed ? (
                <button 
                    onClick={onPass}
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white py-4 rounded-xl font-bold shadow-lg shadow-emerald-600/20 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    Download Certificate
                </button>
            ) : (
                <div className="flex gap-3 w-full">
                    <button 
                        onClick={onCancel}
                        className="flex-1 py-3.5 rounded-xl font-semibold text-slate-600 hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-all"
                    >
                        Exit
                    </button>
                    <button 
                        onClick={handleRetry}
                        className="flex-1 bg-slate-800 hover:bg-slate-900 text-white py-3.5 rounded-xl font-bold shadow-md transition-all active:scale-[0.98]"
                    >
                        Try Again
                    </button>
                </div>
            )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in-up h-full flex flex-col justify-center">
        {/* Progress Bar */}
        <div className="mb-4 px-1 shrink-0">
            <div className="flex justify-between text-xs text-white/80 font-medium mb-2 uppercase tracking-wide">
                <span>Progress</span>
                <span>{Math.round(progressPercent)}%</span>
            </div>
            <div className="h-2 w-full bg-slate-700/30 rounded-full overflow-hidden backdrop-blur-sm">
                <div 
                    className="h-full bg-gradient-to-r from-blue-400 to-indigo-400 transition-all duration-500 ease-out rounded-full"
                    style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
                ></div>
            </div>
        </div>

        <div className="glass-panel rounded-2xl shadow-2xl border border-white/60 overflow-hidden ring-1 ring-white/20 flex flex-col max-h-[75vh]">
            {/* Header */}
            <div className="bg-slate-50/80 px-6 py-4 border-b border-slate-100 flex justify-between items-center backdrop-blur-sm shrink-0">
                <div>
                    <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Question {currentIndex + 1}</h2>
                    <p className="text-xs text-slate-400 mt-0.5 hidden sm:block truncate max-w-xs">Topic: {topic}</p>
                </div>
                <div className="text-xs font-bold bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 shadow-sm shrink-0">
                    {totalQuestions - currentIndex} remaining
                </div>
            </div>

            {/* Content - Scrollable if content is too large for the fixed container */}
            <div className="p-6 overflow-y-auto custom-scrollbar">
                <div className="mb-6">
                    <h3 className="text-lg md:text-xl font-serif font-medium text-slate-800 leading-relaxed">
                        {currentQuestion.question}
                    </h3>
                </div>

                <div className="space-y-3">
                    {currentQuestion.options.map((option, idx) => (
                        <button
                            key={idx}
                            onClick={() => setSelectedOption(option)}
                            className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center justify-between group
                                ${selectedOption === option 
                                    ? 'border-blue-500 bg-blue-50/80 text-blue-900 shadow-md ring-1 ring-blue-500/20' 
                                    : 'border-slate-200 hover:border-blue-300 bg-white/50 hover:bg-white text-slate-700 hover:shadow-sm'
                                }
                            `}
                        >
                            <span className="font-medium text-sm md:text-base">{option}</span>
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors shrink-0 ml-2 ${
                                selectedOption === option 
                                ? 'border-blue-500 bg-blue-500' 
                                : 'border-slate-300 group-hover:border-blue-400'
                            }`}>
                                {selectedOption === option && <div className="w-2 h-2 bg-white rounded-full"></div>}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <div className="bg-slate-50/80 px-6 py-4 border-t border-slate-100 flex justify-between items-center backdrop-blur-sm shrink-0">
                <button 
                    onClick={onCancel}
                    className="text-slate-500 hover:text-red-600 font-semibold text-sm transition-colors px-2"
                >
                    Cancel
                </button>
                <button
                    onClick={handleNext}
                    disabled={!selectedOption}
                    className={`px-8 py-2.5 rounded-xl font-bold text-white transition-all transform
                        ${selectedOption 
                            ? 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/30 active:scale-95' 
                            : 'bg-slate-300 cursor-not-allowed opacity-70'
                        }
                    `}
                >
                    {currentIndex === totalQuestions - 1 ? 'Finish' : 'Next'}
                </button>
            </div>
        </div>
    </div>
  );
};


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
  const progressPercent = ((currentIndex + 1) / totalQuestions) * 100;

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

  // --- RESULT VIEW ---
  if (showResult) {
    return (
      <div className="w-full max-w-[500px] animate-scale-in px-2 md:px-0">
        <div className="glass-panel rounded-3xl shadow-2xl border border-white/60 overflow-hidden ring-1 ring-white/20">
          
          {/* Header */}
          <div className={`px-6 py-8 md:px-8 md:py-10 text-center relative overflow-hidden ${
              isPassed 
              ? 'bg-gradient-to-br from-blue-600 to-indigo-700' 
              : 'bg-gradient-to-br from-red-500 to-rose-600'
          }`}>
             <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
             
             <div className="relative z-10 flex flex-col items-center">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center shadow-lg mb-4 animate-bounce-short">
                    {isPassed ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 md:h-10 md:w-10 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 md:h-10 md:w-10 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    )}
                </div>
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-white tracking-wide">
                    {isPassed ? 'Assessment Passed' : 'Assessment Failed'}
                </h2>
                <p className={`font-medium mt-2 opacity-90 text-sm md:text-base ${isPassed ? 'text-blue-50' : 'text-red-50'}`}>
                    {isPassed ? 'You are eligible for certification' : 'Score below passing criteria'}
                </p>
             </div>
          </div>

          <div className="p-6 md:p-8 bg-white/60">
             <div className={`rounded-xl p-4 md:p-5 mb-6 md:mb-8 border ${isPassed ? 'bg-blue-50/50 border-blue-100' : 'bg-red-50/50 border-red-100'}`}>
                <p className="text-slate-700 text-center leading-relaxed font-medium text-sm md:text-base">
                    {isPassed 
                        ? "Congratulations! You have demonstrated sufficient knowledge to receive your certificate." 
                        : "Unfortunately, you did not meet the passing criteria. Please review the material and try again."
                    }
                </p>
             </div>

             <div className="flex flex-col gap-3">
                {isPassed ? (
                    <button 
                        onClick={onPass}
                        className="w-full bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-800 hover:to-indigo-900 text-white text-base md:text-lg font-bold py-3 md:py-4 rounded-xl shadow-xl shadow-blue-900/20 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 group"
                    >
                        <span>View Certificate</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </button>
                ) : (
                    <>
                        <button 
                            onClick={handleRetry}
                            className="w-full bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-800 hover:to-indigo-900 text-white font-bold py-3 md:py-3.5 rounded-xl shadow-lg shadow-blue-900/20 transition-all transform active:scale-[0.98] text-sm md:text-base"
                        >
                            Try Again
                        </button>
                        <button 
                            onClick={onCancel}
                            className="w-full py-3 md:py-3.5 rounded-xl font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-100/50 transition-colors text-sm md:text-base"
                        >
                            Back to Home
                        </button>
                    </>
                )}
             </div>
          </div>
        </div>
      </div>
    );
  }

  // --- QUESTION VIEW ---
  return (
    <div className="w-full max-w-[550px] animate-fade-in-up px-2 md:px-0">
        <div className="glass-panel rounded-2xl shadow-2xl border border-white/60 overflow-hidden ring-1 ring-white/20 flex flex-col max-h-[85vh] md:max-h-[80vh]">
            
            {/* Header */}
            <div className="bg-slate-50/50 border-b border-slate-100 px-6 py-5 md:px-8 md:py-6 relative overflow-hidden shrink-0">
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-600"></div>
                
                <div className="flex justify-between items-end mb-3 md:mb-4">
                    <div>
                        <h2 className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Assessment</h2>
                        <h3 className="text-lg md:text-xl font-serif font-bold text-slate-800">Question {currentIndex + 1}</h3>
                    </div>
                    <div className="text-right">
                         <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">Progress</span>
                         <div className="text-sm font-bold text-indigo-600">{Math.round(((currentIndex) / totalQuestions) * 100)}%</div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500 ease-out rounded-full"
                        style={{ width: `${progressPercent}%` }}
                    ></div>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar bg-white/40">
                <div className="mb-6 md:mb-8">
                    <p className="text-base md:text-lg font-medium text-slate-700 leading-relaxed">
                        {currentQuestion.question}
                    </p>
                </div>

                <div className="space-y-3">
                    {currentQuestion.options.map((option, idx) => (
                        <button
                            key={idx}
                            onClick={() => setSelectedOption(option)}
                            className={`w-full text-left p-3 md:p-4 rounded-xl border transition-all duration-200 flex items-center justify-between group relative overflow-hidden
                                ${selectedOption === option 
                                    ? 'border-blue-500 bg-white text-blue-800 shadow-md ring-1 ring-blue-500/20 z-10' 
                                    : 'border-slate-200 bg-white/50 hover:bg-white hover:border-blue-300 text-slate-600'
                                }
                            `}
                        >
                            <span className="font-medium text-sm md:text-base relative z-10">{option}</span>
                            
                            {/* Selection Indicator */}
                            <div className={`w-4 h-4 md:w-5 md:h-5 rounded-full border flex items-center justify-center transition-all shrink-0 ml-3 relative z-10 ${
                                selectedOption === option 
                                ? 'border-blue-500 bg-blue-500 scale-100' 
                                : 'border-slate-300 group-hover:border-blue-400 scale-90'
                            }`}>
                                {selectedOption === option && <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-white rounded-full"></div>}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <div className="bg-white/60 px-6 py-4 md:px-8 md:py-5 border-t border-slate-100 flex justify-between items-center shrink-0">
                <button 
                    onClick={onCancel}
                    className="text-slate-400 hover:text-slate-600 text-xs md:text-sm font-semibold transition-colors px-2 py-2"
                >
                    Cancel
                </button>
                <button
                    onClick={handleNext}
                    disabled={!selectedOption}
                    className={`px-5 py-2.5 md:px-8 md:py-3 rounded-xl font-bold text-white shadow-lg transition-all transform flex items-center gap-2
                        ${selectedOption 
                            ? 'bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-800 hover:to-indigo-900 active:scale-[0.98]' 
                            : 'bg-slate-300 cursor-not-allowed opacity-70'
                        }
                    `}
                >
                    <span className="text-sm md:text-base">{currentIndex === totalQuestions - 1 ? 'Finish Assessment' : 'Next'}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </button>
            </div>
        </div>
    </div>
  );
};

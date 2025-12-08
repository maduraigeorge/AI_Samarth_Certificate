
import React from 'react';
import { EligibilityResult } from '../types';

interface PortalViewProps {
    email: string; // Used as generic identifier
    setEmail: (email: string) => void;
    loading: boolean;
    onCheckEligibility: (e: React.FormEvent) => void;
    eligibilityResult: EligibilityResult | null;
    onStartAssessment: () => void;
    setErrorMsg: (msg: string | null) => void;
    onReset: () => void;
}

export const PortalView: React.FC<PortalViewProps> = ({
    email: identifier, // Rename prop locally for clarity
    setEmail: setIdentifier,
    loading,
    onCheckEligibility,
    eligibilityResult,
    onStartAssessment,
    setErrorMsg,
    onReset
}) => {
    
    const handleContactSupport = () => {
        const subject = "Support Request: AI Samarth Certificate Verification";
        const body = `Hi Support Team,

I am unable to verify my attendance on the portal.

Here are my details:
- Input ID used: ${identifier || '[Enter Email/Phone]'}
- Full Name: [Enter Name]
- School Name: [Enter School]
- Date of Training: [Enter Date]

Please check the records and assist me.

Thank you.`;
        window.location.href = `mailto:support@chrysalis.world?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    };

    // --- STATE 1: SUCCESS / PROFILE CARD (Verified) ---
    if (eligibilityResult?.eligible && eligibilityResult.participant) {
        return (
            <div className="w-full max-w-[420px] animate-scale-in px-4">
                <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
                    
                    {/* Minimalist Header */}
                    <div className="bg-blue-600 px-6 py-8 text-center">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg mx-auto mb-4 animate-bounce-short text-blue-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-serif font-bold text-white">Verified</h2>
                    </div>

                    <div className="p-8">
                        {/* Profile Details */}
                        <div className="text-center mb-8">
                            <h3 className="text-xl font-bold text-slate-800">
                                {eligibilityResult.participant.firstName} {eligibilityResult.participant.lastName}
                            </h3>
                            <p className="text-sm text-slate-500 mt-1 flex items-center justify-center gap-1">
                                <span className="truncate max-w-[250px]">{eligibilityResult.participant.schoolName}</span>
                            </p>
                        </div>

                        {/* Actions */}
                        <button 
                            onClick={onStartAssessment}
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-800 hover:to-indigo-900 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-900/20 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 group"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                </span>
                            ) : (
                                eligibilityResult.participant.certificateDownloaded ? (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                        <span>Download Certificate</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Start Assessment</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                                    </>
                                )
                            )}
                        </button>
                        
                        <div className="mt-6 text-center">
                             <button 
                                type="button" 
                                onClick={onReset} 
                                disabled={loading}
                                className="text-sm text-slate-400 hover:text-red-500 transition-colors"
                             >
                                 Not you? Sign in with different ID
                             </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // --- STATE 2: LOGIN / VERIFY CARD (Default) ---
    return (
        <div className="w-full max-w-[400px] animate-fade-in-up px-4">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden p-8 md:p-10">
                
                {/* Header - Minimalist */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-serif font-bold text-slate-800 mb-3">Attendance Check</h1>
                    <p className="text-sm text-slate-500 leading-relaxed max-w-[280px] mx-auto">
                        Please enter your details exactly as used in the Zoom webinar.
                    </p>
                </div>
                
                {/* Error Display - Minimalist */}
                {eligibilityResult && !eligibilityResult.eligible && (
                    <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-xs md:text-sm text-center mb-6 border border-red-100 animate-fade-in">
                        {eligibilityResult.message}
                    </div>
                )}

                <form onSubmit={onCheckEligibility} className="space-y-5">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <input 
                            type="text" 
                            required
                            placeholder="Email or Phone Number"
                            value={identifier}
                            onChange={e => {
                                setIdentifier(e.target.value);
                                setErrorMsg(null);
                            }}
                            className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-slate-800 placeholder-slate-400 font-medium text-sm md:text-base"
                        />
                    </div>

                    <button 
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-800 hover:to-indigo-900 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-900/20 transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm md:text-base"
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white/50" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            </>
                        ) : (
                            <>
                                <span>Verify Identity</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 opacity-70" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                            </>
                        )}
                    </button>
                </form>

                 {/* Minimal Support Link */}
                 <div className="mt-8 text-center">
                    <button
                        type="button"
                        onClick={handleContactSupport}
                        className="text-xs font-medium text-slate-400 hover:text-slate-600 transition-colors underline decoration-slate-200 underline-offset-4"
                    >
                        Having trouble? Contact Support
                    </button>
                </div>
            </div>
        </div>
    );
};

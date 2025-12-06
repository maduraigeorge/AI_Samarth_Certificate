
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
}

export const PortalView: React.FC<PortalViewProps> = ({
    email: identifier, // Rename prop locally for clarity
    setEmail: setIdentifier,
    loading,
    onCheckEligibility,
    eligibilityResult,
    onStartAssessment,
    setErrorMsg
}) => {
    return (
        <div className="w-full max-w-[480px] animate-fade-in-up">
            <div className="glass-panel rounded-2xl shadow-2xl border border-white/60 overflow-hidden ring-1 ring-white/20">
                
                {/* Card Header */}
                <div className="bg-slate-50/50 border-b border-slate-100 px-8 py-8 text-center relative overflow-hidden">
                     <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-600"></div>
                     <h1 className="text-2xl md:text-3xl font-serif font-bold text-slate-800 mb-2 tracking-tight">Certificate Portal</h1>
                     <p className="text-slate-500 text-sm font-medium">Secure verification for AI Samarth training</p>
                </div>
                
                <div className="p-8 space-y-6 bg-white/40">
                    <form onSubmit={onCheckEligibility} className="space-y-6">
                        <div className="group">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 group-focus-within:text-blue-600 transition-colors">
                                Registered Email or Phone Number
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <input 
                                    type="text" 
                                    required
                                    placeholder="name@school.edu or 9876543210"
                                    value={identifier}
                                    onChange={e => {
                                        setIdentifier(e.target.value);
                                        setErrorMsg(null);
                                    }}
                                    className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-slate-900 placeholder-slate-400 shadow-sm text-base"
                                />
                            </div>
                        </div>

                        <button 
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-800 hover:to-indigo-900 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-900/20 transition-all transform active:scale-[0.98] disabled:opacity-80 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-base"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white/80" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    <span>Verifying Records...</span>
                                </>
                            ) : (
                                <>
                                    <span>Verify Identity</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                                </>
                            )}
                        </button>
                    </form>

                    {/* Result Area */}
                    {eligibilityResult && (
                        <div className={`rounded-xl p-4 border shadow-sm animate-scale-in origin-top ${
                            eligibilityResult.eligible 
                            ? 'bg-emerald-50/80 border-emerald-200/60' 
                            : 'bg-red-50/80 border-red-200/60'
                        }`}>
                            <div className="flex items-start gap-3">
                                <div className={`p-1.5 rounded-full shrink-0 ${eligibilityResult.eligible ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                                    {eligibilityResult.eligible ? (
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    ) : (
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h3 className={`font-bold text-sm ${eligibilityResult.eligible ? 'text-emerald-900' : 'text-red-900'}`}>
                                        {eligibilityResult.eligible ? 'Verified Successfully' : 'Verification Failed'}
                                    </h3>
                                    {!eligibilityResult.eligible && <p className="text-xs mt-1 text-slate-600 leading-relaxed">{eligibilityResult.message}</p>}
                                    
                                    {eligibilityResult.eligible && eligibilityResult.participant && (
                                        <div className="mt-3 pt-3 border-t border-emerald-200/50">
                                            <div className="flex justify-between items-center text-xs text-emerald-900 mb-3 bg-white/60 p-2.5 rounded-lg border border-emerald-100/50">
                                                <div className="font-semibold">{eligibilityResult.participant.firstName} {eligibilityResult.participant.lastName}</div>
                                                <div className="opacity-75 truncate max-w-[150px]">{eligibilityResult.participant.schoolName}</div>
                                            </div>
                                            
                                            <button 
                                                onClick={onStartAssessment}
                                                disabled={loading}
                                                className="w-full bg-slate-900 hover:bg-black text-white px-4 py-2.5 rounded-lg font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2 group"
                                            >
                                                {loading ? 'Processing...' : (
                                                    eligibilityResult.participant.certificateDownloaded ? (
                                                        <>
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                                            Download Again
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span>Begin Assessment</span>
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                                        </>
                                                    )
                                                )}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                
                {/* Footer note */}
                <div className="bg-slate-50/80 px-8 py-4 text-center border-t border-slate-100">
                     <p className="text-xs text-slate-400">Powered by Chrysalis • Secure & Private</p>
                </div>
            </div>
        </div>
    );
};

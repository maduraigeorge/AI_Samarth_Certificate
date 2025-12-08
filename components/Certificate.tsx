
import React, { useEffect, useState, useRef } from 'react';
import { CertificateConfig } from '../types';
import { AiSamarthLogo, LOGO_CSF, LOGO_CHRYSALIS, LOGO_IITM, LOGO_WSAI, CERTIFICATE_BG_URL } from './Branding';

interface CertificateProps {
  config: CertificateConfig;
  onClose: () => void;
  onDownload: () => void;
}

const CERT_WIDTH = 1123; // A4 Landscape width in px at 96dpi
const CERT_HEIGHT = 794; // A4 Landscape height

export const Certificate: React.FC<CertificateProps> = ({ config, onClose, onDownload }) => {
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      const xPadding = isMobile ? 16 : 40;
      const yPadding = isMobile ? 100 : 120; 
      
      const availableWidth = window.innerWidth - xPadding;
      const availableHeight = window.innerHeight - yPadding;

      const scaleX = availableWidth / CERT_WIDTH;
      const scaleY = availableHeight / CERT_HEIGHT;

      const newScale = Math.min(scaleX, scaleY, 1.1);
      setScale(newScale);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); 

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePrint = () => {
    onDownload();
    setTimeout(() => window.print(), 100);
  };

  const handleCorrection = () => {
      const subject = `Certificate Correction: ${config.recipientName}`;
      const body = `Hi Team,\n\nI attended the session "${config.webinarTitle}".\n\nThere is an error in my certificate details.\n\nName on Certificate: ${config.recipientName}\n\nPlease correct it to: \n\n[Type correct name here]`;
      window.location.href = `mailto:support@chrysalis.world?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/95 flex flex-col items-center justify-start p-4 print:p-0 print:bg-white print:static print:block overflow-hidden backdrop-blur-sm">
      
      {/* Toolbar - Floating above */}
      <div className="z-50 no-print mb-6 mt-2 w-full flex justify-center shrink-0">
        <div className="bg-white/10 backdrop-blur-md px-3 py-2 rounded-2xl border border-white/20 shadow-2xl flex items-center gap-3">
            
            <button 
                onClick={onClose}
                className="p-3 rounded-xl hover:bg-white/10 text-white/80 hover:text-white transition-colors"
                title="Close"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
            </button>

            <div className="w-px h-6 bg-white/20 mx-1"></div>

            <button 
                onClick={handleCorrection}
                className="px-4 py-2.5 rounded-xl hover:bg-white/10 text-white/90 font-medium text-sm transition-colors flex items-center gap-2"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                <span className="hidden sm:inline">Request Correction</span>
            </button>

            <button 
                onClick={handlePrint}
                className="bg-white text-blue-900 hover:bg-blue-50 px-6 py-2.5 rounded-xl font-bold shadow-lg transition-all flex items-center gap-2 text-sm ml-1"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 6 2 18 2 18 9"></polyline>
                    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                    <rect x="6" y="14" width="12" height="8"></rect>
                </svg>
                <span>Download PDF</span>
            </button>
        </div>
      </div>

      {/* Certificate Preview Area */}
      <div 
        className="flex-1 w-full flex items-center justify-center overflow-hidden relative"
        ref={containerRef}
      >
        <div 
            className="transition-transform duration-300 ease-out print:transform-none shadow-[0_20px_60px_rgba(0,0,0,0.5)] bg-white"
            style={{
                transform: `scale(${scale})`,
                transformOrigin: 'center center' 
            }}
        >
            {/* Actual Certificate Container */}
            <div 
                className="relative bg-white text-slate-900 mx-auto overflow-hidden print:shadow-none"
                style={{
                    width: `${CERT_WIDTH}px`,
                    height: `${CERT_HEIGHT}px`,
                }}
            >
                {/* 1. Modern Background Elements */}
                <div className="absolute inset-0 z-0 bg-white"></div>
                {/* Subtle paper texture overlay */}
                <img src={CERTIFICATE_BG_URL} className="absolute inset-0 w-full h-full object-cover opacity-[0.03]" alt="" />
                
                {/* Corner Accents - Blue/Gold Modern Shapes */}
                <svg className="absolute top-0 right-0 w-[400px] h-[400px] z-0 opacity-10 text-blue-900" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M0 0 L100 0 L100 100 Q50 50 0 0 Z" fill="currentColor" />
                </svg>
                <svg className="absolute bottom-0 left-0 w-[300px] h-[300px] z-0 opacity-5 text-indigo-700" viewBox="0 0 100 100" preserveAspectRatio="none">
                     <path d="M0 100 L100 100 L0 0 Z" fill="currentColor" />
                </svg>

                {/* Clean Border Frame */}
                <div className="absolute inset-8 border border-slate-300 z-10 pointer-events-none"></div>
                <div className="absolute inset-[34px] border border-slate-100 z-10 pointer-events-none"></div>

                {/* 2. Content Layout */}
                <div className="absolute inset-0 z-20 flex flex-col px-20 py-12 h-full justify-between">
                    
                    {/* Header: Full Color Logos */}
                    <div className="flex justify-between items-center h-24 border-b border-slate-100/0">
                        <div className="h-full flex items-center">
                             <div className="h-20 w-auto"><AiSamarthLogo /></div>
                        </div>
                        <div className="flex items-center gap-8 h-full">
                            {/* Logos are now Full Color */}
                            <img src={LOGO_CSF} alt="CSF" className="h-14 object-contain" />
                            <div className="h-8 w-px bg-slate-200"></div>
                            <img src={LOGO_CHRYSALIS} alt="Chrysalis" className="h-12 object-contain" />
                            <div className="h-8 w-px bg-slate-200"></div>
                            <img src={LOGO_IITM} alt="IIT Madras" className="h-14 object-contain" />
                            <div className="h-8 w-px bg-slate-200"></div>
                            <img src={LOGO_WSAI} alt="WSAI" className="h-10 object-contain" />
                        </div>
                    </div>

                    {/* Main Body */}
                    <div className="flex-1 flex flex-col items-center justify-center text-center -mt-4">
                        
                        <div className="mb-8">
                            <h1 className="font-[Cinzel] text-5xl font-bold text-slate-900 uppercase tracking-widest leading-tight">
                                Certificate
                            </h1>
                            <div className="flex items-center justify-center gap-3 mt-3">
                                <div className="h-px w-12 bg-blue-600"></div>
                                <p className="text-blue-700 text-sm font-bold tracking-[0.4em] uppercase">
                                    of Completion
                                </p>
                                <div className="h-px w-12 bg-blue-600"></div>
                            </div>
                        </div>

                        <p className="font-serif text-lg text-slate-500 italic mb-2">
                            Proudly presented to
                        </p>

                        {/* Name Section */}
                        <div className="relative mb-6 w-full max-w-5xl">
                            <h2 className="font-[Great_Vibes] text-[90px] leading-tight text-blue-900 px-4 pt-2 drop-shadow-sm">
                                {config.recipientName}
                            </h2>
                        </div>

                         {/* Context */}
                        <div className="max-w-4xl mx-auto space-y-4">
                            <p className="font-serif text-xl text-slate-600 leading-relaxed">
                                for successfully participating in the training session on
                            </p>
                            
                            <h3 className="font-serif text-3xl font-bold text-slate-800 tracking-wide">
                                {config.webinarTitle}
                            </h3>

                            {config.schoolName && (
                                <p className="font-serif text-lg text-slate-500 pt-2">
                                    Representing <span className="font-semibold text-slate-700">{config.schoolName}</span>
                                </p>
                            )}
                        </div>

                    </div>

                    {/* Footer: Signatures & Verification */}
                    <div className="flex justify-between items-end px-4 pb-2">
                        
                        {/* Date */}
                        <div className="text-center min-w-[200px]">
                            <p className="font-serif text-xl font-bold text-slate-800 border-b border-slate-300 pb-2 mb-2">{config.date}</p>
                            <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400 font-bold">Date Issued</p>
                        </div>

                        {/* Modern Seal */}
                        <div className="relative -top-2">
                             <div className="w-32 h-32 flex items-center justify-center relative">
                                {/* Seal Background */}
                                <svg className="absolute inset-0 text-blue-50" viewBox="0 0 100 100" fill="currentColor">
                                    <path d="M50 0 L61 25 L88 25 L75 50 L88 75 L61 75 L50 100 L39 75 L12 75 L25 50 L12 25 L39 25 Z" transform="scale(0.9) translate(5,5)" />
                                </svg>
                                <div className="relative z-10 w-24 h-24 rounded-full border-2 border-blue-900/20 bg-white flex flex-col items-center justify-center p-2 shadow-sm">
                                    <svg className="w-8 h-8 text-blue-900 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="text-[8px] font-bold text-blue-900 uppercase tracking-widest text-center leading-tight">Verified<br/>Credential</span>
                                </div>
                             </div>
                        </div>

                        {/* Signature */}
                        <div className="text-center min-w-[200px]">
                            <div className="border-b border-slate-300 pb-2 mb-2 relative">
                                <div className="h-10 flex items-end justify-center">
                                     <span className="font-[Great_Vibes] text-3xl text-slate-800">Program Director</span>
                                </div>
                            </div>
                            <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400 font-bold">Program Director</p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

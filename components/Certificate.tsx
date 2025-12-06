
import React, { useEffect, useState, useRef } from 'react';
import { CertificateConfig } from '../types';
import { AiSamarthLogo, LOGO_CSF, LOGO_CHRYSALIS, LOGO_IITM, LOGO_WSAI, CERTIFICATE_BG_URL } from './Branding';

interface CertificateProps {
  config: CertificateConfig;
  onClose: () => void;
  onDownload: () => void;
}

const CERT_WIDTH = 1123;
const CERT_HEIGHT = 794;

export const Certificate: React.FC<CertificateProps> = ({ config, onClose, onDownload }) => {
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      const xPadding = 40;
      const yPadding = 100; 
      
      const availableWidth = window.innerWidth - xPadding;
      const availableHeight = window.innerHeight - yPadding;

      const scaleX = availableWidth / CERT_WIDTH;
      const scaleY = availableHeight / CERT_HEIGHT;

      const newScale = Math.min(scaleX, scaleY, 1);
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
    <div className="fixed inset-0 z-50 bg-slate-900/95 flex flex-col items-center justify-center p-4 print:p-0 print:bg-white print:static print:block overflow-hidden">
      
      {/* Controls */}
      <div className="fixed top-4 right-4 flex gap-3 no-print z-50">
        <button 
          onClick={handleCorrection}
          className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-5 py-2.5 rounded-full font-medium transition-colors flex items-center gap-2 text-sm border border-slate-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg>
          Request Correction
        </button>

        <button 
          onClick={handlePrint}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full shadow-lg font-semibold transition-colors flex items-center gap-2 text-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 6 2 18 2 18 9"></polyline>
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
            <rect x="6" y="14" width="12" height="8"></rect>
          </svg>
          Download Certificate
        </button>
        
        <button 
          onClick={onClose}
          className="bg-white/10 hover:bg-white/20 text-white p-2.5 rounded-full backdrop-blur-md transition-colors"
          title="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
        </button>
      </div>

      <div 
        className="transition-transform duration-200 ease-out print:transform-none"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'center center' 
        }}
      >
          {/* Certificate Container */}
          <div 
            className="relative bg-white shadow-2xl print:shadow-none overflow-hidden text-slate-900 mx-auto border-[1px] border-slate-200"
            style={{
              width: `${CERT_WIDTH}px`,
              height: `${CERT_HEIGHT}px`,
              pageBreakAfter: 'always',
            }}
          >
            {/* Background */}
            <div className="absolute inset-0 z-0">
              <img 
                src={CERTIFICATE_BG_URL} 
                alt="Background" 
                className="w-full h-full object-cover opacity-30"
              />
              {/* Decorative Border */}
              <div className="absolute inset-6 border-2 border-slate-800 z-10 pointer-events-none"></div>
              <div className="absolute inset-8 border border-slate-400 z-10 pointer-events-none"></div>
              
              {/* Corner Accents */}
              <div className="absolute top-6 left-6 w-16 h-16 border-t-4 border-l-4 border-blue-800 z-10"></div>
              <div className="absolute top-6 right-6 w-16 h-16 border-t-4 border-r-4 border-blue-800 z-10"></div>
              <div className="absolute bottom-6 left-6 w-16 h-16 border-b-4 border-l-4 border-blue-800 z-10"></div>
              <div className="absolute bottom-6 right-6 w-16 h-16 border-b-4 border-r-4 border-blue-800 z-10"></div>
            </div>

            {/* Content Overlay */}
            <div className="absolute inset-0 z-20 flex flex-col items-center">
                
                {/* 1. Logos Header */}
                <div className="w-full px-20 pt-12 flex justify-between items-center opacity-90">
                    {/* AI Samarth Logo */}
                    <div className="h-16 flex items-center justify-center">
                        <AiSamarthLogo />
                    </div>
                    
                    {/* Partner Logos */}
                    <div className="flex items-center gap-6">
                        <img src={LOGO_CSF} alt="Central Square Foundation" className="h-12 object-contain" />
                        <img src={LOGO_CHRYSALIS} alt="Chrysalis" className="h-12 object-contain" />
                        <img src={LOGO_IITM} alt="IIT Madras" className="h-12 object-contain" />
                        <img src={LOGO_WSAI} alt="WSAI" className="h-10 object-contain" />
                    </div>
                </div>

                {/* 2. Main Title */}
                <div className="mt-10 text-center">
                    <h1 className="text-5xl font-serif font-bold text-slate-900 tracking-wide">
                        CERTIFICATE
                    </h1>
                    <p className="text-xl uppercase tracking-[0.3em] text-blue-800 mt-2 font-semibold">
                        OF COMPLETION
                    </p>
                </div>

                {/* 3. Presentation Line */}
                <div className="mt-8">
                    <p className="font-serif italic text-xl text-slate-600">This certificate is awarded to</p>
                </div>

                {/* 4. Recipient Name */}
                <div className="mt-4 px-20 w-full text-center">
                    <h2 className="text-6xl font-[Great_Vibes] text-slate-900 py-2 border-b-2 border-slate-300 mx-auto w-2/3 inline-block">
                        {config.recipientName}
                    </h2>
                </div>

                {/* 5. Body Text */}
                <div className="mt-8 w-full px-32 text-center">
                    <p className="text-lg text-slate-700 font-serif leading-relaxed">
                        For successfully completing the <strong>AI Samarth</strong> training program on
                    </p>
                    <h3 className="text-2xl font-bold text-blue-900 mt-2 mb-4 uppercase">
                        "{config.webinarTitle}"
                    </h3>
                    
                    {/* Custom Gemini Message */}
                    <p className="text-base text-slate-600 italic font-serif max-w-4xl mx-auto px-10">
                        "{config.customMessage || "For demonstrating commitment to professional development and AI adoption in education."}"
                    </p>
                </div>

                {/* 6. Footer / Signatures */}
                <div className="absolute bottom-16 w-full px-24 flex justify-between items-end">
                    
                    {/* Date */}
                    <div className="flex flex-col items-center w-56">
                        <p className="font-serif text-lg font-bold text-slate-800 border-b border-slate-800 w-full pb-1 mb-1 text-center">
                            {config.date}
                        </p>
                        <p className="text-xs uppercase tracking-widest text-slate-500">Date of Issue</p>
                    </div>

                    {/* Seal */}
                    <div className="mb-0">
                        <div className="w-28 h-28 rounded-full border-4 border-double border-blue-900 flex items-center justify-center bg-white">
                            <div className="text-blue-900 font-bold text-center text-[10px] uppercase tracking-widest p-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                Verified<br/>Completion
                            </div>
                        </div>
                    </div>

                    {/* Signature */}
                    <div className="flex flex-col items-center w-56">
                        {/* Simulated Signature */}
                        <p className="font-[Great_Vibes] text-3xl text-slate-800 w-full text-center pb-1 mb-1 transform -rotate-2">
                            Program Director
                        </p>
                        <div className="border-b border-slate-800 w-full mb-1"></div>
                        <p className="text-xs uppercase tracking-widest text-slate-500 text-center">AI Samarth Initiative</p>
                    </div>
                </div>

            </div>
          </div>
      </div>
    </div>
  );
};

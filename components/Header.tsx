
import React from 'react';
import { AiSamarthLogo, LOGO_CSF, LOGO_CHRYSALIS, LOGO_IITM, LOGO_WSAI } from './Branding';

export const Header: React.FC = () => {
  return (
    <header className="glass-header border-b border-white/10 h-16 md:h-20 flex-none z-30 shadow-sm relative transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-full flex items-center justify-between">
        <div className="flex items-center gap-4">
           {/* AI Samarth Logo */}
           <div className="hover:opacity-90 transition-opacity h-8 md:h-12 w-auto">
              <AiSamarthLogo />
           </div>
        </div>
        
        {/* Partner Logos */}
        <div className="hidden md:flex items-center gap-4 lg:gap-6 opacity-100">
           <img src={LOGO_CSF} alt="CSF" className="h-8 lg:h-10 object-contain hover:scale-105 transition-all duration-300" />
           <div className="h-4 lg:h-6 w-px bg-slate-300"></div>
           <img src={LOGO_CHRYSALIS} alt="Chrysalis" className="h-7 lg:h-9 object-contain hover:scale-105 transition-all duration-300" />
           <div className="h-4 lg:h-6 w-px bg-slate-300"></div>
           <img src={LOGO_IITM} alt="IIT Madras" className="h-8 lg:h-10 object-contain hover:scale-105 transition-all duration-300" />
           <div className="h-4 lg:h-6 w-px bg-slate-300"></div>
           <img src={LOGO_WSAI} alt="WSAI" className="h-6 lg:h-8 object-contain hover:scale-105 transition-all duration-300" />
        </div>
      </div>
    </header>
  );
};

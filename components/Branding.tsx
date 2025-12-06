
import React from 'react';

// External Image Assets
export const LOGO_CSF = "https://www.centralsquarefoundation.org/images/logo.svg";
export const LOGO_CHRYSALIS = "https://play-lh.googleusercontent.com/A1K_hY4ECF4DIN6fzmKTShVGyiDsMyhUPUD5AoGEqHPOblf96bHjgIqmyTHLrpHRHA";
export const LOGO_IITM = "https://upload.wikimedia.org/wikipedia/en/thumb/6/69/IIT_Madras_Logo.svg/300px-IIT_Madras_Logo.svg.png";
export const LOGO_WSAI = "https://cerai.iitm.ac.in/images/wsai-logo.png";
export const CERTIFICATE_BG_URL = "https://img.freepik.com/free-vector/white-elegant-texture-wallpaper_23-2148417584.jpg?t=st=1709210000~exp=1709210600~hmac=a4b4f5f5f5f5";

// Custom AI Samarth Logo SVG Component
export const AiSamarthLogo: React.FC = () => (
  <svg viewBox="0 0 320 85" className="h-full w-auto" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <clipPath id="triangleClip">
         <path d="M42.5 10 L10 75 Q5 85 20 85 L65 85 Q80 85 75 75 L42.5 10 Z" />
      </clipPath>
    </defs>
    {/* Triangle Base */}
    <path d="M42.5 10 L10 75 Q5 85 20 85 L65 85 Q80 85 75 75 L42.5 10 Z" fill="#002D62" />
    
    {/* Circuit lines (Left) */}
    <path d="M10 60 L25 60" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="10" cy="60" r="2.5" fill="white" />
    <path d="M5 72 L20 72" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="5" cy="72" r="2.5" fill="white" />
    
    {/* Circuit lines (Right) */}
    <path d="M75 60 L60 60" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="75" cy="60" r="2.5" fill="white" />
    <path d="M80 72 L65 72" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="80" cy="72" r="2.5" fill="white" />

    {/* Yellow Figure */}
    <circle cx="42.5" cy="48" r="10" fill="#FFD700" />
    <path d="M32.5 62 Q42.5 62 52.5 62 L52.5 85 L32.5 85 Z" fill="#FFD700" />
    
    {/* Stars Top Left */}
    <path d="M12 25 L14 20 L16 25 L21 27 L16 29 L14 34 L12 29 L7 27 Z" fill="#002D62" /> 
    <path d="M25 15 L26 12 L27 15 L30 16 L27 17 L26 20 L25 17 L22 16 Z" fill="#002D62" />

    {/* Text */}
    <text x="95" y="50" fontFamily="sans-serif" fontWeight="900" fontSize="38" fill="#002D62" letterSpacing="-1">AI Samarth</text>
    <text x="96" y="74" fontFamily="sans-serif" fontStyle="italic" fontSize="13" fill="#002D62" letterSpacing="0.2">Empowering Bharat with AI Literacy</text>
  </svg>
);

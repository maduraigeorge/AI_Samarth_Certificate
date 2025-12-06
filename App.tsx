
import React, { useState, useCallback, useEffect } from 'react';
import { Participant, CertificateConfig, AppView, EligibilityResult, QuizQuestion } from './types';
import { verifyAndLogUser, markDownloadInSheet, markQuizPassedInSheet } from './services/sheetService';
import { generateCertificateMessage, generateQuiz } from './services/geminiService';
import { Certificate } from './components/Certificate';
import { Quiz } from './components/Quiz';
import { Header } from './components/Header';
import { PortalView } from './components/PortalView';

const App: React.FC = () => {
  const [identifier, setIdentifier] = useState(''); // Was 'email'
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [eligibilityResult, setEligibilityResult] = useState<EligibilityResult | null>(null);
  
  const [view, setView] = useState<AppView>(AppView.PORTAL);
  const [certificateConfig, setCertificateConfig] = useState<CertificateConfig | null>(null);
  const [activeParticipantId, setActiveParticipantId] = useState<string | null>(null);

  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);

  // Security / Anti-Cheat
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F12') e.preventDefault();
      if ((e.ctrlKey || e.metaKey) && (e.shiftKey || e.altKey) && ['I', 'J', 'C'].includes(e.key.toUpperCase())) e.preventDefault();
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'u') e.preventDefault();
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleGenerateCertificateForStudent = useCallback(async (participant: Participant, topic: string) => {
    setActiveParticipantId(participant.id);
    const fullName = `${participant.firstName} ${participant.lastName}`;
    const aiMessage = await generateCertificateMessage(topic, participant);

    const config: CertificateConfig = {
      recipientName: fullName,
      webinarTitle: topic,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      customMessage: aiMessage
    };

    setCertificateConfig(config);
    setView(AppView.CERTIFICATE);
  }, []);

  const handleCheckEligibility = async (e: React.FormEvent) => {
      e.preventDefault();
      if(!identifier) return;

      setLoading(true);
      setEligibilityResult(null);
      setErrorMsg(null);
      
      try {
          const result = await verifyAndLogUser(identifier);
          setEligibilityResult(result);
      } catch (e: any) {
          console.error(e);
          setErrorMsg(e.message || "Unable to access records. Please try again later.");
      } finally {
          setLoading(false);
      }
  };

  const handleStartAssessment = async () => {
      if (!eligibilityResult?.participant || !eligibilityResult.webinarTopic) return;
      
      setLoading(true);
      try {
        // If user already passed locally or remotely, we could skip, but let's allow them to retake or just proceed.
        // For now, we generate the quiz.
        const questions = await generateQuiz(eligibilityResult.webinarTopic);
        setQuizQuestions(questions);
        setView(AppView.QUIZ);
      } catch (e) {
        console.error("Failed to start quiz", e);
        setErrorMsg("Failed to load assessment. Please try again.");
      } finally {
        setLoading(false);
      }
  };

  const handleViewCertificateDirectly = async () => {
     if (!eligibilityResult?.participant || !eligibilityResult.webinarTopic) return;
     setLoading(true);
     await handleGenerateCertificateForStudent(eligibilityResult.participant, eligibilityResult.webinarTopic);
     setLoading(false);
  };

  const handleQuizPassed = async () => {
      if (!eligibilityResult?.participant || !eligibilityResult.webinarTopic) return;
      
      setLoading(true);
      // Record the activity: Quiz Passed
      try {
        await markQuizPassedInSheet(eligibilityResult.participant.id);
        await handleGenerateCertificateForStudent(eligibilityResult.participant, eligibilityResult.webinarTopic);
      } catch (e) {
         console.error(e);
         setErrorMsg("Assessment passed, but failed to generate certificate. Please try again.");
      } finally {
        setLoading(false);
      }
  };

  const handleDownloadRecorded = async () => {
    if (!activeParticipantId) return;
    await markDownloadInSheet(activeParticipantId);
    if (eligibilityResult?.participant?.id === activeParticipantId) {
        setEligibilityResult(prev => {
            if (!prev || !prev.participant) return prev;
            return {
                ...prev,
                participant: {
                    ...prev.participant,
                    certificateDownloaded: true
                }
            };
        });
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col font-sans select-none bg-gradient-to-br from-slate-900 via-[#0f172a] to-slate-900 text-slate-800 relative">
      
      {/* Liquid Background Animation */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-600/30 blur-[100px] animate-blob mix-blend-multiply filter"></div>
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-600/30 blur-[100px] animate-blob animation-delay-2000 mix-blend-multiply filter"></div>
          <div className="absolute bottom-[-20%] left-[20%] w-[500px] h-[500px] rounded-full bg-purple-600/30 blur-[100px] animate-blob animation-delay-4000 mix-blend-multiply filter"></div>
      </div>

      <Header />

      {/* Main Content Area - Enforce single screen fit */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 relative z-10 overflow-hidden h-[calc(100vh-80px)]">
        
        <div className="w-full h-full flex flex-col items-center justify-center max-w-4xl mx-auto">
          
          {/* Error Toast */}
          {errorMsg && (
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-full max-w-lg bg-red-50/95 backdrop-blur border border-red-200 text-red-700 px-6 py-4 rounded-xl flex items-center gap-3 shadow-xl animate-fade-in-up z-50">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  <span className="text-sm font-medium">{errorMsg}</span>
                  <button onClick={() => setErrorMsg(null)} className="ml-auto text-red-400 hover:text-red-600"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg></button>
              </div>
          )}
          
          {/* --- VIEW: ATTENDEE PORTAL --- */}
          {view === AppView.PORTAL && (
            <PortalView 
                email={identifier}
                setEmail={setIdentifier}
                loading={loading}
                onCheckEligibility={handleCheckEligibility}
                eligibilityResult={eligibilityResult}
                onStartAssessment={handleStartAssessment}
                setErrorMsg={setErrorMsg}
            />
          )}
          
          {/* --- VIEW: QUIZ --- */}
          {view === AppView.QUIZ && eligibilityResult?.webinarTopic && (
             <Quiz 
               topic={eligibilityResult.webinarTopic}
               questions={quizQuestions}
               onPass={handleQuizPassed}
               onCancel={() => setView(AppView.PORTAL)}
             />
          )}

        </div>
      </main>

      {/* --- VIEW: CERTIFICATE MODAL --- */}
      {view === AppView.CERTIFICATE && certificateConfig && (
        <Certificate 
            config={certificateConfig} 
            onClose={() => {
              setView(AppView.PORTAL);
              setActiveParticipantId(null);
            }}
            onDownload={handleDownloadRecorded}
        />
      )}
    </div>
  );
};

export default App;

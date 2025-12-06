
export interface Participant {
  id: string;
  // --- Google Sheet Columns ---
  email: string;              // "Email"
  phone: string;              // "Phone", "Mobile", "Contact"
  firstName: string;          // "first_name"
  lastName: string;           // "last_name"
  totalDurationMins: number;  // "Total_Duration_Mins"
  schoolName: string;         // "School Name"
  gender: string;             // "Gender"
  gradeHandled: string;       // "Grade Handled"
  
  // --- App Logic Columns (Added by System) ---
  status: 'attended' | 'absent';
  quizPassed?: boolean;   // Added to track quiz activity
  certificateDownloaded?: boolean;
  loginTime?: string;     // Timestamp when they first verified/accessed the portal
  downloadTime?: string;  // Timestamp when they actually downloaded the PDF
}

export interface WebinarData {
  id: string;
  topic: string;
  startTime: string;
  duration: number; // scheduled duration
  participants: Participant[];
}

export interface CertificateConfig {
  recipientName: string;
  webinarTitle: string;
  date: string;
  customMessage?: string;
}

export interface EligibilityResult {
  eligible: boolean;
  reason: 'NOT_FOUND' | 'INSUFFICIENT_TIME' | 'ELIGIBLE';
  message: string;
  participant?: Participant;
  webinarTopic?: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  answer: string;
}

export enum AppView {
  PORTAL = 'PORTAL',
  DASHBOARD = 'DASHBOARD',
  QUIZ = 'QUIZ',
  CERTIFICATE = 'CERTIFICATE',
}

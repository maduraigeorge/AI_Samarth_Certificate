import { GoogleGenAI } from "@google/genai";
import { Participant, QuizQuestion } from '../types';

// Lazy initialization to prevent "process is not defined" crashes on page load in some local environments
const getAiClient = () => {
  const apiKey = typeof process !== 'undefined' ? process.env.API_KEY : '';
  if (!apiKey) {
    console.warn("API Key is missing or process.env is unavailable.");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateCertificateMessage = async (webinarTopic: string, participant: Participant): Promise<string> => {
  const fullName = `${participant.firstName} ${participant.lastName}`;
  
  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Write a short, professional, and inspiring single-sentence commendation for a certificate of completion for the "AI Samarth" training program. 
      The recipient is "${fullName}", a teacher at "${participant.schoolName}" who handles "${participant.gradeHandled}".
      The webinar topic was "${webinarTopic}".
      The tone should be formal, appreciating their effort to integrate AI into their teaching practice.
      Do not include the name in the sentence itself.
      Example output: "For demonstrating exceptional dedication to advancing digital literacy and AI adoption within Grade 5 education..."
      Output ONLY the sentence.`,
    });
    
    return response.text.trim();
  } catch (error) {
    console.error("Gemini generation failed", error);
    return `For successfully completing the AI Samarth training on ${webinarTopic}.`;
  }
};

const FIXED_QUIZ_POOL: QuizQuestion[] = [
  {
    id: 1,
    question: "AI means:",
    options: [
      "A machine that can think exactly like humans",
      "Technology that helps computers perform tasks like recognizing patterns and making decisions",
      "Any device that uses electricity",
      "A robot with a face"
    ],
    answer: "Technology that helps computers perform tasks like recognizing patterns and making decisions"
  },
  {
    id: 2,
    question: "True or False: AI needs data to learn and improve.",
    options: ["True", "False"],
    answer: "True"
  },
  {
    id: 3,
    question: "Which is an example of AI used in schools?",
    options: [
      "Smart attendance systems",
      "Chalkboard",
      "School bell",
      "Whiteboard marker"
    ],
    answer: "Smart attendance systems"
  },
  {
    id: 4,
    question: "Machine Learning means:",
    options: [
      "Machines learning on their own from data",
      "Machines being taught in a classroom",
      "Machines playing games",
      "Machines repaired by engineers"
    ],
    answer: "Machines learning on their own from data"
  },
  {
    id: 5,
    question: "True or False: AI always gives 100% correct answers.",
    options: ["True", "False"],
    answer: "False"
  },
  {
    id: 6,
    question: "What is AI “hallucination”?",
    options: [
      "AI becoming slow",
      "AI refusing to answer",
      "AI giving wrong or made-up information",
      "AI turning off suddenly"
    ],
    answer: "AI giving wrong or made-up information"
  },
  {
    id: 7,
    question: "Which is a safe way to use AI?",
    options: [
      "Uploading student personal details",
      "Sharing exam papers with AI",
      "Checking the AI output before using it",
      "Letting students use AI freely without guidance"
    ],
    answer: "Checking the AI output before using it"
  },
  {
    id: 8,
    question: "True or False: AI tools should always be supervised by teachers when used by students.",
    options: ["True", "False"],
    answer: "True"
  },
  {
    id: 9,
    question: "What is a dataset?",
    options: [
      "A group of desks",
      "A collection of data used to train AI",
      "A computer virus",
      "A school timetable"
    ],
    answer: "A collection of data used to train AI"
  },
  {
    id: 10,
    question: "Why can AI become biased?",
    options: [
      "AI has feelings",
      "AI gets tired",
      "AI learns from biased or incomplete data",
      "AI prefers certain users"
    ],
    answer: "AI learns from biased or incomplete data"
  },
  {
    id: 11,
    question: "True or False: AI should be used as a helper, not a replacement for teachers.",
    options: ["True", "False"],
    answer: "True"
  },
  {
    id: 12,
    question: "Which statement is correct?",
    options: [
      "AI can help teachers save time",
      "AI can do everything a teacher can",
      "AI should be trusted without checking",
      "AI does not need any data"
    ],
    answer: "AI can help teachers save time"
  }
];

export const generateQuiz = async (topic: string): Promise<QuizQuestion[]> => {
  // Return 6 random questions from the fixed pool
  const shuffled = [...FIXED_QUIZ_POOL].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 6);
};


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

export const generateQuiz = async (topic: string): Promise<QuizQuestion[]> => {
  try {
    const ai = getAiClient();
    // Updated prompt for 6 questions on AI for Teachers
    const prompt = `Generate 6 multiple-choice questions (MCQs) to test a teacher's understanding of "AI in Education" and the topic: "${topic}".
    The questions should cover basics of Generative AI, Prompt Engineering, and Ethical use of AI in classrooms.
    Ensure the questions are suitable for K-12 teachers.
    Provide the output strictly as a JSON array of objects.
    Each object must have:
    - "id" (number)
    - "question" (string)
    - "options" (array of 4 strings)
    - "answer" (string, must match one of the options exactly)
    
    Do not add markdown formatting like \`\`\`json. Just the raw JSON string.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });
    
    const text = response.text || "[]";
    const questions = JSON.parse(text);
    return questions;
  } catch (error) {
    console.error("Quiz generation failed", error);
    // Fallback quiz: 6 Questions on AI in Education
    return [
      {
        id: 1,
        question: "What is the primary function of a Large Language Model (LLM) like Gemini?",
        options: ["To store database records", "To generate human-like text based on patterns", "To physically move robots", "To replace all teachers"],
        answer: "To generate human-like text based on patterns"
      },
      {
        id: 2,
        question: "In the context of AI, what is a 'Prompt'?",
        options: ["A notification to update software", "The input text given to an AI to get a response", "A type of computer virus", "A sudden computer crash"],
        answer: "The input text given to an AI to get a response"
      },
      {
        id: 3,
        question: "How can AI best support teachers in the classroom?",
        options: ["By monitoring students every second", "By automating lesson planning and creating personalized resources", "By grading subjective art without context", "By replacing the need for schools"],
        answer: "By automating lesson planning and creating personalized resources"
      },
      {
        id: 4,
        question: "What is an 'AI Hallucination'?",
        options: ["When the AI generates confident but factually incorrect information", "When the screen flickers", "When AI predicts the future correctly", "When AI refuses to work"],
        answer: "When the AI generates confident but factually incorrect information"
      },
      {
        id: 5,
        question: "Which of the following is an ethical concern when using AI in education?",
        options: ["AI works too fast", "Data privacy and bias in outputs", "AI requires electricity", "AI uses too many colors"],
        answer: "Data privacy and bias in outputs"
      },
      {
        id: 6,
        question: "What is 'Personalized Learning' enabled by AI?",
        options: ["Teaching the exact same thing to everyone", "Adapting content and pace to individual student needs", "Only allowing students to learn from home", "Removing teachers from the process"],
        answer: "Adapting content and pace to individual student needs"
      }
    ];
  }
}

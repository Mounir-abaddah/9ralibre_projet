import type {typedata } from "@/store/userStore";
import type { Quiz } from "./QuizType";

export interface WrongAnswer {
  _id: string;
  question: string;
  correctAnswer: string;
  userAnswer: string;
}

export interface Results {
  _id: string;
  userId: typedata;      
  quizId: Quiz;    
  score: number;
  totalQuestions: number;
  wrongAnswers: WrongAnswer[];
  createdAt: string;
  updatedAt: string;
}
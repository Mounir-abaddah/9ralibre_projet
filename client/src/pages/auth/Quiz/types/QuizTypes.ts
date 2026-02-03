interface User{
    _id:string;
}

interface Professeur {
  _id: string;
  nom: string;
  prenom: string;
  image: string;
  role: string;
}

interface Niveaux {
  _id: string;
  nom: string;
}
interface Matiere {
  _id: string;
  nom: string;
}

export interface Question {
  _id: string;
  question: string;
  options: string[];
  correctAnswer: number; // index of correct option
}

export interface Quiz {
  _id: string;
  title: string;
  matiere: Matiere;
  niveaux: Niveaux;
  filiere: string;
  professeur: Professeur;
  questions: Question[];
  totalQuestions: number;
  createdAt: string;
}

export interface QuizAnswer {
  questionId: string;        
  selectedAnswer: number;    
  correctAnswer: number;     
  isCorrect: boolean;        
}

export interface QuizResult {
  _id: string;
  user: string | User;       
  quiz: string | Quiz;  
  answers: QuizAnswer[];
  score?: number;
  totalQuestions?: number;
  percentage?: number;
  passedAt: string;         
  createdAt?: string;
  updatedAt?: string;
}
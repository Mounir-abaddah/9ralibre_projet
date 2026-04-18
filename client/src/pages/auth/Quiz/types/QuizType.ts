import type { Matiere, Niveaux, Professeur } from "../../Video/types/video.type";

export interface question{
    _id:string;
    question:string;
    options:string[];
}



export interface Quiz{
    _id:string;
    text:string;
    matiere: Matiere;
    niveaux:Niveaux;
    filiere:string;
    professeur:Professeur
    questions:question[];
    alreadyPassed:boolean;
    blockedByCheating?: boolean;
    createdAt:string;
    updatedAt:string;
}

export interface QuizProf{
    _id:string;
    text:string;
    matiere: Matiere;
    niveaux:Niveaux;
    filiere:string;
    professeur:Professeur
    questions:question[];
    participants:string[]
    alreadyPassed:boolean;
    blockedByCheating?: boolean;
    createdAt:string;
    updatedAt:string;
}


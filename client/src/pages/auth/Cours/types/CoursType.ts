export interface Matiere {
  _id: string;
  nom: string;
  niveaux: string;
}

export interface User{
  _id: string;
  nom: string;
  prenom: string;
  email:string;
  role: "Etudiant" | "Etudiante" | "Professeur" | "Non renseigné";
  image: string;
}

export interface CoursType {
  _id: string;
  title: string;
  semestre: string;
  type: string;
  createdAt:string;
  professeur:User;
  filière:string;
  pdfUrl: string;
  matiere: Matiere;
  isSaved?: boolean;
}
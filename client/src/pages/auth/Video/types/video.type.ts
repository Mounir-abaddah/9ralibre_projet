export interface Professeur{
    _id:string;
    nom:string;
    prenom:string;
    image:string;
    role:string;
    following:string[];
    followers:string[];
}
export interface Niveaux{
    _id:string;
    nom:string;
}
export interface Matiere{
    _id:string;
    nom:string;
}

export interface Replies{
    _id:string;
    user:Professeur;
    text:string;
    createdAt:string;
    likes:string[];
}
export interface Comments{
    _id:string;
    user:Professeur;
    text:string;
    createdAt:string;
    likes:string[];
    replies:Replies[];
}
export interface TypeVideos{
    _id:string;
    title:string;
    description:string;
    videoUrl:string;
    thumbnail:string;
    matiere:Matiere;
    niveaux:Niveaux;
    views:number;
    filiere:string;
    professeur:Professeur;
    likes:string[];
    comments:Comments[];
    createdAt:string;
}

export interface TypeProfVideos{
    _id:string;
    title:string;
    description:string;
    videoUrl:string;
    thumbnail:string;
    matiere:Matiere;
    niveaux:Niveaux;
    views:number;
    filiere:string;
    professeur:Professeur;
    likes:string[];
    comments:Comments[];
    visibility:string
    createdAt:string;
}
export interface AsideVideosProps {
  search: string | null;
  matiere: string | null;
  filiere: string | null;
  setSearch: (value: string | null) => void;
  setMatiere: (value: string | null) => void;
  setFiliere: (value: string | null) => void;
}
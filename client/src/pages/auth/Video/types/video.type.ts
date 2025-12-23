interface Professeur{
    _id:string;
    nom:string;
    prenom:string;
    image:string;
    role:string;
    following:string[];
    followers:string[];
}
interface Niveaux{
    _id:string;
    nom:string;
}
interface Matiere{
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
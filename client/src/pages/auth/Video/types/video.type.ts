interface Professeur{
    _id:string;
    nom:string;
    prenom:string;
    image:string;
}
interface Niveaux{
    _id:string;
    nom:string;
}
interface Matiere{
    _id:string;
    nom:string;
    niveaux:Niveaux;
}

export interface TypeVideos{
    _id:string;
    title:string;
    description:string;
    videoUrl:string;
    thumbnail:string;
    matiere:Matiere;
    niveaux:Niveaux;
    views:string;
    filiere:string;
    professeur:Professeur;
    likes:string[];
    comments:string[];
    createdAt:string;
}
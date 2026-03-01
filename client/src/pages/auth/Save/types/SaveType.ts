import type { typedata } from "@/store/userStore";

export interface typeSave{
    _id:string;
    user:typedata;
    itemId:string;
    itemType:"Cours"|"Video"
    createdAt:string
}

export interface SavedVideo {
  _id: string
  title: string
  description: string
  thumbnail: string
  views: number
  createdAt: string
  professeur: {
    _id: string
    nom: string
    prenom: string
    image: string
  }
  matiere: {
    _id: string
    nom: string
  }
}

export interface SavedCours {
  _id: string
  title: string
  type: string
  semestre: string
  createdAt: string
  pdfUrl: string
  professeur: {
    _id: string
    nom: string
    prenom: string
    image: string
  }
  matiere: {
    _id: string
    nom: string
  }
  filière: string
}

export interface SaveResponse {
  success: boolean
  page: number
  limit: number
  totalSaved: number
  totalPages: number
  savedVideos?: SavedVideo[]
  savedCours?: SavedCours[]
}

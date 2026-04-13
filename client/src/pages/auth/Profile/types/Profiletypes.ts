export interface UserProfile {
  _id: string;
  nom: string;
  prenom: string;
  email: string;
  role: "Non renseigné" | "Etudiant" | "Etudiante" | "Professeur" | "Admin";
  niveaux: string;
  provider: "google" | "local";
  providerId?: number;
  image: string;
  accountVerified: boolean;
  completeProfile: boolean;
  status?: "pending" | "approved";
  events?: Array<{
    _id?: string;
    Date: string | Date;
    items: Array<{
      type: string;
      titre: string;
      Description?: string;
    }>;
  }>;
  followers: string[];
  following: string[];
  savedCours: string[];
  savedVideos: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ProfileResponse {
  user: UserProfile;
  success: boolean;
}
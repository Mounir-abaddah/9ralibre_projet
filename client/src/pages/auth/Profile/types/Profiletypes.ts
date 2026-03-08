export interface UserProfile {
  _id: string;
  nom: string;
  prenom: string;
  email: string;
  role: "Professeur" | "Etudiant" | "Admin";
  niveaux: string;
  provider: "google" | "local";
  providerId?: number;
  image: string;
  accountVerified: boolean;
  completeProfile: boolean;
  events: string[];
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
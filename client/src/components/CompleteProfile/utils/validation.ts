import type { FormDatatype, ErrorType } from "./type";

export const regexNames = /^[A-Za-z ]+$/;
export const regexPassword =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

export const validateForm = (
  formData: FormDatatype,
  setErrors: (e: ErrorType) => void,
  step: number,
): boolean => {
  const newErrors: ErrorType = {
    nom: "",
    prenom: "",
    role: "",
    niveaux:"",
  };

   let valid = true;


  if (step === 0) {
    if (!formData.nom.trim()) {
      newErrors.nom = "Veuillez entrer un nom valide";
      valid = false;
    }
    if (!formData.prenom.trim()) {
      newErrors.prenom = "Veuillez entrer un prénom valide";
      valid = false;
    }
    if (!formData.role.trim()) {
      newErrors.role = "Veuillez sélectionner votre statut";
      valid = false;
    }
  }


  if (step === 2) {
    if (!formData.niveaux.trim()) {
      newErrors.niveaux = "Veuillez sélectionner votre niveau";
      valid = false;
    }
  }
  setErrors(newErrors);
  return valid;
};

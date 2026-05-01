import type { FormDatatype, ErrorType } from "./type";
import type { TFunction } from "i18next";

export const regexNames = /^[A-Za-z ]+$/;
export const regexPassword =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

export const validateForm = (
  formData: FormDatatype,
  setErrors: (e: ErrorType) => void,
  step: number,
  t: TFunction,
): boolean => {
  const newErrors: ErrorType = {
    nom: "",
    prenom: "",
    role: "",
    niveaux: "",
  };

  let valid = true;

  if (step === 0) {
    if (!formData.nom.trim()) {
      newErrors.nom = t("completeProfile.errors.lastName");
      valid = false;
    }
    if (!formData.prenom.trim()) {
      newErrors.prenom = t("completeProfile.errors.firstName");
      valid = false;
    }
    if (!formData.role.trim()) {
      newErrors.role = t("completeProfile.errors.role");
      valid = false;
    }
  }

  if (step === 2) {
    if (!formData.niveaux.trim()) {
      newErrors.niveaux = t("completeProfile.errors.level");
      valid = false;
    }
  }
  setErrors(newErrors);
  return valid;
};

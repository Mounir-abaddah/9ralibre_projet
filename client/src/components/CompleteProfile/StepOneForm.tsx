import Input from "@/components/Form/Input";
import type { ErrorType, FormDatatype } from "./utils/type"
import RoleSelect from "./RoleSelect";
import { useTranslation } from "react-i18next";

interface Props{
    formData:FormDatatype;
    errors:ErrorType;
    onChange:(fields:string,v:string)=>void;
    onFocus: (fields: string) => void;
}

const StepOneForm = ({formData,errors,onChange,onFocus}:Props) => {
  const { t } = useTranslation();

  return (
    <div className="mt-2 flex w-full flex-col gap-5">
    <div className="flex flex-col gap-2 md:flex-row">
      <Input
        label={t("completeProfile.form.lastName")}
        id="Nom"
        placeholder={t("completeProfile.form.enterLastName")}
        value={formData.nom}
        onChange={(val) => onChange("nom", val)}
        onFocus={() => onFocus("nom")}
        error={errors.nom}
        className="dark:text-white"
      />
      <Input
        label={t("completeProfile.form.firstName")}
        id="Prenom"
        placeholder={t("completeProfile.form.enterFirstName")}
        value={formData.prenom}
        onChange={(val) => onChange("prenom", val)}
        onFocus={() => onFocus("prenom")}
        error={errors.prenom}
        className="dark:text-white"
      />
    </div>
    <RoleSelect
      value={formData.role}
      error={errors.role}
      onChange={(val) => onChange("role", val)}
    />
  </div>
  )
}

export default StepOneForm
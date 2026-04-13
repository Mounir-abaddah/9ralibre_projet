import Input from "@/components/Form/Input";
import type { ErrorType, FormDatatype } from "./utils/type"
import RoleSelect from "./RoleSelect";

interface Props{
    formData:FormDatatype;
    errors:ErrorType;
    onChange:(fields:string,v:string)=>void;
    onFocus: (fields: string) => void;
}

const StepOneForm = ({formData,errors,onChange,onFocus}:Props) => {
  return (
    <div className="mt-2 flex w-full flex-col gap-5">
    <div className="flex w-full gap-2">
      <Input
        label="Nom"
        id="Nom"
        placeholder="Entrez votre nom"
        value={formData.nom}
        onChange={(val) => onChange("nom", val)}
        onFocus={() => onFocus("nom")}
        error={errors.nom}
        className="dark:text-white"
      />
      <Input
        label="Prénom"
        id="Prenom"
        placeholder="Entrez votre prénom"
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
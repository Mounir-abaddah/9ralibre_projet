import Input from "@/components/Form/Input";
import type { ErrorType, FormDatatype } from "./utils/type"
import RoleSelect from "./RoleSelect";

interface Props{
    formData:FormDatatype;
    errors:ErrorType;
    onChange:(fields:string,v:string)=>void;
    onFocus: (fields: string) => void;
    provider?: string;
}

const StepOneForm = ({formData,errors,onChange,onFocus,provider}:Props) => {
  return (
    <div className="w-full flex flex-col gap-5 mt-2">
    <div className="w-full flex gap-2">
      <Input
        label="Nom"
        id="Nom"
        placeholder="Entrez votre nom"
        value={formData.nom}
        onChange={(val) => onChange("nom", val)}
        onFocus={() => onFocus("nom")}
        error={errors.nom}
      />
      <Input
        label="Prénom"
        id="Prenom"
        placeholder="Entrez votre prénom"
        value={formData.prenom}
        onChange={(val) => onChange("prenom", val)}
        onFocus={() => onFocus("prenom")}
        error={errors.prenom}
      />
    </div>

        <RoleSelect
        value={formData.role}
        error={errors.role}
        onChange={(val) => onChange("role", val)}
        />

    {provider === "google" && (
      <>
        <Input
          icon="lock"
          label="Mot de passe"
          id="Mot de passe"
          type="password"
          placeholder="Entrez votre mot de passe"
          value={formData.password}
          onChange={(val) => onChange("password", val)}
          onFocus={() => onFocus("password")}
          error={errors.password}
        />
        <Input
          icon="lock"
          label="Confirmation du mot de passe"
          id="confirmPassword"
          type="password"
          placeholder="Confirmez votre mot de passe"
          onFocus={() => onFocus("confirmPassword")}
          value={formData.confirmPassword}
          onChange={(val) => onChange("confirmPassword", val)}
          error={errors.confirmPassword}
        />
      </>
    )}
  </div>
  )
}

export default StepOneForm
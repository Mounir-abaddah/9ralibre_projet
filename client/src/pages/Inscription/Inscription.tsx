import logo_inscription from "@/assets/images/inscription/Exams-rafiki.png";
import gralibre from "@/assets/images/9ralibre.png";
import { LogIn, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "@/components/Oauth/OAuth";
import axios from "axios";
import toast from "react-hot-toast";
import Loadering from "@/components/Loadering/Loadering";
import Input from "@/components/Form/Input";
import { RoughNotation } from "react-rough-notation";

const regexNames = /^[A-Za-z ]+$/;
const regexEmail = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const regexPassword = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

const Inscription = () => {
  document.title = "Inscription gratuite | 9ralibre";
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [showOption, setShowOption] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    role: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    nom: "",
    prenom: "",
    role: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const options = [
    { name: "Etudiant", icon: "👦" },
    { name: "Etudiante", icon: "👩🏽‍" },
  ];

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleFocus = (field: string) => {
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateForm = () => {
    const newErrors = { ...errors };
    let valid = true;

    if (!formData.nom.trim() || !regexNames.test(formData.nom)) {
      newErrors.nom = "Veuillez entrer un nom valide";
      valid = false;
    }

    if (!formData.prenom.trim() || !regexNames.test(formData.prenom)) {
      newErrors.prenom = "Veuillez entrer un prénom valide";
      valid = false;
    }

    if (!formData.email.trim() || !regexEmail.test(formData.email)) {
      newErrors.email = "Veuillez entrer une adresse email valide";
      valid = false;
    }

    if (!formData.role) {
      newErrors.role = "Veuillez sélectionner votre statut";
      valid = false;
    }

    if (!regexPassword.test(formData.password)) {
      newErrors.password =
        "Minimum 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial";
      valid = false;
    }

    if (
      formData.password !== formData.confirmPassword ||
      !formData.confirmPassword
    ) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleForm = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.post(`${apiUrl}/auth/register`, formData);

      if (data.success) {
        localStorage.setItem("show-verification", "true");
        navigate("/");
        toast.success(
          "Vous allez recevoir un email pour vérifier votre compte 🎉"
        );
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        toast.error(err.response.data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setShowOption(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex h-screen min-h-max w-full items-center justify-center gap-2 p-4 lg:justify-around">
      {/* Image section */}
      <div className="hidden w-full lg:block">
        <img
          src={logo_inscription}
          alt="logo_inscription"
          width={700}
          height={700}
        />
      </div>

      {/* Form section */}
      <div className="relative flex w-full flex-col gap-3 rounded-md bg-white p-10 shadow-md">
        {/* Logo */}
        <Link to="/">
          <img
            src={gralibre}
            alt="logo_9ralibre"
            width={150}
            className="absolute -top-2.5 right-0 w-20 rotate-6 cursor-pointer transition-all hover:w-24 md:w-36 lg:w-40"
          />
        </Link>

        {/* Title */}
        <div>
          <h2 className="text-3xl font-medium">
            Commençons <br /> à apprendre avec{" "}
            <span className="font-semibold text-amber-500">
              9ral<span className="text-sky-500">ibre</span>
            </span>
          </h2>
          <p className="text-sm">Veuillez vous inscrire ou vous connecter</p>
        </div>

        {/* Link to login */}
        <p>
          Déjà un compte ?{" "}
          <Link
            to="/connexion"
            className="text-sm text-sky-300 hover:text-sky-400"
          >
            <RoughNotation
              strokeWidth={5}
              type="highlight"
              show={true}
              color="oklch(82.8% 0.189 84.429)"
            >
              Connectez-vous
            </RoughNotation>
          </Link>
        </p>

        {/* OAuth */}
        <OAuth
          text_1={`S'inscrire avec Google`}
          text_2={`S'inscrire avec Microsoft`}
        />

        {/* Form */}
        <form onSubmit={handleForm} className="mt-2 flex flex-col gap-3">
          {/* Nom & Prenom */}
          <div className="flex gap-3">
            <Input
              label="Nom"
              id="nom"
              type="text"
              placeholder="Votre Nom"
              onFocus={() => handleFocus("nom")}
              value={formData.nom}
              onChange={(val) => handleChange("nom", val)}
              error={errors.nom}
            />
            <Input
              label="Prénom"
              id="prenom"
              type="text"
              placeholder="Votre Prénom"
              onFocus={() => handleFocus("prenom")}
              value={formData.prenom}
              onChange={(val) => handleChange("prenom", val)}
              error={errors.prenom}
            />
          </div>

          {/* Role */}
          <div ref={ref} className="relative flex flex-col gap-1">
            <h3 className="font-semibold">Votre statut</h3>
            <div
              onClick={() => setShowOption(!showOption)}
              className={`flex items-center justify-between rounded-md border p-2 cursor-pointer ${
                errors.role && "border-red-400 bg-red-100"
              }`}
            >
              <span className={errors.role ? "text-black" : "text-gray-500"}>
                {formData.role || "Sélectionnez votre statut"}
              </span>
              <ChevronDown size={15} />
            </div>
            {showOption && (
              <div className="absolute top-17 left-0 z-10 w-full rounded-md border-2 bg-white shadow-lg">
                {options.map((item) => (
                  <div
                    key={item.name}
                    onClick={() => {
                      handleChange("role", item.name);
                      setShowOption(false);
                    }}
                    className="cursor-pointer p-2 hover:bg-amber-100"
                  >
                    {item.icon} {item.name}
                  </div>
                ))}
              </div>
            )}
            {errors.role && (
              <p className="text-sm font-bold text-red-400">{errors.role}</p>
            )}
          </div>

          {/* Email */}
          <Input
            icon="mail"
            label="Email"
            id="email"
            type="email"
            placeholder="Votre Email"
            onFocus={() => handleFocus("email")}
            value={formData.email}
            onChange={(val) => handleChange("email", val)}
            error={errors.email}
          />

          {/* Password */}
          <Input
            icon="lock"
            label="Mot de passe"
            id="password"
            type="password"
            placeholder="Votre mot de passe"
            onFocus={() => handleFocus("password")}
            value={formData.password}
            onChange={(val) => handleChange("password", val)}
            error={errors.password}
          />

          {/* Confirm Password */}
          <Input
            icon="lock"
            label="Confirmation du mot de passe"
            id="confirmPassword"
            type="password"
            placeholder="Confirmez votre mot de passe"
            onFocus={() => handleFocus("confirmPassword")}
            value={formData.confirmPassword}
            onChange={(val) => handleChange("confirmPassword", val)}
            error={errors.confirmPassword}
          />

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-md bg-amber-300 p-3 font-semibold text-black hover:bg-amber-400 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-300"
          >
            {loading && <Loadering />}
            <span>Inscrivez-vous</span>
            <LogIn />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Inscription;

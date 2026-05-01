import logo_inscription from "@/assets/images/inscription/Exams-rafiki.png";
import gralibre from "@/assets/images/9ralibre.png";
import { LogIn } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "@/components/Oauth/OAuth";
import axios from "axios";
import toast from "react-hot-toast";
import Loadering from "@/components/Loadering/Loadering";
import Input from "@/components/Form/Input";
import { RoughNotation } from "react-rough-notation";
import { useTranslation } from "react-i18next";

const regexEmail = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const regexPassword = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

const Inscription = () => {
  const { t } = useTranslation();
  document.title = t("inscription.pageTitle");
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

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

    if (!formData.email.trim() || !regexEmail.test(formData.email)) {
      newErrors.email = t("auth.errors.invalidEmail");
      valid = false;
    }

    if (!regexPassword.test(formData.password)) {
      newErrors.password = t("auth.errors.weakPassword");
      valid = false;
    }

    if (formData.password !== formData.confirmPassword || !formData.confirmPassword) {
      newErrors.confirmPassword = t("auth.errors.passwordMismatch");
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
        toast.success(t("inscription.successToast"));
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        toast.error(err.response.data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen min-h-max w-full items-center justify-center gap-2 p-4 lg:justify-around dark:text-black">
      <div className="hidden w-full lg:block">
        <img src={logo_inscription} alt="logo_inscription" width={700} height={700} loading="lazy" />
      </div>

      <div className="relative flex w-full flex-col gap-3 rounded-md bg-white p-10 shadow-md">
        <Link to="/">
          <img
            src={gralibre}
            alt="logo_9ralibre"
            width={150}
            loading="lazy"
            className="absolute -top-2.5 right-0 w-20 rotate-6 cursor-pointer transition-all hover:w-24 md:w-36 lg:w-40"
          />
        </Link>

        <div>
          <h2 className="text-3xl font-medium">
            {t("auth.headline1")} <br /> {t("auth.headline2")}{" "}
            <span className="font-semibold text-amber-500">
              9ral<span className="text-sky-500">ibre</span>
            </span>
          </h2>
          <p className="text-sm">{t("inscription.subtitle")}</p>
        </div>

        <p>
          {t("inscription.alreadyAccount")}{" "}
          <Link to="/connexion" className="text-sm text-sky-300 hover:text-sky-400">
            <RoughNotation strokeWidth={5} type="highlight" show={true} color="oklch(82.8% 0.189 84.429)">
              {t("inscription.loginLink")}
            </RoughNotation>
          </Link>
        </p>

        <OAuth text_1={t("inscription.oauthGoogle")} />

        <form onSubmit={handleForm} className="flex flex-col gap-4">
          <Input
            icon="mail"
            label={t("auth.fields.email")}
            id="MonEmail"
            type="email"
            placeholder={t("auth.fields.emailPlaceholder")}
            onFocus={() => handleFocus("email")}
            value={formData.email}
            onChange={(val) => handleChange("email", val)}
            error={errors.email}
            className="dark:text-black"
          />

          <Input
            icon="lock"
            label={t("auth.fields.password")}
            id="password"
            type="password"
            placeholder={t("auth.fields.passwordPlaceholder")}
            onFocus={() => handleFocus("password")}
            value={formData.password}
            onChange={(val) => handleChange("password", val)}
            error={errors.password}
            className="dark:text-black"
          />

          <Input
            icon="lock"
            label={t("auth.fields.confirmPassword")}
            id="confirmPassword"
            type="password"
            placeholder={t("auth.fields.confirmPasswordPlaceholder")}
            onFocus={() => handleFocus("confirmPassword")}
            value={formData.confirmPassword}
            onChange={(val) => handleChange("confirmPassword", val)}
            error={errors.confirmPassword}
            className="dark:text-black"
          />

          <button
            type="submit"
            disabled={loading}
            className="flex cursor-pointer items-center justify-center gap-2 rounded-md bg-amber-500 p-3 font-semibold text-white transition duration-300 hover:bg-amber-600 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-300"
          >
            {loading && <Loadering />}
            <span>{t("inscription.submit")}</span>
            <LogIn />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Inscription;
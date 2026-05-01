import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { RoughNotation } from "react-rough-notation";
import { LogIn } from "lucide-react";
import img_login from "@/assets/images/connexion/Thesis-pana.png";
import logo from "@/assets/images/9ralibre.png";
import OAuth from "@/components/Oauth/OAuth";
import Loadering from "@/components/Loadering/Loadering";
import Input from "@/components/Form/Input";
import { useProtectedRoutes } from "@/store/userStore";
import { useTranslation } from "react-i18next";

const Connexion = () => {
  const { t } = useTranslation();
  document.title = t("connexion.pageTitle");
  const apiUrl = import.meta.env.VITE_API_URL;
  const { fetchData } = useProtectedRoutes();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [serverMessage, setServerMessage] = useState("");
  const [isBlockedNotice, setIsBlockedNotice] = useState(false);

  useEffect(() => {
    const error = searchParams.get("error");
    if (error === "blocked") {
      setServerMessage(t("connexion.blocked"));
      setIsBlockedNotice(true);
    }
  }, [searchParams, t]);

  const regexEmail = /^[a-zA-Z][a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const regexPassword = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleFocus = (field: string) => {
    setErrors((prev) => ({ ...prev, [field]: "" }));
    setServerMessage("");
  };

  const handleForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setServerMessage("");

    let valid = true;
    const newErrors = { email: "", password: "" };

    if (!form.email.trim() || !regexEmail.test(form.email)) {
      newErrors.email = t("auth.errors.invalidEmail");
      valid = false;
    }

    if (!regexPassword.test(form.password)) {
      newErrors.password = t("auth.errors.weakPassword");
      valid = false;
    }

    setErrors(newErrors);

    if (!valid) {
      setLoading(false);
      return;
    }

    try {
      const reponse = await axios.post(`${apiUrl}/auth/connexion`, form, { withCredentials: true });
      if (reponse.data.success) {
        await fetchData();
        toast.success(reponse.data.message);
        navigate("/");
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      if (err.response?.data?.message) {
        setServerMessage(err.response.data.message);
        newErrors.email = " ";
        newErrors.password = " ";
        setErrors(newErrors);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen min-h-max w-full items-center justify-around gap-2 p-4 md:h-screen dark:text-black">
      <div className="hidden w-full lg:block">
        <img src={img_login} alt="Connexion illustration" width={700} height={700} />
      </div>

      <div className="relative flex w-full flex-col items-start gap-3 rounded-md bg-white p-5 shadow-xl">
        <Link to="/">
          <img
            src={logo}
            alt="logo_9ralibre"
            width={150}
            loading="lazy"
            className="absolute -top-2.5 right-0 w-20 rotate-6 cursor-pointer transition-all hover:w-24 md:w-36 hover:md:w-40 lg:w-40 hover:lg:w-44"
          />
        </Link>

        <div className="w-full">
          <h2 className="text-3xl font-medium">
            {t("auth.headline1")} <br /> {t("auth.headline2")}{" "}
            <span className="font-semibold text-amber-500">
              9ral<span className="text-sky-500">ibre</span>
            </span>
          </h2>
          <p className="text-sm">{t("connexion.subtitle")}</p>
        </div>

        <div className="flex w-full items-center justify-start">
          <p>
            {t("connexion.noAccount")}{" "}
            <Link
              to="/inscription"
              className="border-b border-sky-200 text-sm text-sky-300 transition-all duration-400 hover:text-sky-400 lg:text-base"
            >
              <RoughNotation strokeWidth={5} type="highlight" show={true} color="oklch(82.8% 0.189 84.429)">
                {t("connexion.signUpLink")}
              </RoughNotation>
            </Link>
          </p>
        </div>

        <div className="flex w-full flex-wrap items-center justify-around gap-4">
          <OAuth text_1={t("connexion.oauthGoogle")} />
        </div>

        {serverMessage && (
          <div className="w-full rounded-md border-l-2 border-red-500 bg-red-100 p-2 text-red-700">
            <p>{serverMessage}</p>
            {isBlockedNotice && (
              <Link to="/appeal" className="mt-1 inline-block text-sm font-semibold underline">
                {t("connexion.unblockRequest")}
              </Link>
            )}
          </div>
        )}

        <form onSubmit={handleForm} className="flex w-full flex-col gap-1.5">
          <Input
            placeholder="e.g@email.ma"
            label={t("auth.fields.email")}
            id="monEmail"
            value={form.email}
            type="email"
            onFocus={() => handleFocus("email")}
            onChange={(val) => handleChange("email", val)}
            icon="mail"
            error={errors.email}
            className="dark:text-black"
          />

          <Input
            placeholder={t("auth.fields.passwordPlaceholder")}
            label={t("auth.fields.password")}
            id="password"
            value={form.password}
            type="password"
            onFocus={() => handleFocus("password")}
            onChange={(val) => handleChange("password", val)}
            icon="lock"
            error={errors.password}
            className="dark:text-black"
          />

          <div className="flex w-full items-end justify-end">
            <Link
              to="/password/reset"
              className="border-b border-sky-200 font-semibold text-sky-500 transition-all duration-400 hover:text-blue-400"
            >
              {t("connexion.forgotPassword")}
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-amber-500 p-3 text-base font-semibold text-black transition-all duration-300 hover:bg-amber-600 hover:shadow-md disabled:bg-slate-50 disabled:shadow dark:text-white"
          >
            {loading && <Loadering />}
            <h2>{t("connexion.submit")}</h2>
            <LogIn />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Connexion;
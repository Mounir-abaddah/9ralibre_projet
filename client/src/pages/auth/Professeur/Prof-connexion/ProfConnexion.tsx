import Teacher_img from "/assets/images/Teaching-cuate.png";
import logo from "/assets/images/9ralibre.png";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Input from "@/components/Form/Input";
import { useState } from "react";
import axios from "axios";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CircleAlert } from "lucide-react";
import {
  fieldErrorsFromIssues,
  messagesFromApiData,
  type ProfApiErrorBody,
} from "@/utils/profApiErrors";
import { useTranslation } from "react-i18next";

const ProfConnexion = () => {
  const { t } = useTranslation();
  const apiUrl = import.meta.env.VITE_API_URL;
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errformData, seterrFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    seterrFormData((prev) => ({ ...prev, [field]: "" }));
  };

  const handleFocus = (field: string) => {
    seterrFormData((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // reset error
    setErrorMsg("");

    // validation simple
    const errors = {
      email: "",
      password: "",
    };

    if (!formData.email) errors.email = t("prof.login.requiredEmail");
    if (!formData.password) errors.password = t("prof.login.requiredPassword");

    seterrFormData(errors);

    const hasError = Object.values(errors).some((e) => e !== "");
    if (hasError) return;

    try {
      setLoading(true);

      const res = await axios.post(
        `${apiUrl}/prof/login`,
        {
          email: formData.email,
          password: formData.password,
        },
        {
          withCredentials: true,
        },
      );
      if (res.data.success) {
        window.location.href = "/prof/dashboard";
      }
    } catch (err) {
      if (!axios.isAxiosError(err)) {
        setErrorMsg(t("prof.common.errorOccurred"));
        return;
      }
      const data = err.response?.data as ProfApiErrorBody | undefined;
      const issues = data?.issues;
      if (issues?.length) {
        seterrFormData((prev) => ({
          ...prev,
          ...fieldErrorsFromIssues(issues),
        }));
        setErrorMsg("");
      } else {
        const msg =
          typeof data?.message === "string" && data.message.trim()
            ? data.message.trim()
            : messagesFromApiData(data).join(" · ") ||
              t("prof.common.serverError");
        setErrorMsg(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[url('/backgorund_teacher.jpg')] bg-cover bg-no-repeat  px-4">
      {/* Logo */}
      <Link to={"/"}>
        <img
          src={logo}
          alt={t("prof.auth.logoAlt")}
          className="absolute top-4 left-4 w-20 object-contain"
        />
      </Link>

      <div className="grid w-full max-w-5xl grid-cols-1 overflow-hidden rounded-3xl border border-white/40 bg-white/70 shadow-2xl backdrop-blur-xl md:grid-cols-2 dark:bg-white">
        {/* Image */}
        <div className="hidden items-center justify-center bg-blue-50/50 p-6 md:flex">
          <img
            src={Teacher_img}
            alt={t("prof.login.teacherImageAlt")}
            className="w-full max-w-md object-contain drop-shadow-lg"
          />
        </div>

        {/* Formulaire */}
        <div className="flex flex-col justify-center p-8">
          <h2 className="mb-2 text-3xl font-bold text-gray-800">
            {t("prof.login.title")}
          </h2>

          <p className="mb-6 text-gray-500">{t("prof.login.subtitle")}</p>

          <span className="mb-4 text-sm dark:text-black">
            {t("prof.login.noAccount")}{" "}
            <Link
              to={"/prof-inscription"}
              className="font-medium text-cyan-600 hover:underline"
            >
              {t("prof.login.createAccount")}
            </Link>
          </span>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {errorMsg && (
              <Alert
                variant="destructive"
                className="border-red-200 bg-red-50 text-red-900 dark:bg-red-950/40 dark:text-red-100"
              >
                <CircleAlert className="size-4" />
                <AlertTitle className="text-sm font-semibold">
                  {t("prof.login.impossibleTitle")}
                </AlertTitle>
                <AlertDescription className="text-sm text-red-800 dark:text-red-200">
                  {errorMsg}
                </AlertDescription>
              </Alert>
            )}

            {/* Email */}
            <Input
              type="email"
              placeholder={t("prof.settings.email")}
              id="email"
              label={t("prof.settings.email")}
              icon="mail"
              onChange={(val) => handleChange("email", val)}
              value={formData.email}
              onFocus={() => handleFocus("email")}
              error={errformData.email}
              className="text-black dark:text-black"
            />

            {/* Password */}
            <Input
              type="password"
              placeholder={t("prof.settings.newPassword")}
              id="password"
              label={t("prof.settings.newPassword")}
              onChange={(val) => handleChange("password", val)}
              value={formData.password}
              onFocus={() => handleFocus("password")}
              icon="lock"
              error={errformData.password}
              className="text-black dark:text-black"
            />

            <div className="mt-2 text-right">
              <Link
                to="/prof/password/reset"
                className="text-xs text-amber-600 hover:underline"
              >
                {t("prof.login.forgotPassword")}
              </Link>
            </div>

            {/* Bouton */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full cursor-pointer bg-amber-600 transition duration-300 hover:bg-amber-700"
            >
              {loading ? t("prof.login.loading") : t("prof.login.submit")}
            </Button>
          </form>

          {/* Footer */}
          <p className="mt-6 text-center text-sm text-gray-400">
            © 2026 9ralibre
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfConnexion;

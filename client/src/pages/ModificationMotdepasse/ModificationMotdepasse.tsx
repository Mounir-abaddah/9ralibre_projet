import Input from "@/components/Form/Input";
import Loadering from "@/components/Loadering/Loadering";
import axios, { AxiosError } from "axios";
import { useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import ralibre_logo from "/assets/images/9ralibre.png";
import { useTranslation } from "react-i18next";

interface ApiResponse {
  success: boolean;
  message: string;
}

const ModificationMotdepasse = () => {
  const { t } = useTranslation();
  const { token } = useParams();
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  const [form, setForm] = useState({ password: "" });
  const [errors, setErrors] = useState({ password: "" });
  const [loading, setLoading] = useState(false);
  const [serverMessage, setServerMessage] = useState("");

  const regexPassword =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

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
    const newErrors = { password: "" };

    if (!regexPassword.test(form.password)) {
      newErrors.password = t("auth.errors.weakPasswordLong");
      valid = false;
    }

    setErrors(newErrors);

    if (!valid) {
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.put<ApiResponse>(
        `${apiUrl}/auth/resetPassword/${token}`,
        { password: form.password },
      );

      if (data.success) {
        toast.success(data.message);
        navigate("/connexion");
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      if (err.response?.data?.message) {
        setServerMessage(err.response.data.message);
        setErrors({ password: " " });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl">
      <header>
        <img
          src={ralibre_logo}
          alt="9ralibre_logo"
          width={200}
          loading="lazy"
        />
      </header>

      <div className="rounded-t-lg bg-gray-100 px-6 py-4 text-center">
        <h2 className="mb-0 flex items-center justify-center text-xl font-semibold text-[#3F3F3F]">
          <span>{t("resetPassword.title")}</span>
        </h2>
      </div>

      <div className="bg-white p-8">
        {serverMessage && (
          <p className="mb-4 w-full rounded-md border-l-2 border-red-500 bg-red-100 p-2 text-red-700">
            {serverMessage}
          </p>
        )}

        <form onSubmit={handleForm}>
          <div className="mb-6">
            <Input
              id="password"
              label={t("resetPassword.label")}
              placeholder={t("resetPassword.placeholder")}
              type="password"
              value={form.password}
              onFocus={() => handleFocus("password")}
              onChange={(val) => handleChange("password", val)}
              icon="lock"
              error={errors.password}
              className="dark:text-black"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`flex w-full items-center justify-center gap-2 rounded-md p-2
              ${loading ? "cursor-not-allowed bg-slate-300" : "cursor-pointer bg-amber-400"}
              transition duration-300 ease-in hover:bg-amber-500`}
          >
            {loading && <Loadering />}
            <span className="text-[#3f3f3f]">{t("resetPassword.submit")}</span>
          </button>
        </form>

        <hr className="my-8" />

        <div className="text-right">
          <Link to="/" className="border-b border-b-sky-400 dark:text-cyan-500">
            {t("auth.backToSite")}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ModificationMotdepasse;

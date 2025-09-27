import React, { useState, type FormEvent } from "react";
import img_login from "@/assets/images/connexion/Thesis-pana.png";
import logo from "@/assets/images/9ralibre.png";
import OAuth from "@/components/Oauth/OAuth";
import { LogIn } from "lucide-react";
import Loadering from "@/components/Loadering/Loadering";
import Input from "@/components/Form/Input";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { RoughNotation } from "react-rough-notation";

const Connexion = () => {
  document.title = 'Je me connecte | 9ralibre';
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [Loading, setLoading] = useState<boolean>(false);
  const [Message,setMessage] = useState<string>("")


  const [email, setEmail] = useState<string>("");
  const [ErrEmail, setErrEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [ErrPassword, setErrPassword] = useState<string>("");

  const handleForm = async (e: FormEvent) => {
    e.preventDefault();
    let Valid = true;
    const regexEmail = /^[a-zA-Z][a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex =
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
    setLoading(true);

    if (!email.trim() || !regexEmail.test(email)) {
      setErrEmail("Veuillez entrer une adresse email valide");
      Valid = false;
    } else {
      setErrEmail("");
    }

    if (!passwordRegex.test(password)) {
      setErrPassword(
        "Minimum huit caractères, une majuscule, une minuscule, un chiffre et un caractère spécial",
      );
      Valid = false;
    } else {
      setErrPassword("");
    }

    if (!Valid) {
      setLoading(false);
      return;
    }
    try {
      const response = await axios.post(
        `${apiUrl}/auth/connexion`,
        {
          email,
          password,
        },
        { withCredentials: true },
      );

      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/Dashboard");
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setMessage(err.response.data.message);
        setErrEmail(" ")
        setErrPassword(" ")
      }
    }
    setLoading(false);
  };
  return (
      <div className="flex h-screen w-full items-center justify-around gap-2 p-4 md:h-screen min-h-max">
        <div className="hidden w-full lg:block">
          <img
            src={img_login}
            alt="logo_inscription"
            width={700}
            height={700}
          />
        </div>
        <div className="relative flex w-full flex-col items-start gap-3 rounded-md bg-white p-5 shadow-xl">
          <Link to={"/"}>
          <img
            src={logo}
            alt="logo_9ralibre"
            width={150}
            className="absolute -top-2.5 right-0 w-20 rotate-6 cursor-pointer transition-all hover:w-24 md:w-36 hover:md:w-40 lg:w-40 hover:lg:w-44"
          />
        </Link>
          <div className="w-full">
            <h2 className="text-3xl font-medium">
              Commençons <br />à apprendre avec{" "}
              <span className="font-semibold text-amber-500">
                9ral<span className="text-sky-500">ibre</span>
              </span>
            </h2>
            <p className="text-sm">
              Veuillez vous se connecter ou s'inscrire pour continuer
            </p>
          </div>
          <div className="flex w-full items-center justify-start">
              <p>
                Pas encore de compte ?{" "}
                <Link
                  to={"/inscription"}
                  className="lg:text-base text-sm border-b border-sky-200 text-sky-300 transition-all duration-400 hover:text-sky-400"
                >
                  <RoughNotation strokeWidth={5} type="highlight" show={true} color="oklch(82.8% 0.189 84.429)">Inscrivez-vous</RoughNotation>
                </Link>
              </p>
            </div>
          <div className="flex w-full flex-wrap items-center justify-around gap-4">
            <OAuth
              text_1="Se connecter avec Google"
              text_2="Se connecter avec Miscrosoft"
            />
          </div>
          {Message && <p className="p-2 border-l-2 border-red-500 bg-red-100 text-red-700 rounded-md w-full">{Message}</p>}
          <div className="flex w-full flex-col items-center gap-3">
            <form
              onSubmit={handleForm}
              className="flex w-full flex-col gap-1.5"
            >
              <div className="flex w-full flex-col items-start gap-1">
                <Input
                  placeholder="e.g@email.ma"
                  label="Email"
                  id="monEmail"
                  value={email}
                  type="email"
                  onChange={setEmail}
                  onFocus={() => setErrEmail("")}
                  icon="mail"
                  error={ErrEmail}
                />
              </div>
              <div className="flex w-full flex-col items-start gap-1">
                <Input
                  placeholder="Votre Mot de passe"
                  label="Mot de passe"
                  id="password"
                  value={password}
                  type="password"
                  onChange={setPassword}
                  onFocus={() => setErrPassword("")}
                  icon="lock"
                  error={ErrPassword}
                />
              </div>
              <div className="flex w-full items-end justify-end">
                <p>
                  <Link
                    to={"/password/reset"}
                    className="border-b border-sky-200 font-semibold text-sky-500 transition-all duration-400 hover:text-blue-400"
                  >
                    Mot de passe oublié ?
                  </Link>
                </p>
              </div>
              <button
                type="submit"
                disabled={Loading}
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-amber-300 p-3 text-base font-semibold text-black transition-all duration-300 hover:bg-amber-400 hover:shadow-md disabled:bg-slate-50 disabled:shadow dark:text-white"
              >
                {Loading ? <Loadering /> : ""}
                <h2>Connectez-vous</h2>
                <LogIn />
              </button>
            </form>
          </div>
        </div>
      </div>
  );
};

export default Connexion;

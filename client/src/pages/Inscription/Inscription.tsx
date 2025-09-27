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

const Inscription = () => {
  document.title = 'Inscription gratuite | 9ralibre'
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [Loading, setLoading] = useState<boolean>(false);
  const [showOption, setshowOption] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement>(null);
  
  const handleShow = () => {
    setshowOption(!showOption);
    seterrRole("")
  };
  const option = [
    {
      name: "Etudiant",
      icon: "👦",
    },
    {
      name: "Etudiante",
      icon: "👩🏽‍",
    },
  ];

  const [nom, setNom] = useState<string>("");
  const [ErrNom, setErrNom] = useState<string>("");

  const [prenom, setPrenom] = useState<string>("");
  const [ErrPrenom, setErrPrenom] = useState<string>("");

  const [email, setEmail] = useState<string>("");
  const [ErrEmail, setErrEmail] = useState<string>("");

  const [role, setrole] = useState<string>("");
  const [errRole, seterrRole] = useState<string>("");

  const [password, setPassword] = useState<string>("");
  const [ErrPassword, setErrPassword] = useState<string>("");

  const [ComfirmPassword, setComfirmPassword] = useState<string>("");
  const [ErrComfirmPassword, setErrComfirmPassword] = useState<string>("");


  const handleForm = async (e: FormEvent) => {
    e.preventDefault();
    let Valid = true;
    const regexNames = /^[A-Za-z ]+$/;
    const regexEmail = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
    setLoading(true);

    if (!nom.trim() || !regexNames.test(nom)) {
      setErrNom("Veuillez entrer un nom valide");
      Valid = false;
    } else {
      setErrNom("");
    }

    if (!prenom.trim() || !regexNames.test(prenom)) {
      setErrPrenom("Veuillez entrer un prénom valide");
      Valid = false;
    } else {
      setErrPrenom("");
    }

    if (!email.trim() || !regexEmail.test(email)) {
      setErrEmail("Veuillez entrer une adresse email valide");
      Valid = false;
    } else {
      setErrEmail("");
    }

    if (!role) {
      seterrRole("Veuillez sélectionner votre statut");
      Valid = false;
    } else {
      seterrRole("");
    }

    if (!passwordRegex.test(password)) {
      setErrPassword(
        "Minimum huit caractères, une majuscule, une minuscule, un chiffre et un caractère spécial",
      );
      Valid = false;
    } else {
      setErrPassword("");
    }

    if (password !== ComfirmPassword || !ComfirmPassword) {
      setErrComfirmPassword("Les mots de passe ne correspondent pas");
      Valid = false;
    } else {
      setErrComfirmPassword("");
    }

    if (!Valid) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${apiUrl}/auth/register`, {
        nom,
        prenom,
        role,
        email,
        password,
      });
      if (response.data.success) {
        localStorage.setItem("show-verification","true")
        navigate("/");
        toast.success("Vous allez recevoir un email pour verifier votre compte", { icon: "🎉" });
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        toast.error(err.response.data.message);
      }
    }
    setLoading(false);
  };

  useEffect(()=>{
    const handleClick = (event : MouseEvent)=>{
      if(ref.current && !ref.current.contains(event.target as Node)){
        setshowOption(false)
      }
    }
    document.addEventListener("mousedown",handleClick);
    return ()=>{
    document.removeEventListener("mousedown", handleClick);
    }
  },[])

  return (
    <div className="flex h-screen min-h-max w-full items-center justify-center gap-2 p-4 lg:h-screen lg:justify-around">
      <div className="hidden w-full lg:block">
        <img
          src={logo_inscription}
          alt="logo_inscription"
          width={700}
          height={700}
        />
      </div>
      <div className="relative flex w-full flex-col items-start gap-3 rounded-md bg-white p-10 shadow-md transition">
        <Link to={"/"}>
          <img
            src={gralibre}
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
            Veuillez vous inscrire ou vous connecter pour continuer
          </p>
        </div>
        <div className="flex w-full items-start justify-start">
          <p>
            Déjà un compte ?{" "}
            <Link
              to={"/connexion"}
              className="text-sm text-sky-300 transition-all duration-400 hover:text-sky-400 md:text-sm lg:text-base"
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
        </div>
        <div className="flex w-full flex-wrap items-center justify-around gap-4">
          <OAuth
            text_1={`S'inscrire avec Google`}
            text_2={`S'inscrire avec Microsoft`}
          />
        </div>

        <form onSubmit={handleForm} className="mt-2 flex w-full flex-col gap-3">
          <div className="flex w-full items-center gap-3">
            <div className="flex w-full flex-col items-start gap-1">
              <Input
                label="Nom"
                id="Nom"
                type="text"
                placeholder="Votre Nom"
                onFocus={() => setErrNom("")}
                value={nom}
                onChange={setNom}
                error={ErrNom}
              />
            </div>
            <div className="flex w-full flex-col items-start gap-1">
              <Input
                label="Prenom"
                id="prenom"
                type="text"
                placeholder="Votre Prenom"
                onFocus={() => setErrPrenom("")}
                value={prenom}
                onChange={setPrenom}
                error={ErrPrenom}
              />
            </div>
          </div>
          <div ref={ref} className="relative flex w-full flex-col items-start gap-1">
            <h3 className="font-semibold">Votre status</h3>
            <div
              onFocus={()=>seterrRole("")}
              onClick={handleShow}
              className={`relative w-full rounded-md border ${errRole && "border-red-400 bg-red-100"} flex cursor-pointer items-center justify-between p-2`}
            >
              <h3 className={`${role ? 'text-black': 'text-gray-500'}`}>{role || "Selectionnez votre status"}</h3>
              <ChevronDown size={15} />
            </div>
            {showOption && (
              <div className="absolute top-17 left-0 z-10 w-full rounded-md border-2 bg-white shadow-lg">
                {option.map((item, index) => (
                  <div key={index}>
                    <div
                      id="status"
                      onClick={() => {
                        setrole(item.name);
                        setshowOption(false);
                      }}
                      className="cursor-pointer p-2 transition hover:bg-amber-100"
                    >
                      <span>
                        {item.icon}
                        {item.name}
                      </span>
                    </div>
                    {option.length - 1 && (
                      <div className="border-t border-gray-200"></div>
                    )}
                  </div>
                ))}
              </div>
            )}
            {errRole && (
              <p className="text-sm font-bold text-red-400">{errRole}</p>
            )}
          </div>
          <div className="flex w-full flex-col items-start gap-1">
            <Input
              icon="mail"
              label="Email"
              id="monEmail"
              type="email"
              placeholder="Votre Email"
              onFocus={() => setErrEmail("")}
              value={email}
              onChange={setEmail}
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
          <div className="flex w-full flex-col items-start gap-1">
            <Input
              id="confirmPassword"
              label="Confirmation du mot de passe"
              type="password"
              value={ComfirmPassword}
              placeholder="Confirmez votre mot de passe"
              error={ErrComfirmPassword}
              icon="lock"
              onFocus={() => setErrComfirmPassword("")}
              onChange={setComfirmPassword}
            />
          </div>
          <button
            type="submit"
            disabled={Loading}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-amber-300 p-3 text-base font-semibold text-black transition-all duration-300 hover:bg-amber-400 hover:shadow-md disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-300 disabled:shadow dark:text-white"
          >
            {Loading ? <Loadering /> : ""}
            <h2>Inscrivez-vous</h2>
            <LogIn />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Inscription;

/* eslint-disable no-irregular-whitespace */
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import OAuth from "../Oauth/OAuth";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import axios, { AxiosError } from "axios";
import { useEffect, useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import Loadering from "@/components/Loadering/Loadering";
import { useProtectedRoutes } from "@/store/userStore";



interface ConnexionModalType{
    openModal: boolean;
    setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const ConnexionModal = ({openModal,setOpenModal}:ConnexionModalType) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const {fetchData} = useProtectedRoutes()
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [serverMessage, setServerMessage] = useState("");
    const [isBlockedNotice, setIsBlockedNotice] = useState(false);

    useEffect(() => {
        const error = searchParams.get("error");
        if (error === "blocked") {
        setServerMessage("Votre compte est temporairement bloqué. Consultez votre email pour plus d'informations.");
        setIsBlockedNotice(true);
        }
    }, [searchParams]);
    
    const regexEmail = /^[a-zA-Z][a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const regexPassword = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
    
    const handleChange = (field:string, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: "" }));
    };

    const handleFocus = (field:string) => {
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
        newErrors.email = "Veuillez entrer une adresse email valide";
        valid = false;
        }

        if (!regexPassword.test(form.password)) {
        newErrors.password =
            "Minimum huit caractères, une majuscule, une minuscule, un chiffre et un caractère spécial";
        valid = false;
        }

        setErrors(newErrors);

        if (!valid) {
        setLoading(false);
        return;
        }

        try {
        const reponse  = await axios.post(`${apiUrl}/auth/connexion`,form,{ withCredentials: true });
        if (reponse.data.success) {
            await fetchData();
            toast.success(reponse.data.message);
            navigate('/')
        }
        } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        if (err.response?.data?.message) {
            setServerMessage(err.response.data.message);
            newErrors.email = " "
            newErrors.password = " "
        }
        } finally {
        setLoading(false);
        }
    };


return (
    <Dialog open={openModal} onOpenChange={setOpenModal}>
    <DialogContent className="space-y-3">
        <DialogHeader className="space-y-3">
        <DialogTitle className="text-2xl">Je me connecte</DialogTitle>
        <DialogDescription className="text-sm">
            Pas encore membre ? <Link to={'/inscription'} className="border-b-2 border-b-amber-500">Inscrivez-vous</Link>
        </DialogDescription>
            <OAuth text_1="Se connecter avec google"/>
            {serverMessage && (
                <div className="w-full rounded-md border-l-2 border-red-500 bg-red-100 p-2 text-red-700">
                    <p>{serverMessage}</p>
                    {isBlockedNotice && (
                    <Link to="/appeal" className="mt-1 inline-block text-sm font-semibold underline">
                        Faire une demande de déblocage
                    </Link>
                    )}
                </div>
            )}
        </DialogHeader>
        <form onSubmit={handleForm} className="space-y-3">
            <div className="space-y-2">
                <Label id="Email_modal" htmlFor="Email_modal">Email :</Label>
                <Input 
                    id="Email_modal" 
                    type="email" 
                    placeholder="Email"  
                    className="p-4" 
                    value={form.email} 
                    onChange={(e)=>handleChange("email",e.target.value)} 
                    onFocus={() => handleFocus("email")}
                />
                {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
            </div>
            <div className="space-y-2">
                <span className="flex items-center justify-between">
                    <Label id="Password_modal" htmlFor="Password_modal">Mot de passe :</Label>
                    <Link to={'/password/reset'} className="border-b-2 border-b-amber-500 text-xs">Mot de passe oublié ?</Link>
                </span>
                <Input
                    id="Password_modal"
                    type="password"
                    placeholder="Mot de passe"
                    className="p-4"
                    value={form.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    onFocus={() => handleFocus("password")}
                />
                {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
            </div>
            <Button disabled={loading} className="flex w-full cursor-pointer items-center space-x-2 bg-amber-500 hover:bg-amber-600">{loading ? <Loadering /> : 'Se connecter'}</Button>
        </form>
    </DialogContent>
</Dialog>
)}

export default ConnexionModal
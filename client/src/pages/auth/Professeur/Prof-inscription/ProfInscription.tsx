import Teacher_img from '@/assets/images/Professeur_Bienvenue.png'
import logo from '@/assets/images/9ralibre.png'
import { Button } from "@/components/ui/button"
import { Link, useNavigate } from 'react-router-dom'
import { useState } from "react"
import Input from '@/components/Form/Input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import axios from "axios"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CircleAlert } from "lucide-react"
import {
  fieldErrorsFromIssues,
  messagesFromApiData,
  type ProfApiErrorBody,
} from "@/utils/profApiErrors"
import { cn } from "@/lib/utils"

const ProfInscription = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        nom: "",
        prenom: "",
        email: "",
        password: "",
        niveaux: ""
    })

    const [errFormData, setErrFormData] = useState({
        nom: "",
        prenom: "",
        email: "",
        password: "",
        niveaux: ""
    })

    const [loading, setLoading] = useState(false)
    const [successMsg, setSuccessMsg] = useState("")
    const [errorMsg, setErrorMsg] = useState("")

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        setErrFormData(prev => ({ ...prev, [field]: "" }))
    }

    const handleFocus = (field: string) => {
        setErrFormData(prev => ({ ...prev, [field]: "" }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const errors = {
        nom: "",
        prenom: "",
        email: "",
        password: "",
        niveaux: ""
        }

        if (!formData.nom) errors.nom = "Nom requis"
        if (!formData.prenom) errors.prenom = "Prénom requis"
        if (!formData.email) errors.email = "Email requis"
        if (!formData.password) errors.password = "Mot de passe requis"
        if (!formData.niveaux) errors.niveaux = "Niveau requis"

        setErrFormData(errors)

        const hasError = Object.values(errors).some(e => e !== "")
        if (hasError) return

        try {
        setLoading(true)
        setErrorMsg("")
        setSuccessMsg("")

        const res = await axios.post(`${apiUrl}/prof/register`,formData)
        if (res.data.success) {
            setSuccessMsg(res.data.message)
            setFormData({
                nom: "",
                prenom: "",
                email: "",
                password: "",
                niveaux: ""
            })
            navigate('/prof-connexion')
        }
        } catch (err) {
            if (!axios.isAxiosError(err)) {
                setErrorMsg("Une erreur est survenue");
                return;
            }
            const data = err.response?.data as ProfApiErrorBody | undefined;
            const issues = data?.issues;
            if (issues?.length) {
                setErrFormData((prev) => ({
                    ...prev,
                    ...fieldErrorsFromIssues(issues),
                }));
                setErrorMsg("");
            } else {
                const msg =
                    typeof data?.message === "string" && data.message.trim()
                        ? data.message.trim()
                        : messagesFromApiData(data).join(" · ") || "Erreur serveur";
                setErrorMsg(msg);
            }
        } finally {
            setLoading(false)
        }
    }

return (
    <div className="relative flex min-h-screen items-center justify-center bg-amber-500 px-4">

        {/* Logo */}
        <img src={logo} className="absolute top-4 left-4 w-20" />

        <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border bg-white/70 shadow-2xl backdrop-blur-xl md:grid-cols-2 dark:bg-white">

        {/* Image */}
        <div className="hidden items-center justify-center bg-blue-50/50 p-6 md:flex">
            <img src={Teacher_img} alt='teacher_img' className="max-w-md" />
        </div>

        {/* Form */}
        <div className="flex flex-col justify-center space-y-4 p-8">

            <h2 className="mb-2 text-3xl font-bold dark:text-black">
                Inscription
            </h2>

            <p className="mb-6 text-gray-500">
                Créer votre compte enseignant
            </p>

            <span className="mb-4 text-sm dark:text-gray-800">
                Déjà un compte ?{" "}
                <Link to="/prof-connexion" className="text-cyan-600 hover:underline">
                Se connecter
                </Link>
            </span>

            <form onSubmit={handleSubmit} className="space-y-4">
                {successMsg && (
                    <Alert className="border-emerald-200 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-100">
                        <AlertTitle className="text-sm font-semibold">Succès</AlertTitle>
                        <AlertDescription className="text-sm text-emerald-800 dark:text-emerald-200">
                            {successMsg}
                        </AlertDescription>
                    </Alert>
                )}

                {errorMsg && (
                    <Alert variant="destructive" className="border-red-200 bg-red-50 text-red-900 dark:bg-red-950/40 dark:text-red-100">
                        <CircleAlert className="size-4" />
                        <AlertTitle className="text-sm font-semibold">Inscription impossible</AlertTitle>
                        <AlertDescription className="text-sm text-red-800 dark:text-red-200">
                            {errorMsg}
                        </AlertDescription>
                    </Alert>
                )}

                {/* Nom + Prénom */}
                <div className='flex w-full gap-1.5'>
                    <Input
                        id="nom"
                        label="Nom"
                        value={formData.nom}
                        onChange={(value) => handleChange("nom", value)}
                        onFocus={() => handleFocus("nom")}
                        placeholder="Nom"
                        error={errFormData.nom}
                        className='text-black dark:text-black'
                    />

                    <Input
                        id="prenom"
                        label="Prénom"
                        value={formData.prenom}
                        onChange={(value) => handleChange("prenom", value)}
                        onFocus={() => handleFocus("prenom")}
                        placeholder="Prénom"
                        error={errFormData.prenom}
                        className='text-black dark:text-black'
                    />
                </div>

                {/* Email */}
                <Input
                id="email"
                label="Email"
                type="email"
                icon="mail"
                value={formData.email}
                onChange={(value) => handleChange("email", value)}
                onFocus={() => handleFocus("email")}
                placeholder="Email"
                error={errFormData.email}
                className='text-black dark:text-black'
                />

                {/* Niveaux */}
                <div className='space-y-1'>
                <Label className='dark:text-black'>Niveaux</Label>

                <Select
                    value={formData.niveaux || undefined}
                    onValueChange={(value) => handleChange("niveaux", value)}
                >
                    <SelectTrigger
                        className={cn(
                            "w-full rounded-md border p-2 dark:border-gray-300 dark:font-semibold dark:text-black",
                            errFormData.niveaux && "border-red-400 bg-red-50 dark:bg-red-950/30"
                        )}
                    >
                    <SelectValue placeholder="Niveaux"/>
                    </SelectTrigger>

                    <SelectContent>
                    <SelectGroup>
                        <SelectLabel>College</SelectLabel>
                        <SelectItem value="1AC">1AC</SelectItem>
                        <SelectItem value="2AC">2AC</SelectItem>
                        <SelectItem value="3AC">3AC</SelectItem>
                    </SelectGroup>

                    <SelectSeparator />

                    <SelectGroup>
                        <SelectLabel>Lycee</SelectLabel>
                        <SelectItem value="TC">TC</SelectItem>
                        <SelectItem value="1BAC">1BAC</SelectItem>
                        <SelectItem value="2BAC">2BAC</SelectItem>
                    </SelectGroup>
                    </SelectContent>
                </Select>

                {errFormData.niveaux && (
                    <p className="text-sm text-red-500">{errFormData.niveaux}</p>
                )}
                </div>

                {/* Password */}
                <Input
                id="password"
                label="Mot de passe"
                type="password"
                icon="lock"
                value={formData.password}
                onChange={(value) => handleChange("password", value)}
                onFocus={() => handleFocus("password")}
                placeholder="Mot de passe"
                error={errFormData.password}
                className='text-black dark:text-black'
                />

                {/* Submit */}
                <Button
                disabled={loading}
                className="w-full cursor-pointer bg-amber-600 hover:bg-amber-700"
                >
                {loading ? "Création..." : "Créer un compte"}
                </Button>

            </form>


            <p className="mt-6 text-center text-xs text-gray-400">
                Après votre inscription, vous recevrez un email avec les détails. Nous pourrons vous contacter pour confirmer votre compte si nécessaire.
            </p>
        </div>
    </div>
    </div>
  )
}

export default ProfInscription
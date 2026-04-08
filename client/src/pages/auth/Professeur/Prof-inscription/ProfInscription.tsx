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
            if (axios.isAxiosError(err)) {
                setErrorMsg(err.response?.data?.message || "Erreur serveur");
            }
        } finally {
            setLoading(false)
        }
    }

return (
    <div className="relative flex min-h-screen items-center justify-center px-4">

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

            
            {/* Messages */}
            {successMsg && (
                <p className="mt-3 rounded-md bg-teal-100 p-2 text-sm text-teal-700">
                {successMsg}
                </p>
            )}

            {errorMsg && (
                <p className="mt-3 rounded-md bg-red-100 p-2 text-sm text-red-600">
                {errorMsg}
                </p>
            )}


            <form onSubmit={handleSubmit} className="space-y-4">

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
                    />

                    <Input
                        id="prenom"
                        label="Prénom"
                        value={formData.prenom}
                        onChange={(value) => handleChange("prenom", value)}
                        onFocus={() => handleFocus("prenom")}
                        placeholder="Prénom"
                        error={errFormData.prenom}
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
                />

                {/* Niveaux */}
                <div className='space-y-1'>
                <Label className='dark:text-black'>Niveaux</Label>

                <Select
                    onValueChange={(value) => handleChange("niveaux", value)}
                >
                    <SelectTrigger className="w-full rounded-md border p-2 dark:border-gray-300 dark:font-semibold dark:text-black">
                    <SelectValue placeholder="Niveaux" />
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
                Votre compte sera validé par un administrateur.
            </p>
        </div>
    </div>
    </div>
  )
}

export default ProfInscription
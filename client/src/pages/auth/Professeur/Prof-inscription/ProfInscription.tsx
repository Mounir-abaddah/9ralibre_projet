import Teacher_img from '@/assets/images/Professeur_Bienvenue.png'
import logo from '@/assets/images/9ralibre.png'
import { Button } from "@/components/ui/button"
import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from "react"
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
import { useTranslation } from "react-i18next";

type MatiereOpt = { _id: string; nom: string };

const ProfInscription = () => {
    const { t } = useTranslation();
    const apiUrl = import.meta.env.VITE_API_URL;
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        nom: "",
        prenom: "",
        email: "",
        password: "",
        niveaux: "",
        matiere: "",
    })

    const [matieresList, setMatieresList] = useState<MatiereOpt[]>([])
    const [loadingMatieres, setLoadingMatieres] = useState(false)

    const [errFormData, setErrFormData] = useState({
        nom: "",
        prenom: "",
        email: "",
        password: "",
        niveaux: "",
        matiere: "",
    })

    const [loading, setLoading] = useState(false)
    const [successMsg, setSuccessMsg] = useState("")
    const [errorMsg, setErrorMsg] = useState("")

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => {
            const next = { ...prev, [field]: value }
            if (field === "niveaux") next.matiere = ""
            return next
        })
        setErrFormData((prev) => ({ ...prev, [field]: "" }))
        if (field === "niveaux") setErrFormData((prev) => ({ ...prev, matiere: "" }))
    }

    useEffect(() => {
        let cancelled = false
        const run = async () => {
            if (!formData.niveaux) {
                setMatieresList([])
                return
            }
            setLoadingMatieres(true)
            try {
                const res = await axios.get<MatiereOpt[]>(
                    `${apiUrl}/prof/register/matieres/${encodeURIComponent(formData.niveaux)}`
                )
                if (!cancelled) setMatieresList(Array.isArray(res.data) ? res.data : [])
            } catch {
                if (!cancelled) setMatieresList([])
            } finally {
                if (!cancelled) setLoadingMatieres(false)
            }
        }
        void run()
        return () => {
            cancelled = true
        }
    }, [formData.niveaux, apiUrl])

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
        niveaux: "",
        matiere: "",
        }

        if (!formData.nom) errors.nom = t("prof.register.requiredLastName")
        if (!formData.prenom) errors.prenom = t("prof.register.requiredFirstName")
        if (!formData.email) errors.email = t("prof.register.requiredEmail")
        if (!formData.password) errors.password = t("prof.register.requiredPassword")
        if (!formData.niveaux) errors.niveaux = t("prof.register.requiredLevel")
        if (formData.niveaux && !errors.niveaux) {
            if (!loadingMatieres && matieresList.length === 0) {
                errors.matiere = t("prof.register.noSubjectsForLevel")
            } else if (!loadingMatieres && !formData.matiere) {
                errors.matiere = t("prof.register.requiredSubject")
            }
        }

        setErrFormData(errors)

        const hasError = Object.values(errors).some((e) => e !== "")
        if (hasError || loadingMatieres) return

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
                niveaux: "",
                matiere: "",
            })
            navigate('/prof-connexion')
        }
        } catch (err) {
            if (!axios.isAxiosError(err)) {
                setErrorMsg(t("prof.common.errorOccurred"));
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
                        : messagesFromApiData(data).join(" · ") || t("prof.common.serverError");
                setErrorMsg(msg);
            }
        } finally {
            setLoading(false)
        }
    }

return (
    <div className="relative flex min-h-screen items-center justify-center bg-[url('/backgorund_teacher.jpg')] bg-cover bg-no-repeat px-4">

        {/* Logo */}
        <Link to={'/'}><img src={logo} alt={t("prof.auth.logoAlt")} className="absolute top-4 left-4 w-20" /></Link>

        <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border bg-white/70 shadow-2xl backdrop-blur-xl md:grid-cols-2 dark:bg-white">

        {/* Image */}
        <div className="hidden items-center justify-center bg-blue-50/50 p-6 md:flex">
            <img src={Teacher_img} alt={t("prof.register.teacherImageAlt")} className="max-w-md" />
        </div>

        {/* Form */}
        <div className="flex flex-col justify-center space-y-4 p-8">

            <h2 className="mb-2 text-3xl font-bold dark:text-black">
                {t("prof.register.title")}
            </h2>

            <p className="mb-6 text-gray-500">
                {t("prof.register.subtitle")}
            </p>

            <span className="mb-4 text-sm dark:text-gray-800">
                {t("prof.register.alreadyAccount")}{" "}
                <Link to="/prof-connexion" className="text-cyan-600 hover:underline">
                {t("prof.register.loginLink")}
                </Link>
            </span>

            <form onSubmit={handleSubmit} className="space-y-4">
                {successMsg && (
                    <Alert className="border-emerald-200 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-100">
                        <AlertTitle className="text-sm font-semibold">{t("prof.register.successTitle")}</AlertTitle>
                        <AlertDescription className="text-sm text-emerald-800 dark:text-emerald-200">
                            {successMsg}
                        </AlertDescription>
                    </Alert>
                )}

                {errorMsg && (
                    <Alert variant="destructive" className="border-red-200 bg-red-50 text-red-900 dark:bg-red-950/40 dark:text-red-100">
                        <CircleAlert className="size-4" />
                        <AlertTitle className="text-sm font-semibold">{t("prof.register.impossibleTitle")}</AlertTitle>
                        <AlertDescription className="text-sm text-red-800 dark:text-red-200">
                            {errorMsg}
                        </AlertDescription>
                    </Alert>
                )}

                {/* Nom + Prénom */}
                <div className='flex w-full gap-1.5'>
                    <Input
                        id="nom"
                        label={t("prof.settings.lastName")}
                        value={formData.nom}
                        onChange={(value) => handleChange("nom", value)}
                        onFocus={() => handleFocus("nom")}
                        placeholder={t("prof.settings.lastName")}
                        error={errFormData.nom}
                        className='text-black dark:text-black'
                    />

                    <Input
                        id="prenom"
                        label={t("prof.settings.firstName")}
                        value={formData.prenom}
                        onChange={(value) => handleChange("prenom", value)}
                        onFocus={() => handleFocus("prenom")}
                        placeholder={t("prof.settings.firstName")}
                        error={errFormData.prenom}
                        className='text-black dark:text-black'
                    />
                </div>

                {/* Email */}
                <Input
                id="email"
                label={t("prof.settings.email")}
                type="email"
                icon="mail"
                value={formData.email}
                onChange={(value) => handleChange("email", value)}
                onFocus={() => handleFocus("email")}
                placeholder={t("prof.settings.email")}
                error={errFormData.email}
                className='text-black dark:text-black'
                />
                <div className='flex w-full items-center space-x-2'>
                    {/* Niveaux */}
                    <div className='w-full space-y-1'>
                    <Label className='dark:text-black'>{t("prof.settings.levels")}</Label>

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
                        <SelectValue placeholder={t("prof.settings.levels")}/>
                        </SelectTrigger>

                        <SelectContent>
                        <SelectGroup>
                            <SelectLabel>{t("settings.fields.middleSchool")}</SelectLabel>
                            <SelectItem value="1AC">1AC</SelectItem>
                            <SelectItem value="2AC">2AC</SelectItem>
                            <SelectItem value="3AC">3AC</SelectItem>
                        </SelectGroup>

                        <SelectSeparator />

                        <SelectGroup>
                            <SelectLabel>{t("settings.fields.highSchool")}</SelectLabel>
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
                    {/* Matière (liée au niveau) */}
                    <div className="space-y-1">
                        <Label className="dark:text-black">{t("prof.common.subject")}</Label>
                        <Select
                            value={formData.matiere || undefined}
                            onValueChange={(value) => handleChange("matiere", value)}
                            disabled={
                                !formData.niveaux ||
                                loadingMatieres ||
                                matieresList.length === 0
                            }
                        >
                            <SelectTrigger
                                className={cn(
                                    "w-full rounded-md border p-2 dark:border-gray-300 dark:font-semibold dark:text-black",
                                    errFormData.matiere &&
                                        "border-red-400 bg-red-50 dark:bg-red-950/30"
                                )}
                            >
                                <SelectValue
                                    placeholder={
                                        !formData.niveaux
                                            ? t("prof.register.selectLevelFirstForSubject")
                                            : loadingMatieres
                                            ? t("prof.register.loadingMatieres")
                                            : matieresList.length === 0
                                                ? t("prof.register.noSubjectsForLevel")
                                                : t("prof.modal.chooseSubject")
                                    }
                                />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {matieresList.map((m) => (
                                        <SelectItem key={m._id} value={m._id}>
                                            {m.nom}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        {errFormData.matiere && (
                            <p className="text-sm text-red-500">{errFormData.matiere}</p>
                        )}
                    </div>
                </div>
                

                {/* Password */}
                <Input
                id="password"
                label={t("prof.settings.newPassword")}
                type="password"
                icon="lock"
                value={formData.password}
                onChange={(value) => handleChange("password", value)}
                onFocus={() => handleFocus("password")}
                placeholder={t("prof.settings.newPassword")}
                error={errFormData.password}
                className='text-black dark:text-black'
                />

                {/* Submit */}
                <Button
                disabled={loading || loadingMatieres}
                className="w-full cursor-pointer bg-amber-600 hover:bg-amber-700"
                >
                {loading ? t("prof.register.creating") : t("prof.register.createAccount")}
                </Button>

            </form>


            <p className="mt-6 text-center text-xs text-gray-400">
                {t("prof.register.footerNote")}
            </p>
        </div>
    </div>
    </div>
  )
}

export default ProfInscription
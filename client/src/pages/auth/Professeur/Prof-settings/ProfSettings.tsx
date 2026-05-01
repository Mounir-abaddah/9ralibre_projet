import axios from "axios";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Lock, AppWindowMac, Languages } from "lucide-react";
import { useProfProtectedRoutes } from "@/store/userStore";
import toast from "react-hot-toast";
import {
Select,
SelectContent,
SelectGroup,
SelectItem,
SelectTrigger,
SelectValue,
} from "@/components/ui/select";
import { useTheme } from "@/context/ThemeContext";
import i18n from "@/i18n";
import { useTranslation } from "react-i18next";

const ProfSettings = () => {
const { t } = useTranslation();
const apiUrl = import.meta.env.VITE_API_URL;
const [lang, setLang] = useState(localStorage.getItem("lang") || "Fr");
const { data, fetchData } = useProfProtectedRoutes();
const { theme, toggleTheme } = useTheme();
const [nom, setNom] = useState("");
const [prenom, setPrenom] = useState("");
const [imageFile, setImageFile] = useState<File | null>(null);

const [oldPassword, setOldPassword] = useState("");
const [newPassword, setNewPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");

const [loading, setLoading] = useState(false);
const [imageError, setImageError] = useState(false);

useEffect(() => {
    fetchData();
}, []);

  useEffect(() => {
    localStorage.setItem("lang", lang);
    i18n.changeLanguage(lang.toLowerCase());
  }, [lang]);

useEffect(() => {
    if (data) {
    setNom(data.nom || "");
    setPrenom(data.prenom || "");
    setImageError(false);
    }
}, [data]);

// ✅ Update profile
const handleUpdateProfile = async () => {
    try {
    setLoading(true);

    let imageName = data?.image;

    // Upload image
    if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);

        const uploadRes = await axios.put(
        `${apiUrl}/prof/upload-avatar`,
        formData,
        {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
        },
        );

        imageName = uploadRes.data.image;
    }

    await axios.put(
        `${apiUrl}/prof/settings`,
        { nom, prenom, image: imageName },
        { withCredentials: true },
    );

    await fetchData();
    toast.success(t("prof.settings.profileUpdated"));
    } catch (err) {
    console.error(err);
    toast.error(t("prof.settings.updateError"));
    } finally {
    setLoading(false);
    }
};

// ✅ Change password
const handleChangePassword = async () => {
    try {
    if (!oldPassword || !newPassword || !confirmPassword) {
        return toast.error(t("prof.settings.requiredFields"));
    }

    if (newPassword !== confirmPassword) {
        return toast.error(t("prof.settings.passwordMismatch"));
    }

    setLoading(true);

    await axios.put(
        `${apiUrl}/prof/change-password`,
        { oldPassword, newPassword },
        { withCredentials: true },
    );

    toast.success(t("prof.settings.passwordChanged"));

    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    } catch (err) {
    console.error(err);
    toast.error(t("prof.settings.passwordError"));
    } finally {
    setLoading(false);
    }
};

const LangSelect = () => (
    <>
    <Label htmlFor="lang" id="lang">{t("nav.language")}</Label>
    <Select value={lang} onValueChange={setLang}>
        <SelectTrigger className="w-full">
            <span className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
            <Languages size={15} />
            <SelectValue placeholder={t("nav.language")} />
            </span>
        </SelectTrigger>
        <SelectContent className="z-[999999999999999] min-w-28 rounded-lg border">
            <SelectGroup>
            <SelectItem value="Fr">
                <span className="flex items-center gap-2 text-xs font-medium">
                <span>FR</span> Français
                </span>
            </SelectItem>
            <SelectItem value="En">
                <span className="flex items-center gap-2 text-xs font-medium">
                <span>EN</span> English
                </span>
            </SelectItem>
            </SelectGroup>
        </SelectContent>
    </Select>
    </>
)

return (
    <div className="min-h-[calc(100vh-64px)] space-y-6 p-6">
    {/* HEADER */}
    <div>
        <h1 className="text-2xl font-bold">{t("prof.settings.title")} ⚙️</h1>
    </div>

    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* PROFILE */}
        <Card className="space-y-4 p-5">
        <div className="flex items-center gap-2 font-semibold">
            <User size={18} />
            {t("prof.settings.profile")}
        </div>

        {/* IMAGE */}
        <div className="space-y-2">
            <Label>{t("prof.settings.photo")}</Label>

            {data?.image && !imageError ? (
            <img
                src={`${apiUrl}/uploads/images/${data.id}/${data.image}`}
                className="h-20 w-20 rounded-full object-cover"
                alt={`${data?.nom} ${data?.prenom}`}
                onError={() => setImageError(true)}
            />
            ) : (
            <div className="flex size-16 items-center justify-center rounded-full border dark:text-white">
                {data?.nom?.[0]}
                {data?.prenom?.[0]}
            </div>
            )}

            <Input
            type="file"
            accept="image/*"
            onChange={(e) => {
                if (e.target.files) {
                setImageFile(e.target.files[0]);
                }
            }}
            />
        </div>

        {/* NAME */}
        <div className="flex gap-2">
            <div className="w-full space-y-2">
            <Label>{t("prof.settings.lastName")}</Label>
            <Input
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                placeholder={t("prof.settings.lastName")}
            />
            </div>
            <div className="w-full space-y-2">
            <Label htmlFor="prenom" id="prenom">
                {t("prof.settings.firstName")}
            </Label>
            <Input
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                placeholder={t("prof.settings.firstName")}
                id="prenom"
            />
            </div>
        </div>

        <div className="w-full space-y-2">
            <Label id="email" htmlFor="email">
            {t("prof.settings.email")}
            </Label>
            <Input id="email" value={data?.email} type="email" disabled />
        </div>

        <div className="w-full space-y-2">
            <Label htmlFor="niveaux" id="niveaux">
            {t("prof.settings.levels")}
            </Label>
            <Input
            id="niveaux"
            value={data?.niveaux}
            type="text"
            disabled
            className="cursor-not-allowed bg-gray-100"
            />

            <p className="flex items-center gap-1 text-xs text-gray-500">
            {t("prof.settings.levelWarning")}
            </p>
        </div>

        <Button
            onClick={handleUpdateProfile}
            className="w-full cursor-pointer"
            disabled={loading}
        >
            {t("prof.settings.save")}
        </Button>
        </Card>

        {/* SECURITY */}
        <Card className="space-y-4 p-5">
        <div className="flex items-center gap-2 font-semibold">
            <Lock size={18} />
            {t("prof.settings.security")}
        </div>

        {data?.provider !== "google" ? (
            <>
            <Input
                type="password"
                placeholder={t("prof.settings.oldPassword")}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
            />

            <Input
                type="password"
                placeholder={t("prof.settings.newPassword")}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
            />

            <Input
                type="password"
                placeholder={t("prof.settings.confirmPassword")}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
            />

            {/* ERROR LIVE */}
            {newPassword &&
                confirmPassword &&
                newPassword !== confirmPassword && (
                <p className="text-sm text-red-500">
                    {t("prof.settings.passwordMismatch")}
                </p>
                )}
            <Button
                onClick={handleChangePassword}
                className="w-full"
                disabled={loading}
            >
                {t("prof.settings.changePassword")}
            </Button>
            </>
        ) : (
            <p className="text-sm text-gray-500">
            {t("prof.settings.googlePasswordUnavailable")}
            </p>
        )}
        </Card>
        {/* SECURITY */}
        <Card className="space-y-2 p-3">
        <CardHeader className="flex items-center gap-2 font-semibold">
            <CardTitle className="flex items-center gap-2">
                <AppWindowMac size={18} />
                {t("prof.settings.preferences")}
            </CardTitle>
        </CardHeader>
        <CardContent>
            <div className="w-full space-y-2">
                <Label id="Theme" htmlFor="Theme">
                {t("nav.appearance")}
                </Label>
                <Select value={theme} onValueChange={toggleTheme}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder={t("nav.appearance")} className="w-full" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                    <SelectItem value="light">☀️ {t("nav.lightMode")}</SelectItem>
                    <SelectItem value="dark">🌙 {t("nav.darkMode")}</SelectItem>
                    </SelectGroup>
                </SelectContent>
                </Select>
            </div>
        </CardContent>
        <CardContent>
            <div className="w-full space-y-2">
                <LangSelect />
            </div>
        </CardContent>
        </Card>
    </div>
    </div>
);
};

export default ProfSettings;

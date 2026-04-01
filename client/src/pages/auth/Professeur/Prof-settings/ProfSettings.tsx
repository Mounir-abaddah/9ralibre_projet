import axios from "axios";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Lock, AppWindowMac } from "lucide-react";
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

const ProfSettings = () => {
const apiUrl = import.meta.env.VITE_API_URL;
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
    toast.success("Profil mis à jour ✅");
    } catch (err) {
    console.error(err);
    toast.error("Erreur lors de la mise à jour");
    } finally {
    setLoading(false);
    }
};

// ✅ Change password
const handleChangePassword = async () => {
    try {
    if (!oldPassword || !newPassword || !confirmPassword) {
        return toast.error("Tous les champs sont obligatoires");
    }

    if (newPassword !== confirmPassword) {
        return toast.error("Les mots de passe ne correspondent pas");
    }

    setLoading(true);

    await axios.put(
        `${apiUrl}/prof/change-password`,
        { oldPassword, newPassword },
        { withCredentials: true },
    );

    toast.success("Mot de passe changé ✅");

    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    } catch (err) {
    console.error(err);
    toast.error("Erreur mot de passe");
    } finally {
    setLoading(false);
    }
};

return (
    <div className="min-h-[calc(100vh-64px)] space-y-6 p-6">
    {/* HEADER */}
    <div>
        <h1 className="text-2xl font-bold">Paramètres ⚙️</h1>
    </div>

    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* PROFILE */}
        <Card className="space-y-4 p-5">
        <div className="flex items-center gap-2 font-semibold">
            <User size={18} />
            Profil
        </div>

        {/* IMAGE */}
        <div className="space-y-2">
            <Label>Photo</Label>

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
            <Label>Nom</Label>
            <Input
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                placeholder="Nom"
            />
            </div>
            <div className="w-full space-y-2">
            <Label htmlFor="prenom" id="prenom">
                Prénom
            </Label>
            <Input
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                placeholder="Prénom"
                id="prenom"
            />
            </div>
        </div>

        <div className="w-full space-y-2">
            <Label id="email" htmlFor="email">
            Email :
            </Label>
            <Input id="email" value={data?.email} type="email" disabled />
        </div>

        <div className="w-full space-y-2">
            <Label htmlFor="niveaux" id="niveaux">
            Niveaux
            </Label>
            <Input
            id="niveaux"
            value={data?.niveaux}
            type="text"
            disabled
            className="cursor-not-allowed bg-gray-100"
            />

            <p className="flex items-center gap-1 text-xs text-gray-500">
            ⚠️ Ce niveau ne peut pas être modifié. Pour toute modification,
            veuillez contacter l’administration. 9ralibre@gmail.com
            </p>
        </div>

        <Button
            onClick={handleUpdateProfile}
            className="w-full cursor-pointer"
            disabled={loading}
        >
            Sauvegarder
        </Button>
        </Card>

        {/* SECURITY */}
        <Card className="space-y-4 p-5">
        <div className="flex items-center gap-2 font-semibold">
            <Lock size={18} />
            Sécurité
        </div>

        {data?.provider !== "google" ? (
            <>
            <Input
                type="password"
                placeholder="Ancien mot de passe"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
            />

            <Input
                type="password"
                placeholder="Nouveau mot de passe"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
            />

            <Input
                type="password"
                placeholder="Confirmer le mot de passe"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
            />

            {/* ERROR LIVE */}
            {newPassword &&
                confirmPassword &&
                newPassword !== confirmPassword && (
                <p className="text-sm text-red-500">
                    Les mots de passe ne correspondent pas
                </p>
                )}
            <Button
                onClick={handleChangePassword}
                className="w-full"
                disabled={loading}
            >
                Modifier mot de passe
            </Button>
            </>
        ) : (
            <p className="text-sm text-gray-500">
            Compte connecté avec Google — mot de passe non disponible
            </p>
        )}
        </Card>
        {/* SECURITY */}
        <Card className="space-y-4 p-5">
        <div className="flex items-center gap-2 font-semibold">
            <AppWindowMac size={18} />
            Preference
        </div>
        <div className="w-full space-y-2">
            <Label id="Theme" htmlFor="Theme">
            Thème
            </Label>
            <Select value={theme} onValueChange={toggleTheme}>
            <SelectTrigger className="w-full">
                <SelectValue placeholder="Theme" className="w-full" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                <SelectItem value="light">☀️ Clair</SelectItem>
                <SelectItem value="dark">🌙 Sombre</SelectItem>
                </SelectGroup>
            </SelectContent>
            </Select>
        </div>
        </Card>
    </div>
    </div>
);
};

export default ProfSettings;

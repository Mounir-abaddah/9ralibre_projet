import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProtectedRoutes } from "@/store/userStore";
import { Upload, Trash2, Lock, User } from "lucide-react";
import { useState, useRef } from "react";
import axios from "axios";

const Settings = () => {
  document.title = "Paramètres | 9ralibre"
  const apiUrl = import.meta.env.VITE_API_URL;
  const { data } = useProtectedRoutes();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    nom: data?.nom || "",
    prenom: data?.prenom || "",
    email: data?.email || "",
    niveaux: data?.niveaux || "",
    password: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [userImage, setUserImage] = useState<string | null>(
    data?.image || null,
  );

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSavePersonal = async () => {
    try {
      setError(null);
      setSuccess(null);

      const resData = await axios.put(
        `${apiUrl}/user/updateProfile`,
        {
          nom: formData.nom,
          prenom: formData.prenom,
          email: formData.email,
          niveaux: formData.niveaux,
        },
        { withCredentials: true },
      );

      if (resData.data.success) {
        setSuccess("Profil mis à jour avec succès");
        window.location.reload()
        window.location.href = `/Paramètre/${formData?.niveaux}`
      } else {
        setError(resData.data.message || "Erreur lors de la mise à jour");
      }
    } catch (error) {
      const errorMessage =
        error instanceof axios.AxiosError
          ? error.response?.data?.message
          : "Erreur lors de la mise à jour du profil";
      setError(errorMessage || "Erreur lors de la mise à jour du profil");
      console.error("Erreur:", error);
    }
  };

  const handleChangePassword = async () => {
    try {
      setError(null);
      setSuccess(null);

      if (formData.newPassword !== formData.confirmPassword) {
        setError("Les mots de passe ne correspondent pas");
        return;
      }

      const { data } = await axios.put(
        `${apiUrl}/user/changePassword`,
        {
          currentPassword: formData.password,
          newPassword: formData.newPassword,
        },
        { withCredentials: true },
      );

      if (data.success) {
        setSuccess("Mot de passe changé avec succès");
        setFormData({
          ...formData,
          password: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        setError(data.message || "Erreur lors du changement");
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof axios.AxiosError
          ? error.response?.data?.message
          : "Erreur lors du changement du mot de passe";
      setError(errorMessage || "Erreur lors du changement du mot de passe");
      console.error("Erreur:", error);
    }
  };

  const handleUploadImage = async (file: File) => {
    try {
      setIsLoading(true);
      const formDataUpload = new FormData();
      formDataUpload.append("avatar", file);

      const response = await axios.post(
        `${apiUrl}/user/uploadImage`,
        formDataUpload,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      if (response.data.success) {
        setUserImage(response.data.image);
        setSuccess("Image téléchargée avec succès");
      } else {
        setError(response.data.message || "Erreur lors du téléchargement");
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof axios.AxiosError
          ? error.response?.data?.message
          : "Erreur lors du téléchargement";
      setError(errorMessage || "Erreur lors du téléchargement");
      console.error("Erreur:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteImage = async () => {
    try {
      setIsLoading(true);
      const response = await axios.delete(`${apiUrl}/user/deleteImage`, {
        withCredentials: true,
      });

      if (response.data.success) {
        setUserImage(null);
        setSuccess("Image supprimée avec succès");
      } else {
        setError(response.data.message || "Erreur lors de la suppression");
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof axios.AxiosError
          ? error.response?.data?.message
          : "Erreur lors de la suppression";
      setError(errorMessage || "Erreur lors de la suppression");
      console.error("Erreur:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleUploadImage(file);
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-8 dark:from-slate-950 dark:to-slate-900">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold text-slate-900 dark:text-white">
            Paramètres
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Gérez vos informations personnelles et votre sécurité
          </p>
        </div>

        {/* Tabs Container */}
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="mb-6 grid w-full grid-cols-2">
            <TabsTrigger value="personal" className="flex cursor-pointer items-center gap-2">
              <User className="size-4" />
              <span>Informations</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex cursor-pointer items-center gap-2">
              <Lock className="size-4" />
              <span>Sécurité</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab: Personal Information */}
          <TabsContent value="personal" className="space-y-6">
            {/* Messages */}
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
                <p className="font-medium">{error}</p>
              </div>
            )}
            {success && (
              <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-green-800 dark:border-green-900 dark:bg-green-950 dark:text-green-200">
                <p className="font-medium">{success}</p>
              </div>
            )}
            {/* Avatar Section */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle>Photo de profil</CardTitle>
                <CardDescription>
                  Téléchargez ou supprimez votre photo de profil
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="size-20 border-4 border-slate-200 dark:border-slate-700">
                    <AvatarImage
                      src={
                        userImage
                          ? `${apiUrl}/uploads/images/${data?.id}/${userImage}`
                          : undefined
                      }
                      alt={data?.nom}
                    />
                    <AvatarFallback className="text-lg font-semibold">
                      {data?.nom?.[0]}
                      {data?.prenom?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <Button
                      onClick={triggerFileInput}
                      disabled={isLoading}
                      className="cursor-pointer gap-2 bg-amber-600 hover:bg-amber-700"
                    >
                      <Upload className="size-4" />
                      {isLoading ? "Chargement..." : "Télécharger"}
                    </Button>
                    <Button
                      onClick={handleDeleteImage}
                      disabled={isLoading}
                      variant="destructive"
                      className="cursor-pointer gap-2"
                    >
                      <Trash2 className="size-4" />
                      Supprimer
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Personal Info Section */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle>Informations personnelles</CardTitle>
                <CardDescription>
                  Mettez à jour vos informations de profil
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="nom" className="text-sm font-medium">
                      Nom
                    </Label>
                    <Input
                      id="nom"
                      type="text"
                      value={formData.nom}
                      onChange={(e) => handleChange("nom", e.target.value)}
                      placeholder="Votre nom"
                      className="border-slate-200 dark:border-slate-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="prenom" className="text-sm font-medium">
                      Prénom
                    </Label>
                    <Input
                      id="prenom"
                      type="text"
                      value={formData.prenom}
                      onChange={(e) => handleChange("prenom", e.target.value)}
                      placeholder="Votre prénom"
                      className="border-slate-200 dark:border-slate-700"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="Votre email"
                    className="border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="niveaux" className="text-sm font-medium">
                      Niveaux
                    </Label>
                    <Select
                      value={formData.niveaux}
                      onValueChange={(value) => handleChange("niveaux", value)}
                    >
                      <SelectTrigger className="w-full border-slate-200 dark:border-slate-700">
                        <SelectValue placeholder="Sélectionnez votre niveau" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Collège</SelectLabel>
                          <SelectItem value="1AC">1AC</SelectItem>
                          <SelectItem value="2AC">2AC</SelectItem>
                          <SelectItem value="3AC">3AC</SelectItem>
                          </SelectGroup>
                        <SelectSeparator />
                        <SelectGroup>
                          <SelectLabel>Lycée</SelectLabel>
                          <SelectItem value="TC">TC</SelectItem>
                          <SelectItem value="1BAC">1BAC</SelectItem>
                          <SelectItem value="2BAC">2BAC</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="langue" className="text-sm font-medium">
                      Langue
                    </Label>
                    <Select
                    defaultValue="FR"
                      onValueChange={(value) => handleChange("langue", value)}
                    >
                      <SelectTrigger defaultValue="FR" className="w-full border-slate-200 dark:border-slate-700">
                        <SelectValue placeholder="Sélectionnez votre langue" />
                      </SelectTrigger>
                      <SelectContent defaultValue="FR">
                        <SelectGroup defaultValue="FR">
                          <SelectLabel>Langues disponibles</SelectLabel>
                          <SelectItem value="FR">Français</SelectItem>
                          <SelectItem value="EN">Anglais</SelectItem>
                          <SelectItem value="AR">Arabe</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              <div className="flex justify-end border-t border-slate-200 px-6 py-4 dark:border-slate-700">
                <Button
                  onClick={handleSavePersonal}
                  className="cursor-pointer bg-cyan-600 hover:bg-cyan-700"
                >
                  Enregistrer les modifications
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* Tab: Security */}
          <TabsContent value="security" className="space-y-6">
            {/* Messages */}
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
                <p className="font-medium">{error}</p>
              </div>
            )}
            {success && (
              <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-green-800 dark:border-green-900 dark:bg-green-950 dark:text-green-200">
                <p className="font-medium">{success}</p>
              </div>
            )}
            {data?.provider === "local" ? (
              <Card className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle>Changer le mot de passe</CardTitle>
                <CardDescription>
                  Mettez à jour votre mot de passe pour sécuriser votre compte
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <Label
                    htmlFor="currentPassword"
                    className="text-sm font-medium"
                  >
                    Mot de passe actuel
                  </Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    placeholder="Entrez votre mot de passe actuel"
                    className="border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-sm font-medium">
                    Nouveau mot de passe
                  </Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={formData.newPassword}
                    onChange={(e) =>
                      handleChange("newPassword", e.target.value)
                    }
                    placeholder="Entrez votre nouveau mot de passe"
                    className="border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="confirmPassword"
                    className="text-sm font-medium"
                  >
                    Confirmer le mot de passe
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      handleChange("confirmPassword", e.target.value)
                    }
                    placeholder="Confirmez votre nouveau mot de passe"
                    className="border-slate-200 dark:border-slate-700"
                  />
                </div>
              </CardContent>
              <div className="flex justify-end border-t border-slate-200 px-6 py-4 dark:border-slate-700">
                <Button
                  onClick={handleChangePassword}
                  className="bg-cyan-600 hover:bg-cyan-700"
                >
                  Changer le mot de passe
                </Button>
              </div>
              </Card>
            ):(
              <Card className="">
                <CardContent className="rounded-md text-sm">Vous êtes connecté avec Google. Vous ne pouvez pas modifier le mot de passe ici.</CardContent>
              </Card>
            )}
            
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;

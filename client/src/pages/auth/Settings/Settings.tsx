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
import { useTranslation } from "react-i18next";

const Settings = () => {
  const { t } = useTranslation();
  document.title = t("settings.pageTitle")
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
        setSuccess(t("settings.profileUpdated"));
        window.location.reload()
        window.location.href = `/Paramètre/${formData?.niveaux}`
      } else {
        setError(resData.data.message || t("settings.updateError"));
      }
    } catch (error) {
      const errorMessage =
        error instanceof axios.AxiosError
          ? error.response?.data?.message
          : t("settings.profileUpdateError");
      setError(errorMessage || t("settings.profileUpdateError"));
      console.error("Erreur:", error);
    }
  };

  const handleChangePassword = async () => {
    try {
      setError(null);
      setSuccess(null);

      if (formData.newPassword !== formData.confirmPassword) {
        setError(t("settings.passwordMismatch"));
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
        setSuccess(t("settings.passwordChanged"));
        setFormData({
          ...formData,
          password: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        setError(data.message || t("settings.changeError"));
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof axios.AxiosError
          ? error.response?.data?.message
          : t("settings.passwordChangeError");
      setError(errorMessage || t("settings.passwordChangeError"));
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
        setSuccess(t("settings.imageUploaded"));
      } else {
        setError(response.data.message || t("settings.uploadError"));
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof axios.AxiosError
          ? error.response?.data?.message
          : t("settings.uploadError");
      setError(errorMessage || t("settings.uploadError"));
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
        setSuccess(t("settings.imageDeleted"));
      } else {
        setError(response.data.message || t("settings.deleteError"));
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof axios.AxiosError
          ? error.response?.data?.message
          : t("settings.deleteError");
      setError(errorMessage || t("settings.deleteError"));
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
            {t("settings.title")}
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            {t("settings.subtitle")}
          </p>
        </div>

        {/* Tabs Container */}
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="mb-6 grid w-full grid-cols-2">
            <TabsTrigger value="personal" className="flex cursor-pointer items-center gap-2">
              <User className="size-4" />
              <span>{t("settings.tabs.informations")}</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex cursor-pointer items-center gap-2">
              <Lock className="size-4" />
              <span>{t("settings.tabs.security")}</span>
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
                <CardTitle>{t("settings.profilePhoto.title")}</CardTitle>
                <CardDescription>
                  {t("settings.profilePhoto.description")}
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
                      {isLoading ? t("common.loading") : t("settings.profilePhoto.upload")}
                    </Button>
                    <Button
                      onClick={handleDeleteImage}
                      disabled={isLoading}
                      variant="destructive"
                      className="cursor-pointer gap-2"
                    >
                      <Trash2 className="size-4" />
                      {t("common.delete")}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Personal Info Section */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle>{t("settings.personalInfo.title")}</CardTitle>
                <CardDescription>
                  {t("settings.personalInfo.description")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="nom" className="text-sm font-medium">
                      {t("settings.fields.lastName")}
                    </Label>
                    <Input
                      id="nom"
                      type="text"
                      value={formData.nom}
                      onChange={(e) => handleChange("nom", e.target.value)}
                      placeholder={t("settings.fields.lastNamePlaceholder")}
                      className="border-slate-200 dark:border-slate-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="prenom" className="text-sm font-medium">
                      {t("settings.fields.firstName")}
                    </Label>
                    <Input
                      id="prenom"
                      type="text"
                      value={formData.prenom}
                      onChange={(e) => handleChange("prenom", e.target.value)}
                      placeholder={t("settings.fields.firstNamePlaceholder")}
                      className="border-slate-200 dark:border-slate-700"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    {t("settings.fields.email")}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder={t("settings.fields.emailPlaceholder")}
                    className="border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="niveaux" className="text-sm font-medium">
                      {t("settings.fields.level")}
                    </Label>
                    <Select
                      value={formData.niveaux}
                      onValueChange={(value) => handleChange("niveaux", value)}
                    >
                      <SelectTrigger className="w-full border-slate-200 dark:border-slate-700">
                        <SelectValue placeholder={t("settings.fields.levelPlaceholder")} />
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
                  </div>
                </div>
              </CardContent>
              <div className="flex justify-end border-t border-slate-200 px-6 py-4 dark:border-slate-700">
                <Button
                  onClick={handleSavePersonal}
                  className="cursor-pointer bg-cyan-600 hover:bg-cyan-700"
                >
                  {t("settings.saveChanges")}
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
                <CardTitle>{t("settings.password.title")}</CardTitle>
                <CardDescription>
                  {t("settings.password.description")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <Label
                    htmlFor="currentPassword"
                    className="text-sm font-medium"
                  >
                    {t("settings.password.current")}
                  </Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    placeholder={t("settings.password.currentPlaceholder")}
                    className="border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-sm font-medium">
                    {t("settings.password.new")}
                  </Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={formData.newPassword}
                    onChange={(e) =>
                      handleChange("newPassword", e.target.value)
                    }
                    placeholder={t("settings.password.newPlaceholder")}
                    className="border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="confirmPassword"
                    className="text-sm font-medium"
                  >
                    {t("settings.password.confirm")}
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      handleChange("confirmPassword", e.target.value)
                    }
                    placeholder={t("settings.password.confirmPlaceholder")}
                    className="border-slate-200 dark:border-slate-700"
                  />
                </div>
              </CardContent>
              <div className="flex justify-end border-t border-slate-200 px-6 py-4 dark:border-slate-700">
                <Button
                  onClick={handleChangePassword}
                  className="bg-cyan-600 hover:bg-cyan-700"
                >
                  {t("settings.password.submit")}
                </Button>
              </div>
              </Card>
            ):(
              <Card className="">
                <CardContent className="rounded-md text-sm">{t("settings.password.googleNotice")}</CardContent>
              </Card>
            )}
            
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;

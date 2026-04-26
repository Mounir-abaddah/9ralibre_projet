import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import axios from "axios";
import { useEffect, useState } from "react";
import { useProfProtectedRoutes } from "@/store/userStore";
import type { Matiere, TypeProfVideos } from "@/pages/auth/Video/types/video.type";
import toast from "react-hot-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CircleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  fieldErrorsFromIssues,
  messagesFromApiData,
  type ProfApiErrorBody,
} from "@/utils/profApiErrors";

interface typeModal {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  matiere: Matiere[];
  onSuccess: () => void;
  videos: TypeProfVideos | null;
}

const AddVideosModal = ({ open, setOpen, matiere, onSuccess,videos }: typeModal) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { data, fetchData } = useProfProtectedRoutes();
 
  const [niveauId, setNiveauId] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [bannerError, setBannerError] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    videoUrl: "",
    thumbnail: "",
    matiere: "",
    filiere: "",
    visibility: "Public",
  });

  useEffect(() => {
  if (videos) {
    setForm({
      title: videos.title || "",
      description: videos.description || "",
      videoUrl: videos.videoUrl || "",
      thumbnail: videos.thumbnail || "",
      matiere: videos.matiere._id || "",
      filiere: videos.filiere || "",
      visibility: videos.visibility || "Public",
    });
  }
}, [videos]);

  const niveauxLabel = data?.niveaux ?? "";

  // ✅ FETCH NIVEAU ID
  useEffect(() => {
    const getNiveau = async () => {
      const res = await axios.get(`${apiUrl}/prof/fetch-niveaux`, {
        withCredentials: true,
      });
      setNiveauId(res.data._id);
    };

    getNiveau();
    fetchData();
  }, []);

    const filiereByNiveau: Record<string, string[]> = {
    "1AC": [
      "Science",
    ],
    "2AC": [
      "Science",
    ],
    "3AC": [
      "Science",
    ],
    "TC": [
      "Sciences",
      "Technologies",
      "Lettres et Sciences Humaines",
    ],
    "1BAC": [
      "Sciences Mathématiques",
      "Sciences Expérimentales",
      "Sciences et Technologies Électriques",
      "Sciences et Technologies Mécaniques",
      "Sciences Économiques et Gestion",
      "Lettres et Sciences Humaines",
    ],
    "2BAC": [
      "Sciences Mathématiques A",
      "Sciences Mathématiques B",
      "Sciences Physiques",
      "Sciences de la Vie et de la Terre (SVT)",
      "Sciences Agronomiques",
      "Sciences et Technologies Électriques",
      "Sciences et Technologies Mécaniques",
      "Sciences Économiques",
      "Sciences de Gestion Comptable (SGC)",
      "Lettres",
      "Sciences Humaines",
    ],
  };

  // RESET
  useEffect(() => {
    if (!open) {
      setForm({
        title: "",
        description: "",
        videoUrl: "",
        thumbnail: "",
        matiere: "",
        filiere: "",
        visibility: "Public",
      });
      setFieldErrors({});
      setBannerError("");
    }
  }, [open]);

  // SUBMIT
const handleSubmit = async () => {
  setFieldErrors({});
  setBannerError("");
  try {
    if (videos) {
      // ✏️ UPDATE
      await axios.put(
        `${apiUrl}/prof/update-videos/${videos._id}`,
        {
          ...form,
          niveaux: niveauId,
        },
        { withCredentials: true }
      );
      toast.success("Videos modifié avec succès ✏️");
    } else {
      // ➕ ADD
      await axios.post(
        `${apiUrl}/prof/add-videos`,
        {
          ...form,
          niveaux: niveauId,
        },
        { withCredentials: true }
      );
      toast.success("Videos ajouter avec succès ✏️");
    }

    setOpen(false);
    onSuccess();
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const data = err.response?.data as ProfApiErrorBody | undefined;
      const issues = data?.issues;
      if (issues?.length) {
        setFieldErrors(fieldErrorsFromIssues(issues));
      }
      const msg =
        typeof data?.message === "string" && data.message.trim()
          ? data.message.trim()
          : messagesFromApiData(data).join(" · ");
      if (!issues?.length) {
        setBannerError(msg || "Une erreur est survenue");
      }
      if (err.response?.status && err.response.status >= 500) {
        toast.error("Erreur serveur. Réessayez plus tard.");
      }
    } else {
      setBannerError("Une erreur est survenue");
    }
  }
};

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-full max-w-2xl">
        <DialogHeader>
          <DialogTitle> {videos ? "Modifier la vidéo" : "Ajouter une vidéo"} </DialogTitle>
          <DialogDescription>
            Remplissez les informations
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {bannerError && (
            <Alert variant="destructive" className="border-red-200 bg-red-50 text-red-900">
              <CircleAlert className="size-4 shrink-0" />
              <AlertTitle className="text-sm font-semibold">Enregistrement impossible</AlertTitle>
              <AlertDescription className="text-sm text-red-800">
                {bannerError}
              </AlertDescription>
            </Alert>
          )}

          {Object.keys(fieldErrors).length > 0 && !bannerError && (
            <Alert className="border-amber-200 bg-amber-50 text-amber-950">
              <CircleAlert className="size-4 shrink-0 text-amber-700" />
              <AlertTitle className="text-sm font-semibold">Champs à corriger</AlertTitle>
              <AlertDescription className="text-sm text-amber-900">
                Vérifiez les champs indiqués ci-dessous.
              </AlertDescription>
            </Alert>
          )}

          {/* Niveau + Matière */}
          <div className="flex gap-2">
            <div className="w-full space-y-2">
              <Label>Niveau</Label>
              <Input
                value={niveauxLabel || "Non renseigné"}
                disabled
                className={cn(
                  fieldErrors.niveaux && "border-destructive ring-1 ring-destructive/30"
                )}
              />
              {fieldErrors.niveaux && (
                <p className="text-sm text-destructive">{fieldErrors.niveaux}</p>
              )}
            </div>

            <div className="w-full space-y-2">
              <Label>Matière</Label>
              <Select
                value={form.matiere}
                onValueChange={(value) => {
                  setForm({ ...form, matiere: value });
                  setFieldErrors((p) => {
                    const n = { ...p };
                    delete n.matiere;
                    return n;
                  });
                }}
              >
                <SelectTrigger
                  className={cn(
                    "w-full",
                    fieldErrors.matiere && "border-destructive ring-1 ring-destructive/30"
                  )}
                >
                  <SelectValue placeholder="Choisir une matière" />
                </SelectTrigger>
                <SelectContent>
                  {matiere.map((mat) => (
                    <SelectItem key={mat._id} value={mat._id}>
                      {mat.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldErrors.matiere && (
                <p className="text-sm text-destructive">{fieldErrors.matiere}</p>
              )}
            </div>
          </div>

          {/* Titre */}
          <div className="space-y-2">
            <Label>Titre</Label>
            <Input
              value={form.title}
              onChange={(e) => {
                setForm({ ...form, title: e.target.value });
                setFieldErrors((p) => {
                  const n = { ...p };
                  delete n.title;
                  return n;
                });
              }}
              placeholder="Titre de la vidéo"
              className={cn(
                fieldErrors.title && "border-destructive ring-1 ring-destructive/30"
              )}
            />
            {fieldErrors.title && (
              <p className="text-sm text-destructive">{fieldErrors.title}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={form.description}
              onChange={(e) => {
                setForm({ ...form, description: e.target.value });
                setFieldErrors((p) => {
                  const n = { ...p };
                  delete n.description;
                  return n;
                });
              }}
              placeholder="Description"
              className={cn(
                fieldErrors.description && "border-destructive ring-1 ring-destructive/30"
              )}
            />
            {fieldErrors.description && (
              <p className="text-sm text-destructive">{fieldErrors.description}</p>
            )}
          </div>

          {/* URL + Thumbnail */}
          <div className="flex gap-2">
            <div className="w-full space-y-2">
              <Label>Video URL</Label>
              <Input
                value={form.videoUrl}
                type="url"
                onChange={(e) => {
                  setForm({ ...form, videoUrl: e.target.value });
                  setFieldErrors((p) => {
                    const n = { ...p };
                    delete n.videoUrl;
                    return n;
                  });
                }}
                placeholder="https://youtube.com/..."
                className={cn(
                  fieldErrors.videoUrl && "border-destructive ring-1 ring-destructive/30"
                )}
              />
              {fieldErrors.videoUrl && (
                <p className="text-sm text-destructive">{fieldErrors.videoUrl}</p>
              )}
            </div>
            <div className="w-full space-y-2">
              <Label>Thumbnail</Label>
              <Input
                value={form.thumbnail}
                type="url"
                onChange={(e) => {
                  setForm({ ...form, thumbnail: e.target.value });
                  setFieldErrors((p) => {
                    const n = { ...p };
                    delete n.thumbnail;
                    return n;
                  });
                }}
                placeholder="Image URL (optionnel)"
                className={cn(
                  fieldErrors.thumbnail && "border-destructive ring-1 ring-destructive/30"
                )}
              />
              {fieldErrors.thumbnail && (
                <p className="text-sm text-destructive">{fieldErrors.thumbnail}</p>
              )}
            </div>
          </div>
          <div className="flex w-full items-center justify-between gap-2">
            {/* Filière */}
              <div className="w-full space-y-2">
                <Label>Filière</Label>
                <Select
                  value={form.filiere}
                  onValueChange={(value) => {
                    setForm({ ...form, filiere: value });
                    setFieldErrors((p) => {
                      const n = { ...p };
                      delete n.filiere;
                      return n;
                    });
                  }}
                >
                  <SelectTrigger
                    className={cn(
                      "w-full",
                      fieldErrors.filiere && "border-destructive ring-1 ring-destructive/30"
                    )}
                  >
                    <SelectValue placeholder="Choisir filière" />
                  </SelectTrigger>
                  <SelectContent>
                    {(filiereByNiveau[niveauxLabel] ?? []).map((f) => (
                      <SelectItem key={f} value={f}>
                        {f}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldErrors.filiere && (
                  <p className="text-sm text-destructive">{fieldErrors.filiere}</p>
                )}
              </div>
            {/* Visibilité */}
            <div className="w-full space-y-2">
              <Label>Visibilité</Label>
              <Select
                value={form.visibility}
                onValueChange={(value) => {
                  setForm({ ...form, visibility: value });
                  setFieldErrors((p) => {
                    const n = { ...p };
                    delete n.visibility;
                    return n;
                  });
                }}
              >
                <SelectTrigger
                  className={cn(
                    "w-full",
                    fieldErrors.visibility && "border-destructive ring-1 ring-destructive/30"
                  )}
                >
                  <SelectValue placeholder="Visibilité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Public">Public</SelectItem>
                  <SelectItem value="Private">Privé</SelectItem>
                </SelectContent>
              </Select>
              {fieldErrors.visibility && (
                <p className="text-sm text-destructive">{fieldErrors.visibility}</p>
              )}
            </div>
          </div>
          {/* Buttons */}
          <div className="flex justify-end gap-2 ">
            <Button variant="outline" onClick={() => setOpen(false)} className="cursor-pointer">
              Annuler
            </Button>

            <Button
              onClick={handleSubmit}
              className="cursor-pointer bg-amber-500 hover:bg-amber-600"
            >
              {videos ? "Modifier" : "Ajouter"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddVideosModal;
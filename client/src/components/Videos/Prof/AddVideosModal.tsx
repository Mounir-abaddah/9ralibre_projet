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
import { useTranslation } from "react-i18next";

interface typeModal {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  matiere: Matiere[];
  onSuccess: () => void;
  videos: TypeProfVideos | null;
}

const AddVideosModal = ({ open, setOpen, matiere, onSuccess,videos }: typeModal) => {
  const { t } = useTranslation();
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
      toast.success(t("profVideos.updated"));
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
      toast.success(t("profVideos.added"));
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
        setBannerError(msg || t("profVideos.error"));
      }
      if (err.response?.status && err.response.status >= 500) {
        toast.error(t("profVideos.serverError"));
      }
    } else {
      setBannerError(t("profVideos.error"));
    }
  }
};

const filiereMatiereMap: Record<string, string[]> = {
  "Science": [
    "Mathématiques",
    "Physique et Chimie",
    "Sciences de la Vie et de la Terre (SVT)",
    "Arabe",
    "Français",
    "Anglais",
    "Education Islamique",
    "Philosophie",
    "Histoire Géographie",
    "Informatique",
  ],
  "Sciences": [
    "Mathématiques",
    "Physique et Chimie",
    "Sciences de la Vie et de la Terre (SVT)",
    "Arabe",
    "Français",
    "Anglais",
    "Education Islamique",
    "Philosophie",
    "Histoire Géographie",
    "Informatique",
  ],
  "Technologies": [
    "Mathématiques",
    "Physique et Chimie",
    "Sciences de l'ingénieur",
    "Arabe",
    "Français",
    "Anglais",
    "Education Islamique",
    "Philosophie",
    "Histoire Géographie",
    "Informatique",
  ],
  "Lettres et Sciences Humaines": [
    "Mathématiques",
    "Sciences de la Vie et de la Terre (SVT)",
    "Arabe",
    "Français",
    "Anglais",
    "Philosophie",
    "Histoire Géographie",
    "Informatique",
  ],
  "Sciences Mathématiques A": [
    "Mathématiques",
    "Physique et Chimie",
    "Sciences de la Vie et de la Terre (SVT)",
    "Arabe",
    "Français",
    "Anglais",
    "Education Islamique",
    "Philosophie",
    "Histoire Géographie",
  ],

  "Sciences Mathématiques B": [
    "Mathématiques",
    "Physique et Chimie",
    "Sciences de l'ingénieur",
    "Arabe",
    "Français",
    "Anglais",
    "Education Islamique",
    "Philosophie",
    "Histoire Géographie",
  ],

  "Sciences Physiques": [
    "Mathématiques",
    "Physique et Chimie",
    "Sciences de la Vie et de la Terre (SVT)",
    "Arabe",
    "Français",
    "Anglais",
    "Education Islamique",
    "Philosophie",
  ],

  "Sciences de la Vie et de la Terre (SVT)": [
    "Mathématiques",
    "Physique et Chimie",
    "Sciences de la Vie et de la Terre (SVT)",
    "Arabe",
    "Français",
    "Anglais",
    "Education Islamique",
    "Philosophie",
  ],

  "Sciences Agronomiques": [
    "Mathématiques",
    "Physique et Chimie",
    "Sciences de la Vie et de la Terre (SVT)",
    "Sciences Végétales et Animales (SVA)",
    "Arabe",
    "Français",
    "Anglais",
    "Education Islamique",
    "Philosophie",
    "Histoire Géographie",
  ],

  "Sciences et Technologies Électriques": [
    "Mathématiques",
    "Physique et Chimie",
    "Sciences de l'ingénieur",
    "Arabe",
    "Français",
    "Anglais",
    "Education Islamique",
    "Philosophie",
  ],

  "Sciences et Technologies Mécaniques": [
    "Mathématiques",
    "Physique et Chimie",
    "Sciences de l'ingénieur",
    "Arabe",
    "Français",
    "Anglais",
    "Education Islamique",
    "Philosophie",
  ],

  "Sciences Économiques": [
    "Mathématiques",
    "Économie générale et Statistiques",
    "Comptabilité et Mathématiques financières",
    "Économie et Organisation Administrative des Entreprises",
    "Droit",
    "Informatique de gestion",
    "Arabe",
    "Français",
    "Anglais",
    "Education Islamique",
    "Philosophie",
    "Histoire Géographie",
  ],

  "Sciences Économiques et Gestion": [
    "Mathématiques",
    "Économie générale et Statistiques",
    "Comptabilité et Mathématiques financières",
    "Économie et Organisation Administrative des Entreprises",
    "Droit",
    "Informatique de gestion",
    "Arabe",
    "Français",
    "Anglais",
    "Education Islamique",
    "Philosophie",
    "Histoire Géographie",
  ],

  "Sciences de Gestion Comptable (SGC)": [
    "Mathématiques",
    "Économie générale et Statistiques",
    "Comptabilité et Mathématiques financières",
    "Économie et Organisation Administrative des Entreprises",
    "Droit",
    "Informatique de gestion",
    "Arabe",
    "Français",
    "Anglais",
    "Education Islamique",
    "Philosophie",
    "Histoire Géographie",
  ],

  "Lettres": [
    "Mathématiques",
    "Arabe",
    "Français",
    "Anglais",
    "Philosophie",
    "Histoire Géographie",
    "Education Islamique",
  ],

  "Sciences Humaines": [
    "Mathématiques",
    "Arabe",
    "Français",
    "Anglais",
    "Philosophie",
    "Histoire Géographie",
    "Education Islamique",
  ],
};

  useEffect(() => {
    if (!open || videos) return;
    setForm((prev) => {
      if (prev.filiere) return prev;
      const isCollege =
        niveauxLabel === "1AC" ||
        niveauxLabel === "2AC" ||
        niveauxLabel === "3AC";
      let nextFiliere = "";
      if (isCollege) nextFiliere = "Science";
      else {
        const profNom =
          data?.matiere && typeof data.matiere === "object"
            ? data.matiere.nom
            : "";
        if (profNom && niveauxLabel) {
          const filieresForNiveau = filiereByNiveau[niveauxLabel] ?? [];
          nextFiliere =
            filieresForNiveau.find((f) =>
              filiereMatiereMap[f]?.includes(profNom)
            ) ?? "";
        }
      }
      if (!nextFiliere) return prev;
      return { ...prev, filiere: nextFiliere };
    });
  }, [open, videos, niveauxLabel, data?.matiere]);

  useEffect(() => {
    if (!open || videos || !form.filiere || !matiere.length) return;
    const filtered = matiere.filter((mat) =>
      filiereMatiereMap[form.filiere]?.includes(mat.nom)
    );
    const profId =
      data?.matiere && typeof data.matiere === "object"
        ? String(data.matiere._id)
        : "";
    const profNom =
      data?.matiere && typeof data.matiere === "object"
        ? data.matiere.nom
        : "";
    setForm((prev) => {
      if (prev.matiere) return prev;
      let next = "";
      if (profId && filtered.some((m) => m._id === profId)) next = profId;
      else if (profNom) {
        const byName = filtered.find((m) => m.nom === profNom);
        if (byName) next = byName._id;
      }
      if (!next) return prev;
      return { ...prev, matiere: next };
    });
  }, [open, videos, form.filiere, matiere, data?.matiere]);

const filteredMatieres = form.filiere
  ? matiere.filter((mat) =>
      filiereMatiereMap[form.filiere]?.includes(mat.nom)
    )
  : [];
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-full max-w-2xl">
        <DialogHeader>
          <DialogTitle> {videos ? t("profVideos.editTitle") : t("profVideos.addTitle")} </DialogTitle>
          <DialogDescription>
            {t("profVideos.fillInfo")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {bannerError && (
            <Alert variant="destructive" className="border-red-200 bg-red-50 text-red-900">
              <CircleAlert className="size-4 shrink-0" />
              <AlertTitle className="text-sm font-semibold">{t("profVideos.saveImpossible")}</AlertTitle>
              <AlertDescription className="text-sm text-red-800">
                {bannerError}
              </AlertDescription>
            </Alert>
          )}

          {Object.keys(fieldErrors).length > 0 && !bannerError && (
            <Alert className="border-amber-200 bg-amber-50 text-amber-950">
              <CircleAlert className="size-4 shrink-0 text-amber-700" />
              <AlertTitle className="text-sm font-semibold">{t("profVideos.fieldsToFix")}</AlertTitle>
              <AlertDescription className="text-sm text-amber-900">
                {t("profVideos.checkFields")}
              </AlertDescription>
            </Alert>
          )}

          {/* Niveau + Matière */}
          <div className="flex gap-2">
            <div className="w-full space-y-2">
              <Label>{t("profVideos.level")}</Label>
              <Input
                value={niveauxLabel || t("profVideos.notProvided")}
                disabled
                className={cn(
                  fieldErrors.niveaux && "border-destructive ring-1 ring-destructive/30"
                )}
              />
              {fieldErrors.niveaux && (
                <p className="text-sm text-destructive">{fieldErrors.niveaux}</p>
              )}
            </div>

             {/* Filière */}
              <div className="w-full space-y-2">
                <Label>{t("courseFilters.stream")}</Label>
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
                    <SelectValue placeholder={t("profVideos.chooseStream")} />
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
          </div>

          {/* Titre */}
          <div className="space-y-2">
            <Label>{t("profVideos.title")}</Label>
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
              placeholder={t("profVideos.titlePlaceholder")}
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
            <Label>{t("profVideos.description")}</Label>
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
              placeholder={t("profVideos.description")}
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
              <Label>{t("profVideos.videoUrl")}</Label>
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
              <Label>{t("profVideos.thumbnail")}</Label>
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
                placeholder={t("profVideos.thumbnailPlaceholder")}
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
            <div className="w-full space-y-2">
              <Label>{t("videoFilters.subjects")}</Label>
              <Select
                value={form.matiere}
                disabled={!form.filiere}
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
                  <SelectValue placeholder={t("profVideos.chooseSubject")} />
                </SelectTrigger>
                <SelectContent>
                  {filteredMatieres.map((mat) => (
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
            {/* Visibilité */}
            <div className="w-full space-y-2">
              <Label>{t("profVideos.visibility")}</Label>
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
                  <SelectValue placeholder={t("profVideos.visibility")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Public">Public</SelectItem>
                  <SelectItem value="Private">{t("profVideos.private")}</SelectItem>
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
              {t("common.cancel")}
            </Button>

            <Button
              onClick={handleSubmit}
              className="cursor-pointer bg-amber-500 hover:bg-amber-600"
            >
              {videos ? t("common.edit") : t("calendar.add")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddVideosModal;
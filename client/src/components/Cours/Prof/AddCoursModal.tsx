import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useProfProtectedRoutes } from "@/store/userStore";
import { useEffect, useState } from "react";
import axios from "axios";
import { Send } from "lucide-react";
import type { CoursType, Matiere } from "@/pages/auth/Cours/types/CoursType";
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
  cours: CoursType | null;
}

const AddCoursModal = ({ open, setOpen, matiere, onSuccess,cours }: typeModal) => {
  const { data, fetchData } = useProfProtectedRoutes();

  const [type, setType] = useState("");
  const [matiereSelected, setMatiereSelected] = useState("");
  const [filiere, setFiliere] = useState("");
  const [title, setTitle] = useState("");
  const [semestre, setSemestre] = useState("Non renseigné");
  const [file, setFile] = useState<File | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [bannerError, setBannerError] = useState("");

  const niveaux = data?.niveaux ?? "";
  const isEdit = !!cours;

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  

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

  const typeOptions = ["Cours", "Exercice", "Examen"];
  if (niveaux === "3AC" || niveaux === "1BAC") {
    typeOptions.push("Examen Régional");
  }
  if (niveaux === "2BAC") {
    typeOptions.push("Examen National");
  }


  useEffect(() => {
    if (cours) {
      setTitle(cours.title);
      setType(cours.type);
      setSemestre(cours.semestre);
      setFiliere(cours.filière);
      setMatiereSelected(cours.matiere?._id);
    }
  }, [cours]);


    useEffect(() => {
    if (!open) {
      setTitle("");
      setType("");
      setSemestre("");
      setFiliere("");
      setMatiereSelected("");
      setFile(null);
      setFieldErrors({});
      setBannerError("");
    }
  }, [open]);

  // ✅ SUBMIT
  const handleSubmit = async () => {
    setFieldErrors({});
    setBannerError("");
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("type", type);
      formData.append("filiere", filiere);
      formData.append("matiere", matiereSelected);
      formData.append("semestre", semestre);

      if (file) {
        formData.append("file", file);
      }

      if (isEdit) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/prof/put-cours/${cours?._id}`,
          formData,
          { withCredentials: true }
        );
        toast.success("Cours modifié ✏️");
      } else {
        if (!file) {
          setBannerError("Ajoutez un fichier PDF pour publier le cours.");
          return;
        }

        await axios.post(
          `${import.meta.env.VITE_API_URL}/prof/add-cours`,
          formData,
          { withCredentials: true }
        );
        toast.success("Cours ajouté 🎉");
      }

      setOpen(false);
      onSuccess();

    } catch (error) {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data as ProfApiErrorBody | undefined;
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
        if (error.response?.status && error.response.status >= 500) {
          toast.error("Erreur serveur. Réessayez plus tard.");
        }
      } else {
        setBannerError("Une erreur est survenue");
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

  const filteredMatieres = filiere? matiere.filter((mat) =>filiereMatiereMap[filiere]?.includes(mat.nom)): [];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-full max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Modifier cours" : "Ajouter cours"}</DialogTitle>
          <DialogDescription>
            Remplissez les informations
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {bannerError && (
            <Alert variant="destructive" className="border-red-200 bg-red-50 text-red-900">
              <CircleAlert className="size-4 shrink-0" />
              <AlertTitle className="text-sm font-semibold">Publication impossible</AlertTitle>
              <AlertDescription className="text-sm text-red-800">
                {bannerError}
              </AlertDescription>
            </Alert>
          )}

          {Object.keys(fieldErrors).length > 0 && !bannerError && (
            <Alert variant="destructive" className="border-amber-200 bg-amber-50 text-amber-950">
              <CircleAlert className="size-4 shrink-0 text-amber-700" />
              <AlertTitle className="text-sm font-semibold">Champs à corriger</AlertTitle>
              <AlertDescription className="text-sm text-amber-900">
                Vérifiez les champs indiqués ci-dessous.
              </AlertDescription>
            </Alert>
          )}

          <div className="flex w-full items-center justify-between gap-2">
            <div className="w-full space-y-2">
              <Label>Niveau</Label>
              <Input value={niveaux || "Non renseigné"} disabled />
            </div>
            <div className="w-full space-y-2">
              <Label>Filière</Label>
              <Select
                value={filiere}
                onValueChange={(v) => {
                  setFiliere(v);
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
                  <SelectValue placeholder="Filière" />
                </SelectTrigger>
                <SelectContent>
                  {(filiereByNiveau[niveaux] ?? []).map((f) => (
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

          <div className="space-y-2">
            <Label>Titre</Label>
            <Input
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setFieldErrors((p) => {
                  const n = { ...p };
                  delete n.title;
                  return n;
                });
              }}
              className={cn(fieldErrors.title && "border-destructive ring-1 ring-destructive/30")}
            />
            {fieldErrors.title && (
              <p className="text-sm text-destructive">{fieldErrors.title}</p>
            )}
          </div>

          <div className="flex w-full items-center justify-between gap-2">
            <div className="w-full space-y-2">
              <Label>Type</Label>
              <Select
                value={type}
                onValueChange={(v) => {
                  setType(v);
                  setFieldErrors((p) => {
                    const n = { ...p };
                    delete n.type;
                    return n;
                  });
                }}
              >
                <SelectTrigger
                  className={cn(
                    "w-full",
                    fieldErrors.type && "border-destructive ring-1 ring-destructive/30"
                  )}
                >
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  {typeOptions.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldErrors.type && (
                <p className="text-destructive text-sm">{fieldErrors.type}</p>
              )}
            </div>

            <div className="w-full space-y-2 ">
              <Label>Semestre</Label>
              <Select
                value={semestre}
                onValueChange={(v) => {
                  setSemestre(v);
                  setFieldErrors((p) => {
                    const n = { ...p };
                    delete n.semestre;
                    return n;
                  });
                }}
              >
                <SelectTrigger
                  className={cn(
                    "w-full",
                    fieldErrors.semestre && "border-destructive ring-1 ring-destructive/30"
                  )}
                >
                  <SelectValue placeholder="Semestre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Non renseigné">
                    Non renseigné
                  </SelectItem>
                  <SelectItem value="Premier Semestre">
                    Premier Semestre
                  </SelectItem>
                  <SelectItem value="Deuxième Semestre">
                    Deuxième Semestre
                  </SelectItem>
                </SelectContent>
              </Select>
              {fieldErrors.semestre && (
                <p className="text-sm text-destructive">{fieldErrors.semestre}</p>
              )}
            </div>
          </div>
            <div className="w-full space-y-2">
              <Label>Matière</Label>
              <Select
                value={matiereSelected}
                onValueChange={(v) => {
                  setMatiereSelected(v);
                  setFieldErrors((prev) => {
                    const n = { ...prev };
                    delete n.matiere;
                    return n;
                  });
                }}
                disabled={!filiere}
              >
                <SelectTrigger
                  className={cn(
                    "w-full",
                    fieldErrors.matiere && "border-destructive ring-1 ring-destructive/30"
                  )}
                >
                  <SelectValue placeholder="Choisir une matière"/>
                </SelectTrigger>
                <SelectContent position="popper">
                  {filteredMatieres.map((mat) => (
                    <SelectItem key={mat._id} value={mat._id}>
                      {mat.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldErrors.matiere && (
                <p className="text-destructive text-sm">{fieldErrors.matiere}</p>
              )}
            </div>
          

          <div className="space-y-2">
            <Label>PDF</Label>
            <Input
              type="file"
              accept="application/pdf"
              onChange={(e) => {
                setFile(e.target.files?.[0] || null);
                setBannerError("");
              }}
              className={cn(
                bannerError.includes("PDF") && "border-destructive ring-1 ring-destructive/30"
              )}
            />
          </div>

          {/* Buttons */}
          <div className="flex items-end justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)} className="cursor-pointer">
              Annuler
            </Button>
            <Button onClick={handleSubmit} className="cursor-pointer bg-amber-500 hover:bg-amber-600">
              Publier <Send />
            </Button>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddCoursModal;
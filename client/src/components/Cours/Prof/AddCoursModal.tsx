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
  const [semestre, setSemestre] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const niveaux = data?.niveaux ?? "";
  const isEdit = !!cours;

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const showFiliere =
    niveaux === "TC" || niveaux === "1BAC" || niveaux === "2BAC";

  const filiereByNiveau: Record<string, string[]> = {
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
      "SVT",
      "Sciences Économiques",
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
    }
  }, [open]);

  // ✅ SUBMIT
  const handleSubmit = async () => {
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
      } else {
        if (!file) {
          alert("Ajouter fichier");
          return;
        }

        await axios.post(
          `${import.meta.env.VITE_API_URL}/prof/add-cours`,
          formData,
          { withCredentials: true }
        );
      }

      setOpen(false);
      onSuccess();

    } catch (error) {
      console.error(error);
    }
  };

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
          <div className="flex w-full items-center justify-between gap-2">
            <div className="w-full space-y-2">
              <Label>Niveau</Label>
              <Input value={niveaux || "Non renseigné"} disabled />
            </div>
            <div className="w-full space-y-2">
              <Label>Matière</Label>
              <Select
                value={matiereSelected}
                onValueChange={setMatiereSelected}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choisir une matière"/>
                </SelectTrigger>
                <SelectContent>
                  {matiere.map((mat) => (
                    <SelectItem key={mat._id} value={mat._id}>
                      {mat.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Titre</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="flex w-full items-center justify-between gap-2">
            <div className="w-full space-y-2">
              <Label>Type</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="w-full">
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
            </div>

            <div className="w-full space-y-2 ">
              <Label>Semestre</Label>
              <Select value={semestre} onValueChange={setSemestre}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Semestre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Premier Semestre">
                    Premier Semestre
                  </SelectItem>
                  <SelectItem value="Deuxième Semestre">
                    Deuxième Semestre
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Filiere */}
          {showFiliere && (
            <div className="w-full space-y-2">
              <Label>Filière</Label>
              <Select value={filiere} onValueChange={setFiliere}>
                <SelectTrigger className="w-full">
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
            </div>
          )}

          <div className="space-y-2">
            <Label>PDF</Label>
            <Input
              type="file"
              onChange={(e) =>
                setFile(e.target.files?.[0] || null)
              }
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
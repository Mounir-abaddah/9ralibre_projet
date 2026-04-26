import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useProfProtectedRoutes } from "@/store/userStore";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import type { Matiere } from "@/pages/auth/Cours/types/CoursType";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface typeModal {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedMatiere: (value: string) => void;
  setSelectedFiliere: (value: string) => void;
}

const MatiereModal = ({
  openModal,
  setOpenModal,
  setSelectedMatiere,
  setSelectedFiliere,
}: typeModal) => {
  const apiUrl = import.meta.env.VITE_API_URL;

  const [matiere, setMatiere] = useState<Matiere[]>([]);
  const [matiereValue, setMatiereValue] = useState("");
  const [filiereValue, setFiliereValue] = useState("");

  const { data, fetchData } = useProfProtectedRoutes();
  const niveauxLabel = data?.niveaux ?? "";

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

  const getMatiere = async () => {
    const res = await axios.get(`${apiUrl}/prof/fetch-matiere`, {
      withCredentials: true,
    });
    setMatiere(res.data);
  };

  useEffect(() => {
    fetchData();
    getMatiere();
  }, []);

  return (
    <Dialog open={openModal} onOpenChange={setOpenModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Choisir Matière & Filière</DialogTitle>
        </DialogHeader>

        {/* Niveau */}
        <div className="w-full space-y-2">
            <Label>Niveau</Label>
            <Input value={data?.niveaux || "Non défini"} disabled />
        </div>

        
        <div className="flex items-center justify-between gap-2">
            <div className="w-full space-y-2">
            <Label>Matière</Label>
            <Select value={matiereValue} onValueChange={setMatiereValue}>
                <SelectTrigger className="w-full">
                <SelectValue placeholder="Choisir matière" className="w-full"/>
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
            {data?.niveaux === "1AC" || data?.niveaux==="2AC" || data?.niveaux==="3AC" ? (
              <div>

              </div>
            ):(
              <div className="w-full">
                {/* Filière */}
                <div className="w-full space-y-2">
                <Label>Filière</Label>
                <Select value={filiereValue} onValueChange={setFiliereValue}>
                    <SelectTrigger className="w-full">
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
                </div>
              </div>
            )}
            
        </div>
        

        

        {/* BUTTON */}
        <Button
            className="w-full cursor-pointer"
            onClick={() => {
              const isCollege =
                data?.niveaux === "1AC" ||
                data?.niveaux === "2AC" ||
                data?.niveaux === "3AC";

              if (!matiereValue || (!isCollege && !filiereValue)) return;

              setSelectedMatiere(matiereValue);

              if (!isCollege) {
                setSelectedFiliere(filiereValue);
              }

              setOpenModal(false);
            }}
        >
            Confirmer
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default MatiereModal;
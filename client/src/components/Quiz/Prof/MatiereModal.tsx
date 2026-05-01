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
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
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

const filteredMatieres = filiereValue
  ? matiere.filter((mat) =>
      filiereMatiereMap[filiereValue]?.includes(mat.nom)
    )
  : [];

  return (
    <Dialog open={openModal} onOpenChange={setOpenModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("prof.modal.chooseSubjectAndStream")}</DialogTitle>
        </DialogHeader>

        {/* Niveau */}
        <div className="w-full space-y-2">
            <Label>{t("prof.common.level")}</Label>
            <Input value={data?.niveaux || t("prof.common.notDefined")} disabled />
        </div>
        <div className="flex items-center justify-between gap-2">
          {data?.niveaux === "1AC" || data?.niveaux==="2AC" || data?.niveaux==="3AC" ? (
              <div>

              </div>
            ):(
              <div className="w-full">
                {/* Filière */}
                <div className="w-full space-y-2">
                <Label>{t("prof.common.stream")}</Label>
                <Select value={filiereValue} onValueChange={setFiliereValue}>
                    <SelectTrigger className="w-full">
                    <SelectValue placeholder={t("prof.modal.chooseStream")} />
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
            <div className="w-full space-y-2">
            <Label>{t("prof.common.subject")}</Label>
            <Select value={matiereValue} onValueChange={setMatiereValue}>
                <SelectTrigger className="w-full">
                <SelectValue placeholder={t("prof.modal.chooseSubject")} className="w-full"/>
                </SelectTrigger>
                <SelectContent>
                {filteredMatieres.map((mat) => (
                    <SelectItem key={mat._id} value={mat._id}>
                    {mat.nom}
                    </SelectItem>
                ))}
                </SelectContent>
            </Select>
            </div>
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
            {t("prof.modal.confirm")}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default MatiereModal;
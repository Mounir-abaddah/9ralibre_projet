import { useParams } from "react-router-dom";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Filter, X } from "lucide-react";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { AsideVideosProps } from "@/pages/auth/Video/types/video.type";

const AsideVideos = ({
  search,
  matiere,
  filiere,
  setSearch,
  setMatiere,
  setFiliere,
}: AsideVideosProps) => {
  const { niveaux } = useParams();
  const [isOpen, setIsOpen] = useState(false);

  const handleMatiereChange = (matiereName: string) => {
    if (matiere === matiereName) {
      setMatiere(null);
    } else {
      setMatiere(matiereName);
    }
  };

  const handleFiliereChange = (filiereNam: string) => {
    if (filiere === filiereNam) {
      setFiliere(null);
    } else {
      setFiliere(filiereNam);
    }
  };

  const resetFilters = () => {
    setSearch(null);
    setMatiere(null);
    setFiliere(null);
  };

  const matieres_college = [
    { name: "Mathématiques", color: "text-red-400" },
    { name: "Physique et Chimie", color: "text-cyan-400" },
    { name: "SVT", color: "text-teal-400" },
    { name: "Informatique", color: "text-sky-400" },
    { name: "Arabe", color: "text-orange-400" },
    { name: "Français", color: "text-orange-400" },
    { name: "Anglais", color: "text-orange-400" },
    { name: "Histoire Géographie", color: "text-amber-400" },
    { name: "Éducation Islamique", color: "text-blue-400" },
  ];

  const matieres_Lycee = [
    { name: "Mathématiques", color: "text-red-400" },
    { name: "Physique et Chimie", color: "text-cyan-400" },
    { name: "SVT", color: "text-teal-400" },
    { name: "Informatique", color: "text-sky-400" },
    { name: "Arabe", color: "text-orange-400" },
    { name: "Français", color: "text-orange-400" },
    { name: "Anglais", color: "text-orange-400" },
    { name: "Histoire Géographie", color: "text-amber-400" },
    { name: "Éducation Islamique", color: "text-blue-400" },
    { name: "Philosophie", color: "text-blue-400" },
    { name: "Sciences de l'ingénieur", color: "text-blue-400" },
    { name: "Économie et Organisation Administrative des Entreprises", color: "text-red-400" },
    { name: "Comptabilité et Mathématiques financières", color: "text-red-400" },
    { name: "Économie générale et Statistiques", color: "text-red-400" },
    { name: "Droit", color: "text-red-400" },
  ];

  const filièreTC = [
    { name: "Sciences" },
    { name: "Technologies" },
    { name: "Lettres et Sciences Humaines" },
  ];

  const filière1BAC = [
    { name: "Sciences Mathématiques" },
    { name: "Sciences Expérimentales" },
    { name: "Sciences et Technologies Électriques" },
    { name: "Sciences et Technologies Mécaniques" },
    { name: "Sciences Économiques et Gestion" },
    { name: "Lettres et Sciences Humaines" },
  ];

  const filière2BAC = [
    { name: "Sciences Mathématiques A" },
    { name: "Sciences Mathématiques B" },
    { name: "Sciences Physiques" },
    { name: "Sciences de la Vie et de la Terre (SVT)" },
    { name: "Sciences Agronomiques" },
    { name: "Sciences et Technologies Électriques" },
    { name: "Sciences et Technologies Mécaniques" },
    { name: "Sciences Économiques" },
    { name: "Sciences de Gestion Comptable (SGC)" },
    { name: "Lettres" },
    { name: "Sciences Humaines" },
  ];

  const activeFiltersCount = [matiere, filiere].filter(Boolean).length;

  // Contenu des filtres
  const FilterContent = () => (
    <div className="space-y-4 p-2">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Matières</h3>
        </div>
        {(niveaux === "1AC" || niveaux === "2AC" || niveaux === "3AC" || niveaux === "TC") ? (
          matieres_college.map((matiereItem, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Checkbox
                id={`matiere-${index}`}
                checked={matiere === matiereItem.name}
                onCheckedChange={() => handleMatiereChange(matiereItem.name)}
              />
              <label
                htmlFor={`matiere-${index}`}
                className={`cursor-pointer text-sm ${matiereItem.color} font-medium`}
              >
                {matiereItem.name}
              </label>
            </div>
        ))
        ):(
          matieres_Lycee.map((matiereItem, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Checkbox
                id={`matiere-${index}`}
                checked={matiere === matiereItem.name}
                onCheckedChange={() => handleMatiereChange(matiereItem.name)}
              />
              <label
                htmlFor={`matiere-${index}`}
                className={`cursor-pointer text-sm ${matiereItem.color} font-medium`}
              >
                {matiereItem.name}
              </label>
            </div>
        ))
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">{(niveaux === "TC" || niveaux === "1BAC" || niveaux === "2BAC") && 'Filière'}</h3>
        </div>
        {niveaux === "TC"
          ? filièreTC.map((filiereItem, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox
                  id={`filiere-${index}`}
                  checked={filiere === filiereItem.name}
                  onCheckedChange={() => handleFiliereChange(filiereItem.name)}
                />
                <Label
                  htmlFor={`filiere-${index}`}
                  className="cursor-pointer text-sm font-medium"
                >
                  {filiereItem.name}
                </Label>
              </div>
            ))
          : niveaux === "1BAC"
            ? filière1BAC.map((filiereItem, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Checkbox
                    id={`filiere-${index}`}
                    checked={filiere === filiereItem.name}
                    onCheckedChange={() =>
                      handleFiliereChange(filiereItem.name)
                    }
                  />
                  <Label
                    htmlFor={`filiere-${index}`}
                    className="cursor-pointer text-sm font-medium"
                  >
                    {filiereItem.name}
                  </Label>
                </div>
              ))
            : niveaux === "2BAC" && filière2BAC.map((filiereItem, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Checkbox
                    id={`filiere-${index}`}
                    checked={filiere === filiereItem.name}
                    onCheckedChange={() =>
                      handleFiliereChange(filiereItem.name)
                    }
                  />
                  <Label
                    htmlFor={`filiere-${index}`}
                    className="cursor-pointer text-sm font-medium"
                  >
                    {filiereItem.name}
                  </Label>
                </div>
              ))}
      </div>

      {activeFiltersCount > 0 && (
        <Button
          variant="outline"
          onClick={resetFilters}
          className="w-full"
        >
          <X size={16} className="mr-2" />
          Réinitialiser les filtres
        </Button>
      )}
    </div>
  );

  return (
    <div className="flex flex-col gap-2">
    <div>
        <Input
          type="text"
          placeholder="Cherchez votre titre de vidéos, filière ou matière"
          value={search || ""}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      {/* Bouton filtre pour mobile */}
      <div className="lg:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full">
              <Filter size={18} className="mr-2" />
              Filtres
              {activeFiltersCount > 0 && (
                <span className="ml-2 rounded-full bg-amber-400 px-2 py-0.5 text-xs font-semibold text-black">
                  {activeFiltersCount}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Filtres</SheetTitle>
            </SheetHeader>
            <div className="">
              <FilterContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Aside pour desktop */}
      <div className="hidden w-full lg:block">
        <FilterContent />
      </div>
    </div>
  );
};

export default AsideVideos;
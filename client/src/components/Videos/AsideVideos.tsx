import { useParams } from "react-router-dom";
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
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

const AsideVideos = ({
  search,
  matiere,
  filiere,
  setSearch,
  setMatiere,
  setFiliere,
  Fetchmatiere,
}: AsideVideosProps) => {
  const { niveaux } = useParams();
  const [isOpen, setIsOpen] = useState(false);

  const resetFilters = () => {
    setSearch(null);
    setMatiere(null);
    setFiliere(null);
  };

  const bgItems = {
    "Mathématiques":"text-red-400",
    "Physique et Chimie":"text-cyan-400",
    "SVT":"text-teal-400",
    "Informatique":"text-sky-400",
    "Arabe":"text-orange-400",
    "Français":"text-orange-400",
    "Anglais":"text-orange-400",
    "Histoire Géographie":"text-amber-400",
    "Education Islamique":"text-blue-400",
    "Sciences de la Vie et de la Terre (SVT)":"text-teal-500",
    "Philosophie":"text-red-500",
    "Sciences Végétales et Animales (SVA)":"text-green-500",
    "Sciences de l'ingénieur":"text-violet-500",
    "Économie et Organisation Administrative des Entreprises":"text-blue-500",
    "Comptabilité et Mathématiques financières":"text-zinc-500",
    "Économie générale et Statistiques":"text-cyan-500",
    "Droit":"text-orange-500",
    "Informatique de gestion":"text-indigo-500"
  }
  
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

  const FilterContent = () => (
    <div className="max-h-[90vh] space-y-4 overflow-y-auto p-2">
      {/* RESET */}
      {activeFiltersCount > 0 && (
        <Button variant="outline" onClick={resetFilters} className="w-full">
          <X size={16} className="mr-2" />
          Réinitialiser
        </Button>
      )}
      {/* MATIERE */}
      <div className="space-y-3 rounded-md bg-gray-800 p-2">
        <h3 className="text-sm font-semibold text-white">Matières</h3>

        <RadioGroup
          value={matiere || ""}
          onValueChange={(value) => setMatiere(value)}
          className="space-y-2"
        >
          {Fetchmatiere.map((mat)=>(
            <div key={mat._id} className="flex items-center space-x-2">
              <RadioGroupItem value={mat.nom} id={`matiere-${mat._id}`} />
              <Label  htmlFor={`matiere-${mat._id}`} className={`cursor-pointer ${mat._id} ${bgItems[mat.nom as keyof typeof bgItems]}`}>
                {mat.nom}
              </Label>
          </div>
          ))}
          
        </RadioGroup>
      </div>

      {/* FILIERE */}
      {(niveaux === "TC" || niveaux === "1BAC" || niveaux === "2BAC") && (
        <div className="space-y-3 rounded-md bg-gray-800 p-2">
          <h3 className="text-sm font-semibold text-white">Filière</h3>

          <RadioGroup
            value={filiere || ""}
            onValueChange={(value) => setFiliere(value)}
            className="space-y-2"
          >
            {(niveaux === "TC"
              ? filièreTC
              : niveaux === "1BAC"
              ? filière1BAC
              : filière2BAC
            ).map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={item.name} id={`filiere-${index}`} />
                <Label htmlFor={`filiere-${index}`} className="text-white">
                  {item.name}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col gap-2">
      {/* SEARCH */}
      <Input
        type="text"
        placeholder="Cherchez..."
        value={search || ""}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* MOBILE */}
      <div className="lg:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full">
              <Filter size={18} className="mr-2" />
              Filtres
              {activeFiltersCount > 0 && (
                <span className="ml-2 rounded-full bg-amber-400 px-2 text-xs">
                  {activeFiltersCount}
                </span>
              )}
            </Button>
          </SheetTrigger>

          <SheetContent side="left" className="absolute z-[9999999999] w-80 overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Filtres</SheetTitle>
            </SheetHeader>
            <FilterContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* DESKTOP */}
      <div className="hidden lg:block">
        <FilterContent />
      </div>
    </div>
  );
};

export default AsideVideos;
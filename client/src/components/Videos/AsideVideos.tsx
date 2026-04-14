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
}: AsideVideosProps) => {
  const { niveaux } = useParams();
  const [isOpen, setIsOpen] = useState(false);

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
    { name: "SVT" },
    { name: "Sciences Économiques" },
    { name: "Lettres" },
  ];

  const activeFiltersCount = [matiere, filiere].filter(Boolean).length;

  const FilterContent = () => (
    <div className="space-y-4 p-2">

      {/* MATIERE */}
      <div className="space-y-3 rounded-md bg-gray-800 p-2">
        <h3 className="text-sm font-semibold text-white">Matières</h3>

        <RadioGroup
          value={matiere || ""}
          onValueChange={(value) => setMatiere(value)}
          className="space-y-2"
        >
          {(niveaux === "1AC" || niveaux === "2AC" || niveaux === "3AC" || niveaux === "TC"
            ? matieres_college
            : matieres_Lycee
          ).map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <RadioGroupItem value={item.name} id={`matiere-${index}`} />
              <Label
                htmlFor={`matiere-${index}`}
                className={`cursor-pointer ${item.color}`}
              >
                {item.name}
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

      {/* RESET */}
      {activeFiltersCount > 0 && (
        <Button variant="outline" onClick={resetFilters} className="w-full">
          <X size={16} className="mr-2" />
          Réinitialiser
        </Button>
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
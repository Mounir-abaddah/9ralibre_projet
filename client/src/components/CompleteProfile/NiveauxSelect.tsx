import { useEffect, useRef, useState } from "react";
import { Label } from "../ui/label";
import { ChevronDown } from "lucide-react";

interface Props {
  value: string;
  error?: string;
  onChange: (val: string) => void;
}

const NiveauxSelect = ({ value, error, onChange }: Props) => {
  type Category = "College" | "Lycee";
  const [selectedCategory, setSelectedCategory] = useState<Category | "">("");
  const [showCategory, setShowCategory] = useState(false);
  const [showLevel, setShowLevel] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setShowCategory(false);
        setShowLevel(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const niveaux: Record<Category, string[]> = {
    College: ["1AC", "2AC", "3AC"],
    Lycee: ["TC", "1BAC", "2BAC"],
  };

  const categories: Category[] = ["College", "Lycee"];

  return (
    <div ref={ref} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <Label>Votre niveau d’étude</Label>
        <div
          onClick={() => setShowCategory(!showCategory)}
          className={`relative w-full border rounded-md p-3 flex items-center justify-between cursor-pointer transition ${
            error ? "border-red-400 bg-red-100" : "border-gray-300"
          }`}
        >
          <span className={`text-sm ${!selectedCategory && "text-slate-400"}`}>
            {selectedCategory || "Sélectionnez votre catégorie"}
          </span>
          <ChevronDown
            size={16}
            className={`transition-transform ${
              showCategory ? "rotate-180" : "rotate-0"
            }`}
          />
        </div>

        {showCategory && (
          <div className="border border-gray-200 rounded-md mt-1 shadow-sm bg-white relative z-50">
            {categories.map((cat) => (
              <div
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setShowCategory(false);
                  setShowLevel(false);
                  onChange("");
                }}
                className="p-2 px-3 hover:bg-amber-100 cursor-pointer text-sm"
              >
                {cat}
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedCategory && (
        <div className="flex flex-col gap-1">
          <Label>Niveau spécifique</Label>
          <div
            onClick={() => setShowLevel(!showLevel)}
            className={`relative w-full border rounded-md p-3 flex items-center justify-between cursor-pointer transition ${
              error ? "border-red-400 bg-red-100" : "border-gray-300"
            }`}
          >
            <span className={`text-sm ${!value && "text-slate-400"}`}>
              {value || "Sélectionnez votre niveau"}
            </span>
            <ChevronDown
              size={16}
              className={`transition-transform ${
                showLevel ? "rotate-180" : "rotate-0"
              }`}
            />
          </div>

          {showLevel && (
            <div className="border border-gray-200 rounded-md mt-1 shadow-sm bg-white relative z-50">
              {niveaux[selectedCategory].map((niv) => (
                <div
                  key={niv}
                  onClick={() => {
                    onChange(niv);
                    setShowLevel(false);
                  }}
                  className="p-2 px-3 hover:bg-amber-100 cursor-pointer text-sm"
                >
                  {niv}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {error && !showCategory && !showLevel && (
        <p className="text-sm text-red-400 font-semibold">{error}</p>
      )}
    </div>
  );
};

export default NiveauxSelect;

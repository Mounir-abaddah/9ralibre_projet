import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Label } from "../ui/label";
import { ChevronDown } from "lucide-react";

interface Props {
  value: string;
  error?: string;
  onChange: (val: string) => void;
}

const NiveauxSelect = ({ value, error, onChange }: Props) => {
  const { t } = useTranslation();
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
        <Label>{t("completeProfile.form.studyLevel")}</Label>
        <div
          onClick={() => setShowCategory(!showCategory)}
          className={`relative flex w-full cursor-pointer items-center justify-between rounded-md border p-3 transition ${
            error ? "border-red-400 bg-red-100" : "border-gray-300"
          }`}
        >
          <span className={`text-sm ${!selectedCategory && "text-slate-400"}`}>
            {selectedCategory ? t(`completeProfile.categories.${selectedCategory.toLowerCase()}`) : t("completeProfile.form.selectCategory")}
          </span>
          <ChevronDown
            size={16}
            className={`transition-transform ${
              showCategory ? "rotate-180" : "rotate-0"
            }`}
          />
        </div>

        {showCategory && (
          <div className="relative z-50 mt-1 rounded-md border border-gray-200 bg-white shadow-sm">
            {categories.map((cat) => (
              <div
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setShowCategory(false);
                  setShowLevel(false);
                  onChange("");
                }}
                className="cursor-pointer rounded-md p-2 px-3 text-sm hover:bg-amber-100 dark:text-black"
              >
                {t(`completeProfile.categories.${cat.toLowerCase()}`)}
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedCategory && (
        <div className="flex flex-col gap-1">
          <Label>{t("completeProfile.form.specificLevel")}</Label>
          <div
            onClick={() => setShowLevel(!showLevel)}
            className={`relative flex w-full cursor-pointer items-center justify-between rounded-md border p-3 transition ${
              error ? "border-red-400 bg-red-100" : "border-gray-300"
            }`}
          >
            <span className={`text-sm ${!value && "text-slate-400"}`}>
              {value || t("completeProfile.form.selectLevel")}
            </span>
            <ChevronDown
              size={16}
              className={`transition-transform ${
                showLevel ? "rotate-180" : "rotate-0"
              }`}
            />
          </div>

          {showLevel && (
            <div className="relative z-50 mt-1 rounded-md border border-gray-200 bg-white shadow-sm">
              {niveaux[selectedCategory].map((niv) => (
                <div
                  key={niv}
                  onClick={() => {
                    onChange(niv);
                    setShowLevel(false);
                  }}
                  className="cursor-pointer rounded-md p-2 px-3 text-sm hover:bg-amber-100 dark:text-black"
                >
                  {niv}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {error && !showCategory && !showLevel && (
        <p className="text-sm font-semibold text-red-400">{error}</p>
      )}
    </div>
  );
};

export default NiveauxSelect;

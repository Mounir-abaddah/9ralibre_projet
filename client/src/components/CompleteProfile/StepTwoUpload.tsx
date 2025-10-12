import { useRef } from "react";
import { Label } from "@/components/ui/label";
import { UploadCloud, CircleX } from "lucide-react";

interface Props {
  avatar: File | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove?: () => void;
}

const StepTwoUpload = ({ avatar, onChange, onRemove }: Props) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (onRemove) {
      onRemove();
    }
  };

  return (
    <div className="space-y-5 p-6 bg-white shadow-lg rounded-2xl border border-gray-200 hover:shadow-xl transition-all duration-300">
      <div className="flex items-start gap-3 bg-gradient-to-r from-amber-50 to-amber-100 border-l-4 border-amber-400 text-amber-800 px-4 py-3 rounded-lg shadow-sm">
        <span className="text-2xl leading-none">⚠️</span>
        <div>
          <p className="font-semibold">Avertissement</p>
          <p className="text-sm">
            Les photos contenant de la nudité ou un contenu inapproprié peuvent
            entraîner un <span className="font-semibold">bannissement immédiat</span>.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <Label htmlFor="picture" className="text-sm font-medium text-gray-700">
          Importez votre photo *<sup>(optionnel)</sup>
        </Label>

        <div
          onClick={!avatar ? handleClick : undefined}
          className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-2xl border-gray-300 hover:border-blue-500 transition cursor-pointer bg-gray-50 hover:bg-blue-50/40 relative"
        >
          {!avatar ? (
            <>
              <UploadCloud className="w-10 h-10 text-gray-400 mb-2" />
              <p className="text-gray-500 text-sm mb-2">
                Cliquez ou déposez une image ici
              </p>
              <input
                ref={fileInputRef}
                id="picture"
                type="file"
                accept="image/*"
                onChange={onChange}
                className="hidden"
              />
            </>
          ) : (
            <div className="relative w-40 h-40 rounded-xl overflow-hidden shadow-md">
              <img
                src={URL.createObjectURL(avatar)}
                alt="Preview"
                className="object-cover w-full h-full"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove();
                }}
                className="absolute top-2 right-2 flex items-center gap-1 bg-red-600/80 text-white text-xs px-2 py-1 rounded-md hover:bg-red-700 transition"
              >
                <CircleX size={18} /> Supprimer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StepTwoUpload;

import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Label } from "@/components/ui/label";
import { UploadCloud, CircleX } from "lucide-react";

interface Props {
  avatar: File | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove?: () => void;
}

const StepTwoUpload = ({ avatar, onChange, onRemove }: Props) => {
  const { t } = useTranslation();
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
    <div className="space-y-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl">
      <div className="flex items-start gap-3 rounded-lg border-l-4 border-amber-400 bg-gradient-to-r from-amber-50 to-amber-100 px-4 py-3 text-amber-800 shadow-sm">
        <span className="text-2xl leading-none">⚠️</span>
        <div>
          <p className="font-semibold">{t("completeProfile.upload.warningTitle")}</p>
          <p className="text-sm">
            {t("completeProfile.upload.warningText")} <span className="font-semibold">{t("completeProfile.upload.warningStrong")}</span>.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <Label htmlFor="picture" className="text-sm font-medium text-gray-700">
          {t("completeProfile.upload.title")} <sup>{t("completeProfile.upload.optional")}</sup>
        </Label>

        <div
          onClick={!avatar ? handleClick : undefined}
          className="relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-6 transition hover:border-blue-500 hover:bg-blue-50/40"
        >
          {!avatar ? (
            <>
              <UploadCloud className="mb-2 h-10 w-10 text-gray-400" />
              <p className="mb-2 text-sm text-gray-500">
                {t("completeProfile.upload.action")}
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
            <div className="relative h-40 w-40 overflow-hidden rounded-xl shadow-md">
              <img
                src={URL.createObjectURL(avatar)}
                alt={t("completeProfile.upload.previewAlt")}
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove();
                }}
                className="absolute top-2 right-2 flex items-center gap-1 rounded-md bg-red-600/80 px-2 py-1 text-xs text-white transition hover:bg-red-700"
              >
                <CircleX size={18} /> {t("completeProfile.upload.remove")}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StepTwoUpload;

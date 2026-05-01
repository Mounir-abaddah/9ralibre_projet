import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Lightbulb, Timer, BookOpen, ListChecks } from "lucide-react";
import { useTranslation } from "react-i18next";

const CardAside = () => {
  const { t } = useTranslation();

  return (
    <div className="w-full space-y-6 lg:min-h-screen">

      {/* -------------------- 1️⃣ Carte Conseils d’étude -------------------- */}
      <Card className="top-8 -z-20 shadow-md lg:sticky">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <Lightbulb className="text-amber-500" size={20} />
            {t("coursesAside.title")}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-3 text-sm text-gray-700">
          <div className="flex items-start gap-2">
            <Timer className="mt-1 text-blue-500" size={16} />
            <p>{t("coursesAside.tip1")} <strong>25 min</strong>, {t("coursesAside.tip1Part2")} <strong>5 min</strong>.</p>
          </div>

          <div className="flex items-start gap-2">
            <BookOpen className="mt-1 text-green-500" size={16} />
            <p>{t("coursesAside.tip2")}</p>
          </div>

          <div className="flex items-start gap-2">
            <ListChecks className="mt-1 text-purple-500" size={16} />
            <p>{t("coursesAside.tip3")}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CardAside;

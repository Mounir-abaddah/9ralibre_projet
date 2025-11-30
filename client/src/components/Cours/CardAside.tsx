import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Lightbulb, Timer, BookOpen, ListChecks, Flame, FileText } from "lucide-react";
import { Link } from "react-router-dom";

const CardAside = () => {

  // ➤ Tu peux remplacer ces données par un fetch venant du backend
  const popularCours = [
    {
      title: "Examen National Maths 2023",
      url: "/cours/examen-national-maths-2023",
    },
    {
      title: "Cours Physique : Mouvement & Forces",
      url: "/cours/physique-mouvement-forces",
    },
    {
      title: "SVT — Génétique Thème 2",
      url: "/cours/svt-genetique-theme2",
    },
  ];

  return (
    <div className="w-full space-y-6 lg:min-h-screen">

      {/* -------------------- 1️⃣ Carte Conseils d’étude -------------------- */}
      <Card className="top-8 -z-20 shadow-md lg:sticky">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <Lightbulb className="text-amber-500" size={20} />
            Conseils d’étude
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-3 text-sm text-gray-700">
          <div className="flex items-start gap-2">
            <Timer className="mt-1 text-blue-500" size={16} />
            <p>📌 Révise <strong>25 min</strong>, puis fais une pause de <strong>5 min</strong>.</p>
          </div>

          <div className="flex items-start gap-2">
            <BookOpen className="mt-1 text-green-500" size={16} />
            <p>📚 Résume le cours avant de commencer les exercices.</p>
          </div>

          <div className="flex items-start gap-2">
            <ListChecks className="mt-1 text-purple-500" size={16} />
            <p>⏳ Commence par les matières où tu es le plus à l’aise.</p>
          </div>
        </CardContent>
      </Card>


      {/* ------------------ 2️⃣ Carte Cours les plus consultés ------------------- */}
      <Card className="top-80 -z-20 shadow-md lg:sticky">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <Flame className="text-red-500" size={20} />
            Cours les plus consultés
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          {popularCours.map((cours, index) => (
            <Link 
              key={index} 
              to={cours.url}
              className="flex items-center gap-2 rounded-md p-2 text-sm transition-all hover:bg-slate-100"
            >
              <FileText size={16} className="text-amber-600" />
              <span className="text-gray-700">{cours.title}</span>
            </Link>
          ))}
        </CardContent>
      </Card>

    </div>
  );
};

export default CardAside;

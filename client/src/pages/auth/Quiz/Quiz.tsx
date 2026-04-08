import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import type { Quiz } from "./types/QuizType";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Atom,
  Calculator,
  Check,
  FlaskConical,
  Globe,
  Languages,
  Play,
  Shapes,
} from "lucide-react";
import Pagination from "@/components/Pagination/Pagination";
import No_Data_img from '@/assets/images/cours/No data-cuate.png'

type MatiereVisual = {
  label: string;
  bgClass: string;
  icon?: React.ComponentType<{ className?: string }>;
};

const getMatiereVisual = (matiereNom?: string | null): MatiereVisual => {
  const name = (matiereNom || "").toLowerCase();

  if (name.includes("math")) {
    return { label: "Math", bgClass: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300", icon: Calculator };
  }
  if (name.includes("phys")) {
    return { label: "Physique", bgClass: "bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300", icon: Atom };
  }
  if (name.includes("chim")) {
    return { label: "Chimie", bgClass: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300", icon: FlaskConical };
  }
  if (name.includes("svt") || name.includes("bio")) {
    return { label: "SVT", bgClass: "bg-teal-100 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300", icon: Shapes };
  }
  if (name.includes("histoire") || name.includes("géographie") || name.includes("geographie")) {
    return { label: "H-G", bgClass: "bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300", icon: Globe };
  }
  if (name.includes("fran") || name.includes("ang") || name.includes("arab") || name.includes("lang")) {
    return { label: "Langues", bgClass: "bg-zinc-100 text-zinc-700 dark:bg-zinc-900 dark:text-zinc-200", icon: Languages };
  }
  if (name) {
    const initials = name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]!.toUpperCase())
      .join("");
    return { label: initials || "M", bgClass: "bg-zinc-100 text-zinc-700 dark:bg-zinc-900 dark:text-zinc-200" };
  }
  return { label: "M", bgClass: "bg-zinc-100 text-zinc-700 dark:bg-zinc-900 dark:text-zinc-200" };
};

const QuizPage = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    document.title = "Quiz | 9ralibre";
    const { niveaux } = useParams();
    const navigate = useNavigate();
    const [quizList, setQuizList] = useState<Quiz[]>([]);
    const [totalQuiz, setTotalQuiz] = useState(0);
    const itemsPerPage = 10;

    const [searchParams, setSearchParams] = useSearchParams();
    const currentPage = parseInt(searchParams.get("page") || "1");

    const handlePageChange = (page: number) => {
        setSearchParams({ page: page.toString() });
    };

    useEffect(() => {
        const getQuiz = async () => {
            const res = await axios.get(
                `${apiUrl}/quiz/get-quiz/${niveaux}?page=${currentPage}&limit=${itemsPerPage}`,
                { withCredentials: true }
            );
            setQuizList(res.data.finalQuiz);
            setTotalQuiz(res.data.totalQuiz);
        };
        getQuiz();
    }, [apiUrl, niveaux, currentPage]);


    return (
    <>
    {quizList.length > 0 ? (
        <>
        <div className="mb-8 flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 md:text-3xl">
            Quiz
            {niveaux ? (
              <span className="ml-2 text-base font-semibold text-zinc-500 dark:text-zinc-400">
                · {niveaux}
              </span>
            ) : null}
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Choisissez un quiz et démarrez en quelques minutes.
          </p>
        </div>

        <div className="space-y-4">
          <Pagination
            itemsPerPage={itemsPerPage}
            totalItems={totalQuiz}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {quizList.map((quiz) => {
              const visual = getMatiereVisual(quiz.matiere?.nom);
              const MatiereIcon = visual.icon;

              return (
                <div
                  key={quiz._id}
                  className="group rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-start gap-3">
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-zinc-200 ${visual.bgClass} dark:border-zinc-700`}
                        aria-label={`Matière: ${quiz.matiere?.nom || "Inconnue"}`}
                        title={quiz.matiere?.nom || ""}
                      >
                        {MatiereIcon ? (
                          <MatiereIcon className="h-5 w-5" />
                        ) : (
                          <span className="text-sm font-bold">{visual.label}</span>
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="secondary" className="text-[11px]">
                            {quiz.filiere}
                          </Badge>
                          {quiz.matiere?.nom ? (
                            <Badge
                              variant="outline"
                              className="border-zinc-200 text-[11px] text-zinc-700 dark:border-zinc-700 dark:text-zinc-200"
                            >
                              {quiz.matiere.nom}
                            </Badge>
                          ) : null}
                        </div>
                        <h3 className="mt-2 line-clamp-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                          {quiz.text}
                        </h3>
                      </div>
                    </div>

                    {quiz.alreadyPassed ? (
                      <Badge className="shrink-0 bg-emerald-500/15 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                        <Check className="mr-1 h-3.5 w-3.5" />
                        Fait
                      </Badge>
                    ) : (
                      <Badge className="shrink-0 bg-amber-500/15 text-amber-800 dark:bg-amber-500/10 dark:text-amber-300">
                        <Play className="mr-1 h-3.5 w-3.5" />
                        Nouveau
                      </Badge>
                    )}
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-3 border-t border-zinc-100 pt-4 dark:border-zinc-800">
                    <div className="flex min-w-0 items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={quiz.professeur.image}
                          alt={quiz.professeur.nom}
                        />
                        <AvatarFallback className="bg-zinc-100 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-200">
                          {quiz.professeur.nom?.[0]}
                          {quiz.professeur.prenom?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 leading-tight">
                        <Link
                          to={`/Profile/${quiz.professeur.nom}-${quiz.professeur.prenom}`}
                          className="block truncate text-xs font-semibold text-zinc-800 hover:underline dark:text-zinc-200"
                        >
                          {quiz.professeur.nom} {quiz.professeur.prenom}
                        </Link>
                        <span className="block text-[11px] text-zinc-500 dark:text-zinc-400">
                          {quiz.questions?.length ?? 0} question(s)
                        </span>
                      </div>
                    </div>

                    {quiz.alreadyPassed ? (
                      <Button
                        onClick={() => navigate(`/Quiz/resultat/${quiz._id}`)}
                        size="sm"
                        className="shrink-0 cursor-pointer bg-zinc-900 text-xs font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
                      >
                        Voir résultat
                      </Button>
                    ) : (
                      <Button
                        onClick={() => navigate(`/Quiz/start/${niveaux}/${quiz._id}`)}
                        size="sm"
                        className="shrink-0 cursor-pointer bg-amber-500 text-xs font-semibold text-zinc-950 hover:bg-amber-600"
                      >
                        Commencer
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <Pagination
            itemsPerPage={itemsPerPage}
            totalItems={totalQuiz}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
    </>
    ):(
        <div className="col-span-full mt-6 flex w-full flex-col items-center justify-center gap-2 text-center">
            <img src={No_Data_img} alt="no data" loading='lazy'  width={300} height={400}/>
            <p className="text-sm text-gray-500">
                Aucun quiz trouvé avec ces filtres.
            </p>
        </div>
    )}
    
        
    </>
    );
};

export default QuizPage;
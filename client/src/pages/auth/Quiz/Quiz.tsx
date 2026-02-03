import { useEffect, useState } from "react";
import type { QuizResult, Quiz as QuizType } from "./types/QuizTypes";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BookText, ChevronRight, Repeat, Clock, ListChecks } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

const Quiz = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { niveaux } = useParams();
  const navigate = useNavigate();
  document.title = "Quiz | 9ralibre";

  const [quiz, setQuiz] = useState<QuizType[]>([]);
  const [results, setResults] = useState<QuizResult[]>([]);

  useEffect(() => {
    const getQuiz = async () => {
      try {
        const res = await axios.get(`${apiUrl}/quiz/get-user-by-name/${niveaux}`, { withCredentials: true });
        setQuiz(res.data.quiz);
      } catch (err) {
        console.error(err);
      }
    };
    getQuiz();
  }, [apiUrl, niveaux]);

  useEffect(() => {
    const getResults = async () => {
      try {
        const res = await axios.get(`${apiUrl}/quiz/results/user`, { withCredentials: true });
        setResults(res.data.results);
      } catch (err) {
        console.log(err);
      }
    };
    getResults();
  }, [apiUrl]);

  const bgItems = {
    "Mathématiques": "bg-red-400",
    "Physique et Chimie": "bg-cyan-400",
    "SVT": "bg-teal-400",
    "Informatique": "bg-sky-400",
    "Arabe": "bg-orange-400",
    "Français": "bg-orange-400",
    "Anglais": "bg-orange-400",
    "Histoire Géographie": "bg-amber-400",
    "Éducation Islamique": "bg-blue-400",
  };

  return (
    <div className="min-h-screen  p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {quiz.map((q) => {
            const resultsForQuiz = results.find((r) => r.quiz === q._id);

            return (
              <div
                key={q._id}
                className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:border-cyan-300 hover:shadow-lg"
              >
                {/* Header avec matière */}
                <div className="flex items-start justify-between border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white p-5">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-cyan-50 p-2.5">
                      <BookText className="text-cyan-600" size={24} />
                    </div>
                    <span
                      className={`rounded-full ${
                        bgItems[q.matiere.nom as keyof typeof bgItems]
                      } px-3.5 py-1.5 text-sm font-semibold text-white shadow-sm`}
                    >
                      {q.matiere.nom}
                    </span>
                  </div>
                </div>

                {/* Contenu principal */}
                <div className="flex flex-1 flex-col p-5">
                  {/* Titre du quiz */}
                  <h3 className="mb-4 line-clamp-2 text-xl leading-tight font-bold text-gray-800">
                    {q.title}
                  </h3>

                  {/* Professeur */}
                  <div className="mb-5 flex items-center gap-3">
                    <Avatar className="h-11 w-11 ring-2 ring-gray-100">
                      <AvatarImage
                        src={q.professeur.image}
                        alt={`${q.professeur.nom} ${q.professeur.prenom}`}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-amber-400 to-amber-500 text-sm font-semibold text-white">
                        {q.professeur.nom[0]}
                        {q.professeur.prenom[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 overflow-hidden">
                      <Link
                        to={`/professeur/${q.professeur.nom} ${q.professeur.prenom}`}
                        className="block truncate text-base font-semibold text-cyan-600 transition-colors hover:text-cyan-700"
                      >
                        {q.professeur.nom} {q.professeur.prenom}
                      </Link>
                      <p className="text-sm text-gray-500">{q.professeur.role}</p>
                    </div>
                  </div>

                  {/* Informations du quiz */}
                  <div className="mb-5 space-y-2.5 rounded-lg bg-gray-50 p-3.5">
                    <div className="flex items-center gap-2 text-gray-700">
                      <ListChecks size={18} className="text-cyan-500" />
                      <span className="text-sm font-medium">
                        {q.questions.length} questions
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Clock size={18} className="text-cyan-500" />
                      <span className="text-sm">
                        Niveau: <span className="font-medium">{q.niveaux.nom}</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                      <span className="text-xs">
                        Créé{" "}
                        {formatDistanceToNow(new Date(q.createdAt), {
                          addSuffix: true,
                          locale: fr,
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Badge si déjà passé */}
                  {resultsForQuiz && (
                    <div className="mb-3 rounded-lg border border-green-200 bg-green-50 p-3">
                      <p className="text-sm font-medium text-green-700">
                        ✓ Quiz complété
                      </p>
                      <p className="text-xs text-green-600">
                        Passé{" "}
                        {formatDistanceToNow(new Date(resultsForQuiz.passedAt), {
                          addSuffix: true,
                          locale: fr,
                        })}
                      </p>
                    </div>
                  )}

                  {/* Bouton d'action */}
                  <Button
                    onClick={() => navigate(`/quiz/${niveaux}/${q._id}`)}
                    className="mt-auto h-11 w-full cursor-pointer rounded-lg bg-cyan-600 text-base font-semibold text-white shadow-md transition-all hover:bg-cyan-700 hover:shadow-lg"
                  >
                    {resultsForQuiz ? (
                      <span className="flex items-center justify-center gap-2">
                        <Repeat size={20} />
                        Recommencer
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        Commencer
                        <ChevronRight size={20} />
                      </span>
                    )}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Results } from "./types/ResultsType";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BicepsFlexed, Medal, PartyPopper, ThumbsUp, Trophy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "react-i18next";


const ScoreCircle = ({ score, total }: { score: number; total: number }) => {
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative mx-auto h-36 w-36">
      <svg width="144" height="144" className="-rotate-90">
        <circle cx="72" cy="72" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="10" />
        <circle
          cx="72" cy="72" r={radius}
          fill="none"
          stroke="#22c55e"
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold ">{score}/{total}</span>
        <span className="text-sm text-gray-400">{percentage}%</span>
      </div>
    </div>
  );
};

const getPerformanceLabel = (score: number, total: number, t: (key: string) => string) => {
  const pct = total > 0 ? (score / total) * 100 : 0;
  if (pct === 100) return <div className="flex items-center justify-center gap-2"> {t("quiz.results.perfect")} <Trophy /></div>;
  if (pct >= 70) return <div className="flex items-center justify-center gap-2">{t("quiz.results.excellent")} <PartyPopper /></div>;
  if (pct >= 50) return <div className="flex items-center justify-center gap-2">{t("quiz.results.good")} <ThumbsUp /></div>;
  return <div className="flex items-center justify-center gap-2">{t("quiz.results.canImprove")} <BicepsFlexed /></div>;
};

const Resultat = () => {
  const { t } = useTranslation();
  const apiUrl = import.meta.env.VITE_API_URL;
  const { quizId } = useParams();
  const [results, setResults] = useState<Results | null>(null);
  const [leaderboard, setLeaderboard] = useState<Results[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getResults = async () => {
      try {
        const res = await axios.get(`${apiUrl}/quiz/results/${quizId}`, {
          withCredentials: true,
        });
        const data = Array.isArray(res.data) ? res.data[0] : res.data;
        setResults(data);
      } catch {
        setError(t("quiz.results.loadError"));
      } finally {
        setLoading(false);
      }
    };
    getResults();
  }, [apiUrl, quizId]);

  useEffect(() => {
    const getLeaderBoard = async () => {
      try {
        const res = await axios.get(`${apiUrl}/quiz/leaderboard/${quizId}`, {
          withCredentials: true,
        });

        setLeaderboard(res.data);
      } catch (e) {
        console.log(e);
      }
    };
    getLeaderBoard();
  }, [apiUrl, quizId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f0e8]">
        <p className="text-lg text-gray-400">{t("common.loading")}</p>
      </div>
    );
  }

  if (error || !results) {
    return (
      <div className="flex  items-center justify-center">
        <p className="text-lg text-red-500">{error || t("quiz.results.noneFound")}</p>
      </div>
    );
  }

  const wrongCount = results.wrongAnswers.length;
  const correctAnswers = results.totalQuestions - wrongCount;


  return (
    <div className="min-h-screen px-4 py-8">
      <div className="flex flex-col-reverse gap-4 space-x-4 md:flex-row lg:flex-row">
        <div className="mx-auto flex w-full flex-col gap-4">
          {/* Carte score */}
          <Card className="rounded-2xl  p-8 text-center shadow-sm">
            <ScoreCircle score={results.score} total={results.totalQuestions} />
            <p className="mt-5 text-xl font-bold ">
              {getPerformanceLabel(results.score, results.totalQuestions, t)}
            </p>
            <p className="mt-1 text-sm text-gray-400">{results.quizId.text}</p>
          </Card>
          {/* Récapitulatif */}
          <h2 className="mt-2 text-base font-bold text-gray-900 dark:text-white">
            {t("quiz.results.answersSummary")}
          </h2>
          <div className="flex flex-col gap-3">
            {Array.from({ length: correctAnswers }).map((_, i) => (
              <Card
                key={`correct-${i}`}
                className="rounded-xl border-l-4 border-green-500  p-4 shadow-sm"
              >
                <CardContent>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-green-500">✔</span>
                  <span className="font-semibold ">{t("quiz.results.correctAnswer")}</span>
                </div>
                <div className="mt-2">
                  <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                    {t("quiz.results.correct")}
                  </span>
                </div>
                </CardContent>
              </Card>
            ))}
            {results.wrongAnswers.map((wa) => (
              <Card
                key={wa._id}
                className="rounded-xl border-l-4 border-red-400 p-4 shadow-sm"
              >
                <CardContent>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-red-400">✗</span>
                  <span className="font-semibold ">{wa.question}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                    {t("quiz.results.yourAnswer")}: {wa.userAnswer}
                  </span>
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                    {t("quiz.results.correctAnswerLabel")}: {wa.correctAnswer}
                  </span>
                </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        {/* Leaderboard */}
        <div className="w-full lg:mt-8">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold"><Trophy fill="#FFC107" color="#FFC107"/> {t("quiz.results.leaderboard")}</h2>

          <div className="flex flex-col gap-3">
            {leaderboard
              .sort((a, b) => b.score - a.score)
              .map((player, index) => {
                const percentage = Math.round((player.score / player.totalQuestions) * 100);

                const medal =
                  index === 0 ? <Medal /> :
                  index === 1 ? "🥈" :
                  index === 2 ? "🥉" : null;

                return (
                  <Card
                    key={player._id}
                    className="flex items-center justify-between rounded-xl p-4 shadow-sm transition hover:shadow-md"
                  >
                    <CardContent>
                    {/* LEFT */}
                    <div className="flex items-center gap-3">
                      <span className="w-6 text-lg font-bold ">
                        {medal ?? `#${index + 1}`}
                      </span>

                      <Avatar>
                        <AvatarImage src={player.userId.image} alt={player.userId.nom}/>
                        <AvatarFallback className={`${
                          player?.userId.role === "Etudiant" ? "bg-sky-500 text-white" :
                          player?.userId.role === "Etudiante" ? "bg-pink-500 text-white" :
                          "bg-gray-200 text-gray-700"
                        }`}>
                          {player.userId.nom[0]}
                          {player.userId.prenom[0]}
                        </AvatarFallback>
                      </Avatar>

                      <span className="font-semibold">
                        {player.userId.nom} {player.userId.prenom}
                      </span>
                    </div>
                    </CardContent>
                    <CardContent>
                    {/* RIGHT */}
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-400">
                        {player.score}/{player.totalQuestions}
                      </span>

                      <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-bold text-green-700">
                        {percentage}%
                      </span>
                    </div>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resultat;
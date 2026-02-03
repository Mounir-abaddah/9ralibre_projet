import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Quiz } from "./types/QuizTypes";
import axios from "axios";
import { Button } from "@/components/ui/button";

type SubmittedResult = {
  score: number;
  totalQuestions: number;
};

const Quiz_id = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const apiUrl = import.meta.env.VITE_API_URL;
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<SubmittedResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const getQuizById = async () => {
      try {
        const res = await axios.get(`${apiUrl}/quiz/${quizId}`, {withCredentials: true});
        const q = res.data.quiz;
        setQuiz(q);
        setSelectedAnswers(new Array(q.questions.length).fill(-1));
      } catch (err) {
        console.error(err);
      }
    };
    getQuizById();
  }, [apiUrl, quizId]);

  if (!quiz) return <div>Aucun quiz est disponible</div>;

  const question = quiz.questions[currentQuestion];

  const handleSelect = (index: number) => {
    setSelectedAnswers((prev) => {
      const copy = [...prev];
      copy[currentQuestion] = index;
      return copy;
    });
  };

  const goPrev = () => setCurrentQuestion((c) => Math.max(0, c - 1));
  const goNext = () =>setCurrentQuestion((c) => Math.min(quiz.questions.length - 1, c + 1));

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = selectedAnswers.map((sel, idx) => ({
        questionId: quiz.questions[idx]._id,
        selectedAnswer: sel,
      }));
      const res = await axios.post(`${apiUrl}/quiz/${quiz._id}/submit`,
        { answers: payload },
        { withCredentials: true },
      );
      const r = res.data.result;
      setResult({
        score: r.score,
        totalQuestions: r.totalQuestions,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (result)
    return (
      <div className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold">Résultat</h2>
        <div>
          Score: {result.score} / {result.totalQuestions}
        </div>
      </div>
    );

  return (
    <div className="flex min-h-[81vh] w-full flex-col items-center justify-around">
      <span>
        Question {currentQuestion + 1} sur {quiz.questions.length}
      </span>
      <div>
        <span className="text-xl font-bold">{question.question}</span>
      </div>
      <div className="grid w-full max-w-2xl grid-cols-2 gap-4">
        {question.options.map((opt, idx) => {
          const isSelected = selectedAnswers[currentQuestion] === idx;
          return (
            <Button
              size={"lg"}
              key={opt + idx}
              className={`cursor-pointer p-6 ${isSelected ? "bg-cyan-500" : ""}`}
              onClick={() => handleSelect(idx)}
            >
              {opt}
            </Button>
          );
        })}
      </div>
      <div className="flex w-full max-w-2xl items-center justify-between">
        <Button
          onClick={goPrev}
          className="cursor-pointer"
          disabled={currentQuestion === 0}
        >
          Précédent
        </Button>
        {currentQuestion < quiz.questions.length - 1 ? (
          <Button className="cursor-pointer bg-amber-500" onClick={goNext}>
            Suivant
          </Button>
        ) : (
          <Button
            className="cursor-pointer bg-emerald-500 hover:bg-emerald-700"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Envoi..." : "Terminer & Soumettre"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default Quiz_id;

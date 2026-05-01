import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Quiz } from "./types/QuizType";
import { Button } from "@/components/ui/button";
import { BookAlert, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

const Quiz_Start = () => {
    const { t } = useTranslation();
    const apiUrl = import.meta.env.VITE_API_URL;
    const {quizId,niveaux} = useParams();
    const navigate = useNavigate()
    const [StartQuiz,setStartQuiz] = useState<Quiz | null>(null);
    const [checkQuiz,setCheckQuiz] = useState(false)
    const [blockedByCheating, setBlockedByCheating] = useState(false);
    const [currentQuestions,setCurrentQuestions] = useState(0);
    const [selected, setSelected] = useState<number | null>(null);
    const [answers, setAnswers] = useState<number[]>([]);

    useEffect(()=>{
        const getQuizById = async()=>{
            const res = await axios.get(`${apiUrl}/quiz/${quizId}`,{withCredentials:true});
            console.log(res.data);
            setStartQuiz(res.data);
        }
        const checkQuiz = async()=>{
            const res = await axios.get(`${apiUrl}/quiz/check/${quizId}`,{withCredentials:true});
            setCheckQuiz(res.data.alreadyPassed)
            setBlockedByCheating(!!res.data.blockedByCheating);
        }
        getQuizById();
        checkQuiz();
    },[apiUrl, quizId]);

    useEffect(() => {
        if (checkQuiz || !StartQuiz) return;

        const closeQuizForCheating = async () => {
            if (quizId) {
                try {
                    await axios.post(`${apiUrl}/quiz/report-cheating`, {
                        quizId,
                        reason: t("quiz.cheatingReason")
                    }, { withCredentials: true });
                } catch {
                    // Do not block navigation when API call fails.
                }
            }
            toast.error(t("quiz.closedCheating"));
            navigate(`/Quiz/${niveaux}?cheated=1&quizId=${quizId}`, { replace: true });
        };

        const onVisibilityChange = () => {
            if (document.hidden) {
                closeQuizForCheating();
            }
        };

        const onBlur = () => {
            closeQuizForCheating();
        };

        const onContextMenu = (event: MouseEvent) => {
            event.preventDefault();
            toast.error(t("quiz.rightClickDisabled"));
        };

        const onKeyDown = (event: KeyboardEvent) => {
            const key = event.key.toLowerCase();
            const inspectShortcut =
                event.key === "F12" ||
                (event.ctrlKey && event.shiftKey && ["i", "j", "c"].includes(key)) ||
                (event.ctrlKey && key === "u");

            if (inspectShortcut) {
                event.preventDefault();
                closeQuizForCheating();
            }
        };

        document.addEventListener("visibilitychange", onVisibilityChange);
        window.addEventListener("blur", onBlur);
        window.addEventListener("contextmenu", onContextMenu);
        window.addEventListener("keydown", onKeyDown);

        return () => {
            document.removeEventListener("visibilitychange", onVisibilityChange);
            window.removeEventListener("blur", onBlur);
            window.removeEventListener("contextmenu", onContextMenu);
            window.removeEventListener("keydown", onKeyDown);
        };
    }, [StartQuiz, checkQuiz, navigate, niveaux]);

    if(!StartQuiz) return <div>{t("quiz.notFound")}</div>

    const currentIndexQuestion = StartQuiz.questions[currentQuestions]
    const isLastQuestion = currentQuestions >= StartQuiz.questions.length - 1;
    const labels = ["A", "B", "C", "D"];

    const handlePrev = ()=>{
        setCurrentQuestions(currentQuestions - 1);
    }
    const handleNext = ()=>{
        setCurrentQuestions(currentQuestions + 1);
        setSelected(answers[currentQuestions + 1] ?? null);
    }

    const handleSubmitQuestions = async () => {
        if (answers.length !== StartQuiz.questions.length) {
            toast.error(t("quiz.answerAll"));
            return;
        }
        const res = await axios.post(`${apiUrl}/quiz/submit`,{ quizId, answers },{ withCredentials: true });
        console.log(res.data);
        navigate(`/Quiz/resultat/${quizId}`)
    };

    if (checkQuiz) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-6 text-center">
        <div className="rounded-2xl bg-white p-10 shadow-md">
            <h2 className="text-2xl font-bold text-gray-800">
                {blockedByCheating ? t("quiz.blockedQuiz") : t("quiz.alreadyCompleted")}
            </h2>
            <p className="mt-3 text-gray-500">
                {blockedByCheating
                    ? t("quiz.blockedCheatingDescription")
                    : t("quiz.alreadyPassed")}
            </p>
            <div className="mt-6 flex gap-4">
                {!blockedByCheating && (
                    <Button onClick={() => navigate(`/Quiz/resultat/${quizId}`)}
                        className="cursor-pointer bg-lime-400 text-black hover:bg-lime-500">
                        {t("quiz.viewMyResult")}
                    </Button>
                )}
                <Button variant="secondary" className="cursor-pointer" onClick={() => navigate(`/Quiz/${niveaux}`)}>
                    {t("common.back")}
                </Button>
            </div>
        </div>
        </div>
    );
    }

    return (
        <div className="flex min-h-screen w-full flex-col items-center justify-around p-6">
            <span className="flex items-center justify-center rounded-md bg-amber-100 p-2 text-center text-sm text-amber-800">
                <BookAlert /> {t("quiz.cheatingWarning")}
            </span>            
            <div className="flex w-full items-center space-x-4 p-2">
                {isLastQuestion && (
                    <Button variant={'destructive'} className="cursor-pointer" onClick={()=>navigate(`/Quiz/${niveaux}`)}>
                        <X />
                    </Button>
                )}
                <Progress className="h-4" color="amber" value={
                    ((currentQuestions + 1) /StartQuiz.questions.length) * 100
                }/>
            </div>
            <div className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center gap-10 px-6 py-10">
                <p className="text-center text-2xl leading-snug font-semibold">
                    {currentIndexQuestion.question}
                </p>

                {/* ── Options ── */}
                <div className="grid w-full grid-cols-2 gap-3">
                    {currentIndexQuestion.options.map((opt, index) => {
                        const isSelected = selected === index;
                        return (
                            <button
                                key={index}
                                onClick={() => {
                                    setSelected(index)
                                    const newAnswers = [...answers];
                                    newAnswers[currentQuestions] = index;
                                    setAnswers(newAnswers)
                                }}
                                className={`
                                    relative flex cursor-pointer flex-col items-start gap-2 rounded-xl border-2 px-4
                                    py-5 text-left transition-all duration-150
                                    ${isSelected
                                        ? "border-amber-400 bg-amber-50"
                                        : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                                    }
                                `}
                            >
                                <span className={`
                                    flex h-6 w-6 items-center justify-center rounded-md text-xs font-bold
                                    ${isSelected ? "bg-amber-400 text-white" : "bg-gray-100 text-gray-500"}
                                `}>
                                    {labels[index]}
                                </span>
                                <span className="text-base font-medium text-gray-800">{opt}</span>
                            </button>
                        );
                    })}
                </div>
            </div>       
            <div className="flex w-full flex-col space-y-4">
                <Separator />
                <div className="flex w-full items-center justify-between">
                    <Button onClick={handlePrev} size={'lg'} disabled={currentQuestions === 0} className="cursor-pointer gap-1.5 font-medium">
                        <ChevronLeft size={16} /> {t("common.previous")}
                    </Button>
                    {isLastQuestion ?
                        // eslint-disable-next-line no-irregular-whitespace
                        <Button size={'lg'} onClick={handleSubmitQuestions} className="cursor-pointer bg-lime-500 text-white hover:bg-lime-600">{t("quiz.finish")}</Button>
                        :
                        <Button onClick={handleNext} size={'lg'} disabled={currentQuestions >= StartQuiz.questions.length - 1} className="cursor-pointer gap-1.5 bg-amber-400 font-medium text-black hover:bg-amber-500">
                            {t("common.next")} <ChevronRight size={16} />
                        </Button>
                    }
                </div>
            </div>
        </div>
    )
}

export default Quiz_Start
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import {Plus, Save, Settings, Trash } from "lucide-react";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import MatiereModal from "@/components/Quiz/Prof/MatiereModal";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { useProfProtectedRoutes } from "@/store/userStore";
import { useTranslation } from "react-i18next";

const colors = [
"bg-cyan-500",
"bg-purple-500",
"bg-yellow-500",
"bg-orange-500",
];

const ProfAddQuiz = () => {
const { t } = useTranslation();
const apiUrl = import.meta.env.VITE_API_URL;
const [text, setText] = useState("");
const {data} = useProfProtectedRoutes();
const [loading, setLoading] = useState(false);
const [openModal,setOpenModal] = useState(false);
const [selectedMatiere, setSelectedMatiere] = useState("");
const [selectedFiliere, setSelectedFiliere] = useState("");
const navigate = useNavigate();

const [questions, setQuestions] = useState([
    {
    question: "",
    options: ["", "", "", ""],
    correctAnswer: null as number | null,
    },
]);

// ✏️ update question
const handleQuestionChange = (qIndex: number, value: string) => {
    const updated = [...questions];
    updated[qIndex].question = value;
    setQuestions(updated);
};

// ✏️ update option
const handleOptionChange = (
    qIndex: number,
    oIndex: number,
    value: string,
) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    setQuestions(updated);
};

// ✅ select correct answer
const handleCorrect = (qIndex: number, value: string) => {
    const updated = [...questions];
    updated[qIndex].correctAnswer = Number(value);
    setQuestions(updated);
};

// ➕ add question
const addQuestion = () => {
    setQuestions([
    ...questions,
    {
        question: "",
        options: ["", "", "", ""],
        correctAnswer: null,
    },
    ]);
};

// ❌ delete question
const deleteQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
};

// 🚀 SUBMIT
const handleSubmit = async () => {
    try {
        if (!text) return toast.error(t("prof.addQuiz.requiredTitle"));
        const isCollege = data?.niveaux === "1AC" || data?.niveaux === "2AC" || data?.niveaux === "3AC";
        if (!selectedMatiere || (!isCollege && !selectedFiliere)) {
            return toast.error(t("prof.addQuiz.openSettingsError", { needStream: !isCollege ? t("prof.addQuiz.andStream") : "" }));
        }
        for (const q of questions) {
            if (!q.question) return toast.error(t("prof.addQuiz.emptyQuestion"));

            if (q.options.some((o) => !o))
            return toast.error(t("prof.addQuiz.fillAllAnswers"));

            if (q.correctAnswer === null) return toast.error(t("prof.addQuiz.chooseCorrectAnswer"));
        }

        setLoading(true);

        await axios.post(`${apiUrl}/prof/add-quiz`,{
            text,
            questions,
            matiere: selectedMatiere,
            filiere: isCollege ? 'Science' : selectedFiliere,
        },{ withCredentials: true },
        );

        toast.success(t("prof.addQuiz.created"));
        navigate("/prof/quiz");
        setText("");
        setQuestions([
            {
            question: "",
            options: ["", "", "", ""],
            correctAnswer: null,
            },
        ]);
    } catch (error) {
        const axiosError = error as AxiosError<{ message: string }>;
        toast.error(
            axiosError.response?.data?.message || t("prof.addQuiz.addError"),
        );
    } finally {
    setLoading(false);
    }
};

return (
    <>
        <div className="min-h-screen space-y-6 p-6">
            <div className="flex w-full items-end justify-end gap-3">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            type="button"
                            onClick={() => setOpenModal(true)}
                            variant={!selectedMatiere || !selectedFiliere ? "default" : "outline"}
                            className={`shrink-0 cursor-pointer ${!selectedMatiere || !selectedFiliere ? "bg-amber-500 hover:bg-amber-600" : ""}`}
                            aria-label={t("prof.addQuiz.settingsAria")}
                        >
                            <Settings className="size-4" />
                            <span className="ml-2 hidden sm:inline">{t("prof.addQuiz.settings")}</span>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="max-w-xs text-center">
                        <p>{t("prof.addQuiz.settingsTooltip")}</p>
                    </TooltipContent>
                </Tooltip>
            </div>

            {(!selectedMatiere || !selectedFiliere) && (
                <Alert className="w-full border-amber-200 bg-amber-50 text-amber-950 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-50">
                    <Info className="size-4 text-amber-700 dark:text-amber-300" />
                    <AlertTitle className="text-sm font-semibold">
                        {t("prof.addQuiz.requiredSubjectStream")}
                    </AlertTitle>
                    <AlertDescription className="w-full text-sm text-amber-900 dark:text-amber-100">
                        {t("prof.addQuiz.requiredInfoText")}
                    </AlertDescription>
                </Alert>
            )}

{            // eslint-disable-next-line tailwindcss/no-custom-classname
}            <p className="text-muted-foreground w-full text-sm">
                <span className={selectedMatiere ? "" : "font-medium text-amber-700 dark:text-amber-300"}>
                    {t("prof.common.subject")} : {selectedMatiere ? t("prof.addQuiz.selected", { value: selectedMatiere }) : t("prof.addQuiz.notProvidedOpenSettings")}
                </span>
                {" · "}
                {!["1AC", "2AC", "3AC"].includes(data?.niveaux || "") && (
                    <span className={selectedFiliere ? "" : "font-medium text-amber-700 dark:text-amber-300"}>
                        {t("prof.common.stream")} : {selectedFiliere || t("prof.addQuiz.notProvidedOpenSettings")}
                    </span>
                )}
                
            </p>
        
        {/* TITLE */}
        <Input
            placeholder={t("prof.addQuiz.quizTitlePlaceholder")}
            className="w-full bg-white text-black dark:text-white"
            value={text}
            onChange={(e) => setText(e.target.value)}
        />

        {/* QUESTIONS */}
        {questions.map((q, qIndex) => (
            <div key={qIndex} className="space-y-4 rounded-md border p-6">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <h2 className="font-bold">{t("prof.addQuiz.question", { count: qIndex + 1 })}</h2>

                {questions.length > 1 && (
                <Button
                    onClick={() => deleteQuestion(qIndex)}
                    variant="destructive"
                    className="cursor-pointer"
                >
                    <Trash /> {t("common.delete")}
                </Button>
                )}
            </div>

            {/* QUESTION */}
            <Textarea
                placeholder={t("prof.addQuiz.questionPlaceholder")}
                value={q.question}
                onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
            />

            {/* OPTIONS */}
            <RadioGroup
                onValueChange={(value) => handleCorrect(qIndex, value)}
                className="grid  grid-cols-1 gap-3 md:grid-cols-3 lg:grid-cols-4"
            >
                {q.options.map((opt, oIndex) => (
                <div
                    key={oIndex}
                    className={`relative flex h-28 items-center justify-center rounded-md ${colors[oIndex]}`}
                >
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <RadioGroupItem
                            value={oIndex.toString()}
                            className="absolute top-3 right-3 cursor-pointer "
                            />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{t("prof.addQuiz.selectCorrectTooltip")}</p>
                        </TooltipContent>
                    </Tooltip>

                    <input
                        value={opt}
                        onChange={(e) =>
                            handleOptionChange(qIndex, oIndex, e.target.value)
                        }
                        placeholder={t("prof.addQuiz.answerPlaceholder")}
                        className="w-full bg-transparent p-2 text-center text-white outline-none placeholder:text-white"
                    />
                </div>
                ))}
            </RadioGroup>
            </div>
        ))}

        {/* ADD */}
        <Button onClick={addQuestion} className="cursor-pointer bg-amber-500 text-white hover:bg-amber-600">
            <Plus /> {t("prof.addQuiz.addQuestion")}
        </Button>

        {/* SAVE */}
        <Button
            onClick={handleSubmit}
            disabled={loading || questions.length < 5}
            className="w-full cursor-pointer bg-cyan-600 text-white hover:bg-cyan-700"
        >
            <Save />
            {loading ? t("prof.addQuiz.saving") : t("prof.addQuiz.saveQuiz")}
        </Button>
        </div>
        {openModal && (
            <MatiereModal 
                openModal={openModal} 
                setOpenModal={setOpenModal}
                setSelectedMatiere={setSelectedMatiere}
                setSelectedFiliere={setSelectedFiliere}
            />
        )}
    </>
    
);
};

export default ProfAddQuiz;

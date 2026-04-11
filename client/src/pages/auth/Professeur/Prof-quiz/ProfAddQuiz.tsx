import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Plus, Save, Settings, Trash } from "lucide-react";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import MatiereModal from "@/components/Quiz/Prof/MatiereModal";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { useProfProtectedRoutes } from "@/store/userStore";

const colors = [
"bg-cyan-500",
"bg-purple-500",
"bg-yellow-500",
"bg-orange-500",
];

const ProfAddQuiz = () => {
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
        if (!text) return toast.error("Titre requis");
        const isCollege = data?.niveaux === "1AC" || data?.niveaux === "2AC" || data?.niveaux === "3AC";
        if (!selectedMatiere || (!isCollege && !selectedFiliere)) {
            return toast.error("Ouvrez le bouton Paramètres et renseignez la matière" +(!isCollege ? " ainsi que la filière." : "."),);
        }
        for (const q of questions) {
            if (!q.question) return toast.error("Question vide");

            if (q.options.some((o) => !o))
            return toast.error("Remplir toutes les réponses");

            if (q.correctAnswer === null) return toast.error("Choisir la bonne réponse");
        }

        setLoading(true);

        await axios.post(`${apiUrl}/prof/add-quiz`,{
            text,
            questions,
            matiere: selectedMatiere,
            filiere: isCollege ? 'Science' : selectedFiliere,
        },{ withCredentials: true },
        );

        toast.success("✅ Quiz créé !");
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
            axiosError.response?.data?.message || "Impossible d’ajouter le quiz.",
        );
    } finally {
    setLoading(false);
    }
};

return (
    <>
        <div className="min-h-screen space-y-6 p-6">
            <div className="flex items-center justify-between gap-3">
                <Button onClick={()=>navigate(-1)} variant="outline" className="cursor-pointer">
                    <ArrowLeft />
                </Button>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            type="button"
                            onClick={() => setOpenModal(true)}
                            variant={!selectedMatiere || !selectedFiliere ? "default" : "outline"}
                            className={`shrink-0 cursor-pointer ${!selectedMatiere || !selectedFiliere ? "bg-amber-500 hover:bg-amber-600" : ""}`}
                            aria-label="Paramètres : choisir la matière et la filière"
                        >
                            <Settings className="size-4" />
                            <span className="ml-2 hidden sm:inline">Paramètres</span>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="max-w-xs text-center">
                        <p>Cliquez ici pour choisir la matière et la filière du quiz.</p>
                    </TooltipContent>
                </Tooltip>
            </div>

            {(!selectedMatiere || !selectedFiliere) && (
                <Alert className="w-full border-amber-200 bg-amber-50 text-amber-950 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-50">
                    <Info className="size-4 text-amber-700 dark:text-amber-300" />
                    <AlertTitle className="text-sm font-semibold">
                        Matière et filière obligatoires
                    </AlertTitle>
                    <AlertDescription className="w-full text-sm text-amber-900 dark:text-amber-100">
                        Avant d’enregistrer le quiz, cliquez sur le bouton{" "}
                        <strong className="w-full font-semibold">Paramètres</strong>{" "}
                        (icône engrenage) en haut à droite, puis renseignez la{" "}
                        <strong className="font-semibold">matière</strong> et la{" "}
                        <strong className="font-semibold">filière</strong> dans la fenêtre qui s’ouvre.
                    </AlertDescription>
                </Alert>
            )}

{            // eslint-disable-next-line tailwindcss/no-custom-classname
}            <p className="text-muted-foreground w-full text-sm">
                <span className={selectedMatiere ? "" : "font-medium text-amber-700 dark:text-amber-300"}>
                    Matière : {selectedMatiere ? `choisie ${selectedMatiere}` : "non renseignée — ouvrir Paramètres"}
                </span>
                {" · "}
                {!["1AC", "2AC", "3AC"].includes(data?.niveaux || "") && (
                    <span className={selectedFiliere ? "" : "font-medium text-amber-700 dark:text-amber-300"}>
                        Filière : {selectedFiliere || "non renseignée — ouvrir Paramètres"}
                    </span>
                )}
                
            </p>
        
        {/* TITLE */}
        <Input
            placeholder="Titre du quiz"
            className="w-full bg-white text-black dark:text-white"
            value={text}
            onChange={(e) => setText(e.target.value)}
        />

        {/* QUESTIONS */}
        {questions.map((q, qIndex) => (
            <div key={qIndex} className="space-y-4 rounded-md border p-6">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <h2 className="font-bold">Question {qIndex + 1}</h2>

                {questions.length > 1 && (
                <Button
                    onClick={() => deleteQuestion(qIndex)}
                    variant="destructive"
                    className="cursor-pointer"
                >
                    <Trash /> Supprimer
                </Button>
                )}
            </div>

            {/* QUESTION */}
            <Textarea
                placeholder="Saisissez votre question ici"
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
                            <p>Selectionner votre Réponse correctes</p>
                        </TooltipContent>
                    </Tooltip>

                    <input
                        value={opt}
                        onChange={(e) =>
                            handleOptionChange(qIndex, oIndex, e.target.value)
                        }
                        placeholder="Saisissez votre reponse ici "
                        className="w-full bg-transparent p-2 text-center text-white outline-none placeholder:text-white"
                    />
                </div>
                ))}
            </RadioGroup>
            </div>
        ))}

        {/* ADD */}
        <Button onClick={addQuestion} className="cursor-pointer bg-amber-500 text-white hover:bg-amber-600">
            <Plus /> Ajouter une question
        </Button>

        {/* SAVE */}
        <Button
            onClick={handleSubmit}
            disabled={loading || questions.length < 5}
            className="w-full cursor-pointer bg-cyan-600 text-white hover:bg-cyan-700"
        >
            <Save />
            {loading ? "Enregistrement..." : "Enregistrer le Quiz"}
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

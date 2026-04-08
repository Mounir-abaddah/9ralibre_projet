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

const colors = [
"bg-cyan-500",
"bg-purple-500",
"bg-yellow-500",
"bg-orange-500",
];

const ProfAddQuiz = () => {
const apiUrl = import.meta.env.VITE_API_URL;
const [text, setText] = useState("");
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
        if (!selectedMatiere) return toast.error("Choisir matière");
        if (!selectedFiliere) return toast.error("Choisir filière");
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
            filiere: selectedFiliere,
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
    alert(axiosError.response?.data?.message || "Erreur");
    toast.error("Erreur Pour ajouter le Quiz ❌");
    } finally {
    setLoading(false);
    }
};

return (
    <>
        <div className="min-h-screen space-y-6 p-6">
            <div className="flex items-center justify-between">
                <Button onClick={()=>navigate(-1)} variant="outline" className="cursor-pointer">
                    <ArrowLeft />
                </Button>
                <Button onClick={()=>setOpenModal(!openModal)} variant="outline" className="cursor-pointer">
                    <Settings />
                </Button>
            </div>

            <p className="text-sm text-gray-500">
                Matière: {selectedMatiere || "Non sélectionnée"} | Filière:{" "}
                {selectedFiliere || "Non sélectionnée"}
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

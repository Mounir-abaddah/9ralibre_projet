import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import type { Quiz } from "./types/QuizType";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Check, Play } from "lucide-react";
import Pagination from "@/components/Pagination/Pagination";

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
        <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Prêt à vous challenger ? 🎯
            </h1>
            <p className="mt-2 text-sm text-gray-500">
                Sélectionnez un quiz ci-dessous et testez vos connaissances en quelques minutes.
            </p>
        </div>
        <div className="space-y-4">
            <Pagination
            itemsPerPage={itemsPerPage}
            totalItems={totalQuiz}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {quizList.map((quiz) => (
                    <div
                        key={quiz._id}
                        className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-5 py-4 transition-colors hover:bg-gray-50"
                    >
                        <div className="flex min-w-0 flex-1 flex-col gap-2 pr-4">
                            <Badge variant="secondary" className="w-fit text-xs font-medium">
                                {quiz.filiere}
                            </Badge>
                            <span className="truncate text-sm font-semibold text-gray-900">
                                {quiz.text}
                            </span>
                            <div className="mt-1 flex items-center gap-2">
                                <Avatar className="h-7 w-7">
                                    <AvatarImage src={quiz.professeur.image} alt={quiz.professeur.nom} />
                                    <AvatarFallback className="bg-gray-100 text-xs text-gray-600">
                                        {quiz.professeur.nom[0]}
                                        {quiz.professeur.prenom[0]}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col leading-tight">
                                    <Link to={`/Profile/${quiz.professeur.nom}-${quiz.professeur.prenom}`} className="text-xs font-medium text-gray-800">
                                        {quiz.professeur.nom} {quiz.professeur.prenom}
                                    </Link>
                                    <span className="text-xs text-gray-400">{quiz.professeur.role}</span>
                                </div>
                            </div>
                        </div>
                        {quiz.alreadyPassed ?
                            <Button
                                onClick={() => navigate(`/Quiz/resultat/${quiz._id}`)}
                                size="sm"
                                className="shrink-0 cursor-pointer gap-1.5 bg-lime-400 text-xs font-medium text-black hover:bg-lime-500"
                            >
                                <Check size={14} />
                                Voir le resultat
                            </Button>
                        :
                            <Button
                                onClick={() => navigate(`/Quiz/start/${niveaux}/${quiz._id}`)}
                                size="sm"
                                className="shrink-0 cursor-pointer gap-1.5 bg-amber-400 text-xs font-medium text-black hover:bg-amber-500"
                            >
                                <Play size={14} />
                                Commencer
                            </Button>
                        }
                    </div>
                ))}
            </div>
            <Pagination
                itemsPerPage={itemsPerPage}
                totalItems={totalQuiz}
                currentPage={currentPage}
                onPageChange={handlePageChange}
            />
        </div>
        </>
    );
};

export default QuizPage;
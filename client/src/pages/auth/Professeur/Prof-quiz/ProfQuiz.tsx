import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useEffect, useState } from "react";
import axios from "axios";
import { Trash, Users } from "lucide-react";
import Pagination from "@/components/Pagination/Pagination";
import type { QuizProf } from "../../Quiz/types/QuizType";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Link, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import no_data from "@/assets/images/cours/No data-cuate.png";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const ProfQuiz = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const [searchParams, setSearchParams] = useSearchParams();

    const [quiz, setQuiz] = useState<QuizProf[]>([]);
    const [page, setPage] = useState(() => {
      const p = Number(searchParams.get("page"));
      return Number.isFinite(p) && p > 0 ? p : 1;
    });
    const [totalQuiz, setTotalQuiz] = useState(0);
    const [loading, setLoading] = useState(false);

    const limit = 8;

    const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "long",
        day: "numeric",
    };

    const getQuiz = async (pageNumber = 1) => {
        try {
            setLoading(true);
            const res = await axios.get(`${apiUrl}/prof/get-quiz?page=${pageNumber}&limit=${limit}`,{ withCredentials: true });
            setQuiz(res.data.quiz);
            setTotalQuiz(res.data.totalQuiz);
        } catch (error) {
            console.log(error);
            toast.error("Erreur lors du chargement ❌");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (quizId: string) => {
        try {
            // Si on supprime le dernier quiz de la page courante,
            // on revient automatiquement à page - 1.
            const shouldGoBack = page > 1 && quiz.length === 1;
        await axios.delete(`${apiUrl}/prof/delete-quiz/${quizId}`, {
            withCredentials: true,
        });

            if (shouldGoBack) {
                setPage((prev) => Math.max(prev - 1, 1));
            } else {
                await getQuiz(page);
            }
            toast.success("Quiz supprimé avec succès ✅");
        } catch (error) {
            console.log(error);
            toast.error("Erreur lors de la suppression ❌");
        }
    };

  useEffect(() => {
    getQuiz(page);
  }, [page]);

  useEffect(() => {
    const params: Record<string, string> = {};
    if (page > 1) params.page = page.toString();
    setSearchParams(params);
  }, [page, setSearchParams]);

  return (
    <div className="space-y-6">
        {/* HEADER */}
        <div className="flex items-center justify-between">
            <div>
            <h2 className="text-2xl font-bold">Mes Quiz</h2>
            <span className="pl-2 text-sm text-white">
                {totalQuiz} Quiz disponible
            </span>
            </div>

            <Link target="_blank" to={"/prof/add/quiz/questions"}>
            <Button variant="outline">Ajouter un Quiz</Button>
            </Link>
        </div>

        {/* TABLE */}
        <div className="overflow-hidden rounded-xl border shadow-sm">
            <Table>
            <TableHeader className="bg-gray-100 dark:bg-slate-800">
                <TableRow>
                <TableHead>Titre</TableHead>
                <TableHead>Questions</TableHead>
                <TableHead>Filière</TableHead>
                <TableHead>Matière</TableHead>
                <TableHead>
                    <Tooltip>
                    <TooltipTrigger>Étudiants</TooltipTrigger>
                    <TooltipContent>
                        <p>Étudiants ayant passé le quiz</p>
                    </TooltipContent>
                    </Tooltip>
                </TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {loading ? (
                <TableRow>
                    <TableCell colSpan={7} className="text-center py-10">
                    Chargement...
                    </TableCell>
                </TableRow>
                ) : quiz.length > 0 ? (
                quiz.map((q) => (
                    <TableRow
                    key={q._id}
                    className="transition hover:bg-gray-50 dark:hover:bg-slate-800"
                    >
                    <TableCell className="font-semibold">
                        {q.text}
                    </TableCell>

                    <TableCell>{q.questions.length}</TableCell>

                    <TableCell>
                        <span className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-600">
                        {q.filiere}
                        </span>
                    </TableCell>

                    <TableCell>
                        <span className="rounded bg-amber-100 px-2 py-1 text-xs text-amber-600">
                        {q.matiere.nom}
                        </span>
                    </TableCell>

                    <TableCell>
                        <div className="flex items-center gap-1">
                        <Users size={16} />
                        {q.participants?.length || 0}
                        </div>
                    </TableCell>

                    <TableCell>
                        {new Date(q.createdAt).toLocaleDateString(
                        "fr-FR",
                        options
                        )}
                    </TableCell>

                    <TableCell className="flex justify-end gap-2">
                        <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                            variant="outline"
                            className="p-2 text-red-500 hover:bg-red-100"
                            >
                            <Trash size={16} />
                            </Button>
                        </AlertDialogTrigger>

                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>
                                Confirmer la suppression
                            </AlertDialogTitle>

                            <AlertDialogDescription>
                                Voulez-vous vraiment supprimer :
                                <span className="font-semibold">
                                {" "}
                                {q.text}{" "}
                                </span>
                                ? Cette action est irréversible.
                            </AlertDialogDescription>
                            </AlertDialogHeader>

                            <AlertDialogFooter>
                            <AlertDialogCancel>
                                Annuler
                            </AlertDialogCancel>

                            <AlertDialogAction
                                onClick={() => handleDelete(q._id)}
                                className="bg-red-600 hover:bg-red-700"
                            >
                                Supprimer
                            </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                        </AlertDialog>
                    </TableCell>
                    </TableRow>
                ))
                ) : (
                <TableRow>
                    <TableCell colSpan={7}>
                    <div className="flex flex-col items-center justify-center py-10">
                        <img src={no_data} className="w-72" />
                        <p className="mt-4 text-gray-500">
                        Aucun Quiz
                        </p>
                    </div>
                    </TableCell>
                </TableRow>
                )}
            </TableBody>
            </Table>
        </div>

      {/* PAGINATION */}
        <Pagination
            totalItems={totalQuiz}
            itemsPerPage={limit}
            currentPage={page}
            onPageChange={setPage}
        />
    </div>
  );
};

export default ProfQuiz;
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
import { Plus, Search, Trash, Users, X } from "lucide-react";
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
import no_data from "/assets/images/cours/No data-cuate.png";

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
import { useDebounce } from "@/hooks/use-debounce";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";

const ProfQuiz = () => {
  const { t, i18n } = useTranslation();
  const apiUrl = import.meta.env.VITE_API_URL;
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(() => {
    return searchParams.get("search") || "";
  });

  const debouncedSearch = useDebounce(search, 500);

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
      const res = await axios.get(
        `${apiUrl}/prof/get-quiz?page=${pageNumber}&limit=${limit}&search=${debouncedSearch}`,
        { withCredentials: true },
      );
      setQuiz(res.data.quiz);
      setTotalQuiz(res.data.totalQuiz);
    } catch (error) {
      console.log(error);
      toast.error(t("prof.quiz.loadError"));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (quizId: string) => {
    try {
      const shouldGoBack = page > 1 && quiz.length === 1;
      await axios.delete(`${apiUrl}/prof/delete-quiz/${quizId}`, {
        withCredentials: true,
      });

      if (shouldGoBack) {
        setPage((prev) => Math.max(prev - 1, 1));
      } else {
        await getQuiz(page);
      }
      toast.success(t("prof.quiz.deletedSuccess"));
    } catch (error) {
      console.log(error);
      toast.error(t("prof.quiz.deletedError"));
    }
  };

  useEffect(() => {
    getQuiz(page);
  }, [page, debouncedSearch]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    if (page > 1) {
      params.set("page", page.toString());
    } else {
      params.delete("page");
    }

    if (debouncedSearch.trim() !== "") {
      params.set("search", debouncedSearch.trim());
    } else {
      params.delete("search");
    }

    setSearchParams(params);
  }, [page, debouncedSearch]);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col items-start justify-between lg:flex-row lg:items-center">
        <div>
          <h2 className="text-2xl font-bold">{t("prof.quiz.title")}</h2>
          <span className="pl-2 text-sm text-white">
            {t("prof.quiz.availableCount", { count: totalQuiz })}
          </span>
        </div>
        <div className="flex flex-row-reverse items-center gap-2">
          <Link target="_blank" to={"/prof/add/quiz/questions"}>
            <Button variant="outline" className="flex items-center">
              <Plus />
              {t("prof.quiz.addQuiz")}
            </Button>
          </Link>
          <div className="relative w-full max-w-md">
            <Input
              type="text"
              placeholder={t("prof.quiz.searchPlaceholder")}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              className="pr-10 pl-10"
            />
            <span className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400">
              <Search size={16} />
            </span>
            {search && (
              <button
                onClick={() => {
                  setSearch("");
                  setPage(1);
                }}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-xl border shadow-sm">
        <Table>
          <TableHeader className="bg-gray-100 dark:bg-slate-800">
            <TableRow>
              <TableHead>{t("prof.common.title")}</TableHead>
              <TableHead>{t("prof.quiz.questions")}</TableHead>
              <TableHead>{t("prof.common.stream")}</TableHead>
              <TableHead>{t("prof.common.subject")}</TableHead>
              <TableHead>
                <Tooltip>
                  <TooltipTrigger>{t("prof.quiz.students")}</TooltipTrigger>
                  <TooltipContent>
                    <p>{t("prof.quiz.studentsTooltip")}</p>
                  </TooltipContent>
                </Tooltip>
              </TableHead>
              <TableHead>{t("prof.common.date")}</TableHead>
              <TableHead className="text-right">
                {t("prof.common.actions")}
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="py-10 text-center">
                  {t("common.loading")}
                </TableCell>
              </TableRow>
            ) : quiz.length > 0 ? (
              quiz.map((q) => (
                <TableRow
                  key={q._id}
                  className="transition hover:bg-gray-50 dark:hover:bg-slate-800"
                >
                  <TableCell className="font-semibold">{q.text}</TableCell>

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
                      i18n.language === "en" ? "en-US" : "fr-FR",
                      options,
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
                            {t("prof.common.confirmDelete")}
                          </AlertDialogTitle>

                          <AlertDialogDescription>
                            {t("prof.quiz.deleteConfirmPrefix")}
                            <span className="font-semibold"> {q.text} </span>
                            {t("prof.quiz.deleteConfirmSuffix")}
                          </AlertDialogDescription>
                        </AlertDialogHeader>

                        <AlertDialogFooter>
                          <AlertDialogCancel>
                            {t("common.cancel")}
                          </AlertDialogCancel>

                          <AlertDialogAction
                            onClick={() => handleDelete(q._id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            {t("common.delete")}
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
                    <p className="mt-4 text-gray-500">{t("prof.quiz.empty")}</p>
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

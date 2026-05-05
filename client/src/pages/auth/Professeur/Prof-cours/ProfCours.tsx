import Pagination from "@/components/Pagination/Pagination";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import axios from "axios";
import { Plus, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import no_data from "/assets/images/cours/No data-cuate.png";
import AddCoursModal from "@/components/Cours/Prof/AddCoursModal";
import { useProfProtectedRoutes } from "@/store/userStore";
import type { CoursType, Matiere } from "../../Cours/types/CoursType";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogDescription,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTranslation } from "react-i18next";

const ProfCours = () => {
  const { t, i18n } = useTranslation();
  const apiUrl = import.meta.env.VITE_API_URL;
  const { data } = useProfProtectedRoutes();
  const [searchParams, setSearchParams] = useSearchParams();

  const [open, setOpen] = useState(false);
  const [Cours, SetCours] = useState<CoursType[]>([]);
  const [currentPage, setCurrentPage] = useState(() => {
    const p = Number(searchParams.get("page"));
    return Number.isFinite(p) && p > 0 ? p : 1;
  });
  const [totalCours, setTotalCours] = useState(0);
  const [matiere, setMatiere] = useState<Matiere[]>([]);
  const [limit] = useState(16);
  const [selectedCours, setSelectedCours] = useState<CoursType | null>(null);
  const [search, setSearch] = useState(() => {
    return searchParams.get("search") || "";
  });
  const debouncedSearch = useDebounce(search, 500);

  const getCours = async () => {
    const res = await axios.get(
      `${apiUrl}/prof/getCours?page=${currentPage}&limit=${limit}&search=${debouncedSearch}`,
      { withCredentials: true },
    );
    SetCours(res.data.cours);
    setTotalCours(res.data.totalCours);
  };

  useEffect(() => {
    getCours();
  }, [currentPage, debouncedSearch]);

  useEffect(() => {
    const params: Record<string, string> = {};
    if (currentPage > 1) params.page = currentPage.toString();
    if (debouncedSearch.trim() !== "") params.search = debouncedSearch.trim();
    setSearchParams(params);
  }, [currentPage, debouncedSearch, setSearchParams]);

  useEffect(() => {
    const q = searchParams.get("search") || "";
    if (q !== search) {
      setSearch(q);
    }
  }, [searchParams]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  useEffect(() => {
    const getMatiere = async () => {
      const res = await axios.get(`${apiUrl}/prof/fetch-matiere`, {
        withCredentials: true,
      });
      setMatiere(res.data);
    };
    getMatiere();
  }, []);

  const bgItems = {
    Cours: "bg-green-900 text-green-100",
    Exercice: "bg-cyan-900 text-cyan-100",
    Examen: "bg-teal-900 text-teal-100",
    "Examen National": "bg-sky-900 text-sky-100",
  };

  const handleDeleteCours = async (coursId: string) => {
    try {
      const shouldGoBack = currentPage > 1 && Cours.length === 1;
      await axios.delete(`${apiUrl}/prof/delete-cours/${coursId}`, {
        withCredentials: true,
      });

      if (shouldGoBack) {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
      } else {
        await getCours();
      }
      toast.success(t("prof.courses.deletedSuccess"));
    } catch (error) {
      console.log(error);
      toast.error(t("prof.courses.deletedError"));
    }
  };

  return (
    <div>
      {/* HEADER */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{t("prof.courses.title")}</h1>
          <span className="text-sm text-gray-500">
            {t("prof.courses.publishedDocuments", { count: Cours.length })}
          </span>
        </div>
        <div className="flex flex-row-reverse items-center gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setSelectedCours(null);
              setOpen(true);
            }}
            className="cursor-pointer"
          >
            <Plus /> {t("prof.courses.add")}
          </Button>
          <div className="relative w-full max-w-3xl">
            <Input
              type="text"
              placeholder={t("prof.courses.searchPlaceholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pr-10 pl-10"
            />

            {/* icon */}
            <span className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400">
              <Search size={16} />
            </span>

            {/* clear */}
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>
      </div>

      {Cours.length > 0 ? (
        <Card className="mt-6 p-4">
          {totalCours > limit && (
            <Pagination
              totalItems={totalCours}
              itemsPerPage={limit}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          )}
          {/* RESPONSIVE TABLE */}
          <div className="mt-4 w-full overflow-x-auto">
            <Table className="min-w-[700px]">
              <TableHeader>
                <TableRow>
                  <TableHead>{t("prof.common.title")}</TableHead>
                  <TableHead>{t("prof.common.type")}</TableHead>
                  <TableHead>{t("prof.common.subject")}</TableHead>
                  <TableHead className="hidden md:table-cell">
                    {t("prof.common.semester")}
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    {t("prof.common.stream")}
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    {t("prof.common.date")}
                  </TableHead>
                  <TableHead className="text-right">
                    {t("prof.common.actions")}
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {Cours.map((cours) => (
                  <TableRow key={cours._id}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <TableCell className="line-clamp-1 max-w-[190px] truncate">
                          {cours.title}
                        </TableCell>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{cours.title}</p>
                      </TooltipContent>
                    </Tooltip>
                    <TableCell>
                      <span
                        className={`rounded px-2 py-1 text-xs ${bgItems[cours.type as keyof typeof bgItems]}`}
                      >
                        {cours.type}
                      </span>
                    </TableCell>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <TableCell className="line-clamp-1 max-w-[190px] truncate">
                          {cours.matiere?.nom || "-"}
                        </TableCell>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{cours.matiere?.nom || "-"}</p>
                      </TooltipContent>
                    </Tooltip>

                    <TableCell className="hidden md:table-cell">
                      {cours.semestre}
                    </TableCell>

                    <TableCell className="hidden md:table-cell">
                      {cours.filière}
                    </TableCell>

                    <TableCell className="hidden md:table-cell">
                      {new Date(cours.createdAt).toLocaleDateString(
                        i18n.language === "en" ? "en-US" : "fr-FR",
                      )}
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button className="cursor-pointer">
                          <a
                            href={`${apiUrl}/uploads/files/${data?.id}/${cours.pdfUrl}`}
                            target="_blank"
                            className="text-sm text-blue-500"
                          >
                            PDF
                          </a>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="cursor-pointer"
                          onClick={() => {
                            setOpen(true);
                            setSelectedCours(cours);
                          }}
                        >
                          {t("common.edit")}
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="destructive">
                              {t("common.delete")}
                            </Button>
                          </AlertDialogTrigger>

                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                {t("prof.common.confirmDelete")}
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                {t("prof.courses.deleteConfirm")}
                              </AlertDialogDescription>
                            </AlertDialogHeader>

                            <AlertDialogFooter>
                              <AlertDialogCancel>
                                {t("common.cancel")}
                              </AlertDialogCancel>

                              <AlertDialogAction
                                onClick={() => handleDeleteCours(cours._id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                {t("prof.common.confirmDeleteAction")}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {totalCours > limit && (
            <Pagination
              totalItems={totalCours}
              itemsPerPage={limit}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          )}
        </Card>
      ) : (
        <div className="mt-10 flex flex-col items-center">
          <img src={no_data} className="w-72" />
          <p className="mt-4 text-gray-500">{t("prof.courses.empty")}</p>
        </div>
      )}

      <AddCoursModal
        open={open}
        setOpen={setOpen}
        matiere={matiere}
        onSuccess={getCours}
        cours={selectedCours}
      />
    </div>
  );
};

export default ProfCours;

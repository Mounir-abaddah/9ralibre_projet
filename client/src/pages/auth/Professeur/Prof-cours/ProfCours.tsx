import Pagination from "@/components/Pagination/Pagination"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import axios from "axios"
import { Plus } from "lucide-react"
import { useEffect, useState } from "react"
import no_data from '@/assets/images/cours/No data-cuate.png'
import AddCoursModal from "@/components/Cours/Prof/AddCoursModal"
import { useProfProtectedRoutes } from "@/store/userStore"
import type { CoursType, Matiere } from "../../Cours/types/CoursType"
import {
Table,
TableBody,
TableCell,
TableHead,
TableHeader,
TableRow,
} from "@/components/ui/table"
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
} from "@/components/ui/alert-dialog"
import toast from "react-hot-toast"
import { useSearchParams } from "react-router-dom"

const ProfCours = () => {
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
const [matiere, setMatiere] = useState<Matiere[]>([])
const [limit] = useState(6);
const [selectedCours, setSelectedCours] = useState<CoursType | null>(null);

const getCours = async () => {
    const res = await axios.get(
    `${apiUrl}/prof/getCours?page=${currentPage}&limit=${limit}`,
    { withCredentials: true }
    );
    SetCours(res.data.cours);
    setTotalCours(res.data.totalCours);
};

useEffect(() => {
    getCours();
}, [currentPage]);

useEffect(() => {
    const params: Record<string, string> = {};
    if (currentPage > 1) params.page = currentPage.toString();
    setSearchParams(params);
}, [currentPage, setSearchParams]);

useEffect(() => {
    const getMatiere = async () => {
    const res = await axios.get(`${apiUrl}/prof/fetch-matiere`, { withCredentials: true })
    setMatiere(res.data)
    }
    getMatiere()
}, [])

const bgItems = {
    "Cours": "bg-green-900 text-green-100",
    "Exercice": "bg-cyan-900 text-cyan-100",
    "Examen": "bg-teal-900 text-teal-100",
    "Examen National": "bg-sky-900 text-sky-100",
}

const handleDeleteCours = async (coursId: string) => {
    try {
        // Si on supprime le dernier cours sur la page courante,
        // on doit revenir à la page précédente pour éviter une page vide.
        const shouldGoBack = currentPage > 1 && Cours.length === 1;
        await axios.delete(`${apiUrl}/prof/delete-cours/${coursId}`, {
            withCredentials: true,
        });

        if (shouldGoBack) {
            setCurrentPage((prev) => Math.max(prev - 1, 1));
        } else {
            await getCours();
        }
        toast.success("Cours supprimé avec succès ✅");
    } catch (error) {
        console.log(error);
        toast.error("Erreur lors de la suppression ❌");
    }
}

return (
    <div>
    {/* HEADER */}
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
        <h1 className="text-2xl font-semibold">Mes Cours</h1>
        <span className="text-sm text-gray-500">
            {Cours.length} documents publiés
        </span>
        </div>

        <Button
        variant="outline"
        onClick={() => {
            setSelectedCours(null)
            setOpen(true)
        }}
        >
        <Plus /> Ajouter
        </Button>
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
                <TableHead>Titre</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Matière</TableHead>
                <TableHead className="hidden md:table-cell">Semestre</TableHead>
                <TableHead className="hidden md:table-cell">Filière</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {Cours.map((cours) => (
                <TableRow key={cours._id}>

                    <TableCell>{cours.title}</TableCell>

                    <TableCell>
                    <span className={`rounded px-2 py-1 text-xs ${bgItems[cours.type as keyof typeof bgItems]}`}>
                        {cours.type}
                    </span>
                    </TableCell>

                    <TableCell>
                    {cours.matiere?.nom || "-"}
                    </TableCell>

                    <TableCell className="hidden md:table-cell">
                    {cours.semestre}
                    </TableCell>

                    <TableCell className="hidden md:table-cell">
                    {cours.filière}
                    </TableCell>

                    <TableCell className="hidden md:table-cell">
                    {new Date(cours.createdAt).toLocaleDateString()}
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
                                    setOpen(true)
                                    setSelectedCours(cours)
                                }}
                            >
                            Modifier
                            </Button>

                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button size="sm" variant="destructive">
                                    Supprimer
                                    </Button>
                                </AlertDialogTrigger>

                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        Confirmer la suppression
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Êtes-vous sûr de vouloir supprimer ce cours ? Cette action est irréversible.
                                    </AlertDialogDescription>
                                    </AlertDialogHeader>

                                    <AlertDialogFooter>
                                    <AlertDialogCancel>Annuler</AlertDialogCancel>

                                    <AlertDialogAction
                                        onClick={() => handleDeleteCours(cours._id)}
                                        className="bg-red-600 hover:bg-red-700"
                                    >
                                        Oui, supprimer
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

        </Card>
    ) : (
        <div className="mt-10 flex flex-col items-center">
        <img src={no_data} className="w-72" />
        <p className="mt-4 text-gray-500">Aucun cours</p>
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
)
}

export default ProfCours
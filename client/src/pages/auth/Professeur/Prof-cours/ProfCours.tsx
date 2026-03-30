import Pagination from "@/components/Pagination/Pagination"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import axios from "axios"
import { Book, Calendar, GraduationCap, Plus } from "lucide-react"
import { useEffect, useState } from "react"
import no_data from '@/assets/images/cours/No data-cuate.png'
import AddCoursModal from "@/components/Cours/Prof/AddCoursModal"
import { useProfProtectedRoutes } from "@/store/userStore"
import type { CoursType, Matiere } from "../../Cours/types/CoursType"



const ProfCours = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const {data} = useProfProtectedRoutes();
    const [open,setOpen] = useState(false);
    const [Cours,SetCours] = useState<CoursType[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
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

    useEffect(()=>{
        const getMatiere = async()=>{
            const res = await axios.get(`${apiUrl}/prof/fetch-matiere`,{withCredentials:true})
            setMatiere(res.data)
        }
        getMatiere()
    },[])


    const bgItems = {
        "Cours": "bg-green-900 text-green-100",
        "Exercice": "bg-cyan-900 text-cyan-100",
        "Examen": "bg-teal-900 text-teal-100",
        "Examen National": "bg-sky-900 text-sky-100",
    }

    const handleDeleteCours = async(coursId:string)=>{
        await axios.delete(`${apiUrl}/prof/delete-cours/${coursId}`,{withCredentials:true})
        await getCours();
    }
return (
    <div>
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-semibold">Mes Cours</h1>
                <span className="pl-2 text-sm">{Cours.length} Document publiés</span>
            </div>
            <div>
                <Button
                    variant={'outline'}
                    className="cursor-pointer"
                    onClick={() => {
                        setSelectedCours(null)
                        setOpen(true);
                    }}
                >
                    <Plus/> Ajouter un document
                </Button>
            </div>
        </div>
        {Cours.length > 0 ?
            <Card className="mt-6 p-4">
                {totalCours > limit && (
                    <div className="mt-6">
                        <Pagination
                        totalItems={totalCours}
                        itemsPerPage={limit}
                        currentPage={currentPage}
                        onPageChange={setCurrentPage}
                        />
                    </div>
                )}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Cours.map((cours) => (
                    <div
                        key={cours._id}
                        className="rounded-2xl border p-4 shadow-sm transition duration-300 hover:shadow-md"
                    >
                        <div className="flex items-center justify-between">
                            {/* Title */}
                            <h2 className="line-clamp-1 text-lg font-semibold">
                                {cours.title}
                            </h2>
                            <p className={`inline-flex w-fit items-center gap-1 rounded-md px-2 py-1 text-xs font-medium ${bgItems[cours.type as keyof typeof bgItems]}`}>
                                <Book size={16} strokeWidth={2.5} />
                                {cours.type}
                            </p>
                        </div>
                        {/* Matiere */}
                        <p className="mt-1 text-sm text-gray-500">
                        {cours.matiere?.nom}
                        </p>

                        {/* Infos */}
                        <div className="mt-3 space-y-2 text-sm">
                            <p className="flex items-center gap-1 text-gray-600">
                                <Calendar size={16} strokeWidth={2.5} />
                                {cours.semestre}
                            </p>
                            <p className="flex items-center gap-1 text-gray-600">
                                <GraduationCap size={16} strokeWidth={2.5} />
                                {cours.filière}
                            </p>
                        </div>
                        {/* Date */}
                        <p className="mt-3 text-xs text-gray-400">
                        {new Date(cours.createdAt).toLocaleDateString()}
                        </p>

                        {/* Actions */}
                        <div className="mt-4 flex items-center justify-between">
                            <a
                                href={`${apiUrl}/uploads/files/${data?.id}/${cours.pdfUrl}`}
                                target="_blank"
                                className="text-sm text-blue-500 hover:underline"
                            >
                                Voir PDF
                            </a>
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="cursor-pointer"
                                    onClick={() => {
                                        setOpen(!open)
                                        setSelectedCours(cours)
                                    }}
                                >
                                    Modifier
                                </Button>
                                <Button
                                    size="sm"
                                    variant="destructive"
                                    className="cursor-pointer"
                                    onClick={()=>handleDeleteCours(cours._id)}
                                >
                                    Supprimer
                                </Button>
                            </div>
                        </div>
                    </div>
                    ))}
                </div>
                {totalCours > limit && (
                    <div className="mt-6">
                        <Pagination
                        totalItems={totalCours}
                        itemsPerPage={limit}
                        currentPage={currentPage}
                        onPageChange={setCurrentPage}
                        />
                    </div>
                )}
            </Card>
        :
            <div className="mt-10 flex flex-col items-center justify-center">
                <img src={no_data} alt="no_data" className="w-72" />
                <p className="mt-4 text-gray-500">Aucun cours pour le moment</p>
            </div>
        }
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
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useEffect, useState } from "react"
import type { Matiere, TypeProfVideos } from "../../Video/types/video.type";
import axios from "axios";
import { Eye, Heart, MessageCircle, MoreHorizontalIcon, Pen, Plus, Search, Trash } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipTrigger,TooltipContent } from "@/components/ui/tooltip";
import toast from "react-hot-toast";
import AddVideosModal from "@/components/Videos/Prof/AddVideosModal";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import Pagination from "@/components/Pagination/Pagination";
import {useSearchParams } from "react-router-dom";
import { useDebounce } from "@/hooks/use-debounce";
import { Input } from "@/components/ui/input";

const ProfVideos = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const [searchParams, setSearchParams] = useSearchParams();
    const [videos,setVideos] = useState<TypeProfVideos[]>([]);
    const [open,setOpen] = useState(false)
    const [matiere, setMatiere] = useState<Matiere[]>([])
    const [selectedVideos, setSelectedVideos] = useState<TypeProfVideos | null>(null);
    const [currentPage, setCurrentPage] = useState(() => {
        return Number(searchParams.get("page")) || 1;
    });
    const [totalVideos, setTotalVideos] = useState(0);
    const limit = 6;
    const [search, setSearch] = useState(() => {
        return searchParams.get("search") || ""
    })
    const debouncedSearch = useDebounce(search, 500);

    const getVideos = async()=>{
        const res = await axios.get(`${apiUrl}/prof/get-videos?page=${currentPage}&limit=${limit}&search=${debouncedSearch}`,{withCredentials:true});
        setVideos(res.data.videos)
        setTotalVideos(res.data.total || 0);
    }

    useEffect(()=>{
        const getMatiere = async()=>{
            const res = await axios.get(`${apiUrl}/prof/fetch-matiere`,{withCredentials:true})
            setMatiere(res.data)
        }
        getMatiere()
    },[])

    useEffect(()=>{
        getVideos()
    },[currentPage,debouncedSearch])

    


    useEffect(() => {
        const params = new URLSearchParams(searchParams)

        if (currentPage > 1) {
            params.set("page", currentPage.toString())
        } else {
            params.delete("page")
        }

        if (debouncedSearch.trim() !== "") {
            params.set("search", debouncedSearch.trim())
        } else {
            params.delete("search")
        }

        setSearchParams(params)
    }, [currentPage, debouncedSearch]);

    useEffect(() => {
        const q = searchParams.get("search") || ""
        if (q !== search) {
            setSearch(q)
        }
    }, [searchParams])

    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearch]);

    const options:Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "long",
        day: "numeric",
    };

    useEffect(() => {
        if (!open) {
            setSelectedVideos(null);
        }
    }, [open]);

    const handleDelete = async(videoId:string)=>{
        const shouldGoBack = currentPage > 1 && videos.length === 1;
        const res = await axios.delete(`${apiUrl}/prof/delete-videos/${videoId}`,{withCredentials:true})
        toast.success(res.data.message)
        if (shouldGoBack) {
            setCurrentPage((prev) => Math.max(prev - 1, 1));
        } else {
            await getVideos()
        }
    }

  return (
    <>
    <div className="p-2">
        <div className="flex flex-col items-start justify-between md:flex-row md:items-start lg:flex-row lg:items-center">
            <div>
                <h1 className="text-2xl font-bold">Mes Vidéos</h1>
                <span className="pl-2 text-xs">{totalVideos} videos disponible</span>
            </div>
            <div className="relative w-full max-w-md">
                <Input
                    type="text"
                    placeholder="Rechercher une vidéo..."
                    value={search}
                    onChange={(e) => {
                    setSearch(e.target.value)
                    }}
                    className="pr-10 pl-10"
                />

                <span className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400">
                    <Search size={16} />
                </span>

                {search && (
                    <button
                    onClick={() => setSearch("")}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400"
                    >
                    ✕
                    </button>
                )}
            </div>
        </div>
    <Table>
        <TableCaption>Liste de vos vidéos publiées</TableCaption>
        <TableHeader>
            <TableRow>
                <TableHead>Vidéo</TableHead>
                <TableHead>Visibilité</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-center">Vues</TableHead>
                <TableHead className="text-center">Commentaires</TableHead>
                <TableHead className="text-center">Likes</TableHead>
                <TableHead className="text-right">Actions</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
        {videos.map((vid)=>(
        <TableRow key={vid._id} onClick={()=>window.open(`/prof/videos/play/${vid._id}`,'_blank')}>
            {/* VIDEO */}
            <TableCell className="flex max-w-[300px] items-start gap-3">
                <img src={vid.thumbnail} alt="thumbnail" className="h-12 w-16 rounded-md object-cover"/>
                <div className="flex flex-col">
                    <Tooltip>
                        <TooltipTrigger asChild>
                        <span className="line-clamp-1 max-w-[290px] truncate">
                            {vid.title}
                        </span>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{vid.title}</p>
                        </TooltipContent>
                    </Tooltip>
                    <span className="line-clamp-4 max-w-[220px] text-xs break-words text-gray-500">
                        {vid.description}
                    </span>
                </div>           
            </TableCell>

            {/* VISIBILITE */}
            <TableCell>
                <span className={`rounded-full ${vid.visibility === "Private" ? 'bg-red-100 text-red-700' : ' bg-green-100 text-green-700'} px-2 py-1 text-xs `}>
                    {vid.visibility}
                </span>
            </TableCell>

            {/* DATE */}
            <TableCell className="text-sm text-gray-500">
                {new Date(vid.createdAt).toLocaleDateString("fr-FR",options)}
            </TableCell>

            {/* VIEWS */}
            <TableCell className="text-center">
                <span className="flex items-center justify-center gap-1 text-xs">
                <Eye size={16}/> {vid.views}
                </span>
            </TableCell>

            {/* COMMENTS */}
            <TableCell className="text-center">
                <span className="flex items-center justify-center gap-1 text-xs">
                <MessageCircle size={16}/> {vid.comments.length}
                </span>
            </TableCell>

            {/* LIKES */}
            <TableCell className="text-center"> 
                <span className="flex items-center justify-center gap-1 text-xs">
                <Heart size={16}/> {vid.likes.length}
                </span>
            </TableCell>

            {/* Actions */}
            <TableCell className="text-right">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8">
                        <MoreHorizontalIcon />
                        <span className="sr-only">Open menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => {
                                setSelectedVideos(vid);
                                setOpen(true);
                            }}
                            >
                            <Pen /> Modifier
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <DropdownMenuItem
                                className="cursor-pointer text-red-600 focus:text-red-600"
                                onSelect={(e) => e.preventDefault()}
                                >
                                <Trash /> Supprimer
                                </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>
                                    Confirmer la suppression
                                </AlertDialogTitle>

                                <AlertDialogDescription>
                                    Voulez-vous vraiment supprimer cette vidéo ?
                                    <span className="font-semibold"> {vid.title} </span>
                                </AlertDialogDescription>
                                </AlertDialogHeader>

                                <AlertDialogFooter>
                                <AlertDialogCancel className="cursor-pointer">Annuler</AlertDialogCancel>

                                <AlertDialogAction
                                    onClick={() => handleDelete(vid._id)}
                                    className="cursor-pointer bg-red-600 text-white hover:bg-red-700"
                                >
                                    Oui, supprimer
                                </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </DropdownMenuContent>
                </DropdownMenu>
            </TableCell>
        </TableRow>
        ))}
        </TableBody>
    </Table>
    {totalVideos > limit && (
      <div className="mt-4">
        <Pagination
          totalItems={totalVideos}
          itemsPerPage={limit}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>
    )}
    <Tooltip>
        <div className="group fixed right-6 bottom-6">
            <TooltipTrigger asChild onClick={()=>setOpen(!open)} className="cursor-pointer">
                <Button className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-500 shadow-lg hover:bg-amber-600">
                    <Plus />
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                Ajouter une vidéo
            </TooltipContent>
        </div>
    </Tooltip>
    </div>

    <AddVideosModal 
        open={open} 
        setOpen={setOpen}
        matiere={matiere}
        onSuccess={getVideos}
        videos={selectedVideos}
    />

    </>

)}

export default ProfVideos
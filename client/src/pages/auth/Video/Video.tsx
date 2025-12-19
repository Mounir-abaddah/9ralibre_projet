import axios from "axios";
import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom";
import type { TypeVideos } from "./types/video.type";
import { EllipsisVertical, Flag, Play, Share } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import No_Data from '@/assets/images/cours/No data-cuate.png';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
const Videos = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();
    const {niveaux} = useParams();
    const [videos,setVideos] = useState<TypeVideos[]>([]);
    useEffect(()=>{
        const getVideos = async()=>{
            const res = await axios.get(`${apiUrl}/videos/get-all-videos/${niveaux}`,{withCredentials:true});
            setVideos(res.data.videos)       
        }
        getVideos();
    },[apiUrl, niveaux]);
return (
    <>
    {videos.length > 0 ?
        <div className="flex flex-col gap-2">
            {/**Search**/}
            <div className="flex flex-col gap-2">
                <Label htmlFor="search" className="text-2xl font-bold">Chercher votre Videos :</Label>
                <Input 
                    id="search"  
                    type="text"  
                    placeholder="Chercher votre videos"  
                    className="w-full"
                />
            </div>
            {/**DATA VIDEOS**/}
            <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {videos.map((item)=>(
                    <div key={item._id} className="w-full rounded-md bg-amber-400 p-2">
                        <div className="flex w-full flex-col space-y-2 rounded-md bg-gray-200 p-2">
                            {/*** IMAGE (THUMBNAIL) ***/}
                            <div className="group relative aspect-video w-full cursor-pointer overflow-hidden rounded-md" onClick={()=>navigate(`/Videos/${niveaux}/${item._id}`)}>
                                <img src={item.thumbnail} alt="image_thumbnail" width={200} className="size-full object-cover transition-transform duration-300 group-hover:scale-105"/>
                                <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-300 group-hover:bg-black/30">
                                    <div className="scale-90 opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
                                        <div className="rounded-full bg-amber-400 p-3 shadow-lg">
                                            <Play size={30} color="#000" fill="#000" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/*** BADGE DES FILIERE ET MATIERE ***/}
                            <div className="flex gap-2">
                                <Badge variant={'destructive'}>{item.filiere}</Badge>
                                <Badge className="bg-teal-400 text-white">{item.matiere.nom}</Badge>
                            </div>
                            {/*** PROFESSEUR ET BADGE , VIEWS ET DROPDOWN ***/}
                            <div className="flex w-full items-start justify-between">
                                <div className="flex items-start gap-2">
                                    <Link to={`/professeur/${item.professeur.nom}-${item.professeur.prenom}`}><img src={item.professeur.image} alt="professeur_image" width={30} className="rounded-full"/></Link>
                                    <div>
                                        <h3 className="text-xl font-medium text-gray-700">{item.title}</h3>
                                        <h3 className="text-sm font-bold text-gray-500">{item.professeur.nom} {item.professeur.prenom}</h3>
                                        <h3 className="text-xs font-bold text-gray-500">{item.views} vues . {formatDistanceToNow(new Date(item.createdAt),{addSuffix:true,locale:fr})}</h3>
                                    </div>
                                </div>
                                <div>
                                    <DropdownMenu>
                                    <DropdownMenuTrigger asChild className="cursor-pointer">
                                        <EllipsisVertical color="#000" size={16}/>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-56" align="start">
                                        <DropdownMenuGroup>
                                        <DropdownMenuItem className="cursor-pointer">
                                            <Share />Partager
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="cursor-pointer">
                                            <Flag />Signaler
                                        </DropdownMenuItem>
                                        </DropdownMenuGroup>
                                    </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div> 
        </div>
        :
        /**NO DATA VIDEOS**/
        <div className="flex w-full flex-col items-center justify-center">
            <img src={No_Data} alt="no_Data" width={400}/>
            <p>Aucune videos est disponible maintenant</p>
        </div>
    }
    </>
)
}

export default Videos
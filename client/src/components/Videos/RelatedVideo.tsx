import type { TypeVideos } from '@/pages/auth/Video/types/video.type'
import { EllipsisVertical, Flag, Play, Share } from 'lucide-react';
import { useEffect, useState } from 'react'
import { Badge } from '../ui/badge';
import {useNavigate, useParams } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { fr } from 'date-fns/locale';
import axios from 'axios';

const RelatedVideo = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();
    const {niveaux,videoId} = useParams();
    const [videos,setVideos] = useState<TypeVideos[]>([]);

    useEffect(()=>{
        const getVideos = async()=>{
            const res = await axios.get(`${apiUrl}/videos/related/${videoId}`,{withCredentials:true});
            setVideos(res.data.videos)       
        }
        getVideos();
    },[apiUrl, niveaux, videoId]);

    const bgItems = {
        "Mathématiques":"bg-red-400",
        "Physique et Chimie":"bg-cyan-400",
        "SVT":"bg-teal-400",
        "Informatique":"bg-sky-400",
        "Arabe":"bg-orange-400",
        "Français":"bg-orange-400",
        "Anglais":"bg-orange-400",
        "Histoire Géographie":"bg-amber-400",
        "Éducation Islamique":"bg-blue-400",
    }

  return (
    <div className='w-full space-y-4'>
        <h2 className='w-full border-b text-2xl font-bold'>Related Videos</h2>
        {videos.map((video)=>(
            <div key={video._id} className='flex w-full cursor-pointer' onClick={()=>{navigate(`/Videos/${niveaux}/${video._id}`);window.location.reload()}}>
                <div className='flex w-full gap-2'>
                    <div className="group relative h-[90px] w-[160px] flex-shrink-0 cursor-pointer overflow-hidden rounded-md md:h-[100px] md:w-[180px]">
                        {/*** IMAGE (THUMBNAIL) ***/}
                            <img src={video.thumbnail} alt="image_thumbnail" width={200} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"/>
                            <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-300 group-hover:bg-black/30">
                                <div className="scale-90 opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
                                    <div className="rounded-full bg-amber-400 p-3 shadow-lg">
                                        <Play size={30} color="#000" fill="#000" />
                                    </div>
                                </div>
                            </div>
                    </div>
                    <div>
                        <div>
                            <span className='text-sm'>{video.title}</span>
                        </div>
                        <div className="flex gap-2">
                            <Badge variant="destructive" className='text-[10px]'>{video.filiere}</Badge>
                            <Badge className={`${bgItems[video.matiere.nom as keyof typeof bgItems]} text-[10px] text-white`}>
                                {video.matiere.nom}
                            </Badge>
                        </div>
                        <div>
                            <span className='text-sm text-gray-400'>{video.professeur.nom} {video.professeur.prenom}</span>
                            <span><h3 className="text-xs font-bold text-gray-500">{video.views} vues . {formatDistanceToNow(new Date(video.createdAt),{addSuffix:true,locale:fr})}</h3></span>
                        </div>
                    </div>
                </div>
                <div>
                    <DropdownMenu>
                    <DropdownMenuTrigger asChild className="cursor-pointer">
                        <EllipsisVertical  size={16}/>
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
        ))}
    </div>
  )
}

export default RelatedVideo
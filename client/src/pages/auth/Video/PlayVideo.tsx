import { useParams } from "react-router-dom"
import ReactPlayer from 'react-player';
import { useEffect, useState } from "react";
import type { TypeVideos } from "./types/video.type";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Bookmark, EllipsisVertical, Flag, Heart, Share } from "lucide-react";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { fr } from "date-fns/locale";
import Comments from "@/components/Videos/Comments";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import RelatedVideo from "@/components/Videos/RelatedVideo";
import ReportModal from "@/components/Videos/ReportModal";

const PlayVideo = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const {videoId} = useParams<{videoId: string}>();
    const [videos,setVideos]=useState<TypeVideos | null>(null);
    const [isLike,setisLike]= useState(false);
    const [isSaved,setIsSaved] = useState(false);
    const [likeProfesseur,setLikeProfesseur]=useState(false)
    const [openReportVideo, setOpenReportVideo] = useState(false);

    const getVideos = async()=>{
        const res = await axios.get(`${apiUrl}/videos/get-videos-id/${videoId}`,{withCredentials:true});
        setVideos(res.data.videos)        
        setisLike(res.data.isLikes)
        setIsSaved(res.data.isSaved)
        setLikeProfesseur(res.data.isFollowProfesseur)
    };
    
    useEffect(()=>{
        getVideos();
    },[]);

    const handleLikes = async()=>{
        const res = await axios.post(`${apiUrl}/videos/post-videos-like/${videoId}`,{},{withCredentials:true});
        setisLike(res.data.isLikes)
        await getVideos();
    }

    const handleView = async(videoId:string)=>{
        await axios.post(`${apiUrl}/videos/post-videos-view/${videoId}`,{},{withCredentials:true})
        await getVideos();
    }

    const handleFollowProfesseur = async(profId:string)=>{
        const res = await axios.post(`${apiUrl}/user/follow/${profId}`,{},{withCredentials:true});
        setLikeProfesseur(res.data.following)
        await getVideos();
    }

    const handleSave = async()=>{
        const res = await axios.post(`${apiUrl}/videos/post-videos-save/${videoId}`,{},{withCredentials:true});
        setIsSaved(res.data.isSaved)
        await getVideos();
    }
    
    if(!videos) return <div>Chargement ....</div>
    document.title = `Videos - ${videos?.title} | 9ralibre`
return (
    <div className="flex w-full flex-col gap-6 p-4 lg:flex-row">
        <div className="flex w-full flex-col space-y-4">
            {/*****VIDEOURL REACT PLAYER*****/}
            <div>
                <ReactPlayer 
                    src={videos.videoUrl} 
                    controls
                    width={'100%'}
                    height={400}
                    className="rounded-md"
                    onPlay={()=>handleView(videos._id)}
                />
            </div>
            {/*****TITRE *****/}
            <div>
                <h1 className="text-2xl font-bold">{videos.title}</h1>
            </div>
            {/*****Professeur(Follow,Followers) , LIKES ET SHARE ET SAVE *****/}
            <div className="flex w-full flex-wrap justify-between space-y-4 md:space-y-0 lg:space-y-0">
                {/*****Professeur(Follow,Followers) *****/}
                <div className="flex gap-2">
                    <img src={videos.professeur?.image} loading='lazy' alt="image_de_professeur" width={40} className="rounded-full"/>
                    <div className="flex flex-col items-start">
                        <span>{videos.professeur.nom} {videos.professeur.prenom}</span>
                        <span className="text-xs text-gray-400">{videos.professeur.followers.length}  d’abonnés</span>
                    </div>
                    <div>
                        <Button onClick={()=>handleFollowProfesseur(videos.professeur._id)} className="cursor-pointer bg-amber-500 hover:bg-amber-600">{likeProfesseur ? 'Déjà abonné(e)' : 'S’abonner'}</Button>
                    </div>
                </div>
                {/*****LIKES ET SHARE ET SAVE *****/}
                <div className="flex gap-2">
                    <Button variant={'outline'} className={`flex cursor-pointer items-center gap-1 rounded-md  text-xs transition-all duration-200 hover:bg-gray-100 active:scale-95 ${isLike ? 'text-red-500' : ''}`} onClick={handleLikes}><Heart color={isLike ? '#FF2E2E' : '#000'} fill={isLike ? '#FF2E2E' : '#fff'}/>{videos.likes.length}</Button>
                    <Button variant={'outline'} className="hidden cursor-pointer md:flex lg:flex"><Share />Partager</Button>
                    <Button variant="outline" className={`hidden cursor-pointer items-center gap-1 transition-all duration-200 md:flex lg:flex ${isSaved ? 'bg-amber-50 text-amber-500' : ''}`} onClick={handleSave}><Bookmark color={isSaved ? '#FF9500' : '#000'} fill={isSaved ? '#FF9500' : '#fff'} />{isSaved ? 'Enregistré' : 'Enregistrer'} </Button>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="cursor-pointer"><EllipsisVertical /></Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-42 space-y-2">
                            <Button variant="outline" className="flex w-full cursor-pointer md:hidden lg:hidden"><Share />Partager</Button>
                            <Button variant="outline" className={`flex w-full cursor-pointer items-center gap-1 transition-all duration-200 md:hidden lg:hidden ${isSaved ? 'bg-amber-50 text-amber-500' : ''}`} onClick={handleSave}><Bookmark color={isSaved ? '#FF9500' : '#000'} fill={isSaved ? '#FF9500' : '#fff'} />{isSaved ? 'Enregistré' : 'Enregistrer'}</Button>
                            <Button variant="outline" className="w-full cursor-pointer" onClick={() => setOpenReportVideo(true)}><Flag />Signaler</Button>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
            {/***** Description et Vue *****/}
            <div className="rounded-md border p-2">
                <span>{videos.views} vue . {formatDistanceToNow(new Date(videos.createdAt),{addSuffix:true,locale:fr})}</span>
                <p className="text-gray-400">{videos.description}</p>
            </div>
            {/***** COMMENTAIRES ET REPLY *****/}
            <Comments videos={videos} getVideos={getVideos}/>
        </div>
        {/******************RELATED VIDEOS******************/}
        <div className="w-full md:w-full lg:w-[40%]">
            <RelatedVideo />
        </div>
        <ReportModal
            open={openReportVideo}
            onOpenChange={setOpenReportVideo}
            endpoint={`${apiUrl}/videos/report/${videos._id}`}
            title="Signaler cette vidéo"
        />
    </div>
)
}

export default PlayVideo
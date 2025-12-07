import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { Commentaire, VideoType } from "./Video";
import {
  Book,
  Bookmark,
  Calendar,
  EllipsisVertical,
  Eye,
  Flag,
  Heart,
  MessageCircle,
  Play,
  Plus,
  Send,
  Share2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { useProtectedRoutes } from "@/store/userStore";
import ReactPlayer from "react-player";
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { EmojiPicker, EmojiPickerContent, EmojiPickerSearch } from "@/components/ui/emoji-picker";

interface DropdownMenuItemCommentsProps {
  item: Commentaire;
}


const PlayVideo = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate()
  const { videoId } = useParams();
  const [videos, setVideos] = useState<VideoType | null>(null);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [comments, setComments] = useState("");
  const { data } = useProtectedRoutes();
  const [playing, setPlaying] = useState(false);
  const [follow,setFollow]=useState(false);
  const [followCount,setFollowCount]=useState(0);
  const [showEmojie,setShowEmojie]=useState(false);
  const emojieRef = useRef<HTMLDivElement>(null);

  const getVideoId = async () => {
    const res = await axios.get(`${apiUrl}/videos/${videoId}`, {withCredentials: true});
    setVideos(res.data.videos);
    console.log(res.data.videos);
    setLiked(res.data.liked);
    setLikesCount(res.data.likesCount);
    setFollow(res.data.isFollowed);
    setFollowCount(res.data.FollowCount)
    console.log(res.data.isFollowed);
    console.log(res.data.FollowCount);
  };

  useEffect(()=>{
    const handleOutside = (event:MouseEvent)=>{
      if(emojieRef.current && !emojieRef.current.contains(event.target as Node)){
        setShowEmojie(false);
      }
    };
    document.addEventListener("mousedown",handleOutside);
    return ()=>document.removeEventListener("mousedown",handleOutside)
  })

  useEffect(() => {
    getVideoId();
  }, [videoId]);

  const handleLikes = async () => {
    const res = await axios.post(`${apiUrl}/videos/likes/${videoId}`,{},{ withCredentials: true });
    setLiked(res.data.liked);
    setLikesCount(res.data.likesCount);
  };

  const handleComments = async () => {
    await axios.post(`${apiUrl}/videos/comments/${videoId}`,{ text: comments },{ withCredentials: true });
    setComments("");
    await getVideoId();
  };

  const handleView = async()=>{
    await axios.post(`${apiUrl}/videos/views/${videoId}`,{},{withCredentials:true})
  }

  const handleFollow = async(profId:string)=>{
    await axios.post(`${apiUrl}/user/follow/${profId}`,{},{withCredentials:true})
    await getVideoId();
  }

  if (!videos) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Chargement ....
      </div>
    );
  }

  return (
    <div className="flex w-full justify-center bg-gray-50 py-10 dark:bg-gray-900">
      <div className="w-full max-w-4xl space-y-10">
        {/* ========= VIDEO PLAYER ========= */}
        <div className="space-y-5 rounded-xl border bg-white p-5 shadow-md dark:border-gray-700 dark:bg-gray-800">
          <div className="relative w-full overflow-hidden rounded-xl border shadow-lg dark:border-gray-700">
            {!playing && (
              <div
                onClick={() => setPlaying(true)}
                className="absolute inset-0 z-20 flex cursor-pointer items-center justify-center bg-black/40 backdrop-blur-sm transition hover:bg-black/50"
              >
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-600 shadow-xl transition hover:bg-amber-700">
                  <Play />
                </div>
              </div>
            )}
            {/* Player */}
            <ReactPlayer
              src={videos.videoUrl}
              playing={playing}
              controls={true}
              width="100%"
              onStart={handleView}
              height="100%"
              className="rounded-xl"
            />
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            <Badge className="flex items-center gap-1 bg-cyan-600 text-white dark:bg-cyan-500">
              <Book size={14} /> {videos.matiere.nom}
            </Badge>

            <Badge variant="outline" className="dark:text-gray-300">
              {videos.filière}
            </Badge>

            <Badge
              variant="outline"
              className="flex items-center gap-1 dark:text-gray-300"
            >
              <Book size={14} /> {videos.niveaux.nom}
            </Badge>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {videos.title}
          </h1>

          {/* Description */}
          <p className="leading-relaxed text-gray-700 dark:text-gray-300">
            {videos.description}
          </p>

          {/* Stats & Actions */}
          <div className="flex items-center justify-between pt-2">
            {/* Stats */}
            <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <Eye size={16} /> {videos.views}
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={16} />
                {new Date(videos.createdAt).toLocaleDateString("fr-FR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                onClick={handleLikes}
                variant="outline"
                className="flex cursor-pointer items-center gap-1 dark:border-gray-600"
              >
                <Heart
                  size={18}
                  color={liked ? "#FF2E2E" : "gray"}
                  fill={liked ? "#FF2E2E" : "none"}
                />
                {likesCount}
              </Button>

              <Button
                variant="outline"
                className="flex items-center gap-1 dark:border-gray-600"
              >
                <Bookmark size={18} /> Enregistrer
              </Button>

              <Button variant="default" className="flex items-center gap-1">
                <Share2 size={18} /> Partager
              </Button>
            </div>
          </div>
        </div>

        <Separator />

        {/* ========= PROFESSEUR CARD ========= */}
        <div className="flex items-center justify-between rounded-xl border bg-white p-5 shadow-md dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={videos.professeur.image} />
              <AvatarFallback>
                {videos.professeur.nom[0]}
                {videos.professeur.prenom[0]}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col">
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                {videos.professeur.nom} {videos.professeur.prenom}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Professeur . {followCount} abonnés
              </span>
            </div>
          </div>

          <Button onClick={()=>handleFollow(videos.professeur._id)} 
            className={`cursor-pointer rounded-full px-5 ${follow ? 'bg-amber-500 hover:bg-amber-600' : ''}`}>
            {follow ? 'Suivie(e)' : 'Suivre'}
          </Button>
        </div>

        <Separator />

        {/* ========= COMMENTAIRES ========= */}
        <div className="mt-6 space-y-5">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
            <MessageCircle size={18} /> Commentaires ({videos.comments.length})
          </h2>

          {/* Add comment */}
          <div className="flex gap-3">
            <Avatar>
              <AvatarImage src={data?.image} />
              <AvatarFallback
                className={`text-xs text-white ${
                  data?.role === "Etudiant" ? "bg-sky-400" : "bg-pink-400"
                }`}
              >
                {data?.nom[0]}
                {data?.prenom[0]}
              </AvatarFallback>
            </Avatar>

            <div className="w-full space-y-2">
              <div className="relative flex">
                <Textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Ajouter un commentaire..."
                  className="min-h-20 resize-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                />
              <button type="button" onClick={() => setShowEmojie(!showEmojie)} className="absolute top-3 right-3 text-xl transition hover:scale-110" > 
                😊 
              </button>
              {showEmojie && (
                <div ref={emojieRef} className="absolute top-14 right-0 z-50">
                  <EmojiPicker className="h-[326px]" 
                  onEmojiSelect={({emoji})=>{
                    setComments((prev)=> prev+emoji)
                  }}
                  >
                    <EmojiPickerSearch />
                    <EmojiPickerContent />
                  </EmojiPicker>
                </div>
              )}
              </div>
              

              <div className="flex justify-end">
                <Button
                  onClick={handleComments}
                  className="flex items-center gap-1"
                >
                  Publier <Send size={14} />
                </Button>
              </div>
            </div>
          </div>

          {/* Comment list */}
          <div className="w-full space-y-4 rounded-xl border bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            {videos.comments.map((item, index) => (
              <div key={index} className="flex w-full gap-3 border-b pb-3 last:border-0 last:pb-0 dark:border-gray-700">
                <Avatar onClick={()=>navigate(`/in/${item.user.nom}${item.user.prenom}`)} className="cursor-pointer">
                  <AvatarImage src={item.user.image} alt="image_users"/>
                  <AvatarFallback className={`text-xs font-bold text-white ${item.user.role === "Etudiant" ? "bg-sky-400": "bg-pink-400"}`}>
                    {item.user.nom[0]}{item.user.prenom[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex w-full flex-col">
                  <Link to={`/in/${item.user.nom}${item.user.prenom}`} className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {item.user.nom} {item.user.prenom} . <span className={`text-xs font-bold text-white ${item.user.role === "Etudiant" ? "bg-sky-400": "bg-pink-400"} rounded-md p-0.5`}>{item.user.role}</span>
                  </Link>
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {item.text}
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="cursor-pointer p-0.5 text-xs text-gray-400 transition duration-200 hover:bg-gray-500">J'aime</span>
                    <Separator  orientation="vertical" className="data-[orientation=vertical]:h-3"/>
                    <span className="p-0.5 text-xs text-gray-400 transition duration-200 hover:bg-gray-500">Repondre</span>
                  </span>
                </div>
                <div className="flex w-full justify-end gap-2">
                  <span className="text-xs text-gray-400">{formatDistanceToNow(new Date(item.createdAt),{addSuffix:true,locale:fr})}</span>
                  <DropdownMenuItemComments item={item}/>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayVideo;



export const DropdownMenuItemComments = ({item}:DropdownMenuItemCommentsProps)=>{
  return(
   <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline"><EllipsisVertical size={20} /></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuGroup>
          <DropdownMenuItem className="cursor-pointer">
            <Flag />Signaler
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <Plus /> Suivre {item.user.nom} {item.user.prenom}
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
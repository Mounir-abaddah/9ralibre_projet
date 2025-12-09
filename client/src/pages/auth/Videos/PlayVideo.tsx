import axios from "axios";
import { useEffect, useState } from "react";
import {useParams } from "react-router-dom";
import type {VideoType } from "./Video";
import {
  Book,
  Bookmark,
  Calendar,
  Eye,
  Heart,
  Play,
  Share2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useProtectedRoutes } from "@/store/userStore";
import ReactPlayer from "react-player";
import ProfesseurCard from "@/components/Video/ProfesseurCard";
import Commentaires from "@/components/Video/Commentaires";

const PlayVideo = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { videoId } = useParams();
  const [videos, setVideos] = useState<VideoType | null>(null);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [comments, setComments] = useState("");
  const { data } = useProtectedRoutes();
  const [playing, setPlaying] = useState(false);
  const [follow,setFollow]=useState(false);
  const [followCount,setFollowCount]=useState(0);
  const [showtextReply,setShowTextReply]=useState<string | null >(null);
  const [showReply,setShowReply]=useState<string | null>(null);
  const [reply,setReply]=useState("");


  const getVideoId = async () => {
    const res = await axios.get(`${apiUrl}/videos/${videoId}`, {withCredentials: true});
    setVideos(res.data.videos);
    console.log(res.data.videos);
    setLiked(res.data.liked);
    setLikesCount(res.data.likesCount);
    setFollow(res.data.isFollowed);
    setFollowCount(res.data.FollowCount)
  };


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
  };

  const handleReply = async(commentsId:string)=>{
    await axios.post(`${apiUrl}/videos/${videoId}/comments/${commentsId}/reply`,{text:reply},{withCredentials:true})
    await getVideoId()
    setShowTextReply(null)
    setShowReply(commentsId)
  }


  if (!videos) {
    return (<div className="flex min-h-screen items-center justify-center"> Chargement ....</div>);
  }

  return (
    <div className="flex w-full justify-center bg-gray-50 py-10 dark:bg-gray-900">
      <div className="w-full max-w-4xl space-y-10">
        {/* ========= VIDEO PLAYER ========= */}
        <div className="space-y-5 rounded-xl border bg-white p-5 shadow-md dark:border-gray-700 dark:bg-gray-800">
          <div className="relative w-full overflow-hidden rounded-xl border shadow-lg dark:border-gray-700">
            {!playing && (
              <div onClick={() => setPlaying(true)}
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
            <Badge variant="outline" className="flex items-center gap-1 dark:text-gray-300">
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
              <Button onClick={handleLikes} variant="outline" className="flex cursor-pointer items-center gap-1 dark:border-gray-600">
                <Heart size={18} color={liked ? "#FF2E2E" : "gray"} fill={liked ? "#FF2E2E" : "none"}/>
                {likesCount}
              </Button>
              <Button variant="outline" className="flex items-center gap-1 dark:border-gray-600">
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
          <ProfesseurCard 
            videos={videos} 
            followCount={followCount} 
            follow={follow}
            handleFollow={handleFollow} 
          />
        <Separator />
        {/* ========= COMMENTAIRES ========= */}
          <div className="mt-6 space-y-5">
            <Commentaires 
              data={data} 
              videos={videos} 
              comments={comments} 
              setComments={setComments} 
              handleComments={handleComments}
              showtextReply={showtextReply}
              setShowTextReply={setShowTextReply}
              showReply={showReply}
              setShowReply={setShowReply}
              reply={reply}
              setReply={setReply}
              handleReply={handleReply}
            />
          </div>
      </div>
    </div>
  );
};

export default PlayVideo;
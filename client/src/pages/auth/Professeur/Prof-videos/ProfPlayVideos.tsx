import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ReactPlayer from "react-player";
import type { TypeProfVideos } from "../../Video/types/video.type";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Eye,
  Heart,
  Loader2,
  MessageCircle,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { fr } from "date-fns/locale";


const ProfPlayVideos = () => {
  const { videoId } = useParams<{ videoId: string }>();
  const apiUrl = import.meta.env.VITE_API_URL;
  const [videos, setVideos] = useState<TypeProfVideos | null>(null);
  const [likesCount, setLikesCount] = useState(0);
  const [viewsCount, setViewsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getVideosById = async () => {
    if (!videoId) {
      setError("Video introuvable.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const res = await axios.get(
        `${apiUrl}/prof/get-videos-id/${videoId}`,
        { withCredentials: true },
      );
      setVideos(res.data.videos);
      setLikesCount(res.data.likesCount);
      setViewsCount(res.data.viewsCount);
    } catch {
      setError("Impossible de charger cette video pour le moment.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getVideosById();
  }, [videoId]);

  useEffect(() => {
    if (!videos) return;
    document.title = `Prof Videos - ${videos.title} | 9ralibre`;
  }, [videos]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center gap-3 text-zinc-500">
        <Loader2 className="h-6 w-6 animate-spin text-amber-600" />
        <p>Chargement de la video...</p>
      </div>
    );
  }

  if (error || !videos) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-xl flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-zinc-600 dark:text-zinc-400">
          {error || "Video introuvable."}
        </p>
        <Button asChild variant="outline">
          <Link to="/prof/videos">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour aux videos
          </Link>
        </Button>
      </div>
    );
  }


  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 p-4">
      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <div className="relative aspect-video w-full bg-black">
          <ReactPlayer
            src={videos.videoUrl}
            controls
            width="100%"
            height="100%"
            className="absolute top-0 left-0"
          />
        </div>

        <div className="space-y-5 p-5 lg:p-6">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              {videos.title}
            </h1>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              {formatDistanceToNow(new Date(videos.createdAt), {
                addSuffix: true,
                locale: fr,
              })}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
              Niveau: {videos.niveaux?.nom || "-"}
            </span>
            <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
              Matiere: {videos.matiere.nom || "-"}
            </span>
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                videos.visibility === "Private"
                  ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                  : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
              }`}
            >
              Visibilite: {videos.visibility}
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-zinc-200 p-3 dark:border-zinc-800">
              <span className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                <Eye className="h-4 w-4" /> Vues
              </span>
              <p className="mt-1 text-xl font-semibold">{viewsCount}</p>
            </div>
            <div className="rounded-xl border border-zinc-200 p-3 dark:border-zinc-800">
              <span className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                <Heart className="h-4 w-4" /> Likes
              </span>
              <p className="mt-1 text-xl font-semibold">{likesCount}</p>
            </div>
            <div className="rounded-xl border border-zinc-200 p-3 dark:border-zinc-800">
              <span className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                <MessageCircle className="h-4 w-4" /> Commentaires
              </span>
              <p className="mt-1 text-xl font-semibold">{videos.comments.length}</p>
            </div>
          </div>

          <div className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Description
            </p>
            <p className="mt-2 text-sm leading-relaxed whitespace-pre-wrap text-zinc-600 dark:text-zinc-400">
              {videos.description || "Aucune description"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfPlayVideos;
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Bookmark, Play, Clock, Eye, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { fr } from "date-fns/locale";
import Pagination from "@/components/Pagination/Pagination";
import type { SavedCours, SavedVideo, SaveResponse } from "./types/SaveType";

type TabType = "videos" | "cours";

const Save = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const {niveaux} = useParams();
  const [activeTab, setActiveTab] = useState<TabType>("videos");
  const [savedVideos, setSavedVideos] = useState<SavedVideo[]>([]);
  const [savedCours, setSavedCours] = useState<SavedCours[]>([]);
  const [loading, setLoading] = useState(true);
  const [videoPage, setVideoPage] = useState(1);
  const [coursPage, setCoursPage] = useState(1);
  const [totalSavedVideos, setTotalSavedVideos] = useState(0);
  const [totalSavedCours, setTotalSavedCours] = useState(0);
  const videosPerPage = 12;
  const coursPerPage = 6;

  const getSavedVideos = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get<SaveResponse>(
        `${apiUrl}/videos/get-saved-videos?page=${videoPage}&limit=12`,
        { withCredentials: true },
      );
      setSavedVideos(res.data.savedVideos || []);
      setTotalSavedVideos(res.data.totalSaved);
    } catch (err) {
      console.error("Erreur:", err);
    } finally {
      setLoading(false);
    }
  }, [apiUrl, videoPage]);

  const getSavedCours = useCallback(async () => {
    try {
      const res = await axios.get<SaveResponse>(
        `${apiUrl}/cours/get-saved-cours?page=${coursPage}&limit=6`,
        { withCredentials: true },
      );
      setSavedCours(res.data.savedCours || []);
      setTotalSavedCours(res.data.totalSaved);
    } catch (err) {
      console.error("Erreur:", err);
    }
  }, [apiUrl, coursPage]);

  useEffect(() => {
    document.title = "Mes enregistrements | 9ralibre";
    getSavedVideos();
    getSavedCours();
  }, [getSavedVideos, getSavedCours]);

  const handleRemoveSaveVideo = async (videoId: string) => {
    try {
      await axios.post(
        `${apiUrl}/videos/post-videos-save/${videoId}`,
        {},
        { withCredentials: true },
      );
      setSavedVideos(savedVideos.filter((v) => v._id !== videoId));
    } catch (err) {
      console.error("Erreur:", err);
    }
  };

  const handleRemoveSaveCours = async (coursId: string) => {
    try {
      await axios.post(
        `${apiUrl}/cours/save-cours/${coursId}`,
        {},
        { withCredentials: true },
      );
      setSavedCours(savedCours.filter((c) => c._id !== coursId));
    } catch (err) {
      console.error("Erreur:", err);
    }
  };

  if (loading && activeTab === "videos") {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <Bookmark className="mx-auto mb-4 h-12 w-12 animate-pulse text-amber-500" />
          <p className="text-lg text-gray-600">
            Chargement de vos enregistrements...
          </p>
        </div>
      </div>
    );
  }

  const hasContent = savedVideos.length > 0 || savedCours.length > 0;

  return (
    <div className="min-h-screen  p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-12">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-full bg-amber-500 p-3">
              <Bookmark className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-300">
              Mes enregistrements
            </h1>
          </div>
          <p className="text-lg text-gray-600">
            {!hasContent
              ? "Aucun contenu enregistré pour le moment"
              : `Vous avez ${savedVideos.length} vidéo(s) et ${savedCours.length} cours enregistrés`}
          </p>
        </div>

        {/* Tabs */}
        {hasContent && (
          <div className="mb-8 flex gap-4 border-b border-gray-200">
            <button
              onClick={() => setActiveTab("videos")}
              className={`flex items-center gap-2 px-4 py-3 font-semibold transition-all ${
                activeTab === "videos"
                  ? "border-b-2 border-amber-500 text-amber-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Play className="h-4 w-4" />
              Vidéos ({savedVideos.length})
            </button>
            <button
              onClick={() => setActiveTab("cours")}
              className={`flex items-center gap-2 px-4 py-3 font-semibold transition-all ${
                activeTab === "cours"
                  ? "border-b-2 border-amber-500 text-amber-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <BookOpen className="h-4 w-4" />
              Cours ({savedCours.length})
            </button>
          </div>
        )}

        {/* Videos Section */}
        {activeTab === "videos" && (
          <>
            {savedVideos.length > 0 ? (
              <>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {savedVideos.map((video) => (
                    <div
                      key={video._id}
                      className="group overflow-hidden rounded-xl  shadow-md transition-all duration-300 hover:shadow-xl"
                    >
                      {/* Thumbnail */}
                      <Link to={`/watch/${video._id}`}>
                        <div className="relative overflow-hidden  pt-[56.25%]">
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                          <div
                            className="absolute inset-0 flex items-center justify-center transition-all duration-300"
                            style={{ backgroundColor: "rgba(0, 0, 0, 0)" }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.backgroundColor =
                                "rgba(0, 0, 0, 0.3)")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.backgroundColor =
                                "rgba(0, 0, 0, 0)")
                            }
                          >
                            <button className="rounded-full bg-amber-500 p-3 opacity-0 transition-all duration-300 group-hover:opacity-100">
                              <Play
                                className="h-5 w-5 text-white"
                                fill="white"
                              />
                            </button>
                          </div>
                        </div>
                      </Link>

                      {/* Video Info */}
                      <div className="p-4">
                        <Link to={`/watch/${video._id}`}>
                          <h3 className="mb-2 line-clamp-2 text-sm font-semibold text-gray-900 transition-colors hover:text-amber-500">
                            {video.title}
                          </h3>
                        </Link>

                        {/* Professeur Info */}
                        <div className="mb-3 flex items-center gap-2">
                          <img
                            src={video.professeur.image}
                            alt={video.professeur.nom}
                            className="h-7 w-7 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <p className="text-xs font-medium text-gray-900">
                              {video.professeur.nom} {video.professeur.prenom}
                            </p>
                            <p className="text-xs text-gray-500">
                              {video.matiere.nom}
                            </p>
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="mb-4 flex items-center gap-4 text-xs text-gray-600">
                          <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            <span>{video.views}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>
                              {formatDistanceToNow(new Date(video.createdAt), {
                                addSuffix: true,
                                locale: fr,
                              })}
                            </span>
                          </div>
                        </div>

                        {/* Remove Button */}
                        <Button
                          onClick={() => handleRemoveSaveVideo(video._id)}
                          variant="outline"
                          className="w-full border-amber-200 text-amber-600 hover:bg-amber-50"
                          size="sm"
                        >
                          <Bookmark className="mr-2 h-4 w-4" />
                          Retirer
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                <div className="mt-12">
                  <Pagination
                    totalItems={totalSavedVideos}
                    itemsPerPage={videosPerPage}
                    currentPage={videoPage}
                    onPageChange={setVideoPage}
                  />
                </div>
              </>
            ) : (
              <div className="rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
                <Play className="mx-auto mb-4 h-16 w-16 text-gray-300" />
                <h3 className="mb-2 text-xl font-semibold text-gray-900">
                  Aucune vidéo enregistrée
                </h3>
                <p className="mb-6 text-gray-600">
                  Commencez à enregistrer des vidéos que vous aimez pour les
                  retrouver plus tard.
                </p>
              </div>
            )}
          </>
        )}

        {/* Cours Section */}
        {activeTab === "cours" && (
          <>
            {savedCours.length > 0 ? (
              <>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {savedCours.map((cours) => (
                    <div
                      key={cours._id}
                      className="group overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:shadow-xl"
                    >
                      {/* Header */}
                      <div className="border-l-4 border-amber-500 bg-gradient-to-r from-amber-50 to-white p-4">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-xs font-semibold text-amber-600 uppercase">
                              {cours.type}
                            </p>
                            <h3 className="mt-1 line-clamp-2 text-base font-semibold text-gray-900">
                              {cours.title}
                            </h3>
                          </div>
                          <BookOpen className="h-5 w-5 flex-shrink-0 text-amber-500" />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        {/* Matiere & Semestre */}
                        <div className="mb-3 flex items-center justify-between text-xs">
                          <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700">
                            {cours.matiere.nom}
                          </span>
                          <span className="text-gray-500">
                            {cours.semestre}
                          </span>
                        </div>

                        {/* Professeur */}
                        <div className="mb-4 flex items-center gap-2 border-t border-gray-100 pt-3">
                          <img
                            src={cours.professeur.image}
                            alt={cours.professeur.nom}
                            className="h-8 w-8 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <p className="text-xs font-medium text-gray-900">
                              {cours.professeur.nom} {cours.professeur.prenom}
                            </p>
                            <p className="text-xs text-gray-500">Professeur</p>
                          </div>
                        </div>

                        {/* Date */}
                        <div className="mb-4 flex items-center gap-2 text-xs text-gray-600">
                          <Clock className="h-3 w-3" />
                          <span>
                            {formatDistanceToNow(new Date(cours.createdAt), {
                              addSuffix: true,
                              locale: fr,
                            })}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <a
                            href={cours.pdfUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="flex-1"
                          >
                            <Button
                              size="sm"
                              className="w-full bg-amber-500 hover:bg-amber-600"
                            >
                              Voir le PDF
                            </Button>
                          </a>
                          <Button
                            onClick={() => handleRemoveSaveCours(cours._id)}
                            variant="outline"
                            className="border-amber-200 text-amber-600 hover:bg-amber-50"
                            size="sm"
                          >
                            <Bookmark className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                <div className="mt-12">
                  <Pagination
                    totalItems={totalSavedCours}
                    itemsPerPage={coursPerPage}
                    currentPage={coursPage}
                    onPageChange={setCoursPage}
                  />
                </div>
              </>
            ) : (
              <div className="rounded-xl border-2 border-dashed border-gray-300 bg-white p-12 text-center">
                <BookOpen className="mx-auto mb-4 h-16 w-16 text-gray-300" />
                <h3 className="mb-2 text-xl font-semibold text-gray-900">
                  Aucun cours enregistré
                </h3>
                <p className="mb-6 text-gray-600">
                  Commencez à enregistrer des cours que vous aimez pour les
                  retrouver plus tard.
                </p>
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!hasContent && (
          <div className="rounded-xl border-2 border-dashed border-gray-300  p-12 text-center">
            <Bookmark className="mx-auto mb-4 h-16 w-16 text-gray-300" />
            <h3 className="mb-2 text-xl font-semibold text-gray-900">
              Aucun contenu enregistré
            </h3>
            <p className="mb-6 text-gray-600">
              Commencez à enregistrer des vidéos et des cours pour les retrouver
              plus tard.
            </p>
            <div className="flex justify-center gap-4">
              <Link to={`/Videos/${niveaux}`}>
                <Button className="bg-amber-500 hover:bg-amber-600">
                  Découvrir les vidéos
                </Button>
              </Link>
              <Link to={`/Cours/${niveaux}`}>
                <Button
                  variant="outline"
                  className="border-amber-200 text-amber-600 hover:bg-amber-50"
                >
                  Découvrir les cours
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Save;

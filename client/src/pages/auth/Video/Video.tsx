import axios from "axios";
import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import type { TypeVideos } from "./types/video.type";
import { Bookmark, EllipsisVertical, Flag, Play, Share } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import No_Data from "@/assets/images/cours/No data-cuate.png";
import { Badge } from "@/components/ui/badge";
import Pagination from "@/components/Pagination/Pagination";
import { useCoursFilter } from "@/store/useCoursFilter";
import AsideVideos from "@/components/Videos/AsideVideos";
import { useDebounce } from "@/hooks/use-debounce";
import ReportModal from "@/components/Videos/ReportModal";

const Videos = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  document.title = "Videos | 9ralibre";
  const navigate = useNavigate();
  const { niveaux } = useParams();
  const [videos, setVideos] = useState<TypeVideos[]>([]);
  const [totalVideos, setTotalVideos] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const { search, setSearch, filiere, setFiliere, matiere, setMatiere } =
    useCoursFilter();
  const debouncedSearch = useDebounce(search, 500);
  const [searchParams, setSearchParams] = useSearchParams();
  const [savedItems, setSavedItems] = useState<string[]>([]);
  const [reportVideoId, setReportVideoId] = useState<string | null>(null);
  const itemsPerPage = 15;

  // 🔹 Fetch videos
  useEffect(() => {
    const getVideos = async () => {
      const params = new URLSearchParams();
      params.append("page", currentPage.toString());
      params.append("limit", itemsPerPage.toString());
      if (matiere) params.append("matiere", matiere);
      if (filiere) params.append("filiere", filiere);
      if (debouncedSearch) params.append("search", debouncedSearch);

      const res = await axios.get(
        `${apiUrl}/videos/get-all-videos/${niveaux}?${params.toString()}`,
        { withCredentials: true },
      );

      setVideos(res.data.videos);
      setTotalVideos(res.data.totalVideos);
    };

    getVideos();
  }, [apiUrl, currentPage, debouncedSearch, filiere, matiere, niveaux]);

  // 🔹 Sync URL
  useEffect(() => {
    const params: Record<string, string> = {};
    if (matiere) params.matiere = matiere;
    if (filiere) params.filiere = filiere;
    if (debouncedSearch) params.search = debouncedSearch;
    if (currentPage > 1) params.page = currentPage.toString();
    setSearchParams(params);
  }, [currentPage, debouncedSearch, filiere, matiere, setSearchParams]);

  // 🔹 Load from URL
  useEffect(() => {
    const m = searchParams.get("matiere");
    const t = searchParams.get("search");
    const f = searchParams.get("filiere");
    const p = searchParams.get("page");

    setMatiere(m);
    setFiliere(f);
    setSearch(t);
    setCurrentPage(p ? parseInt(p) : 1);
  }, [searchParams, setFiliere, setMatiere, setSearch]);

  const handleSave = async (itemId: string): Promise<void> => {
    try {
      await axios.post(
        `${apiUrl}/videos/post-videos-save/${itemId}`,
        {},
        { withCredentials: true },
      );
      setSavedItems((prev) =>
        prev.includes(itemId)
          ? prev.filter((id) => id !== itemId)
          : [...prev, itemId],
      );
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
    }
  };

  useEffect(() => {
    const getSaves = async (): Promise<void> => {
      try {
        const res = await axios.get<{ savedVideos: TypeVideos[] }>(
          `${apiUrl}/videos/get-saved-videos`,
          { withCredentials: true },
        );
        const savedVideoIds: string[] = res.data.savedVideos.map(
          (video: TypeVideos) => video._id.toString(),
        );
        setSavedItems(savedVideoIds);
      } catch (error) {
        console.error(
          "Erreur lors du chargement des vidéos enregistrées:",
          error,
        );
      }
    };
    getSaves();
  }, [apiUrl]);

  return (
    <>
        <div className="mb-8 flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 md:text-3xl dark:text-zinc-100">
            Videos
            {niveaux ? (
              <span className="ml-2 text-base font-semibold text-amber-500 dark:text-amber-500">
                · {niveaux}
              </span>
            ) : null}
          </h1>
          <p className="max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">
            Explorez notre collection de vidéos éducatives pour mieux comprendre vos cours. 
            Chaque vidéo est conçue pour vous aider à apprendre rapidement, renforcer vos connaissances 
            et vous préparer efficacement avant de passer aux quiz.
          </p>
        </div>
      <div className="flex flex-col gap-4 lg:flex-row">
        {/* 🔹 Aside */}
        <aside className="w-full flex-shrink-0 lg:w-64">
          <AsideVideos
            search={search || ""}
            matiere={matiere}
            filiere={filiere}
            setSearch={setSearch}
            setMatiere={setMatiere}
            setFiliere={setFiliere}
          />
        </aside>

        {/* 🔹 Videos */}
        <div className="flex-1">
          {videos.length > 0 ? (
            <div className="flex flex-col gap-4">
              {/* Pagination top */}
              <div className="w-full overflow-x-auto">
                <Pagination
                  totalItems={totalVideos}
                  itemsPerPage={itemsPerPage}
                  currentPage={currentPage}
                  onPageChange={(page) => setCurrentPage(page)}
                />
              </div>

              {/* Grid */}
              <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {videos.map((item) => (
                  <div key={item._id} className="w-full">
                    <div className="flex h-full flex-col space-y-3 rounded-md bg-gray-100 p-3 shadow-sm transition hover:shadow-md">
                      {/* Thumbnail */}
                      <div
                        className="group relative aspect-video w-full cursor-pointer overflow-hidden rounded-md"
                        onClick={() => navigate(`/Videos/${niveaux}/${item._id}`)}
                      >
                        <img
                          src={item.thumbnail}
                          alt="thumbnail"
                          className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-300 group-hover:bg-black/30">
                          <div className="scale-90 opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
                            <div className="rounded-full bg-amber-400 p-3 shadow-lg">
                              <Play size={30} color="#000" fill="#000" />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Badges */}
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="destructive">{item.filiere}</Badge>
                        <Badge className="bg-teal-400 text-white">
                          {item.matiere.nom}
                        </Badge>
                      </div>

                      {/* Infos */}
                      <div className="flex justify-between gap-2">
                        <div className="flex gap-2">
                          <Link
                            to={`/Profile/${item.professeur.nom}-${item.professeur.prenom}`}
                          >
                            <img
                              src={item.professeur.image}
                              className="size-8 rounded-full object-cover md:size-10"
                              loading="lazy"
                            />
                          </Link>

                          <div>
                            <h3 className="line-clamp-2 text-base font-medium text-gray-700 md:text-lg">
                              {item.title}
                            </h3>
                            <p className="text-sm font-semibold text-gray-500">
                              {item.professeur.nom} {item.professeur.prenom}
                            </p>
                            <p className="text-xs font-bold text-gray-500">
                              {item.views} vues ·{" "}
                              {formatDistanceToNow(new Date(item.createdAt), {
                                addSuffix: true,
                                locale: fr,
                              })}
                            </p>
                          </div>
                        </div>

                        {/* Dropdown */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <EllipsisVertical
                              size={18}
                              color="#000"
                              className="cursor-pointer"
                            />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start">
                            <DropdownMenuGroup>
                              <DropdownMenuItem
                                onClick={() => handleSave(item._id)}
                              >
                                <Bookmark
                                  color={
                                    savedItems.includes(item._id)
                                      ? "#F49E0B"
                                      : "#6B7280"
                                  }
                                  fill={
                                    savedItems.includes(item._id)
                                      ? "#F49E0B"
                                      : "none"
                                  }
                                />
                                {savedItems.includes(item._id)
                                  ? "Enregistré"
                                  : "Enregistrer"}
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Share /> Partager
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setReportVideoId(item._id)}>
                                <Flag /> Signaler
                              </DropdownMenuItem>
                            </DropdownMenuGroup>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination bottom */}
              <div className="w-full overflow-x-auto">
                <Pagination
                  totalItems={totalVideos}
                  itemsPerPage={itemsPerPage}
                  currentPage={currentPage}
                  onPageChange={(page) => setCurrentPage(page)}
                />
              </div>
            </div>
          ) : (
            <div className="flex w-full flex-col items-center justify-center">
              <img src={No_Data} alt="no data" width={400} loading="lazy" />
              <p>Aucune vidéo disponible pour le moment</p>
            </div>
          )}
        </div>
        {reportVideoId && (
          <ReportModal
            open={Boolean(reportVideoId)}
            onOpenChange={(open) => {
              if (!open) setReportVideoId(null);
            }}
            endpoint={`${apiUrl}/videos/report/${reportVideoId}`}
            title="Signaler cette vidéo"
          />
        )}
      </div>
    </>
    
  );
};

export default Videos;

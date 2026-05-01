import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { UserProfile } from "./types/Profiletypes";
import { Button } from "@/components/ui/button";
import { useProtectedRoutes } from "@/store/userStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { fr } from "date-fns/locale";
import { BookOpen, FileText, GraduationCap, MessageCircle, UserPlus } from "lucide-react";
import { useTranslation } from "react-i18next";

const Profile = () => {
const { t } = useTranslation();
const apiUrl = import.meta.env.VITE_API_URL;
const { name } = useParams();
const navigate = useNavigate();
const {data} = useProtectedRoutes();
const [profile, setProfile] = useState<UserProfile | null>(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

type ProfileContent = {
  videos: Array<{
    _id: string;
    title: string;
    description?: string;
    thumbnail?: string;
    videoUrl?: string;
    views?: number;
    likes?: string[];
    createdAt: string;
    filiere?: string;
    matiere?: { nom?: string } | null;
    niveaux?: { nom?: string } | null;
    visibility?: "Public" | "Private";
  }>;
  cours: Array<{
    _id: string;
    title: string;
    type: string;
    semestre: string;
    filière?: string;
    pdfUrl: string;
    createdAt: string;
    matiere?: { nom?: string } | null;
  }>;
  quiz: Array<{
    _id: string;
    text: string;
    participants?: string[];
    filiere?: string;
    createdAt: string;
    matiere?: { nom?: string } | null;
    niveaux?: { nom?: string } | null;
  }>;
};

const [content, setContent] = useState<ProfileContent | null>(null);
const [isFollowing, setIsFollowing] = useState(false);
const [followersCount, setFollowersCount] = useState(0);
const [publishedCoursCount, setPublishedCoursCount] = useState(0);
const [savedLatest, setSavedLatest] = useState<{ videos: unknown[]; cours: unknown[] } | null>(null);
const [quizResults, setQuizResults] = useState<Array<{
  _id: string;
  score: number;
  totalQuestions: number;
  createdAt: string;
  quizId?: { text?: string } | null;
  wrongAnswers?: Array<{ question: string; correctAnswer?: string; userAnswer?: string }>;
}>>([]);

useEffect(() => {
    const getProfile = async () => {
    try{
      setLoading(true);
      setError(null);
      const res = await axios.get(`${apiUrl}/user/profile/${name}`, { withCredentials: true });
      setProfile(res.data.user);
    }catch(err:unknown){
      const msg = err instanceof axios.AxiosError ? (err.response?.data?.message || err.message) : t("profile.loadError");
      setError(msg);
      setProfile(null);
    }finally{
      setLoading(false);
    }
    };
    getProfile();
}, [apiUrl, name]);

const handlePost = async()=>{
    const res = await axios.post(`${apiUrl}/chat/start-conversation`,{user:profile?._id,userId:data?._id},{withCredentials:true})
    navigate(`/Chat/start/${res.data._id}`)
}

useEffect(() => {
  if (!profile) return;
  const meId = data?.id || data?._id;
  setIsFollowing(!!(meId && profile.followers?.some((f) => f.toString() === meId.toString())));
  setFollowersCount(profile.followers?.length ?? 0);

  const fetchExtra = async () => {
    try {
      const [contentRes] = await Promise.all([
        axios.get(`${apiUrl}/user/profile/${profile._id}/content`, { withCredentials: true }),
      ]);
      const nextContent = {
        videos: contentRes.data.videos || [],
        cours: contentRes.data.cours || [],
        quiz: contentRes.data.quiz || [],
      };
      setContent(nextContent);
      setPublishedCoursCount(nextContent.cours.length);
    } catch {
      setContent(null);
      setPublishedCoursCount(0);
    }
  };

  fetchExtra();
}, [apiUrl, profile, data?.id, data?._id]);

useEffect(() => {
  if (!profile) return;
  const meId = data?.id || data?._id;
  const isSelf = !!meId && meId.toString() === profile._id.toString();
  if (!isSelf) return;

  const fetchPrivate = async () => {
    try {
      const [savedRes, resultsRes] = await Promise.all([
        axios.get(`${apiUrl}/user/saved/latest`, { withCredentials: true }),
        axios.get(`${apiUrl}/user/profile/${profile._id}/quiz-results`, { withCredentials: true }),
      ]);
      setSavedLatest({ videos: savedRes.data.videos || [], cours: savedRes.data.cours || [] });
      setQuizResults(resultsRes.data.results || []);
    } catch {
      // ignoré
    }
  };

  fetchPrivate();
}, [apiUrl, profile, data?.id, data?._id]);

const handleFollow = async () => {
  if (!profile) return;
  const meId = data?.id || data?._id;
  const isSelf = !!meId && meId.toString() === profile._id.toString();
  if (isSelf) return;
  const res = await axios.post(`${apiUrl}/user/follow/${profile._id}`, {}, { withCredentials: true });
  setIsFollowing(res.data.following);
  if (typeof res.data.followersCount === "number") setFollowersCount(res.data.followersCount);
};

if (loading) return <div className="p-6">{t("common.loading")}</div>;
if (error) return <div className="rounded-md bg-red-200 p-6 text-center text-xs text-red-900 lg:text-lg">{error}</div>;
if (!profile) return <div className="p-6">{t("profile.notFound")}</div>;
const meId = data?.id || data?._id;
const isSelf = !!meId && meId.toString() === profile._id.toString();
const isProfesseur = profile.role === "Professeur";
const events = Array.isArray(profile.events) ? profile.events : [];
const coursCountLabel = isProfesseur ? "Cours publiés" : "Cours";
const coursCountValue = isProfesseur ? publishedCoursCount : (profile.savedCours?.length ?? 0);

return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 dark:text-white">
      {/* Banner */}
      <div className="h-40 bg-gradient-to-r from-amber-500 via-orange-500 to-cyan-500" />

      <div className="mx-auto -mt-16 grid max-w-6xl grid-cols-1 gap-6 px-4 pb-10 md:grid-cols-[360px_1fr]">
        {/* Colonne gauche */}
        <Card className="bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-950">
          <CardHeader className="pb-3">
            <div className="flex items-end gap-4">
              <img
                src={`${apiUrl}/uploads/images/${profile._id}/${profile.image}`}
                alt={profile.nom}
                className="h-24 w-24 rounded-2xl border-4 object-cover dark:border-zinc-950"
              />
              <div className="min-w-0">
                <CardTitle className="truncate text-xl">{profile.prenom} {profile.nom}</CardTitle>
                <p className="truncate text-sm text-zinc-400">{profile.email}</p>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-amber-500 px-3 py-1 text-xs font-bold text-black">{profile.role}</span>
              <span className="rounded-full bg-cyan-500 px-3 py-1 text-xs font-bold text-black">{profile.niveaux}</span>
              {isProfesseur && profile.status && (
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${profile.status === "approved" ? "bg-emerald-500 text-black" : "bg-zinc-700 text-white"}`}>
                  {profile.status === "approved" ? "Validé" : "En attente"}
                </span>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Actions */}
            {!isSelf && (
              <div className="flex flex-col gap-2">
                <Button className="cursor-pointer bg-amber-500 text-black hover:bg-amber-600" onClick={handleFollow}>
                  <UserPlus className="size-4" />
                  {isFollowing ? t("common.alreadySubscribed") : t("common.subscribe")}
                </Button>
                <Button variant="outline" className="cursor-pointer" onClick={handlePost}>
                  <MessageCircle className="size-4" />
                  {t("profile.sendMessage")}
                </Button>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 border-t pt-4  dark:border-zinc-800">
              <div className="text-center">
                <p className="text-xl font-bold text-amber-500">{followersCount}</p>
                <p className="text-xs text-zinc-400">Abonnés</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-amber-500">{profile.following?.length ?? 0}</p>
                <p className="text-xs text-zinc-400">Abonnements</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-amber-500">{coursCountValue}</p>
                <p className="text-xs text-zinc-400">{coursCountLabel}</p>
              </div>
            </div>

            {/* Mini résumé */}
            <div className="rounded-lg border bg-zinc-900/40 p-3 text-sm text-zinc-300 dark:border-zinc-800">
              <p>
                {isProfesseur ? "Profil professeur" : "Profil étudiant(e)"} · Inscrit{profile.role === "Etudiante" ? "e" : ""}{" "}
                {profile.createdAt ? formatDistanceToNow(new Date(profile.createdAt), { addSuffix: true, locale: fr }) : ""}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Colonne droite */}
        <div className="space-y-4">
          <Tabs defaultValue="about" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
              <TabsTrigger value="about" className="cursor-pointer">À propos</TabsTrigger>
              <TabsTrigger value="activity" className="cursor-pointer">Activité</TabsTrigger>
              <TabsTrigger value="content" className="cursor-pointer">Contenu</TabsTrigger>
              <TabsTrigger value="resources" className="cursor-pointer">Ressources</TabsTrigger>
              <TabsTrigger value="results" className="cursor-pointer">Résultats</TabsTrigger>
            </TabsList>

            <TabsContent value="about" className="pt-4">
              <Card className="dark:border-zinc-800 dark:bg-zinc-950">
                <CardHeader>
                  <CardTitle>Informations</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
                  <div className="rounded-lg border bg-zinc-900/40 p-3 dark:border-zinc-800">
                    <p className="dark:text-zinc-400">Rôle</p>
                    <p className="font-semibold">{profile.role}</p>
                  </div>
                  <div className="rounded-lg border bg-zinc-900/40 p-3 dark:border-zinc-800">
                    <p className="dark:text-zinc-400">Niveau</p>
                    <p className="font-semibold">{profile.niveaux}</p>
                  </div>
                  <div className="rounded-lg border bg-zinc-900/40 p-3 md:col-span-2 dark:border-zinc-800">
                    <p className="dark:text-zinc-400">Email</p>
                    <p className="font-semibold">{isSelf ? profile.email : "Masqué"}</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="pt-4">
              <Card className="dark:border-zinc-800 dark:bg-zinc-950">
                <CardHeader>
                  <CardTitle>Activité récente</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {events.length === 0 ? (
                    <p className="text-sm text-zinc-400">Aucune activité pour le moment.</p>
                  ) : (
                    events.slice(0, 10).map((e, idx) => (
                      <div key={(e as { _id?: string })._id || idx} className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-3">
                        <p className="text-xs text-zinc-400">
                          {e.Date ? new Date(e.Date).toLocaleDateString("fr-FR") : "Date"}
                        </p>
                        <div className="mt-2 space-y-2">
                          {Array.isArray(e.items) ? e.items.map((it, j) => (
                            <div key={j} className="rounded-md border border-zinc-800 bg-zinc-950 p-2">
                              <p className="text-xs text-amber-400">{it.type}</p>
                              <p className="font-semibold">{it.titre}</p>
                              {it.Description && <p className="text-sm text-zinc-400">{it.Description}</p>}
                            </div>
                          )) : null}
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="content" className="pt-4">
              {!isProfesseur ? (
                <Card className="dark:border-zinc-800 dark:bg-zinc-950">
                  <CardContent className="p-6 text-sm text-zinc-400">Le contenu publié s’affiche uniquement pour les professeurs.</CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                  <Card className="lg:col-span-3 dark:border-zinc-800 dark:bg-zinc-950">
                    <CardHeader>
                      <CardTitle>Publications</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {(content?.videos || []).slice(0, 6).map((v) => (
                        <div key={v._id} className="rounded-lg border p-3 dark:border-zinc-800 dark:bg-zinc-900/40">
                          <div className="mb-2 flex items-center gap-2 text-xs text-zinc-400">
                            <BookOpen className="size-4" /> Vidéo
                            {v.visibility && <span className="ml-auto rounded-full bg-zinc-800 px-2 py-0.5">{v.visibility}</span>}
                          </div>
                          <p className="font-semibold">{v.title}</p>
                          <p className="mt-1 text-xs text-zinc-400">
                            {v.matiere?.nom ? `${v.matiere.nom} · ` : ""}{v.niveaux?.nom || ""}
                          </p>
                          <p className="mt-2 text-xs text-zinc-400">{(v.views ?? 0)} vues · {(v.likes?.length ?? 0)} likes</p>
                        </div>
                      ))}

                      {(content?.cours || []).slice(0, 6).map((c) => (
                        <div key={c._id} className="rounded-lg border p-3 dark:border-zinc-800 dark:bg-zinc-900/40">
                          <div className="mb-2 flex items-center gap-2 text-xs text-zinc-400">
                            <FileText className="size-4" /> Cours (PDF)
                          </div>
                          <p className="font-semibold">{c.title}</p>
                          <p className="mt-1 text-xs text-zinc-400">
                            {c.type} · {c.semestre}{c.matiere?.nom ? ` · ${c.matiere.nom}` : ""}
                          </p>
                        </div>
                      ))}

                      {(content?.quiz || []).slice(0, 6).map((q) => (
                        <div key={q._id} className="rounded-lg border p-3 dark:border-zinc-800 dark:bg-zinc-900/40">
                          <div className="mb-2 flex items-center gap-2 text-xs text-zinc-400">
                            <GraduationCap className="size-4" /> Quiz
                          </div>
                          <p className="font-semibold">{q.text}</p>
                          <p className="mt-1 text-xs text-zinc-400">
                            {(q.participants?.length ?? 0)} participants{q.matiere?.nom ? ` · ${q.matiere.nom}` : ""}
                          </p>
                        </div>
                      ))}

                      {(content?.videos?.length || 0) + (content?.cours?.length || 0) + (content?.quiz?.length || 0) === 0 ? (
                        <p className="text-sm text-zinc-400 lg:col-span-3">Aucun contenu pour le moment.</p>
                      ) : null}
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>

            <TabsContent value="resources" className="pt-4">
              {!isSelf ? (
                <Card className="dark:border-zinc-800 dark:bg-zinc-950">
                  <CardContent className="p-6 text-sm text-zinc-400">Les ressources enregistrées sont privées.</CardContent>
                </Card>
              ) : (
                <Card className="dark:border-zinc-800 dark:bg-zinc-950">
                  <CardHeader>
                    <CardTitle>Enregistrés (derniers)</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm font-semibold">Vidéos</p>
                      <p className="text-sm text-zinc-400">{savedLatest?.videos?.length ?? 0} élément(s)</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Cours</p>
                      <p className="text-sm text-zinc-400">{savedLatest?.cours?.length ?? 0} élément(s)</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="results" className="pt-4">
              {!isSelf ? (
                <Card className="dark:border-zinc-800 dark:bg-zinc-950">
                  <CardContent className="p-6 text-sm text-zinc-400">Les résultats sont privés.</CardContent>
                </Card>
              ) : (
                <Card className="border-zinc-800 bg-zinc-950">
                  <CardHeader>
                    <CardTitle>Résultats de quiz</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {quizResults.length === 0 ? (
                      <p className="text-sm text-zinc-400">Aucun résultat pour le moment.</p>
                    ) : (
                      quizResults.map((r) => (
                        <div key={r._id} className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-3">
                          <p className="font-semibold">{r.quizId?.text || "Quiz"}</p>
                          <p className="text-sm text-zinc-300">
                            Score: <span className="font-bold text-amber-400">{r.score}</span> / {r.totalQuestions}
                          </p>
                          <p className="text-xs text-zinc-400">
                            {r.createdAt ? formatDistanceToNow(new Date(r.createdAt), { addSuffix: true, locale: fr }) : ""}
                          </p>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
);
};

export default Profile;
import PagesNonTrouver from "@/pages/PagesNonTrouver/PagesNonTrouver";
import { useProtectedRoutes } from "@/store/userStore";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import {
  ArrowRight,
  BookMarked,
  BookOpen,
  CalendarDays,
  GraduationCap,
  Library,
  Play,
  Video,
} from "lucide-react";

interface Video {
  _id: string;
  title: string;
}

interface Cours {
  _id: string;
  title: string;
  pdfUrl?: string;
}

const apiUrl = import.meta.env.VITE_API_URL;

const Dashboard = () => {
  document.title = "Tableau de bord | 9ralibre";

  const { niveaux } = useParams();
  const { data, fetchData, loading } = useProtectedRoutes();

  const [date, setDate] = useState<Date | undefined>(new Date());
  const [savedVideos, setSavedVideos] = useState<Video[]>([]);
  const [savedCours, setSavedCours] = useState<Cours[]>([]);
  const [totalSavedVideos, setTotalSavedVideos] = useState(0);
  const [totalSavedCours, setTotalSavedCours] = useState(0);
  const [loadingSaved, setLoadingSaved] = useState(true);

  const enumParams = ["1AC", "2AC", "3AC", "TC", "1BAC", "2BAC"];

  const fetchSaved = async () => {
    try {
      const res = await axios.get(`${apiUrl}/user/saved/latest`, {
        withCredentials: true,
      });
      setSavedVideos(res.data.videos || []);
      setSavedCours(res.data.cours || []);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchTotals = async () => {
    try {
      setLoadingSaved(true);
      const [videosRes, coursRes] = await Promise.all([
        axios.get(`${apiUrl}/videos/get-saved-videos?page=1&limit=1`, {
          withCredentials: true,
        }),
        axios.get(`${apiUrl}/cours/get-saved-cours?page=1&limit=1`, {
          withCredentials: true,
        }),
      ]);
      setTotalSavedVideos(videosRes.data.totalSaved ?? 0);
      setTotalSavedCours(coursRes.data.totalSaved ?? 0);
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingSaved(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchSaved();
    fetchTotals();
  }, []);

  if (!enumParams.includes(niveaux || "")) {
    return <PagesNonTrouver />;
  }

  const displayName =
    data?.prenom && data?.nom
      ? `${data.prenom} ${data.nom}`
      : loading
        ? "…"
        : "Étudiant";

  const quickLinks = [
    {
      to: `/Cours/${niveaux}`,
      label: "Cours",
      description: "PDF, exercices, examens",
      icon: Library,
      className:
        "from-emerald-500/15 to-teal-500/10 border-emerald-200/60 dark:border-emerald-900/40",
      iconClass: "text-emerald-600 dark:text-emerald-400",
    },
    {
      to: `/Videos/${niveaux}`,
      label: "Vidéos",
      description: "Cours en vidéo",
      icon: Video,
      className:
        "from-amber-500/15 to-orange-500/10 border-amber-200/60 dark:border-amber-900/40",
      iconClass: "text-amber-600 dark:text-amber-400",
    },
    {
      to: `/Quiz/${niveaux}`,
      label: "Quiz",
      description: "S’entraîner et tester",
      icon: GraduationCap,
      className:
        "from-violet-500/15 to-purple-500/10 border-violet-200/60 dark:border-violet-900/40",
      iconClass: "text-violet-600 dark:text-violet-400",
    },
    {
      to: `/Save/${niveaux}`,
      label: "Enregistrements",
      description: "Tout ce que tu as sauvegardé",
      icon: BookMarked,
      className:
        "from-sky-500/15 to-cyan-500/10 border-sky-200/60 dark:border-sky-900/40",
      iconClass: "text-sky-600 dark:text-sky-400",
    },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] w-full">
      <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero */}
        <section className={`relative ${data?.role === "Etudiant" ? 'bg-sky-500' : 'bg-pink-500'} overflow-hidden rounded-2xl border border-amber-200/40 p-6 text-white shadow-lg shadow-amber-500/20 sm:p-8`}>
          <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-8 left-1/3 h-32 w-64 rounded-full bg-black/5 blur-2xl" />
          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 border-white/30 bg-white/20 shadow-inner">
                {data?.image ? (
                  <img
                    src={`${apiUrl}/uploads/images/${data.id}/${data.image}`}
                    alt="img_utilisateur"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <GraduationCap className="h-10 w-10 text-white/90" />
                  </div>
                )}
              </div>
              <div>
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <GraduationCap className="h-4 w-4 opacity-90" />
                  <span className="text-sm font-medium text-amber-50/90">
                    Espace étudiant
                  </span>
                </div>
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  Bonjour, {displayName}
                </h1>
                <p className="mt-1 max-w-xl text-sm text-amber-50/90">
                  Retrouve tes cours, vidéos et quiz pour le niveau{" "}
                  <span className="font-semibold text-white">{niveaux}</span>.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge className="border-0 bg-white/20 text-white hover:bg-white/25">
                    Niveau {niveaux}
                  </Badge>
                  {data?.completeProfile === false && (
                    <Badge
                      variant="secondary"
                      className="border-0 bg-black/15 text-white"
                    >
                      Complète ton profil dans les paramètres
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <Button
              asChild
              size="lg"
              className="shrink-0 border-0 bg-white text-amber-700 shadow-md hover:bg-amber-50 dark:bg-slate-100 dark:text-amber-800"
            >
              <Link to={`/Cours/${niveaux}`} className="gap-2">
                Explorer les cours
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Stats */}
        <section className="grid gap-4 sm:grid-cols-3">
          <Card className="border-slate-200/80 shadow-sm transition-shadow hover:shadow-md dark:border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Vidéos enregistrées
              </CardTitle>
              <div className="rounded-lg bg-amber-100 p-2 dark:bg-amber-950/50">
                <Play className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-900 tabular-nums dark:text-slate-100">
                {loadingSaved ? "—" : totalSavedVideos}
              </p>
              <CardDescription className="mt-1">
                Dans tes favoris vidéo
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-slate-200/80 shadow-sm transition-shadow hover:shadow-md dark:border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Cours enregistrés
              </CardTitle>
              <div className="rounded-lg bg-emerald-100 p-2 dark:bg-emerald-950/50">
                <BookOpen className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-900 tabular-nums dark:text-slate-100">
                {loadingSaved ? "—" : totalSavedCours}
              </p>
              <CardDescription className="mt-1">
                PDF et documents sauvegardés
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-slate-200/80 bg-gradient-to-br from-slate-50 to-amber-50/40 shadow-sm dark:border-slate-800 dark:from-slate-900 dark:to-amber-950/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Quiz
              </CardTitle>
              <div className="rounded-lg bg-violet-100 p-2 dark:bg-violet-950/50">
                <GraduationCap className="h-4 w-4 text-violet-600 dark:text-violet-400" />
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Entraîne-toi avec les quiz de ton niveau.
              </p>
              <Button asChild variant="outline" size="sm" className="w-fit border-violet-200 bg-white/80 hover:bg-violet-50 dark:border-violet-900 dark:bg-slate-900 dark:hover:bg-violet-950/50">
                <Link to={`/Quiz/${niveaux}`} className="gap-1">
                  Voir les quiz
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </section>

        {/* Accès rapides */}
        <section>
          <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
            Accès rapides
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {quickLinks.map((item) => (
              <Link key={item.to} to={item.to} className="group block">
                <Card
                  className={`h-full border bg-gradient-to-br ${item.className} transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:bg-slate-900/40`}
                >
                  <CardContent className="flex items-start gap-4 p-4">
                    <div
                      className={`rounded-xl bg-white/80 p-2.5 shadow-sm dark:bg-slate-800/80 ${item.iconClass}`}
                    >
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-slate-900 group-hover:text-amber-700 dark:text-slate-100 dark:group-hover:text-amber-400">
                        {item.label}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">
                        {item.description}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 shrink-0 text-slate-400 opacity-0 transition-opacity group-hover:opacity-100" />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Calendrier + derniers sauvegardés */}
        <div className="grid gap-6 lg:grid-cols-5">
          <Card className="border-slate-200/80 shadow-sm lg:col-span-2 dark:border-slate-800">
            <CardHeader>
              <div className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                <div>
                  <CardTitle className="text-base">Planning</CardTitle>
                  <CardDescription>
                    Garde une vue sur ton mois
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex justify-center pb-4">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-xl border border-slate-200 bg-white p-2 shadow-sm dark:border-slate-700 dark:bg-slate-900"
              />
            </CardContent>
          </Card>

          <Card className="border-slate-200/80 shadow-sm lg:col-span-3 dark:border-slate-800">
            <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2">
              <div>
                <CardTitle className="text-base">Derniers enregistrements</CardTitle>
                <CardDescription>
                  Vidéos et cours que tu as récemment sauvegardés
                </CardDescription>
              </div>
              <Button asChild variant="ghost" size="sm" className="text-amber-700 dark:text-amber-400">
                <Link to={`/Save/${niveaux}`} className="gap-1">
                  Tout voir
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-2">
              {savedVideos.length === 0 && savedCours.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/80 px-4 py-10 text-center dark:border-slate-700 dark:bg-slate-900/50">
                  <BookMarked className="mx-auto mb-3 h-10 w-10 text-slate-300 dark:text-slate-600" />
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Aucun enregistrement pour l’instant
                  </p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Enregistre des cours ou des vidéos depuis les listes pour les retrouver ici.
                  </p>
                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    <Button asChild size="sm" variant="outline">
                      <Link to={`/Videos/${niveaux}`}>Vidéos</Link>
                    </Button>
                    <Button asChild size="sm" className="bg-amber-500 hover:bg-amber-600">
                      <Link to={`/Cours/${niveaux}`}>Cours</Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <ul className="space-y-2">
                  {savedVideos.map((video) => (
                    <li key={`v-${video._id}`}>
                      <Link
                        to={`/Videos/${niveaux}/${video._id}`}
                        className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-white p-3 transition-colors hover:border-amber-200 hover:bg-amber-50/50 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:border-amber-900/50 dark:hover:bg-amber-950/20"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-950/50">
                            <Play className="h-4 w-4 text-amber-700 dark:text-amber-400" />
                          </span>
                          <span className="truncate text-sm font-medium text-slate-800 dark:text-slate-200">
                            {video.title}
                          </span>
                        </div>
                        <Badge
                          variant="secondary"
                          className="shrink-0 bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200"
                        >
                          Vidéo
                        </Badge>
                      </Link>
                    </li>
                  ))}
                  {savedCours.map((cours) => {
                    const pdfHref =
                      cours.pdfUrl && data?.id
                        ? `${apiUrl}/uploads/files/${data.id}/${cours.pdfUrl}`
                        : null;
                    const rowClass =
                      "flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-white p-3 transition-colors hover:border-emerald-200 hover:bg-emerald-50/50 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:border-emerald-900/50 dark:hover:bg-emerald-950/20";
                    const inner = (
                      <>
                        <div className="flex min-w-0 items-center gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-950/50">
                            <BookOpen className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
                          </span>
                          <span className="truncate text-sm font-medium text-slate-800 dark:text-slate-200">
                            {cours.title}
                          </span>
                        </div>
                        <Badge
                          variant="secondary"
                          className="shrink-0 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"
                        >
                          Cours
                        </Badge>
                      </>
                    );
                    return (
                      <li key={`c-${cours._id}`}>
                        {pdfHref ? (
                          <a
                            href={pdfHref}
                            target="_blank"
                            rel="noreferrer"
                            className={rowClass}
                          >
                            {inner}
                          </a>
                        ) : (
                          <Link to={`/Cours/${niveaux}`} className={rowClass}>
                            {inner}
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

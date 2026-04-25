import { useEffect, useState } from "react";
import logo from "@/assets/images/9ralibre_logo.png";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useProtectedRoutes } from "@/store/userStore";
import type { typedata } from "@/store/userStore";
import CompleteProfile from "@/components/CompleteProfile/CompleteProfile";
import Navbar from "@/components/Home/Navbar";
import { Navigate, Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import {
  ArrowRight,
  BookMarked,
  Bookmark,
  BookOpen,
  Calendar,
  Check,
  Facebook,
  GraduationCap,
  Instagram,
  LayoutDashboard,
  Library,
  Linkedin,
  MessageCircle,
  PlayCircle,
  Shield,
  Video,
} from "lucide-react";
import { cn } from "@/lib/utils";
import ReactPlayer from 'react-player';

const Home = () => {
  const [open, setOpen] = useState(false);
  const { data, fetchData, loading } = useProtectedRoutes();

  useEffect(() => {
    document.title = "9ralibre — Cours, vidéos & quiz";
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const showVerification = localStorage.getItem("show-verification");
    if (showVerification === "true") {
      setOpen(true);
    }
  }, []);

  const handleClose = () => {
    setOpen(false);
    localStorage.setItem("show-verification", "false");
  };

  if (data?.role === "Professeur") {
    return <Navigate to="/prof/dashboard" replace />;
  }
  if (data?.role === "Admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {!data || data.completeProfile ? (
        <>
          <Navbar />
          <main className="w-full px-0 pb-0 ">
            {loading ? (
              <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 px-4 text-zinc-500">
                <Loader2 className="h-10 w-10 animate-spin text-amber-600" />
                <p className="text-sm">Chargement…</p>
              </div>
            ) : (
              <LandingPage user={data ?? null} />
            )}
          </main>

          <HomeFooter user={loading ? null : data ?? null} />

          <Dialog
            open={open}
            onOpenChange={(value) => {
              setOpen(value);
              if (!value) {
                localStorage.setItem("show-verification", "false");
              }
            }}
          >
            <DialogContent className="border-zinc-200 sm:max-w-md dark:border-zinc-800">
              <DialogHeader>
                <DialogTitle>Bienvenue</DialogTitle>
                <DialogDescription className="text-left leading-relaxed">
                  Merci de vous être inscrit sur{" "}
                  <span className="font-semibold text-amber-600 dark:text-amber-500">
                    9ralibre
                  </span>
                  . Vérifiez votre boîte mail ou vos spams pour activer votre
                  compte.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  type="button"
                  onClick={handleClose}
                  className="bg-amber-500 text-white hover:bg-amber-600"
                >
                  OK
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      ) : (
        <CompleteProfile />
      )}
    </div>
  );
};

function LandingPage({ user }: { user: typedata | null }) {
  const n = user?.niveaux;
  const quickLinks = user && n
    ? [
        { to: `/Dashboard/${n}`, label: "Tableau de bord", desc: "Vue d’ensemble", icon: LayoutDashboard },
        { to: `/Cours/${n}`, label: "Cours", desc: "PDF & documents", icon: BookOpen },
        { to: `/Videos/${n}`, label: "Vidéos", desc: "Cours en vidéo", icon: PlayCircle },
        { to: `/Quiz/${n}`, label: "Quiz", desc: "S’entraîner", icon: GraduationCap },
        { to: `/Chat/${n}`, label: "Messagerie", desc: "Échanges", icon: MessageCircle },
        { to: `/Save/${n}`, label: "Enregistrements", desc: "Favoris", icon: BookMarked },
      ]
    : [];
  const features = [
    {
      icon: Library,
      title: "Bibliothèque de cours",
      desc: "PDF, fiches et annales organisés par matière et par niveau.",
    },
    {
      icon: Video,
      title: "Vidéos claires",
      desc: "Revoyez les leçons quand vous voulez, sur ordinateur ou mobile.",
    },
    {
      icon: GraduationCap,
      title: "Quiz corrigés",
      desc: "Entraînez-vous avec des QCM et suivez vos progrès.",
    },
    {
      icon: MessageCircle,
      title: "Échanges",
      desc: "Posez vos questions et restez en lien avec la communauté.",
    },
    {
      icon: Bookmark,
      title: "Favoris",
      desc: "Enregistrez cours et vidéos pour les retrouver en un clic.",
    },
    {
      icon: Calendar,
      title: "Calendrier de révision",
      desc: "Planifiez vos objectifs semaine par semaine et suivez vos échéances.",
    },
    {
      icon: BookOpen,
      title: "Histoires inspirantes",
      desc: "Découvrez des parcours d'élèves pour rester motivé tout au long de l'année.",
    },
  ];

  const steps = [
    {
      n: "01",
      title: "Créez un compte",
      text: "Inscription rapide — choisissez votre niveau scolaire.",
    },
    {
      n: "02",
      title: "Explorez le contenu",
      text: "Cours, vidéos et quiz adaptés au programme.",
    },
    {
      n: "03",
      title: "Progressez",
      text: "Révisez à votre rythme et gardez le fil.",
    },
  ];

  const niveaux = ["1AC", "2AC", "3AC", "TC", "1BAC", "2BAC"];

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="border-b border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="grid  gap-12 px-4 py-16 md:grid-cols-2 md:items-center md:gap-10 md:py-20 lg:px-8 lg:py-24">
          <div>
            <p className="mb-4 inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-zinc-500 uppercase dark:text-zinc-400">
              <GraduationCap className="h-4 w-4 text-amber-600" aria-hidden />
              {user ? "Vous êtes connecté" : "Collège & lycée"}
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-balance text-zinc-900 sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1] dark:text-zinc-50">
              La plateforme qui centralise vos révisions
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-pretty text-zinc-600 dark:text-zinc-400">
              {user ? (
                <>
                  Bonjour{" "}
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                    {user.prenom} {user.nom}
                  </span>
                  {n ? (
                    <>
                      {" "}
                      — niveau <span className="font-semibold">{n}</span>.
                    </>
                  ) : null}{" "}
                  Retrouvez cours, vidéos et quiz depuis votre espace.
                </>
              ) : (
                <>
                  Cours PDF, vidéos pédagogiques et quiz sur une interface simple
                  — pensée pour les élèves qui veulent gagner du temps, planifier
                  leurs révisions avec un calendrier et suivre des histoires
                  inspirantes.
                </>
              )}
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              {user && n ? (
                <>
                  <Button
                    asChild
                    size="lg"
                    className="h-12 rounded-lg bg-amber-500 px-8 text-base font-semibold text-zinc-950 shadow-none hover:bg-amber-600"
                  >
                    <Link to={`/Dashboard/${n}`}>
                      Mon tableau de bord
                      <ArrowRight className="ml-2 inline h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="h-12 rounded-lg border-zinc-300 bg-white px-8 text-base font-semibold dark:border-zinc-600 dark:bg-zinc-900"
                  >
                    <Link to={`/Cours/${n}`}>Mes cours</Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    asChild
                    size="lg"
                    className="h-12 rounded-lg bg-amber-500 px-8 text-base font-semibold text-zinc-950 shadow-none hover:bg-amber-600"
                  >
                    <Link to="/inscription">Commencer gratuitement</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="h-12 rounded-lg border-zinc-300 bg-white px-8 text-base font-semibold dark:border-zinc-600 dark:bg-zinc-900"
                  >
                    <Link to="/connexion">J’ai un compte</Link>
                  </Button>
                </>
              )}
            </div>
            <p className="mt-8 text-sm text-zinc-500">
              Enseignant ?{" "}
              <Link
                to="/prof-connexion"
                className="font-semibold text-amber-700 underline-offset-4 hover:underline dark:text-amber-500"
              >
                Accéder à l’espace professeur
              </Link>
            </p>
          </div>
          <div className="w-full">
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl">
              <ReactPlayer
                src="https://youtu.be/5OdVJbNCSso?si=eXdHCABtLMHq9CVm"
                controls
                width="100%"
                height="100%"
                className="absolute top-0 left-0"
              />
            </div>
          </div>
        </div>
      </section>

      {quickLinks.length > 0 && (
        <section className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/80">
          <div className="mx-auto max-w-6xl px-4 py-12 lg:px-8">
            <h2 className="text-center text-sm font-semibold tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
              Accès rapide à votre espace
            </h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {quickLinks.map(({ to, label, desc, icon: Icon }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="group flex gap-4 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition-all hover:border-amber-500 hover:shadow-md dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-amber-600"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800">
                      <Icon className="h-5 w-5 text-amber-600 dark:text-amber-500" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                        {label}
                      </span>
                      <p className="mt-0.5 text-xs text-zinc-600 dark:text-zinc-400">
                        {desc}
                      </p>
                    </div>
                    <ArrowRight className="h-5 w-5 shrink-0 text-zinc-300 transition-transform group-hover:translate-x-0.5 group-hover:text-amber-600 dark:text-zinc-600" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Chiffres clés */}
      <section className="border-b border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3 sm:gap-0 lg:px-8">
          {[
            { k: "6", l: "niveaux", s: "Du collège au bac" },
            { k: "3", l: "formats", s: "Cours, vidéos, quiz" },
            { k: "1", l: "compte", s: "Tout au même endroit" },
          ].map((item, i) => (
            <div
              key={item.l}
              className={cn(
                "text-center sm:py-2",
                i > 0 && "sm:border-l sm:border-zinc-300 dark:sm:border-zinc-700",
              )}
            >
              <p className="text-4xl font-bold text-zinc-900 tabular-nums dark:text-zinc-50">
                {item.k}
              </p>
              <p className="mt-1 text-sm font-semibold tracking-wide text-zinc-700 uppercase dark:text-zinc-300">
                {item.l}
              </p>
              <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-500">
                {item.s}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Fonctionnalités */}
      <section className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto max-w-6xl px-4 py-16 lg:px-8 lg:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Tout ce dont vous avez besoin pour réviser
            </h2>
            <p className="mt-4 text-zinc-600 dark:text-zinc-400">
              Une expérience pensée pour la concentration : peu de bruit, des
              contenus structurés, des accès rapides.
            </p>
          </div>
          <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, desc }) => (
              <li
                key={title}
                className="rounded-2xl border border-zinc-200 bg-zinc-50/80 p-6 dark:border-zinc-800 dark:bg-zinc-900/80"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-800">
                  <Icon
                    className="h-5 w-5 text-amber-600 dark:text-amber-500"
                    aria-hidden
                  />
                </span>
                <h3 className="mt-4 font-semibold text-zinc-900 dark:text-zinc-100">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {desc}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto max-w-6xl px-4 py-16 lg:px-8 lg:py-20">
          <h2 className="text-center text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Comment ça marche
          </h2>
          <ol className="mx-auto mt-14 grid max-w-4xl gap-10 md:grid-cols-3 md:gap-8">
            {steps.map((step) => (
              <li
                key={step.n}
                className="relative border-l-4 border-amber-500 pl-6 dark:border-amber-600"
              >
                <span className="text-xs font-bold text-amber-700 dark:text-amber-500">
                  {step.n}
                </span>
                <h3 className="mt-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {step.text}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Niveaux + confiance */}
      <section className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto max-w-6xl px-4 py-16 lg:px-8 lg:py-20">
          <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
            <div className="max-w-xl text-center lg:text-left">
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                Du 1AC au 2BAC
              </h2>
              <p className="mt-3 text-zinc-600 dark:text-zinc-400">
                Sélectionnez votre niveau après inscription : le contenu affiché
                correspond à votre filière scolaire.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-2 lg:justify-start">
                {niveaux.map((n) => (
                  <span
                    key={n}
                    className="inline-flex items-center rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm font-semibold text-zinc-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
                  >
                    {n}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex w-full max-w-md flex-col gap-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex gap-3">
                <Shield className="h-6 w-6 shrink-0 text-amber-600" aria-hidden />
                <div>
                  <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                    Compte personnel
                  </p>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                    Accès sécurisé, profil modifiable à tout moment.
                  </p>
                </div>
              </div>
              <ul className="space-y-2 border-t border-zinc-200 pt-4 dark:border-zinc-700">
                {[
                  "Contenu regroupé par matière",
                  "Interface lisible jour et nuit",
                  "Accès depuis le navigateur",
                ].map((line) => (
                  <li key={line} className="flex items-start gap-2 text-sm text-zinc-700 dark:text-zinc-300">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" aria-hidden />
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="bg-zinc-900 text-zinc-50 dark:bg-black">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center lg:px-8 lg:py-20">
          {user && n ? (
            <>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Poursuivre sur 9ralibre
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-sm text-zinc-400">
                Votre contenu et vos favoris vous attendent sur votre tableau de
                bord.
              </p>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <Button
                  asChild
                  size="lg"
                  className="h-12 rounded-lg bg-amber-500 px-8 text-base font-semibold text-zinc-950 hover:bg-amber-400"
                >
                  <Link to={`/Dashboard/${n}`}>Ouvrir le tableau de bord</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="h-12 rounded-lg border-zinc-600 bg-transparent px-8 text-base font-semibold text-zinc-50 hover:bg-zinc-800"
                >
                  <Link to={`/Save/${n}`}>Mes enregistrements</Link>
                </Button>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Prêt à structurer vos révisions ?
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-sm text-zinc-400">
                Rejoignez les élèves qui utilisent 9ralibre pour préparer les
                contrôles et les examens.
              </p>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <Button
                  asChild
                  size="lg"
                  className="h-12 rounded-lg bg-amber-500 px-8 text-base font-semibold text-zinc-950 hover:bg-amber-400"
                >
                  <Link to="/inscription">Créer mon compte</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="h-12 rounded-lg border-zinc-600 bg-transparent px-8 text-base font-semibold text-zinc-50 hover:bg-zinc-800"
                >
                  <Link to="/connexion">Se connecter</Link>
                </Button>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}

export function HomeFooter({ user }: { user: typedata | null }) {
  const n = user?.niveaux;
  return (
    <footer className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <div className="lg:col-span-1">
            <img src={logo} alt="logo"  loading="lazy" width={90}/>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              Cours, vidéos et quiz pour le collège et le lycée — un seul endroit
              pour réviser sereinement.
            </p>
            <div className="mt-4 flex gap-3">
              <Link
                to="https://facebook.com/9ralibre"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 text-zinc-600 transition-colors hover:border-amber-400 hover:text-amber-700 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-amber-600 dark:hover:text-amber-500"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </Link>
              <Link
                to="https://instagram.com/9ralibre"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 text-zinc-600 transition-colors hover:border-amber-400 hover:text-amber-700 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-amber-600 dark:hover:text-amber-500"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </Link>
              <Link
                to="https://linkedin.com/9ralibre"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 text-zinc-600 transition-colors hover:border-amber-400 hover:text-amber-700 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-amber-600 dark:hover:text-amber-500"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wider text-zinc-900 uppercase dark:text-zinc-200">
              Navigation
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link
                  to="/"
                  className="text-zinc-600 transition-colors hover:text-amber-700 dark:text-zinc-400 dark:hover:text-amber-500"
                >
                  Accueil
                </Link>
              </li>
              {user && n ? (
                <>
                  <li>
                    <Link
                      to={`/Dashboard/${n}`}
                      className="text-zinc-600 transition-colors hover:text-amber-700 dark:text-zinc-400 dark:hover:text-amber-500"
                    >
                      Tableau de bord
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={`/Cours/${n}`}
                      className="text-zinc-600 transition-colors hover:text-amber-700 dark:text-zinc-400 dark:hover:text-amber-500"
                    >
                      Cours
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={`/Videos/${n}`}
                      className="text-zinc-600 transition-colors hover:text-amber-700 dark:text-zinc-400 dark:hover:text-amber-500"
                    >
                      Vidéos
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={`/Paramètre/${n}`}
                      className="text-zinc-600 transition-colors hover:text-amber-700 dark:text-zinc-400 dark:hover:text-amber-500"
                    >
                      Paramètres
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link
                      to="/connexion"
                      className="text-zinc-600 transition-colors hover:text-amber-700 dark:text-zinc-400 dark:hover:text-amber-500"
                    >
                      Connexion
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/inscription"
                      className="text-zinc-600 transition-colors hover:text-amber-700 dark:text-zinc-400 dark:hover:text-amber-500"
                    >
                      Inscription
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wider text-zinc-900 uppercase dark:text-zinc-200">
              Ressources
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              {user && n ? (
                <>
                  <li>
                    <Link
                      to={`/Quiz/${n}`}
                      className="text-zinc-600 transition-colors hover:text-amber-700 dark:text-zinc-400 dark:hover:text-amber-500"
                    >
                      Quiz
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={`/Save/${n}`}
                      className="text-zinc-600 transition-colors hover:text-amber-700 dark:text-zinc-400 dark:hover:text-amber-500"
                    >
                      Enregistrements
                    </Link>
                  </li>
                </>
              ) : null}
              <li>
                <Link
                  to="/prof-connexion"
                  className="text-zinc-600 transition-colors hover:text-amber-700 dark:text-zinc-400 dark:hover:text-amber-500"
                >
                  Espace professeur
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wider text-zinc-900 uppercase dark:text-zinc-200">
              Contact
            </h3>
            <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
              Une question sur la plateforme ? Utilisez la messagerie une fois
              connecté ou contactez-nous via les réseaux sociaux. <a href="mailto:contact@9ralibre.com" className="border-b-2 border-b-cyan-400">contact@9ralibre.com</a>
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-zinc-200 pt-8 text-center text-xs text-zinc-500 sm:flex-row sm:text-left dark:border-zinc-800 dark:text-zinc-500">
          <p>© {new Date().getFullYear()} 9ralibre. Tous droits réservés.</p>
          <p className="max-w-md sm:text-right">
            Plateforme éducative — 9ralibre.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Home;

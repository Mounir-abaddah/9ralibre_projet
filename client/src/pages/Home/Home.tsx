import { useEffect, useState } from "react";
import logo from "/assets/images/9ralibre_logo.png";
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
import { useTranslation } from "react-i18next";

const Home = () => {
  const { t } = useTranslation();
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
          <main className="w-full px-0 pb-0">
            {loading ? (
              <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 px-4 text-zinc-500">
                <Loader2 className="h-10 w-10 animate-spin text-amber-600" />
                <p className="text-sm">{t("home.loading")}</p>
              </div>
            ) : (
              <LandingPage user={data ?? null} />
            )}
          </main>

          <HomeFooter user={loading ? null : (data ?? null)} />

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
                <DialogTitle>{t("home.dialog.title")}</DialogTitle>
                <DialogDescription className="text-left leading-relaxed">
                  {t("home.dialog.description1")}{" "}
                  <span className="font-semibold text-amber-600 dark:text-amber-500">
                    9ralibre
                  </span>
                  . {t("home.dialog.description2")}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  type="button"
                  onClick={handleClose}
                  className="bg-amber-500 text-white hover:bg-amber-600"
                >
                  {t("home.dialog.ok")}
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
  const { t } = useTranslation();
  const n = user?.niveaux;

  const quickLinks =
    user && n
      ? [
          {
            to: `/Dashboard/${n}`,
            label: t("home.quickLinks.dashboard"),
            desc: t("home.quickLinks.dashboardDesc"),
            icon: LayoutDashboard,
          },
          {
            to: `/Cours`,
            label: t("home.quickLinks.courses"),
            desc: t("home.quickLinks.coursesDesc"),
            icon: BookOpen,
          },
          {
            to: `/Videos/${n}`,
            label: t("home.quickLinks.videos"),
            desc: t("home.quickLinks.videosDesc"),
            icon: PlayCircle,
          },
          {
            to: `/Quiz/${n}`,
            label: t("home.quickLinks.quiz"),
            desc: t("home.quickLinks.quizDesc"),
            icon: GraduationCap,
          },
          {
            to: `/Chat/${n}`,
            label: t("home.quickLinks.messaging"),
            desc: t("home.quickLinks.messagingDesc"),
            icon: MessageCircle,
          },
          {
            to: `/Save/${n}`,
            label: t("home.quickLinks.saves"),
            desc: t("home.quickLinks.savesDesc"),
            icon: BookMarked,
          },
        ]
      : [];

  const features = [
    {
      icon: Library,
      title: t("home.features.library.title"),
      desc: t("home.features.library.desc"),
    },
    {
      icon: Video,
      title: t("home.features.videos.title"),
      desc: t("home.features.videos.desc"),
    },
    {
      icon: GraduationCap,
      title: t("home.features.quiz.title"),
      desc: t("home.features.quiz.desc"),
    },
    {
      icon: MessageCircle,
      title: t("home.features.messaging.title"),
      desc: t("home.features.messaging.desc"),
    },
    {
      icon: Bookmark,
      title: t("home.features.bookmarks.title"),
      desc: t("home.features.bookmarks.desc"),
    },
    {
      icon: Calendar,
      title: t("home.features.calendar.title"),
      desc: t("home.features.calendar.desc"),
    },
    {
      icon: BookOpen,
      title: t("home.features.stories.title"),
      desc: t("home.features.stories.desc"),
    },
  ];

  const steps = [
    {
      n: "01",
      title: t("home.steps.step1.title"),
      text: t("home.steps.step1.text"),
    },
    {
      n: "02",
      title: t("home.steps.step2.title"),
      text: t("home.steps.step2.text"),
    },
    {
      n: "03",
      title: t("home.steps.step3.title"),
      text: t("home.steps.step3.text"),
    },
  ];

  const niveaux = ["1AC", "2AC", "3AC", "TC", "1BAC", "2BAC"];

  const stats = [
    { k: "6", l: t("home.stats.levels.label"), s: t("home.stats.levels.sub") },
    {
      k: "3",
      l: t("home.stats.formats.label"),
      s: t("home.stats.formats.sub"),
    },
    {
      k: "1",
      l: t("home.stats.account.label"),
      s: t("home.stats.account.sub"),
    },
  ];

  const trustList = [
    t("home.trust.point1"),
    t("home.trust.point2"),
    t("home.trust.point3"),
  ];

  return (
    <div className="w-full">
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="border-b border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="grid gap-12 px-4 py-16 md:grid-cols-2 md:items-center md:gap-10 md:py-20 lg:px-8 lg:py-24">
          <div>
            <p className="mb-4 inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-zinc-500 uppercase dark:text-zinc-400">
              <GraduationCap className="h-4 w-4 text-amber-600" aria-hidden />
              {user ? t("home.hero.connected") : t("home.hero.level")}
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-balance text-zinc-900 sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1] dark:text-zinc-50">
              {t("home.hero.title")}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-pretty text-zinc-600 dark:text-zinc-400">
              {user ? (
                <>
                  {t("home.hero.greetingPrefix")}{" "}
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                    {user.prenom} {user.nom}
                  </span>
                  {n ? (
                    <>
                      {" "}
                      — {t("home.hero.level_label")}{" "}
                      <span className="font-semibold">{n}</span>.
                    </>
                  ) : null}{" "}
                  {t("home.hero.greetingSuffix")}
                </>
              ) : (
                t("home.hero.guestDescription")
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
                      {t("home.hero.cta.dashboard")}
                      <ArrowRight className="ml-2 inline h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="h-12 rounded-lg border-zinc-300 bg-white px-8 text-base font-semibold dark:border-zinc-600 dark:bg-zinc-900"
                  >
                    <Link to="/Cours">{t("home.hero.cta.courses")}</Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    asChild
                    size="lg"
                    className="h-12 rounded-lg bg-amber-500 px-8 text-base font-semibold text-zinc-950 shadow-none hover:bg-amber-600"
                  >
                    <Link to="/inscription">{t("home.hero.cta.start")}</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="h-12 rounded-lg border-zinc-300 bg-white px-8 text-base font-semibold dark:border-zinc-600 dark:bg-zinc-900"
                  >
                    <Link to="/connexion">{t("home.hero.cta.login")}</Link>
                  </Button>
                </>
              )}
            </div>
            <p className="mt-8 text-sm text-zinc-500">
              {t("home.hero.teacherLabel")}{" "}
              <Link
                to="/prof-connexion"
                className="font-semibold text-amber-700 underline-offset-4 hover:underline dark:text-amber-500"
              >
                {t("home.hero.teacherLink")}
              </Link>
            </p>
          </div>
          <div className="relative w-full">
            <img
              src="/frame-3.png"
              alt="Illustration 9ralibre"
              loading="lazy"
              width={300}
              className=" inset-0 hidden h-full w-full object-cover md:block lg:block"
            />
          </div>
        </div>
      </section>

      {/* ── Quick links ───────────────────────────────────────────────────── */}
      {quickLinks.length > 0 && (
        <section className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/80">
          <div className="mx-auto max-w-6xl px-4 py-12 lg:px-8">
            <h2 className="text-center text-sm font-semibold tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
              {t("home.quickLinks.sectionTitle")}
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

      {/* ── Stats ─────────────────────────────────────────────────────────── */}
      <section className="border-b border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3 sm:gap-0 lg:px-8">
          {stats.map((item, i) => (
            <div
              key={item.l}
              className={cn(
                "text-center sm:py-2",
                i > 0 &&
                  "sm:border-l sm:border-zinc-300 dark:sm:border-zinc-700",
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

      {/* ── Features ──────────────────────────────────────────────────────── */}
      <section className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto max-w-6xl px-4 py-16 lg:px-8 lg:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              {t("home.features.sectionTitle")}
            </h2>
            <p className="mt-4 text-zinc-600 dark:text-zinc-400">
              {t("home.features.sectionDesc")}
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

      {/* ── How it works ──────────────────────────────────────────────────── */}
      <section className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto max-w-6xl px-4 py-16 lg:px-8 lg:py-20">
          <h2 className="text-center text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            {t("home.steps.sectionTitle")}
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

      {/* ── Levels + trust ────────────────────────────────────────────────── */}
      <section className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto max-w-6xl px-4 py-16 lg:px-8 lg:py-20">
          <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
            <div className="max-w-xl text-center lg:text-left">
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                {t("home.levels.title")}
              </h2>
              <p className="mt-3 text-zinc-600 dark:text-zinc-400">
                {t("home.levels.desc")}
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
                <Shield
                  className="h-6 w-6 shrink-0 text-amber-600"
                  aria-hidden
                />
                <div>
                  <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                    {t("home.trust.title")}
                  </p>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                    {t("home.trust.subtitle")}
                  </p>
                </div>
              </div>
              <ul className="space-y-2 border-t border-zinc-200 pt-4 dark:border-zinc-700">
                {trustList.map((line) => (
                  <li
                    key={line}
                    className="flex items-start gap-2 text-sm text-zinc-700 dark:text-zinc-300"
                  >
                    <Check
                      className="mt-0.5 h-4 w-4 shrink-0 text-amber-600"
                      aria-hidden
                    />
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA final ─────────────────────────────────────────────────────── */}
      <section className="bg-zinc-900 text-zinc-50 dark:bg-black">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center lg:px-8 lg:py-20">
          {user && n ? (
            <>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                {t("home.cta.userTitle")}
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-sm text-zinc-400">
                {t("home.cta.userDesc")}
              </p>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <Button
                  asChild
                  size="lg"
                  className="h-12 rounded-lg bg-amber-500 px-8 text-base font-semibold text-zinc-950 hover:bg-amber-400"
                >
                  <Link to={`/Dashboard/${n}`}>
                    {t("home.cta.openDashboard")}
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="h-12 rounded-lg border-zinc-600 bg-transparent px-8 text-base font-semibold text-zinc-50 hover:bg-zinc-800"
                >
                  <Link to={`/Save/${n}`}>{t("home.cta.mySaves")}</Link>
                </Button>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                {t("home.cta.guestTitle")}
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-sm text-zinc-400">
                {t("home.cta.guestDesc")}
              </p>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <Button
                  asChild
                  size="lg"
                  className="h-12 rounded-lg bg-amber-500 px-8 text-base font-semibold text-zinc-950 hover:bg-amber-400"
                >
                  <Link to="/inscription">{t("home.cta.createAccount")}</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="h-12 rounded-lg border-zinc-600 bg-transparent px-8 text-base font-semibold text-zinc-50 hover:bg-zinc-800"
                >
                  <Link to="/connexion">{t("home.cta.login")}</Link>
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
  const { t } = useTranslation();
  const n = user?.niveaux;

  return (
    <footer className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <img src={logo} alt="logo" loading="lazy" width={90} />
            <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              {t("home.footer.tagline")}
            </p>
            <div className="mt-4 flex gap-3">
              {[
                {
                  to: "https://facebook.com/9ralibre",
                  label: "Facebook",
                  Icon: Facebook,
                },
                {
                  to: "https://instagram.com/9ralibre",
                  label: "Instagram",
                  Icon: Instagram,
                },
                {
                  to: "https://linkedin.com/9ralibre",
                  label: "LinkedIn",
                  Icon: Linkedin,
                },
              ].map(({ to, label, Icon }) => (
                <Link
                  key={label}
                  to={to}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 text-zinc-600 transition-colors hover:border-amber-400 hover:text-amber-700 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-amber-600 dark:hover:text-amber-500"
                  aria-label={label}
                >
                  <Icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider text-zinc-900 uppercase dark:text-zinc-200">
              {t("home.footer.nav.title")}
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link
                  to="/"
                  className="text-zinc-600 transition-colors hover:text-amber-700 dark:text-zinc-400 dark:hover:text-amber-500"
                >
                  {t("home.footer.nav.home")}
                </Link>
              </li>
              {user && n ? (
                <>
                  <li>
                    <Link
                      to={`/Dashboard/${n}`}
                      className="text-zinc-600 transition-colors hover:text-amber-700 dark:text-zinc-400 dark:hover:text-amber-500"
                    >
                      {t("home.footer.nav.dashboard")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/Cours"
                      className="text-zinc-600 transition-colors hover:text-amber-700 dark:text-zinc-400 dark:hover:text-amber-500"
                    >
                      {t("home.footer.nav.courses")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={`/Videos/${n}`}
                      className="text-zinc-600 transition-colors hover:text-amber-700 dark:text-zinc-400 dark:hover:text-amber-500"
                    >
                      {t("home.footer.nav.videos")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={`/Paramètre/${n}`}
                      className="text-zinc-600 transition-colors hover:text-amber-700 dark:text-zinc-400 dark:hover:text-amber-500"
                    >
                      {t("home.footer.nav.settings")}
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
                      {t("nav.connexion")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/inscription"
                      className="text-zinc-600 transition-colors hover:text-amber-700 dark:text-zinc-400 dark:hover:text-amber-500"
                    >
                      {t("nav.inscription")}
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider text-zinc-900 uppercase dark:text-zinc-200">
              {t("home.footer.resources.title")}
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              {user && n && (
                <>
                  <li>
                    <Link
                      to={`/Quiz/${n}`}
                      className="text-zinc-600 transition-colors hover:text-amber-700 dark:text-zinc-400 dark:hover:text-amber-500"
                    >
                      {t("home.footer.resources.quiz")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={`/Save/${n}`}
                      className="text-zinc-600 transition-colors hover:text-amber-700 dark:text-zinc-400 dark:hover:text-amber-500"
                    >
                      {t("home.footer.resources.saves")}
                    </Link>
                  </li>
                </>
              )}
              <li>
                <Link
                  to="/prof-connexion"
                  className="text-zinc-600 transition-colors hover:text-amber-700 dark:text-zinc-400 dark:hover:text-amber-500"
                >
                  {t("home.footer.resources.teacherSpace")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider text-zinc-900 uppercase dark:text-zinc-200">
              {t("home.footer.contact.title")}
            </h3>
            <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
              {t("home.footer.contact.desc")}{" "}
              <a
                href="mailto:contact@9ralibre.com"
                className="border-b-2 border-b-cyan-400"
              >
                contact@9ralibre.com
              </a>
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-zinc-200 pt-8 text-center text-xs text-zinc-500 sm:flex-row sm:text-left dark:border-zinc-800 dark:text-zinc-500">
          <p>
            © {new Date().getFullYear()} 9ralibre. {t("home.footer.rights")}
          </p>
          <p className="max-w-md sm:text-right">{t("home.footer.platform")}</p>
        </div>
      </div>
    </footer>
  );
}

export default Home;

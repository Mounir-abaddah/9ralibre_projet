import Navbar from "@/components/Home/Navbar";
import {
  Award,
  BookOpen,
  CheckCircle2,
  CircleHelp,
  GraduationCap,
  Headset,
  Mail,
  PlayCircle,
  UserRoundCheck,
  Users,
} from "lucide-react";
import { HomeFooter } from "../Home/Home";

const offeringCards = [
  {
    title: "Vidéos",
    icon: PlayCircle,
    points: ["Cours en vidéo", "Explications simples et claires"],
  },
  {
    title: "Cours PDF",
    icon: BookOpen,
    points: ["Documents téléchargeables", "Examens et exercices corrigés"],
  },
  {
    title: "Quiz",
    icon: CircleHelp,
    points: ["Tester ses connaissances", "Voir ses erreurs pour progresser"],
  },
];

const professorPoints = [
  "Contenus créés par des professeurs",
  "Profils vérifiés avec accountVerified et status",
  "Possibilité de suivre un professeur",
];

const studentPoints = [
  "Sauvegarder les cours importants",
  "Suivre sa progression dans le temps",
  "Passer des quiz par matière",
  "Suivre ses professeurs préférés",
];

const whyChoosePoints = [
  "Interface simple et rapide",
  "Contenu structuré par niveau",
  "Interaction via likes et commentaires",
  "Suivi de progression pour rester motivé",
];

const About = () => {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Navbar />

      <main>
        <section className="border-b border-zinc-200 bg-amber-500 dark:border-zinc-800 dark:bg-amber-500">
          <div className="mx-auto max-w-4xl px-4 py-20 text-center lg:py-28">
            <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-6xl">
              About{" "}
              <span className="inline-block rotate-6 transform rounded-xl bg-cyan-500 px-3 py-1.5">9ralibre</span>
            </h1>
            <p className="mx-auto mt-8 max-w-3xl text-base leading-relaxed text-zinc-800 sm:text-lg">
              Plateforme educative pour apprendre facilement avec des videos,
              cours et quiz interactifs. Nous avons cree 9ralibre pour offrir un
              espace moderne, simple et utile pour tous les etudiants.
            </p>
          </div>
        </section>

        <section className="border-b border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mx-auto max-w-6xl px-4 py-16 lg:px-8 lg:py-20">
            <h2 className="inline-flex items-center gap-2 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
              <Award className="h-7 w-7 text-amber-600" />
              Mission
            </h2>
            <p className="mt-5 max-w-4xl text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
              Notre mission est de rendre l’apprentissage accessible à tous les
              étudiants grâce à du contenu de qualité créé par des professeurs.
            </p>
          </div>
        </section>

        <section className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mx-auto max-w-6xl px-4 py-16 lg:px-8 lg:py-20">
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
              Ce que nous proposons
            </h2>
            <p className="mt-3 text-zinc-600 dark:text-zinc-400">
              Une expérience complète autour de trois formats essentiels.
            </p>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {offeringCards.map(({ title, icon: Icon, points }) => (
                <article
                  key={title}
                  className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-800">
                    <Icon className="h-5 w-5 text-amber-600 dark:text-amber-500" />
                  </span>
                  <h3 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                    {title}
                  </h3>
                  <ul className="mt-4 space-y-2">
                    {points.map((point) => (
                      <li
                        key={point}
                        className="flex items-start gap-2 text-sm text-zinc-700 dark:text-zinc-300"
                      >
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/70">
          <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 lg:grid-cols-2 lg:px-8 lg:py-20">
            <article>
              <h2 className="inline-flex items-center gap-2 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                <UserRoundCheck className="h-6 w-6 text-amber-600" />
                Professeurs
              </h2>
              <ul className="mt-6 space-y-3">
                {professorPoints.map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-2 text-zinc-700 dark:text-zinc-300"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                    {point}
                  </li>
                ))}
              </ul>
            </article>

            <article>
              <h2 className="inline-flex items-center gap-2 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                <GraduationCap className="h-6 w-6 text-amber-600" />
                Étudiants
              </h2>
              <ul className="mt-6 space-y-3">
                {studentPoints.map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-2 text-zinc-700 dark:text-zinc-300"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                    {point}
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </section>

        <section className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mx-auto max-w-6xl px-4 py-16 lg:px-8 lg:py-20">
            <h2 className="inline-flex items-center gap-2 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
              <Users className="h-7 w-7 text-amber-600" />
              Pourquoi choisir 9ralibre
            </h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {whyChoosePoints.map((point) => (
                <div
                  key={point}
                  className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
                >
                  <span className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                    {point}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mx-auto max-w-6xl px-4 py-16 lg:px-8 lg:py-20">
            <h2 className="inline-flex items-center gap-2 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
              <Headset className="h-7 w-7 text-amber-600" />
              Support & contact
            </h2>
            <p className="mt-4 text-zinc-700 dark:text-zinc-300">
              Besoin d’aide ? Notre chat support via Crisp est disponible pour
              vous accompagner. Vous pouvez aussi nous contacter par email.
            </p>
            <p className="mt-3 inline-flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
              <Mail className="h-4 w-4" />
              contact@9ralibre.com
            </p>
          </div>
        </section>
      </main>

      <HomeFooter user={null} />
    </div>
  );
};

export default About;
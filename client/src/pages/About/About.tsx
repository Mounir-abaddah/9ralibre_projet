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
import { useTranslation } from "react-i18next";

const About = () => {
  const { t } = useTranslation();
  
  const offeringCards = [
    {
      title: t("about.offering.videos.title"),
      icon: PlayCircle,
      points: [
        t("about.offering.videos.point1"),
        t("about.offering.videos.point2"),
      ],
    },
    {
      title: t("about.offering.pdf.title"),
      icon: BookOpen,
      points: [
        t("about.offering.pdf.point1"),
        t("about.offering.pdf.point2"),
      ],
    },
    {
      title: t("about.offering.quiz.title"),
      icon: CircleHelp,
      points: [
        t("about.offering.quiz.point1"),
        t("about.offering.quiz.point2"),
      ],
    },
  ];

  const professorPoints = [
    t("about.professors.point1"),
    t("about.professors.point2"),
    t("about.professors.point3"),
  ];

  const studentPoints = [
    t("about.students.point1"),
    t("about.students.point2"),
    t("about.students.point3"),
    t("about.students.point4"),
  ];

  const whyChoosePoints = [
    t("about.whyChoose.point1"),
    t("about.whyChoose.point2"),
    t("about.whyChoose.point3"),
    t("about.whyChoose.point4"),
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Navbar />

      <main>
        <section className="border-b border-zinc-200 bg-amber-500 dark:border-zinc-800 dark:bg-amber-500">
          <div className="mx-auto max-w-4xl px-4 py-20 text-center lg:py-28">
            <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-6xl">
              {t("about.hero.title")}{" "}
              <span className="inline-block rotate-6 transform rounded-xl bg-cyan-500 px-3 py-1.5">
                9ralibre
              </span>
            </h1>
            <p className="mx-auto mt-8 max-w-3xl text-base leading-relaxed text-zinc-800 sm:text-lg">
              {t("about.hero.description")}
            </p>
          </div>
        </section>

        <section className="border-b border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mx-auto max-w-6xl px-4 py-16 lg:px-8 lg:py-20">
            <h2 className="inline-flex items-center gap-2 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
              <Award className="h-7 w-7 text-amber-600" />
              {t("about.mission.title")}
            </h2>
            <p className="mt-5 max-w-4xl text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
              {t("about.mission.description")}
            </p>
          </div>
        </section>

        <section className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mx-auto max-w-6xl px-4 py-16 lg:px-8 lg:py-20">
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
              {t("about.offering.title")}
            </h2>
            <p className="mt-3 text-zinc-600 dark:text-zinc-400">
              {t("about.offering.subtitle")}
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
                {t("about.professors.title")}
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
                {t("about.students.title")}
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
              {t("about.whyChoose.title")}
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
              {t("about.support.title")}
            </h2>

            <p className="mt-4 text-zinc-700 dark:text-zinc-300">
              {t("about.support.description")}
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
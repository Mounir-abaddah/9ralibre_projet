import boite_A_Merveille from '/boite_a_merveille.jpg'
import antigone from '/antigone.jpg'
import Derniere from '/Dernier_jour_dun_condamne.jpg'
import Candide from '/Candide.jpg'
import Honore from '/Honore.jpeg'
import { Link } from 'react-router-dom'
import { useProtectedRoutes } from '@/store/userStore'
import { useTranslation } from 'react-i18next'

const Histoire = () => {
    const { t } = useTranslation();
    document.title = t("stories.pageTitle")
    const { data } = useProtectedRoutes();

    const books = [
        {
            img: boite_A_Merveille,
            title: "La Boîte à merveilles",
            author: "Ahmed Sefrioui",
            year: "1954",
            genre: t("stories.genres.autobiographicalNovel"),
            path: `/Histoire/Boite/${data?.niveaux}`
        },
        {
            img: antigone,
            title: "Antigone",
            author: "Jean Anouilh",
            year: "1944",
            genre: t("stories.genres.modernTragedy"),
            path: `/Histoire/Antigone/${data?.niveaux}`
        },
        {
            img: Derniere,
            title: "Le Dernier Jour d'un condamné",
            author: "Victor Hugo",
            year: "1829",
            genre: t("stories.genres.novel"),
            path: `/Histoire/DJC/${data?.niveaux}`
        },
        {
            img: Candide,
            title: "Candide ou l'Optimisme",
            author: "Voltaire",
            year: "1759",
            genre: t("stories.genres.philosophicalTale"),
            path: `/Histoire/Candide/${data?.niveaux}`
        },
        {
            img: Honore,
            title: "Le Père Goriot",
            author: "Honoré de Balzac",
            year: "1835",
            genre: t("stories.genres.realistNovel"),
            path: `/Histoire/Honore/${data?.niveaux}`
        }
    ];

    return (
        <div className="px-4 py-8">

            {/* ── Header ── */}
            <div className="mb-10 border-l-2 border-amber-400 pl-4">
                <p className="mb-1 text-xs font-medium tracking-widest text-amber-500 uppercase">
                    {t("stories.collection")}
                </p>
                <h1 className="mb-3 text-4xl leading-tight font-light text-gray-900 dark:text-gray-100">
                    {t("stories.title")} <span className="italic">{t("stories.titleHighlight")}</span>
                </h1>
                <p className="max-w-lg text-sm leading-relaxed font-light text-gray-500 dark:text-gray-400">
                    {t("stories.description")}
                </p>
                <div className="mt-4 flex items-center gap-2 text-xs tracking-widest text-gray-400 uppercase">
                    <span className="block h-px w-5 bg-amber-400" />
                    {t("stories.availableWorks", { count: books.length })}
                </div>
            </div>

            {/* ── Divider ── */}
            <div className="mb-10 flex items-center gap-3">
                <div className="h-px flex-1 bg-gradient-to-r from-stone-200 to-transparent dark:from-stone-700" />
                <div className="h-1.5 w-1.5 rotate-45 bg-amber-400" />
                <div className="h-px flex-1 bg-gradient-to-l from-stone-200 to-transparent dark:from-stone-700" />
            </div>

            {/* ── Grid ── */}
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {books.map((book, i) => (
                    <div key={i} className="group">
                        <Link to={book.path}>
                            {/* Book cover wrapper */}
                            <div className="relative aspect-[2/3] w-full overflow-hidden rounded-r-xl
                                            shadow-[0_8px_24px_rgba(0,0,0,0.15)] transition-transform duration-500
                                            ease-out
                                            group-hover:-translate-y-2
                                            group-hover:shadow-[0_16px_40px_rgba(0,0,0,0.25)]">

                                {/* Spine illusion */}
                                <div className="absolute top-1 bottom-1 left-0 z-10 w-1
                                                rounded-l-sm bg-gradient-to-r from-stone-500 to-stone-300" />

                                {/* Cover image */}
                                <img
                                    src={book.img}
                                    alt={book.title}
                                    className="h-full w-full object-cover
                                               transition-transform duration-500
                                               group-hover:scale-105"
                                />

                                {/* Genre badge */}
                                <div className="absolute top-2 right-2 z-20
                                                -translate-y-1 rounded-sm bg-black/70
                                                px-2 py-0.5
                                                text-[10px] tracking-wider text-amber-200
                                                uppercase opacity-0
                                                transition-all duration-300
                                                group-hover:translate-y-0 group-hover:opacity-100">
                                    {book.genre}
                                </div>

                                {/* Bottom overlay + CTA */}
                                <div className="absolute inset-x-0 bottom-0 z-20
                                                flex items-end justify-center bg-gradient-to-t
                                                from-black/85 via-black/30 to-transparent
                                                px-3 pt-10 pb-3
                                                opacity-0 transition-opacity duration-300
                                                group-hover:opacity-100">
                                    <span className="rounded-sm border border-amber-400/50
                                                     px-3 py-1 text-[11px]
                                                     tracking-widest text-amber-200 uppercase">
                                        {t("stories.read")} →
                                    </span>
                                </div>
                            </div>
                        </Link>

                        {/* Book metadata */}
                        <div className="mt-3">
                            <p className="text-sm leading-snug font-normal text-gray-800 dark:text-gray-200">
                                {book.title}
                            </p>
                            <p className="mt-1.5 flex items-center gap-1.5 text-xs font-light text-gray-400">
                                <span className="inline-block h-px w-3 shrink-0 bg-amber-400" />
                                {book.author}
                            </p>
                            <p className="mt-0.5 pl-[18px] text-[11px] text-gray-300 dark:text-gray-600">
                                {book.year}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Histoire;
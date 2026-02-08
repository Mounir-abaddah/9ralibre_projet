import boite_A_Merveille from '/boite_a_merveille.jpg'
import antigone from '/antigone.jpg'
import Derniere from '/Dernier_jour_dun_condamne.jpg'
import Candide from '/Candide.jpg'
import Honore from '/Honore.jpeg'
import Vieux from '/vieux.jpg'
import { Link } from 'react-router-dom'

const Histoire = () => {
    document.title = "Histoire | 9ralibre"
    const books = [
    {
        img: boite_A_Merveille,
        title: "La Boîte à merveilles",
        author: "Ahmed Sefrioui",
        path: "https://conjuguer.e-monsite.com/medias/files/boite.pdf"
    },
    {
        img: antigone,
        title: "Antigone",
        author: "Jean Anouilh",
        path: "https://conjuguer.e-monsite.com/medias/files/antigone-texte-integral.pdf"
    },
    {
        img: Derniere,
        title: "Le Dernier Jour d’un condamné",
        author: "Victor Hugo",
        path: "https://beq.ebooksgratuits.com/vents/hugo-claude.pdf"
    },
    {
        img: Candide,
        title: "Candide ou l'optimisme",
        author: "Voltaire",
        path: "https://candide.bnf.fr/candide.pdf"
    },
    {
        img: Honore,
        title: "Le Père Goriot",
        author: "Honoré de Balzac",
        path: "https://beq.ebooksgratuits.com/balzac/Balzac-39.pdf"
    },
    {
        img: Vieux,
        title: "Il était une fois un vieux couple heureux",
        author: "Mohammed Khaïr-Eddine",
        path: "https://excerpts.numilog.com/books/9782020550918.pdf"
    },
    ];

return (
    <div className="grid w-full grid-cols-1 place-items-center gap-8 p-8 sm:grid-cols-2 md:grid-cols-3">
    {books.map((book, i) => (
        <div
        key={i}
        className="group flex w-[260px] cursor-pointer flex-col items-center gap-3"
        >
        {/* Carte livre */}
        <Link to={book.path} target='_blank' className="h-[380px] w-full overflow-hidden rounded-xl shadow-xl transition-transform duration-500 group-hover:scale-105 group-hover:rotate-1">
            <img
            src={book.img}
            alt={book.title}
            className="h-full w-full object-cover"
            loading="lazy"
            />
        </Link>
        <p className="text-center text-lg font-semibold">{book.title} - {book.author}</p>
        </div>
    ))}
    </div>
);
};

export default Histoire;

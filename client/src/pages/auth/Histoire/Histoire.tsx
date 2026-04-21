import boite_A_Merveille from '/boite_a_merveille.jpg'
import antigone from '/antigone.jpg'
import Derniere from '/Dernier_jour_dun_condamne.jpg'
import Candide from '/Candide.jpg'
import Honore from '/Honore.jpeg'
import { Link } from 'react-router-dom'
import { useProtectedRoutes } from '@/store/userStore'

const Histoire = () => {
    document.title = "Histoire | 9ralibre"
    const {data} =   useProtectedRoutes();

    const books = [
    {
        img: boite_A_Merveille,
        title: "La Boîte à merveilles",
        author: "Ahmed Sefrioui",
        path: `/Histoire/Boite/${data?.niveaux}`
    },
    {
        img: antigone,
        title: "Antigone",
        author: "Jean Anouilh",
        path: `/Histoire/Antigone/${data?.niveaux}`
    },
    {
        img: Derniere,
        title: "Le Dernier Jour d’un condamné",
        author: "Victor Hugo",
        path: `/Histoire/DJC/${data?.niveaux}`
    },
    {
        img: Candide,
        title: "Candide ou l'optimisme",
        author: "Voltaire",
        path: `/Histoire/Candide/${data?.niveaux}`
    },
    {
        img: Honore,
        title: "Le Père Goriot",
        author: "Honoré de Balzac",
        path: `/Histoire/Honore/${data?.niveaux}`
    }
    ];

return (
    <>
        <div>
            <h1 className='text-2xl font-semibold'>Découvertes organisées</h1>
            <p className="max-w-3xl text-sm text-gray-600">
                Découvrez un univers d’histoires captivantes à travers une collection d’œuvres littéraires soigneusement sélectionnées. 
                Du patrimoine marocain aux grands classiques français, chaque livre vous invite à explorer des récits profonds, 
                à développer votre esprit critique et à enrichir votre culture générale.
            </p>
        </div>
        <div className="grid w-full grid-cols-1 place-items-center gap-8 p-8 sm:grid-cols-2 md:grid-cols-3">
            {books.map((book, i) => (
                <div key={i} className="book group w-[260px] cursor-pointer">
                    <Link to={book.path}>
                        <div className="book-inner relative h-[380px] w-full">
                        <div className="book-cover absolute inset-0 overflow-hidden rounded-xl shadow-2xl">
                            <img
                            src={book.img}
                            alt={book.title}
                            className="h-full w-full object-cover"
                            />
                        </div>
                        <div className="book-side rounded-r-xl"></div>
                        </div>
                    </Link>

                    <p className="mt-3 text-center text-lg font-semibold">
                        {book.title} - {book.author}
                    </p>
                </div>
            ))}
        </div>
    </>
    
);
};

export default Histoire;

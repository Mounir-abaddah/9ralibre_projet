import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '../ui/navigation-menu';
import logo from "@/assets/images/9ralibre.png";
import { useTheme } from "@/context/ThemeContext";
import {
Moon,
Sun,
Menu,
X,
Atom, Calculator, FlaskConical,
PlayCircle,
Video,
DraftingCompass,
Facebook,
Instagram,
Linkedin,
Info,
Book,
Trophy,
Brain
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useProtectedRoutes, type typeAllData } from "@/store/userStore";
import Avatare from "./Avatar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";

const Navbar = () => {
const { theme, toggleTheme } = useTheme();
const { data, fetchData, loading, error } = useProtectedRoutes();
const isMobile = useIsMobile();
const navigate = useNavigate()
const [open, setOpen] = useState(false);


return (
    <>
    <div className='flex w-full items-end justify-end bg-gray-800 p-1'>
        <div className='flex items-center gap-3'>
            <Facebook size={16} color='#fff'/>
            <Instagram size={16} color='#fff'/>
            <Linkedin size={16} color='#fff'/>
        </div>
    </div>
    {/* `isolate` + z-index élevé: évite que le menu passe derrière les cards */}
    <div className="relative z-[9999] isolate flex w-full items-center justify-between overflow-visible bg-white/80 px-4 py-3 shadow-md backdrop-blur dark:bg-gray-900/80">
        <div className="flex items-center gap-2">
        <img src={logo} alt="logo" className="w-10" loading='lazy'/>
        <span className="text-lg font-bold text-gray-800 dark:text-white">
            9ralibre
        </span>
        </div>

        {!isMobile && <MenuLinkItem />}

        {!isMobile ? (
        <div className="flex items-center gap-3">
            {data ? (
            <>
            <Avatare
                data={data}
                fetchData={fetchData}
                loading={loading}
                error={error}
            />
            <button
            onClick={toggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-lg border text-gray-800 transition hover:scale-110 hover:rotate-12 dark:text-white"
            >
            {theme === "dark" ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <button
            onClick={()=>navigate('/Drawing')}
            className="flex h-10 w-10 items-center justify-center rounded-lg border text-gray-800 transition hover:scale-110 hover:rotate-12 dark:text-white"
            >
            <DraftingCompass size={18}/>
            </button>
            </>
            ) : (
            <>
            <button
            onClick={toggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-lg border text-gray-800 transition hover:scale-110 hover:rotate-12 dark:text-white"
            >
            {theme === "dark" ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <Link
            to="/inscription"
            className="rounded-lg bg-amber-400 px-4 py-2 text-sm font-medium text-black transition hover:bg-amber-500"
            >
            Inscription
            </Link>
            <Link
            to="/prof-connexion"
            className="rounded-lg bg-cyan-400 px-4 py-2 text-sm font-medium text-black transition hover:bg-cyan-500"
            >
            Espace Professeur
            </Link>
            </>
            )}
        </div>
        ) : (
        <button onClick={() => setOpen(!open)}>
            {open ? <X size={26} /> : <Menu size={26} />}
        </button>
        )}
    </div>

    {isMobile && open && (
        // eslint-disable-next-line tailwindcss/no-custom-classname
        <div className="animate-in slide-in-from-top fixed top-16 z-40 min-h-screen w-full bg-white px-5 py-6 dark:bg-gray-900">
        <MobileMenu data={data} loading={loading}
                error={error} fetchData={fetchData}/>
        </div>
    )}
    </>
);
};

export default Navbar;




const MobileMenu = ({data,loading,error,fetchData}:typeAllData) => {
return (
    <div className="flex flex-col gap-6 text-gray-800 dark:text-white">
    <Link to="/" className="text-lg font-semibold">Accueil</Link>
    <Link to="/cours" className="text-lg font-semibold">Cours</Link>
    <Link to="/videos" className="text-lg font-semibold">Vidéos</Link>
    <Link to="/videos" className="text-lg font-semibold">A propos</Link>
    {data ? 
        <Avatare data={data} loading={loading} error={error} fetchData={fetchData} /> 
    : 
        <>
            <Link to="/inscription" className="rounded-lg bg-amber-400 p-2 text-center text-black">
                Inscription
            </Link>
            <Link to="/connexion" className="rounded-lg bg-cyan-400 p-2 text-center text-black">
                Espace Professeur
            </Link>
        </>
    }
    </div>
);
};

const MenuLinkItem = () => {

const {data} = useProtectedRoutes();

const coursesMenu = [
  {
    icon: <Calculator size={20} />,
    title: "Mathématiques",
    description: "Algèbre, analyse...",
    href: `/Cours/${data?.niveaux}?matiere=Mathématiques`
  },
  {
    icon: <Atom size={20} />,
    title: "Physique et Chimie",
    description: "Mécanique, électricité",
    href: `/Cours/${data?.niveaux}?matiere=Physique+et+Chimie`
  },
  {
    icon: <FlaskConical size={20} />,
    title: "SVT",
    description: "SVT",
    href: `/Cours/${data?.niveaux}?matiere=SVT`
  },
  {
    icon: <Book size={20} />,
    title: "Tout les cours",
    description: "cours",
    href: `/Cours/${data?.niveaux}`
  },
];

const videosMenu = [
    {
        icon: <Video size={20} />,
        title: "Mathématiques",
        description: "Cours vidéo, exercices corrigés",
        href: `/Videos/${data?.niveaux}/?matiere=Mathématiques`
    },
    {
        icon: <Video size={20} />,
        title: "Physique-Chimie",
        description: "Expériences et démonstrations",
        href: `/Videos/${data?.niveaux}/?matiere=Physique+et+Chimie`
    },
    {
        icon: <Video size={20} />,
        title: "SVT",
        description: "Cours animés et simulations",
        href: `/Videos/${data?.niveaux}/?matiere=Mathématiques`
    },
    {
        icon: <PlayCircle size={20} />,
        title: "Toutes les vidéos",
        description: "Parcourir l'intégralité du contenu",
        href: `/Videos/${data?.niveaux}/?matiere=Mathématiques`
    },
];

const quizMenu = [
  {
    icon: <Brain size={20} />,
    title: "Quiz disponibles",
    description: "Tester vos connaissances",
    href: `/Quiz/${data?.niveaux}`
  },
  {
    icon: <Trophy size={20} />,
    title: "Résultats",
    description: "Voir vos scores",
    href: `/Quiz/${data?.niveaux}`
  },
];


return (
    <NavigationMenu viewport={false} className='z-50'>
        <NavigationMenuList className='z-50'>
            <NavigationMenuItem className='z-50'>
            <NavigationMenuTrigger className='!bg-inherit'>Apprendre</NavigationMenuTrigger>            
            <NavigationMenuContent className='z-50'>
                <ul className=" w-[600px] gap-3 rounded-xl p-4 shadow-xl">
                {coursesMenu.map((item, index) => (
                    <li
                    key={index}
                    className="flex cursor-pointer items-start gap-3 rounded-lg p-2 transition hover:bg-gray-200 hover:dark:bg-gray-800"
                    >
                    {item.icon}
                    <Link to={item.href}>
                        <h4 className="text-sm font-semibold">{item.title}</h4>
                        <p className="text-xs text-gray-500">{item.description}</p>
                    </Link>
                    </li>
                ))}
                </ul>
            </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
            <NavigationMenuTrigger className='!bg-inherit'>Cours en vidéo</NavigationMenuTrigger>
            <NavigationMenuContent>
                <ul className=" w-[450px] grid-cols-2 gap-3 rounded-xl p-4 shadow-xl">
                {videosMenu.map((item, index) => (
                    <li
                    key={index}
                    className="flex cursor-pointer items-start gap-3 rounded-lg p-2 transition hover:bg-gray-200 hover:dark:bg-gray-800"
                    >
                    {item.icon}
                    <Link to={item.href}>
                        <h4 className="text-sm font-semibold">{item.title}</h4>
                        <p className="text-xs text-gray-500">{item.description}</p>
                    </Link>
                    </li>
                ))}
                </ul>
            </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
            <NavigationMenuTrigger className='!bg-inherit'>Quiz & Exercices</NavigationMenuTrigger>
            <NavigationMenuContent>
                <ul className=" w-[450px] grid-cols-2 gap-3 rounded-xl p-4 shadow-xl">
                {quizMenu.map((item, index) => (
                    <li
                    key={index}
                    className="flex cursor-pointer items-start gap-3 rounded-lg p-2 transition hover:bg-gray-200 hover:dark:bg-gray-800"
                    >
                    {item.icon}
                    <Link to={item.href}>
                        <h4 className="text-sm font-semibold">{item.title}</h4>
                        <p className="text-xs text-gray-500">{item.description}</p>
                    </Link>
                    </li>
                ))}
                </ul>
            </NavigationMenuContent>
            </NavigationMenuItem>

            {!data && (
                <NavigationMenuItem>
                    <NavigationMenuLink>
                        <Link to="/About" className='flex items-center gap-1'><Info size={14}/> A propos</Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>
            )}
        </NavigationMenuList>
    </NavigationMenu>
);
}

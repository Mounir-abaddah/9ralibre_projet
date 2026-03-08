import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger } from '../ui/navigation-menu';
import logo from "@/assets/images/9ralibre.png";
import { useTheme } from "@/context/ThemeContext";
import {
Moon,
Sun,
Menu,
X,
Atom, BookOpen, Calculator, Dna, FlaskConical, Globe,
GraduationCap,
Library,
PlayCircle,
Video,
DraftingCompass,
Facebook,
Instagram,
Linkedin
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
    <div className="flex w-full items-center justify-between bg-white/80 px-4 py-3 shadow-md backdrop-blur dark:bg-gray-900/80">
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
            to="/connexion"
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

    const coursesMenu = [
    {
        icon: <Calculator size={20} />,
        title: "Mathématiques",
        description: "Algèbre, géométrie, analyse",
        href: "/cours/mathematiques"
    },
    {
        icon: <Atom size={20} />,
        title: "Physique",
        description: "Mécanique, électricité, optique",
        href: "/cours/physique"
    },
    {
        icon: <FlaskConical size={20} />,
        title: "Chimie",
        description: "Chimie générale et organique",
        href: "/cours/chimie"
    },
    {
        icon: <Dna size={20} />,
        title: "SVT",
        description: "Biologie, génétique, écologie",
        href: "/cours/svt"
    },
    {
        icon: <Globe size={20} />,
        title: "Sciences Humaines",
        description: "Histoire, géographie, philosophie",
        href: "/cours/sciences-humaines"
    },
    {
        icon: <BookOpen size={20} />,
        title: "Langues",
        description: "Français, anglais, arabe",
        href: "/cours/langues"
    }
];

const videosMenu = [
    {
        icon: <Video size={20} />,
        title: "Mathématiques",
        description: "Cours vidéo, exercices corrigés",
        href: "/videos/mathematiques"
    },
    {
        icon: <Video size={20} />,
        title: "Physique-Chimie",
        description: "Expériences et démonstrations",
        href: "/videos/physique-chimie"
    },
    {
        icon: <Video size={20} />,
        title: "SVT",
        description: "Cours animés et simulations",
        href: "/videos/svt"
    },
    {
        icon: <PlayCircle size={20} />,
        title: "Toutes les vidéos",
        description: "Parcourir l'intégralité du contenu",
        href: "/videos"
    }
];

const niveauxMenu = [
    {
        icon: <Library size={20} />,
        title: "Collège",
        description: "De la 6ème à la 3ème",
        href: "/niveau/college"
    },
    {
        icon: <GraduationCap size={20} />,
        title: "Lycée",
        description: "Seconde, Première, Terminale",
        href: "/niveau/lycee"
    }
];

return (
    <NavigationMenu>
        <NavigationMenuList>
            <NavigationMenuItem>
            <NavigationMenuTrigger className="bg-transparent text-black dark:text-white">Cours</NavigationMenuTrigger>
            <NavigationMenuContent>
                <ul className="grid w-[600px] gap-3 rounded-xl p-4 shadow-xl md:grid-cols-2">
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
            <NavigationMenuTrigger className="bg-transparent text-black dark:text-white">Vidéos</NavigationMenuTrigger>
            <NavigationMenuContent>
                <ul className="grid w-[450px] grid-cols-2 gap-3 rounded-xl p-4 shadow-xl">
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
            <NavigationMenuTrigger className="bg-transparent text-black dark:text-white">Niveaux</NavigationMenuTrigger>
            <NavigationMenuContent>
                <ul className="grid w-[250px] gap-3 rounded-xl p-4 shadow-xl">
                {niveauxMenu.map((item, index) => (
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

        </NavigationMenuList>
        </NavigationMenu>
);
}
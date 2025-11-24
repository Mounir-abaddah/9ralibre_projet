import {
NavigationMenu,
NavigationMenuContent,
NavigationMenuItem,
NavigationMenuList,
NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import logo from '@/assets/images/9ralibre.png'
import { useTheme } from "@/context/ThemeContext";
import {
Moon,
Sun,
Calculator,
Atom,
FlaskConical,
Dna,
Globe,
BookOpen,
GraduationCap,
Library,
Video,
PlayCircle
} from "lucide-react";
import { Link } from "react-router-dom";
import { useProtectedRoutes } from "@/store/userStore";
import Avatare from "./Avatar";

const Navbar = () => {
const { theme, toggleTheme } = useTheme();
const { data, fetchData, loading, error } = useProtectedRoutes();

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
    <>
    <div className="flex w-full items-center justify-between rounded-md bg-gray-700 p-3 shadow-md">
        <div className="flex items-center gap-2">
        <img src={logo} alt="logo_9ralibre" width={40} />
        <h5>9ralibre</h5>
        </div>

        <NavigationMenu>
        <NavigationMenuList>

            <NavigationMenuItem>
            <NavigationMenuTrigger className="bg-transparent text-white">Cours</NavigationMenuTrigger>
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
            <NavigationMenuTrigger className="bg-transparent text-white">Vidéos</NavigationMenuTrigger>
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
            <NavigationMenuTrigger className="bg-transparent text-white">Niveaux</NavigationMenuTrigger>
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

        <div className="flex items-center gap-3">
        {data ? (
            <Avatare data={data} fetchData={fetchData} loading={loading} error={error} />
        ) : (
            <>
            <Link
                to={'/inscription'}
                className="cursor-pointer rounded-md bg-amber-400 p-2 text-sm font-medium text-black hover:bg-amber-500"
            >
                Inscription
            </Link>
            <Link
                to={'/connexion'}
                className="cursor-pointer rounded-md bg-cyan-400 p-2 text-sm font-medium text-black hover:bg-cyan-500"
            >
                Connexion
            </Link>
            </>
        )}

        <button
            onClick={toggleTheme}
            className="flex size-10 cursor-pointer items-center justify-center rounded-md border text-white transition-all duration-300 hover:scale-110 hover:rotate-12"
            aria-label="Toggle theme"
        >
            {theme === "dark" ? <Moon size={20} /> : <Sun size={20} />}
        </button>
        </div>
    </div>
    </>
);
};

export default Navbar;
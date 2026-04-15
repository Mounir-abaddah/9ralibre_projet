import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '../ui/navigation-menu';
import logo from "@/assets/images/9ralibre_logo.png";
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
Book,
Trophy,
Brain,
Bell
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useProtectedRoutes, type typeAllData } from "@/store/userStore";
import Avatare from "./Avatar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { socket } from "@/config/socket";
import type { typeChat } from "@/pages/auth/Chat/types/ChatType";
import type { typeMessage } from "@/pages/auth/Chat/types/MessageType";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const Navbar = () => {
const { theme, toggleTheme } = useTheme();
const { data, fetchData, loading, error } = useProtectedRoutes();
const isMobile = useIsMobile();
const navigate = useNavigate()
const [open, setOpen] = useState(false);
const location = useLocation();
const apiUrl = import.meta.env.VITE_API_URL;
const [conversations, setConversations] = useState<typeChat[]>([]);

const unreadTotal = useMemo(() => {
    return conversations.reduce((sum, conv) => sum + (conv.unreadCount || 0), 0);
}, [conversations]);

const refreshConversations = async () => {
    if (!data?.id) return;
    const res = await axios.get(`${apiUrl}/chat/my-conversation`, { withCredentials: true });
    setConversations(res.data);
};

useEffect(() => {
    if (!data?.id) return;
    refreshConversations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
}, [data?.id, apiUrl]);

useEffect(() => {
    if (!data?.id) return;

    socket.connect();
    socket.emit("user:online", data.id);

    const onReceive = async (newMessage: typeMessage) => {
        const senderId = typeof newMessage.sender === "string" ? newMessage.sender : newMessage.sender?.id;
        const isMine = senderId === data.id;
        if (!isMine) {
            const isChatPage = location.pathname.startsWith("/Chat/start/");
            if (!isChatPage) {
                toast.success("Nouveau message reçu");
            }
            await refreshConversations();
        }
    };

    socket.on("message:receive", onReceive);

    return () => {
        socket.off("message:receive", onReceive);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
}, [data?.id, location.pathname, apiUrl]);

return (
    <>
    <div className="relative isolate z-[9999] flex w-full items-center justify-between overflow-visible bg-white/80 px-4 py-3 shadow-md backdrop-blur dark:bg-gray-900/80">
        <div className="flex items-center gap-2">
        <Link to={'/'} className='flex items-center gap-1'>
            <img src={logo} alt="logo" width={200}  loading='lazy'/>
        </Link>
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
            <Popover>
                <PopoverTrigger asChild>
                    <button
                        className="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border text-gray-800 dark:text-white"
                        aria-label="Notifications"
                    >
                        <Bell size={18}/>
                        {unreadTotal > 0 && (
                            <span className="absolute -top-1 -right-1 min-w-5 rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] leading-none font-semibold text-white">
                                {unreadTotal > 99 ? "99+" : unreadTotal}
                            </span>
                        )}
                    </button>
                </PopoverTrigger>
                <PopoverContent className="relative top-6 w-92 p-0 shadow-2xl">
                    <div className="flex items-center justify-between border-b p-3">
                        <p className="text-sm font-semibold">Notifications</p>
                        <button
                            className="text-xs text-cyan-600 hover:underline"
                            onClick={() => navigate(`/Chat/${data.niveaux}`)}
                            type="button"
                        >
                            Ouvrir la messagerie
                        </button>
                    </div>
                    <div className="max-h-80 overflow-y-auto p-2">
                        {conversations.filter(c => c.unreadCount > 0).length === 0 ? (
                            <div className="p-3 text-sm text-gray-500">
                                Aucune notification pour le moment.
                            </div>
                        ) : (
                            conversations
                                .filter(c => c.unreadCount > 0)
                                .slice(0, 8)
                                .map((conv) => {
                                    const otherUser = conv.members.find(m => m._id !== data.id);
                                    const title = otherUser ? `${otherUser.nom} ${otherUser.prenom}` : "Conversation";
                                    const preview = conv.lastMessage?.text ?? "";
                                    return (
                                        <button
                                            key={conv._id}
                                            type="button"
                                            onClick={() => navigate(`/Chat/start/${conv._id}`)}
                                            className="flex w-full items-start justify-between gap-3 rounded-lg p-3 text-left transition hover:bg-gray-50 dark:hover:bg-gray-800"
                                        >
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-medium">{title}</p>
                                                <p className="line-clamp-2 text-xs text-gray-500">{preview}</p>
                                            </div>
                                            <span className="shrink-0 rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
                                                {conv.unreadCount}
                                            </span>
                                        </button>
                                    );
                                })
                        )}
                    </div>
                </PopoverContent>
            </Popover>
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
    <Link to={`/cours/${data?.niveaux}`} className="text-lg font-semibold">Cours</Link>
    <Link to={`/videos/${data?.niveaux}`} className="text-lg font-semibold">Vidéos</Link>
    <Link to="/About" className="text-lg font-semibold">A propos</Link>
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
                <ul className=" w-[600px] gap-3 rounded-xl p-4">
                {coursesMenu.map((item, index) => (
                    <li
                    key={index}
                    className="flex cursor-pointer items-start gap-3 rounded-lg p-3 transition hover:bg-gray-200 hover:dark:bg-gray-800"
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
                <ul className=" w-[450px] grid-cols-2 gap-3 rounded-xl p-4">
                {videosMenu.map((item, index) => (
                    <li
                    key={index}
                    className="flex cursor-pointer items-start gap-3 rounded-lg p-3 transition hover:bg-gray-200 hover:dark:bg-gray-800"
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
                <ul className=" w-[450px] grid-cols-2 gap-3 rounded-xl p-4">
                {quizMenu.map((item, index) => (
                    <li
                    key={index}
                    className="flex cursor-pointer items-start gap-3 rounded-lg p-3 transition hover:bg-gray-200 hover:dark:bg-gray-800"
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
                        <Link to="/About">A propos</Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>
            )}
        </NavigationMenuList>
    </NavigationMenu>
);
}

import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '../ui/navigation-menu';
import logo from "@/assets/images/9ralibre_logo.png";
import { useTheme } from "@/context/ThemeContext";
import {
Moon,
Sun,
Menu,
Atom, Calculator, FlaskConical,
PlayCircle,
Video,
DraftingCompass,
Book,
Trophy,
Lock,
Brain,
Bell,
House,
Calendar
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
import { Button } from '../ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet';
import ConnexionModal from '../ConnexionModal/ConnexionModal';
import AvatarMobile from './AvatarMobile';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

const Navbar = () => {
const { theme, toggleTheme } = useTheme();
const { data, fetchData, loading, error } = useProtectedRoutes();
const isMobile = useIsMobile();
const [isCompactNav, setIsCompactNav] = useState(isMobile);
const [openModal,setOpenModal] = useState(false)
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

useEffect(() => {
    const checkCompactNav = () => {
        setIsCompactNav(window.innerWidth < 1280);
    };
    checkCompactNav();
    window.addEventListener("resize", checkCompactNav);
    return () => window.removeEventListener("resize", checkCompactNav);
}, []);

useEffect(() => {
    setOpen(false);
}, [location.pathname]);

useEffect(() => {
    if (!(isCompactNav && open)) {
        document.body.style.overflow = "";
        return;
    }

    document.body.style.overflow = "hidden";
    return () => {
        document.body.style.overflow = "";
    };
}, [isCompactNav, open]);

return (
    <>
    <div className="relative isolate z-[9999] flex w-full items-center justify-between overflow-visible bg-white/80 px-4 py-3 shadow-md backdrop-blur dark:bg-gray-900/80">
        <div className="flex items-center gap-2">
        <Link to={'/'} className='flex items-center gap-1'>
            <img src={logo} alt="logo" width={200}  loading='lazy'/>
        </Link>
        </div>

        {!isCompactNav && <MenuLinkItem />}

        {!isCompactNav ? (
        <div className="flex items-center gap-3">
            {data ? (
            <>
            <Avatare
                data={data}
                fetchData={fetchData}
                loading={loading}
                error={error}
            />
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant={'outline'}
                        size={'icon'}
                        onClick={toggleTheme}
                        className='cursor-pointer'
                    >
                        {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                    </Button> 
                </TooltipTrigger>
                <TooltipContent className='z-[99999999999999]'>
                    <p>Appearance</p>
                </TooltipContent>
            </Tooltip>
            <Popover>
                <PopoverTrigger asChild>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant={'outline'}
                                size={'icon'}
                                className="relative flex cursor-pointer items-center justify-center rounded-lg border text-gray-800 dark:text-white"
                                aria-label="Notifications"
                            >
                                <Bell />
                                {unreadTotal > 0 && (
                                    <span className="absolute -top-1 -right-1 min-w-5 rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] leading-none font-semibold text-white">
                                        {unreadTotal > 99 ? "99+" : unreadTotal}
                                    </span>
                                )}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent className='z-[99999999999999]'>
                            <p>Notification</p>
                        </TooltipContent>
                    </Tooltip>
                </PopoverTrigger>
                <PopoverContent className="relative top-6 right-1 w-92 p-0 shadow-2xl">
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
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant={'outline'}
                        size={'icon'}
                        className='cursor-pointer'
                        onClick={()=>navigate(`/Calendrier/${data.niveaux}`)}
                    >
                        <Calendar />
                    </Button>
                </TooltipTrigger>
                <TooltipContent className='z-[99999999999999]'>
                    <p>Calendrier</p>
                </TooltipContent>
            </Tooltip>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant={'outline'}
                        size={'icon'}
                        onClick={()=>navigate('/Drawing')}
                        className='cursor-pointer'
                    >
                        <DraftingCompass size={18}/>
                    </Button>
                </TooltipTrigger>
                <TooltipContent className='z-[99999999999999]'>
                    <p>Paint</p>
                </TooltipContent>
            </Tooltip>
            </>
            ) : (
            <>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant={'outline'}
                        size={'icon'}
                        onClick={toggleTheme}
                        className='cursor-pointer'
                    >
                        {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                    </Button> 
                </TooltipTrigger>
                <TooltipContent className='z-[99999999999999]'>
                    <p>Appearance</p>
                </TooltipContent>
            </Tooltip>
            <Button onClick={()=>setOpenModal(!openModal)} variant={'ghost'} className='cursor-pointer'><Lock />Connexion</Button>
            <Link to="/inscription" >
                <Button className='cursor-pointer bg-amber-400 hover:bg-amber-500'>Inscription</Button>
            </Link>
            <Link to="/prof-connexion">
                <Button className='cursor-pointer bg-cyan-400 hover:bg-cyan-500'>Espace Professeur</Button>
            </Link>
            </>
            )}
        </div>
        ) : (
        <div className="flex items-center gap-2">
            {!data ? (
            <Link to="/connexion">
                <Button variant={'outline'} className="h-9 cursor-pointer px-3"><Lock size={16}/>Connexion</Button>
            </Link>
            ):(
                <>
                <Button
                    variant={'outline'}
                    size={'icon'}
                    onClick={toggleTheme}
                    className='cursor-pointer'
                >
                    {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                </Button>
                <Popover>
                <PopoverTrigger>
                    <Tooltip>
                        <TooltipTrigger>
                            <Button
                                variant={'outline'}
                                size={'icon'}
                                className="relative flex cursor-pointer items-center justify-center rounded-lg border text-gray-800 dark:text-white"
                                aria-label="Notifications"
                            >
                                <Bell />
                                {unreadTotal > 0 && (
                                    <span className="absolute -top-1 -right-1 min-w-5 rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] leading-none font-semibold text-white">
                                        {unreadTotal > 99 ? "99+" : unreadTotal}
                                    </span>
                                )}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent className='z-[99999999999999]'>
                            <p>Notification</p>
                        </TooltipContent>
                    </Tooltip>
                </PopoverTrigger>
                <PopoverContent align="end" sideOffset={30} className="top-26 w-[95vw] max-w-sm p-0 shadow-2xl sm:max-w-md md:w-[500px]">
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
                <Button
                    variant={'outline'}
                    size={'icon'}
                    className='cursor-pointer'
                    onClick={()=>navigate(`/Calendrier/${data?.niveaux}`)}
                >
                    <Calendar />
                </Button>
                <Button
                    variant={'outline'}
                    size={'icon'}
                    onClick={()=>navigate('/Drawing')}
                    className='cursor-pointer'
                >
                    <DraftingCompass size={18}/>
                </Button>
                </>
            )}
            <Button
                variant={'outline'}
                onClick={() => setOpen(true)}
                className="cursor-pointer rounded-md p-2 transition hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="Ouvrir le menu"
            >
                <Menu size={26} />
            </Button>
        </div>
        )}
    </div>

    <Sheet open={isCompactNav && open} onOpenChange={setOpen}>
        <SheetContent side="right" className="z-[10000] w-[85%] max-w-sm overflow-y-auto px-5 py-6 sm:w-[420px]">
            <SheetHeader className="p-0">
                <SheetTitle className='cursor-pointer'><Link to={'/'}><House /></Link></SheetTitle>
            </SheetHeader>
            <MobileMenu
                data={data}
                loading={loading}
                error={error}
                fetchData={fetchData}
                onNavigate={() => setOpen(false)}
            />
        </SheetContent>
    </Sheet>

    {openModal && (
        <ConnexionModal openModal={openModal} setOpenModal={setOpenModal}/>
    )}
    </>
);
};

export default Navbar;




type MobileMenuProps = typeAllData & {
    onNavigate: () => void;
};

const MobileMenu = ({ data, onNavigate }: MobileMenuProps) => {
  return (
    <div className="flex h-full flex-col justify-between p-3">
        <div className="flex flex-col gap-6">

                {data && <AvatarMobile data={data} />}

                {/* MENU */}
                <div className="flex flex-col gap-4">
                <Link to="/" onClick={onNavigate}>Accueil</Link>
                <Link to={`/cours/${data?.niveaux}`} onClick={onNavigate}>Cours</Link>
                <Link to={`/videos/${data?.niveaux}`} onClick={onNavigate}>Vidéos</Link>
                {!data && (
                    <>
                        <Link to="/About" onClick={onNavigate}>A propos</Link>
                        <Link to="/prof-connexion" onClick={onNavigate}>Je suis professeur</Link>
                    </>
                )}
                </div>
            </div>

            {/* BOTTOM */}
            {!data ? (
                <div className="flex flex-col gap-2">
                <Link to="/connexion">
                    <Button variant="outline" className="w-full cursor-pointer">Connexion</Button>
                </Link>
                <Link to="/inscription">
                    <Button className="w-full cursor-pointer bg-cyan-500 hover:bg-cyan-600">Inscription</Button>
                </Link>
                </div>
            ):(
                <Button variant={'destructive'} className='cursor-pointer'>Se déconnecter</Button>
            )}
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

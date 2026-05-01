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
Calendar,
Languages,
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
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import i18n from '@/i18n';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
const { t } = useTranslation();
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
const [lang,setLang] = useState(
    localStorage.getItem("lang") || "Fr"
);

useEffect(() => {
  localStorage.setItem("lang", lang);
  i18n.changeLanguage(lang.toLowerCase());
}, [lang]);

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
                toast.success(t("nav.newMessage"));
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

// ─── Shared Notifications Popover Content ───────────────────────────────────
const NotificationsPopoverContent = ({ align }: { align: "end" | "center" }) => (
    <PopoverContent
        align={align}
        sideOffset={10}
        className="z-[999999] w-92 p-0 shadow-2xl"
    >
        <div className="flex items-center justify-between border-b p-3">
            <p className="text-sm font-semibold">{t("nav.notifications")}</p>
            <button
                className="text-xs text-cyan-600 hover:underline"
                onClick={() => navigate(`/Chat/${data?.niveaux}`)}
                type="button"
            >
                {t("nav.openMessaging")}
            </button>
        </div>
        <div className="max-h-80 overflow-y-auto p-2">
            {conversations.filter(c => c.unreadCount > 0).length === 0 ? (
                <div className="p-3 text-sm text-gray-500">
                    {t("nav.noNotifications")}
                </div>
            ) : (
                conversations
                    .filter(c => c.unreadCount > 0)
                    .slice(0, 8)
                    .map((conv) => {
                        const otherUser = conv.members.find(m => m._id !== data?.id);
                        const title = otherUser ? `${otherUser.nom} ${otherUser.prenom}` : t("nav.conversation");
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
);

// ─── Shared Bell Button ──────────────────────────────────────────────────────
const BellButton = () => (
    <Button
        variant={'outline'}
        size={'icon'}
        className="relative flex cursor-pointer items-center justify-center rounded-lg border text-gray-800 dark:text-white"
        aria-label={t("nav.notifications")}
    >
        <Bell />
        {unreadTotal > 0 && (
            <span className="absolute -top-1 -right-1 min-w-5 rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] leading-none font-semibold text-white">
                {unreadTotal > 99 ? "99+" : unreadTotal}
            </span>
        )}
    </Button>
);

// ─── Shared Language Select ──────────────────────────────────────────────────
const LangSelect = () => (
    <Select value={lang} onValueChange={setLang}>
        <SelectTrigger className="h-9 min-w-28 cursor-pointer rounded-lg border bg-white/80 px-2.5 text-xs font-semibold shadow-sm transition hover:bg-white dark:bg-gray-900/70 dark:hover:bg-gray-900">
            <span className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                <Languages size={15} />
                <SelectValue placeholder={t("nav.language")} />
            </span>
        </SelectTrigger>
        <SelectContent className='z-[999999999999999] min-w-28 rounded-lg border'>
            <SelectGroup>
                <SelectItem value="Fr">
                    <span className="flex items-center gap-2 text-xs font-medium">
                        <span>FR</span> Français
                    </span>
                </SelectItem>
                <SelectItem value="En">
                    <span className="flex items-center gap-2 text-xs font-medium">
                        <span>EN</span> English
                    </span>
                </SelectItem>
            </SelectGroup>
        </SelectContent>
    </Select>
);

return (
    <>
    <div className="relative isolate z-[9999] flex w-full items-center justify-between overflow-visible bg-white/80 px-4 py-3 shadow-md backdrop-blur dark:bg-gray-900/80">
        <div className="flex items-center gap-2">
        <Link to={'/'} className='flex items-center gap-1'>
            <img src={logo} alt="logo" width={200} loading='lazy'/>
        </Link>
        </div>

        {!isCompactNav && <MenuLinkItem />}

        {/* ── DESKTOP NAV ── */}
        {!isCompactNav ? (
        <div className="flex items-center gap-3">
            {data ? (
            <>
            <Avatare data={data} fetchData={fetchData} loading={loading} error={error} />

            {/* Theme toggle */}
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant={'outline'} size={'icon'} onClick={toggleTheme} className='cursor-pointer'>
                        {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                    </Button>
                </TooltipTrigger>
                <TooltipContent className='z-[99999999999999]'>
                    <p>{t("nav.appearance")}</p>
                </TooltipContent>
            </Tooltip>

            {/* Language */}
            <Tooltip>
                <TooltipTrigger asChild><LangSelect /></TooltipTrigger>
                <TooltipContent className='z-[99999999999999]'>
                    <p>{t("nav.language")}</p>
                </TooltipContent>
            </Tooltip>

            {/* Notifications */}
            <Tooltip>
                <TooltipTrigger asChild>
                    <Popover>
                        <PopoverTrigger asChild><BellButton /></PopoverTrigger>
                        <NotificationsPopoverContent align="end" />
                    </Popover>
                </TooltipTrigger>
                <TooltipContent className='z-[99999999999999]'>
                    <p>{t("nav.notification")}</p>
                </TooltipContent>
            </Tooltip>

            {/* Calendar */}
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant={'outline'} size={'icon'} className='cursor-pointer' onClick={() => navigate(`/Calendrier/${data.niveaux}`)}>
                        <Calendar />
                    </Button>
                </TooltipTrigger>
                <TooltipContent className='z-[99999999999999]'>
                    <p>{t("nav.calendar")}</p>
                </TooltipContent>
            </Tooltip>

            {/* Drawing */}
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant={'outline'} size={'icon'} onClick={() => navigate('/Drawing')} className='cursor-pointer'>
                        <DraftingCompass size={18}/>
                    </Button>
                </TooltipTrigger>
                <TooltipContent className='z-[99999999999999]'>
                    <p>{t("nav.paint")}</p>
                </TooltipContent>
            </Tooltip>
            </>
            ) : (
            <>
            {/* Theme toggle (guest) */}
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant={'outline'} size={'icon'} onClick={toggleTheme} className='cursor-pointer'>
                        {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                    </Button>
                </TooltipTrigger>
                <TooltipContent className='z-[99999999999999]'>
                    <p>{t("nav.appearance")}</p>
                </TooltipContent>
            </Tooltip>

            {/* Language (guest) */}
            <Tooltip>
                <TooltipTrigger asChild><LangSelect /></TooltipTrigger>
                <TooltipContent className='z-[99999999999999]'>
                    <p>{t("nav.language")}</p>
                </TooltipContent>
            </Tooltip>

            <Button onClick={() => setOpenModal(!openModal)} variant={'ghost'} className='cursor-pointer'>
                <Lock />{t("nav.connexion")}
            </Button>
            <Link to="/inscription">
                <Button className='cursor-pointer bg-amber-400 hover:bg-amber-500'>{t("nav.inscription")}</Button>
            </Link>
            <Link to="/prof-connexion">
                <Button className='cursor-pointer bg-cyan-400 hover:bg-cyan-500'>{t("nav.teacherSpace")}</Button>
            </Link>
            </>
            )}
        </div>

        ) : (
        // ── MOBILE NAV ──
        <div className="flex items-center gap-2">
            {!data ? (
            <Link to="/connexion">
                <Button variant={'outline'} className="h-9 cursor-pointer px-3">
                    <Lock size={16}/>{t("nav.connexion")}
                </Button>
            </Link>
            ) : (
            <>
            {/* Theme toggle (mobile) */}
            <Button variant={'outline'} size={'icon'} onClick={toggleTheme} className='cursor-pointer'>
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </Button>

            {/* Notifications (mobile) */}
            <Tooltip>
                <TooltipTrigger asChild>
                    <Popover>
                        <PopoverTrigger asChild><BellButton /></PopoverTrigger>
                        <NotificationsPopoverContent align="center" />
                    </Popover>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{t("nav.notification")}</p>
                </TooltipContent>
            </Tooltip>

            {/* Calendar (mobile) */}
            <Button variant={'outline'} size={'icon'} className='cursor-pointer' onClick={() => navigate(`/Calendrier/${data?.niveaux}`)}>
                <Calendar />
            </Button>

            {/* Drawing (mobile) */}
            <Button variant={'outline'} size={'icon'} onClick={() => navigate('/Drawing')} className='cursor-pointer'>
                <DraftingCompass size={18}/>
            </Button>
            </>
            )}

            {/* Hamburger */}
            <Button
                variant={'outline'}
                onClick={() => setOpen(true)}
                className="cursor-pointer rounded-md p-2 transition hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label={t("nav.openMenu")}
            >
                <Menu size={26} />
            </Button>
        </div>
        )}
    </div>

    {/* ── MOBILE SHEET ── */}
    <Sheet open={isCompactNav && open} onOpenChange={setOpen}>
        <SheetContent side="right" className="z-[10000] w-[85%] max-w-sm overflow-y-auto px-5 py-6 sm:w-[420px]">
            <SheetHeader className="p-0">
                <SheetTitle className='cursor-pointer'>
                    <Link to={'/'}><House /></Link>
                </SheetTitle>
            </SheetHeader>
            <MobileMenu
                data={data}
                loading={loading}
                error={error}
                fetchData={fetchData}
                lang={lang}
                setLang={setLang}
                theme={theme}
                toggleTheme={toggleTheme}
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


// ─── Mobile Menu ─────────────────────────────────────────────────────────────

type MobileMenuProps = typeAllData & {
    onNavigate: () => void;
    lang: string;
    setLang: (value: string) => void;
    theme: string;
    toggleTheme: () => void;
};

const MobileMenu = ({ data, onNavigate, lang, setLang, theme, toggleTheme }: MobileMenuProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex h-full flex-col justify-between p-3">
        <div className="flex flex-col gap-6">
            {data && <AvatarMobile data={data} />}

            <div className="flex flex-col gap-4">
                <Link to="/" onClick={onNavigate}>{t("nav.home")}</Link>
                <Link to={`/cours/${data?.niveaux}`} onClick={onNavigate}>{t("nav.courses")}</Link>
                <Link to={`/videos/${data?.niveaux}`} onClick={onNavigate}>{t("nav.videos")}</Link>
                {!data && (
                    <>
                        <Link to="/About" onClick={onNavigate}>{t("nav.about")}</Link>
                        <Link to="/prof-connexion" onClick={onNavigate}>{t("nav.iAmTeacher")}</Link>
                    </>
                )}
            </div>
        </div>

        <div className="mt-6 border-t border-gray-200 pt-4 dark:border-gray-700">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              {t("nav.language")}
            </p>
            <div className="mt-2 w-full">
              <Select value={lang} onValueChange={setLang}>
                <SelectTrigger className="h-10 w-full cursor-pointer rounded-lg border bg-white/90 px-2.5 text-sm font-semibold shadow-sm transition hover:bg-white dark:bg-gray-900/70 dark:hover:bg-gray-900">
                  <span className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                      <Languages size={15} />
                      <SelectValue placeholder={t("nav.language")} />
                  </span>
                </SelectTrigger>
                <SelectContent className='z-[999999999999999] min-w-28 rounded-lg border'>
                    <SelectGroup>
                        <SelectItem value="Fr">
                            <span className="flex items-center gap-2 text-xs font-medium">
                                <span>FR</span> Français
                            </span>
                        </SelectItem>
                        <SelectItem value="En">
                            <span className="flex items-center gap-2 text-xs font-medium">
                                <span>EN</span> English
                            </span>
                        </SelectItem>
                    </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="mt-4">
              <Button
                variant="outline"
                className="w-full justify-center"
                onClick={toggleTheme}
              >
                {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
                <span className="ml-2 text-sm">
                  {theme === "dark" ? t("nav.lightMode") : t("nav.darkMode")}
                </span>
              </Button>
            </div>
        </div>

        {!data ? (
            <div className="flex flex-col gap-2">
                <Link to="/connexion">
                    <Button variant="outline" className="w-full cursor-pointer">{t("nav.connexion")}</Button>
                </Link>
                <Link to="/inscription">
                    <Button className="w-full cursor-pointer bg-cyan-500 hover:bg-cyan-600">{t("nav.inscription")}</Button>
                </Link>
            </div>
        ) : (
            <Button variant={'destructive'} className='cursor-pointer'>{t("nav.logout")}</Button>
        )}
    </div>
  );
};


// ─── Desktop Navigation Menu ─────────────────────────────────────────────────

const MenuLinkItem = () => {
const { t } = useTranslation();
const { data } = useProtectedRoutes();

const coursesMenu = [
    {
        icon: <Calculator size={20} />,
        title: t("nav.courses_menu.maths.title"),
        description: t("nav.courses_menu.maths.description"),
        href: `/Cours/${data?.niveaux}?matiere=Mathématiques`
    },
    {
        icon: <Atom size={20} />,
        title: t("nav.courses_menu.physics.title"),
        description: t("nav.courses_menu.physics.description"),
        href: `/Cours/${data?.niveaux}?matiere=Physique+et+Chimie`
    },
    {
        icon: <FlaskConical size={20} />,
        title: t("nav.courses_menu.svt.title"),
        description: t("nav.courses_menu.svt.description"),
        href: `/Cours/${data?.niveaux}?matiere=SVT`
    },
    {
        icon: <Book size={20} />,
        title: t("nav.courses_menu.all.title"),
        description: t("nav.courses_menu.all.description"),
        href: `/Cours/${data?.niveaux}`
    },
];

const videosMenu = [
    {
        icon: <Video size={20} />,
        title: t("nav.courses_menu.maths.title"),
        description: t("nav.videos_menu.maths.description"),
        href: `/Videos/${data?.niveaux}/?matiere=Mathématiques`
    },
    {
        icon: <Video size={20} />,
        title: t("nav.courses_menu.physics.title"),
        description: t("nav.videos_menu.physics.description"),
        href: `/Videos/${data?.niveaux}/?matiere=Physique+et+Chimie`
    },
    {
        icon: <Video size={20} />,
        title: t("nav.courses_menu.svt.title"),
        description: t("nav.videos_menu.svt.description"),
        href: `/Videos/${data?.niveaux}/?matiere=SVT`
    },
    {
        icon: <PlayCircle size={20} />,
        title: t("nav.videos_menu.all.title"),
        description: t("nav.videos_menu.all.description"),
        href: `/Videos/${data?.niveaux}/`
    },
];

const quizMenu = [
    {
        icon: <Brain size={20} />,
        title: t("nav.quiz_menu.available.title"),
        description: t("nav.quiz_menu.available.description"),
        href: `/Quiz/${data?.niveaux}`
    },
    {
        icon: <Trophy size={20} />,
        title: t("nav.quiz_menu.results.title"),
        description: t("nav.quiz_menu.results.description"),
        href: `/Quiz/${data?.niveaux}`
    },
];

return (
    <NavigationMenu viewport={false} className='z-50'>
        <NavigationMenuList className='z-50'>

            {/* Apprendre */}
            <NavigationMenuItem className='z-50'>
                <NavigationMenuTrigger className='!bg-inherit'>{t("nav.learn")}</NavigationMenuTrigger>
                <NavigationMenuContent className='z-50'>
                    <ul className="w-[600px] gap-3 rounded-xl p-4">
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

            {/* Vidéos */}
            <NavigationMenuItem>
                <NavigationMenuTrigger className='!bg-inherit'>{t("nav.videos")}</NavigationMenuTrigger>
                <NavigationMenuContent>
                    <ul className="w-[450px] grid-cols-2 gap-3 rounded-xl p-4">
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

            {/* Quiz */}
            <NavigationMenuItem>
                <NavigationMenuTrigger className='!bg-inherit'>{t("nav.quiz")}</NavigationMenuTrigger>
                <NavigationMenuContent>
                    <ul className="w-[450px] grid-cols-2 gap-3 rounded-xl p-4">
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

            {/* À propos (guest only) */}
            {!data && (
                <NavigationMenuItem>
                    <NavigationMenuLink>
                        <Link to="/About">{t("nav.about")}</Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>
            )}

        </NavigationMenuList>
    </NavigationMenu>
);
};
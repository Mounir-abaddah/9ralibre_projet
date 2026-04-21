import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ChevronDown, Book, Video, BookType, Sheet, BookOpen, MessageCircleMoreIcon, BookmarkCheck, Settings } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import type { typedata } from "@/store/userStore";

interface typeAvatar {
  data: typedata;
}

const AvatarMobile = ({ data }: typeAvatar) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [open, setOpen] = useState(false);

  const menuList = [
    { name: "Dashboard", icon: <Sheet size={18} />, path: `/Dashboard/${data?.niveaux}` },
    { name: "Cours", icon: <Book size={18} />, path: `/Cours/${data?.niveaux}` },
    { name: "Videos", icon: <Video size={18} />, path: `/Videos/${data?.niveaux}` },
    { name: "Quiz", icon: <BookType size={18} />, path: `/Quiz/${data?.niveaux}` },
    { name: "Histoire", icon: <BookOpen size={18} />, path: `/Histoire/${data?.niveaux}` },
    { name: "Messagerie", icon: <MessageCircleMoreIcon size={18} />, path: `/Chat/${data?.niveaux}` },
    { name: "Enregistrer", icon: <BookmarkCheck size={18} />, path: `/Save/${data?.niveaux}` },
    { name: "Paramètre", icon: <Settings size={18} />, path: `/Paramètre/${data?.niveaux}` },
  ]

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-800 dark:bg-gray-900">

        {/* HEADER */}
        <button
            onClick={() => setOpen(!open)}
            className="flex w-full items-center justify-between"
        >
            <div className="flex items-center gap-3">
            <Avatar size="lg" className="size-11 border border-gray-300 dark:border-gray-700">
                <AvatarImage
                src={`${apiUrl}/uploads/images/${data?.id}/${data?.image}`}
                />
                <AvatarFallback className="bg-cyan-500 text-white">
                {data?.nom?.[0]}
                {data?.prenom?.[0]}
                </AvatarFallback>
            </Avatar>

            <div className="text-left">
                <p className="font-semibold text-gray-800 dark:text-white">
                {data?.nom}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                {data?.role}
                </p>
            </div>
            </div>

            <ChevronDown
            size={18}
            className={`text-gray-500 transition-transform duration-300 dark:text-gray-400 ${
                open ? "rotate-180" : ""
            }`}
            />
        </button>

        {/* COLLAPSIBLE */}
        <div
            className={`overflow-hidden transition-all duration-300 ${
            open ? "mt-4 max-h-96" : "max-h-0"
            }`}
        >
            <div className="flex flex-col gap-1">

            {menuList.map((item, index) => (
                <Link
                key={index}
                to={item.path}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                <span className="text-gray-500 dark:text-gray-400">
                    {item.icon}
                </span>
                {item.name}
                </Link>
            ))}

            </div>
        </div>
    </div>
  );
};

export default AvatarMobile;
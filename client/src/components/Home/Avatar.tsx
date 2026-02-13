import type { typeAllData } from "@/store/userStore"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { useRef, useState } from "react"
import { Button } from "../ui/button"
import { Separator } from "../ui/separator"
import { Book, BookmarkCheck, BookOpen, BookType, ChevronDown, LogOut, MessageCircleMoreIcon, Settings, Sheet, Video } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import axios from "axios"
import { createPortal } from "react-dom"

const Avatare = ({ data }: typeAllData) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [menuOpen, setMenuOpen] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);
  const location = useLocation(); 

  const menuList = [
    { name: "Dashboard", icon: <Sheet size={18} />, path: `/Dashboard/${data?.niveaux}` },
    { name: "Cours", icon: <Book size={18} />, path: `/Cours/${data?.niveaux}` },
    { name: "Videos", icon: <Video size={18} />, path: `/Videos/${data?.niveaux}` },
    { name: "Quiz", icon: <BookType size={18} />, path: `/Quiz/${data?.niveaux}` },
    { name: "Histoire", icon: <BookOpen size={18} />, path: `/Histoire/${data?.niveaux}` },
    { name: "Messagerie", icon: <MessageCircleMoreIcon size={18} />, path: `/Chat/${data?.niveaux}` },
    { name: "Enregistrer", icon: <BookmarkCheck size={18} />, path: `/Enregistrer/${data?.niveaux}` },
    { name: "Paramètre", icon: <Settings size={18} />, path: `/Paramètre/${data?.niveaux}` },
  ]

  const handleLogout = async()=>{
    const res = await axios.post(`${apiUrl}/auth/logout`,{},{withCredentials:true});
    if(res.data.success){
      window.location.href='/connexion';
    }
  }

  return (
    <div ref={buttonRef} className="relative z-50" onMouseEnter={() => setMenuOpen(true)} onMouseLeave={() => setMenuOpen(false)}>
      <div className={`flex cursor-pointer items-center gap-3 rounded-full border border-transparent p-1 pr-3 pl-1 transition-all duration-200 hover:bg-gray-600/50 ${menuOpen ? "bg-gray-600/50" : ""}`} onClick={() => setMenuOpen(!menuOpen)}>
        <Avatar className="size-9 border-2 border-gray-600 shadow-sm">
          <AvatarImage src={data?.image} alt={data?.nom} />
          <AvatarFallback className={`text-xs font-bold text-white ${data?.role === "Etudiant" ? "bg-sky-400" : "bg-pink-400"}`}>
            {data?.nom.charAt(0).toUpperCase()}{data?.prenom.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-start">
          <span className="text-sm font-semibold dark:text-gray-100">{data?.nom}</span>
          <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold tracking-wide uppercase shadow-sm ${
              data?.role === "Etudiant" ? "bg-sky-500 text-white" :
              data?.role === "Etudiante" ? "bg-pink-500 text-white" :
              "bg-gray-200 text-gray-700"
            }`}
          >
            {data?.role}
          </span>
        </div>

        <ChevronDown size={16} className={`text-gray-300 transition-transform duration-200 ${menuOpen ? "rotate-180" : ""}`} />
      </div>
      
      {menuOpen &&
        createPortal(
          <div
            className="fixed top-[70px] right-[20px] z-[9999] mt-4 w-64 origin-top-right pt-2"
            onMouseEnter={() => setMenuOpen(true)}
            onMouseLeave={() => setMenuOpen(false)}
          >
            <div className="rounded-xl bg-white p-2 shadow-xl ring-1 ring-black/5">
              <div className="flex flex-col space-y-1">
                {menuList.map((item, index) => {
                  const activeItem = location.pathname === item.path;
                  return (
                    <Link
                      key={index}
                      to={item.path}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 ${
                        activeItem && "bg-gray-100 text-gray-900"
                      }`}
                      onClick={() => setMenuOpen(false)}
                    >
                      <span className="text-gray-400">{item.icon}</span>
                      {item.name}
                    </Link>
                  );
                })}
              </div>

              <Separator className="my-2 bg-gray-100" />

              <div className="p-2">
                <Button
                  onClick={handleLogout}
                  variant={"destructive"}
                  className="w-full cursor-pointer justify-start gap-2 border border-red-100 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700"
                >
                  <LogOut size={16} />
                  Se déconnecter
                </Button>
              </div>
            </div>
          </div>,
          document.body
        )
      }
    </div>
  )
}

export default Avatare
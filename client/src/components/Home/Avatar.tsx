import type { typeAllData } from "@/store/userStore"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { useState } from "react"
import { Button } from "../ui/button"
import { Separator } from "../ui/separator"
import { Book, BookOpen, BookType, ChevronDown, LogOut, MessageCircleMoreIcon, Settings, Video } from "lucide-react"
import { Link } from "react-router-dom"

const Avatare = ({ data }: typeAllData) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const menuList = [
    { name: "Cours", icon: <Book size={18} />, path: "/" },
    { name: "Videos", icon: <Video size={18} />, path: "/" },
    { name: "Quiz", icon: <BookType size={18} />, path: "/" },
    { name: "Histoire", icon: <BookOpen size={18} />, path: "/" },
    { name: "Messagerie", icon: <MessageCircleMoreIcon size={18} />, path: "/" },
    { name: "Paramètre", icon: <Settings size={18} />, path: "/" },
  ]

  return (
    <div className="relative z-50" onMouseEnter={() => setMenuOpen(true)} onMouseLeave={() => setMenuOpen(false)}>
      <div className={`flex cursor-pointer items-center gap-3 rounded-full border border-transparent p-1 pr-3 pl-1 transition-all duration-200 hover:bg-gray-600/50 ${menuOpen ? "bg-gray-600/50" : ""}`} onClick={() => setMenuOpen(!menuOpen)}>
        <Avatar className="size-9 border-2 border-gray-600 shadow-sm">
          <AvatarImage src={data?.image} alt={data?.nom} />
          <AvatarFallback className={`text-xs font-bold text-white ${data?.role === "Etudiant" ? "bg-sky-400" : "bg-pink-400"}`}>
            {data?.nom.charAt(0).toUpperCase()}{data?.prenom.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="hidden flex-col items-start sm:flex">
          <span className="text-sm font-semibold text-gray-100">{data?.nom}</span>
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
      
      <div className={`absolute top-full right-0 w-64 origin-top-right pt-2 transition-all duration-200 ${menuOpen ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-2 opacity-0'}`}>
        <div className="rounded-xl bg-white p-2 shadow-xl ring-1 ring-black/5">
            <div className="p-2">
              <Button className="w-full justify-center bg-gray-900 text-white hover:bg-gray-800">
                Compléter mon profil
              </Button>
            </div>

            <Separator className="my-2 bg-gray-100" />

            <div className="flex flex-col space-y-1">
              {menuList.map((item, index) => (
                <Link 
                  key={index} 
                  to={item.path} 
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
                  onClick={() => setMenuOpen(false)}
                >
                  <span className="text-gray-400 group-hover:text-gray-600">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </div>

            <Separator className="my-2 bg-gray-100" />

            <div className="p-2">
              <Button 
                variant={'destructive'} 
                className="w-full cursor-pointer justify-start gap-2 border border-red-100 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700"
              >
                <LogOut size={16} />
                Se déconnecter
              </Button>
            </div>
        </div>
      </div>
    </div>
  )
}

export default Avatare
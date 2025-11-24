import type { typeAllData } from "@/store/userStore"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
const Avatare = ({data}: typeAllData) => {
  return (
    <div>
        <Avatar className="size-10 cursor-pointer">
            <AvatarImage src={data?.image} alt={data?.nom} />
            <AvatarFallback className={`rounded-lg text-white ${data?.role === "Etudiant" ? "bg-sky-300" : "bg-pink-400"}`}>{data?.nom.charAt(0).toUpperCase()}{data?.prenom.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
    </div>
  )
}

export default Avatare
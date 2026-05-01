import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input"
import type { typeChat } from "@/pages/auth/Chat/types/ChatType";
import { useProfProtectedRoutes } from "@/store/userStore";
import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ChatProfAside = () => {
  const { t } = useTranslation();
  const {chatId} = useParams();
  const apiUrl = import.meta.env.VITE_API_URL;
  const [conversation,setConversation] = useState<typeChat[]>([]);
  const {data} = useProfProtectedRoutes();
  const navigate = useNavigate();
  const [search,setSearch] = useState("")



  useEffect(()=>{
    const getConversation = async()=>{
      const res = await axios.get(`${apiUrl}/prof/my-conversation`,{withCredentials:true})
      setConversation(res.data)
      console.log(res.data);
      
    }
    getConversation();
  },[apiUrl])

const filteredConversations = conversation.filter((conv) => {
  const otherUser = conv.members.find(
    (member) => member._id !== data?.id
  );

  if (!otherUser) return false;

  const fullName = `${otherUser.nom} ${otherUser.prenom}`.toLowerCase();

  return fullName.includes(search.toLowerCase());
});

  return (
    <div className="space-y-2 p-3">
        <Input type="text" placeholder={t("prof.chat.searchInMessaging")} value={search} onChange={(e)=>setSearch(e.target.value)}/>
        <div className="space-y-3">
          {filteredConversations.map((conv)=>{
            const otherUser = conv.members.find(memb => memb._id !== data?._id);
            const isLastMessageMine = conv.lastMessage?.sender === data?.id;
            if (!otherUser) return null;
            return(
              <div key={conv._id} className={`flex cursor-pointer items-center gap-3 rounded-md p-2 transition-all duration-300 ${chatId === conv._id ? "border-cyan-400 bg-cyan-100 text-black" : "hover:bg-gray-50 hover:text-black"}`} 
                onClick={() => navigate(`/prof/Chat/start/${conv._id}`)}
              >
                <Avatar size="lg">
                  <AvatarImage
                    src={`${apiUrl}/uploads/images/${otherUser._id}/${otherUser.image}`}
                    alt="image_utilisateur"
                  />
                  <AvatarFallback className={`rounded font-bold tracking-wide uppercase shadow-sm ${
                    otherUser?.role === "Etudiant" ? "bg-sky-500 text-white" :
                    otherUser?.role === "Etudiante" ? "bg-pink-500 text-white" :
                    "bg-gray-200 text-gray-700"}`}>
                    {otherUser.nom[0]}
                    {otherUser.prenom[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex w-full items-center justify-between">
                  <p className="font-medium">
                    <span className="text-sm">{otherUser.nom} {otherUser.prenom}</span>
                    <span className="line-clamp-1 text-sm text-gray-500">
                      <span className="text-xs font-medium text-gray-700">
                        {isLastMessageMine ? `${t("prof.chat.you")} : ` : `${otherUser.nom} : `}
                      </span>
                      {conv.lastMessage?.text}
                    </span>
                  </p>
                  {conv.unreadCount > 0 && (
                      <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
                        {conv.unreadCount}
                      </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
    </div>
  )
}

export default ChatProfAside
import type { typeChat } from "@/pages/auth/Chat/types/ChatType";
import { useProtectedRoutes } from "@/store/userStore";
import { socket } from "@/config/socket";
import axios from "axios";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Input } from "../ui/input";
import { useNavigate, useParams } from "react-router-dom";

const AsideChat = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { chatId } = useParams();
  const [conversation, setConversation] = useState<typeChat[]>([]);
  const { data } = useProtectedRoutes();
  const navigate = useNavigate();
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  const fetchConversations = async () => {
    const res = await axios.get(`${apiUrl}/chat/my-conversation`, { withCredentials: true });
    setConversation(res.data);
  };

  useEffect(() => {
    fetchConversations();
  }, [apiUrl]);

  // ✅ Rafraîchir la liste quand on reçoit un nouveau message
  useEffect(() => {
    socket.connect();

    // dire au serveur que je suis en ligne
    if (data?.id) {
      socket.emit("user:online", data.id);
    }

    socket.on("users:online", (users: string[]) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.off("users:online");
    };
  }, [data?.id]);

  return (
    <div className="space-y-3 p-3">
      <Input type="text" placeholder="Rechercher dans les messageries" />
      {conversation.map((conv) => {
        const otherUser = conv.members.find((member) => member._id !== data?.id);
        const isLastMessageMine = conv.lastMessage?.sender === data?.id;
        const isOnline = otherUser ? onlineUsers.includes(otherUser._id ?? "") : false;
        return (
          <div
            key={conv._id}
            onClick={() => navigate(`/Chat/start/${conv._id}`)}
            className={`flex cursor-pointer items-center gap-2 rounded-md border p-4 transition
              ${chatId === conv._id ? "border-cyan-400 bg-cyan-100 text-black" : "hover:bg-gray-50 hover:text-black"}`}
          >
            {otherUser ? (
              <>
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={otherUser.image} />
                    <AvatarFallback className={`rounded font-bold tracking-wide uppercase shadow-sm ${
              data?.role === "Etudiant" ? "bg-sky-500 text-white" :
              data?.role === "Etudiante" ? "bg-pink-500 text-white" :
              "bg-gray-200 text-gray-700"
            }`}>
                      {otherUser?.nom[0]}{otherUser?.prenom[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span
                    className={`absolute right-0 bottom-0 h-3 w-3 rounded-full border-2 border-white ${
                      isOnline ? "bg-green-500" : "bg-gray-400"
                    }`}
                  />
                </div>
                <div className="flex w-full flex-col overflow-hidden">
                  <span className="text-base font-medium">{otherUser.nom} {otherUser.prenom}</span>
                  <div className="flex w-full items-center justify-between">
                    <span className="line-clamp-1 text-sm text-gray-500">
                      <span className="font-medium text-gray-700">
                        {isLastMessageMine ? "Vous : " : `${otherUser.nom} : `}
                      </span>
                      {conv.lastMessage?.text}
                    </span>
                    {/* ✅ Badge unread */}
                    {conv.unreadCount > 0 && (
                      <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <span className="text-gray-400">Utilisateur inconnu</span>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default AsideChat;
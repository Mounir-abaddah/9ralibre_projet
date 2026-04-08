import AsideChat from "@/components/Chat/AsideChat"
import Work_Chat from "@/assets/images/Work chat-cuate.png"
import axios from "axios";
import { useEffect, useState } from "react";
import type { typeChat } from "./types/ChatType";
const Chat = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const [conversation, setConversation] = useState<typeChat[]>([]);
    const fetchConversations = async () => {
        const res = await axios.get(`${apiUrl}/chat/my-conversation`, { withCredentials: true });
        setConversation(res.data);
    };
    useEffect(() => {
        fetchConversations();
    }, [apiUrl]);
return (
    <div className="flex w-full">
        {conversation.length > 0 && (
            <div className="w-2xl">
                <AsideChat />
            </div>
        )}
        <div className="flex w-full flex-col items-center justify-center gap-4">
            <img src={Work_Chat} alt="chat_img" width={400} />
            <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-800">
                Bienvenue sur votre espace de messagerie
            </h2>
            <p className="mt-2 text-gray-500">
                Échangez facilement avec vos <span className="font-medium text-amber-600">professeurs</span> ou vos <span className="font-medium text-amber-600">camarades</span> — posez vos questions, partagez vos ressources et collaborez en toute simplicité.
            </p>
            </div>
        </div>
    </div>
)
}

export default Chat
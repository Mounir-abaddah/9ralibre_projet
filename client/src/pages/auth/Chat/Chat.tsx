import AsideChat from "@/components/Chat/AsideChat"
import Work_Chat from "@/assets/images/Work chat-cuate.png"
import axios from "axios";
import { useEffect, useState } from "react";
import type { typeChat } from "./types/ChatType";
import { useTranslation } from "react-i18next";
const Chat = () => {
    const { t } = useTranslation();
    document.title = t("chat.pageTitle")
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
                {t("chat.welcomeTitle")}
            </h2>
            <p className="mt-2 text-gray-500">
                {t("chat.welcomeDescription")}
            </p>
            </div>
        </div>
    </div>
)
}

export default Chat
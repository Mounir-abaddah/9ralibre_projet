import AsideChat from "@/components/Chat/AsideChat"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { socket } from "@/config/socket";
import axios from "axios";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useParams } from "react-router-dom";
import type { typeMessage } from "./types/MessageType";
import { useProtectedRoutes } from "@/store/userStore";
import type { typeChat } from "./types/ChatType";
import { Dot, EllipsisVertical, Flag } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ChatStart = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { chatId } = useParams();
  const [chat, setChat] = useState<typeMessage[]>([]);
  const [conversation, setConversation] = useState<typeChat | null>(null);
  const [message, setMessage] = useState("");
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const { data } = useProtectedRoutes();
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // ─── 1. Fetch conversation + messages ───────────────────────────────────────
  useEffect(() => {
    if (!chatId) return;

    const fetchData = async () => {
      const convRes = await axios.get(`${apiUrl}/chat/my-conversation/${chatId}`, { withCredentials: true });
      const msgRes = await axios.get(`${apiUrl}/chat/get-messages/${chatId}`, { withCredentials: true });
      setConversation(convRes.data);
      setChat(msgRes.data);
      await axios.put(`${apiUrl}/chat/mark-as-read/${chatId}`, {}, { withCredentials: true });
    };

    fetchData();
  }, [apiUrl, chatId]);

  // ─── 2. Socket : connexion + events ─────────────────────────────────────────
  useEffect(() => {
    if (!data?.id) return;

    // Connecter le socket
    socket.connect();

    // Dire au serveur que ce user est en ligne
    socket.emit("user:online", data.id);

    // Rejoindre la room de cette conversation
    if (chatId) {
      socket.emit("conversation:join", chatId);
    }

    // Recevoir un nouveau message de l'autre utilisateur
    socket.on("message:receive", (newMessage: typeMessage) => {
      setChat(prev => [...prev, newMessage]);

      // Marquer comme lu automatiquement si on est dans la conversation
      axios.put(`${apiUrl}/chat/mark-as-read/${chatId}`, {}, { withCredentials: true });

      // Notifier l'autre que j'ai vu le message
      socket.emit("message:seen", { conversationId: chatId, userId: data.id });
    });

    // Recevoir la mise à jour "vu" — mettre à jour readBy dans le state
    socket.on("message:seen:update", ({ userId }: { conversationId: string; userId: string }) => {
      setChat(prev =>
        prev.map(msg => {
          // Si le message n'a pas encore ce userId dans readBy, on l'ajoute
          const alreadySeen = msg.readBy?.includes(userId);
          if (!alreadySeen) {
            return { ...msg, readBy: [...(msg.readBy || []), userId] };
          }
          return msg;
        })
      );
    });

    // Recevoir la liste des users en ligne
    socket.on("users:online", (users: string[]) => {
      setOnlineUsers(users);
    });

    return () => {
      // Quitter la room et nettoyer les listeners
      if (chatId) socket.emit("conversation:leave", chatId);
      socket.off("message:receive");
      socket.off("message:seen:update");
      socket.off("users:online");
      socket.disconnect();
    };
  }, [apiUrl, chatId, data?.id]);

  // ─── 3. Scroll automatique ───────────────────────────────────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  // ─── 4. Envoyer un message ───────────────────────────────────────────────────
  const handleSubmit = async (e: FormEvent) => { 
    e.preventDefault();
    if (message === "") return;

    // Envoyer en HTTP pour sauvegarder en BDD
    const res = await axios.post(
      `${apiUrl}/chat/messages`,
      { conversationId: chatId, text: message },
      { withCredentials: true }
    );

    const newMessage = res.data;

    // Ajouter dans mon state local
    setChat(prev => [...prev, newMessage]);

    // Envoyer via socket à l'autre utilisateur en temps réel
    socket.emit("message:send", newMessage);

    setMessage("");
  };

  const otherUser = conversation?.members.find(m => m._id !== data?.id);

  // ✅ Vérifier si l'autre user est en ligne
  const isOtherUserOnline = otherUser ? onlineUsers.includes(otherUser._id ?? "") : false;

  return (
    <div className="flex h-[calc(89vh-64px)] overflow-hidden">
      {/* Sidebar */}
      <div className="w-[300px] shrink-0 overflow-y-auto border-r">
        <AsideChat />
      </div>
      {/* Chat area */}
      <div className="flex min-h-0 flex-1 flex-col">
        {/* Header */}
        <header className="flex w-full shrink-0 items-center justify-between gap-3 border-b p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src={otherUser?.image} alt="user" className="rounded-full" />
              <AvatarFallback className="bg-sky-500 font-bold text-white uppercase">
                {otherUser?.nom?.[0]}{otherUser?.prenom?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start">
              <p className="text-sm font-semibold">{otherUser?.nom} {otherUser?.prenom}</p>
              {/* ✅ En ligne / Hors ligne dynamique */}
              <span className="flex items-center text-xs text-gray-500">
                <Dot color={isOtherUserOnline ? "lime" : "red"} className="size-8" />
                {isOtherUserOnline ? "En ligne" : "Hors ligne"}
              </span>
            </div>
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline"><EllipsisVertical /></Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <Button variant="destructive" className="w-full"><Flag /> Signaler</Button>
            </PopoverContent>
          </Popover>
        </header>

        {/* Messages */}
        <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto p-4">
          {chat.map((msg) => {
            const senderId = typeof msg.sender === "string" ? msg.sender : msg.sender?._id;
            const myMessage = senderId === data?.id;
            // ✅ Vu si readBy contient au moins 2 personnes (moi + l'autre)
            const isSeen = msg.readBy?.length > 1;

            return (
              <div key={msg._id} className={`flex ${myMessage ? "justify-end" : "justify-start"}`}>
                <div className="flex flex-col items-end gap-0.5">
                  <span className={`rounded-md p-2 text-xs shadow-sm ${myMessage ? "bg-white dark:text-black" : "bg-amber-400"}`}>
                    {msg.text}
                  </span>
                  <span className="text-[10px]">
                    {new Date(msg.createdAt).toLocaleString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                    {myMessage && (
                      <span className="ml-2">{isSeen ? "✓✓ Vu" : "✓ Envoyé"}</span>
                    )}
                  </span>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="flex shrink-0 items-center gap-2 border-t p-4">
          <Input
            type="text"
            placeholder="Rédiger un message ..."
            className="flex-1"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
          />
          <Button variant="outline" onClick={handleSubmit}>Envoyer</Button>
        </div>

      </div>
    </div>
  );
};

export default ChatStart;
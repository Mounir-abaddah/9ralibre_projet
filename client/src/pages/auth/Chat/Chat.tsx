import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import axios from "axios"
import { Send } from "lucide-react"
import { useEffect, useState, useRef } from "react"
import { useProtectedRoutes } from "@/store/userStore"
import type { ChatType } from "./types/ChatType"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { MessageType } from "./types/MessageType"
import { socket } from "@/config/socket"

const Chat = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { data } = useProtectedRoutes();
  const [conversations, setConversations] = useState<ChatType[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<ChatType | null>(null);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 🔥 Scroll automatique vers le bas
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 🔥 Connexion Socket.IO
  useEffect(() => {
    socket.connect();
    socket.on("connect", () => {
      console.log("✅ Connecté au serveur Socket.IO:", socket.id);
    });
    socket.on("disconnect", () => {
      console.log("❌ Déconnecté du serveur Socket.IO");
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  // 🔥 GET conversations
  useEffect(() => {
    const getConversation = async () => {
      const res = await axios.get(
        `${apiUrl}/messagerie/conversations`,
        { withCredentials: true }
      );
      setConversations(res.data);
      if (res.data.length > 0) {
        setSelectedConversation(res.data[0]);
      }
    };
    getConversation();
  }, [apiUrl]);

  
  useEffect(() => {
    if (!selectedConversation) return;
    
    const getMessages = async () => {
      const res = await axios.get(
        `${apiUrl}/messagerie/messages/${selectedConversation._id}`,
        { withCredentials: true }
      );
      setMessages(res.data.reverse());
      
      // 🔥 Marquer les messages comme lus et reset le compteur
      setConversations((prev) =>
        prev.map((conv) =>
          conv._id === selectedConversation._id
            ? { ...conv, unreadCount: 0 }
            : conv
        )
      );
    };
    
    getMessages();
    socket.emit("joinRoom", selectedConversation._id);
    
    socket.on("receiveMessage", (message: MessageType) => {
      setMessages((prev) => [...prev, message]);
      
      // 🔥 Si le message est reçu dans la conversation active, pas de compteur
      // Sinon, incrémenter le compteur de la conversation concernée
      if (message.conversationId !== selectedConversation._id) {
        setConversations((prev) =>
          prev.map((conv) =>
            conv._id === message.conversationId
              ? { ...conv, unreadCount: (conv.unreadCount || 0) + 1 }
              : conv
          )
        );
      }
    });
    
    // Cleanup: quitter la room et retirer le listener
    return () => {
      socket.off("receiveMessage");
    };
  }, [selectedConversation, apiUrl]);

  // 🔥 SEND message avec Socket.IO
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      const res = await axios.post(
        `${apiUrl}/messagerie/messages`,
        {
          conversationId: selectedConversation._id,
          text: newMessage
        },
        { withCredentials: true }
      );

      const messageData = res.data;

      setMessages((prev) => [...prev, messageData]);

      socket.emit("sendMessage", {
        conversationId: selectedConversation._id,
        message: messageData
      });

      // 🔥 REMONTER CONVERSATION EN HAUT
      setConversations((prev) => {
        const updated = prev.filter(
          (conv) => conv._id !== selectedConversation._id
        );
        return [selectedConversation, ...updated];
      });

      setNewMessage("");

    } catch (err) {
      console.log(err);
    }
  };


  // Gérer l'envoi avec la touche Entrée
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };


  return (
    <div className="grid h-[80vh] grid-cols-[300px_1fr] rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">

      {/* LEFT SIDE - Liste des conversations */}
      <div className="overflow-y-auto border-r border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
          Vos discussions
        </h2>

        <div className="space-y-2">
          {conversations.map((conv) => {
            const otherMember = conv.members.find(
              (memb) => memb._id !== data?.id
            );
            if (!otherMember) return null;

            return (
              <div
                key={conv._id}
                onClick={() => setSelectedConversation(conv)}
                className={`relative cursor-pointer rounded-xl border p-3 shadow-sm transition-all duration-200
                  ${
                    selectedConversation?._id === conv._id
                      ? "border-amber-500 bg-amber-50 dark:border-amber-500 dark:bg-amber-950/30"
                      : "border-gray-200 bg-white hover:border-amber-300 hover:shadow-md dark:border-gray-600 dark:bg-gray-700 dark:hover:border-amber-600"
                  }`}
              >
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={otherMember.image} />
                    <AvatarFallback className="bg-cyan-500 text-sm font-bold text-white dark:bg-cyan-600">
                      {otherMember.nom[0]}
                      {otherMember.prenom[0]}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 overflow-hidden">
                    <p className="truncate font-medium text-gray-900 dark:text-gray-100">
                      {otherMember.nom} {otherMember.prenom}
                    </p>
                    <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                      {otherMember.role}
                    </p>
                  </div>

                  {/* 🔥 BADGE DES MESSAGES NON LUS */}
                  {(conv.unreadCount ?? 0) > 0 && (
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white dark:bg-red-600">
                      {conv.unreadCount! > 9 ? '9+' : conv.unreadCount}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT SIDE - Zone de messages */}
      <div className="flex min-h-0 flex-col">

        {/* HEADER sticky */}
        <div className="sticky top-0 z-10 border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {selectedConversation ? (
              (() => {
                const otherMember = selectedConversation.members.find(
                  (m) => m._id !== data?.id
                );
                return `${otherMember?.nom} ${otherMember?.prenom}`;
              })()
            ) : (
              "Sélectionnez une discussion"
            )}
          </h3>
        </div>

        {/* MESSAGES AREA */}
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto bg-gray-50 p-4 dark:bg-gray-900">
          {messages.map((msg) => {
            const isSender = msg.sender === data?.id;
            return (
              <div 
                key={msg._id}
                className={`flex flex-col ${isSender ? "items-end" : "items-start"}`}
              >
                <div 
                  className={`max-w-xs rounded-2xl px-4 py-2 text-sm shadow-sm ${
                    isSender
                      ? "bg-amber-500 text-white dark:bg-amber-600"
                      : "bg-white text-gray-900 dark:bg-gray-700 dark:text-gray-100"
                  }`}
                  style={{ wordBreak: "break-word", whiteSpace: "pre-wrap" }}
                >
                  {msg.text}
                </div>

                <span className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {new Date(msg.createdAt).toLocaleDateString("fr-FR")} à&nbsp;
                  {new Date(msg.createdAt).toLocaleTimeString("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* INPUT */}
        <div className="flex items-center gap-2 border-t border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <Input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyUp={handleKeyPress}
            placeholder="Tapez votre message..."
            className="flex-1 bg-gray-50 dark:bg-gray-700"
            disabled={!selectedConversation}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!selectedConversation}
            className="gap-2 bg-amber-500 text-white hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-700"
          >
            Envoyer
            <Send size={16} />
          </Button>
        </div>
      </div>
    </div>
  );

};

export default Chat;
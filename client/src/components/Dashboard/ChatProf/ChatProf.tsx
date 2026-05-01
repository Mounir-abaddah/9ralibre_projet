import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AvatarImage } from "@radix-ui/react-avatar"
import { MessageCircle } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next";

interface MessageType {
  conversationId: string
  text: string
  createdAt: string
  unread: boolean
  user: {
    nom: string
    prenom: string
    role:string
    image: string
  }
}

interface ChatProfProps {
  messages: MessageType[]
}

const ChatProf = ({ messages }: ChatProfProps) => {
  const { t, i18n } = useTranslation();
  const unreadCount = messages.filter(m => m.unread).length
  const navigate = useNavigate();
  return (
    <Card className="w-full">
      <CardHeader className="flex justify-between">
        <CardTitle className="flex w-full items-center justify-between">
          <span className="flex items-center gap-2">
            <MessageCircle size={20} />
            {t("prof.chat.latestMessages")}
          </span>
          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <span className="flex items-center justify-center gap-2 rounded-full bg-cyan-100 px-3 py-1 text-xs font-medium text-cyan-700">
                <span>{unreadCount}</span> {t("prof.chat.new")}
              </span>
            )}
            <Link
              to="/prof/chat"
              className="w-max text-xs text-cyan-600 hover:underline"
            >
              {t("prof.chat.viewAll")}
            </Link>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {messages.map((mes) => (
          <div
            key={mes.conversationId}
            onClick={()=>navigate(`/prof/Chat/start/${mes.conversationId}`)}
            className="flex cursor-pointer items-start gap-3 rounded-md border-b p-2 transition hover:bg-slate-200 hover:text-gray-800"
          >
            <Avatar className="h-9 w-9">
              <AvatarImage src={mes.user.image} />
              <AvatarFallback
                className={`text-xs font-semibold ${
                  mes.user.role === "Etudiant"
                    ? "bg-cyan-500 text-white"
                    : "bg-pink-500 text-white"
                }`}
              >
                {mes.user.nom[0]}
                {mes.user.prenom[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-1 flex-col">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  {mes.user.nom} {mes.user.prenom}
                </span>
                {mes.unread && (
                  <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                )}
              </div>
              <span className="line-clamp-1 text-xs text-gray-500">
                {mes.text}
              </span>
              <span className="mt-1 text-[11px] text-gray-400">
                {mes.createdAt && (
                  <>{new Date(mes.createdAt).toLocaleString(i18n.language === "en" ? "en-US" : "fr-FR",{
                  day:"numeric",
                  month:"long",
                  hour:"2-digit",
                  minute:"2-digit"
                })}</>
                )}
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export default ChatProf
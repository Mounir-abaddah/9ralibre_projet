import ChatProfAside from "@/components/Chat/Prof/ChatProfAside";
import Bienvenu_Prof from "@/assets/images/Professeur_Bienvenue.png";
import { MessageCircle, Users, Send } from "lucide-react";

const ProfChat = () => {
return (
    <div className="flex h-[calc(96vh-64px)] w-full overflow-hidden">

    {/* Sidebar */}
    <div className="w-[300px] shrink-0 overflow-y-auto border-r">
        <ChatProfAside />
    </div>

    {/* Main Welcome Area */}
    <div className="flex flex-1 items-center justify-center p-3">

        <div className="flex max-w-4xl flex-col items-center gap-6 text-center">

        {/* Image */}
        <img
            src={Bienvenu_Prof}
            alt="welcome"
            className="w-64 object-contain drop-shadow-lg md:w-80"
        />

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-800 md:text-3xl dark:text-white">
            Bienvenue dans votre espace de discussion 👋
        </h1>

        {/* Subtitle */}
        <p className="max-w-md text-sm text-gray-500 md:text-base dark:text-gray-400">
            Sélectionnez une conversation dans la liste à gauche pour commencer à échanger avec vos étudiants en temps réel.
        </p>

        {/* Feature cards */}
        <div className="mt-4 grid w-full grid-cols-1 gap-4 md:grid-cols-3">

            <div className="flex flex-col items-center gap-2 rounded-2xl border bg-white p-4 shadow-sm dark:bg-gray-800">
            <MessageCircle className="h-6 w-6 text-pink-500" />
            <p className="text-sm font-medium">Messages en temps réel</p>
            <span className="text-center text-xs text-gray-400">
                Discutez instantanément avec vos étudiants
            </span>
            </div>

            <div className="flex flex-col items-center gap-2 rounded-2xl border bg-white p-4 shadow-sm dark:bg-gray-800">
            <Users className="h-6 w-6 text-cyan-500" />
            <p className="text-sm font-medium">Présence en ligne</p>
            <span className="text-center text-xs text-gray-400">
                Voir qui est connecté en direct
            </span>
            </div>

            <div className="flex flex-col items-center gap-2 rounded-2xl border bg-white p-4 shadow-sm dark:bg-gray-800">
            <Send className="h-6 w-6 text-amber-500" />
            <p className="text-sm font-medium">Envoi rapide</p>
            <span className="text-center text-xs text-gray-400">
                Messages fluides et instantanés
            </span>
            </div>
        </div>

        </div>
    </div>
    </div>
);
};

export default ProfChat;
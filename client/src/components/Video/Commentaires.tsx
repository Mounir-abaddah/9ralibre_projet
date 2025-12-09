import { Heart, MessageCircle, Reply, Send, SmilePlus } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { EmojiPicker, EmojiPickerContent, EmojiPickerSearch } from "@/components/ui/emoji-picker";
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import type {typedata } from "@/store/userStore";
import type { VideoType } from "@/pages/auth/Videos/Video";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Separator } from "../ui/separator";
import CommentsDropDown from "./CommentsDropDown";
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface typeCommentaire{
    data:typedata | null;
    videos:VideoType;
    comments:string;
    setComments: React.Dispatch<React.SetStateAction<string>>;
    handleComments:()=>void;
    showtextReply:string | null
    setShowTextReply: React.Dispatch<React.SetStateAction<string | null>>;
    showReply:string|null;
    setShowReply:React.Dispatch<React.SetStateAction<string | null >>;
    reply:string;
    setReply:React.Dispatch<React.SetStateAction<string>>;
    handleReply:(commentId:string)=>void
}   
const Commentaires = ({
    videos,
    data,
    comments,
    setComments,
    handleComments,
    showtextReply,
    setShowTextReply,
    showReply,
    setShowReply,
    reply,
    setReply,
    handleReply
}:typeCommentaire) => {
    const [showEmojie,setShowEmojie]=useState(false);
    const [replyShowEmojie,setReplyShowEmojie]=useState(false);
    const emojieRef = useRef<HTMLDivElement>(null);
    const replyemojieRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    useEffect(()=>{
        const handleOutside = (event:MouseEvent)=>{
        if(emojieRef.current && !emojieRef.current.contains(event.target as Node)){
            setShowEmojie(false);
        }
        };
        document.addEventListener("mousedown",handleOutside);
        return ()=>document.removeEventListener("mousedown",handleOutside)
    })

    useEffect(()=>{
        const handleOutside = (event:MouseEvent)=>{
        if(replyemojieRef.current && !replyemojieRef.current.contains(event.target as Node)){
            setReplyShowEmojie(false);
        }
        };
        document.addEventListener("mousedown",handleOutside);
        return ()=>document.removeEventListener("mousedown",handleOutside)
    })
return (
    <div className="mt-6 space-y-5">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
            <MessageCircle size={18} /> Commentaires ({videos.comments.length})
        </h2>
        {/* Add comment */}
        <div className="flex gap-3">
            <Avatar>
                <AvatarImage src={data?.image} />
                <AvatarFallback className={`text-xs text-white ${data?.role === "Etudiant" ? "bg-sky-400" : "bg-pink-400"}`}>
                    {data?.nom[0]}
                    {data?.prenom[0]}
                </AvatarFallback>
            </Avatar>
            <div className="w-full space-y-2">
                <div className="relative flex">
                    <Textarea
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    placeholder="Ajouter un commentaire..."
                    className="min-h-20 resize-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                    />
                    <button type="button" onClick={() => setShowEmojie(!showEmojie)} className="absolute top-3 right-3 cursor-pointer text-xl transition hover:scale-110">
                        <SmilePlus size={18} />
                    </button>
                {showEmojie && (
                    <div ref={emojieRef} className="absolute top-14 right-0 z-50">
                        <EmojiPicker className="h-[326px]"
                        onEmojiSelect={({ emoji }) => {
                            setComments((prev) => prev + emoji);
                        }}>
                            <EmojiPickerSearch />
                            <EmojiPickerContent />
                        </EmojiPicker>
                    </div>
                )}
                </div>
                <div className="flex justify-end">
                    <Button onClick={handleComments} className="flex cursor-pointer items-center gap-1 bg-sky-400 hover:bg-sky-500 dark:text-white">
                        Publier <Send size={14} />
                    </Button>
                </div>
            </div>
        </div>
        {/* Comment list */}
        <div className="w-full space-y-4 rounded-xl border bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        {videos.comments.map((comments) => (
            <span key={comments._id} className="flex w-full flex-col justify-between rounded-md border p-2">
            <div className="flex w-full justify-between gap-2">
                <Avatar onClick={()=>navigate(`/in/${comments.user.nom}${comments.user.prenom}`)} className="cursor-pointer">
                    <AvatarImage src={comments.user.image} alt="image_users"/>
                    <AvatarFallback className={`text-xs font-bold text-white ${comments.user.role === "Etudiant" ? "bg-sky-400": "bg-pink-400"}`}>
                    {comments.user.nom[0]}{comments.user.prenom[0]}
                    </AvatarFallback>
                </Avatar>
                {/********Commentaire (text nom prenom )*********/}
                <div className="flex w-full flex-col gap-2">
                    <Link to={`/in/${comments.user.nom}${comments.user.prenom}`} className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {comments.user.nom} {comments.user.prenom} . <span className={`text-xs font-bold text-white ${comments.user.role === "Etudiant" ? "bg-sky-400": "bg-pink-400"} rounded-md p-0.5`}>{comments.user.role}</span>
                    </Link>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                    {comments.text}
                    </span>
                    {/********J'aime et repondre et Date (Commentaire)*********/}
                    <span className="flex items-center gap-2">
                        <span className="cursor-pointer p-0.5 text-xs text-gray-400 transition duration-200 hover:bg-gray-500">J'aime</span>
                        <Separator  orientation="vertical" className="data-[orientation=vertical]:h-3"/>
                        <span className="cursor-pointer p-0.5 text-xs text-gray-400 transition duration-200 hover:bg-gray-500" onClick={()=>setShowTextReply(showtextReply === comments._id ? null : comments._id)}>Repondre</span>
                        <Separator  orientation="vertical" className="data-[orientation=vertical]:h-3"/>
                        <span className="text-xs text-gray-400">{formatDistanceToNow(new Date(comments.createdAt),{addSuffix:true,locale:fr})}</span>
                    </span>
                    {/********shoTextReply TEXTAREA*********/}
                    {showtextReply === comments._id && (
                        <span className="relative ml-14 flex gap-2">
                            <Avatar>
                            <AvatarImage src={data?.image} alt="image_user"/>
                            <AvatarFallback>
                                {data?.nom[0]}
                                {data?.prenom[0]}
                            </AvatarFallback>
                            </Avatar>
                            <Textarea placeholder={`Répondre à ${comments.user.nom}`} value={reply} onChange={(e)=>setReply(e.target.value)} className="placeholder:font-bold"/>
                            <span className="absolute right-0 bottom-0 flex items-center gap-3 p-2">
                            <SmilePlus size={18} className="cursor-pointer" onClick={()=>setReplyShowEmojie(!replyShowEmojie)}/>
                            <Button variant={'secondary'} className="cursor-pointer transition duration-150" onClick={()=>setShowTextReply(null)}>Annuler</Button>
                            <Button onClick={()=>handleReply(comments._id)} className="cursor-pointer bg-amber-400 transition duration-150 hover:bg-amber-500">Répondre</Button>
                            </span> 
                            {replyShowEmojie && (
                            <div ref={replyemojieRef} className="absolute top-14 right-0 z-50">
                                <EmojiPicker
                                className="h-[326px]"
                                onEmojiSelect={({ emoji }) => {
                                    setReply((prev) => prev + emoji);
                                }}
                                >
                            <EmojiPickerSearch />
                            <EmojiPickerContent />
                        </EmojiPicker>
                    </div>
                            )}
                        </span>
                    )}
                    {/********Replies(afficher et masquer)*********/}
                    {comments.replies.length > 0 && (
                        <button
                            onClick={() => setShowReply(showReply === comments._id ? null : comments._id)}
                            className="ml-12 text-xs text-sky-500 hover:underline"
                        >
                            {showReply === comments._id
                            ? "Masquer les réponses"
                            : `Afficher ${comments.replies.length} réponses`}
                        </button>
                    )}
                </div>
                {/********CommentsDropDown(Signlaer)*********/}
                <CommentsDropDown item={comments}/>
            </div>
            {/********ReplyesforComments*********/}
            <div className="ml-6  flex">
                <div>
                    <Separator orientation="vertical"/>
                </div>
                <div className="flex flex-col space-y-4">
                {showReply === comments._id && (
                    comments.replies.map((replies)=>(
                    <span key={replies._id} className="ml-5 flex">
                        <div className="flex items-center gap-2">
                            <Avatar>
                                <AvatarImage src={replies.user.image}/>
                                <AvatarFallback className={`${replies.user.role === "Etudiant" ? 'bg-sky-400' : 'bg-pink-400'}`}>
                                    {replies.user.nom[0].toUpperCase()}
                                    {replies.user.prenom[0].toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <span className="flex flex-col gap-0.5">
                                <span className="text-xs font-bold text-gray-700 dark:text-white">{replies.user.nom} {replies.user.prenom}</span>
                                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{replies.text}</span>
                                <span className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300">
                                    <span>{formatDistanceToNow(new Date(replies.createdAt),{addSuffix:true,locale:fr})}.</span>
                                    <span className="flex cursor-pointer items-center gap-0.5"><Heart size={14}/>J'aime</span>
                                    <span className="flex cursor-pointer items-center gap-0.5"><Reply size={14}/>répondre</span>
                                </span>
                            </span>
                        </div>
                    </span>
                ))
                )}
                </div>
            </div>
            </span>
        ))}
        </div>
    </div>
);
};

export default Commentaires;

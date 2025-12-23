import type { Replies, TypeVideos } from "@/pages/auth/Video/types/video.type";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { fr } from "date-fns/locale";
import { EllipsisVertical, Flag, Heart, Pencil, Send, SmilePlus, Trash } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { useProtectedRoutes } from "@/store/userStore";
import { useState } from "react";
import { EmojiPicker, EmojiPickerContent, EmojiPickerSearch } from "../ui/emoji-picker";
import axios from "axios";
import { useParams } from "react-router-dom";

export interface RepliesTypes{
    videos:TypeVideos
    getVideos:()=>void;
    commentsId:string;
    replies:Replies[];
    showReplies:string | null;
    setShowReplies:React.Dispatch<React.SetStateAction<string | null>>
}

const ReplieComments = ({getVideos,commentsId,replies,showReplies,setShowReplies}:RepliesTypes) => {
  
  const apiUrl = import.meta.env.VITE_API_URL;
  const {videoId} = useParams();
  const {data} = useProtectedRoutes();
  const [showEmojieReplies,setShowEmojieReplies]=useState(false);

  const [repliestext,setRepliestext]=useState("");

  const [editReplies,setEditReplies]=useState<string | null>(null);
  const [editRepliestext,setEditRepliestext]=useState("")


  const handlePostReply = async()=>{
    await axios.post(`${apiUrl}/videos/post-videos-reply-commentaires/${videoId}/${commentsId}`,{text:repliestext},{withCredentials:true})
    setShowReplies(null);
    await getVideos();
  }

  const handleLikeReply = async(replyId:string)=>{
    await axios.post(`${apiUrl}/videos/post-videos-likes-reply/${videoId}/${replyId}/like/reply`,{},{withCredentials:true})
    await getVideos();
  }

  const handleEditReply = async(replyId:string)=>{
    await axios.patch(`${apiUrl}/videos/patch-videos-reply-comments/${videoId}/${replyId}`,{text:editRepliestext},{withCredentials:true})
    setEditReplies(null)
    await getVideos();
  }

  const handleDelelteReply = async(replyId:string)=>{
    await axios.delete(`${apiUrl}/videos/delete-videos-reply-comments/${videoId}/${replyId}`,{withCredentials:true})
    await getVideos();
  }

  return (
    <div className="ml-8 w-full space-y-4">
      {showReplies === commentsId && (
        <div className="space-y-2">
          <span className="flex w-full rounded-md border p-2">
            <textarea value={repliestext} onChange={(e)=>setRepliestext(e.target.value)} className="w-full resize-none border-none outline-0"/>
            <Popover open={showEmojieReplies} onOpenChange={setShowEmojieReplies}>
              <PopoverTrigger>
                  <span className='cursor-pointer'><SmilePlus size={18} /></span>
              </PopoverTrigger>
              <PopoverContent>
              <EmojiPicker
                  onEmojiSelect={({ emoji }) =>
                    setRepliestext(repliestext + emoji)
                  }
              >
                  <EmojiPickerSearch />
                  <EmojiPickerContent />
              </EmojiPicker>
              </PopoverContent>
            </Popover>
          </span>
          <span className="flex items-end justify-end space-x-2">
            <Button size={'sm'} onClick={()=>setShowReplies(null)} variant={'outline'} className="cursor-pointer bg-amber-400 hover:bg-amber-500">Annuler</Button>
            <Button size={'sm'} onClick={()=>handlePostReply()} className="cursor-pointer bg-amber-400 hover:bg-amber-500"><Send/></Button>
          </span>
        </div>
      )}
        {replies.map((replies)=>(
          <div key={replies._id} className="flex w-full justify-between">
            <div className="flex w-full justify-between space-x-2">
              <Avatar>
                  <AvatarImage src={replies.user.image} alt="image_de_user"/>
                  <AvatarFallback  className={`${replies.user.role === "Etudiant" ? 'bg-sky-400' : 'bg-pink-400'}`}>
                    {replies.user.nom[0].toUpperCase()}
                    {replies.user.prenom[0].toUpperCase()}
                  </AvatarFallback>
              </Avatar>
              <div className="w-full space-y-2">
                <h2 className="text-xs">{replies.user.nom} {replies.user.prenom} . <span className={`${replies.user.role === "Etudiant" ? 'bg-sky-400' : 'bg-pink-400'} rounded-xs`}>{replies.user.role}</span> . <span className="text-gray-400">{formatDistanceToNow(new Date(replies.createdAt),{addSuffix:true,locale:fr})}</span></h2>
                {editReplies === replies._id ? (
                  <span className="flex w-full flex-col items-end space-y-2">
                    <textarea
                      value={editRepliestext}
                      onChange={(e)=>setEditRepliestext(e.target.value)}
                      rows={2}
                      className="w-full resize-none rounded-md border p-2 text-sm"
                    />
                    <span className="flex gap-2">
                      <Button onClick={()=>setEditReplies(null)} variant={'outline'} className="flex cursor-pointer items-end justify-end">Annuler</Button>
                      <Button onClick={()=>handleEditReply(replies._id)} className="flex cursor-pointer items-end justify-end">Modifier</Button>
                    </span>                  
                    
                  </span>
                ):(
                  <h2 className="text-sm">{replies.text}</h2>
                )}
                <span onClick={()=>handleLikeReply(replies._id)} className="flex w-min cursor-pointer items-center gap-1 rounded-md px-1 text-xs hover:bg-gray-100 hover:text-black">
                  <Heart size={16} fill={data?.id && replies.likes.includes(data.id) ? "#FF2E2E" : "none"} color={data?.id && replies.likes.includes(data.id) ? "#FF2E2E" : "currentColor"}/> {replies.likes.length}
                </span>
              </div>
            </div>
            <div>
                <Popover>
                  <PopoverTrigger asChild>
                      <Button variant="outline" className='cursor-pointer'><EllipsisVertical  size={18}/></Button>
                  </PopoverTrigger>
                  <PopoverContent>
                          <div className='flex flex-col items-start space-y-2'>
                              {data?.id === replies.user._id ? (
                                  <>
                                  <Button onClick={()=>setEditReplies(replies._id)} className='flex w-full cursor-pointer items-center gap-2 text-xs'><Pencil size={14}/>Modifier</Button>
                                  <Button onClick={()=>handleDelelteReply(replies._id)} variant={'destructive'} className='flex w-full cursor-pointer items-center gap-2 text-xs'><Trash size={14}/>Supprimer</Button>
                                  </>
                              ):(
                                  <>
                                      <Button className='flex w-full cursor-pointer items-center gap-2 text-xs'><Flag size={14}/>Signaler</Button>
                                  </>
                              )}
                          </div>
                  </PopoverContent>
                </Popover>
              </div>
          </div>
        ))}
    </div>
  )
}

export default ReplieComments

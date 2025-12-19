import type { TypeVideos } from '@/pages/auth/Video/types/video.type'
import { Funnel, Heart, Reply, Send, SmilePlus } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { useProtectedRoutes } from '@/store/userStore'
import { EmojiPicker, EmojiPickerContent, EmojiPickerSearch } from '../ui/emoji-picker'
import { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { fr } from "date-fns/locale";

export interface CommentsTypes{
    videos:TypeVideos
}
const Comments = ({videos}:CommentsTypes) => {
    const {data} = useProtectedRoutes();
    const [comments,setComments]=useState("")
    const [emojiCommentsOpen,setemojiCommentsOpen]=useState(false);
    const [afficherButtonsComments,setAfficherButtonComments]=useState(false)
  return (
    <div className='w-full space-y-4'>
        {/****** COMMENTAIRES LENGTH ET FILTER *********/}
        <div className='flex items-center space-x-5'>
            <span className='text-xl font-medium'>Commentaire ({videos.comments.length})</span>
            <span className='flex items-center text-sm font-medium'><Funnel size={16}/>Trier par</span>
        </div>
        {/*************COMMENTAIRES (TEXT) ET EMOJIE *****************/}
        <div className='flex w-full space-x-2'>
            <Avatar>
                <AvatarImage src={data?.image} alt='image_users'/>
                <AvatarFallback>
                    {data?.nom[0]}
                    {data?.prenom[0]}
                </AvatarFallback>
            </Avatar>
            {/************* TEXT AREA ET ENVOYER *****************/}
            <div className='flex w-full flex-col space-y-2'>
                {/************* TEXTAREA AND EMOJIE *****************/}
                <span className='flex w-full justify-between rounded-md border p-2'>
                    <textarea onClick={()=>setAfficherButtonComments(true)} value={comments} onChange={(e)=>setComments(e.target.value)} id="comments" name="comments" rows={2} cols={20} placeholder='Ajouter un commentaire...' className='w-full resize-none border-0 outline-0 placeholder:text-sm'/>
                    <Popover onOpenChange={setemojiCommentsOpen} open={emojiCommentsOpen}>
                        <PopoverTrigger asChild>
                            <span className='text-xs'><SmilePlus size={18}/></span>
                        </PopoverTrigger>
                        <PopoverContent>
                            <EmojiPicker className="h-[342px]" onEmojiSelect={({ emoji }) => {
                                setComments(comments + emoji);}}
                            >
                            <EmojiPickerSearch />
                            <EmojiPickerContent />
                            </EmojiPicker>
                        </PopoverContent>
                    </Popover>
                </span>
                {/************* ANNULER ET ENVOYER LE TEXT *****************/}
                {afficherButtonsComments && (
                <div className='flex w-full items-center justify-end space-x-2'>
                    <button onClick={()=>{setComments("");setAfficherButtonComments(false)}} className='cursor-pointer rounded-md p-2 text-sm transition-all duration-200 hover:bg-gray-200 hover:text-black'>Annuler</button>
                    <Button disabled={comments.length < 1} className='cursor-pointer bg-sky-400 text-sm text-white hover:bg-sky-500'>Ajouter un commentaire <Send /></Button>
                </div>
                )}
            </div>
        </div>
        {/*************COMMENTAIRES ET REPLIES *****************/}
        <div className='space-y-6'>
            {videos.comments.map((comments)=>(
                <div key={comments._id}>
                    {/************* COMMENTAIRES AVATAR *****************/}
                    <div className="flex items-start gap-2 space-y-4">
                        <Avatar>
                            <AvatarImage src={comments.user.image} alt='image_users'/>
                            <AvatarFallback className={`${comments.user.role === "Etudiant" ? 'bg-sky-400' : 'bg-pink-400'}`}>
                                {comments.user.nom[0].toUpperCase()}
                                {comments.user.prenom[0].toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        {/************* COMMENTAIRES TEXT ET ROLE ET CREATEDAT *****************/}
                        <div className="flex flex-col space-y-2">
                            <span className="text-sm">{comments.user.nom} {comments.user.prenom} .&nbsp; 
                                <span className={`${comments.user.role === "Etudiant" ? 'bg-sky-400' : 'bg-pink-400'} rounded-md p-0.5 text-xs tracking-wide`}>
                                    {comments.user.role}
                                </span> . &nbsp;
                                <span className="text-xs text-gray-400">
                                    {formatDistanceToNow(new Date(comments.createdAt),{addSuffix:true,locale:fr})}
                                </span>
                            </span>
                            <span className="ml-2 text-sm">{comments.text}</span>
                            {/************* COMMENTAIRES J'aime et REPONDRE *****************/}
                            <div className='flex items-center space-x-1.5'>
                                <span className='flex items-center gap-0.5 text-xs'><Heart size={16}/> j'adore</span>
                                <span className='flex items-center gap-0.5 text-xs'><Reply size={16}/> Repondre</span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
  )
}

export default Comments
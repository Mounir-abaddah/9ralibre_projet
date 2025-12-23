import type { TypeVideos } from '@/pages/auth/Video/types/video.type'
import { EllipsisVertical, Flag, Funnel, Heart, Pencil, Send, SmilePlus, Trash } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { useProtectedRoutes } from '@/store/userStore'
import { EmojiPicker, EmojiPickerContent, EmojiPickerSearch } from '../ui/emoji-picker'
import { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { fr } from "date-fns/locale";
import axios from 'axios'
import { useParams } from 'react-router-dom'
import DeleteModal from './DeleteModal'
import ReplieComments from '@/components/Videos/ReplieComments'
export interface CommentsTypes{
    videos:TypeVideos
    getVideos:()=>void;
    commentsId:string
}

const Comments = ({videos,getVideos}:CommentsTypes) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const {videoId} = useParams()
    const {data} = useProtectedRoutes();
    const [comments,setComments]=useState("")
    const [emojiCommentsOpen,setemojiCommentsOpen]=useState(false);
    const [afficherButtonsComments,setAfficherButtonComments]=useState(false);
    const [commentToDelete,setCommentToDelete]=useState<string | null>(null);

    const [editingCommentId, setEditingCommentId] = useState<string | null>(null)
    const [editingText, setEditingText] = useState('')


    const [showReplies,setShowReplies]=useState<string | null>(null);


    const handlePostComments = async()=>{
        await axios.post(`${apiUrl}/videos/post-videos-commentaires/${videoId}`,{text:comments},{withCredentials:true});
        setComments("");
        setAfficherButtonComments(false)
        await getVideos()
    }

    const handleDeleteComments = async(commentsId:string)=>{
        await axios.delete(`${apiUrl}/videos/delete-videos-commentaire/${videoId}/${commentsId}`,{withCredentials:true})
        await getVideos()
    }

    const handleLikeComment = async (commentsId: string) => {
        await axios.post(`${apiUrl}/videos/post-videos-likes-commentaire/${videoId}/${commentsId}`,{},{ withCredentials: true });
        await getVideos(); 
    };

    const handleEditComment = async (commentId: string) => {
        await axios.patch(
        `${apiUrl}/videos/patch-videos-commetaire/${videoId}/${commentId}`,
        { text: editingText },
        { withCredentials: true }
        )

        setEditingCommentId(null)
        setEditingText('')
        setAfficherButtonComments(false)
        await getVideos()
    }
return (
    <>
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
                        <textarea
                            onClick={() => setAfficherButtonComments(true)}
                            value={editingCommentId ? editingText : comments}
                            onChange={(e) =>
                            editingCommentId
                                ? setEditingText(e.target.value)
                                : setComments(e.target.value)
                            }
                            rows={2}
                            placeholder="Ajouter un commentaire..."
                            className="w-full resize-none text-sm outline-none"
                        />
                        <Popover open={emojiCommentsOpen} onOpenChange={setemojiCommentsOpen}>
                            <PopoverTrigger>
                                <span className='cursor-pointer'><SmilePlus size={18} /></span>
                            </PopoverTrigger>
                            <PopoverContent>
                            <EmojiPicker
                                onEmojiSelect={({ emoji }) =>
                                editingCommentId
                                    ? setEditingText(editingText + emoji)
                                    : setComments(comments + emoji)
                                }
                            >
                                <EmojiPickerSearch />
                                <EmojiPickerContent />
                            </EmojiPicker>
                            </PopoverContent>
                        </Popover>
                    </span>
                    {/************* ANNULER ET ENVOYER LE TEXT *****************/}
                    {afficherButtonsComments && (
                    <div className="flex justify-end gap-2">
                        <button onClick={() => {
                            setComments('')
                            setEditingText('')
                            setEditingCommentId(null)
                            setAfficherButtonComments(false)
                            }}
                            className="cursor-pointer text-sm"
                        >
                            Annuler
                        </button>
                        <Button className='cursor-pointer bg-cyan-500 text-white hover:bg-cyan-600' onClick={() => editingCommentId ? handleEditComment(editingCommentId) : handlePostComments()} disabled={(editingCommentId ? editingText : comments).length < 1}>
                            {editingCommentId ? 'Mettre à jour' : 'Commenter'} <Send />
                        </Button>
                    </div>
                    )}
                </div>
            </div>
            {/*************COMMENTAIRES ET REPLIES *****************/}
            <div className='w-full space-y-6'>
                {videos.comments.map((comments)=>(
                    <div key={comments._id} className='flex w-full justify-between'>
                        {/************* COMMENTAIRES AVATAR *****************/}
                        <div className="flex w-full items-start gap-2 space-y-4">
                            <Avatar>
                                <AvatarImage src={comments.user.image} alt='image_users'/>
                                <AvatarFallback className={`${comments.user.role === "Etudiant" ? 'bg-sky-400' : 'bg-pink-400'}`}>
                                    {comments.user.nom[0].toUpperCase()}
                                    {comments.user.prenom[0].toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            {/************* COMMENTAIRES TEXT ET ROLE ET CREATEDAT *****************/}
                            <div className="flex w-full flex-col space-y-2">
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
                                <div className='flex items-center space-x-2'>
                                    <span onClick={() => handleLikeComment(comments._id)} className='flex cursor-pointer items-center gap-1 text-xs' > <Heart size={16} fill={data?.id && comments.likes.includes(data.id) ? "#FF2E2E" : "none"} color={data?.id && comments.likes.includes(data.id) ? "#FF2E2E" : "currentColor"} /> {comments.likes.length} </span>
                                    <span onClick={()=>setShowReplies(comments._id)} className='cursor-pointer rounded-md p-0.5 text-xs transition duration-200 hover:bg-amber-500'>Repondre</span>
                                </div>
                                <ReplieComments 
                                    videos={videos}
                                    getVideos={getVideos}
                                    commentsId={comments._id}
                                    replies={comments.replies}
                                    showReplies={showReplies}
                                    setShowReplies={setShowReplies}
                                />
                            </div>
                        </div>
                        {/************* POPEVER MODIFIER ET SUPPRIMER LE COMMENTAIRES *****************/}
                        
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className='cursor-pointer'><EllipsisVertical  size={18}/></Button>
                                </PopoverTrigger>
                                <PopoverContent>
                                        <div className='flex flex-col items-start space-y-2'>
                                            {data?.id === comments.user._id ? (
                                                <>
                                                <Button onClick={()=>{setEditingCommentId(comments._id);setEditingText(comments.text);setAfficherButtonComments(true)}} className='flex w-full cursor-pointer items-center gap-2 text-xs'><Pencil size={14}/>Modifier</Button>
                                                <Button onClick={()=>setCommentToDelete(comments._id)} variant={'destructive'} className='flex w-full cursor-pointer items-center gap-2 text-xs'><Trash size={14}/>Supprimer</Button>
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
                ))}
            </div>
        </div>
        {commentToDelete && (
            <DeleteModal 
                commentId={commentToDelete}
                setCommentToDelete={setCommentToDelete}
                onConfirm={handleDeleteComments}
            />
        )}
    </>
  )
}

export default Comments
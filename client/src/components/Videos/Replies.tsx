import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { EmojiPicker, EmojiPickerContent, EmojiPickerSearch } from '../ui/emoji-picker'
import { Send, SmilePlus } from "lucide-react";
import { Button } from "../ui/button";

const Replies = () => {
  const [emojiRepliesOpen,setemojiRepliesOpen]=useState(false);
  const [afficherButtonsReplies,setAfficherButtonReplies]=useState(false);
  const [replies,setReplies]=useState("");
  return (
    <div className="space-y-2">
      <span className='ml-4 flex w-full justify-between rounded-md border p-2'>
          <textarea onClick={()=>setAfficherButtonReplies(true)} value={replies} onChange={(e)=>setReplies(e.target.value)} id="replies" name="replies" rows={2} cols={20} placeholder='Ajouter un commentaire...' className='w-full resize-none border-0 text-sm outline-0 placeholder:text-sm'/>
          <Popover onOpenChange={setemojiRepliesOpen} open={emojiRepliesOpen}>
              <PopoverTrigger asChild>
                  <span className='text-xs'><SmilePlus size={18}/></span>
              </PopoverTrigger>
              <PopoverContent>
                  <EmojiPicker className="h-[342px]" onEmojiSelect={({ emoji }) => {
                      setReplies(replies + emoji);}}
                  >
                  <EmojiPickerSearch />
                  <EmojiPickerContent />
                  </EmojiPicker>
              </PopoverContent>
          </Popover>
      </span>
      {afficherButtonsReplies && (
        <div className='flex w-full items-center justify-end space-x-2'>
            <button onClick={()=>{setReplies("");setAfficherButtonReplies(false)}} className='cursor-pointer rounded-md p-2 text-sm transition-all duration-200 hover:bg-gray-200 hover:text-black'>Annuler</button>
            <Button disabled={replies.length < 1} className='cursor-pointer bg-sky-400 text-sm text-white hover:bg-sky-500'> Répondre <Send /></Button>
        </div>
      )}
    </div>
  )
}

export default Replies
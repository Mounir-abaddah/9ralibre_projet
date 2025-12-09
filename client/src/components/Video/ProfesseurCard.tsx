import { Button } from '../ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import type { VideoType } from '@/pages/auth/Videos/Video'

interface typeVideoProfesseur {
    videos:VideoType
    followCount:number
    handleFollow:(id:string)=>void
    follow:boolean
}
const ProfesseurCard = ({videos,followCount,handleFollow,follow}:typeVideoProfesseur) => {
  return (
    <div className="flex items-center justify-between rounded-xl border bg-white p-5 shadow-md dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={videos.professeur.image} />
              <AvatarFallback>
                {videos.professeur.nom[0]}
                {videos.professeur.prenom[0]}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col">
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                {videos.professeur.nom} {videos.professeur.prenom}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Professeur . {followCount} abonnés
              </span>
            </div>
          </div>

          <Button onClick={()=>handleFollow(videos.professeur._id)} 
            className={`cursor-pointer rounded-full px-5 transition duration-400 ${follow ? 'bg-amber-500 hover:bg-amber-600' : 'bg-sky-400 hover:bg-sky-500 dark:text-white'}`}>
            {follow ? 'Suivie(e)' : 'Suivre'}
          </Button>
        </div>
  )
}

export default ProfesseurCard
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Video, BookType } from "lucide-react"

interface Activity {
type: "cours" | "video" | "quiz"
title: string
createdAt: string
}

interface Props {
activities: Activity[]
}

const Activite = ({ activities }: Props) => {

const getIcon = (type: string) => {
    switch(type){
    case "cours":
        return <BookOpen size={18}/>
    case "video":
        return <Video size={18}/>
    case "quiz":
        return <BookType size={18}/>
    }
}

const getLabel = (type:string)=>{
    if(type === "cours") return "Cours publié"
    if(type === "video") return "Vidéo publiée"
    if(type === "quiz") return "Quiz créé"
}

return (
    <Card className="w-full">
    <CardHeader>
        <CardTitle>Activité récente</CardTitle>
    </CardHeader>

    <CardContent className="space-y-3">
        {activities.map((act,index)=>(
        <div key={index} className="flex items-start gap-3 border-b pb-2">
            <div className="text-cyan-500">
                {getIcon(act.type)}
            </div>
            <div className="flex flex-col">
                <span className="text-sm font-medium">
                    {getLabel(act.type)}
                </span>
                <span className="text-xs text-gray-500">
                    {act.title}
                </span>
                <span className="text-xs text-gray-400">
                    {new Date(act.createdAt).toLocaleString("fr-FR")}
                </span>
            </div>
        </div>
        ))}
    </CardContent>
    </Card>
)
}

export default Activite
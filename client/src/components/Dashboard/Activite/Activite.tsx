import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Video, BookType } from "lucide-react"
import { useTranslation } from "react-i18next";

interface Activity {
type: "cours" | "video" | "quiz"
title: string
createdAt: string
}

interface Props {
activities: Activity[]
}

const Activite = ({ activities }: Props) => {
const { t, i18n } = useTranslation();

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
    if(type === "cours") return t("prof.activities.coursePublished")
    if(type === "video") return t("prof.activities.videoPublished")
    if(type === "quiz") return t("prof.activities.quizCreated")
}

return (
    <Card className="w-full">
    <CardHeader>
        <CardTitle>{t("prof.activities.title")}</CardTitle>
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
                    {new Date(act.createdAt).toLocaleString(i18n.language === "en" ? "en-US" : "fr-FR")}
                </span>
            </div>
        </div>
        ))}
    </CardContent>
    </Card>
)
}

export default Activite
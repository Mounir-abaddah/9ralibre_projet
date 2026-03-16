import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageCircle } from "lucide-react"
import { Link } from "react-router-dom"

const ChatProf = () => {
  return (
    <Card className="w-full">
      <CardHeader className="flex justify-between">
        <CardTitle className="flex w-full items-center justify-between">
            <span className="flex items-center gap-2"><MessageCircle size={20}/>Derniers messages</span>
            <Link to={'/prof/chat'} className="border-b-2 border-b-sky-600 text-sm text-cyan-600">Voir tous</Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        
      </CardContent>
    </Card>
  )
}

export default ChatProf
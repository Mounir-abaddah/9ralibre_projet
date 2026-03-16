import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { typedataProf } from "@/store/userStore"
import { BookType, Eye, Users, Video } from "lucide-react"

interface Props {
  data: typedataProf | null
}

const CardProf = ({ data }: Props) => {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      <Card className="mx-auto flex w-full max-w-60 justify-center">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">Vidéos publiées <Video /></CardTitle>
          <CardDescription className="text-2xl">
            {data?.videos ?? 0}
          </CardDescription>
        </CardHeader>
      </Card>
      <Card className="mx-auto flex w-full max-w-60 justify-center">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">Total des vues <Eye /></CardTitle>
          <CardDescription className="text-2xl">
            12
          </CardDescription>
        </CardHeader>
      </Card>
      <Card className="mx-auto flex w-full max-w-60 justify-center">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">Abonnés <Users /></CardTitle>
          <CardDescription className="text-2xl">
            {data?.followers?.length ?? 0}
          </CardDescription>
        </CardHeader>
      </Card>
      <Card className="mx-auto flex w-full max-w-60 justify-center">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">Quiz créés <BookType /></CardTitle>
          <CardDescription className="text-2xl">
            {data?.quiz ?? 0}
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  )
}

export default CardProf
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import axios from "axios"
import { useEffect, useState } from "react"

const Chart = () => {

const apiUrl = import.meta.env.VITE_API_URL

const [chartData,setChartData] = useState([])

useEffect(()=>{

  const getStats = async()=>{

    const res = await axios.get(`${apiUrl}/prof/stats-week`,{
      withCredentials:true
    })

    setChartData(res.data.stats)
  }

  getStats()

},[])

const chartConfig = {
  views: {
    label: "Vues",
    color: "#F59E0B",
  },
  likes: {
    label: "Likes",
    color: "#06b6d4",
  },
} satisfies ChartConfig

return (

<Card>

<CardHeader>
<CardTitle>Statistiques de la semaine</CardTitle>
</CardHeader>

<CardContent>

<ChartContainer config={chartConfig} className="h-[350px] w-full">

<BarChart accessibilityLayer data={chartData}>

<CartesianGrid vertical={true} />

<XAxis
dataKey="day"
tickLine={false}
tickMargin={10}
axisLine={false}
tickFormatter={(value) => value.slice(0,3)}
/>

<ChartTooltip content={<ChartTooltipContent />} />
<ChartLegend content={<ChartLegendContent />} />

<Bar dataKey="views" fill="var(--color-views)" radius={4} />
<Bar dataKey="likes" fill="var(--color-likes)" radius={4} />

</BarChart>

</ChartContainer>

</CardContent>

</Card>

)

}

export default Chart
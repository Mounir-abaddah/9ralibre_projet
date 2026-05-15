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
import { useTranslation } from "react-i18next"

const chartConfig = {
  cours: {
    label: "Cours",
    color: "#F59E0B",
  },
  videos: {
    label: "Vidéos",
    color: "#06b6d4",
  },
  quiz: {
    label: "Quiz",
    color: "#8b5cf6",
  },
} satisfies ChartConfig

const Chart = () => {
  const { t } = useTranslation()
  const apiUrl = import.meta.env.VITE_API_URL
  const [chartData, setChartData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getStats = async () => {
      try {
        const res = await axios.get(`${apiUrl}/prof/stats-week`, {
          withCredentials: true,
        })
        setChartData(res.data.stats)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    getStats()
  }, [])

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          {t("prof.chart.title")}
        </CardTitle>
        <p className="text-muted-foreground text-sm">
          Contenu créé cette semaine
        </p>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="h-[350px] flex items-center justify-center text-muted-foreground text-sm">
            Chargement...
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[350px] w-full">
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} className="stroke-muted" />
              <XAxis
                dataKey="day"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="cours"  fill="var(--color-cours)"  radius={4} />
              <Bar dataKey="videos" fill="var(--color-videos)" radius={4} />
              <Bar dataKey="quiz"   fill="var(--color-quiz)"   radius={4} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}

export default Chart
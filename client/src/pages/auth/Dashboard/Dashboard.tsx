import PagesNonTrouver from "@/pages/PagesNonTrouver/PagesNonTrouver";
import { useProtectedRoutes } from "@/store/userStore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";

interface Video {
  _id: string;
  title: string;
}

interface Cours {
  _id: string;
  title: string;
}

const Dashboard = () => {

  document.title = "Dashboard | 9ralibre";

  const { niveaux } = useParams();
  const { data, fetchData } = useProtectedRoutes();

  const [date, setDate] = useState<Date | undefined>(new Date());
  const [savedVideos, setSavedVideos] = useState<Video[]>([]);
  const [savedCours, setSavedCours] = useState<Cours[]>([]);

  const enumParams = ["1AC","2AC","3AC","TC","1BAC","2BAC"];

  const fetchSaved = async () => {
    try {

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/user/saved/latest`,
        { withCredentials: true }
      );

      setSavedVideos(res.data.videos);
      setSavedCours(res.data.cours);

    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
    fetchSaved();
  }, []);

  if (!enumParams.includes(niveaux || "")) {
    return <PagesNonTrouver />;
  }

  return (
    <div className="w-full space-y-6 p-6">

      {/* Header */}
      <div className="rounded-xl bg-cyan-500 p-6 text-white">
        <h1 className="text-xl font-semibold">
          Bonjour {data?.nom} {data?.prenom}
        </h1>
        <p className="text-sm opacity-80">
          Bienvenue dans votre espace étudiant
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">

        <Card>
          <CardHeader>
            <CardTitle>Cours suivis</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-cyan-500">12</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Vidéos regardées</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-amber-500">35</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quiz complétés</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-cyan-500">8</p>
          </CardContent>
        </Card>

      </div>

      {/* Calendar + Saved */}
      <div className="grid gap-6 md:grid-cols-2">

        {/* Calendar */}
        <Card>
          <CardHeader>
            <CardTitle>Planning</CardTitle>
          </CardHeader>

          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="w-full rounded-md border"
            />
          </CardContent>
        </Card>

        {/* Derniers sauvegardés */}
        <Card>

          <CardHeader>
            <CardTitle>Derniers sauvegardés</CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">

            {savedVideos.map((video) => (
              <div
                key={video._id}
                className="flex justify-between rounded-lg border p-3"
              >
                <p>{video.title}</p>
                <span className="text-sm text-cyan-500">Vidéo</span>
              </div>
            ))}

            {savedCours.map((cours) => (
              <div
                key={cours._id}
                className="flex justify-between rounded-lg border p-3"
              >
                <p>{cours.title}</p>
                <span className="text-sm text-amber-500">Cours</span>
              </div>
            ))}

          </CardContent>

        </Card>

      </div>

    </div>
  );
};

export default Dashboard;
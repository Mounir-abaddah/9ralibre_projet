import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type ReportItem = {
  report: {
    reason: string;
    createdAt: string;
    user?: { nom?: string; prenom?: string; email?: string };
  };
  title: string;
  videoUrl?: string;
  commentText?: string;
  professeur?: { nom?: string; prenom?: string; email?: string };
};

const AdminSignals = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [videoReports, setVideoReports] = useState<ReportItem[]>([]);
  const [commentReports, setCommentReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReports = async () => {
      try {
        const response = await axios.get(`${apiUrl}/user/admin/reports`, { withCredentials: true });
        setVideoReports(response.data.videoReports || []);
        setCommentReports(response.data.commentReports || []);
      } catch {
        toast.error("Impossible de charger les signalements");
      } finally {
        setLoading(false);
      }
    };
    loadReports();
  }, []);

  if (loading) return <p>Chargement...</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Signalements</h1>
      <section className="space-y-2">
        <h2  className="rounded-md bg-cyan-400 p-2 font-semibold text-cyan-900">Signalements vidéos ({videoReports.length})</h2>
        <div className="rounded-md border ">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vidéo</TableHead>
                <TableHead>Professeur</TableHead>
                <TableHead>Signalé par</TableHead>
                <TableHead>Raison</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {videoReports.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-zinc-500">
                    Aucun signalement vidéo.
                  </TableCell>
                </TableRow>
              ) : (
                videoReports.map((item, index) => (
                  <TableRow key={`${item.title}-${index}`}>
                    <TableCell className="max-w-[260px] truncate">{item.title}</TableCell>
                    <TableCell>
                      {item.professeur
                        ? `${item.professeur.prenom || ""} ${item.professeur.nom || ""}`.trim()
                        : "-"}
                    </TableCell>
                    <TableCell>
                      {item.report.user
                        ? `${item.report.user.prenom || ""} ${item.report.user.nom || ""}`.trim()
                        : "-"}
                    </TableCell>
                    <TableCell className="max-w-[320px] truncate">{item.report.reason}</TableCell>
                    <TableCell>{new Date(item.report.createdAt).toLocaleString()}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="rounded-md bg-cyan-400 p-2 font-semibold text-cyan-900">Signalements commentaires ({commentReports.length})</h2>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vidéo</TableHead>
                <TableHead>Professeur</TableHead>
                <TableHead>Commentaire</TableHead>
                <TableHead>Signalé par</TableHead>
                <TableHead>Raison</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {commentReports.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-zinc-500">
                    Aucun signalement commentaire.
                  </TableCell>
                </TableRow>
              ) : (
                commentReports.map((item, index) => (
                  <TableRow key={`${item.title}-comment-${index}`}>
                    <TableCell className="max-w-[260px] truncate">{item.title}</TableCell>
                    <TableCell>
                      {item.professeur
                        ? `${item.professeur.prenom || ""} ${item.professeur.nom || ""}`.trim()
                        : "-"}
                    </TableCell>
                    <TableCell className="max-w-[280px] truncate">{item.commentText || "-"}</TableCell>
                    <TableCell>
                      {item.report.user
                        ? `${item.report.user.prenom || ""} ${item.report.user.nom || ""}`.trim()
                        : "-"}
                    </TableCell>
                    <TableCell className="max-w-[300px] truncate">{item.report.reason}</TableCell>
                    <TableCell>{new Date(item.report.createdAt).toLocaleString()}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  );
};

export default AdminSignals;

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { AlertTriangle, MessageSquareText, PlayCircle, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  const apiUrl = import.meta.env.VITE_API_URL;
  const [videoReports, setVideoReports] = useState<ReportItem[]>([]);
  const [commentReports, setCommentReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReports = async () => {
      try {
        const response = await axios.get(`${apiUrl}/admin/reports`, { withCredentials: true });
        setVideoReports(response.data.videoReports || []);
        setCommentReports(response.data.commentReports || []);
      } catch {
        toast.error(t("admin.signals.toasts.loadError"));
      } finally {
        setLoading(false);
      }
    };
    loadReports();
  }, [apiUrl, t]);

  const totalReports = useMemo(
    () => videoReports.length + commentReports.length,
    [videoReports.length, commentReports.length],
  );

  if (loading) {
    return (
      <div className="rounded-xl border bg-background p-6 shadow-sm">
        <p className="text-sm text-muted-foreground">{t("common.loading")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="rounded-xl border bg-zinc-900 p-5 text-white shadow-sm">
        <div className="flex items-center gap-2">
          <ShieldAlert size={18} className="text-amber-300" />
          <h1 className="text-2xl font-semibold">{t("admin.signals.title")}</h1>
        </div>
        <p className="mt-2 text-sm text-zinc-300">
          {t("admin.signals.videoTitle", { count: videoReports.length })} -{" "}
          {t("admin.signals.commentTitle", { count: commentReports.length })}
        </p>
      </header>

      <div className="grid gap-3 md:grid-cols-3">
        <article className="rounded-xl border p-4 shadow-sm">
          <div className="mb-1 flex items-center gap-2 text-zinc-500">
            <AlertTriangle size={16} />
            <span className="text-sm">{t("admin.signals.title")}</span>
          </div>
          <p className="text-2xl font-bold">{totalReports}</p>
        </article>
        <article className="rounded-xl border p-4 shadow-sm">
          <div className="mb-1 flex items-center gap-2 text-cyan-600">
            <PlayCircle size={16} />
            <span className="text-sm">{t("admin.signals.table.video")}</span>
          </div>
          <p className="text-2xl font-bold">{videoReports.length}</p>
        </article>
        <article className="rounded-xl border p-4 shadow-sm">
          <div className="mb-1 flex items-center gap-2 text-indigo-600">
            <MessageSquareText size={16} />
            <span className="text-sm">{t("admin.signals.table.comment")}</span>
          </div>
          <p className="text-2xl font-bold">{commentReports.length}</p>
        </article>
      </div>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">{t("admin.signals.videoTitle", { count: videoReports.length })}</h2>
          <Badge variant="secondary">{videoReports.length}</Badge>
        </div>
        <div className="overflow-hidden rounded-xl border bg-background shadow-sm">
          <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("admin.signals.table.video")}</TableHead>
                <TableHead>{t("admin.signals.table.professor")}</TableHead>
                <TableHead>{t("admin.signals.table.reportedBy")}</TableHead>
                <TableHead>{t("admin.signals.table.reason")}</TableHead>
                <TableHead>{t("admin.signals.table.date")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {videoReports.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center text-zinc-500">
                    {t("admin.signals.emptyVideo")}
                  </TableCell>
                </TableRow>
              ) : (
                videoReports.map((item, index) => (
                  <TableRow key={`${item.title}-${index}`} className="align-top">
                    <TableCell className="max-w-[260px] truncate font-medium">{item.title}</TableCell>
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
                    <TableCell className="whitespace-nowrap text-xs text-zinc-500">
                      {new Date(item.report.createdAt).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">{t("admin.signals.commentTitle", { count: commentReports.length })}</h2>
          <Badge variant="outline">{commentReports.length}</Badge>
        </div>
        <div className="overflow-hidden rounded-xl border bg-background shadow-sm">
          <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("admin.signals.table.video")}</TableHead>
                <TableHead>{t("admin.signals.table.professor")}</TableHead>
                <TableHead>{t("admin.signals.table.comment")}</TableHead>
                <TableHead>{t("admin.signals.table.reportedBy")}</TableHead>
                <TableHead>{t("admin.signals.table.reason")}</TableHead>
                <TableHead>{t("admin.signals.table.date")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {commentReports.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-8 text-center text-zinc-500">
                    {t("admin.signals.emptyComment")}
                  </TableCell>
                </TableRow>
              ) : (
                commentReports.map((item, index) => (
                  <TableRow key={`${item.title}-comment-${index}`} className="align-top">
                    <TableCell className="max-w-[260px] truncate font-medium">{item.title}</TableCell>
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
                    <TableCell className="whitespace-nowrap text-xs text-zinc-500">
                      {new Date(item.report.createdAt).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        </div>
      </section>
    </div>
  );
};

export default AdminSignals;

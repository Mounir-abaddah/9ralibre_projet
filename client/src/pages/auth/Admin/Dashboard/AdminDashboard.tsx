import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { AlertTriangle, ShieldX, UserPlus, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type AdminUser = {
  _id: string;
  nom: string;
  prenom: string;
  email: string;
  role: string;
  niveaux: string;
  blockedUntil?: string | null;
  createdAt?: string;
};

type ReportItem = {
  report: {
    reason: string;
    createdAt: string;
    user?: { nom?: string; prenom?: string; email?: string };
  };
  title: string;
  commentText?: string;
};

type UnifiedReport = {
  id: string;
  type: "video" | "comment";
  title: string;
  reason: string;
  createdAt: string;
  reportedBy: string;
  commentText?: string;
};

const AdminDashboard = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [videoReports, setVideoReports] = useState<ReportItem[]>([]);
  const [commentReports, setCommentReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [usersResponse, reportsResponse] = await Promise.all([
          axios.get(`${apiUrl}/user/admin/users`, { withCredentials: true }),
          axios.get(`${apiUrl}/user/admin/reports`, { withCredentials: true }),
        ]);

        setUsers(usersResponse.data.users || []);
        setVideoReports(reportsResponse.data.videoReports || []);
        setCommentReports(reportsResponse.data.commentReports || []);
      } catch {
        toast.error("Impossible de charger le dashboard admin");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [apiUrl]);

  const blockedCount = useMemo(
    () =>
      users.filter((user) => Boolean(user.blockedUntil && new Date(user.blockedUntil) > new Date())).length,
    [users],
  );

  const latestUsers = useMemo(
    () =>
      [...users]
        .sort(
          (a, b) =>
            new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime(),
        )
        .slice(0, 5),
    [users],
  );

  const latestReports = useMemo<UnifiedReport[]>(() => {
    const normalizedVideo = videoReports.map((item, index) => ({
      id: `video-${index}-${item.report.createdAt}`,
      type: "video" as const,
      title: item.title,
      reason: item.report.reason,
      createdAt: item.report.createdAt,
      reportedBy: item.report.user
        ? `${item.report.user.prenom || ""} ${item.report.user.nom || ""}`.trim() || item.report.user.email || "-"
        : "-",
    }));

    const normalizedComments = commentReports.map((item, index) => ({
      id: `comment-${index}-${item.report.createdAt}`,
      type: "comment" as const,
      title: item.title,
      reason: item.report.reason,
      createdAt: item.report.createdAt,
      reportedBy: item.report.user
        ? `${item.report.user.prenom || ""} ${item.report.user.nom || ""}`.trim() || item.report.user.email || "-"
        : "-",
      commentText: item.commentText,
    }));

    return [...normalizedVideo, ...normalizedComments]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 6);
  }, [videoReports, commentReports]);

  const totalReports = videoReports.length + commentReports.length;

  return (
    <div className="space-y-5">
      <div className="rounded-xl border bg-zinc-900 p-5 text-white shadow-sm">
        <h1 className="text-2xl font-semibold">Dashboard Admin</h1>
        <p className="text-sm text-zinc-300">
          Vue rapide sur la modération: signalements récents, nouveaux utilisateurs et accès direct aux outils admin.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        <div className="rounded-xl border p-4 shadow-sm">
          <div className="mb-1 flex items-center gap-2 text-zinc-500">
            <Users size={16} />
            <span className="text-sm">Utilisateurs</span>
          </div>
          <p className="text-2xl font-bold">{users.length}</p>
        </div>
        <div className="rounded-xl border p-4 shadow-sm">
          <div className="mb-1 flex items-center gap-2 text-red-600">
            <ShieldX size={16} />
            <span className="text-sm">Comptes bloqués</span>
          </div>
          <p className="text-2xl font-bold">{blockedCount}</p>
        </div>
        <div className="rounded-xl border p-4 shadow-sm">
          <div className="mb-1 flex items-center gap-2 text-amber-600">
            <AlertTriangle size={16} />
            <span className="text-sm">Signalements</span>
          </div>
          <p className="text-2xl font-bold">{totalReports}</p>
        </div>
        <div className="rounded-xl border p-4 shadow-sm">
          <div className="mb-1 flex items-center gap-2 text-emerald-600">
            <UserPlus size={16} />
            <span className="text-sm">Nouveaux (5 derniers)</span>
          </div>
          <p className="text-2xl font-bold">{latestUsers.length}</p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-xl border p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold">Derniers signalements reçus</h2>
            <Link to="/admin/signals" className="text-sm text-blue-600 hover:underline">
              Voir tout
            </Link>
          </div>
          {loading ? (
            <p className="text-sm text-zinc-500">Chargement...</p>
          ) : latestReports.length === 0 ? (
            <p className="text-sm text-zinc-500">Aucun signalement pour le moment.</p>
          ) : (
            <div className="space-y-3">
              {latestReports.map((report) => (
                <article key={report.id} className="rounded-lg border p-3">
                  <div className="mb-1 flex items-center gap-2">
                    <Badge variant={report.type === "video" ? "secondary" : "outline"}>
                      {report.type === "video" ? "Vidéo" : "Commentaire"}
                    </Badge>
                    <span className="text-xs text-zinc-500">
                      {new Date(report.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm font-medium">{report.title}</p>
                  {report.commentText ? (
                    <p className="truncate text-xs text-zinc-500">Commentaire: {report.commentText}</p>
                  ) : null}
                  <p className="truncate text-xs text-zinc-600">Raison: {report.reason}</p>
                  <p className="text-xs text-zinc-500">Signalé par: {report.reportedBy}</p>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-xl border p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold">Derniers utilisateurs</h2>
            <Link to="/admin/users" className="text-sm text-blue-600 hover:underline">
              Gérer les utilisateurs
            </Link>
          </div>
          {loading ? (
            <p className="text-sm text-zinc-500">Chargement...</p>
          ) : latestUsers.length === 0 ? (
            <p className="text-sm text-zinc-500">Aucun utilisateur trouvé.</p>
          ) : (
            <div className="space-y-3">
              {latestUsers.map((user) => {
                const isBlocked = Boolean(user.blockedUntil && new Date(user.blockedUntil) > new Date());
                return (
                  <article key={user._id} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="text-sm font-medium">
                        {user.prenom} {user.nom}
                      </p>
                      <p className="text-xs text-zinc-500">{user.email}</p>
                      <p className="text-xs text-zinc-500">
                        {user.role} {user.niveaux && user.niveaux !== "Non renseigné" ? `- ${user.niveaux}` : ""}
                      </p>
                    </div>
                    <Badge className={isBlocked ? "bg-red-600 text-white" : "bg-emerald-600 text-white"}>
                      {isBlocked ? "Bloqué" : "Actif"}
                    </Badge>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Link to="/admin/users" className="rounded-lg border p-4 shadow-sm transition hover:bg-zinc-50">
          <h3 className="font-semibold">Utilisateurs</h3>
          <p className="text-sm text-zinc-500">Blocage/déblocage des comptes et suivi des statuts.</p>
        </Link>
        <Link to="/admin/signals" className="rounded-lg border p-4 shadow-sm transition hover:bg-zinc-50">
          <h3 className="font-semibold">Signalements</h3>
          <p className="text-sm text-zinc-500">Analyse des signalements vidéo et commentaires.</p>
        </Link>
        <Link to="/admin/appeals" className="rounded-lg border p-4 shadow-sm transition hover:bg-zinc-50">
          <h3 className="font-semibold">Recours</h3>
          <p className="text-sm text-zinc-500">Valider ou rejeter les demandes d'appel utilisateur.</p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
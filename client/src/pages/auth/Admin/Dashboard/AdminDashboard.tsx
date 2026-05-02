import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { AlertTriangle, ShieldX, UserPlus, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";

type AdminUser = {
  _id: string;
  nom: string;
  prenom: string;
  email: string;
  role: string;
  niveaux: string;
  status?: "pending" | "approved" | "declined";
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
  const { t } = useTranslation();
  const apiUrl = import.meta.env.VITE_API_URL;
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [videoReports, setVideoReports] = useState<ReportItem[]>([]);
  const [commentReports, setCommentReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingProfessorId, setUpdatingProfessorId] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [usersResponse, reportsResponse] = await Promise.all([
          axios.get(`${apiUrl}/admin/users`, { withCredentials: true }),
          axios.get(`${apiUrl}/admin/reports`, { withCredentials: true }),
        ]);

        setUsers(usersResponse.data.users || []);
        setVideoReports(reportsResponse.data.videoReports || []);
        setCommentReports(reportsResponse.data.commentReports || []);
      } catch {
        toast.error(t("admin.dashboard.toasts.loadError"));
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

  const handleProfessorStatusChange = async (
    user: AdminUser,
    status: "approved" | "declined",
  ) => {
    const conditions = window.prompt(
      status === "approved"
        ? t("admin.dashboard.prompts.approve")
        : t("admin.dashboard.prompts.decline"),
      "",
    );

    if (conditions === null) return;

    try {
      setUpdatingProfessorId(user._id);
      await axios.patch(
        `${apiUrl}/user/admin/professeurs/${user._id}/status`,
        { status, conditions: conditions.trim() },
        { withCredentials: true },
      );

      setUsers((prev) =>
        prev.map((item) =>
          item._id === user._id
            ? {
                ...item,
                status,
              }
            : item,
        ),
      );

      toast.success(
        status === "approved"
          ? t("admin.dashboard.toasts.profApproved")
          : t("admin.dashboard.toasts.profDeclined"),
      );
    } catch {
      toast.error(t("admin.dashboard.toasts.profStatusError"));
    } finally {
      setUpdatingProfessorId(null);
    }
  };

  return (
    <div className="space-y-5">
      <div className="rounded-xl border bg-zinc-900 p-5 text-white shadow-sm">
        <h1 className="text-2xl font-semibold">{t("admin.dashboard.title")}</h1>
        <p className="text-sm text-zinc-300">
          {t("admin.dashboard.subtitle")}
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        <div className="rounded-xl border p-4 shadow-sm">
          <div className="mb-1 flex items-center gap-2 text-zinc-500">
            <Users size={16} />
            <span className="text-sm">{t("admin.dashboard.cards.users")}</span>
          </div>
          <p className="text-2xl font-bold">{users.length}</p>
        </div>
        <div className="rounded-xl border p-4 shadow-sm">
          <div className="mb-1 flex items-center gap-2 text-red-600">
            <ShieldX size={16} />
            <span className="text-sm">{t("admin.dashboard.cards.blockedAccounts")}</span>
          </div>
          <p className="text-2xl font-bold">{blockedCount}</p>
        </div>
        <div className="rounded-xl border p-4 shadow-sm">
          <div className="mb-1 flex items-center gap-2 text-amber-600">
            <AlertTriangle size={16} />
            <span className="text-sm">{t("admin.dashboard.cards.reports")}</span>
          </div>
          <p className="text-2xl font-bold">{totalReports}</p>
        </div>
        <div className="rounded-xl border p-4 shadow-sm">
          <div className="mb-1 flex items-center gap-2 text-emerald-600">
            <UserPlus size={16} />
            <span className="text-sm">{t("admin.dashboard.cards.newUsers")}</span>
          </div>
          <p className="text-2xl font-bold">{latestUsers.length}</p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-xl border p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold">{t("admin.dashboard.latestReports.title")}</h2>
            <Link to="/admin/signals" className="text-sm text-blue-600 hover:underline">
              {t("admin.dashboard.latestReports.viewAll")}
            </Link>
          </div>
          {loading ? (
            <p className="text-sm text-zinc-500">{t("common.loading")}</p>
          ) : latestReports.length === 0 ? (
            <p className="text-sm text-zinc-500">{t("admin.dashboard.latestReports.empty")}</p>
          ) : (
            <div className="space-y-3">
              {latestReports.map((report) => (
                <article key={report.id} className="rounded-lg border p-3">
                  <div className="mb-1 flex items-center gap-2">
                    <Badge variant={report.type === "video" ? "secondary" : "outline"}>
                      {report.type === "video" ? t("admin.dashboard.reportType.video") : t("admin.dashboard.reportType.comment")}
                    </Badge>
                    <span className="text-xs text-zinc-500">
                      {new Date(report.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm font-medium">{report.title}</p>
                  {report.commentText ? (
                    <p className="truncate text-xs text-zinc-500">{t("admin.dashboard.labels.comment")}: {report.commentText}</p>
                  ) : null}
                  <p className="truncate text-xs text-zinc-600">{t("admin.dashboard.labels.reason")}: {report.reason}</p>
                  <p className="text-xs text-zinc-500">{t("admin.dashboard.labels.reportedBy")}: {report.reportedBy}</p>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-xl border p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold">{t("admin.dashboard.latestUsers.title")}</h2>
            <Link to="/admin/users" className="text-sm text-blue-600 hover:underline">
              {t("admin.dashboard.latestUsers.manage")}
            </Link>
          </div>
          {loading ? (
            <p className="text-sm text-zinc-500">{t("common.loading")}</p>
          ) : latestUsers.length === 0 ? (
            <p className="text-sm text-zinc-500">{t("admin.dashboard.latestUsers.empty")}</p>
          ) : (
            <div className="space-y-3">
              {latestUsers.map((user) => {
                const isBlocked = Boolean(user.blockedUntil && new Date(user.blockedUntil) > new Date());
                const isPendingProf = user.role === "Professeur" && user.status === "pending";
                const isDeclinedProf = user.role === "Professeur" && user.status === "declined";
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
                      {user.role === "Professeur" ? (
                        <p className="text-xs text-zinc-500">
                          {t("admin.dashboard.labels.status")}:{" "}
                          {user.status === "approved"
                            ? t("admin.dashboard.status.approved")
                            : user.status === "declined"
                              ? t("admin.dashboard.status.declined")
                              : t("admin.dashboard.status.pending")}
                        </p>
                      ) : null}
                    </div>
                    <div className="flex items-center gap-2">
                      {(isPendingProf || isDeclinedProf) && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleProfessorStatusChange(user, "approved")}
                            disabled={updatingProfessorId === user._id}
                            className="rounded-md bg-emerald-600 px-2 py-1 text-xs font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {t("admin.dashboard.actions.approve")}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleProfessorStatusChange(user, "declined")}
                            disabled={updatingProfessorId === user._id}
                            className="rounded-md bg-red-600 px-2 py-1 text-xs font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {t("admin.dashboard.actions.decline")}
                          </button>
                        </>
                      )}
                      <Badge className={isBlocked ? "bg-red-600 text-white" : "bg-emerald-600 text-white"}>
                        {isBlocked ? t("admin.dashboard.state.blocked") : t("admin.dashboard.state.active")}
                      </Badge>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Link to="/admin/users" className="rounded-lg border p-4 shadow-sm transition">
          <h3 className="font-semibold">{t("admin.dashboard.quickLinks.usersTitle")}</h3>
          <p className="text-sm text-zinc-500">{t("admin.dashboard.quickLinks.usersDesc")}</p>
        </Link>
        <Link to="/admin/professors" className="rounded-lg border p-4 shadow-sm transition">
          <h3 className="font-semibold">{t("admin.dashboard.quickLinks.professorsTitle")}</h3>
          <p className="text-sm text-zinc-500">{t("admin.dashboard.quickLinks.professorsDesc")}</p>
        </Link>
        <Link to="/admin/signals" className="rounded-lg border p-4 shadow-sm transition">
          <h3 className="font-semibold">{t("admin.dashboard.quickLinks.signalsTitle")}</h3>
          <p className="text-sm text-zinc-500">{t("admin.dashboard.quickLinks.signalsDesc")}</p>
        </Link>
        <Link to="/admin/appeals" className="rounded-lg border p-4 shadow-sm transition">
          <h3 className="font-semibold">{t("admin.dashboard.quickLinks.appealsTitle")}</h3>
          <p className="text-sm text-zinc-500">{t("admin.dashboard.quickLinks.appealsDesc")}</p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
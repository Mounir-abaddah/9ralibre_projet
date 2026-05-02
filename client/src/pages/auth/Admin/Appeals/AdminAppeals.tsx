import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";

type Appeal = {
  _id: string;
  email: string;
  message: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  user?: { nom?: string; prenom?: string; email?: string };
};

const AdminAppeals = () => {
  const { t } = useTranslation();
  const apiUrl = import.meta.env.VITE_API_URL;
  const [appeals, setAppeals] = useState<Appeal[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAppeals = async () => {
    try {
      const response = await axios.get(`${apiUrl}/admin/appeals`, {
        withCredentials: true,
      });
      setAppeals(response.data.appeals || []);
    } catch {
      toast.error(t("admin.appeals.toasts.loadError"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppeals();
  }, []);

  const reviewAppeal = async (appealId: string, status: "APPROVED" | "REJECTED") => {
    const reviewNote = window.prompt(t("admin.appeals.prompts.reviewNote"), "") || "";
    try {
      await axios.patch(
        `${apiUrl}/admin/appeals/${appealId}/review`,
        { status, reviewNote },
        { withCredentials: true },
      );
      toast.success(status === "APPROVED" ? t("admin.appeals.toasts.approved") : t("admin.appeals.toasts.rejected"));
      loadAppeals();
    } catch {
      toast.error(t("admin.appeals.toasts.reviewError"));
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">{t("admin.appeals.title")}</h1>
      {loading ? (
        <p>{t("common.loading")}</p>
      ) : (
        <div className="rounded-xl border shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("admin.appeals.table.user")}</TableHead>
                <TableHead>{t("admin.appeals.table.email")}</TableHead>
                <TableHead>{t("admin.appeals.table.message")}</TableHead>
                <TableHead>{t("admin.appeals.table.status")}</TableHead>
                <TableHead>{t("admin.appeals.table.date")}</TableHead>
                <TableHead>{t("admin.appeals.table.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appeals.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-zinc-500">
                    {t("admin.appeals.empty")}
                  </TableCell>
                </TableRow>
              ) : (
                appeals.map((appeal) => (
                  <TableRow key={appeal._id}>
                    <TableCell>
                      {appeal.user
                        ? `${appeal.user.prenom || ""} ${appeal.user.nom || ""}`.trim()
                        : "-"}
                    </TableCell>
                    <TableCell>{appeal.email}</TableCell>
                    <TableCell className="max-w-[420px] truncate">{appeal.message}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          appeal.status === "PENDING"
                            ? "outline"
                            : appeal.status === "APPROVED"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {appeal.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(appeal.createdAt).toLocaleString()}</TableCell>
                    <TableCell className="space-x-2">
                      {appeal.status === "PENDING" ? (
                        <>
                          <Button
                            size="sm"
                            className="bg-emerald-600 text-white hover:bg-emerald-700"
                            onClick={() => reviewAppeal(appeal._id, "APPROVED")}
                          >
                            {t("admin.appeals.actions.approve")}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => reviewAppeal(appeal._id, "REJECTED")}
                          >
                            {t("admin.appeals.actions.reject")}
                          </Button>
                        </>
                      ) : (
                        <span className="text-xs text-zinc-400">{t("admin.appeals.actions.alreadyReviewed")}</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default AdminAppeals;

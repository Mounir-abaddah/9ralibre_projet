import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { CheckCircle2, Clock3, Search, UserCheck, XCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "react-i18next";

type ProfessorUser = {
  _id: string;
  nom: string;
  prenom: string;
  email: string;
  niveaux: string;
  role: string;
  status?: "pending" | "approved" | "declined";
  createdAt?: string;
};

const AdminProfessors = () => {
  const { t } = useTranslation();
  const apiUrl = import.meta.env.VITE_API_URL;
  const [professors, setProfessors] = useState<ProfessorUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "declined">("all");
  const [selectedProfessor, setSelectedProfessor] = useState<ProfessorUser | null>(null);
  const [targetStatus, setTargetStatus] = useState<"approved" | "declined">("approved");
  const [conditions, setConditions] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const loadProfessors = async () => {
    try {
      const response = await axios.get(`${apiUrl}/admin/users`, { withCredentials: true });
      const allUsers: ProfessorUser[] = response.data.users || [];
      setProfessors(allUsers.filter((item) => item.role === "Professeur"));
    } catch {
      toast.error(t("admin.professors.toasts.loadError"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfessors();
  }, []);

  const filteredProfessors = useMemo(() => {
    const q = search.toLowerCase();
    return professors.filter((user) => {
      const fullName = `${user.prenom} ${user.nom}`.toLowerCase();
      const matchesSearch = fullName.includes(q) || user.email.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "all" ? true : user.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [professors, search, statusFilter]);

  const pendingCount = useMemo(
    () => professors.filter((item) => item.status === "pending").length,
    [professors],
  );
  const approvedCount = useMemo(
    () => professors.filter((item) => item.status === "approved").length,
    [professors],
  );
  const declinedCount = useMemo(
    () => professors.filter((item) => item.status === "declined").length,
    [professors],
  );

  const openStatusDialog = (professor: ProfessorUser, status: "approved" | "declined") => {
    setSelectedProfessor(professor);
    setTargetStatus(status);
    setConditions("");
    setOpenDialog(true);
  };

  const handleConfirmStatus = async () => {
    if (!selectedProfessor) return;
    try {
      setSubmitting(true);
      await axios.patch(
        `${apiUrl}/admin/professeurs/${selectedProfessor._id}/status`,
        { status: targetStatus, conditions: conditions.trim() },
        { withCredentials: true },
      );
      toast.success(
        targetStatus === "approved"
          ? t("admin.professors.toasts.approved")
          : t("admin.professors.toasts.declined"),
      );
      setOpenDialog(false);
      setSelectedProfessor(null);
      await loadProfessors();
    } catch {
      toast.error(t("admin.professors.toasts.statusError"));
    } finally {
      setSubmitting(false);
    }
  };

  const statusBadge = (status?: ProfessorUser["status"]) => {
    if (status === "approved") return <Badge className="bg-emerald-600 text-white">{t("admin.professors.status.approved")}</Badge>;
    if (status === "declined") return <Badge variant="destructive">{t("admin.professors.status.declined")}</Badge>;
    return <Badge variant="secondary">{t("admin.professors.status.pending")}</Badge>;
  };

  return (
    <div className="space-y-5">
      <div className="rounded-xl border bg-zinc-900  p-5 text-white shadow-sm">
        <h1 className="text-2xl font-semibold">{t("admin.professors.title")}</h1>
        <p className="text-sm text-indigo-100">
          {t("admin.professors.subtitle")}
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        <div className="rounded-xl border p-4 shadow-sm">
          <div className="mb-1 flex items-center gap-2 text-zinc-500">
            <UserCheck size={16} />
            <span className="text-sm">{t("admin.professors.cards.total")}</span>
          </div>
          <p className="text-2xl font-bold">{professors.length}</p>
        </div>
        <div className="rounded-xl border p-4 shadow-sm">
          <div className="mb-1 flex items-center gap-2 text-amber-600">
            <Clock3 size={16} />
            <span className="text-sm">{t("admin.professors.cards.pending")}</span>
          </div>
          <p className="text-2xl font-bold">{pendingCount}</p>
        </div>
        <div className="rounded-xl border p-4 shadow-sm">
          <div className="mb-1 flex items-center gap-2 text-emerald-600">
            <CheckCircle2 size={16} />
            <span className="text-sm">{t("admin.professors.cards.approved")}</span>
          </div>
          <p className="text-2xl font-bold">{approvedCount}</p>
        </div>
        <div className="rounded-xl border p-4 shadow-sm">
          <div className="mb-1 flex items-center gap-2 text-red-600">
            <XCircle size={16} />
            <span className="text-sm">{t("admin.professors.cards.declined")}</span>
          </div>
          <p className="text-2xl font-bold">{declinedCount}</p>
        </div>
      </div>

      <div className="w-full rounded-xl border p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-3">
          <div className="relative md:col-span-2">
            <Search className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-zinc-400" size={16} />
            <Input
              placeholder={t("admin.professors.searchPlaceholder")}
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={(value) =>
              setStatusFilter(value as "all" | "pending" | "approved" | "declined")
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t("admin.professors.filterPlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("admin.professors.filters.all")}</SelectItem>
              <SelectItem value="pending">{t("admin.professors.filters.pending")}</SelectItem>
              <SelectItem value="approved">{t("admin.professors.filters.approved")}</SelectItem>
              <SelectItem value="declined">{t("admin.professors.filters.declined")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-zinc-500">{t("common.loading")}</p>
      ) : (
        <div className="rounded-xl border shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("admin.professors.table.professor")}</TableHead>
                <TableHead>{t("admin.professors.table.email")}</TableHead>
                <TableHead>{t("admin.professors.table.level")}</TableHead>
                <TableHead>{t("admin.professors.table.status")}</TableHead>
                <TableHead>{t("admin.professors.table.createdAt")}</TableHead>
                <TableHead>{t("admin.professors.table.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProfessors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-zinc-500">
                    {t("admin.professors.empty")}
                  </TableCell>
                </TableRow>
              ) : (
                filteredProfessors.map((prof) => (
                  <TableRow key={prof._id}>
                    <TableCell className="font-medium">
                      {prof.prenom} {prof.nom}
                    </TableCell>
                    <TableCell>{prof.email}</TableCell>
                    <TableCell>{prof.niveaux || "-"}</TableCell>
                    <TableCell>{statusBadge(prof.status)}</TableCell>
                    <TableCell>
                      {prof.createdAt ? new Date(prof.createdAt).toLocaleDateString() : "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          size="sm"
                          className="bg-emerald-600 text-white hover:bg-emerald-700"
                          onClick={() => openStatusDialog(prof, "approved")}
                          disabled={submitting}
                        >
                          {t("admin.professors.actions.accept")}
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          onClick={() => openStatusDialog(prof, "declined")}
                          disabled={submitting}
                        >
                          {t("admin.professors.actions.decline")}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {targetStatus === "approved"
                ? t("admin.professors.dialog.titleApprove")
                : t("admin.professors.dialog.titleDecline")}
            </DialogTitle>
            <DialogDescription>
              {selectedProfessor
                ? t("admin.professors.dialog.descriptionUser", {
                    firstName: selectedProfessor.prenom,
                    lastName: selectedProfessor.nom,
                  })
                : t("admin.professors.dialog.description")}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-1">
            <label className="text-sm font-medium">{t("admin.professors.dialog.conditionsLabel")}</label>
            <Textarea
              value={conditions}
              onChange={(e) => setConditions(e.target.value)}
              rows={5}
              placeholder={
                targetStatus === "approved"
                  ? t("admin.professors.dialog.placeholderApprove")
                  : t("admin.professors.dialog.placeholderDecline")
              }
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOpenDialog(false);
                setSelectedProfessor(null);
              }}
              disabled={submitting}
            >
              {t("common.cancel")}
            </Button>
            <Button
              type="button"
              onClick={handleConfirmStatus}
              disabled={submitting}
              className={targetStatus === "approved" ? "bg-emerald-600 text-white hover:bg-emerald-700" : ""}
              variant={targetStatus === "declined" ? "destructive" : "default"}
            >
              {submitting
                ? t("admin.professors.dialog.sending")
                : targetStatus === "approved"
                  ? t("admin.professors.dialog.confirmApprove")
                  : t("admin.professors.dialog.confirmDecline")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProfessors;

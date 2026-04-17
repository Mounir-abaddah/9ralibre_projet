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
import { Badge } from "@/components/ui/badge";

type LogItem = {
  _id: string;
  action: "BLOCK" | "UNBLOCK" | "APPEAL_REVIEWED";
  reason: string;
  createdAt: string;
  admin?: { nom?: string; prenom?: string; email?: string };
  targetUser?: { nom?: string; prenom?: string; email?: string };
};

const AdminModerationLog = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLogs = async () => {
      try {
        const response = await axios.get(`${apiUrl}/user/admin/moderation-logs`, {
          withCredentials: true,
        });
        setLogs(response.data.logs || []);
      } catch {
        toast.error("Impossible de charger les logs");
      } finally {
        setLoading(false);
      }
    };
    loadLogs();
  }, [apiUrl]);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Moderation Log</h1>
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <div className="rounded-xl border shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Action</TableHead>
                <TableHead>Admin</TableHead>
                <TableHead>Utilisateur ciblé</TableHead>
                <TableHead>Raison</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-zinc-500">
                    Aucun log disponible.
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((log) => (
                  <TableRow key={log._id}>
                    <TableCell>
                      <Badge
                        variant={
                          log.action === "BLOCK"
                            ? "destructive"
                            : log.action === "UNBLOCK"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {log.action}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {log.admin ? `${log.admin.prenom || ""} ${log.admin.nom || ""}`.trim() : "-"}
                    </TableCell>
                    <TableCell>
                      {log.targetUser
                        ? `${log.targetUser.prenom || ""} ${log.targetUser.nom || ""}`.trim()
                        : "-"}
                    </TableCell>
                    <TableCell className="max-w-[340px] truncate">{log.reason || "-"}</TableCell>
                    <TableCell>{new Date(log.createdAt).toLocaleString()}</TableCell>
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

export default AdminModerationLog;

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

type Appeal = {
  _id: string;
  email: string;
  message: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  user?: { nom?: string; prenom?: string; email?: string };
};

const AdminAppeals = () => {
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
      toast.error("Impossible de charger les demandes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppeals();
  }, []);

  const reviewAppeal = async (appealId: string, status: "APPROVED" | "REJECTED") => {
    const reviewNote = window.prompt("Note admin (optionnel):", "") || "";
    try {
      await axios.patch(
        `${apiUrl}/admin/appeals/${appealId}/review`,
        { status, reviewNote },
        { withCredentials: true },
      );
      toast.success(status === "APPROVED" ? "Demande acceptée" : "Demande rejetée");
      loadAppeals();
    } catch {
      toast.error("Erreur traitement demande");
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Appeals</h1>
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <div className="rounded-xl border shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Utilisateur</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appeals.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-zinc-500">
                    Aucune demande pour le moment.
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
                            Approuver
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => reviewAppeal(appeal._id, "REJECTED")}
                          >
                            Rejeter
                          </Button>
                        </>
                      ) : (
                        <span className="text-xs text-zinc-400">Déjà traité</span>
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

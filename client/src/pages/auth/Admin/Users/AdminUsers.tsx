import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { ShieldCheck, ShieldX, Users } from "lucide-react";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type AdminUser = {
  _id: string;
  nom: string;
  prenom: string;
  email: string;
  role: string;
  niveaux: string;
  blockedUntil?: string | null;
  blockReason?: string;
};

const AdminUsers = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [openBlockDialog, setOpenBlockDialog] = useState(false);
  const [openUnblockDialog, setOpenUnblockDialog] = useState(false);
  const [blockDays, setBlockDays] = useState("20");
  const [blockReason, setBlockReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadUsers = async () => {
    try {
      const response = await axios.get(`${apiUrl}/admin/prof/users`, { withCredentials: true });
      setUsers(response.data.users || []);
    } catch {
      toast.error("Impossible de charger les utilisateurs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const isBlocked = (blockedUntil?: string | null) =>
    Boolean(blockedUntil && new Date(blockedUntil) > new Date());

  const updateUserBlockStatus = async (user: AdminUser, days: number, reason = "") => {
    try {
      setSubmitting(true);
      await axios.patch(
        `${apiUrl}/admin/users/${user._id}/block`,
        { days, reason },
        { withCredentials: true },
      );
      toast.success(days === 0 ? "Utilisateur débloqué" : "Utilisateur bloqué");
      await loadUsers();
    } catch {
      toast.error("Erreur pendant le blocage");
    } finally {
      setSubmitting(false);
    }
  };

  const handleActionClick = (user: AdminUser) => {
    setSelectedUser(user);
    if (isBlocked(user.blockedUntil)) {
      setOpenUnblockDialog(true);
      return;
    }
    setBlockDays("20");
    setBlockReason("");
    setOpenBlockDialog(true);
  };

  const handleConfirmBlock = async () => {
    if (!selectedUser) return;
    const days = Number(blockDays);
    if (!Number.isFinite(days) || days <= 0) {
      toast.error("Nombre de jours invalide");
      return;
    }
    await updateUserBlockStatus(selectedUser, days, blockReason.trim());
    setOpenBlockDialog(false);
    setSelectedUser(null);
  };

  const handleConfirmUnblock = async () => {
    if (!selectedUser) return;
    await updateUserBlockStatus(selectedUser, 0);
    setOpenUnblockDialog(false);
    setSelectedUser(null);
  };

  const filteredUsers = users.filter((user) => {
    const fullName = `${user.prenom} ${user.nom}`.toLowerCase();
    return (
      fullName.includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.role.toLowerCase().includes(search.toLowerCase())
    );
  });

  const blockedCount = users.filter((u) => isBlocked(u.blockedUntil)).length;
  const unblockedCount = users.length - blockedCount;

  return (
    <div className="space-y-5">
      <div className="rounded-xl border  bg-amber-500 p-5 text-white shadow-sm">
        <h1 className="text-2xl font-semibold">Gestion des utilisateurs</h1>
        <p className="text-sm text-zinc-500">
          Liste des comptes (hors admins), avec blocage et déblocage rapide.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-xl border p-4 shadow-sm">
          <div className="mb-1 flex items-center gap-2 text-zinc-500">
            <Users size={16} />
            <span className="text-sm">Total</span>
          </div>
          <p className="text-2xl font-bold">{users.length}</p>
        </div>
        <div className="rounded-xl border p-4 shadow-sm">
          <div className="mb-1 flex items-center gap-2 text-red-500">
            <ShieldX size={16} />
            <span className="text-sm">Bloqués</span>
          </div>
          <p className="text-2xl font-bold">{blockedCount}</p>
        </div>
        <div className="rounded-xl border p-4 shadow-sm">
          <div className="mb-1 flex items-center gap-2 text-emerald-600">
            <ShieldCheck size={16} />
            <span className="text-sm">Actifs</span>
          </div>
          <p className="text-2xl font-bold">{unblockedCount}</p>
        </div>
      </div>

      <div className="rounded-xl border  p-4 shadow-sm">
        <Input
          placeholder="Rechercher par nom, email, rôle..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <p>Chargement...</p>
      ) : (
        <div className="rounded-xl border  shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Utilisateur</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Niveau</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Fin de blocage</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-zinc-500">
                    Aucun utilisateur trouvé.
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => {
                  const blocked = isBlocked(user.blockedUntil);
                  return (
                    <TableRow key={user._id}>
                      <TableCell className="font-medium">
                        {user.prenom} {user.nom}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>{user.niveaux || "-"}</TableCell>
                      <TableCell>
                        {blocked ? (
                          <Badge variant="destructive">Bloqué</Badge>
                        ) : (
                          <Badge className="bg-emerald-600 text-white">Actif</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {blocked && user.blockedUntil
                          ? new Date(user.blockedUntil).toLocaleDateString()
                          : "-"}
                      </TableCell>
                      <TableCell>
                        <Button
                          type="button"
                          size="sm"
                          variant={blocked ? "outline" : "destructive"}
                          onClick={() => handleActionClick(user)}
                          className={blocked ? "border-emerald-500 text-emerald-700 hover:bg-emerald-50" : ""}
                        >
                          {blocked ? "Débloquer" : "Bloquer"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={openBlockDialog} onOpenChange={setOpenBlockDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bloquer un utilisateur</DialogTitle>
            <DialogDescription>
              {selectedUser
                ? `Définis la durée du blocage pour ${selectedUser.prenom} ${selectedUser.nom}.`
                : "Définis la durée du blocage."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-sm font-medium">Nombre de jours</label>
              <Input
                type="number"
                min={1}
                value={blockDays}
                onChange={(e) => setBlockDays(e.target.value)}
                placeholder="Ex: 20"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Raison (optionnel)</label>
              <Textarea
                value={blockReason}
                onChange={(e) => setBlockReason(e.target.value)}
                placeholder="Ex: spam, insultes, non-respect des règles..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOpenBlockDialog(false);
                setSelectedUser(null);
              }}
              disabled={submitting}
            >
              Annuler
            </Button>
            <Button type="button" variant="destructive" onClick={handleConfirmBlock} disabled={submitting}>
              {submitting ? "Blocage..." : "Confirmer le blocage"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={openUnblockDialog} onOpenChange={setOpenUnblockDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Débloquer cet utilisateur ?</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedUser
                ? `Le compte de ${selectedUser.prenom} ${selectedUser.nom} redeviendra actif immédiatement.`
                : "Le compte redeviendra actif immédiatement."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setSelectedUser(null);
              }}
              disabled={submitting}
            >
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmUnblock}
              disabled={submitting}
              className="bg-emerald-600 text-white hover:bg-emerald-700"
            >
              {submitting ? "Déblocage..." : "Débloquer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminUsers;

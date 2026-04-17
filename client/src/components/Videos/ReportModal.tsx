import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type ReportModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  endpoint: string;
  title?: string;
  onSuccess?: () => void;
};

const ReportModal = ({ open, onOpenChange, endpoint, title = "Signaler", onSuccess }: ReportModalProps) => {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (reason.trim().length < 3) {
      toast.error("Merci de donner une raison plus claire");
      return;
    }
    try {
      setLoading(true);
      await axios.post(endpoint, { reason: reason.trim() }, { withCredentials: true });
      toast.success("Signalement envoyé");
      setReason("");
      onOpenChange(false);
      onSuccess?.();
    } catch {
      toast.error("Erreur pendant l'envoi du signalement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <p className="text-sm text-zinc-500">
            Décris rapidement la raison du signalement.
          </p>
          <textarea
            rows={4}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Exemple: contenu inapproprié, spam, insultes..."
            className="w-full resize-none rounded-md border p-2 text-sm outline-none"
          />
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Annuler
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="bg-red-500 hover:bg-red-600"
          >
            {loading ? "Envoi..." : "Envoyer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReportModal;

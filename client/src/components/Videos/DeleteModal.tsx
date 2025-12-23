import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "../ui/button"

interface typeModal{
  commentId:string;
  setCommentToDelete: React.Dispatch<React.SetStateAction<string | null>>;
  onConfirm: (id: string) => void;
}
const DeleteModal = ({ commentId, setCommentToDelete, onConfirm }: typeModal) => {
  return (
    <Dialog open>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Supprimer le commentaire</DialogTitle>
                <DialogDescription>
                    Supprimer définitivement votre commentaire ?
                </DialogDescription>
            </DialogHeader>
            <DialogFooter>
            <Button className="cursor-pointer" onClick={() => setCommentToDelete(null)}>Annuler</Button>
            <Button variant={'destructive'} className="cursor-pointer" onClick={() => {
                        onConfirm(commentId);
                        setCommentToDelete(null);
                    }}>Supprimer</Button>
        </DialogFooter>
        </DialogContent>
    </Dialog>
  )
}

export default DeleteModal
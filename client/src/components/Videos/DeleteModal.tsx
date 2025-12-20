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
    openModal:boolean;
}
const DeleteModal = ({openModal}:typeModal) => {
  return (
    <Dialog open={openModal}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Supprimer le commentaire</DialogTitle>
                <DialogDescription>
                    Supprimer définitivement votre commentaire ?
                </DialogDescription>
            </DialogHeader>
            <DialogFooter>
            <Button className="cursor-pointer">Annuler</Button>
            <Button variant={'destructive'} className="cursor-pointer">Supprimer</Button>
        </DialogFooter>
        </DialogContent>
    </Dialog>
  )
}

export default DeleteModal
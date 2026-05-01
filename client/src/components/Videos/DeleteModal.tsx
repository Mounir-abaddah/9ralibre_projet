import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "../ui/button"
import { useTranslation } from "react-i18next";

interface typeModal{
  commentId:string;
  setCommentToDelete: React.Dispatch<React.SetStateAction<string | null>>;
  onConfirm: (id: string) => void;
}
const DeleteModal = ({ commentId, setCommentToDelete, onConfirm }: typeModal) => {
  const { t } = useTranslation();
  return (
    <Dialog open>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{t("videoComments.deleteTitle")}</DialogTitle>
                <DialogDescription>
                    {t("videoComments.deleteDescription")}
                </DialogDescription>
            </DialogHeader>
            <DialogFooter>
            <Button className="cursor-pointer" onClick={() => setCommentToDelete(null)}>{t("common.cancel")}</Button>
            <Button variant={'destructive'} className="cursor-pointer" onClick={() => {
                        onConfirm(commentId);
                        setCommentToDelete(null);
                    }}>{t("common.delete")}</Button>
        </DialogFooter>
        </DialogContent>
    </Dialog>
  )
}

export default DeleteModal
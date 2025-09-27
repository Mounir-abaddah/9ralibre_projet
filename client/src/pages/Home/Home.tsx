import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";

const Home = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const showVerification = localStorage.getItem("show-verification");
    if (showVerification === "true") {
      setOpen(true);
    }
  }, []);

  const handleClose = () => {
    setOpen(false);
    localStorage.setItem("show-verification", "false");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Home</h1>
      <Dialog open={open} onOpenChange={(value)=>{
        setOpen(value);
        if(!value){
          localStorage.setItem("show-verification","false")
        }
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Bienvenue 👋</DialogTitle>
            <DialogDescription>
              Merci de vous être inscrit sur{" "}
              <span className="font-semibold text-amber-500">
                9ral<span className="text-sky-500">ibre</span>
              </span>
              . Vérifiez votre boîte mail ou vos spams pour activer votre compte.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button onClick={handleClose} className="cursor-pointer">
              Ok
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Home;

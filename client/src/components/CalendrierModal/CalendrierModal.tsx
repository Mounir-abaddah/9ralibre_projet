import {useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { ChevronDownIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import axios from "axios";
import toast from "react-hot-toast";


interface CalendrierModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
const descriptionRegex = /^.{0,100}$/;

const CalendrierModal = ({ open, onOpenChange }: CalendrierModalProps) => {
  const apiUrl = import.meta.env.VITE_API_URL
  const [opene, setOpene] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  

  const [formData, setFormData] = useState({
    Date: "",
    type: "",
    titre: "",
    Description: ""
  });

  const [errors, setErrors] = useState({
    Date: "",
    type: "",
    titre: "",
    Description: ""
  });
  
  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({...prev, [field]: ""}));
  }

  const handleFocus = (field: string) => {
    setErrors((prev) => ({ ...prev, [field]: "" }));
  }

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    let Valid = true;
    const newErrors = {...errors};

    if(!formData.Date){
      newErrors.Date = "Date invalide !";
      Valid = false
    }
    if (!formData.titre.trim()) {
      newErrors.titre = "Le titre est requis !";
      Valid = false;
    }

    if(formData.Description && !descriptionRegex.test(formData.Description)){
      newErrors.Description = "descripiton invalid "
      Valid = false;
    }

     if (!formData.type) {
      newErrors.type = "Type d’événement requis !";
      Valid = false;
    }

    setErrors(newErrors)

    if (!Valid) {
    console.warn("Formulaire invalide !");
    return;
  }
    try{      
        const res = await axios.post(`${apiUrl}/user/postEvents`,formData,{withCredentials:true})
        if(res.data.success){
          toast.success(res.data.message);
          window.location.reload()
        }
    }catch(err){
      if (axios.isAxiosError(err) && err.response) {
        toast.error(err.response.data.message);
      }
    }
    onOpenChange(false);
  };


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>📅 Ajouter un événement</DialogTitle>
            <DialogDescription>
              Remplissez les informations ci-dessous pour enregistrer un nouvel événement.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            
            {/* Champ Date */}
            <div className="grid gap-2">
              <Label htmlFor="event-date" className="px-1 text-sm font-medium">
                Date de l’événement
              </Label>
              <Popover open={opene} onOpenChange={setOpene}>
                <PopoverTrigger asChild>
                  <Button id="event-date" variant="outline" className="w-full justify-between font-normal">
                    {date ? date.toLocaleDateString() : "Sélectionnez la date"}
                    <ChevronDownIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full overflow-hidden p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    captionLayout="dropdown"
                    onSelect={(d) => {
                      setDate(d);
                      handleChange("Date", d?.toISOString() || "");
                      setOpene(false);
                    }}
                    classNames={{
                      selected: `bg-amber-500 border-amber-500 text-white rounded-md hover:bg-amber-500`, 
                    }}
                    fromYear={2025}
                    toYear={2040}
                  />
                </PopoverContent>
              </Popover>
              <input type="hidden" id="event-date" name="date" value={formData.Date} />
            </div>

            {/* Champ Type */}
            <div className="w-full flex flex-col gap-1">
              <Label htmlFor="event-type" className="text-sm font-medium">
                Type d’événement
              </Label>
              <Select name="type" onValueChange={(val) => handleChange("type", val)}>
                <SelectTrigger id="event-type" className="w-full">
                  <SelectValue placeholder="Sélectionnez le type d’événement" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Sélectionner le type d'événement</SelectLabel>
                    <SelectItem value="Examen">Examen</SelectItem>
                    <SelectItem value="Rappel">Rappel</SelectItem>
                    <SelectItem value="Devoir">Devoir</SelectItem>
                    <SelectItem value="Autre" className="flex flex-col">
                      <span>Autre</span>
                      <span className="text-xs text-slate-400">
                        Exemple:Devoir+Examen+Rappel,Examen+Devoir...
                      </span>
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            {/* Champ Titre */}
            <div className="grid gap-1">
              <Label htmlFor="event-title" className="text-sm font-medium">
                Titre de l’événement
              </Label>
              <Input
                id="event-title"
                type="text"
                placeholder="Ex: Réunion, Mathématiques..."
                value={formData.titre}
                onChange={(e) => handleChange("titre", e.target.value)}
                onFocus={() => handleFocus("titre")}
              />
            </div>

            {/* Champ Description */}
            <div className="grid gap-2">
              <Label htmlFor="event-description" className="text-sm font-medium">
                Description (optionnelle)
              </Label>
              <Textarea
                id="event-description"
                name="description"
                placeholder="Ex: Notes importantes, détails de l'événement..."
                rows={4}
                value={formData.Description}
                onChange={(e) => handleChange("Description", e.target.value)}
                onFocus={() => handleFocus("Description")}
              />
            </div>
          </div>

          <DialogFooter className="flex justify-end space-x-2 pt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline" className="cursor-pointer">
                Annuler
              </Button>
            </DialogClose>
            <Button type="submit" variant="default" className="cursor-pointer bg-cyan-600 hover:bg-cyan-700">
              Enregistrer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CalendrierModal;
import { useRef, useState , useEffect} from "react";
import { Label } from "@/components/ui/label";
import { ChevronDown } from "lucide-react";


interface Props {
  value: string;
  error: string;
  onChange: (val: string) => void;
}

const RoleSelect = ({value,error,onChange}:Props) => {
    const [show,setShow] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
      const handleClick = (e: MouseEvent) => {
        if (ref.current && !ref.current.contains(e.target as Node)) setShow(false);
      };
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    },[]);
    const options = [
      { name: "Etudiant", icon: "👨‍🎓​" },
      { name: "Etudiante", icon: "​👩‍🎓​" },
    ];

  return (
    <div ref={ref} className="flex gap-1 flex-col">
      <Label id="status">Votre statut</Label>
      <div
        onClick={() => setShow(!show)}
        className={`relative w-full border rounded-md p-3 flex items-center justify-between cursor-pointer transition ${
          error ? "border-red-400 bg-red-100" : "border-gray-300"
        }`}
      >
        <h3 className={`text-sm ${!value && "text-slate-400 font-normal"}`}>
          {value || "Sélectionnez votre statut"}
        </h3>
        <ChevronDown
          size={16}
          className={`transition-transform ${show ? "rotate-180" : "rotate-0"}`}
        />
      </div>

      {error && !show && (
        <p className="text-sm text-red-400 font-semibold">{error}</p>
      )}

      {show && (
        <div className="border border-gray-200 rounded-md mt-1 shadow-sm bg-white relative z-50">
          {options.map((item, index) => (
            <div
              key={index}
              onClick={() => {
                onChange(item.name);
                setShow(false);
              }}
              className="p-2 px-3 hover:bg-amber-100 cursor-pointer flex items-center gap-2 text-sm"
            >
              <span>{item.icon}</span>
              <span>{item.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default RoleSelect
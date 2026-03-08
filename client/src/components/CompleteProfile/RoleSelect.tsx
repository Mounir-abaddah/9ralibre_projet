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
    <div ref={ref} className="flex flex-col gap-1">
      <Label id="status">Votre statut</Label>
      <div
        onClick={() => setShow(!show)}
        className={`relative flex w-full cursor-pointer items-center justify-between rounded-md border p-3 transition ${
          error ? "border-red-400 bg-red-100" : "border-gray-300"
        }`}
      >
        <h3 className={`text-sm ${!value && "font-normal text-slate-400"}`}>
          {value || "Sélectionnez votre statut"}
        </h3>
        <ChevronDown
          size={16}
          className={`transition-transform ${show ? "rotate-180" : "rotate-0"}`}
        />
      </div>

      {error && !show && (
        <p className="text-sm font-semibold text-red-400">{error}</p>
      )}

      {show && (
        <div className="relative z-50 mt-1 rounded-md border border-gray-200 bg-white shadow-sm">
          {options.map((item, index) => (
            <div
              key={index}
              onClick={() => {
                onChange(item.name);
                setShow(false);
              }}
              className="flex cursor-pointer items-center gap-2 rounded-md p-2 px-3 text-sm hover:bg-amber-100 dark:text-black"
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
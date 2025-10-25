import type { CalendrierInfo } from "../Layouts/components/right-sidebar/SidebarRight"
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog"

interface typeModalDetailDay {
  openModalCalendrierDetail: boolean
  setopenModalCalendrierDetail: (open: boolean) => void
  SelectedInfo: CalendrierInfo[]
}

const CalendrierDetailsDay = ({
  openModalCalendrierDetail,
  setopenModalCalendrierDetail,
  SelectedInfo,
}: typeModalDetailDay) => {  
  return (
    <Dialog
      open={openModalCalendrierDetail}
      onOpenChange={setopenModalCalendrierDetail}
    >
      <DialogContent className="max-w-lg rounded-2xl bg-white/80 backdrop-blur-md shadow-2xl border border-gray-200">
        <DialogHeader className="space-y-2 text-center">
          <DialogTitle className="text-2xl font-bold text-gray-800">
            Détails de la journée
          </DialogTitle>
          <DialogDescription className="text-gray-500 text-sm">
            Voici les événements enregistrés pour cette journée.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 space-y-4 max-h-[400px] overflow-y-auto">
          {SelectedInfo.map((event)=>
            event.items.map((item,j)=>(
              <div
                key={j}
                className="p-4 rounded-xl border border-gray-200 bg-gradient-to-br from-blue-50 to-indigo-50 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-lg text-gray-800 truncate">
                    {item.titre|| "Événement sans titre"}
                  </h4>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      item.type === "Rappel"
                        ? "bg-green-100 text-green-700"
                        : item.type === "Examen"
                        ? "bg-red-300 text-red-800"
                        : item.type === "Devoir"
                        ? "bg-amber-300 text-amber-800"
                        : "bg-pink-300 text-pink-800"
                    }`}
                  >
                    {item.type || "Autre"}
                  </span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Description: {item.Description || "Aucune description disponible."}
                </p>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CalendrierDetailsDay

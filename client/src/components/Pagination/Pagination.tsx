import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button"

interface typePaginationPorps{
    totalItems:number,
    itemsPerPage:number,
    currentPage:number,
    onPageChange:(page:number)=>void
}
const Pagination = ({totalItems,itemsPerPage,currentPage,onPageChange}:typePaginationPorps) => {
    const totalPage = Math.ceil(totalItems/itemsPerPage);
    if (totalPage<=1) return null;
    return (
    <div className="flex w-full items-center justify-between rounded-md bg-slate-50 p-2">
        <div>
            <Button variant={'outline'} onClick={()=>onPageChange(currentPage - 1)} disabled={currentPage === 1} className="cursor-pointer"><ChevronLeft />Précédent</Button>
        </div>
        <div className="flex items-center gap-2">
        {[...Array(totalPage)].map((_, i) => (
        <Button
          key={i}
          variant={'outline'}
          onClick={() => onPageChange(i + 1)}
          className={`cursor-pointer rounded-md   ${
            currentPage === i + 1 ? 'bg-amber-500 text-white hover:bg-amber-600 hover:text-white' : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          {i + 1}
        </Button>
      ))}
        </div>
        <div>
            <Button variant={'outline'} onClick={()=>onPageChange(currentPage + 1)} disabled={currentPage === totalPage} className="cursor-pointer">Suivant<ChevronRight /></Button>
        </div>
    </div>
  )
}

export default Pagination
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
    const pages=[];
    for(let i=1;i<=totalPage;i++){
        pages.push(i)
    }
    return (
    <div className="flex w-full items-center justify-between rounded-md bg-slate-50 p-2">
        <div>
            <Button variant={'outline'} onClick={()=>onPageChange(currentPage - 1)} disabled={currentPage === 1} className="cursor-pointer"><ChevronLeft />Précédent</Button>
        </div>
        <div className="flex items-center gap-2">
        {pages.map((page)=>(
            <Button variant={'outline'} key={page} onClick={()=>onPageChange(page)} className={`${currentPage === page ? 'bg-amber-400 text-white hover:bg-amber-400' : 'bg-none'} cursor-pointer`}>
                {page}
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
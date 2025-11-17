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
    <div className="flex w-full items-center justify-between rounded-md bg-white p-2 shadow-sm dark:bg-slate-800">
      <div>
        <Button
          variant={"outline"}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="cursor-pointer dark:border-slate-600 dark:text-white dark:hover:bg-slate-700"
        >
          <ChevronLeft className="mr-1" />
          Précédent
        </Button>
      </div>

      <div className="flex items-center gap-2">
        {[...Array(totalPage)].map((_, i) => {
          const pageNumber = i + 1;
          const active = currentPage === pageNumber;

          return (
            <Button
              key={i}
              variant={"outline"}
              onClick={() => onPageChange(pageNumber)}
              className={`cursor-pointer rounded-md transition ${
                active
                  ? "bg-amber-500 text-white hover:bg-amber-600 dark:bg-amber-500"
                  : "bg-gray-100 text-black hover:bg-gray-200 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
              }`}
            >
              {pageNumber}
            </Button>
          );
        })}
      </div>

  <div>
    <Button
      variant={"outline"}
      onClick={() => onPageChange(currentPage + 1)}
      disabled={currentPage === totalPage}
      className="cursor-pointer dark:border-slate-600 dark:text-white dark:hover:bg-slate-700"
    >
      Suivant
      <ChevronRight className="ml-1" />
    </Button>
  </div>
</div>
  )
}

export default Pagination
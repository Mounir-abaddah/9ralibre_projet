import type { PropsWithChildren } from "react"
import Navbar from "../Home/Navbar"

const Layouts = ({children}:PropsWithChildren) => {
  return (
    <div className="min-h-screen">
        <Navbar />
        <div className="flex flex-1 flex-col gap-4 p-4">
          {children}
        </div>
    </div>
  )
}

export default Layouts
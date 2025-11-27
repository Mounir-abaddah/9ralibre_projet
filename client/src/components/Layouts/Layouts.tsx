import type { PropsWithChildren } from "react"
import Navbar from "../Home/Navbar"

const Layouts = ({children}:PropsWithChildren) => {
  return (
    <div className="min-h-screen">
        <Navbar />
        <div className="p-3">
          {children}
        </div>
    </div>
  )
}

export default Layouts
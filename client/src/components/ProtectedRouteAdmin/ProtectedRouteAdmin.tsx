import { useProtectedRoutes } from "@/store/userStore"
import { useEffect } from "react"
import { Navigate, Outlet } from "react-router-dom"

const ProtectedRouteAdmin = () => {
    const { data, loading, fetchData } = useProtectedRoutes()

    useEffect(() => {
        fetchData()
    }, [fetchData])

    if (loading) return <p>Chargement...</p>

    if(data?.role !== "Admin"){
        return <Navigate to='/admin-connexion' replace />
    }

    return <Outlet />
}

export default ProtectedRouteAdmin
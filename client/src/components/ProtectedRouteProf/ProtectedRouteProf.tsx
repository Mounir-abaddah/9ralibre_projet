import { useProtectedRoutes } from "@/store/userStore"
import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRouteProf = () => {
  const { data, loading, fetchData } = useProtectedRoutes()

  useEffect(() => {
    fetchData()
  }, [fetchData])

  if (loading) return <p>Chargement...</p>

  if (data?.role !== "Professeur") {
    return <Navigate to="/prof-connexion" replace />
  }

  return <Outlet />
}

export default ProtectedRouteProf
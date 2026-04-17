import PagesNonTrouver from '@/pages/PagesNonTrouver/PagesNonTrouver'
import { useProtectedRoutes } from '@/store/userStore'
import { useEffect } from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const ProtectedRoute = () => {
  const { data, loading, fetchData } = useProtectedRoutes()

  useEffect(() => {
    fetchData()
  }, [fetchData])

  if (loading) return <p>Chargement...</p>

  if (!data) {
    return <Navigate to="/connexion" replace />
  }

  if(data.role === "Professeur"){
    return <PagesNonTrouver />
  }
  
  if(data.role === "Admin"){
    return <PagesNonTrouver />
  }

  if(!data.completeProfile){
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export default ProtectedRoute

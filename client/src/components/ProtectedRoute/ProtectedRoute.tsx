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

  return <Outlet />
}

export default ProtectedRoute

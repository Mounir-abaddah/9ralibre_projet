import { useProtectedRoutes } from '@/store/userStore'
import { Navigate, Outlet, useParams } from 'react-router-dom'

const ProtectedNiveauRoute = () => {
    const { niveaux } = useParams()
    const { data } = useProtectedRoutes()

    if (data?.niveaux !== niveaux) {
        return <Navigate to="*" replace />
    }

    return <Outlet />
}

export default ProtectedNiveauRoute
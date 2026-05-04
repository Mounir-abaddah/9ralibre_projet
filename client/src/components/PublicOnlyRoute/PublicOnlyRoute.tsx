import { useProtectedRoutes } from "@/store/userStore";
import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";

const PublicOnlyRoute = () => {
  const { data, loading, fetchData } = useProtectedRoutes();

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) return <p>Chargement...</p>;

  if (data?.role === "Etudiant" || data?.role === "Etudiante") {
    return <Navigate to={`/Dashboard/${data.niveaux}`} replace />;
  }

  if (data?.role === "Professeur") {
    return <Navigate to="/prof/dashboard" replace />;
  }

  if (data?.role === "Admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Outlet />;
};

export default PublicOnlyRoute;

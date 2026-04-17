import { useState, type FormEvent } from "react";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useProtectedRoutes } from "@/store/userStore";

const AdminConnexion = () => {
  document.title = "Connexion Admin | 9ralibre";
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const { fetchData } = useProtectedRoutes();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(
        `${apiUrl}/auth/admin/connexion`,
        form,
        { withCredentials: true },
      );
      if (response.data.success) {
        await fetchData();
        toast.success(response.data.message);
        navigate("/admin/dashboard");
      }
    } catch (err) {
      const axiosErr = err as AxiosError<{ message: string }>;
      setError(axiosErr.response?.data?.message || "Connexion admin impossible");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-100 p-4 dark:bg-zinc-900">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg dark:bg-zinc-800">
        <h1 className="mb-2 text-2xl font-semibold">Connexion Admin</h1>
        <p className="mb-5 text-sm text-zinc-500">Accès réservé à l’administration.</p>
        {error && <p className="mb-4 rounded-md bg-red-100 p-2 text-sm text-red-700">{error}</p>}
        <form className="space-y-3" onSubmit={handleSubmit}>
          <input
            className="w-full rounded-md border p-2"
            type="email"
            placeholder="Email admin"
            value={form.email}
            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            required
          />
          <input
            className="w-full rounded-md border p-2"
            type="password"
            placeholder="Mot de passe"
            value={form.password}
            onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-amber-500 p-2 font-semibold text-black disabled:opacity-60"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminConnexion;
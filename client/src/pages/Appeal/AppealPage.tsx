import { type FormEvent, useState } from "react";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const AppealPage = () => {
  document.title = "Demande de déblocage | 9ralibre";
  const apiUrl = import.meta.env.VITE_API_URL;
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [serverMessage, setServerMessage] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setServerMessage("");
    if (message.trim().length < 10) {
      setServerMessage("Le message doit contenir au moins 10 caractères.");
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post(`${apiUrl}/auth/appeal`, {
        email,
        message,
      });
      if (response.data.success) {
        toast.success(response.data.message);
        setMessage("");
      }
    } catch (err) {
      const axiosErr = err as AxiosError<{ message: string }>;
      setServerMessage(axiosErr.response?.data?.message || "Impossible d'envoyer la demande");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-100 p-4">
      <div className="w-full max-w-xl rounded-xl border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">Demande de déblocage</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Si votre compte est bloqué, envoyez votre demande ici.
        </p>
        {serverMessage && (
          <p className="mt-4 rounded-md border-l-2 border-red-500 bg-red-50 p-2 text-sm text-red-700">
            {serverMessage}
          </p>
        )}
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <input
            type="email"
            placeholder="Votre email"
            className="w-full rounded-md border p-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <textarea
            rows={5}
            placeholder="Expliquez pourquoi votre compte doit être débloqué..."
            className="w-full resize-none rounded-md border p-2"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-amber-500 p-2 font-semibold text-black disabled:opacity-60"
          >
            {loading ? "Envoi..." : "Envoyer la demande"}
          </button>
        </form>
        <Link to="/connexion" className="mt-4 inline-block text-sm text-sky-600 hover:underline">
          Retour à la connexion
        </Link>
      </div>
    </div>
  );
};

export default AppealPage;

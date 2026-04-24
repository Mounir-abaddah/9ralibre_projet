import { useEffect, useMemo, useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { format } from "date-fns"
import axios from "axios"
import toast from "react-hot-toast"
import { fr } from "react-day-picker/locale";

const Calendrier = () => {
  const apiUrl = import.meta.env.VITE_API_URL
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [type, setType] = useState("Examen")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null)
  const [editingItemId, setEditingItemId] = useState<string | null>(null)
  const [editType, setEditType] = useState("")
  const [editTitle, setEditTitle] = useState("")
  const [editDescription, setEditDescription] = useState("")
  const [events, setEvents] = useState<
    { _id: string; Date: string; items: { _id: string; type: string; titre: string; Description?: string }[] }[]
  >([])

  const fetchEvents = async () => {
    try {
      const res = await axios.get(`${apiUrl}/user/getEvenements`, {
        withCredentials: true,
      })
      setEvents(res.data?.events || [])
    } catch (error) {
      console.log(error)
      toast.error("Impossible de récupérer les événements")
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

    const handleAddEvent = () => {
        if (!date || !title.trim() || !type.trim()) {
            toast.error("Date, type et titre sont obligatoires"); return;
        }
        setLoading(true)
        axios.post( `${apiUrl}/user/postEvents`, {Date: date.toISOString(),items: [{
                type: type.trim(),
                titre: title.trim(),
                Description: description.trim() || undefined,
            },],
        },{ withCredentials: true },)
        .then(async () => {
            toast.success("Événement ajouté")
            setTitle("")
            setDescription("")
            await fetchEvents()
        })
        .catch((error) => {
            console.log(error)
            toast.error("Échec de l'ajout de l'événement")
        })
        .finally(() => setLoading(false))
    }

    const selectedDateKey = date ? format(date, "yyyy-MM-dd") : ""
    const selectedDateItems = useMemo(() => {
        return events
          .filter((event) => format(new Date(event.Date), "yyyy-MM-dd") === selectedDateKey)
          .flatMap((event) => event.items)
    }, [events, selectedDateKey])

    const highlightedDates = useMemo(() => events.map((event) => new Date(event.Date)), [events])
    const totalItems = useMemo(() => events.reduce((sum, event) => sum + (event.items?.length || 0), 0),[events],)

    const handleDeleteItem = async (itemId: string) => {
      setActionLoadingId(itemId)
      try {
        await axios.delete(`${apiUrl}/user/events/items/${itemId}`, { withCredentials: true })
        toast.success("Événement supprimé")
        await fetchEvents()
      } catch (error) {
        console.log(error)
        toast.error("Impossible de supprimer l'événement")
      } finally {
        setActionLoadingId(null)
      }
    }

    const startEditItem = (item: { _id: string; type: string; titre: string; Description?: string }) => {
      setEditingItemId(item._id)
      setEditType(item.type)
      setEditTitle(item.titre)
      setEditDescription(item.Description || "")
    }

    const cancelEdit = () => {
      setEditingItemId(null)
      setEditType("")
      setEditTitle("")
      setEditDescription("")
    }

    const handleSaveEdit = async (itemId: string) => {
      if (!editType.trim() || !editTitle.trim()) {
        toast.error("Type et titre sont obligatoires")
        return
      }
      setActionLoadingId(itemId)
      try {
        await axios.patch(
          `${apiUrl}/user/events/items/${itemId}`,
          {
            type: editType.trim(),
            titre: editTitle.trim(),
            Description: editDescription.trim() || "",
          },
          { withCredentials: true },
        )
        toast.success("Événement modifié")
        cancelEdit()
        await fetchEvents()
      } catch (error) {
        console.log(error)
        toast.error("Impossible de modifier l'événement")
      } finally {
        setActionLoadingId(null)
      }
    }

return (
    <div className="min-h-[calc(100vh-4rem)] w-full">
        <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
            <section className="rounded-2xl border p-5  shadow-lg sm:p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold sm:text-3xl">Calendrier</h1>
                        <p className="mt-1 text-sm ">
                            Planifie tes examens, devoirs et rappels importants.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
                    <div className="rounded-lg bg-white/20 px-3 py-2">
                        <p className="opacity-90">Dates planifiées</p>
                        <p className="text-lg font-semibold">{events.length}</p>
                    </div>
                    <div className="rounded-lg bg-white/20 px-3 py-2">
                        <p className="opacity-90">Événements</p>
                        <p className="text-lg font-semibold">{totalItems}</p>
                    </div>
                </div>
            </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-5">
            <div className="rounded-2xl border p-4 shadow-sm xl:col-span-3">
                <div className="mb-3 flex items-center justify-between">
                <h2 className="text-base font-semibold text-slate-800 sm:text-lg dark:text-slate-100">Vue mensuelle</h2>
                <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800">
                    Dates marquées
                </span>
                </div>
            <div className="overflow-x-auto">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    modifiers={{ hasEvent: highlightedDates }}
                    locale={fr}
                    modifiersClassNames={{ hasEvent: "bg-amber-100 text-amber-900 font-semibold ring-1 ring-amber-300" }}
                    className="mx-auto w-full rounded-md"
                    classNames={{
                        day:`m-2 p-5`,
                        selected:`bg-amber-500`
                    }}
                />
            </div>
        </div>

            <div className="w-full rounded-2xl border p-4 shadow-sm xl:col-span-2">
                <h2 className="text-base font-semibold text-slate-800 sm:text-lg dark:text-slate-100">Ajouter un événement</h2>
                <p className="mt-1 text-sm text-slate-500">
                    Date sélectionnée :{" "}
                    <span className="font-semibold text-slate-700 dark:text-slate-200">{date ? format(date, "PPP", { locale: fr }) : "Aucune"}</span>
                </p>

                <div className="mt-4 w-full space-y-3">
                <Input
                    placeholder="Type (ex: Examen)"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                />

                <Input
                    placeholder="Titre de l'événement..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <Textarea
                    placeholder="Description (optionnelle)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="resize-none"
                />

                <Button onClick={handleAddEvent} disabled={loading} className="w-full cursor-pointer bg-amber-500 hover:bg-amber-600 ">
                    {loading ? "Ajout..." : "Ajouter"}
                </Button>
                </div>
            </div>
        </div>

        <section className="rounded-2xl border p-4 shadow-sm">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-base font-semibold text-slate-800 sm:text-lg dark:text-slate-200">Événements du jour</h2>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                {date ? format(date, "dd/MM/yyyy") : "Aucune date"}
                </span>
            </div>

            {selectedDateItems.length === 0 && (
                <div className="rounded-xl border border-dashed  px-4 py-8 text-center dark:border-slate-200">
                <p className="text-sm text-slate-500 dark:text-slate-200">Aucun événement pour cette date.</p>
                </div>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
                {selectedDateItems.map((item, index) => (
                <article key={index} className="w-full rounded-xl border p-3">
                    {editingItemId === item._id ? (
                    <div className="space-y-2">
                        <Input
                            value={editType}
                            onChange={(e) => setEditType(e.target.value)}
                            placeholder="Type"
                        />
                        <Input
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            placeholder="Titre"
                        />
                        <Textarea
                            rows={3}
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            placeholder="Description"
                            className="resize-none"
                        />
                        <div className="flex flex-wrap gap-2">
                            <Button
                                className="bg-emerald-600 hover:bg-emerald-700"
                                onClick={() => handleSaveEdit(item._id)}
                                disabled={actionLoadingId === item._id}
                            >
                                Enregistrer
                            </Button>
                            <Button variant="outline" onClick={cancelEdit} disabled={actionLoadingId === item._id}>
                                Annuler
                            </Button>
                        </div>
                    </div>
                    ) : (
                    <>
                        <p className="mb-1 text-xs font-semibold tracking-wide text-amber-700 uppercase">
                            {item.type}
                        </p>
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{item.titre}</p>
                            {item.Description ? (
                        <p className="mt-1 text-sm text-slate-500">{item.Description}</p>
                        ) : null}
                        <div className="mt-3 flex flex-wrap gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => startEditItem(item)}
                                disabled={actionLoadingId === item._id}
                            >
                                Modifier
                            </Button>
                            <Button
                                size="sm"
                                variant={'destructive'}
                                onClick={() => handleDeleteItem(item._id)}
                                disabled={actionLoadingId === item._id}
                            >
                                Supprimer
                            </Button>
                        </div>
                      </>
                    )}
                </article>
                ))}
            </div>
        </section>
      </div>
    </div>
  )
}

export default Calendrier
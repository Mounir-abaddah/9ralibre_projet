import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import axios from "axios";
import { useEffect, useState } from "react";
import { useProfProtectedRoutes } from "@/store/userStore";
import type { Matiere, TypeProfVideos } from "@/pages/auth/Video/types/video.type";
import toast from "react-hot-toast";

interface typeModal {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  matiere: Matiere[];
  onSuccess: () => void;
  videos: TypeProfVideos | null;
}

const AddVideosModal = ({ open, setOpen, matiere, onSuccess,videos }: typeModal) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { data, fetchData } = useProfProtectedRoutes();
 
  const [niveauId, setNiveauId] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    videoUrl: "",
    thumbnail: "",
    matiere: "",
    filiere: "",
    visibility: "Public",
  });

  useEffect(() => {
  if (videos) {
    setForm({
      title: videos.title || "",
      description: videos.description || "",
      videoUrl: videos.videoUrl || "",
      thumbnail: videos.thumbnail || "",
      matiere: videos.matiere || "",
      filiere: videos.filiere || "",
      visibility: videos.visibility || "Public",
    });
  }
}, [videos]);

  const niveauxLabel = data?.niveaux ?? "";

  // ✅ FETCH NIVEAU ID
  useEffect(() => {
    const getNiveau = async () => {
      const res = await axios.get(`${apiUrl}/prof/fetch-niveaux`, {
        withCredentials: true,
      });
      setNiveauId(res.data._id);
    };

    getNiveau();
    fetchData();
  }, []);

  // Filière dynamique
  const showFiliere =
    niveauxLabel === "TC" ||
    niveauxLabel === "1BAC" ||
    niveauxLabel === "2BAC";

  const filiereByNiveau: Record<string, string[]> = {
    "1BAC": [
      "Sciences Mathématiques",
      "Sciences Expérimentales",
      "Sciences Éco",
    ],
    "2BAC": [
      "Sciences Mathématiques A",
      "Sciences Mathématiques B",
      "SVT",
      "PC",
    ],
  };

  // RESET
  useEffect(() => {
    if (!open) {
      setForm({
        title: "",
        description: "",
        videoUrl: "",
        thumbnail: "",
        matiere: "",
        filiere: "",
        visibility: "Public",
      });
    }
  }, [open]);

  // SUBMIT
const handleSubmit = async () => {
  try {
    if (videos) {
      // ✏️ UPDATE
      await axios.put(
        `${apiUrl}/prof/update-videos/${videos._id}`,
        {
          ...form,
          niveaux: niveauId,
        },
        { withCredentials: true }
      );
      toast.success("Videos modifié avec succès ✏️");
    } else {
      // ➕ ADD
      await axios.post(
        `${apiUrl}/prof/add-videos`,
        {
          ...form,
          niveaux: niveauId,
        },
        { withCredentials: true }
      );
      toast.success("Videos ajouter avec succès ✏️");
    }

    setOpen(false);
    onSuccess();
  } catch (err) {
    console.error(err);
    toast.error("Une erreur est survenue ❌");
  }
};

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-full max-w-2xl">
        <DialogHeader>
          <DialogTitle> {videos ? "Modifier la vidéo" : "Ajouter une vidéo"} </DialogTitle>
          <DialogDescription>
            Remplissez les informations
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {/* Niveau + Matière */}
          <div className="flex gap-2">
            <div className="w-full space-y-2">
              <Label>Niveau</Label>
              <Input value={niveauxLabel || "Non renseigné"} disabled />
            </div>

            <div className="w-full space-y-2">
              <Label>Matière</Label>
              <Select
                value={form.matiere}
                onValueChange={(value) =>
                  setForm({ ...form, matiere: value })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choisir une matière" />
                </SelectTrigger>
                <SelectContent>
                  {matiere.map((mat) => (
                    <SelectItem key={mat._id} value={mat._id}>
                      {mat.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Titre */}
          <div className="space-y-2">
            <Label>Titre</Label>
            <Input
              value={form.title}
              onChange={(e) =>
                setForm({ ...form, title: e.target.value })
              }
              placeholder="Titre de la vidéo"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Description"
            />
          </div>

          {/* URL + Thumbnail */}
          <div className="flex gap-2">
            <div className="w-full space-y-2">
              <Label>Video URL</Label>
              <Input
                value={form.videoUrl}
                type="url"
                onChange={(e) =>
                  setForm({ ...form, videoUrl: e.target.value })
                }
                placeholder="https://youtube.com/..."
              />
            </div>
            <div className="w-full space-y-2">
              <Label>Thumbnail</Label>
              <Input
                value={form.thumbnail}
                type="url"
                onChange={(e) =>
                  setForm({ ...form, thumbnail: e.target.value })
                }
                placeholder="Image URL"
              />
            </div>
          </div>
          <div className="flex w-full items-center justify-between gap-2">
            {/* Filière */}
            {showFiliere && (
              <div className="w-full space-y-2">
                <Label>Filière</Label>
                <Select
                  value={form.filiere}
                  onValueChange={(value) =>
                    setForm({ ...form, filiere: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choisir filière" />
                  </SelectTrigger>
                  <SelectContent>
                    {(filiereByNiveau[niveauxLabel] ?? []).map((f) => (
                      <SelectItem key={f} value={f}>
                        {f}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            {/* Visibilité */}
            <div className="w-full space-y-2">
              <Label>Visibilité</Label>
              <Select
                value={form.visibility}
                onValueChange={(value) =>
                  setForm({ ...form, visibility: value })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Visibilité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Public">Public</SelectItem>
                  <SelectItem value="Private">Privé</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {/* Buttons */}
          <div className="flex justify-end gap-2 ">
            <Button variant="outline" onClick={() => setOpen(false)} className="cursor-pointer">
              Annuler
            </Button>

            <Button
              onClick={handleSubmit}
              className="cursor-pointer bg-amber-500 hover:bg-amber-600"
            >
              {videos ? "Modifier" : "Ajouter"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddVideosModal;
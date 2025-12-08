import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
Card,
CardContent,
} from "@/components/ui/card";
import axios from "axios";
import { Eye, Heart, MessageSquare, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

interface ProfType {
_id: string;
nom: string;
prenom: string;
role?:string;
image?: string;
}

interface MatiereType {
_id: string;
nom: string;
}

interface NiveauxType {
_id: string;
nom: string;
}

export interface Commentaire{
    _id:string
    user:ProfType;
    text:string;
    createdAt:string;
}

export interface VideoType {
_id: string;
title: string;
description: string;
videoUrl: string;
thumbnail?: string;
matiere: MatiereType;
niveaux: NiveauxType;
filière: string;
professeur: ProfType;
likes: string[];
comments:Commentaire[],
views: number;
createdAt: string;
updatedAt: string;
}

const Video = () => {
const apiUrl = import.meta.env.VITE_API_URL;
document.title = "Videos | 9ralibre";
const navigate = useNavigate()
const { niveaux } = useParams();
const [videos, setVideos] = useState<VideoType[]>([]);
useEffect(() => {
    const getVideos = async () => {
    const res = await axios.get(`${apiUrl}/videos/get-videos/${niveaux}`, {
        withCredentials: true,
    });
    setVideos(res.data.videos);
    console.log(res.data.videos);
    };
    getVideos();
}, [apiUrl, niveaux]);
return (
    <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2 xl:grid-cols-3">
    {videos.map((item) => (
        <Card key={item._id} className="rounded-2xl p-2">
        <div className="group relative cursor-pointer" onClick={()=>navigate(item._id)}>
            <img
            src={item.thumbnail}
            alt="thumbail"
            loading="lazy"
            className="h-46 w-full rounded-md object-center"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition duration-300 ease-in group-hover:opacity-100">
                <Play size={60} color="#fff"/>
            </div>
        </div>
        <CardContent className="space-y-3 p-4">
            <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-gray-200 px-3 py-1 text-xs dark:text-black">
                {item.matiere.nom}
            </span>
            <span className="rounded-full bg-purple-200 px-3 py-1 text-xs text-purple-800">
                {item.niveaux.nom}
            </span>
            <span className="rounded-full bg-gray-200 px-3 py-1 text-xs dark:text-black">
                {item.filière}
            </span>
            </div>
            <h2 className="text-lg font-semibold">{item.title}</h2>
            <p className="line-clamp-2 text-sm text-gray-600">
                {item.description}
            </p>
            <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold">
                <Avatar>
                    <AvatarImage src={item.professeur.image} alt="professeur" />
                    <AvatarFallback>{item.professeur.nom[0]}</AvatarFallback>
                </Avatar>
                </div>
                <span className="border-b-sky-600 text-sm text-gray-700 hover:border-b-2 hover:text-sky-600">
                    <Link to={`/professeur/${item.professeur.nom} ${item.professeur.prenom}`}>{item.professeur.nom} {item.professeur.prenom}</Link>
                </span>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1"><Eye size={14}/> {item.views}</span>
                <span className="flex items-center gap-1"><Heart size={14}/> {item.likes.length}</span>
                <span className="flex items-center gap-1"><MessageSquare size={14}/> {item.comments.length}</span>
            </div>
            </div>
        </CardContent>
        </Card>
    ))}
    </div>
);
};

export default Video;

import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { UserProfile } from "./types/Profiletypes";
import { Button } from "@/components/ui/button";
import { useProtectedRoutes } from "@/store/userStore";

const Profile = () => {
const apiUrl = import.meta.env.VITE_API_URL;
const { name } = useParams();
const navigate = useNavigate();
const {data} = useProtectedRoutes();
const [profile, setProfile] = useState<UserProfile | null>(null);

useEffect(() => {
    const getProfile = async () => {
    const res = await axios.get(`${apiUrl}/user/profile/${name}`, { withCredentials: true });
    setProfile(res.data.user);
    };
    getProfile();
}, [apiUrl, name]);

const handlePost = async()=>{
    const res = await axios.post(`${apiUrl}/chat/start-conversation`,{user:profile?._id,userId:data?._id},{withCredentials:true})
    navigate(`/Chat/start/${res.data._id}`)
}

if (!profile) return <div>Chargement...</div>;

return (
    <div className="min-h-screen bg-zinc-950 text-white">
    {/* Banner */}
    <div className="h-40 bg-amber-500" />
    {/* Content */}
    <div className="mx-auto -mt-16 max-w-2xl px-6">
        {/* Avatar */}
        <img
        src={`${apiUrl}/uploads/images/${profile._id}/${profile.image}`}
        alt={profile.nom}
        className="h-28 w-28 rounded-2xl border-4 border-zinc-950 object-cover"
        />

        {/* Name */}
        <h1 className="mt-3 text-2xl font-bold">{profile.prenom} {profile.nom}</h1>
        <p className="text-sm text-zinc-400">{profile.email}</p>

        {/* Badges */}
        <div className="mt-3 flex gap-2">
        <span className="rounded-full bg-amber-500 px-3 py-1 text-xs font-bold text-black">{profile.role}</span>
        <span className="rounded-full bg-cyan-500 px-3 py-1 text-xs font-bold text-black">{profile.niveaux}</span>
        </div>
        <div className="flex items-center justify-between">
            {/* Stats */}
            <div className="mt-6 flex gap-8 border-t border-zinc-800 pt-6">
            <div className="text-center">
                <p className="text-xl font-bold text-amber-500">{profile.followers?.length}</p>
                <p className="text-xs text-zinc-400">Abonnés</p>
            </div>
            <div className="text-center">
                <p className="text-xl font-bold text-amber-500">{profile.following?.length}</p>
                <p className="text-xs text-zinc-400">Abonnements</p>
            </div>
            <div className="text-center">
                <p className="text-xl font-bold text-amber-500">{profile.savedCours?.length}</p>
                <p className="text-xs text-zinc-400">Cours</p>
            </div>
            </div>
            <div>
                <Button variant={'outline'} className="cursor-pointer" onClick={handlePost}>Envoyer un message</Button>
            </div>
            </div>
        </div>
    </div>
);
};

export default Profile;
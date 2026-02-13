import { Button } from "@/components/ui/button"
import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom";

interface ProfileType{
    _id:string
}
const Profile = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const {name} = useParams();
    const navigate = useNavigate();
    const [profile,setProfile] = useState<ProfileType | null >(null);

    useEffect(()=>{
        const getProfile = async()=>{
            const res = await axios.get(`${apiUrl}/user/getUser/${name}`,{withCredentials:true})
            console.log(res.data);
            setProfile(res.data)
        }
        getProfile();
    },[apiUrl, name]);

    const handleMessage = async()=>{
        const res = await axios.post(`${apiUrl}/messagerie/conversation`,{
            receiverId : profile?._id
        },{withCredentials:true})
        navigate(`/Chat/${res.data._id}`);
    }

    if(!profile) return <div>No Profile </div>
  return (
    <div>
        <Button className="cursor-pointer" onClick={handleMessage}>Envoyer un Message</Button>
    </div>
  )
}

export default Profile
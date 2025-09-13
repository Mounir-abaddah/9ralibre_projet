import logo from '@/assets/images/inscription/Exams-rafiki.png';
import { LogIn , ChevronDown} from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Googles from '@/components/Oauth/Google';
import Microsofts from '@/components/Oauth/Microsoft';
import axios from 'axios';
import toast from 'react-hot-toast';
import Loadering from '@/components/Loadering/Loadering';
import Input from '@/components/Form/Input';


const Inscription = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();
    const [Loading,setLoading] = useState<boolean>(false);
    const [showOption,setshowOption] = useState<boolean>(false);

    const handleShow = ()=>{
        setshowOption(!showOption)
    }
    const option = [
        {
            name:'Etudiant',
            icon:'👦'
        },
        {
            name:"Etudiante",
            icon:'👩🏽‍'
        }
    ]
    
    const [nom,setNom] = useState<string>("");
    const [ErrNom,setErrNom] = useState<string>("");

    const [prenom,setPrenom] = useState<string>("");
    const [ErrPrenom,setErrPrenom] = useState<string>("");

    const [email,setEmail] = useState<string>("");
    const [ErrEmail,setErrEmail] = useState<string>("");

    const [type,settype] = useState<string>("");
    const [errType,seterrType] = useState<string>("")

    const [password,setPassword] = useState<string>("");
    const [ErrPassword,setErrPassword] = useState<string>("");

    const [ComfirmPassword,setComfirmPassword] = useState<string>("");
    const [ErrComfirmPassword,setErrComfirmPassword] = useState<string>("");


   const tt = async (e: FormEvent) => {
    e.preventDefault();
    let Valid = true;
    const regexNames = /^[A-Za-z ]+$/;
    const regexEmail = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
    setLoading(true);

    if (!nom.trim() || !regexNames.test(nom)) {
        setErrNom("Nom invalide");
        Valid = false;
    } else {
        setErrNom("");
    }

    if (!prenom.trim() || !regexNames.test(prenom)) {
        setErrPrenom("Prénom invalide");
        Valid = false;
    } else {
        setErrPrenom("");
    }

    if (!email.trim() || !regexEmail.test(email)) {
        setErrEmail("Email invalide");
        Valid = false;
    } else {
        setErrEmail("");
    }

    if (!type) {
        seterrType("Veuillez sélectionner votre statut");
        Valid = false;
    } else {
        seterrType("");
    }

    if (!passwordRegex.test(password)) {
        setErrPassword("Minimum huit caractères, une majuscule, une minuscule, un chiffre et un caractère spécial");
        Valid = false;
    } else {
        setErrPassword("");
    }

    if (password !== ComfirmPassword || !ComfirmPassword) {
        setErrComfirmPassword("Les mots de passe ne correspondent pas");
        Valid = false;
    } else {
        setErrComfirmPassword("");
    }

    if (!Valid) {
        setLoading(false);
        return;
    }

    try {
        const response = await axios.post(`${apiUrl}/auth/register`, {
            nom,
            prenom,
            type,
            email,
            password
        });
        if (response.data.success) {
            navigate('/connexion');
            toast.success('Vous êtes bien inscrit', { icon: '🎉' });
        }
    } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
            toast.error(err.response.data.message);
        }
    }
    setLoading(false);
}

const isDisabled =
  !nom.trim() ||
  !prenom.trim() ||
  !email.trim() ||
  !type.trim() ||
  !password.trim() ||
  !ComfirmPassword.trim() ||
  !!ErrNom ||
  !!ErrPrenom ||
  !!ErrEmail ||
  !!ErrPassword ||
  !!ErrComfirmPassword ||
  !!errType;

  return (
    <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
        <div className='flex items-center gap-2 justify-around w-full lg:h-screen md:h-screen h-auto p-4'>
            <div className='w-full lg:block hidden'>
                <img src={logo} alt="logo_inscription" width={700} height={700}/>
            </div>
            <div className='flex items-start gap-3 flex-col w-full shadow-xl p-5 rounded-md bg-amber-50'>
                <div className='w-full'>
                    <h2 className='text-3xl font-medium'>Commençons <br />à apprendre avec <span className='text-amber-400 font-semibold'>9ralibre</span></h2>
                    <p className='text-sm'>Veuillez vous inscrire ou vous connecter pour continuer</p>
                </div>
                <div className='flex items-center gap-3 w-full'>
                    <div className='flex items-start flex-col gap-1 w-full'>
                        <Input 
                            label='Nom' 
                            id='Nom' 
                            type='text' 
                            placeholder='Votre Nom' 
                            onFocus={()=>setErrNom("")} 
                            value={nom} 
                            onChange={setNom} 
                            error={ErrNom} 
                        />
                    </div>
                    <div className='flex items-start flex-col gap-1 w-full'>
                        <Input 
                            label='Prenom' 
                            id='prenom' 
                            type='text' 
                            placeholder='Votre Prenom' 
                            onFocus={()=>setErrPrenom("")} 
                            value={prenom} 
                            onChange={setPrenom} 
                            error={ErrPrenom} 
                        />
                    </div>
                </div>
                <div className='flex items-start flex-col gap-1 w-full relative'>
                        <h3 className='font-semibold'>Votre status</h3>
                            <div onClick={handleShow}  className={`relative w-full border rounded-md  ${errType && 'border-red-400'} p-2 flex items-center justify-between cursor-pointer`}>
                                <h3>{type || 'Selectionnez votre status'}</h3>
                                <ChevronDown size={15}/>
                        </div>
                        {showOption &&
                            <div className='absolute top-17 left-0 z-10 w-full bg-white border-2 rounded-md shadow-lg'>
                                {option.map((item,index)=>(
                                    <div key={index}>
                                    <div id='status' 
                                        onClick={()=>{
                                        settype(item.name);
                                        setshowOption(false)}} className="p-2 hover:bg-amber-100 cursor-pointer transition">
                                        <span>{item.icon}{item.name}</span>
                                    </div>
                                    {option.length -1 && (
                                        <div className="border-t border-gray-200"></div>
                                    )}
                                    </div>
                                ))}
                            </div>
                        }
                        {errType && <p className='text-red-400 text-sm font-bold'>{errType}</p>}
                </div>
                <div className='flex items-start flex-col gap-1 w-full'>
                    <Input 
                        icon="mail" 
                        label='Email' 
                        id='monEmail' 
                        type='email' 
                        placeholder='Votre Email' 
                        onFocus={()=>setErrEmail("")} 
                        value={email} 
                        onChange={setEmail} 
                        error={ErrEmail} 
                    />
                </div>
                <div className='flex items-start flex-col gap-1 w-full'>
                    <Input
                        placeholder='Votre Mot de passe' 
                        label='Mot de passe' 
                        id='password' 
                        value={password}
                        type='password'
                        onChange={setPassword} 
                        onFocus={()=>setErrPassword("")}
                        icon='lock' 
                        error={ErrPassword}
                    />
                </div>
                <div className='flex items-start flex-col gap-1 w-full'>
                    <Input 
                        id="confirmPassword"
                        label="Confirmation du mot de passe"
                        type="password"
                        value={ComfirmPassword}
                        placeholder="Confirmez votre mot de passe"
                        error={ErrComfirmPassword}
                        icon="lock"
                        onFocus={()=>setErrComfirmPassword("")}
                        onChange={setComfirmPassword}
                    />
                </div>
                <button onClick={tt} disabled={Loading || isDisabled} className='disabled:bg-slate-50 disabled:shadow w-full flex items-center justify-center gap-2 bg-amber-300 rounded-md hover:bg-amber-400 cursor-pointer text-black dark:text-white p-3 font-semibold text-base hover:shadow-md transition-all duration-300'>
                    {Loading ? <Loadering  /> : '' }
                    <h2>Inscrivez-vous</h2>
                    <LogIn />
                </button>
                <div className='flex items-end justify-end w-full'>
                    <p>
                        Déjà un compte ? <Link to={'/connexion'} className='text-blue-200 border-b border-sky-200 hover:text-blue-400 transition-all duration-400'>Se connecter</Link>
                    </p>
                </div>
                <div className='flex items-center justify-around w-full gap-4'>
                    <hr className='w-full'/>
                    <h6 className='font-semibold'>OU</h6>
                    <hr className='w-full'/>
                </div>
                <div className='flex flex-wrap gap-4 items-center justify-around w-full'>
                    <Googles text={`S'inscrire avec Google`}/>
                    <Microsofts text={`S'inscrire avec Miscrosoft`}/>
                </div>
            </div>
            
        </div>

 </div>
  )
}

export default Inscription
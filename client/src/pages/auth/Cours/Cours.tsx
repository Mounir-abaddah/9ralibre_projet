import Matiere, { type Coursitems} from '@/components/Cours/Matiere';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem,DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useCoursFilter } from '@/store/useCoursFilter';
import axios from 'axios';
import { Bookmark, BookOpenText, Calendar, Download, EllipsisVertical, FileText, Globe2, Landmark, Printer, SquareArrowOutUpRight, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';

interface Matiere {
  _id: string;
  nom: string;
  niveaux: string;
}

interface Cours {
  _id: string;
  title: string;
  semestre: string;
  type: string;
  professeur:string;
  filière:string;
  pdfUrl: string;
  matiere: Matiere;
}

const Cours = () => {
    document.title = "Cours | 9ralibre"
    const {niveaux} = useParams();
    const {matiere,semestre,type,filiere,setMatiere,setSemestre,setType,setFiliere,resetAll}=useCoursFilter();
    const [cours,setCours] = useState<Cours[]>([]);
    const [search,setSearch]= useState("")
    const [searchParams,setSearchParams]=useSearchParams();

    const optionsCollege:Coursitems[] = [
    { name: "Mathématiques"},
    { name: "Physique et Chimie"},
    { name: "SVT"},
    { name: "Informatique"},
    { name: "Arabe"},
    { name: "Français"},
    { name: "Anglais"},
    { name: "Histoire Géographie"},
    { name: "Éducation Islamique"},
  ];

  useEffect(()=>{
    const apiUrl = import.meta.env.VITE_API_URL;
    const getAllCours = async()=>{
      try{
          const res = await axios.get(`${apiUrl}/cours/getCours/${niveaux}`,{withCredentials:true});
          if(res.data.success){
            setCours(res.data.cours)
          }
      }catch(err){
        console.log(err);
        setCours([]);
      }
    }
    getAllCours();
  },[niveaux]);

  const bgItems = {
        "Mathématiques":"bg-red-400",
        "Physique et Chimie":"bg-cyan-400",
        "SVT":"bg-teal-400",
        "Informatique":"bg-sky-400",
        "Arabe":"bg-orange-400",
        "Français":"bg-orange-400",
        "Anglais":"bg-orange-400",
        "Histoire Géographie":"bg-amber-400",
        "Éducation Islamique":"bg-blue-400",
  }

  useEffect(()=>{
    const params:Record<string,string> = {};
    if(matiere) params.matiere = matiere
    if(semestre) params.semestre = semestre
    if(type) params.type = type
    if(filiere) params.filiere = filiere
    if(search.trim() !== '') params.search = search.trim()
    setSearchParams(params)
  },[matiere,semestre,type,setSearchParams,search,filiere]);

  useEffect(()=>{
    const m = searchParams.get("matiere");
    const s = searchParams.get('semestre');
    const t = searchParams.get('type');
    const f = searchParams.get('filiere');
    const q = searchParams.get('search')
    setMatiere(m);
    setSemestre(s);
    setType(t);
    setFiliere(f)
    setSearch(q || '')
  },[searchParams, setMatiere, setSemestre, setType,setFiliere]);

  const filtredCours = cours.filter((c)=>{
    const filterMatiere = !matiere || c.matiere.nom === matiere;
    const filterSemestre = !semestre || c.semestre === semestre;
    const filterType = !type || c.type === type;
    const filterFiliere = !filiere || c.filière === filiere;
    const SearchCours = search.trim() === "" || 
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.matiere.nom.toLowerCase().includes(search.toLowerCase())||
    c.semestre.toLowerCase().includes(search.toLowerCase()) ||
    c.professeur.toLowerCase().includes(search.toLowerCase())
    return filterMatiere && filterSemestre && filterType && filterFiliere && SearchCours
  })

  const iconeType = {
    'Cours': <BookOpenText  />,
    'Exercice': <FileText  />,
    'Examen National': <Globe2  />,
    'Examen Régional': <Landmark />,
  }
  
  return (
    <>
    <div className='flex w-full gap-4'>
      <div className='flex w-full flex-col items-start justify-between gap-2'>
        <div className='flex w-full flex-col gap-2'>
          <Label htmlFor='mySearch' className='text-base'>Tous les cours :</Label>
          <Input id='mySearch' type='text' value={search} onChange={(e)=>setSearch(e.target.value)} placeholder='Rechercher un cours ou un professeur...' className='text-xs selection:bg-amber-500 focus-visible:ring-amber-500/50'/>
        </div>
          <Matiere
          niveaux={niveaux}
          items={optionsCollege}
          selectedMatiere={matiere}
          selectedSemestre={semestre}
          selectedType={type}
          selectedFiliere={filiere}
          onChangeMatiere={setMatiere}
          onChangeSemestre={setSemestre}
          onChangeType={setType}
          onChangeFiliere={setFiliere}
        />
      </div>
      {(matiere || semestre || type || filiere) && (
        <button onClick={resetAll} className="flex cursor-pointer items-center justify-end gap-1 text-sm text-gray-600 transition-colors hover:text-red-600">
          <XCircle size={16} />Réinitialiser tout
        </button>
      )}
    </div>
    <div className='grid w-full grid-cols-1 items-center justify-center gap-2 md:grid-cols-2 lg:grid-cols-3'>
      {filtredCours.length > 0 ? 
        filtredCours.map((item,index)=>(
        <Card key={index} className='group relative w-full shadow-md transition-all duration-500 hover:shadow-xl'>
          <div className={`absolute top-0 left-0 flex items-center gap-2 rounded-br-2xl ${bgItems[item.matiere.nom as keyof typeof bgItems]} px-3 py-1 text-xs font-medium text-white shadow-sm`}>
            <span className="flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
              <path d="M 12.8 15.6 A6 6 0 0 1 8 18" />
              <path d="M 14 14 L 12.8 15.6" />
              <path d="M 6 18 A4 4 0 0 0 2 22" />
              <path d="M 8 18 L 6 18" />
              <path d="M12 6h6" />
              <path d="M14 10h4" />
              <path d="M18 14h2a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H10a2 2 0 0 0-2 2" />
              <circle cx="7" cy="11" r="3" />
            </svg>
              Professeur : <Link to={`/Professeur/${encodeURIComponent(item.professeur)}`} className="text-xs font-semibold">{item.professeur.toUpperCase()}</Link>
            </span>
          </div>
          <CardHeader className='mt-2 flex items-center justify-between'>
            <CardTitle className='leading-4'>{item.title}</CardTitle>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <CardTitle className='cursor-pointer rounded-md p-2 transition-all duration-200 hover:bg-slate-200'>
                  <EllipsisVertical size={14}/>
                </CardTitle>
              </DropdownMenuTrigger>
              <DropdownMenuContent  align="center" className='fixed -right-2.5'>
                  <DropdownMenuGroup>
                    <DropdownMenuItem className='flex cursor-pointer items-center justify-between'>
                      Enregistrer
                      <Bookmark />
                    </DropdownMenuItem>
                    <DropdownMenuItem className='flex cursor-pointer items-center justify-between'>
                      Imprimer
                      <Printer />
                    </DropdownMenuItem>
                    <DropdownMenuItem className='flex cursor-pointer items-center justify-between'>
                      Telecharger
                      <Download />
                    </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
          </CardHeader>
          <CardContent className='flex items-center gap-2'>
            <div className={`rounded-full ${bgItems[item.matiere.nom as keyof typeof bgItems]} p-2 text-slate-200`}>
              {iconeType[item.type as keyof typeof iconeType]}
            </div>
            <div className='flex flex-col items-start'>
              <span className='text-sm font-bold'>{item.matiere.nom}</span>
              <span className='text-xs text-gray-600'>{item.type}</span>
              {item.filière && (
                <span className='text-xs font-medium text-blue-600'>📚 {item.filière}</span>
              )}
            </div>
          </CardContent>
          <Separator />
          <CardFooter className='flex w-full justify-between'>
                <div className='flex items-center gap-1'>
                  <Calendar size={14}/>
                  <span className='text-xs'>{item.semestre}</span>
                </div>
                <Link to={item.pdfUrl} target='_blank'>
                  <button className={`text-xs ${bgItems[item.matiere.nom as keyof typeof bgItems]} flex cursor-pointer items-center gap-2 rounded-md p-2 text-white transition-all hover:shadow-md`}>Voir le pdf<SquareArrowOutUpRight size={14}/></button>
                </Link>
          </CardFooter>
        </Card>
      ))
      :
        <p className="mt-6 flex w-full items-center justify-center text-sm text-gray-500">
          Aucun cours trouvé avec ces filtres.
        </p>
      }
    </div>
    </>
    
  )
}

export default Cours

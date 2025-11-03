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
    c.semestre.toLowerCase().includes(search.toLowerCase())
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
          <Label htmlFor='mySearch'>Tous les cours :</Label>
          <Input id='mySearch' type='text' value={search} onChange={(e)=>setSearch(e.target.value)} placeholder='Chercher votre cours ...' className='focus-visible:ring-amber-500/50'/>
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
        <button onClick={resetAll} className="flex w-3/6 cursor-pointer items-center gap-1 text-sm text-gray-600 transition-colors hover:text-red-600">
          <XCircle size={16} />Réinitialiser tout
        </button>
      )}
    </div>
    <div className='grid w-full grid-cols-1 items-center justify-center gap-2 md:grid-cols-2 lg:grid-cols-3'>
      {filtredCours.length > 0 ? 
        filtredCours.map((item,index)=>(
        <Card key={index} className='w-full shadow-md transition-all duration-500 hover:shadow-xl'>
          <CardHeader className='flex items-center justify-between'>
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
        <p className="mt-6 text-sm text-gray-500">
          Aucun cours trouvé avec ces filtres.
        </p>
      }
    </div>
    </>
    
  )
}

export default Cours

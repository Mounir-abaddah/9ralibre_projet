import Matiere, { type Coursitems} from '@/components/Cours/Matiere';
import Pagination from '@/components/Pagination/Pagination';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem,DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useDebounce } from '@/hooks/use-debounce';
import { useCoursFilter } from '@/store/useCoursFilter';
import axios from 'axios';
import { Bookmark, BookOpenText, Calendar, Download, EllipsisVertical, FileText, Globe2, Landmark, Loader2, Printer, SquareArrowOutUpRight, XCircle } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
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
  createdAt:string;
  professeur:string;
  filière:string;
  pdfUrl: string;
  matiere: Matiere;
}

const Cours = () => {
    document.title = "Cours | 9ralibre"
    const {niveaux} = useParams();
    const {matiere,semestre,type,filiere,setMatiere,setSemestre,setType,setFiliere,resetAll}=useCoursFilter();
    const [loading,setLoading]=useState(false);
    const [cours,setCours] = useState<Cours[]>([]);
    const [search,setSearch]= useState("");
    const debounceSearch = useDebounce(search , 500);
    const isInitialMount = useRef(true);
    const [searchParams,setSearchParams]=useSearchParams();
    const [totalCours,setTotalCours]=useState(0);
    const [currentPage,setCurrentPage]=useState(1);
    const itemsPerPage = 6;

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

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    setCurrentPage(1);
  }, [matiere, semestre, type, filiere, debounceSearch]);

  useEffect(()=>{
    const apiUrl = import.meta.env.VITE_API_URL;
    const params = new URLSearchParams();
    params.append('page', currentPage.toString());
    params.append('limit', itemsPerPage.toString());
    if (matiere) params.append('matiere', matiere);
    if (semestre) params.append('semestre', semestre);
    if (type) params.append('type', type);
    if (filiere) params.append('filiere', filiere);
    if (debounceSearch.trim() !== '') params.append('search', debounceSearch.trim());
  const getAllCours = async()=>{
      try{
        setLoading(true);
        const res = await axios.get(`${apiUrl}/cours/getCours/${niveaux}?${params.toString()}`,{withCredentials:true});
        if(res.data.success){
          setCours(res.data.cours)
          setTotalCours(res.data.totalCours)
        }
      }catch(err){
        console.log(err);
        setCours([]);
        setTotalCours(0);
      }finally{
        setLoading(false)
      }
    }
    getAllCours();
  },[currentPage, debounceSearch, filiere, matiere, niveaux, semestre, type]);

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
    if(debounceSearch.trim() !== '') params.search = debounceSearch.trim()
    if(currentPage > 1) params.page = currentPage.toString();
    setSearchParams(params)
  },[matiere, semestre, type, setSearchParams, search, filiere, currentPage, debounceSearch]);

  useEffect(()=>{
    const m = searchParams.get("matiere");
    const s = searchParams.get('semestre');
    const t = searchParams.get('type');
    const f = searchParams.get('filiere');
    const q = searchParams.get('search');
    const p = searchParams.get('page');
    setMatiere(m);
    setSemestre(s);
    setType(t);
    setFiliere(f);
    setSearch(q || '')
    setCurrentPage(p ?  parseInt(p) :  1)
  },[searchParams, setMatiere, setSemestre, setType,setFiliere]);

  const iconeType = {
    'Cours': <BookOpenText  />,
    'Exercice': <FileText  />,
    'Examen National': <Globe2  />,
    'Examen Régional': <Landmark />,
  }

  const handleResetAll = useCallback(()=>{
    resetAll();
    setSearch('')
    setCurrentPage(1)
  },[resetAll]);
  
  return (
    <>
    <div className='flex w-full gap-4'>
      <div className='flex w-full flex-col items-start justify-between gap-2'>
        <div className='flex w-full flex-col gap-2'>
          <Label htmlFor='mySearch' className='text-base'>Tous les cours :</Label>
          <Input id='mySearch' type='text' value={search} disabled={loading} onChange={(e)=>setSearch(e.target.value)} placeholder='Rechercher un cours ou un professeur...' className='text-xs selection:bg-amber-500 focus-visible:ring-amber-500/50'/>
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
      {(matiere || semestre || type || filiere || search) && (
        <button onClick={handleResetAll} disabled={loading} className="flex cursor-pointer items-center justify-end gap-1 text-sm text-gray-600 transition-colors hover:text-red-600">
          <XCircle size={16} />Réinitialiser tout
        </button>
      )}
    </div>
    {totalCours > itemsPerPage && (
      <div className="flex flex-col items-start justify-between">
        <p className="text-sm text-gray-600">
          {totalCours} cours trouvé{totalCours > 1 ? 's' : ''} 
          {(matiere || semestre || type || filiere) && ' (filtrés)'}
        </p>
        <Pagination 
          itemsPerPage={itemsPerPage} 
          currentPage={currentPage} 
          totalItems={totalCours} 
          onPageChange={(page)=>setCurrentPage(page)}
        />
      </div>
    )}

    {loading && (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
        <span className="ml-2 text-gray-600">Chargement des cours...</span>
      </div>
    )}

    {!loading && (
      <div className='grid w-full grid-cols-1 items-center justify-center gap-2 md:grid-cols-2 lg:grid-cols-3'>
        {cours.length > 0 ? 
          cours.map((item)=>(
          <Card key={item._id} className='group relative w-full shadow-md transition-all duration-500 hover:shadow-xl'>
            <div className={`absolute top-0 left-0 flex items-center gap-2 rounded-br-2xl ${bgItems[item.matiere.nom as keyof typeof bgItems]} px-3 py-1 text-xs font-medium text-white shadow-sm`}>
              <span className="flex items-center gap-1">
                <IconeProfesseur />
                Professeur : <Link to={`/Professeur/${encodeURIComponent(item.professeur)}`} className="text-xs font-semibold hover:underline">{item.professeur.toUpperCase()}</Link>
              </span>
            </div>
            <CardHeader className='mt-2 flex items-center justify-between'>
              <CardTitle className='leading-4'>{item.type}: {item.title}</CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger aria-label="Menu d'actions">
                  <CardTitle className='cursor-pointer rounded-md p-2 transition-all duration-200 hover:bg-slate-200'>
                    <EllipsisVertical size={14}/>
                  </CardTitle>
                </DropdownMenuTrigger>
                <DropdownMenuContent  align="center" className='fixed -right-2.5'>
                    <DropdownMenuGroup>
                      <DropdownMenuItem 
                        className='flex cursor-pointer items-center justify-between'
                      >
                        Enregistrer
                        <Bookmark />
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className='flex cursor-pointer items-center justify-between'
                      >
                        Imprimer
                        <Printer />
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className='flex cursor-pointer items-center justify-between'
                      >
                        Télécharger
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
                <span className='text-xs text-gray-600'>{item.semestre}</span>
                {item.filière && (
                  <span className='text-xs font-medium text-blue-600'>📚 {item.filière}</span>
                )}
              </div>
            </CardContent>
            <Separator />
            <CardFooter className='flex w-full justify-between'>
              <div className='flex items-center gap-1'>
                <Calendar size={14}/>
                <span className="text-xs">
                  {new Date(item.createdAt).toLocaleDateString("fr-FR", {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    timeZone: "Africa/Casablanca"
                  })}
                </span>         
              </div>
              <Link to={item.pdfUrl} target='_blank'>
                <button 
                  className={`text-xs ${bgItems[item.matiere.nom as keyof typeof bgItems]} flex cursor-pointer items-center gap-2 rounded-md p-2 text-white transition-all hover:shadow-md`}
                  aria-label={`Voir le PDF de ${item.title}`}
                >
                  Voir le pdf<SquareArrowOutUpRight size={14}/>
                </button>
              </Link>
            </CardFooter>
          </Card>
        ))
        :
          <div className="col-span-full mt-6 flex w-full flex-col items-center justify-center gap-2 text-center">
            <p className="text-sm text-gray-500">
              Aucun cours trouvé avec ces filtres.
            </p>
            {(matiere || semestre || type || filiere || search) && (
              <button 
                onClick={handleResetAll}
                className="text-xs text-amber-600 hover:underline"
              >
                Réinitialiser les filtres
              </button>
            )}
          </div>
        }
      </div>
    )}
    {!loading && totalCours > itemsPerPage && (
      <div className="mt-4 flex justify-center">
        <Pagination 
          itemsPerPage={itemsPerPage} 
          currentPage={currentPage} 
          totalItems={totalCours} 
          onPageChange={(page)=>setCurrentPage(page)}
        />
      </div>
    )}
    </>
    
  )
}

export default Cours


export const IconeProfesseur = ()=>{
  return (
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
  )
}
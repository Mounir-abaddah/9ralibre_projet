import Matiere, { type Coursitems} from '@/components/Cours/Matiere';
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label';
import { useState } from 'react';

const Cours = () => {
    document.title = "Cours | 9ralibre"
    const [selected,setSelected] = useState<string | null>(null)
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
  return (
    <>
    <div className='flex w-full gap-4'>
        <div className='flex w-full flex-col gap-2'>
          <Label id='mySerach'>Tous les cours :</Label>
          <Input id='mySearch' placeholder='Chercher votre cours ...' className='focus-visible:ring-amber-500 focus-visible:ring-amber-500/50'/>
        </div>
        <Matiere items={optionsCollege} onSelect={setSelected}/>
      </div>
      {selected && <span>{selected}</span>}
    </>
    
  )
}

export default Cours
import { Microsoft } from 'developer-icons'

type MicrosoftType = {
  text: string
}
const Microsofts = ({text}:MicrosoftType) => {
  return (
    <div className='flex items-center gap-2 border rounded-md p-2 hover:bg-slate-50 transition duration-300 font-medium cursor-pointer'>
            <Microsoft size={19}/>
            <p className='lg:block md:block hidden'>{text}</p>
    </div>
  )
}

export default Microsofts
import {Google} from 'developer-icons'

type googleType = {
  text : string
}
const Googles = ({text}:googleType) => {
  return (
    <div className='flex items-center gap-2 border rounded-md p-2 hover:bg-slate-50 transition duration-300 cursor-pointer'>
        <Google size={19}/>
        <p className='lg:block md:block hidden'>{text}</p>
    </div>
  )
}

export default Googles
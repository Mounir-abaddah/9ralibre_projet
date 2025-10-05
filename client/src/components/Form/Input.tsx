import { useState } from 'react'
import { Label } from '../ui/label'
import { Eye, EyeClosed, Lock, Mail } from 'lucide-react'

interface InputProps {
    id:string,
    label?: string,
    type?: "text" | "email" | "password",
    placeholder ?: string,
    value:string,
    onFocus:()=>void,
    onChange: (value : string) => void,
    icon?: "mail"| "lock",
    error?:string
}

const Input = ({id,label,type,placeholder,value,onFocus,onChange,error,icon}:InputProps) => {
    const [showPassword,setshowPassword] = useState(false)
    const renderIcon = ()=>{
        if(icon === "mail") return <Mail size={18} />
        if(icon === "lock") return <Lock size={18} />
        return null
    }
  return (
    <div className='w-full flex flex-col gap-1'>
        <Label htmlFor={id}>{label}</Label>
        <div className={`flex items-center gap-2 border p-2 rounded-md w-full ${error && 'border-red-400 bg-red-100'}`}>
            {renderIcon()}
            <input 
                id={id}
                type={type === "password" ? (showPassword ? "text" : "password") : type}
                value={value}
                placeholder={placeholder}
                onChange={(e)=>onChange(e.target.value)}
                onFocus={onFocus}
                className="outline-0 w-full font-bold placeholder:font-normal"
            />
            {type === "password" && (
                <div onClick={()=>setshowPassword(!showPassword)} className='cursor-pointer'>
                    {showPassword ? <Eye size={18} /> : <EyeClosed size={18} />}
                </div>
            )}
            </div>
            {error && <p className='text-sm text-red-400 font-semibold'>{error}</p>}
    </div>
  )
}

export default Input
import axios from 'axios'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate, useParams } from 'react-router-dom'

const VerificationEmail = () => {
  document.title = "Confirmation de votre compte | 9ralibre"
  const navigate = useNavigate()
  const { token } = useParams()
  const apiUrl = import.meta.env.VITE_API_URL
  const [loading, setLoading] = useState<boolean>(true)
  const [verified, setVerified] = useState<boolean>(false)
  const [countdown, setCountdown] = useState<number>(5)

  useEffect(() => {
    const handleValidationEmail = async () => {
      try {
        const response = await axios.get(`${apiUrl}/auth/confirm-email/${token}`)
        if (response.data.success) {
          setVerified(true)
        }
      } catch (error) {
        if (error && axios.isAxiosError(error)) {
          toast.error(error.response?.data?.message || "Lien invalide ou expiré")
        }
      } finally {
        setLoading(false)
      }
    }

    handleValidationEmail()
  }, [apiUrl, token])

  useEffect(()=>{
    if(verified){
      const interval = setInterval(()=>{
        setCountdown((prev)=>prev-1)
      },1000)

      const timeout = setTimeout(() => {
          navigate('/connexion')
      }, 5000);

    return ()=>{
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }
  },[verified,navigate])

  return (
    <div className="flex items-center justify-center min-h-screen">
      {loading ? (
        <p>⏳ Vérification en cours...</p>
      ) : verified ? (
        <p>
          ✅ Votre email a été vérifié avec succès !
          <br />
          ⏳ Redirection dans {countdown} seconde{countdown > 1 ? 's' : ''}...
        </p>
      ) : (
        <p>❌ Impossible de vérifier votre email.</p>
      )}
    </div>
  )
}

export default VerificationEmail

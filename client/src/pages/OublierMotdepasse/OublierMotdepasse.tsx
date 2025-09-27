import { useState, type FormEvent } from 'react';
import Input from '@/components/Form/Input';
import ralibre_logo from '@/assets/images/9ralibre.png';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Loadering from '@/components/Loadering/Loadering';

const OublierMotdepasse = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [errEmail, setErrEmail] = useState<string>('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const regexEmail = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    let valid = true;

    if (!email.trim() || !regexEmail.test(email)) {
      setErrEmail('Adresse e-mail invalide');
      valid = false;
    } else {
      setErrEmail('');
    }

    if (!valid) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${apiUrl}/auth/oublierMotdepasse`, { email });
      if (response.data.success) {
        setStep(2)
      }
    }catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setLoading(false)
      }
    }finally {
      setLoading(false);
      setStep(2);
    }
  };

  return (
    <div className="mx-auto max-w-xl">
      <header>
        <Link to={'/'}><img src={ralibre_logo} alt="9ralibre_logo" width={200} /></Link>
      </header>

      {step === 1 && (
        <div className="shadow bg-white rounded-lg">
          <div className="py-4 px-6 text-center rounded-t-lg bg-gray-100">
            <h2 className="flex items-center justify-center font-semibold text-xl mb-0 text-[#3F3F3F]">
              <span>Mot de passe oublié ?</span>
            </h2>
          </div>
          <div className="p-8">
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label htmlFor="monemail" className="block text-base mb-4">
                  Entrez simplement l’adresse e-mail avec laquelle vous vous êtes inscrit·e et nous vous enverrons un lien
                  pour réinitialiser votre mot de passe.
                </label>
                <Input
                  id="monemail"
                  onFocus={() => setErrEmail('')}
                  type="email"
                  icon='mail'
                  placeholder="Saisissez votre adresse e-mail"
                  value={email}
                  onChange={setEmail}
                  error={errEmail}
                />
              </div>
              <button
                disabled={loading} 
                type="submit"
                className={`flex items-center gap-2 p-2 rounded-md ${
                  loading ? 'bg-slate-200 cursor-not-allowed' : 'bg-amber-400 cursor-pointer'
                } shadow-md w-full justify-center hover:bg-amber-500 transition-all duration-300`}
              >
                {loading && <Loadering />}
                <span className="cursor-pointer text-[#3F3F3F]">
                  Envoyer le lien de réinitialisation de mot de passe
                </span>
              </button>
            </form>
            <hr className="my-8" />
            <div className="text-right">
              <Link to={'/connexion'} className="border-b-sky-400 border-b">
                Finalement, je m’en rappelle !
              </Link>
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="shadow bg-white rounded-lg p-8 text-center">
          <h2 className="text-xl font-semibold text-[#3F3F3F] mb-4">
            📧 Vérifiez votre boîte mail
          </h2>
          <p className="text-gray-600">
            Si un compte existe avec <span className="font-semibold">{email}</span>, vous recevrez un lien de
            réinitialisation dans quelques instants.
          </p>
          <div className="mt-6">
            <Link to="/connexion" className="text-blue-500 underline">
              Retour à la connexion
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default OublierMotdepasse;

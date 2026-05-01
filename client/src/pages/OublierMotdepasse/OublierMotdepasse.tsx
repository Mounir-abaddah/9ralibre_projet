import { useState, type FormEvent } from 'react';
import Input from '@/components/Form/Input';
import ralibre_logo from '@/assets/images/9ralibre.png';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Loadering from '@/components/Loadering/Loadering';
import { useTranslation } from 'react-i18next';

const OublierMotdepasse = () => {
  const { t } = useTranslation();
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
      setErrEmail(t('auth.errors.invalidEmail'));
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
        setStep(2);
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setLoading(false);
      }
    } finally {
      setLoading(false);
      setStep(2);
    }
  };

  return (
    <div className="mx-auto max-w-xl">
      <header>
        <Link to="/"><img src={ralibre_logo} alt="9ralibre_logo" width={200} /></Link>
      </header>

      {/* ── Step 1: Enter email ── */}
      {step === 1 && (
        <div className="rounded-lg bg-white shadow">
          <div className="rounded-t-lg bg-gray-100 px-6 py-4 text-center">
            <h2 className="mb-0 flex items-center justify-center text-xl font-semibold text-[#3F3F3F]">
              <span>{t('forgotPassword.title')}</span>
            </h2>
          </div>
          <div className="p-8">
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label htmlFor="monemail" className="mb-4 block text-base dark:text-gray-600">
                  {t('forgotPassword.instruction')}
                </label>
                <Input
                  id="monemail"
                  onFocus={() => setErrEmail('')}
                  type="email"
                  label={t('auth.fields.email')}
                  icon="mail"
                  placeholder={t('auth.fields.emailPlaceholder')}
                  value={email}
                  onChange={setEmail}
                  error={errEmail}
                  className="dark:text-black"
                />
              </div>
              <button
                disabled={loading}
                type="submit"
                className={`flex items-center gap-2 rounded-md p-2 ${
                  loading ? 'cursor-not-allowed bg-slate-200' : 'cursor-pointer bg-amber-400'
                } w-full justify-center shadow-md transition-all duration-300 hover:bg-amber-500`}
              >
                {loading && <Loadering />}
                <span className="cursor-pointer text-[#3F3F3F] dark:text-gray-600">
                  {t('forgotPassword.submit')}
                </span>
              </button>
            </form>
            <hr className="my-8" />
            <div className="text-right">
              <Link to="/connexion" className="border-b border-b-sky-400 dark:text-cyan-600">
                {t('forgotPassword.rememberLink')}
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ── Step 2: Email sent confirmation ── */}
      {step === 2 && (
        <div className="rounded-lg bg-white p-8 text-center shadow">
          <h2 className="mb-4 text-xl font-semibold text-[#3F3F3F]">
            {t('forgotPassword.checkInbox')}
          </h2>
          <p className="text-gray-600">
            {t('forgotPassword.confirmationText')}{' '}
            <span className="font-semibold">{email}</span>
            {t('forgotPassword.confirmationSuffix')}
          </p>
          <div className="mt-6">
            <Link to="/connexion" className="text-blue-500 underline">
              {t('forgotPassword.backToLogin')}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default OublierMotdepasse;
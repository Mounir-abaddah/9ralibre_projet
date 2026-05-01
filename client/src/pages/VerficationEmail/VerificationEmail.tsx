import axios from 'axios';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const VerificationEmail = () => {
  const { t } = useTranslation();
  document.title = t('verifyEmail.pageTitle');
  const navigate = useNavigate();
  const { token } = useParams();
  const apiUrl = import.meta.env.VITE_API_URL;
  const [loading, setLoading] = useState<boolean>(true);
  const [verified, setVerified] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(5);

  useEffect(() => {
    const handleValidationEmail = async () => {
      try {
        const response = await axios.get(`${apiUrl}/auth/confirm-email/${token}`);
        if (response.data.success) {
          setVerified(true);
        }
      } catch (error) {
        if (error && axios.isAxiosError(error)) {
          toast.error(error.response?.data?.message || t('verifyEmail.invalidLink'));
        }
      } finally {
        setLoading(false);
      }
    };

    handleValidationEmail();
  }, [apiUrl, token, t]);

  useEffect(() => {
    if (verified) {
      const interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      const timeout = setTimeout(() => {
        navigate('/connexion');
      }, 5000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [verified, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      {loading ? (
        <p>⏳ {t('verifyEmail.loading')}</p>
      ) : verified ? (
        <p>
          ✅ {t('verifyEmail.success')}
          <br />
          ⏳ {t('verifyEmail.redirecting', { count: countdown })}
        </p>
      ) : (
        <p>❌ {t('verifyEmail.failed')}</p>
      )}
    </div>
  );
};

export default VerificationEmail;
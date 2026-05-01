import { useNavigate } from 'react-router-dom';
import Lottie from "lottie-react";
import animationData from "@/assets/lottlie/404.json";
import { useTranslation } from 'react-i18next';

const PagesNonTrouver = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-lg">
        <Lottie animationData={animationData} loop={true} />
      </div>
      <h1 className="mt-6 text-4xl font-bold text-gray-800">{t('notFound.title')}</h1>
      <p className="mt-2 text-center text-gray-600">{t('notFound.description')}</p>
      <button
        onClick={() => navigate('/')}
        className="mt-6 cursor-pointer rounded-md bg-gradient-to-r from-cyan-300 to-yellow-400 px-6 py-3 font-semibold text-white shadow transition hover:scale-110"
      >
        {t('notFound.backHome')}
      </button>
    </div>
  );
};

export default PagesNonTrouver;
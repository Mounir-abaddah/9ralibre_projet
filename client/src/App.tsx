import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '@/pages/Home/Home';
import PagesNonTrouver from '@/pages/PagesNonTrouver/PagesNonTrouver';
import Inscription from '@/pages/Inscription/Inscription';
import Connexion from '@/pages/Connexion/Connexion';
import OublierMotdepasse from '@/pages/OublierMotdepasse/OublierMotdepasse';
import ModificationMotdepasse from '@/pages/ModificationMotdepasse/ModificationMotdepasse';
import VerificationEmail from '@/pages/VerficationEmail/VerificationEmail';
import ProtectedRoute from '@/components/ProtectedRoute/ProtectedRoute';
import Dashboard from '@/pages/auth/Dashboard/Dashboard';
import { Toaster } from 'react-hot-toast';
import Layouts from './components/Layouts/Layouts';
import DrawExcalidraw from './pages/auth/DrawExcalidraw/DrawExcalidraw';
import CalendrieMobile from './pages/auth/CalendrieMobile/CalendrieMobile';
import Cours from './pages/auth/Cours/Cours';
import Settings from './pages/auth/Settings/Settings';
import { ThemeProvider } from './context/ThemeContext';

const App = () => {
  return (
    <ThemeProvider>
      <Toaster position='top-right' reverseOrder={false} />
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='*' element={<PagesNonTrouver />} />
        <Route path='/inscription' element={<Inscription />} />
        <Route path='/connexion' element={<Connexion />} />
        <Route path='/password/reset' element={<OublierMotdepasse />} />
        <Route path='/password/reset/:token' element={<ModificationMotdepasse />} />
        <Route path='/inscription/confirm-email/:token' element={<VerificationEmail />} />
        <Route element={<ProtectedRoute />}> 
            <Route path='/Dashboard/:niveaux' element={<Layouts><Dashboard /></Layouts>} />
            <Route path='/Calendrier/:niveaux' element={<Layouts><CalendrieMobile /></Layouts>} />
            <Route path='/Drawing' element={<Layouts><DrawExcalidraw /></Layouts>} />
            <Route path='/Cours/:niveaux' element={<Layouts><Cours /></Layouts>} />
            <Route path='/Paramètre/:niveaux' element={<Layouts><Settings /></Layouts>} />
        </Route>
        <Route />
      </Routes>
    </BrowserRouter>
    </ThemeProvider>
    
  )
}

export default App
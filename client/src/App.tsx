import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Inscription from './pages/Inscription/Inscription';
import { Toaster } from 'react-hot-toast';
import Connexion from './pages/Connexion/Connexion';
import OublierMotdepasse from './pages/OublierMotdepasse/OublierMotdepasse';
import ModificationMotdepasse from './pages/ModificationMotdepasse/ModificationMotdepasse';
import VerificationEmail from './pages/VerficationEmail/VerificationEmail';
import Dashboard from './pages/auth/Dashboard/Dashboard';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

const App = () => {
  return (
    <div>
      <Toaster position='top-right' reverseOrder={false} />
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/inscription' element={<Inscription />} />
        <Route path='/connexion' element={<Connexion />} />
        <Route path='/password/reset' element={<OublierMotdepasse />} />
        <Route path='/password/reset/:token' element={<ModificationMotdepasse />} />
        <Route path='/inscription/confirm-email/:token' element={<VerificationEmail />} />
        <Route element={<ProtectedRoute />}> 
            <Route path='/Dashboard' element={<Dashboard />} />
        </Route>
        <Route />
      </Routes>
    </BrowserRouter>
    </div>
    
  )
}

export default App
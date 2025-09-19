import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Inscription from './pages/Inscription/Inscription';
import { Toaster } from 'react-hot-toast';
import Connexion from './pages/Connexion/Connexion';
import OublierMotdepasse from './pages/OublierMotdepasse/OublierMotdepasse';
import ModificationMotdepasse from './pages/ModificationMotdepasse/ModificationMotdepasse';

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
      </Routes>
    </BrowserRouter>
    </div>
    
  )
}

export default App
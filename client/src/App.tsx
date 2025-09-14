import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Inscription from './pages/Inscription/Inscription';
import { Toaster } from 'react-hot-toast';
import Connexion from './pages/Connexion/Connexion';

const App = () => {
  return (
    <div>
      <Toaster position='top-right' reverseOrder={false} />
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/inscription' element={<Inscription />} />
        <Route path='/connexion' element={<Connexion />} />
      </Routes>
    </BrowserRouter>
    </div>
    
  )
}

export default App
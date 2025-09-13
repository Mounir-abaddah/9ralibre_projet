import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Inscription from './pages/Inscription/Inscription';
import { Toaster } from 'react-hot-toast';

const App = () => {
  return (
    <div>
      <Toaster position='top-right' reverseOrder={false} />
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/inscription' element={<Inscription />} />
      </Routes>
    </BrowserRouter>
    </div>
    
  )
}

export default App
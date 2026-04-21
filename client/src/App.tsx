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
import Cours from './pages/auth/Cours/Cours';
import Settings from './pages/auth/Settings/Settings';
import { ThemeProvider } from './context/ThemeContext';
import Videos from './pages/auth/Video/Video';
import PlayVideo from './pages/auth/Video/PlayVideo';
import Histoire from './pages/auth/Histoire/Histoire';
import Profile from './pages/auth/Profile/Profile';
import Quiz from './pages/auth/Quiz/Quiz';
import Quiz_Start from './pages/auth/Quiz/Quiz_Start';
import Resultat from './pages/auth/Quiz/Resultat';
import Chat from './pages/auth/Chat/Chat';
import ChatStart from './pages/auth/Chat/ChatStart';
import Save from './pages/auth/Save/Save';
import ProfConnexion from './pages/auth/Professeur/Prof-connexion/ProfConnexion';
import LayoutsProf from './components/LayoutsProf/LayoutsProf';
import ProfDashboard from './pages/auth/Professeur/Dashboard/ProfDashboard';
import ProtectedRouteProf from './components/ProtectedRouteProf/ProtectedRouteProf';
import ProfCours from './pages/auth/Professeur/Prof-cours/ProfCours';
import ProfVideos from './pages/auth/Professeur/Prof-videos/ProfVideos';
import ProfQuiz from './pages/auth/Professeur/Prof-quiz/ProfQuiz';
import ProfAddQuiz from './pages/auth/Professeur/Prof-quiz/ProfAddQuiz';
import ProfChat from './pages/auth/Professeur/Prof-chat/ProfChat';
import ProfChatStart from './pages/auth/Professeur/Prof-chat/ProfChatStart';
import ProfSettings from './pages/auth/Professeur/Prof-settings/ProfSettings';
import ProfInscription from './pages/auth/Professeur/Prof-inscription/ProfInscription';
import ProfForgotPassword from './pages/auth/Professeur/Prof-forgotPassword/ProfForgotPassword';
import ProfResetPassword from './pages/auth/Professeur/Prof-resetPassword/ProfResetPassword';
import ProtectedNiveauRoute from './components/ProtectedRoute/ProtectedNiveauRoute';
import About from './pages/About/About';
import { CrispVisibilityController } from './utils/crispVisibilityController';
import ProfPlayVideos from './pages/auth/Professeur/Prof-videos/ProfPlayVideos';
import ProtectedRouteAdmin from './components/ProtectedRouteAdmin/ProtectedRouteAdmin';
import AdminDashboard from './pages/auth/Admin/Dashboard/AdminDashboard';
import LayoutsAdmin from './components/LayoutsAdmin/LayoutsAdmin';
import AdminConnexion from './pages/auth/Admin/Admin-connexion/AdminConnexion';
import AdminUsers from './pages/auth/Admin/Users/AdminUsers';
import AdminSignals from './pages/auth/Admin/Signals/AdminSignals';
import AdminModerationLog from './pages/auth/Admin/Moderation-log/AdminModerationLog';
import AdminAppeals from './pages/auth/Admin/Appeals/AdminAppeals';
import AdminProfessors from './pages/auth/Admin/Professors/AdminProfessors';
import AppealPage from './pages/Appeal/AppealPage';
import Histoire_details from './pages/auth/Histoire/Histoire_details';


const App = () => {
  return (
    <ThemeProvider>
      <Toaster position='top-right' reverseOrder={false} />
      <BrowserRouter>
      <CrispVisibilityController />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='*' element={<PagesNonTrouver />} />
        <Route path='/About' element={<About />} />
        <Route path='/inscription' element={<Inscription />} />
        <Route path='/prof-inscription' element={<ProfInscription />} />
        <Route path='/connexion' element={<Connexion />} />
        <Route path='/prof-connexion' element={<ProfConnexion />} />
        <Route path='/admin-connexion' element={<AdminConnexion />} />
        <Route path='/appeal' element={<AppealPage />} />
        <Route path='/password/reset' element={<OublierMotdepasse />} />
        <Route path='/prof/password/reset' element={<ProfForgotPassword />} />
        <Route path='/password/reset/:token' element={<ModificationMotdepasse />} />
        <Route path='/prof/password/reset/:token' element={<ProfResetPassword />} />
        <Route path='/inscription/confirm-email/:token' element={<VerificationEmail />} />
        <Route element={<ProtectedRoute />}> 
          <Route path='/Profile/:name' element={<Layouts><Profile /></Layouts>} />
          <Route path='/Chat/start/:chatId' element={<Layouts><ChatStart /></Layouts>} />
          <Route path='/Quiz/resultat/:quizId' element={<Layouts><Resultat /></Layouts>} />
          <Route path='/Drawing' element={<Layouts><DrawExcalidraw /></Layouts>} />
        <Route element={<ProtectedNiveauRoute />}>
            <Route path='/Dashboard/:niveaux' element={<Layouts><Dashboard /></Layouts>} />
            <Route path='/Cours/:niveaux' element={<Layouts><Cours /></Layouts>} />
            <Route path='/Videos/:niveaux' element={<Layouts><Videos /></Layouts>} />
            <Route path='/Videos/:niveaux/:videoId' element={<Layouts><PlayVideo /></Layouts>} />
            <Route path='/Histoire/:niveaux' element={<Layouts><Histoire /></Layouts>} />
            <Route path='/Histoire/:histoire/:niveaux' element={<Layouts><Histoire_details /></Layouts>} />
            <Route path='/Quiz/:niveaux' element={<Layouts><Quiz /></Layouts>} />
            <Route path='/Quiz/start/:niveaux/:quizId' element={<Quiz_Start />} />
            <Route path='/Quiz/resultat/:quizId' element={<Layouts><Resultat /></Layouts>} />
            <Route path='/Chat/:niveaux' element={<Layouts><Chat /></Layouts>} />
            <Route path='/Chat/start/:chatId' element={<Layouts><ChatStart /></Layouts>} />
            <Route path='/Save/:niveaux' element={<Layouts><Save /></Layouts>} />
            <Route path='/Paramètre/:niveaux' element={<Layouts><Settings /></Layouts>} />
          </Route>
        </Route>

        <Route element={<ProtectedRouteProf />}>
          <Route path='/prof/dashboard'  element={<LayoutsProf><ProfDashboard /></LayoutsProf>} />
          <Route path='/prof/cours'  element={<LayoutsProf><ProfCours /></LayoutsProf>} />
          <Route path='/prof/videos'  element={<LayoutsProf><ProfVideos /></LayoutsProf>} />
          <Route path='/prof/videos/play/:videoId'  element={<LayoutsProf><ProfPlayVideos /></LayoutsProf>} />
          <Route path='/prof/quiz'  element={<LayoutsProf><ProfQuiz /></LayoutsProf>} />
          <Route path='/prof/add/quiz/questions'  element={<ProfAddQuiz />} />
          <Route path='/prof/chat'  element={<LayoutsProf><ProfChat /></LayoutsProf>} />
          <Route path='/prof/Chat/start/:chatId'  element={<LayoutsProf><ProfChatStart /></LayoutsProf>} />
          <Route path='/prof/settings'  element={<LayoutsProf><ProfSettings /></LayoutsProf>} />
        </Route>
        <Route />

        <Route element={<ProtectedRouteAdmin />}>
          <Route path='/admin/dashboard' element={<LayoutsAdmin><AdminDashboard /></LayoutsAdmin>} />
          <Route path='/admin/users' element={<LayoutsAdmin><AdminUsers /></LayoutsAdmin>} />
          <Route path='/admin/signals' element={<LayoutsAdmin><AdminSignals /></LayoutsAdmin>} />
          <Route path='/admin/professors' element={<LayoutsAdmin><AdminProfessors /></LayoutsAdmin>} />
          <Route path='/admin/moderation-log' element={<LayoutsAdmin><AdminModerationLog /></LayoutsAdmin>} />
          <Route path='/admin/appeals' element={<LayoutsAdmin><AdminAppeals /></LayoutsAdmin>} />
        </Route>
      </Routes>
    </BrowserRouter>
    </ThemeProvider>
    
  )
}

export default App
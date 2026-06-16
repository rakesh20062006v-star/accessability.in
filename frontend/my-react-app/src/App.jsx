import Login from './components/login';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './components/Register';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Fpass from './components/Fpass';
import Dashboard from './components/Dashboard'
import Navbar from './services/servicedashboard'
import Restaurant from "./services/Restaurant";
import Jobs from './services/jobs'
import AdminDashboard from './components/admin-dashboard';
import AddJob from './components/addjob';
import Application from './components/viewApp';
import ManageApplication from './components/manage-application';
import Contact from './components/contact';
import SupportServices from './components/support-services';
import AdminRegister from './components/AdminRegister';
function App(){
return <>
  <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard"  element={<Dashboard />} />
         <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/auth/fpass" element={<Fpass />} />
        <Route path='/jobs' element={<Jobs />} />
        <Route path='/admin-dashboard' element={<AdminDashboard />} />
         <Route path='/add-job' element={<AddJob />} />
          <Route path='/applications' element={<Application />} />
           <Route path='/manage-jobs' element={<ManageApplication />} />
           <Route path='/contact' element={<Contact />} />
           <Route path='/support-services' element={<SupportServices/>}/>
           <Route path='/auth/admin-register' element={<AdminRegister />} />
         <Route
  path="/restaurants"
  element={<Restaurant />}
/>
         
      </Routes>
    </BrowserRouter>
     <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="colored"
      />

</>
}
export default App;
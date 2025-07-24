import './App.css';
import Navbar from './Components/Navbar';
import { Navigate, Route, Routes } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import ProfilePage from './Pages/ProfilePage';
import LoginPage from './Pages/LoginPage';
import SettingPage from './Pages/SettingPage';
import SignUpPage from './Pages/SignUpPage';
import { useAuthStore } from './Store/useAuthStore';
import {useEffect} from 'react'
import { Loader } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

// what is axios 
// complete video about cors
// what is axos instance



function App() {
  const {authUser, checkAuth, isCheckingAuth} = useAuthStore();
  useEffect(()=>{
    checkAuth()
  },[checkAuth])

  // console.log({authUser});
  if(!authUser && isCheckingAuth) return(
    <div className="flex items-center justify-center h-screen">
      <Loader className="size-10 animate-spin"/>
    </div>
  )
  

  return (
    <div data-theme="dark">
      {/* <button className="btn btn-primary">Test Button</button> */}

      <Navbar/>
      <Routes>
        <Route path="/" element={ authUser ? <HomePage/> : <Navigate to="/login"/>}/>
        <Route path='/signup' element={ !authUser ? <SignUpPage/> : <Navigate to="/"/>}/>
        <Route path='/login' element={ !authUser ? <LoginPage/> : <Navigate to="/"/>}/>
        <Route path='/profile' element={authUser ? <ProfilePage/> : <Navigate to="/login"/>}/>
        <Route path='/setting' element={<SettingPage/>}/>
        
      </Routes>

      <Toaster/>
    </div>
  );
}

export default App;

import React, { useContext } from 'react'
import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { Context } from './context/context'
import Home from './pages/Home'
import Landing from './pages/landing'
import Transfer from './pages/Transfer'
import Login from './pages/User_Login'

export const backendUrl = import.meta.env.VITE_BACKEND_URL;

const App = () => {

  const { token } = useContext(Context);

  return token ? (
    <div className='mx-4 sm:mx-[10%]'>
      <ToastContainer />
      <Routes>
        <Route path='/home' element={<Home />} />
        <Route path='/' element={<Landing />} />
        <Route path='/transfer' element={<Transfer />} />
      </Routes>
    </div>
  ) : (
    <>
      <Login />
      <ToastContainer />
    </>
  )
}

export default App
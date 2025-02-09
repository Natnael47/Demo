import React, { useContext } from 'react'
import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { Context } from './context/context'
import Home from './pages/Home'
import Landing from './pages/landing'
import Login from './pages/login'
import MyNumber from './pages/MyNumber'
import TeleHome from './pages/TeleHome'
import TelePay from './pages/TelePay'
import Transfer from './pages/Transfer'

export const backendUrl = import.meta.env.VITE_BACKEND_URL;

const App = () => {

  const { token } = useContext(Context);

  return token ? (
    <div className='mx-4 sm:mx-[10%]'>
      <ToastContainer />
      <Routes>
        <Route path='/home2' element={<Home />} />
        <Route path='/home' element={<TeleHome />} />
        {/* Landing route for CBE and tele home for tele birr */}
        <Route path='/transfer' element={<Transfer />} />
        <Route path='/lotteryNum' element={<MyNumber />} />
        <Route path='/teleLogin' element={<Login />} />
        <Route path='/' element={<Landing />} />
        <Route path='/tele-pay' element={<TelePay />} />
      </Routes>
    </div>
  ) : (
    <>
      {/* <Login /> for cbe*/}
      <Login />
      <ToastContainer />
    </>
  )
}

export default App
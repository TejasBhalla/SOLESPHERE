import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'
import Navbar from './components/Navbar'
import DashBoard from './pages/DashBoard'
import { Toaster } from 'sonner'
import CategoryPage from './pages/CategoryPage'

function App() {
  return (
    <>
    <Navbar></Navbar>
    <Toaster  position='top-center' richColors></Toaster>
    <Routes>
      <Route path='/' element={<HomePage></HomePage>}></Route>
      <Route path='/signup' element={<SignUpPage></SignUpPage>}></Route>
      <Route path='/login' element={<LoginPage></LoginPage>}></Route>
      <Route path='/dashboard' element={<DashBoard></DashBoard>}></Route>
      <Route path='/category/:name' element={<CategoryPage></CategoryPage>}></Route>
    </Routes>
    
   
    </>
  )
}

export default App

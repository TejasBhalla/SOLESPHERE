import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'
import Navbar from './components/Navbar'
import DashBoard from './pages/DashBoard'
import { Toaster } from 'sonner'
import CategoryPage from './pages/CategoryPage'
import ItemPage from './pages/ItemPage'
import ScrollToTop from './components/ScrollToTop'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import OrderSuccessPage from './pages/OrderSuccessPage'

function App() {
  return (
    <>
    <ScrollToTop />
    <Navbar></Navbar>
    <Toaster  position='top-center' richColors></Toaster>
    <Routes>
      <Route path='/' element={<HomePage></HomePage>}></Route>
      <Route path='/signup' element={<SignUpPage></SignUpPage>}></Route>
      <Route path='/login' element={<LoginPage></LoginPage>}></Route>
      <Route path='/dashboard' element={<DashBoard></DashBoard>}></Route>
      <Route path='/category/:name' element={<CategoryPage></CategoryPage>}></Route>
      <Route path='/item/:id' element={<ItemPage></ItemPage>}></Route>
      <Route path='/cart' element={<CartPage></CartPage>}></Route>
      <Route path='/checkout' element={<CheckoutPage></CheckoutPage>}></Route>
      <Route path='/order-success' element={<OrderSuccessPage></OrderSuccessPage>}></Route>
    </Routes>
    
   
    </>
  )
}

export default App

import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import { Route, Routes } from 'react-router-dom'
import Add from './pages/Add'
import List from './pages/List'
import Orders from './pages/Orders'
import Login from './components/Login'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/ReactToastify.css';
import EditProduct from './pages/EditProduct';
import AddCategory from './pages/AddCat';
import ListCategory from './pages/ListCat';
import AddAtr from './pages/AddAtr'
import ListAtr from './pages/ListAtr'
import AddDynamic from './pages/AddDynamic'
import ListDynamic from './pages/ListDynamic'
import AdminPhone from './pages/AdminPhone'
import Users from './pages/Users'
// import Report from './pages/Report'
import Footer from "./components/Footer";
import Dashboard from './pages/Dashboard'
import AddDiscount from './pages/AddDiscount'
import ListDiscount from './pages/ListDiscount'


export const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const currency = "₹ ";

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token") ? localStorage.getItem("token") : "");
  const [isOpen, setIsOpen] = useState(true);
  
  useEffect(() => {
    localStorage.setItem("token", token)
  }, [token])

  return (
    <div className='bg-white w-full '>
      <ToastContainer />
      {token === "" ? <Login setToken={setToken} /> :
        <>
          <div className='flex'>
            <Sidebar setToken={setToken} isOpen={isOpen} setIsOpen={setIsOpen} />
          
            <div className={`min-h-screen transition-all duration-300 ${isOpen ? 'ml-72' : 'xs:ml-0 lg:ml-24'} w-full`}>
              <Navbar setToken={setToken} isOpen={isOpen} />
              <div className="p-4 mt-12 mb-5">
                <Routes>
                  <Route path="/" element={<Dashboard token={token} />} />
                  <Route path="/dashboard" element={<Dashboard token={token} />} />
                  <Route path="/add" element={<Add token={token} />} />
                  <Route path="/list" element={<List token={token} />} />
                  <Route path="/edit/:id" element={<EditProduct token={token} />} />
                  <Route path="/orders" element={<Orders token={token} />} />
                  <Route path="/add-category" element={<AddCategory token={token} />} />
                  <Route path="/list-category" element={<ListCategory token={token} />} />
                  <Route path="/add-attribute" element={<AddAtr token={token} />} />
                  <Route path="/list-attribute" element={<ListAtr token={token} />} />
                  <Route path="/add-dynamic" element={<AddDynamic token={token} />} />
                  <Route path="/list-dynamic" element={<ListDynamic token={token} />} />
                  <Route path="/admin-phone" element={<AdminPhone />} />
                  <Route path="/users" element={<Users token={token} />} />
                  <Route path="/add-discount" element={<AddDiscount token={token} />} />
                  <Route path="/list-discount" element={<ListDiscount token={token} />} />
                  <Route path="/reports" element={<Dashboard token={token} />} />
                </Routes>
                <Footer />
              </div>
            </div>
          </div>
        </>}
    </div>
  )
}

export default App
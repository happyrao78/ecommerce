import React, { useContext } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Collection from './pages/Collection'
import About from './pages/About'
import Contact from './pages/Contact'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Login from './pages/Login'
import PlaceOrder from './pages/PlaceOrder'
import Orders from './pages/Orders'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import SearchBar from './components/SearchBar'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/ReactToastify.css';
import Verify from './pages/Verify'
import Freeship from './components/Freeship'
import Hero from './components/Hero'
import BottomMobileMenu from './components/BottomMobileMenu'
import Wishlist from './pages/Wishlist'
import WishlistHero from './components/WishlistHero'
import SlideCart from './components/SlideCart'
import CategorySliderMobile from './components/CategorySliderMobile'
import { UiContext, UiProvider } from './context/UiContext'
import CollectionsHero from './components/CollectionsHero'
import CartHero from './components/CartHero'
import PlaceOrderHero from './components/PlaceOrderHero'
import CategoryBasedCollection, { CategoryBasedCollectionHero } from './pages/CategoryBasedCollection'
import SubCategoryBasedCollection, { SubCategoryBasedCollectionHero } from './pages/SubCategoryBasedCollection'
import Account from './pages/Account'
import AccountHero from './components/AccountHero'
import HideGoogleTranslateBar from './components/HideGoogleTranslate'

const App = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <>
      {!isLoginPage && (
        <div className='px-0 sm:px-[5vw] md:px-[7vw] lg:px-[0vw]'>
          <Navbar /> 
          {location.pathname === "/" && <> <Hero /> <Freeship /></>}
          {location.pathname === "/wishlist" && <> <WishlistHero /></>}
          {location.pathname === "/collection" && <> <CollectionsHero /></>}
          {location.pathname === "/cart" && <> <CartHero /></>}
          {location.pathname === "/place-order" && <> <PlaceOrderHero /></>}
          {location.pathname === "/account" && <> <AccountHero /></>}
        </div>
      )}

      <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[6vw]'>
        {!isLoginPage && <SearchBar />}
        <ToastContainer />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/product/:productId" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/place-order" element={<PlaceOrder />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/account" element={<Account />} />
        </Routes>
      </div>

      <div className='px-0 sm:px-[5vw] md:px-[7vw] lg:px-[0vw]'>
        <Routes>
          <Route path="/category/:categoryName" element={
            <>
              <CategoryBasedCollectionHero />
              <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[6vw]'>
                <CategoryBasedCollection />
              </div>
            </>} />

            <Route path="/category/:categoryName/:subCategoryName" element={
            <>
              <SubCategoryBasedCollectionHero />
              <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[6vw]'>
                <SubCategoryBasedCollection />
              </div>
            </>} />
        </Routes>

        {!isLoginPage && <Footer />}
      </div>

      {!isLoginPage && (
        <>
          <BottomMobileMenu />
          <SlideCart />
          <CategorySliderMobile />
        </>
      )}
    </>
  )
}

export default App
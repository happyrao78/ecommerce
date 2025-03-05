import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BsGrid, BsCart3, BsHeart } from 'react-icons/bs';
import { IoSearchOutline } from 'react-icons/io5';
import { BiCategory } from 'react-icons/bi';
import { HiOutlineMenuAlt1 } from 'react-icons/hi';
import { ShopContext } from '../context/ShopContext';
import { UiContext } from '../context/UiContext';
import SearchBar from './SearchBar';
import { Search } from 'lucide-react';
import SearchModal from './Search';
import { FaRegUser } from 'react-icons/fa6';
import { FiUser } from 'react-icons/fi';

const BottomMobileMenu = () => {
  const location = useLocation();
  const {getCartCount}=useContext(ShopContext)
  const { openSlideCart ,openCategories} = useContext(UiContext);

  // Function to determine if a path is active
  const isActive = (path) => {
    return location.pathname === path;
  };

 

  return (
    <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-2 z-40 md:hidden overflow-x-hidden">
      <div className="flex items-center justify-between max-w-md mx-auto px-2">
        <Link to="/collection" className="flex flex-col items-center">
          <BsGrid className={`text-xl ${isActive('/collection') ? 'text-black' : 'text-gray-500'}`} />
          <span className={`text-xs mt-1 ${isActive('/collection') ? 'text-black' : 'text-gray-500'}`}>Shop</span>
        </Link>
        
        <div  className="flex flex-col items-center" onClick={openCategories}>
          <HiOutlineMenuAlt1 className={`text-xl ${isActive('/categories') ? 'text-black' : 'text-gray-500'}`} />
          <span className={`text-xs mt-1 ${isActive('/categories') ? 'text-black' : 'text-gray-500'}`}>Categories</span>
        </div>
        
        {/* <Link to="/search" className="flex flex-col items-center">
          <IoSearchOutline className={`text-xl ${isActive('/search') ? 'text-black' : 'text-gray-500'}`} />
          <span className={`text-xs mt-1 ${isActive('/search') ? 'text-black' : 'text-gray-500'}`}>Search</span>
        </Link> */}

        {/* <SearchModal/> */}
        
        <Link to="/wishlist" className="flex flex-col items-center">
          <BsHeart className={`text-xl ${isActive('/wishlist') ? 'text-black' : 'text-gray-500'}`} />
          <span className={`text-xs mt-1 ${isActive('/wishlist') ? 'text-black' : 'text-gray-500'}`}>Wishlist</span>
        </Link>
        
        <div className="flex flex-col items-center relative cursor-pointer" onClick={openSlideCart}>
          <BsCart3 className="text-xl text-gray-500" />
          <span className="text-xs mt-1 text-gray-500">Cart</span>

          {/* Cart item count badge */}
          {getCartCount() > 0 && (
            <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
              {getCartCount()}
            </span>
          )}
        </div>

        <Link to="/account" className="flex flex-col items-center">
           <FiUser className={`text-xl font-light ${isActive('/account') ? 'text-black' : 'text-gray-500'}`} />
          <span className={`text-xs mt-1 ${isActive('/account') ? 'text-black' : 'text-gray-500'}`}>Account</span>
        </Link>

        </div>
    </div>
  );
};

export default BottomMobileMenu;
// import React from 'react'
// import { assets } from '../assets/frontend_assets/assets'
// import { NavLink } from 'react-router-dom'

// const Footer = () => {
//   return (
//     <div className=''>
//         <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14  mt-16 text-sm bg-orange-600 lg:px-12 py-6 px-4 sm:px-4'>
//             <div>
//                 <img src={assets.logo} alt="logo"
//                 className='w-40' />
//                 <p className='text-md w-full md:w-2/3 text-gray-300 mt-0'>
//                lorem Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
//                 </p>
//             </div>

//             <div>
//                 <p className='text-2xl font-medium mb-5 text-gray-100 teko'>COMPANY</p>
//                 <ul className='flex flex-col  text-gray-300 '>
//                 <ul className='hidden sm:flex lg:grid gap-5 text-sm text-gray-100'>
//                 <NavLink to='/' className='flex flex-col gap-1'>
//                     <p className='font-medium'>HOME</p>
//                     <hr className='w-1/6 border-none h-[1.5px] bg-gray-100 hidden' />
//                 </NavLink>

//                 {/* <NavLink to='/collection' className='flex flex-col  gap-1'>
//                     <p>COLLECTION</p>
//                     <hr className='w-1/6 border-none h-[1.5px] bg-gray-100 hidden' />
//                 </NavLink> */}

//                 <NavLink to='/about' className='flex flex-col  gap-1'>
//                     <p className='font-medium'>ABOUT</p>
//                     <hr className='w-1/6 border-none h-[1.5px] bg-gray-100 hidden' />
//                 </NavLink>

//                 <NavLink to='/contact' className='flex flex-col  gap-1'>
//                     <p className='font-medium'>CONTACT</p>
//                     <hr className='w-1/6 border-none h-[1.5px] bg-gray-100 hidden' />
//                 </NavLink>
//             </ul>
//                 </ul>
//             </div>

//             <div>
//                 <p className='text-2xl font-medium mb-5 text-gray-100 teko'>GET IN TOUCH</p>
//                 <ul className='flex flex-col gap-1 text-gray-300'>
//                 <li className='text-md font-medium'>+91 98145xxxx</li>
//                 <li className='text-md font-medium'>hello@gmail.com</li>
//                 </ul>
//             </div>
//         </div>

//         <div className='bg-orange-600'>
//             <hr />
//             <p className='py-5 text-md text-center text-gray-300 teko'>
//                 Powered by DevXDuo - All Rights Reserved.
//             </p>
//         </div>
//     </div>
//   )
// }

// export default Footer


import React from 'react'
import { assets } from '../assets/frontend_assets/assets'
import { Link, NavLink } from 'react-router-dom'
import visa from "../assets/ecommerce-islam/visa.png";
import payment2 from "../assets/ecommerce-islam/payment2.png";
import payment3 from "../assets/ecommerce-islam/payment3.png";
import { FaArrowUp, FaFacebookF, FaInstagram, FaPaypal, FaPinterestP, FaTiktok, FaTwitter } from 'react-icons/fa6';

const Footer = () => {
  return (
    <div className='border border-t mt-6 sm:mt-6 lg:mt-16'>
      <div className='flex flex-col sm:grid grid-cols-[2fr_1fr_1fr_2fr] gap-8 lg:px-12 py-6 px-4 sm:px-4'>
        {/* Left Column - Logo and Contact Info */}
        <div>
        {/* /* <img src={assets.logo} alt="logo" className='w-40' /> */} 
                  <Link to="/">
                        <p className='tracking-wider text-xl teko font-bold text-black my-8'>TRIBE</p>
                    </Link>
                  <p className='mt-4 text-md'>549 Oak St.Crystal Lake, IL 60014</p>
                  <button className='flex items-center mt-4 text-md font-medium'>
                    GET DIRECTION <span className='ml-2'>↗</span>
                  </button>
                  
                  <div className='flex items-center mt-4'>
                    <span className='mr-2'>✉</span>
                    <p>themesflat@gmail.com</p>
                  </div>
                  
                  <div className='flex items-center mt-4'>
                    <span className='mr-2'>📞</span>
                    <p>315-666-6688</p>
                  </div>
                  
                
                <div className='flex gap-3 mt-6'>
                    <a href="#" className='w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-black hover:text-white'>
                        <FaFacebookF className='text-lg'/>
                    </a>
                    <a href="#" className='w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-black hover:text-white'>
                        <FaTwitter className='text-lg' />
                    </a>
                    <a href="#" className='w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-black hover:text-white'>
                        <FaInstagram className='text-lg'/>
                    </a>
                    <a href="#" className='w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-black hover:text-white'>
                        <FaTiktok className='text-lg'/>
                    </a>
                    <a href="#" className='w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-black hover:text-white'>
                        <FaPaypal className='text-lg'/>
                    </a>
                    <a href="#" className='w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-black hover:text-white'>
                        <FaPinterestP className='text-lg'/>
                    </a>
                </div>
                </div>

                {/* Information Column */}
        <div className='text-sm'>
          <p className='text-lg font-medium mb-4'>Information</p>
          <ul className='flex flex-col gap-3'>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Our Stories</a></li>
            <li><a href="#">Size Guide</a></li>
            <li><a href="#">Contact us</a></li>
            <li><a href="#">Career</a></li>
            <li><a href="#">My Account</a></li>
          </ul>
        </div>

        {/* Customer Services Column */}
        <div className='text-sm'>
          <p className='text-lg font-medium mb-4'>Customer Services</p>
          <ul className='flex flex-col gap-3'>
            <li><a href="#">Shipping</a></li>
            <li><a href="#">Return & Refund</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms & Conditions</a></li>
            <li><a href="#">Orders FAQs</a></li>
            <li><a href="#">My Wishlist</a></li>
          </ul>
        </div>

        {/* Newsletter Column */}
        <div className='text-sm'>
          <p className='text-lg font-medium mb-4'>Newsletter</p>
          <p className='mb-4'>Sign up for our newsletter and get 10% off your first purchase</p>
          
          {/* Newsletter Form */}
          <div className='relative mt-6'>
            <input 
              type="email" 
              placeholder="Enter your e-mail" 
              className='w-full py-3 px-4 border border-gray-300 rounded-full'
            />
            <button className='absolute right-2 top-1/2 transform -translate-y-1/2 bg-black text-white p-2 rounded-full'>
              <FaArrowUp className='rotate-45'/>
            </button>
          </div>
          
          <div className='mt-4 flex items-start'>
            <input type="checkbox" className='mt-1 mr-2' />
            <p className='text-sm'>
              By clicking subcribe, you agree to the 
              <a href="#" className='underline font-medium'> Terms of Service</a> and 
              <a href="#" className='underline font-medium'> Privacy Policy</a>.
            </p>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className='flex flex-col sm:flex-row justify-between items-center border-t border-gray-200 mt-8 py-4 lg:px-12 px-4'>
        <p className='text-sm'>©2025 Modave. All Rights Reserved.</p>
        
        <div className='flex items-center gap-2 mt-4 sm:mt-0'>
          <div className='flex items-center gap-2'>
            <span>🇺🇸</span>
            <select className='bg-transparent border-none'>
              <option>USD</option>
            </select>
          </div>
          
          <div className='flex items-center gap-2 ml-4'>
            <select className='bg-transparent border-none'>
              <option>English</option>
            </select>
          </div>
        </div>

        <div className='flex items-center gap-2 mt-4 sm:mt-0'>
          <p className='mr-2'>Payment:</p>
          <img src={visa} alt="visa" className='h-6' />
          <img src={payment3} alt="mastercard" className='h-6' />
          <img src={payment2} alt="amex" className='h-6' />
          {/* <img src={assets.paypal} alt="paypal" className='h-6' />
          <img src={assets.diners} alt="diners" className='h-6' />
          <img src={assets.discover} alt="discover" className='h-6' /> */}
        </div>
      </div>
    </div>
  )
}

export default Footer
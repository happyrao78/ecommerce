import React from 'react';
import { assets } from "../assets/admin_assets/assets.js";

const Navbar = ({ setToken, isOpen }) => {
  return (
    <div 
      className={`fixed top-0 bg-black border-b border-gray-200 z-40 px-4 py-2 flex items-center justify-between transition-all duration-300 ${
        isOpen ? 'left-64 w-[calc(100%-256px)]' : 'left-20 w-[calc(100%-80px)]'
      }`}
    >
      <div className='text-xl font-semibold text-white'>Dashboard</div>
      
      <div className='flex items-center space-x-4'>
        <div className='relative'>
          <button className='p-2 hover:bg-gray-100 rounded-full'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
            </svg>
            <span className='absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center'>1</span>
          </button>
        </div>
        
        <div className='relative'>
          <button className='p-2 hover:bg-gray-100 rounded-full'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.086-.34-.002-.715-.254-1.084C3.991 16.153 3 14.18 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
            </svg>
            <span className='absolute top-0 right-0 bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center'>1</span>
          </button>
        </div>
        
        <div className='flex items-center space-x-2'>
          <img src={assets.logo} alt="Profile" className='w-8 h-8 rounded-full' />
          <div className='text-sm'>
            <div className='font-medium text-white'>Happy Yadav</div>
            {/* <div className='text-xs text-gray-500'></div> */}
          </div>
        </div>
        
        {/* <button 
          className='bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm'
          onClick={() => setToken("")}
        >
          Logout
        </button> */}
      </div>
    </div>
  );
};

export default Navbar;
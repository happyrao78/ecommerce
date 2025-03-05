import React, { useState, useEffect } from 'react';

const Footer = ({ isOpen }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const checkScrollPosition = () => {
      // Check if the user has scrolled to the bottom of the page
      const isAtBottom = 
        (window.innerHeight + window.scrollY) >= 
        (document.body.offsetHeight - 100); // 100px buffer

      setIsVisible(isAtBottom);
    };

    // Add scroll event listener
    window.addEventListener('scroll', checkScrollPosition);

    // Initial check
    checkScrollPosition();

    // Cleanup listener
    return () => {
      window.removeEventListener('scroll', checkScrollPosition);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div 
      className={`fixed bottom-0 bg-black border-t border-gray-200 z-40 px-4 py-3 flex items-center justify-between transition-all duration-300 ${
        isOpen ? 'left-64 w-[calc(100%-256px)]' : 'left-20 w-[calc(100%-80px)]'
      }`}
    >
    
      
      <div className='text-sm text-white mx-auto items-center justify-center'>
        © {new Date().getFullYear()} Admin Dashboard. Designed with ❤️ by DevxDuo. All Rights Reserved.
      </div>
    </div>
  );
};

export default Footer;
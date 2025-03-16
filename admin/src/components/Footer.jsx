import React, { useState, useEffect } from 'react';
import { Heart, ChevronUp, Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const checkScrollPosition = () => {
      // Show scroll-to-top button when user has scrolled down a bit
      setShowScrollTop(window.scrollY > 300);
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

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      {/* Scroll to top button */}
      {showScrollTop && (
        <button 
          onClick={scrollToTop}
          className="fixed right-6 bottom-24 z-50 p-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-lg transition-all duration-300 hover:transform hover:scale-110 hover:shadow-indigo-500/30"
          aria-label="Scroll to top"
        >
          <ChevronUp size={20} className="animate-bounce-gentle" />
        </button>
      )}

      {/* Footer with fixed position */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-gray-900 border-t border-gray-800">
        <div className="flex items-center justify-between px-4 h-12">
          <div className="text-gray-400 text-sm">
            
          </div>
          
          <div className="flex items-center justify-center text-sm text-gray-300">
            © {new Date().getFullYear()} Admin Dashboard. Designed with 
            <Heart 
              size={14} 
              className="text-pink-500 mx-1 fill-current" 
              fill="currentColor"
            /> by 
            <span className="text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text font-medium ml-1">DevxDuo</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <a 
              href="#" 
              className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-800/70 transition-all duration-300"
              aria-label="GitHub"
            >
              <Github size={16} />
            </a>
            <a 
              href="#" 
              className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-800/70 transition-all duration-300"
              aria-label="Twitter"
            >
              <Twitter size={16} />
            </a>
            <a 
              href="#" 
              className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-800/70 transition-all duration-300"
              aria-label="LinkedIn"
            >
              <Linkedin size={16} />
            </a>
          </div>
        </div>
      </div>

      {/* Custom animation for scroll button */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes bounce-gentle {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-3px);
            }
          }
          .animate-bounce-gentle {
            animation: bounce-gentle 2s infinite ease-in-out;
          }
        `
      }} />
    </>
  );
};

export default Footer;
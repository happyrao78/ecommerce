// Add this at the top with your other imports
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react'; // Add useEffect import
import Nav from "../assets/admin_assets/nav.png";
import Nav2 from "../assets/admin_assets/nav2.png";

const BannerSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const banners = [
    {
      id: 1,
      image: Nav,
      alt: "Banner image 1"
    },
    {
      id: 2,
      image: Nav2,
      alt: "Banner image 2"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  // Add this useEffect hook for auto-sliding
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 3000); // 3000 milliseconds = 3 seconds
    
    // Clean up the interval when component unmounts
    return () => clearInterval(interval);
  }, []);  // Empty dependency array means this runs once on mount

  return (
    <div className="relative overflow-hidden rounded-lg bg-gray-100 mb-8">
      <div className="flex transition-transform duration-500 ease-in-out transform" 
           style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
        {banners.map((banner) => (
          <div key={banner.id} className="min-w-full relative">
            <img 
              src={banner.image} 
              alt={banner.alt} 
              className="w-full object-cover"
            />
          </div>
        ))}
      </div>
      
      <button 
        onClick={prevSlide} 
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/30 rounded-full p-2 hover:bg-white/50 z-20"
      >
        <ChevronLeftIcon className="h-6 w-6 text-white" />
      </button>
      
      <button 
        onClick={nextSlide} 
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/30 rounded-full p-2 hover:bg-white/50 z-20"
      >
        <ChevronRightIcon className="h-6 w-6 text-white" />
      </button>
      
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 w-2 rounded-full ${
              index === currentSlide ? 'bg-white' : 'bg-white/50'
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default BannerSlider;
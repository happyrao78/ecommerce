import React from "react";
import Slider from "react-slick";
import heroslider from "../assets/ecommerce-islam/hero-slider.jpg";
import heroslider2 from "../assets/ecommerce-islam/hero-slider.jpg";
import Button from "./Button";
import { FaArrowUp, FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import { Link } from "react-router-dom";

// Custom arrow components for the slider
const PrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className="!hidden sm:!hidden lg:!absolute  bottom-10 right-20 z-10 cursor-pointer p-2 md:p-3 bg-white hover:bg-black hover:text-white rounded-full transition-colors duration-300 "
      style={{ ...style }}
      onClick={onClick}
    >
      <FaArrowLeft className="text-xs md:text-base" />
    </div>
  );
};

const NextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className="!hidden sm:!hidden lg:!absolute bottom-10 right-10 z-10 cursor-pointer p-2 md:p-3 bg-white hover:bg-black hover:text-white rounded-full transition-colors duration-300 border-black "
      style={{ ...style }}
      onClick={onClick}
    >
      <FaArrowRight className="text-xs md:text-base" />
    </div>
  );
};

const Hero = () => {
  // Data object for each slider with heading, subheading, and button text
  const slidesData = [
    {
      image: heroslider,
      heading: "Summer 2024 Collection",
      subheading: "Fresh styles just in! Elevate Your Look",
      buttonText: "Explore Collection",
      buttonIcon: <FaArrowUp className='rotate-45 group-hover:rotate-90 transition-all duration-300 ease-in-out' />
    },
    {
      image: heroslider2,
      heading: "Autumn Essentials",
      subheading: "Cozy designs for the changing season",
      buttonText: "Shop Now",
      buttonIcon: <FaArrowUp className='rotate-45 group-hover:rotate-90 transition-all duration-300 ease-in-out' />
    },
    {
      image: heroslider2,
      heading: "Autumn Essentials",
      subheading: "Cozy designs for the changing season",
      buttonText: "Shop Now",
      buttonIcon: <FaArrowUp className='rotate-45 group-hover:rotate-90 transition-all duration-300 ease-in-out' />
    }
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: true,
    pauseOnHover: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    appendDots: dots => (
      <div>
        <ul className="absolute bottom-10 sm:bottom-16 left-4 sm:left-16 justify-center flex" style={{ margin: "0px" }}> {dots} </ul>
      </div>
    ),
    
  };

  return (
    <div className="w-full overflow-hidden relative">
      <Slider {...settings}>
        {slidesData.map((slide, index) => (
          <div key={index} className="w-full h-full sm:h-full relative px-0">
            <img 
              src={slide.image} 
              alt={`Slide ${index + 1}`} 
              className="w-full object-cover min-h-[300px] sm:min-h-[400px] md:min-h-[500px] lg:min-h-[600px]" 
            />
            
            <div className="absolute inset-0 flex flex-col items-start justify-center p-4 sm:p-6 md:p-8 lg:p-10 pl-4 sm:pl-8 md:pl-12 lg:pl-16 w-full sm:w-4/5 md:w-3/4 gap-2 sm:gap-4 md:gap-6">
              <h1 className="text-black text-3xl sm:text-5xl md:text-6xl lg:text-8xl font-[500] leading-tight">
                {slide.heading}
              </h1>
              <h5 className="text-black text-sm sm:text-base md:text-lg mb-2 sm:mb-4">
                {slide.subheading}
              </h5>
              <Link className="mt-2" to="/collection">
                <Button icon={slide.buttonIcon} className="text-sm sm:text-base">
                  {slide.buttonText}
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Hero;



// import React from 'react';
// import { FaExchangeAlt, FaRegCheckCircle, FaHeadset } from 'react-icons/fa'; // Importing icons
// import Title from './Title';

// const OurPolicy = () => {
//   return (
//     <div className="my-10">
//       {/* Title Section */}
//       <div className="text-center pt-8 text-3xl">
//         <Title text1="WHY CHOOSE" text2="US" />
//         <p className="w-3/4 m-auto text-sm sm:text-sm md:text-base text-gray-500 lg:text-md">
//           My mission is to connect people with each other and with the world around them. 
//         </p>
//       </div>

//       {/* Feature Section */}
//         <div className="flex flex-col sm:flex-row justify-around lg:justify-between gap-4 lg:gap-2 text-center py-8  md:text-lg">
//         {/* Feature 1 */}
//         <div className="border shadow-md p-5 sm:p-5 lg:p-12 rounded-md transition-all duration-300 ease-in-out hover:bg-orange-600  w-full gap-2 flex flex-col items-center justify-center group">
//           <FaExchangeAlt className="text-4xl  m-auto mb-4 text-orange-600 group-hover:text-white" /> {/* Icon */}
//           <p className="font-semibold text-2xl sm:text-2xl lg:text-4xl teko tracking-wider group-hover:text-white">
//             Easy Returns
//           </p>
//           <p className="text-gray-600 group-hover:text-gray-200 text-sm sm:text-base md:text-lg lg:text-sm">
//             30 Days Return Policy
//           </p>
//         </div>

//         {/* Feature 2 */}
//         <div className="border shadow-md p-5 sm:p-5 lg:p-12 rounded-md transition-all duration-300 ease-in-out hover:bg-orange-600  w-full gap-2 flex flex-col items-center justify-center group">
//           <FaRegCheckCircle className="text-4xl  m-auto mb-4 text-orange-600 group-hover:text-white" /> {/* Icon */}
//           <p className="text-2xl sm:text-2xl lg:text-4xl teko tracking-wider group-hover:text-white">
//             Quality Assured
//           </p>
//           <p className="text-gray-600 group-hover:text-gray-200 text-sm sm:text-base md:text-lg lg:text-sm">
//             100% Genuine Trips
//           </p>
//         </div>

//         {/* Feature 3 */}
//         <div className="border shadow-md p-5 sm:p-5 lg:p-12 rounded-md transition-all duration-300 ease-in-out hover:bg-orange-600  w-full gap-2 flex flex-col items-center justify-center group">
//           <FaHeadset className="text-4xl  m-auto mb-4 text-orange-600 group-hover:text-white" /> {/* Icon */}
//           <p className="font-semibold text-2xl sm:text-2xl  lg:text-4xl teko tracking-wider group-hover:text-white">
//             Best Customer Support
//           </p>
//           <p className="text-gray-600 group-hover:text-gray-200 text-sm sm:text-base md:text-lg lg:text-sm">
//             Contact MusafirTribe: 8595864036
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OurPolicy;


import React from 'react';
import { BsArrowReturnLeft } from 'react-icons/bs';
import { PiHeadphones, PiTruckLight } from "react-icons/pi";
import { CiDiscount1 } from "react-icons/ci";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const OurPolicy = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="my-10 text-center h-fit-content ">
      <Slider {...settings} className="lg:!hidden my-4 overflow-x-hidden border rounded-lg p-4 py-8  ">
        {/* Feature 1 - Returns */}
        <div className="flex flex-col items-center justify-center w-full gap-2">
          <BsArrowReturnLeft className="text-4xl text-black mb-4 w-full" />
          <p className="text-xl font-medium">14-Day Returns</p>
          <p className="text-gray-500 text-md ">Risk-free shopping with easy returns.</p>
        </div>

        {/* Feature 2 - Free Shipping */}
        <div className="flex flex-col items-center justify-center w-full gap-2">
          <PiTruckLight className="text-4xl text-black mb-4 text-center w-full" />
          <p className="text-xl font-medium">Free Shipping</p>
          <p className="text-gray-500 text-md">No extra costs, just the price you see.</p>
        </div>

        {/* Feature 3 - 24/7 Support */}
        <div className="flex flex-col items-center justify-center w-full gap-2">
          <PiHeadphones className="text-4xl text-black mb-4 text-center w-full" />
          <p className="text-xl font-medium">24/7 Support</p>
          <p className="text-gray-500 text-md">24/7 support, always here just for you.</p>
        </div>

        {/* Feature 4 - Member Discounts */}
        <div className="flex flex-col items-center justify-center w-full gap-2">
          <CiDiscount1 className="text-4xl mb-4 text-black text-center w-full" />
          <p className="text-xl font-medium">Member Discounts</p>
          <p className="text-gray-500 text-md">Special prices for our loyal customers.</p>
        </div>
      </Slider>

      {/* Desktop Layout */}
      <div className="hidden sm:hidden lg:flex   justify-between gap-8 text-center py-10 ">
        <div className="flex flex-col items-center w-full gap-2 ">
          <BsArrowReturnLeft className="w-full text-4xl text-black mb-4 " />
          <p className="text-xl font-medium">14-Day Returns</p>
          <p className="text-gray-500 text-md">Risk-free shopping with easy returns.</p>
        </div>
        <div className="flex flex-col items-center w-full gap-2">
          <PiTruckLight className="w-full text-4xl text-black mb-4" />
          <p className="text-xl font-medium">Free Shipping</p>
          <p className="text-gray-500 text-md">No extra costs, just the price you see.</p>
        </div>
        <div className="flex flex-col items-center w-full gap-2">
          <PiHeadphones className=" w-full text-4xl text-black mb-4" />
          <p className="text-xl font-medium">24/7 Support</p>
          <p className="text-gray-500 text-md">24/7 support, always here just for you.</p>
        </div>
        <div className="flex flex-col items-center w-full gap-2">
          <CiDiscount1 className="w-full text-4xl mb-4 text-black" />
          <p className="text-xl font-medium">Member Discounts</p>
          <p className="text-gray-500 text-md">Special prices for our loyal customers.</p>
        </div>
      </div>
    </div>
  );
};

export default OurPolicy;

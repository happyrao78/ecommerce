import React from "react";
import Button from "./Button";
import SpecialOffer1 from "../assets/ecommerce-islam/specialOffer1.jpg";
import SpecialOffer2 from "../assets/ecommerce-islam/specialOffer2.jpg";
import { FaArrowUp } from "react-icons/fa6";

const SpecialOffer = () => {
  return (
    <div className="overflow-hidden relative flex justify-center items-center sm:justify-center sm:items-center lg:justify-between lg:items-start my-16 bg-white ">
      <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-20  sm:gap-20 lg:gap-4  w-full">
        {/* Left Image */}
        <div className="relative">
          <img
            src={SpecialOffer1}
            alt="Left"
            className="w-full sm:w-full lg:w-3/4 h-auto"
          />
        </div>

        {/* Right Image */}
        <div className="relative">
          <img
            src={SpecialOffer2}
            alt="Right"
            className="w-full h-auto mt-0 sm:mt-0 lg:mt-20"
          />
        </div>
      </div>

      {/* Offer Box */}
      <div className="absolute bg-white p-6 lg:p-10 px-6 lg:px-12 shadow-lg text-center top-1/2 left-1/2 transform -translate-x-1/2 lg:-translate-x-3/4 -translate-y-24 flex flex-col gap-2 sm:gap-1 lg:gap-4 w-[80%] sm:w-[80%] lg:w-auto ">
        <h2 className="text-2xl sm:text-2xl lg:text-4xl font-medium ">Special Offer!<br />This Week Only</h2>
        <p className="text-gray-600 mt-2">Reserved for special occasions</p>
        <Button className="mt-4  flex items-center justify-center gap-2 group" icon={<FaArrowUp className='rotate-45 group-hover:rotate-90 transition-all duration-300 ease-in-out' />}>
          Explore Collection 
         
        </Button>
      </div>
    </div>
  );
};

export default SpecialOffer;

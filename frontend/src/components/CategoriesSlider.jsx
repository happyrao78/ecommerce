import React, { useRef, useEffect, useContext } from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css"; // Core Swiper styles
import "swiper/css/navigation"; // Navigation module styles
import Title from './Title';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa6'; // Ensure proper import
import { motion } from 'framer-motion';
import heroslider from "../assets/ecommerce-islam/hero-slider.jpg";
import heroslider2 from "../assets/ecommerce-islam/hero-slider.jpg";
import categoryslider1 from "../assets/ecommerce-islam/category-slider1.jpg";
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';


const CategoriesSlider = () => {

    const {subCategoryData} = useContext(ShopContext)

    const categories = 
        Object.keys(subCategoryData).length > 0
            ? Object.entries(subCategoryData).flatMap(([category, subcategories]) => [
                // First add the main category
                { title: category.charAt(0).toUpperCase() + category.slice(1), image: categoryslider1},
                // Then add subcategories (indented or with a different style)
                
            ])
            : [{ name: "No Categories", link: "/category", useHashLink: false }]
       
    


    const prevRef = useRef(null);
    const nextRef = useRef(null);

    useEffect(() => {
        const swiperInstance = document.querySelector('.swiper').swiper;
        if (swiperInstance) {
            swiperInstance.params.navigation.prevEl = prevRef.current;
            swiperInstance.params.navigation.nextEl = nextRef.current;
            swiperInstance.navigation.init();
            swiperInstance.navigation.update();
        }
        console.log(categories)
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
        >
            <div className="w-full min-h-[50vh] py-12 sm:py-12 lg:py-16 flex flex-col items-center justify-center gap-8 lg:gap-4 relative lg:mt-4 overflow-hidden">
                <div className="w-full flex flex-wrap items-center justify-between ">
                    <div className="mb-4 flex flex-col gap-2 w-full lg:w-1/2 ">
                        <Title className="text-2xl md:text-3xl font-bold text-gray-800" text1={"Explore"} text2={"Collections"} />
                        <p className="text-gray-600 w-full lg:w-3/4 text-sm md:text-base">
                            Here are lots of interesting destinations to visit, but don’t be confused—they’re already grouped by category.
                        </p>
                    </div>
                    <div className="flex justify-start sm:justify-start lg:justify-end items-center gap-2 sm:gap-2 lg:gap-4 w-full lg:w-1/2">
                        <button
                            ref={prevRef}
                            className="prev-arrow bg-black text-white group hover:text-black hover:bg-white transition-transform duration-300 p-3 md:p-4 rounded-full ease-in-out teko border border-black text-xs md:text-xl tracking-wider"
                            aria-label="Previous"
                        >
                            <FaArrowLeft />
                        </button>
                        <button
                            ref={nextRef}
                            className="next-arrow bg-black text-white group hover:text-black hover:bg-white transition-transform duration-300 p-3 md:p-4 rounded-full ease-in-out teko border text-sm md:text-xl tracking-wider border-black"
                            aria-label="Next"
                        >
                            <FaArrowRight />
                        </button>
                    </div>
                </div>

                <Swiper
                    modules={[Navigation]}
                    loop={true}
                    navigation={{
                        prevEl: prevRef.current,
                        nextEl: nextRef.current,
                    }}
                    spaceBetween={10}
                    breakpoints={{
                        0: { slidesPerView: 2, spaceBetween: 10 },
                        640: { slidesPerView: 2, spaceBetween: 10 },
                        768: { slidesPerView: 2, spaceBetween: 20 },
                        1024: { slidesPerView: 5, spaceBetween: 10 },
                        1280: { slidesPerView: 5, spaceBetween: 20 },
                    }}
                    className="w-full "
                >
                    {categories.map((category, index) => (
                        <SwiperSlide key={index} className="flex justify-center ">
                            <div className="flex flex-col items-center ">
                                <div className="w-100 h-150 bg-gray-200 rounded-xl overflow-hidden shadow-md relative flex flex-col justify-center items-center">
                                    <img
                                        src={category.image}
                                        alt={category.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <Link to={category.title ? `/category/${category.title.toLowerCase()}` : '#'} className="group absolute bottom-5 text-md md:text-lg text-gray-700 px-8 py-2 bg-white rounded-full flex items-center hover:pr-10 gap-2 transition-all duration-300 ease-in-out hover:text-red-600 font-medium">
                                        {category.title}
                                        <FaArrowRight className=" hidden group-hover:block group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 opacity-0 translate-y-4 -rotate-45 group-hover:text-red-600 font-[500]" />
                                    </Link>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </motion.div>
    );
};

export default CategoriesSlider;
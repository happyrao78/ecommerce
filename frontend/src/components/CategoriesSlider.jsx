import React, { useRef, useEffect, useState, useContext } from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css"; // Core Swiper styles
import "swiper/css/navigation"; // Navigation module styles
import Title from './Title';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa6';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';
// import { backendUrl } from '../App';
import { toast } from 'react-toastify';
import { ShopContext } from '../context/shopContext';

const CategoriesSlider = ({ token }) => {
    const [categories, setCategories] = useState([]);
    const {backendUrl} = useContext(ShopContext)
    const [loading, setLoading] = useState(true);
    const [swiperInitialized, setSwiperInitialized] = useState(false);

    const prevRef = useRef(null);
    const nextRef = useRef(null);
    const swiperRef = useRef(null);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const response = await axios.get( backendUrl + "/api/category/getSubCategory",
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            if (response.data.success) {
                setCategories(response.data.categories);
            } else {
                toast.error('Failed to fetch categories');
            }
        } catch (error) {
            console.error(error);
            toast.error('Error occurred while fetching categories');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, [token]);

    // Initialize Swiper navigation only after Swiper is mounted
    useEffect(() => {
        if (swiperInitialized && swiperRef.current) {
            const swiperInstance = swiperRef.current;
            if (prevRef.current && nextRef.current) {
                swiperInstance.params.navigation.prevEl = prevRef.current;
                swiperInstance.params.navigation.nextEl = nextRef.current;
                swiperInstance.navigation.init();
                swiperInstance.navigation.update();
            }
        }
    }, [swiperInitialized]);

    // Handle Swiper initialization
    const handleSwiperInit = (swiper) => {
        swiperRef.current = swiper;
        setSwiperInitialized(true);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
        >
            <div className="w-full min-h-[50vh]  py-12 sm:py-12 lg:py-16 flex flex-col items-center justify-center gap-8 lg:gap-4 relative lg:mt-4 overflow-hidden">
                <div className="w-full flex flex-wrap items-center justify-between ">
                    <div className="mb-4 flex flex-col gap-2 w-full lg:w-1/2 ">
                        <Title className="text-2xl md:text-3xl font-bold text-gray-800" text1={"Explore"} text2={"Collections"} />
                        <p className="text-gray-600 w-full lg:w-3/4 text-sm md:text-base">
                            Here are lots of interesting destinations to visit, but don't be confused—they're already grouped by category.
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

                {loading ? (
                    <div className="flex justify-center items-center h-40 w-full">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black"></div>
                    </div>
                ) : (
                    <Swiper
                        modules={[Navigation]}
                        loop={true}
                        onInit={handleSwiperInit}
                        navigation={false} // Initially disable navigation until we set it up in useEffect
                        spaceBetween={10}
                        breakpoints={{
                            0: { slidesPerView: 4, spaceBetween: 10 },
                            640: { slidesPerView: 4, spaceBetween: 10 },
                            768: { slidesPerView: 4, spaceBetween: 20 },
                            1024: { slidesPerView: 6, spaceBetween: 10 },
                            1280: { slidesPerView: 6, spaceBetween: 20 },
                        }}
                        className="w-full"
                    >
                       {categories.map((category, index) => (
    <SwiperSlide key={index} className="flex justify-center">
        <div className="flex flex-col items-center">
            <div className="w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full overflow-hidden shadow-md relative flex justify-center items-center border-4 border-white">
                <img
                    src={category.image}
                    alt={category.category}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 hover:bg-black hover:bg-opacity-10 transition-all duration-300"></div>
            </div>
            <Link to={`/category/${category.category.toLowerCase()}`} className="mt-3 text-sm md:text-base text-center font-medium text-gray-800 hover:text-red-600 transition-all duration-300">
                {category.category}
            </Link>
        </div>
    </SwiperSlide>
))}
                    </Swiper>
                )}
            </div>
        </motion.div>
    );
};

export default CategoriesSlider;
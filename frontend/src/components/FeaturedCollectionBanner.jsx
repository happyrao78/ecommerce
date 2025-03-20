



// import React, { useContext, useEffect, useState } from 'react';
// import featuredCollection from '../assets/ecommerce-islam/featuredCollection1.jpg';
// import axios from 'axios';
// import { ShopContext } from '../context/ShopContext';

// const FeaturedCollectionSlider = () => {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [dynamicData, setDynamicData] = useState([]);
//   const { token, backendUrl } = useContext(ShopContext);

//   useEffect(() => {
//     const fetchDynamicUI = async () => {
//       try {
//         const response = await axios.get(`${backendUrl}/api/dynamic/all`, {
//           headers: { token }
//         });
//         if (response.data?.dynamics) {
//           setDynamicData(response.data.dynamics);
//         } else {
//           setDynamicData([]);
//         }
//       } catch (error) {
//         console.error('Error fetching dynamic UI:', error);
//         setDynamicData([]); // Ensure it's an array even on error
//       }
//     };
//     fetchDynamicUI();
//   }, [token, backendUrl]);

//   // Fallback collections in case dynamic data is empty
//   const fallbackCollections = [
//     {
//       id: 1,
//       title: "Capsule Collection",
//       discount: "UP TO 40% OFF",
//       image: featuredCollection,
//       link: "/collections/capsule"
//     },
//     {
//       id: 2,
//       title: "Summer Essentials",
//       image: featuredCollection,
//       link: "/collections/summer"
//     },
//     {
//       id: 3,
//       title: "Crossbody Bag",
//       discount: "UP TO 40% OFF",
//       image: featuredCollection,
//       link: "/collections/bags"
//     }
//   ];

//   // Use dynamic data if available, otherwise use fallback
//   const collections = Array.isArray(dynamicData) && dynamicData.length > 0
//     ? dynamicData.map((item) => ({
//         id: item._id || Math.random(), // Ensure unique key if _id is missing
//         title: item.title || "Untitled Collection",
//         subtitle: item.subtitle || "",
//         image: item.image?.[0] || featuredCollection,
//         link: item.redirectLink || "/",
//         createdAt: item.createdAt || new Date().toISOString()
//       }))
//     : fallbackCollections;

//   const nextSlide = () => {
//     if (collections.length > 0) {
//       setCurrentIndex((prevIndex) => (prevIndex + 1) % collections.length);
//     }
//   };

//   const prevSlide = () => {
//     if (collections.length > 0) {
//       setCurrentIndex((prevIndex) =>
//         prevIndex === 0 ? collections.length - 1 : prevIndex - 1
//       );
//     }
//   };

//   // Ensure collections is not empty before accessing indices
//   const visibleCollections =
//     collections.length >= 3
//       ? [
//           collections[currentIndex],
//           collections[(currentIndex + 1) % collections.length],
//           collections[(currentIndex + 2) % collections.length]
//         ]
//       : collections; // If less than 3, just show available ones

//   useEffect(() => {
//     console.log(dynamicData, collections);
//   }, [dynamicData, collections]);

//   return (
//     <div className="w-full py-8 sm:py-8 lg:py-10 relative overflow-hidden mb-8 sm:mb-8 lg:mb-0">
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//         {visibleCollections.length > 0 ? (
//           visibleCollections.map((collection) => (
//             <div key={collection.id} className="relative overflow-hidden rounded-lg group">
//               <div className="relative h-[480px] bg-gray-100 rounded-lg overflow-hidden">
//                 <img 
//                   src={collection.image} 
//                   alt={collection.title}
//                   className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
//                 />
                
//                 <div className="absolute inset-0 p-8 flex flex-col justify-between">
//                   <div>
//                     <h3 className="text-3xl font-semibold text-gray-900">{collection.title}</h3>
//                     {collection.subtitle && (
//                       <p className="text-gray-600 text-sm mt-2">{collection.subtitle}</p>
//                     )}
//                   </div>
                  
//                   <a 
//                     href={collection.link}
//                     className="inline-block mt-4 border-b-2 border-gray-900 pb-1 font-medium text-sm w-max hover:border-gray-500 transition-colors"
//                   >
//                     Shop Collection
//                   </a>
//                 </div>
//               </div>
//             </div>
//           ))
//         ) : (
//           <p className="text-center text-gray-500">No collections available</p>
//         )}
//       </div>

//       {/* Navigation Buttons */}
//       {collections.length > 1 && (
//         <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
//           <button onClick={prevSlide} className="p-2 bg-gray-800 text-white rounded-full">
//             ❮
//           </button>
//         </div>
//       )}
//       {collections.length > 1 && (
//         <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
//           <button onClick={nextSlide} className="p-2 bg-gray-800 text-white rounded-full">
//             ❯
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default FeaturedCollectionSlider;


import React, { useContext, useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import featuredCollection from '../assets/ecommerce-islam/featuredCollection1.jpg';
import axios from 'axios';
import { ShopContext } from '../context/ShopContext';

const FeaturedCollectionSlider = () => {
  const [dynamicData, setDynamicData] = useState([]);
  const { token, backendUrl } = useContext(ShopContext);

  useEffect(() => {
    const fetchDynamicUI = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/dynamic/all`, {
          headers: { token }
        });
        setDynamicData(response.data?.dynamics || []);
      } catch (error) {
        console.error('Error fetching dynamic UI:', error);
        setDynamicData([]);
      }
    };
    fetchDynamicUI();
  }, [token, backendUrl]);

  // Fallback collections in case dynamic data is empty
  const fallbackCollections = [
    { id: 1, title: "Capsule Collection", discount: "UP TO 40% OFF", image: featuredCollection, link: "/collections/capsule" },
    { id: 2, title: "Summer Essentials", image: featuredCollection, link: "/collections/summer" },
    { id: 3, title: "Crossbody Bag", discount: "UP TO 40% OFF", image: featuredCollection, link: "/collections/bags" },
    { id: 4, title: "Crossbody Bag", discount: "UP TO 40% OFF", image: featuredCollection, link: "/collections/bags" },
    { id: 5, title: "Crossbody Bag", discount: "UP TO 40% OFF", image: featuredCollection, link: "/collections/bags" },
    { id: 6, title: "Crossbody Bag", discount: "UP TO 40% OFF", image: featuredCollection, link: "/collections/bags" },
  ];

  // Use dynamic data if available, otherwise use fallback
  // const collections = dynamicData.length > 0
  //   ? dynamicData.map((item) => ({
  //       id: item._id || Math.random(),
  //       title: item.title || "Untitled Collection",
  //       subtitle: item.subtitle || "",
  //       image: item.image?.[0] || featuredCollection,
  //       link: item.redirectLink || "/",
  //     }))
  //   : fallbackCollections;

  const collections =  fallbackCollections;

  return (
    <div className="w-full py-8 lg:py-10 relative overflow-hidden">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        // navigation
        // pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        loop
        className="w-full"
      >
        {collections.map((collection) => (
          <SwiperSlide key={collection.id}>
            <div className="relative overflow-hidden rounded-lg group">
              <div className="relative h-[480px] bg-gray-100 rounded-lg overflow-hidden">
                <img 
                  src={collection.image} 
                  alt={collection.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 p-8 flex flex-col justify-between">
                  <h3 className="text-3xl font-semibold text-gray-900">{collection.title}</h3>
                  {collection.subtitle && (
                    <p className="text-gray-600 text-sm mt-2">{collection.subtitle}</p>
                  )}
                  <a 
                    href={collection.link}
                    className="inline-block mt-4 border-b-2 border-gray-900 pb-1 font-medium text-sm hover:border-gray-500 transition-colors"
                  >
                    Shop Collection
                  </a>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default FeaturedCollectionSlider;


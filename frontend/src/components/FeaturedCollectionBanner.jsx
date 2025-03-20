// // import React, { useContext, useEffect, useState } from 'react';
// // import featuredCollection from '../assets/ecommerce-islam/featuredCollection1.jpg';
// // import axios from 'axios';
// // import { ShopContext } from '../context/ShopContext';

// // const FeaturedCollectionSlider = () => {
// //   const [currentIndex, setCurrentIndex] = useState(0);
// //   const[dynamicData,setDynamicData]=useState({})
// //   const {token, backendUrl} = useContext(ShopContext)

// //   useEffect(() => {
// //     const fetchDynamicUI = async () => {
// //         try {
// //             const response = await axios.get(`${backendUrl}/api/dynamic/all`, {
// //                 headers: { token }
// //             });
// //             setDynamicData(response.data.dynamics)
// //         } catch (error) {
// //             console.error('Error fetching user details:', error);
// //         } finally {
            
// //         }
// //     }
// //     fetchDynamicUI()
// // }, [token, backendUrl])


// // useEffect(()=>{
// //   console.log(dynamicData)
// // },[dynamicData])
  
// //   const collections = [
// //     {
// //       id: 1,
// //       title: "Capsule Collection",
// //       discount: "UP TO 40% OFF",
// //       image: featuredCollection,
// //       link: "/collections/capsule"
// //     },
// //     {
// //       id: 2,
// //       title: "Summer Essentials",
// //       image: featuredCollection,
// //       link: "/collections/summer"
// //     },
// //     {
// //       id: 3,
// //       title: "Crossbody Bag",
// //       discount: "UP TO 40% OFF",
// //       image: featuredCollection,
// //       link: "/collections/bags"
// //     }
// //   ];

// //   const nextSlide = () => {
// //     setCurrentIndex((prevIndex) => 
// //       prevIndex === collections.length - 1 ? 0 : prevIndex + 1
// //     );
// //   };

// //   const prevSlide = () => {
// //     setCurrentIndex((prevIndex) => 
// //       prevIndex === 0 ? collections.length - 1 : prevIndex - 1
// //     );
// //   };

// //   const visibleCollections = [
// //     collections[currentIndex],
// //     collections[(currentIndex + 1) % collections.length],
// //     collections[(currentIndex + 2) % collections.length]
// //   ];

// //   return (
// //     <div className="w-full py-8 sm:py-8 lg:py-10  relative overflow-hidden mb-8 sm:mb-8 lg:mb-0">
// //       <div className="flex justify-between items-center mb-8">
// //         {/* <h2 className="text-2xl font-bold">Featured Collections</h2> */}
// //         {/* <div className="flex gap-4">
// //           <button 
// //             onClick={prevSlide}
// //             className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
// //           >
// //             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
// //               <path d="M15 18l-6-6 6-6"/>
// //             </svg>
// //           </button>
// //           <button 
// //             onClick={nextSlide}
// //             className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
// //           >
// //             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
// //               <path d="M9 18l6-6-6-6"/>
// //             </svg>
// //           </button>
// //         </div> */}
// //       </div>

// //       <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
// //         {visibleCollections.map((collection) => (
// //           <div key={collection.id} className="relative overflow-hidden rounded-lg group">
// //             <div className="relative h-[480px] bg-gray-100 rounded-lg overflow-hidden">
// //               <img 
// //                 src={collection.image} 
// //                 alt={collection.title}
// //                 className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
// //               />
              
// //               <div className="absolute inset-0 p-8 flex flex-col justify-between">
// //                 <div>
// //                   <h3 className="text-3xl font-semibold text-gray-900">{collection.title}</h3>
// //                   {collection.discount && (
// //                     <p className="text-red-500 font-medium text-sm mt-2">{collection.discount}</p>
// //                   )}
// //                 </div>
                
// //                 <a 
// //                   href={collection.link}
// //                   className="inline-block mt-4 border-b-2 border-gray-900 pb-1 font-medium text-sm w-max hover:border-gray-500 transition-colors"
// //                 >
// //                   Shop Collection
// //                 </a>
// //               </div>
// //             </div>
// //           </div>
// //         ))}
// //       </div>
      
// //       {/* Cart icon */}
// //       {/* <div className="fixed bottom-8 right-8 z-10">
// //         <button className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center shadow-lg">
// //           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
// //             <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
// //             <line x1="3" y1="6" x2="21" y2="6"></line>
// //             <path d="M16 10a4 4 0 0 1-8 0"></path>
// //           </svg>
// //           <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">2</span>
// //         </button>
// //       </div> */}
      
// //       {/* Home button */}
// //       {/* <div className="fixed bottom-8 right-28 z-10">
// //         <button className="w-16 h-16 bg-white text-black border border-gray-200 rounded-full flex items-center justify-center shadow-lg">
// //           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
// //             <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
// //             <polyline points="9 22 9 12 15 12 15 22"></polyline>
// //           </svg>
// //         </button>
// //       </div> */}
// //     </div>
// //   );
// // };

// // export default FeaturedCollectionSlider;



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
//         setDynamicData(response.data.dynamics);
//       } catch (error) {
//         console.error('Error fetching dynamic UI:', error);
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
//   const collections = dynamicData?.length !== 0 
//     ? dynamicData?.map((item, index) => ({
//         id: item._id,
//         title: item.title,
//         subtitle: item.subtitle,
//         image: item.image[0] || featuredCollection,
//         link: item.redirectLink || "/",
//         createdAt: item.createdAt
//       }))
//     : fallbackCollections;

//   const nextSlide = () => {
//     setCurrentIndex((prevIndex) => 
//       prevIndex === collections.length - 1 ? 0 : prevIndex + 1
//     );
//   };

//   const prevSlide = () => {
//     setCurrentIndex((prevIndex) => 
//       prevIndex === 0 ? collections.length - 1 : prevIndex - 1
//     );
//   };

//   const visibleCollections = [
//     collections[currentIndex],
//     collections[(currentIndex + 1) % collections.length],
//     collections[(currentIndex + 2) % collections.length]
//   ];

//   useEffect(()=>{
//     console.log(dynamicData,collections)
//   },[dynamicData,collections])

//   return (
//     <div className="w-full py-8 sm:py-8 lg:py-10 relative overflow-hidden mb-8 sm:mb-8 lg:mb-0">
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//         {visibleCollections.map((collection) => (
//           <div key={collection.id} className="relative overflow-hidden rounded-lg group">
//             <div className="relative h-[480px] bg-gray-100 rounded-lg overflow-hidden">
//               <img 
//                 src={collection.image} 
//                 alt={collection.title}
//                 className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
//               />
              
//               <div className="absolute inset-0 p-8 flex flex-col justify-between">
//                 <div>
//                   <h3 className="text-3xl font-semibold text-gray-900">{collection.title}</h3>
//                   {collection.subtitle && (
//                     <p className="text-gray-600 text-sm mt-2">{collection.subtitle}</p>
//                   )}
//                 </div>
                
//                 <a 
//                   href={collection.link}
//                   className="inline-block mt-4 border-b-2 border-gray-900 pb-1 font-medium text-sm w-max hover:border-gray-500 transition-colors"
//                 >
//                   Shop Collection
//                 </a>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default FeaturedCollectionSlider;



import React, { useContext, useEffect, useState } from 'react';
import featuredCollection from '../assets/ecommerce-islam/featuredCollection1.jpg';
import axios from 'axios';
import { ShopContext } from '../context/ShopContext';

const FeaturedCollectionSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dynamicData, setDynamicData] = useState([]);
  const { token, backendUrl } = useContext(ShopContext);

  useEffect(() => {
    const fetchDynamicUI = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/dynamic/all`, {
          headers: { token }
        });
        if (response.data?.dynamics) {
          setDynamicData(response.data.dynamics);
        } else {
          setDynamicData([]);
        }
      } catch (error) {
        console.error('Error fetching dynamic UI:', error);
        setDynamicData([]); // Ensure it's an array even on error
      }
    };
    fetchDynamicUI();
  }, [token, backendUrl]);

  // Fallback collections in case dynamic data is empty
  const fallbackCollections = [
    {
      id: 1,
      title: "Capsule Collection",
      discount: "UP TO 40% OFF",
      image: featuredCollection,
      link: "/collections/capsule"
    },
    {
      id: 2,
      title: "Summer Essentials",
      image: featuredCollection,
      link: "/collections/summer"
    },
    {
      id: 3,
      title: "Crossbody Bag",
      discount: "UP TO 40% OFF",
      image: featuredCollection,
      link: "/collections/bags"
    }
  ];

  // Use dynamic data if available, otherwise use fallback
  const collections = Array.isArray(dynamicData) && dynamicData.length > 0
    ? dynamicData.map((item) => ({
        id: item._id || Math.random(), // Ensure unique key if _id is missing
        title: item.title || "Untitled Collection",
        subtitle: item.subtitle || "",
        image: item.image?.[0] || featuredCollection,
        link: item.redirectLink || "/",
        createdAt: item.createdAt || new Date().toISOString()
      }))
    : fallbackCollections;

  const nextSlide = () => {
    if (collections.length > 0) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % collections.length);
    }
  };

  const prevSlide = () => {
    if (collections.length > 0) {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? collections.length - 1 : prevIndex - 1
      );
    }
  };

  // Ensure collections is not empty before accessing indices
  const visibleCollections =
    collections.length >= 3
      ? [
          collections[currentIndex],
          collections[(currentIndex + 1) % collections.length],
          collections[(currentIndex + 2) % collections.length]
        ]
      : collections; // If less than 3, just show available ones

  useEffect(() => {
    console.log(dynamicData, collections);
  }, [dynamicData, collections]);

  return (
    <div className="w-full py-8 sm:py-8 lg:py-10 relative overflow-hidden mb-8 sm:mb-8 lg:mb-0">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {visibleCollections.length > 0 ? (
          visibleCollections.map((collection) => (
            <div key={collection.id} className="relative overflow-hidden rounded-lg group">
              <div className="relative h-[480px] bg-gray-100 rounded-lg overflow-hidden">
                <img 
                  src={collection.image} 
                  alt={collection.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                <div className="absolute inset-0 p-8 flex flex-col justify-between">
                  <div>
                    <h3 className="text-3xl font-semibold text-gray-900">{collection.title}</h3>
                    {collection.subtitle && (
                      <p className="text-gray-600 text-sm mt-2">{collection.subtitle}</p>
                    )}
                  </div>
                  
                  <a 
                    href={collection.link}
                    className="inline-block mt-4 border-b-2 border-gray-900 pb-1 font-medium text-sm w-max hover:border-gray-500 transition-colors"
                  >
                    Shop Collection
                  </a>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No collections available</p>
        )}
      </div>

      {/* Navigation Buttons */}
      {collections.length > 1 && (
        <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
          <button onClick={prevSlide} className="p-2 bg-gray-800 text-white rounded-full">
            ❮
          </button>
        </div>
      )}
      {collections.length > 1 && (
        <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
          <button onClick={nextSlide} className="p-2 bg-gray-800 text-white rounded-full">
            ❯
          </button>
        </div>
      )}
    </div>
  );
};

export default FeaturedCollectionSlider;

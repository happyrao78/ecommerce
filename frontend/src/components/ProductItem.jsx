

// import React, { useContext, useState, useEffect } from "react";
// import { ShopContext } from "../context/ShopContext";
// import { Link } from "react-router-dom";
// import Button from "./Button";
// import { UiContext } from "../context/UiContext";

// const ProductItem = ({ id, image, name, price, originalPrice, colors = [] }) => {
//   const { currency,addToCart,addToWishlist, removeFromWishlist ,navigate,isInWishlist } = useContext(ShopContext);
//   const [isLoading, setIsLoading] = useState(true);
//   const { openSlideCart } = useContext(UiContext);
 

//   const calculateDiscount = (originalPrice, price) => {
//     if (originalPrice > 0 && price < originalPrice) {
//       return Math.round(((originalPrice - price) / originalPrice) * 100);
//     }
//     return 0;
//   };

//   const discountPercentage = calculateDiscount(originalPrice, price);

//   // useEffect(() => {
//   //   const timer = setTimeout(() => setIsLoading(false), 1000);
//   //   return () => clearTimeout(timer);
//   // }, []);

//   // if (isLoading) {
//   //   return (
//   //     <div className="p-2 h-[400px] animate-pulse flex flex-col">
//   //       <div className="h-[280px] w-full bg-gray-200 mb-3"></div>
//   //       <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
//   //       <div className="h-4 bg-gray-200 rounded w-1/2"></div>
//   //     </div>
//   //   );
//   // }

//   return (
//     <div className="mb-4">
      
//         <div className="relative group">
//           {/* Image Section */}
          
//           <div className="overflow-hidden h-[200px] sm:h-[100px] lg:h-[400px] relative rounded-lg bg-black flex flex-col justify-center items-center">
//             {/* First Image (default) */}
//             <Link to={`/product/${id}`} className="text-gray-800 cursor-pointer block">
//             <img
//               className="absolute inset-0 h-full w-full object-cover transition-transform ease-in-out lg:group-hover:scale-105 lg:group-hover:opacity-0"
//               src={image[0]}
//               alt={name}
//               loading="lazy"
//             />

//             {/* Second Image (shows on hover) */}
//             <img
//               className="absolute inset-0 h-full w-full object-cover opacity-0 transition-all duration-500 ease-in-out lg:group-hover:opacity-100 lg:group-hover:scale-105"
//               src={image[1]}
//               alt={`${name} alternate view`}
//               loading="lazy"
//             />
//             </Link>

//             <button className="absolute bottom-12 sm:bottom-12  lg:bottom-4 opacity-100 sm:opacity-100  lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-300 ease-in-out bg-white text-black px-4 py-1 lg:px-8 lg:py-2 rounded-full shadow-sm font-medium  translate-y-10 lg:group-hover:translate-y-0 hover:bg-black hover:text-white text-xs sm:text-sm lg:text-base uppercase" onClick={() => {
//               // await addToCart(id); // Wait for the addToCart function to complete
//               // openSlideCart() // Navigate to the cart page
//               navigate(`/product/${id}`)
//             }
//               } >
//               Add to Cart
//             </button>
//           </div>
          

//           {/* Discount Badge */}
//           {discountPercentage > 0 && (
//             <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
//               -{discountPercentage}%
//             </div>
//           )}

          
//           <div className="absolute top-3 right-3 flex flex-col space-y-3 opacity-0 lg:group-hover:opacity-100 translate-y-10 lg:group-hover:translate-y-0 transition-all duration-300 ease-in-out">
//             <button className="bg-white p-2 rounded-full shadow-sm  hover:bg-black hover:text-white" 
//             onClick={() => {
//               if (isInWishlist(id)) {
//                 removeFromWishlist(id);
//               } else {
//                 addToWishlist(id);
//                 navigate("/wishlist");
//               }
//             }}
//           >

//               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                 <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
//               </svg>
//             </button>
//             <Link className="bg-white p-2 rounded-full shadow-sm hover:bg-black hover:text-white" to={`/product/${id}`}>
//               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                 <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"></path>
//               </svg>
//             </Link>
//             <button className="bg-white p-2 rounded-full shadow-sm hover:bg-black hover:text-white" 
//             onClick={
//               () => {
//                 navigate(`/product/${id}`)// Navigate to the cart page
//             }} >
//               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                 <circle cx="12" cy="12" r="10"></circle>
//                 <line x1="12" y1="8" x2="12" y2="16"></line>
//                 <line x1="8" y1="12" x2="16" y2="12"></line>
//               </svg>
//             </button>


//           </div>


//         </div>

//         {/* Product Details Section */}
//         <div className="mt-4">
//           <h3 className="text-base font-medium text-gray-800">{name}</h3>

//           <div className="flex items-center mt-1">
//             <p className="text-[12px] sm:text-[10px] lg:text-sm font-semibold text-gray-800">
//               {currency}{price.toFixed(2)}
//             </p>
//             {originalPrice > 0 && (
//               <p className="text-[12px] sm:text-[10px] lg:text-sm text-gray-500 line-through ml-2">
//                 {currency}{originalPrice.toFixed(2)}
//               </p>
//             )}
//           </div>

//           {/* Color Options */}
//           {colors.length > 0 && (
//             <div className="flex mt-2 gap-1">
//               {colors.map((color, index) => (
//                 <div
//                   key={index}
//                   className="w-6 h-6 rounded-full border border-gray-300"
//                   style={{ backgroundColor: color }}
//                 />
//               ))}
//             </div>
//           )}
//         </div>
     


//     </div>
//   );
// };

// export default ProductItem;



import React, { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";
import Button from "./Button";
import { UiContext } from "../context/UiContext";
import axios from "axios";
import { toast } from "react-toastify";

const ProductItem = ({ id, image, name, price, originalPrice, colors = [], attributes = [] }) => {
  const { currency, addToCart, addToWishlist, removeFromWishlist, navigate, isInWishlist, token, backendUrl } = useContext(ShopContext);
  const [isLoading, setIsLoading] = useState(true);
  const { openSlideCart } = useContext(UiContext);
  const [attributesList, setAttributesList] = useState([]);
  const [processedAttributes, setProcessedAttributes] = useState([]);
  const [selectedAttributeValues, setSelectedAttributeValues] = useState({});

  // Fetch all attributes
  const fetchAttributes = async () => {
    if (!token) return;
    
    try {
      const response = await axios.get(`${backendUrl}/api/attribute/list`, {
        headers: { token }
      });
      setAttributesList(response.data.attributes);
    } catch (err) {
      console.error('Error fetching attributes:', err);
      toast.error('Failed to fetch attributes');
    }
  };

  useEffect(() => {
    fetchAttributes();
  }, [token]);

  // Process attributes when attribute list is available
  useEffect(() => {
    if (attributes && attributes.length > 0 && attributesList.length > 0) {
      const processed = attributes.map(attr => {
        const foundAttribute = attributesList.find(a => a._id === attr.attributeId);
        
        if (foundAttribute) {
          return {
            _id: attr.attributeId,
            name: foundAttribute.attributeName,
            values: attr.selectedValues,
            displayType: foundAttribute.attributeName.toLowerCase() === 'colour' || 
                        foundAttribute.attributeName.toLowerCase() === 'color' ? 'color' : 
                        foundAttribute.attributeName.toLowerCase() === 'size' ? 'size' : 'select'
          };
        }
        return null;
      }).filter(Boolean); // Remove null entries
      
      setProcessedAttributes(processed);
    }
  }, [attributes, attributesList]);

  // Initialize selected attribute values
  useEffect(() => {
    if (processedAttributes.length > 0) {
      const initialValues = {};
      processedAttributes.forEach(attr => {
        if (attr.values && attr.values.length > 0) {
          initialValues[attr.name] = attr.values[0];
        }
      });
      setSelectedAttributeValues(initialValues);
    }
  }, [processedAttributes]);

  const calculateDiscount = (originalPrice, price) => {
    if (originalPrice > 0 && price < originalPrice) {
      return Math.round(((originalPrice - price) / originalPrice) * 100);
    }
    return 0;
  };

  const discountPercentage = calculateDiscount(originalPrice, price);

  // Function to handle attribute selection
  const handleAttributeSelection = (attributeId, value, attributeName) => {
    setSelectedAttributeValues(prev => ({
      ...prev,
      [attributeName]: value
    }));
  };

  // Helper function to get color class
  const getColorClass = (colorName) => {
    const colorMap = {
      'red': 'bg-red-500',
      'blue': 'bg-blue-500',
      'green': 'bg-green-500',
      'yellow': 'bg-yellow-500',
      'black': 'bg-black',
      'white': 'bg-white',
      'purple': 'bg-purple-500',
      'orange': 'bg-orange-500',
      'pink': 'bg-pink-500',
      'gray': 'bg-gray-500',
      'brown': 'bg-yellow-800',
    };
    
    return colorMap[colorName.toLowerCase()] || 'bg-gray-200';
  };

  return (
    <div className="mb-4">
      <div className="relative group">
        {/* Image Section */}
        <div className="overflow-hidden h-[200px] sm:h-[100px] lg:h-[400px] relative rounded-lg bg-black flex flex-col justify-center items-center">
          {/* First Image (default) */}
          <Link to={`/product/${id}`} className="text-gray-800 cursor-pointer block">
            <img
              className="absolute inset-0 h-full w-full object-cover transition-transform ease-in-out lg:group-hover:scale-105 lg:group-hover:opacity-0"
              src={image[0]}
              alt={name}
              loading="lazy"
            />

            {/* Second Image (shows on hover) */}
            <img
              className="absolute inset-0 h-full w-full object-cover opacity-0 transition-all duration-500 ease-in-out lg:group-hover:opacity-100 lg:group-hover:scale-105"
              src={image[1]}
              alt={`${name} alternate view`}
              loading="lazy"
            />
          </Link>

          {/* Quick Add To Cart Button */}
          <button className="absolute bottom-12 sm:bottom-12 lg:bottom-4 opacity-100 sm:opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-300 ease-in-out bg-white text-black px-4 py-1 lg:px-8 lg:py-2 rounded-full shadow-sm font-medium translate-y-10 lg:group-hover:translate-y-0 hover:bg-black hover:text-white text-xs sm:text-sm lg:text-base uppercase" 
            onClick={() => {
              addToCart(id,selectedAttributeValues)
              openSlideCart()
            }}
          >
            Add to Cart
          </button>
        </div>

        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            -{discountPercentage}%
          </div>
        )}

        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex flex-col space-y-3 opacity-0 lg:group-hover:opacity-100 translate-y-10 lg:group-hover:translate-y-0 transition-all duration-300 ease-in-out">
          <button className="bg-white p-2 rounded-full shadow-sm hover:bg-black hover:text-white" 
            onClick={() => {
              if (isInWishlist(id)) {
                removeFromWishlist(id,selectedAttributeValues);
              } else {
                addToWishlist(id,selectedAttributeValues);
                navigate("/wishlist");
              }
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
          <Link className="bg-white p-2 rounded-full shadow-sm hover:bg-black hover:text-white" to={`/product/${id}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"></path>
            </svg>
          </Link>
          <button className="bg-white p-2 rounded-full shadow-sm hover:bg-black hover:text-white" 
            onClick={() => {
              navigate(`/product/${id}`)
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="16"></line>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
          </button>
        </div>
      </div>

      {/* Product Details Section */}
      <div className="mt-4">
        <h3 className="text-base font-medium text-gray-800">{name}</h3>

        <div className="flex items-center mt-1">
          <p className="text-[12px] sm:text-[10px] lg:text-sm font-semibold text-gray-800">
            {currency}{price.toFixed(2)}
          </p>
          {originalPrice > 0 && (
            <p className="text-[12px] sm:text-[10px] lg:text-sm text-gray-500 line-through ml-2">
              {currency}{originalPrice.toFixed(2)}
            </p>
          )}
        </div>

        {/* Display Attributes (in compact form) */}
        {processedAttributes.length > 0 && (
          <div className="mt-2 flex gap-4">
            {processedAttributes.map((attribute, index) => (
              <div key={index} className="mb-2">
                <p className="text-xs font-medium text-gray-500 capitalize">{attribute.name}:</p>
                {attribute.displayType === 'color' ? (
                  <div className="flex mt-1 gap-1">
                    {attribute.values.map((value, valueIndex) => (
                      <div
                        key={valueIndex}
                        className={`w-4 h-4 rounded-full border border-gray-300 ${
                          selectedAttributeValues[attribute.name] === value ? 'ring-1 ring-black' : ''
                        } ${getColorClass(value)}`}
                        onClick={() => handleAttributeSelection(attribute._id, value, attribute.name)}
                        title={value}
                      />
                    ))}
                  </div>
                ) : attribute.displayType === 'size' ? (
                  <div className="flex mt-1 gap-1">
                    {attribute.values.map((value, valueIndex) => (
                      <div
                        key={valueIndex}
                        className={`text-[10px] px-2 py-0.5 border rounded-full border-gray-300 ${
                          selectedAttributeValues[attribute.name] === value ? 'bg-black text-white' : 'bg-gray-100'
                        }`}
                        onClick={() => handleAttributeSelection(attribute._id, value, attribute.name)}
                      >
                        {value}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap mt-1 gap-1">
                    {attribute.values.map((value, valueIndex) => (
                      <div
                        key={valueIndex}
                        className={`text-[10px] px-2 py-0.5 rounded-full border ${
                          selectedAttributeValues[attribute.name] === value ? 'bg-black text-white' : 'bg-gray-100'
                        }`}
                        onClick={() => handleAttributeSelection(attribute._id, value, attribute.name)}
                      >
                        {value}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* If no processed attributes but has colors prop, show color options */}
        {processedAttributes.length === 0 && colors.length > 0 && (
          <div className="flex mt-2 gap-1">
            {colors.map((color, index) => (
              <div
                key={index}
                className="w-6 h-6 rounded-full border border-gray-300"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductItem;
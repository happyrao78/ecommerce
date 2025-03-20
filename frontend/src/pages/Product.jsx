// import React, { useContext, useEffect, useState } from 'react'
// import { ShopContext } from '../context/ShopContext';
// import { useParams } from 'react-router-dom';
// import { assets } from '../assets/frontend_assets/assets';
// import RelatedProducts from '../components/RelatedProducts';
// import Button from '../components/Button';
// import ProductReviews from '../components/Review';
// import Title from '../components/Title';
// import { toast } from 'react-toastify';
// import axios from 'axios';
// import { BsFillLightningChargeFill, BsLightningCharge } from "react-icons/bs";
// import { MdOutlineRemoveRedEye } from "react-icons/md";
// import { Truck, HelpCircle, Share2, Clock, RotateCcw, MapPin } from 'lucide-react';

// const Product = () => {

//   const { productId } = useParams();
//   const { products, currency, addToCart, navigate, token, backendUrl ,updateQuantity,cartItems} = useContext(ShopContext);
//   const [reviews, setReviews] = useState([]);
//   const [productData, setProductData] = useState(false);
//   const [image, setImage] = useState('');
//   const [size, setSize] = useState('')
//   const [color, setColor] = useState('')
//   const [quantity, setQuantity] = useState(1)
//   const [activeTab, setActiveTab] = useState("description");


//   useEffect(() => {
//     if (token) {
//       fetchReviews();
//     }
//   }, [productId, token]);

//   const fetchReviews = async () => {
//     try {
//       const response = await axios.get(`${backendUrl}/api/review/${productId}/get-review`,
//         { headers: { token } }
//       );
//       const fetchedReviews = response.data;
//       setReviews(fetchedReviews);
//       // console.log(fetchedReviews);

//       // const counts = Array(5).fill(0);
//       // fetchedReviews.forEach((review) => {
//       //     if (review.rating >= 1 && review.rating <= 5) {
//       //         counts[review.rating - 1] += 1;
//       //     }
//       // });
//       // setRatingCounts(counts);
//     } catch (err) {
//       console.error('Error fetching reviews:', err);
//       toast.error('Failed to fetch reviews');
//     }
//   };

//   const calculateAverageRating = () => {
//     const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
//     return reviews.length ? totalRating / reviews.length : 0;
//   };

//   const fetchProductData = async () => {
//     products.map((item) => {
//       if (item._id === productId) {
//         setProductData(item);
//         setImage(item.image[0])
//         return null;
//       }
//     })
//   }
//   const calculateDiscount = () => {
//     if (productData && productData.originalPrice && productData.price) {
//       const discount = ((productData.originalPrice - productData.price) / productData.originalPrice) * 100;
//       return Math.round(discount); // Round to nearest integer
//     }
//     return 0;
//   };

//   const discount = calculateDiscount();

//   useEffect(() => {
//     fetchProductData();
//   }, [productId, products])


//   const [currentCartData, setCurrentCartData] = useState(null);

//   useEffect(() => {
//     // Check if the productId exists as a key in cartItems
//     if (productId && cartItems.hasOwnProperty(productId)) {
//       // Set current cart data with the product ID and its quantity
//       setCurrentCartData({ 
//         productId, 
//         quantity: cartItems[productId] 
//       });
//     } else {
//       // Reset current cart data if product is not in cart
//       setCurrentCartData({ productId, quantity: 0 });
//     }
  
//     console.log(currentCartData);
//   }, [productId, cartItems]);

//   useEffect(() => {
//     console.log(cartItems);
//   }, [])


//   const colors = [

//     "White",
//     "Red",
//     "Blue",
//     "Green",
//     "Yellow",
//   ]



//   return productData ? (
//     <div className=' pt-10 transition-opacity ease-in duration-500 opacity-100 lg:mt-4 lg:pt-4'>
//       {/* Product Data*/}
//       <div className='flex gap-12 sm:gap-12 flex-col sm:flex-row'>
//         {/* Product Images */}
//         <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row '>
//           <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-normal sm:justify-normal sm:w-[18.7%] w-full gap-x-2 sm:gap-x-2 lg:gap-0'>
//             {
//               productData.image.map((item, index) => (
//                 <img src={item} alt="" key={index}
//                   className='w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer border  rounded-md' onClick={() => setImage(item)} />
//               ))
//             }
//           </div>
//           <div className='w-full sm:w-[80%] border-red-500'>
//             <img src={image} alt="" className='w-full h-auto border rounded-md sm:h-full object-cover object-center lg:min-h-[500px] lg:max-h-[600px]' />
//           </div>
//         </div>
//         {/* Product Information */}
//         <div className='flex flex-col items-start  rounded-md gap-2 sm:gap-2 lg:gap-4 lg:w-1/2 lg:min-h-[500px] lg:max-h-[600px] overflow-y-auto'>
//           <p className='text-[12px] font-medium flex items-center uppercase text-gray-400'>{productData.category} {productData.subCategory}</p>
//           <h1 className='font-medium text-2xl sm:text-2xl lg:text-4xl  capitalize text-black'>{productData.name}</h1>
//           <div className='flex items-center gap-1'>
//             {reviews.length > 0 && (
//               <div className="flex items-center gap-2 justify-start w-full h-full">

//                 <div className="flex justify-start">
//                   {[1, 2, 3, 4, 5].map((rate) => (
//                     <span
//                       key={rate}
//                       className={`text-2xl ${calculateAverageRating() >= rate ? 'text-yellow-500' : 'text-gray-400'}`}
//                     >
//                       ★
//                     </span>
//                   ))}
//                   <span className='text-xs flex justify-center items-center text-gray-500 px-2'>({calculateAverageRating().toFixed(1)})</span>
//                 </div>

//                 <span className='flex justify-normal gap-1 items-center'><BsFillLightningChargeFill className='text-md animate-pulse text-red-500' />
//                   <p className='text-sm'>{Math.floor(Math.random() * 10) + 50} sold in last 24 hours</p>
//                 </span>

//               </div>
//             )}
//           </div>
//           <div className='flex gap-x-2 items-center'>
//             <p className='text-2xl font-semibold flex items-center'>{currency}{productData.price}</p>
//             <p className='text-md text-gray-500 line-through flex items-center'>{currency}{productData.originalPrice}</p>
//             <h5 className='ml-2 bg-red-500 text-white text-xs font-bold  flex items-center py-1 px-2 rounded-full'>-{discount}%</h5>
//           </div>
//           <p className=' text-gray-700 md:w-4/5 text-sm sm:text-sm lg:text-[16px] lg:leading-relaxed '>{productData.description}</p>
//           <span className='flex justify-normal gap-1 items-center mt-1' ><MdOutlineRemoveRedEye className='text-md ' />
//             <p className='text-sm text-gray-500'>{Math.floor(Math.random() * 10) + 20} people are viewing this right now.</p>
//           </span>
//           <hr className='w-full sm:w-full lg:w-4/5 my-2 ' />
//           <div className='flex flex-col sm:flex-col lg:flex-col justify-normal sm:justify-normal gap-4 w-4/5 '>
//             <div className='flex flex-col gap-2'>
//               <p className='text-sm'>Select Size</p>
//               <div className='flex gap-2'>
//                 {productData.sizes && productData.sizes.map((item, index) => (
//                   <button key={index}
//                     className={`border p-2 rounded-full w-10 h-10 flex justify-center items-center ${item === size ? 'bg-black text-white' : 'bg-gray-200'}`}
//                     onClick={() => setSize(item)}>{item}</button>
//                 ))}
//               </div>
//             </div>
//             <div className='flex flex-col gap-2'>
//               <p className='text-sm'>Select Color</p>
//               <div className='flex gap-2'>
//                 {colors && colors.map((item, index) => (
//                   <button key={index}
//                     className={`border p-2 rounded-full w-10 h-10 flex justify-center items-center bg-${item.toLowerCase()}-500 ${item === color ? 'outline outline-gray-400 outline-offset-1' : ''}`}
//                     onClick={() => setColor(item)}></button>
//                 ))}
//               </div>
//             </div>
//           </div>
//           <div className='flex flex-col gap-2'>
//             <p className='text-sm'>Quantity:</p>
//             <div className='flex items-center border rounded-full px-3 py-1 w-fit'>
//               <button
//                 className='px-3 text-lg font-bold'
//                 onClick={() => updateQuantity(productData._id, currentCartData.quantity - 1)}
//               >-</button>
//               <input
//                 type="text"
//                 className='w-10 text-center border-none focus:outline-none'
//                 value={currentCartData ? currentCartData.quantity : 0}
//                 readOnly
//               />
//               <button
//                 className='px-3 text-lg font-bold'
//                 onClick={() => updateQuantity(productData._id, currentCartData.quantity + 1)}
//               >+</button>
//             </div>
//           </div>
//           <hr className='w-full sm:w-full lg:w-4/5 my-2 ' />
//           <div className='flex sm:flex-col lg:flex-row gap-4 sm:gap-4 lg:gap-8 lg:w-4/5 w-full text-md sm:text-md lg:text-lg'>
//             <button
//               className="bg-black text-white px-4 lg:py-2 rounded-lg lg:px-8 hover:bg-white hover:text-black border border-black transition-transform duration-300 transform w-full"
//               onClick={async () => {
//                 await addToCart(productData._id); // Wait for the addToCart function to complete
//                 navigate("/cart"); // Navigate to the cart page
//               }}
//             >
//               ADD TO CART
//             </button>
//             <button
//               className="bg-red-500 text-white py-2 rounded-lg px-8 hover:bg-white hover:text-black hover:border-black hover:border transition-transform duration-300 transform w-full"
//               onClick={async () => {
//                 await addToCart(productData._id); // Wait for the addToCart function to complete
//                 navigate("/cart"); // Navigate to the cart page
//               }}
//             >
//               BUY NOW
//             </button>
//           </div>

//           <hr className='w-full sm:w-full lg:w-4/5 my-2 ' />
//           <div className="text-xs sm:text-xs lg:text-sm text-gray-700 flex flex-col gap-2 ">
//             {/* Navigation Links */}
//             <div className="flex items-center justify-start gap-4  font-medium text-nowrap">
//               <div className="flex items-center gap-1">
//                 <Truck className="w-5 h-5" />
//                 <span className='w-full'>Delivery & Return</span>
//               </div>
//               {/* <span className="text-gray-400">|</span> */}
//               <div className="flex items-center gap-1">
//                 <HelpCircle className="w-5 h-5" />
//                 <span>Ask A Question</span>
//               </div>
//               {/* <span className="text-gray-400">|</span> */}
//               <div className="flex items-center gap-1">
//                 <Share2 className="w-5 h-5" />
//                 <span>Share</span>
//               </div>
//             </div>

//             {/* Estimated Delivery */}
//             <div className="flex items-center gap-2">
//               <Clock className="w-5 h-5 text-gray-600" />
//               <p>
//                 <span className="font-medium">Estimated Delivery:</span>
//                 <span className="text-gray-900"> 12–26 days</span> (International),
//                 <span className="text-gray-900"> 3–6 days</span> (United States)
//               </p>
//             </div>

//             {/* Return Policy */}
//             <div className="flex items-center gap-2">
//               <RotateCcw className="w-5 h-5 text-gray-600" />
//               <p>
//                 Return within <span className="font-medium">45 days</span> of purchase. Duties & taxes are non-refundable.
//               </p>
//             </div>

//             {/* Store Information */}
//             <div className="flex items-center gap-2">
//               <MapPin className="w-5 h-5 text-gray-600" />
//               <a href="#" className="text-blue-600 underline">View Store Information</a>
//             </div>
//           </div>
//           <hr className='w-full sm:w-full lg:w-4/5 my-2 ' />
//         </div>

//       </div>


//       {/* <hr className='mt-8 lg:mt-16 lg:my-12 sm:4/5' /> */}
//       {/* Description & Review Section */}
//       {/* <div className='mt-20'>
//         <Title text1={"Product"} text2={"Description"} />
//       </div>
//       <div className='flex flex-col gap-4 border px-6 py-6 text-md text-gray-500'>
//         {productData.description}
//       </div> */}
      
//       {/* Display Related Products */}




//       <div className="w-full my-8 lg:mt-20 ">
//         {/* Tab Navigation */}
//         <div className="flex my-1 lg:my-4 justify-start lg:justify-center w-fit-content overflow-hidden overflow-x-scroll">
//           {["Description", "Customer Reviews", "Shipping & Returns", "Return Policies"].map((tab) => (
//             <button
//               key={tab}
//               className={`text-nowrap px-4 py-2 text-sm sm:text-sm lg:text-lg font-medium ${activeTab === tab.toLowerCase() ? "border-b-2 border-black text-black" : "text-gray-500"
//                 }`}
//               onClick={() => setActiveTab(tab.toLowerCase())}
//             >
//               {tab}
//             </button>
//           ))}
//         </div>

//         {/* Tab Content */}
//         <div className="border">
//           {activeTab === "description" && (
//             <div className='p-4'>
//               <h2 className="font-bold">STRETCH STRAP TOP</h2>
//               <p>
//                 Nodding to retro styles, this Hyperbola T-shirt is defined by its off-the-shoulder design.
//                 It's spun from a green stretch cotton jersey and adorned with an embroidered AC logo on the
//                 front, a brand's signature.
//               </p>
//               <p className="mt-2 text-gray-600">
//                 Thick knitted fabric. Short design. Rounded neck. Sleeveless. Straps. Unclosed. Cable knit finish. Co-ord.
//               </p>
//             </div>
//           )}

//           {activeTab === "customer reviews" && (
//             <ProductReviews productId={productId} /> 
//           )}

//           {activeTab === "shipping & returns" && (
//             <div className='p-4'>
//               <h2 className="font-bold">Shipping & Returns</h2>
//               <p className="text-gray-600">
//                 Estimated Delivery: 12–26 days (International), 3–6 days (United States)
//               </p>
//               <p className="mt-2 text-gray-600">
//                 Return within 45 days of purchase. Duties & taxes are non-refundable.
//               </p>
//             </div>
//           )}

//           {activeTab === "return policies" && (
//             <div className='p-4'>
//               <h2 className="font-bold">Return Policies</h2>
//               <p className="text-gray-600">
//                 Return within 45 days of purchase. The product must be unused and in its original packaging.
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
//       <RelatedProducts category={productData.category} subCategory={productData.subCategory} />




//     </div>

//   ) : <div className='opacity-0'></div>
// }

// export default Product




import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext';
import { useParams } from 'react-router-dom';
import { assets } from '../assets/frontend_assets/assets';
import RelatedProducts from '../components/RelatedProducts';
import Button from '../components/Button';
import ProductReviews from '../components/Review';
import Title from '../components/Title';
import { toast } from 'react-toastify';
import axios from 'axios';
import { BsFillLightningChargeFill, BsLightningCharge } from "react-icons/bs";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { Truck, HelpCircle, Share2, Clock, RotateCcw, MapPin } from 'lucide-react';

const Product = () => {

  const { productId } = useParams();
  const { products, currency, addToCart, navigate, token, backendUrl, updateQuantity, cartItems,conversionRate } = useContext(ShopContext);
  const [reviews, setReviews] = useState([]);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState('');
  const [size, setSize] = useState('')
  const [color, setColor] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState("description");
  const [attributes, setAttributes] = useState([]);
  const [attributesList, setAttributesList] = useState([]);

  useEffect(() => {
    if (token) {
      fetchReviews();
    }
  }, [productId, token]);

  // Fetch all attributes
  const fetchAttributes = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/attribute/list`, {
        headers: { token }
      });
      console.log("Fetched attributes:", response.data.attributes);
      setAttributesList(response.data.attributes);
    } catch (err) {
      console.error('Error fetching attributes:', err);
      toast.error('Failed to fetch attributes');
    }
  };

  // Process product attributes when product data and attribute list are available
  useEffect(() => {
    if (productData && productData.attributes && attributesList.length > 0) {
      console.log("Processing attributes...");
      console.log("Product attributes:", productData.attributes);
      console.log("Attribute list:", attributesList);
      
      const processedAttributes = productData.attributes.map(attr => {
        const foundAttribute = attributesList.find(a => a._id === attr.attributeId);
        console.log("Found attribute:", foundAttribute);
        
        if (foundAttribute) {
          return {
            _id: attr.attributeId,
            name: foundAttribute.attributeName,
            values: attr.selectedValues,
            displayType: foundAttribute.attributeName.toLowerCase() === 'colour' || foundAttribute.attributeName.toLowerCase() === 'color' ? 'color' : 
                        foundAttribute.attributeName.toLowerCase() === 'size' ? 'size' : 'select'
          };
        }
        return null;
      }).filter(Boolean); // Remove null entries
      
      console.log("Processed attributes:", processedAttributes);
      setAttributes(processedAttributes);
    }
  }, [productData, attributesList]);

  useEffect(() => {
    if (token) {
      fetchAttributes();
    }
  }, [token]);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/review/${productId}/get-review`,
        { headers: { token } }
      );
      const fetchedReviews = response.data;
      setReviews(fetchedReviews);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      toast.error('Failed to fetch reviews');
    }
  };

  const calculateAverageRating = () => {
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return reviews.length ? totalRating / reviews.length : 0;
  };

  const fetchProductData = async () => {
    products.map((item) => {
      if (item._id === productId) {
        console.log("Found product data:", item);
        setProductData(item);
        setImage(item.image[0]);
        return null;
      }
    })
  }
  const calculateDiscount = () => {
    if (productData && productData.originalPrice && productData.price) {
      const discount = ((productData.originalPrice - productData.price) / productData.originalPrice) * 100;
      return Math.round(discount); // Round to nearest integer
    }
    return 0;
  };

  const discount = calculateDiscount();

  useEffect(() => {
    fetchProductData();
  }, [productId, products]);

  const [currentCartData, setCurrentCartData] = useState(null);

  

  // Selected attribute values state
  const [selectedAttributeValues, setSelectedAttributeValues] = useState({});

  // Function to handle attribute selection
  const handleAttributeSelection = (attributeId, value,attributeName) => {
    setSelectedAttributeValues(prev => ({
      ...prev,
      [attributeName]: value
    }));
    
    // For color attributes, also update the color state for consistent UI
    // const attribute = attributes.find(attr => attr._id === attributeId);
    // if (attribute && attribute.displayType === 'color') {
    //   setColor(value);
    // }
    
    // // For size attributes, also update the size state for consistent UI
    // if (attribute && attribute.displayType === 'size') {
    //   setSize(value);
    // }
    
    // console.log(`Selected ${attributeId}: ${value}`);
    console.log(selectedAttributeValues)
  };


  useEffect(()=>{
    console.log(selectedAttributeValues)
  },[selectedAttributeValues])

  // Initialize selected values from product attributes
  useEffect(() => {
    if (attributes.length > 0) {
      const initialValues = {};
      attributes.forEach(attr => {
        if (attr.values && attr.values.length > 0) {
          initialValues[attr.name] = attr.values[0];
          
          // Set initial color and size if applicable
          if (attr.displayType === 'color') {
            setColor(attr.values[0]);
          }
          if (attr.displayType === 'size') {
            setSize(attr.values[0]);
          }
        }
      });
      setSelectedAttributeValues(initialValues);
    }
  }, [attributes]);


  useEffect(() => {
    // Check if the productId exists as a key in cartItems
    if (productId) {
      // Find the cart item with matching productId and attributes
      const cartItem = Object.values(cartItems).find(item => 
        item.productId === productId && JSON.stringify(item.attributes) === JSON.stringify(selectedAttributeValues)
      );

      if (cartItem) {
        // Set current cart data with the product ID and its quantity
        setCurrentCartData({ 
          productId, 
          quantity: cartItem.quantity 
        });
      } else {
        // Add a new product in cartItems if attributes don't match
        setCurrentCartData({ productId, quantity: 0 });
      }
    } else {
      // Reset current cart data if product is not in cart
      setCurrentCartData({ productId, quantity: 0 });
    }
  }, [productId, cartItems, selectedAttributeValues]);

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

  // Render attribute selection UI based on attribute type
  const renderAttributeSelector = (attribute) => {
    const selectedValue = selectedAttributeValues[attribute._id] || '';
    
    switch (attribute.displayType) {
      case 'color':
        return (
          <div className='flex gap-2'>
            {attribute.values.map((value, index) => (
              <button 
                key={index}
                className={`border p-2 rounded-full w-10 h-10 flex justify-center items-center ${getColorClass(value)} ${selectedAttributeValues[attribute.name] === value ? 'outline outline-black outline-offset-1' : ''}`}
                onClick={() => handleAttributeSelection(attribute._id, value,attribute.name)}
                title={value}
              ></button>
            ))}
          </div>
        );
      case 'size':
        return (
          <div className='flex gap-2'>
            {attribute.values.map((value, index) => (
              <button 
                key={index}
                className={`border p-2 rounded-full w-10 h-10 flex justify-center items-center ${selectedAttributeValues[attribute.name] === value ? 'bg-black text-white' : 'bg-gray-200'}`}
                onClick={() => handleAttributeSelection(attribute._id, value,attribute.name)}
              >{value.toUpperCase()}</button>
            ))}
          </div>
        );
      default:
        return (
          <div className='flex flex-wrap gap-2'>
            {attribute.values.map((value, index) => (
              <button 
                key={index}
                className={`text-xs border px-4 py-2 rounded-md ${selectedAttributeValues[attribute.name] === value  ? 'bg-black text-white' : 'bg-gray-200'}`}
                onClick={() => handleAttributeSelection(attribute._id, value,attribute.name)}
              >{value.toUpperCase()}</button>
            ))}
          </div>
        );
    }
  };

  

  return productData ? (
    <div className='pt-10 transition-opacity ease-in duration-500 opacity-100 lg:mt-4 lg:pt-4'>
      {/* Product Data*/}
      <div className='flex gap-12 sm:gap-12 flex-col sm:flex-row'>
        {/* Product Images */}
        <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row '>
          <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-normal sm:justify-normal sm:w-[18.7%] w-full gap-x-2 sm:gap-x-2 lg:gap-0'>
            {
              productData.image.map((item, index) => (
                <img src={item} alt="" key={index}
                  className='w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer border rounded-md' onClick={() => setImage(item)} />
              ))
            }
          </div>
          <div className='w-full sm:w-[80%] border-red-500'>
            <img src={image} alt="" className='w-full h-auto border rounded-md sm:h-full object-cover object-center lg:min-h-[500px] lg:max-h-[600px]' />
          </div>
        </div>
        {/* Product Information */}
        <div className='flex flex-col items-start rounded-md gap-2 sm:gap-2 lg:gap-4 lg:w-1/2 lg:min-h-[500px] lg:max-h-[600px] overflow-y-auto'>
          <p className='text-[12px] font-medium flex items-center uppercase text-gray-400'>{productData.category} {productData.subCategory}</p>
          <h1 className='font-medium text-2xl sm:text-2xl lg:text-4xl capitalize text-black'>{productData.name}</h1>
          <div className='flex items-center gap-1'>
            {reviews.length > 0 && (
              <div className="flex items-center gap-2 justify-start w-full h-full">
                <div className="flex justify-start">
                  {[1, 2, 3, 4, 5].map((rate) => (
                    <span
                      key={rate}
                      className={`text-2xl ${calculateAverageRating() >= rate ? 'text-yellow-500' : 'text-gray-400'}`}
                    >
                      ★
                    </span>
                  ))}
                  <span className='text-xs flex justify-center items-center text-gray-500 px-2'>({calculateAverageRating().toFixed(1)})</span>
                </div>

                <span className='flex justify-normal gap-1 items-center'><BsFillLightningChargeFill className='text-md animate-pulse text-red-500' />
                  <p className='text-sm'>{Math.floor(Math.random() * 10) + 50} sold in last 24 hours</p>
                </span>
              </div>
            )}
          </div>
          <div className='flex gap-x-2 items-center'>
            <p className='text-2xl font-semibold flex items-center'>{currency} {(productData.price * conversionRate).toFixed(2)}</p>
            <p className='text-md text-gray-500 line-through flex items-center'>{currency}{productData.originalPrice}</p>
            <h5 className='ml-2 bg-red-500 text-white text-xs font-bold flex items-center py-1 px-2 rounded-full'>-{discount}%</h5>
          </div>
          <p className='text-gray-700 md:w-4/5 text-sm sm:text-sm lg:text-[16px] lg:leading-relaxed'>{productData.description}</p>
          <span className='flex justify-normal gap-1 items-center mt-1'><MdOutlineRemoveRedEye className='text-md' />
            <p className='text-sm text-gray-500'>{Math.floor(Math.random() * 10) + 20} people are viewing this right now.</p>
          </span>
          <hr className='w-full sm:w-full lg:w-4/5 my-2' />
          
          {/* Display Product Attributes */}
          {attributes.length > 0 ? (
            <div className='flex flex-col sm:flex-col lg:flex-col justify-normal sm:justify-normal gap-4 w-4/5'>
              {attributes.map((attribute, index) => (
                <div key={index} className='flex flex-col gap-2'>
                  <p className='text-sm font-medium capitalize'>{attribute.name}</p>
                  {renderAttributeSelector(attribute)}
                </div>
              ))}
            </div>
          ) : (
            /* If no attributes or as a fallback, show the default size/color selectors */
            // <div className='flex flex-col sm:flex-col lg:flex-col justify-normal sm:justify-normal gap-4 w-4/5'>
            //   <div className='flex flex-col gap-2'>
            //     <p className='text-sm'>Select Size</p>
            //     <div className='flex gap-2'>
            //       {productData.sizes && productData.sizes.map((item, index) => (
            //         <button key={index}
            //           className={`border p-2 rounded-full w-10 h-10 flex justify-center items-center ${item === size ? 'bg-black text-white' : 'bg-gray-200'}`}
            //           onClick={() => setSize(item)}>{item}</button>
            //       ))}
            //     </div>
            //   </div>
            //   <div className='flex flex-col gap-2'>
            //     <p className='text-sm'>Select Color</p>
            //     <div className='flex gap-2'>
            //       {colors && colors.map((item, index) => (
            //         <button key={index}
            //           className={`border p-2 rounded-full w-10 h-10 flex justify-center items-center ${getColorClass(item)} ${item === color ? 'outline outline-gray-400 outline-offset-1' : ''}`}
            //           onClick={() => setColor(item)}></button>
            //       ))}
            //     </div>
            //   </div>
            // </div>
            <div className='hidden'></div>
          )}
          
          <div className='flex flex-col gap-2'>
            <p className='text-sm'>Quantity:</p>
            <div className='flex items-center border rounded-full px-3 py-1 w-fit'>
              <button
                className='px-3 text-lg font-bold'
                onClick={() => updateQuantity(productData._id, currentCartData ? Math.max(0, currentCartData.quantity - 1) : 0,selectedAttributeValues)}
              >-</button>
              <input
                type="text"
                className='w-10 text-center border-none focus:outline-none'
                value={currentCartData ? currentCartData.quantity : 0}
                readOnly
              />
              <button
                className='px-3 text-lg font-bold'
                onClick={() => updateQuantity(productData._id, currentCartData ? currentCartData.quantity + 1 : 1, selectedAttributeValues)}
              >+</button>
            </div>
          </div>
          <hr className='w-full sm:w-full lg:w-4/5 my-2' />
          <div className='flex sm:flex-col lg:flex-row gap-4 sm:gap-4 lg:gap-8 lg:w-4/5 w-full text-md sm:text-md lg:text-lg'>
            <button
              className="bg-black text-white px-4 lg:py-2 rounded-lg lg:px-8 hover:bg-white hover:text-black border border-black transition-transform duration-300 transform w-full"
              onClick={async () => {
                await addToCart(productData._id,selectedAttributeValues); // Wait for the addToCart function to complete
                navigate("/cart"); // Navigate to the cart page
              }}
            >
              ADD TO CART
            </button>
            <button
              className="bg-red-500 text-white py-2 rounded-lg px-8 hover:bg-white hover:text-black hover:border-black hover:border transition-transform duration-300 transform w-full"
              onClick={async () => {
                await addToCart(productData._id,selectedAttributeValues); // Wait for the addToCart function to complete
                navigate("/cart"); // Navigate to the cart page
              }}
            >
              BUY NOW
            </button>
          </div>

          <hr className='w-full sm:w-full lg:w-4/5 my-2' />
          <div className="text-xs sm:text-xs lg:text-sm text-gray-700 flex flex-col gap-2">
            {/* Navigation Links */}
            <div className="flex flex-col sm:flex-col lg:flex-row items-start lg:items-center justify-start gap-2 sm:gap-2 lg:gap-4 font-medium text-nowrap ">
              <div className="flex items-center gap-1">
                <Truck className="w-5 h-5" />
                <span className='w-full'>Delivery & Return</span>
              </div>
              <div className="flex items-center gap-1">
                <HelpCircle className="w-5 h-5" />
                <span>Ask A Question</span>
              </div>
              <div className="flex items-center gap-1">
                <Share2 className="w-5 h-5" />
                <span>Share</span>
              </div>
            </div>

            {/* Estimated Delivery */}
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-600" />
              <p>
                <span className="font-medium">Estimated Delivery:</span>
                <span className="text-gray-900"> 12–26 days</span> (International),
                <span className="text-gray-900"> 3–6 days</span> (United States)
              </p>
            </div>

            {/* Return Policy */}
            <div className="flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-gray-600" />
              <p>
                Return within <span className="font-medium">45 days</span> of purchase. Duties & taxes are non-refundable.
              </p>
            </div>

            {/* Store Information */}
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-gray-600" />
              <a href="#" className="text-blue-600 underline">View Store Information</a>
            </div>
          </div>
          <hr className='w-full sm:w-full lg:w-4/5 my-2' />
        </div>
      </div>

      <div className="w-full my-8 lg:mt-20">
        {/* Tab Navigation */}
        <div className="flex my-1 lg:my-4 justify-start lg:justify-center w-fit-content overflow-hidden overflow-x-scroll">
          {["Description", "Customer Reviews", "Shipping & Returns", "Return Policies"].map((tab) => (
            <button
              key={tab}
              className={`text-nowrap px-4 py-2 text-sm sm:text-sm lg:text-lg font-medium ${activeTab === tab.toLowerCase() ? "border-b-2 border-black text-black" : "text-gray-500"}`}
              onClick={() => setActiveTab(tab.toLowerCase())}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="border">
          {activeTab === "description" && (
            <div className='p-4'>
              <h2 className="font-bold text-md">{productData.name}</h2>
              <p className='mt-2 '>{productData.detailedDescription}</p>
            </div>
          )}

          {activeTab === "customer reviews" && (
            <ProductReviews productId={productId} /> 
          )}

          {activeTab === "shipping & returns" && (
            <div className='p-4'>
              <h2 className="font-bold">Shipping & Returns</h2>
              <p className="text-gray-600">
                Estimated Delivery: 12–26 days (International), 3–6 days (United States)
              </p>
              <p className="mt-2 text-gray-600">
                Return within 45 days of purchase. Duties & taxes are non-refundable.
              </p>
            </div>
          )}

          {activeTab === "return policies" && (
            <div className='p-4'>
              <h2 className="font-bold">Return Policies</h2>
              <p className="text-gray-600">
                Return within 45 days of purchase. The product must be unused and in its original packaging.
              </p>
            </div>
          )}
        </div>
      </div>
      <RelatedProducts category={productData.category} subCategory={productData.subCategory} />
    </div>
  ) : <div className='opacity-0'></div>
}

export default Product
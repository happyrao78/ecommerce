// import React, { useContext, useEffect, useState } from 'react'
// import { ShopContext } from '../context/ShopContext'
// import Title from '../components/Title';
// import { assets } from '../assets/frontend_assets/assets';
// import CartTotal from '../components/CartTotal';
// import Button from '../components/Button';

// const Cart = () => {

//   const{products,currency,cartItems,updateQuantity,navigate}=useContext(ShopContext)
//   const[cartData,setCartData]=useState([]);

//   useEffect(() => {
//     const tempData = [];

//     for (const itemId in cartItems) {
//       const quantity = cartItems[itemId];
//       if (quantity > 0) {
//         tempData.push({
//           _id: itemId,
//           quantity: quantity
//         });
//       }
//     }

//     setCartData(tempData);
//   }, [cartItems]);


//       useEffect(()=>{
//         console.log(cartData);

//       },[cartData])



//   return (
//     <div className='border-t pt-14'>
//      <div className='text-2xl mb-3'>
//         <Title text1={'Your'} text2={'Cart'}/>
//      </div>
//      <div>
//       {
//         cartData.map((item,index)=>{
//           const productData = products.find((product)=>product._id===item._id);

//           return(
//               <div key={index} className='py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4'>
//                   <div className='flex items-start gap-6'>
//                     <img src={productData.image[0]} alt="" className='w-16 sm:w-20' />
//                     <p className='text-xs sm:text-lg font-medium'>{productData.name}
//                     <div className='flex item-start gap-5 mt-2'>
//                         <p>{currency}{productData.price}</p>
//                         {/* <p className='px-2 sm:px-3 sm:py-1 border bg-slate-50'>{item.size}</p> */}
//                     </div>
//                     </p>


//                   </div>

//                   <input type="number" min={0} defaultValue={item.quantity}
//                   onChange={(e)=>e.target.value==='' || e.target.value===0 ? null : updateQuantity(item._id,Number(e.target.value))}
//                   className='border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1' />
//                   <img src={assets.bin_icon} alt="" className='w-4 mr-4 sm:w-5 cursor-pointer' onClick={()=>(updateQuantity(item._id,0))} />


//               </div>
//           )
//         })
//       }
//      </div>
//      <div className='flex justify-end my-20'>
//       <div className='w-full sm:w-[450px]'>
//       <CartTotal/>
//       <div className='w-full text-end'>
//       <Button className=' text-sm my-8 
//       'onClick={()=>navigate("/place-order")}>PROCEED TO CHECKOUT</Button>
//       </div>
//       </div>

//      </div>

//     </div>

//   )
// }

// export default Cart


// import React, { useContext, useEffect, useState } from 'react';
// import { ShopContext } from '../context/ShopContext';
// import Title from '../components/Title';
// import { assets } from '../assets/frontend_assets/assets';
// import CartTotal from '../components/CartTotal';
// import Button from '../components/Button';
// import { IoIosArrowDown } from "react-icons/io";

// const Cart = () => {
//   const { products, currency, cartItems, updateQuantity, navigate } = useContext(ShopContext);
//   const [cartData, setCartData] = useState([]);

//   useEffect(() => {
//     const tempData = [];
//     for (const itemId in cartItems) {
//       const quantity = cartItems[itemId];
//       if (quantity > 0) {
//         tempData.push({
//           _id: itemId,
//           quantity: quantity,
//         });
//       }
//     }
//     setCartData(tempData);
//   }, [cartItems]);

  

//   return (
//     <div className="border-t pt-14 flex flex-col lg:flex-row lg:justify-between gap-10">


//       {cartData.length === 0 ? (
//         <div className="text-center text-gray-500 mt-15 w-full flex flex-col items-center justify-center gap-8">
//           <p>Your cart is empty.</p>
//           <Button onClick={() => navigate('/')}>Continue Shopping</Button>
//         </div>
//       ) : (
//         <div className='w-full lg:w-3/5'>
//           <h1 className='text-2xl font-medium py-4 border-b'>Products</h1>
//           <div className="flex flex-col gap-6">
//             {products.length > 0 && cartData.map((item, index) => {
//               const productData = products.find((product) => product._id === item._id);
//               // console.log(productData)
//                 if (!productData) {
//                 return <div key={item._id} className="py-4 text-red-500"></div>;
//                 }
//               return (
//                 <div key={index} className="p-4 border rounded-lg shadow-sm flex items-center gap-4">
//                   {/* Product Image */}
//                   <img src={productData.image[0]} alt="" className="w-24 h-24 object-cover rounded-lg" />

//                   {/* Product Details */}
//                   <div className="flex flex-col sm:flex sm:flex-col lg:grid lg:grid-cols-[3fr_1fr_2fr] w-full gap-2 lg:gap-4 justify-center items-center">
//                     <div>
//                       <p className="text-lg font-medium">{productData.name}</p>

//                       {/* Color & Size Dropdowns */}
//                       <div className="flex gap-2 mt-2  lg:flex-row">
//                         <div className="relative w-full lg:w-24">
//                           <select className="border border-gray-300 px-3 py-1 rounded-md text-gray-700 bg-white focus:ring-2 focus:ring-blue-400 transition-all appearance-none shadow-sm w-full text-xs lg:text-md sm:text-xs">
//                             <option>Blue</option>
//                             <option>Red</option>
//                             <option>Green</option>
//                           </select>
//                           <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none text-xs sm:text-xs lg:text-md">
//                             <IoIosArrowDown />
//                           </div>
//                         </div>

//                         <div className="relative w-full lg:w-24">
//                           <select className="border border-gray-300 px-3 py-1 rounded-md text-gray-700 bg-white focus:ring-2 focus:ring-blue-400 transition-all appearance-none shadow-sm w-full text-xs sm:text-xs lg:text-md">
//                           {productData.sizes && productData.sizes.map((item, index) => (
//                             <option key={index}>{item}</option> ))}
                            
//                           </select>
//                           <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none text-xs sm:text-xs lg:text-md">
//                             <IoIosArrowDown />
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                     {/* Price */}
//                     {/* <p className="text-gray-600 mt-2">Price: <span className="font-medium">{currency}{productData.price.toFixed(2)}</span></p> */}

//                     {/* Quantity Selector */}
//                     <div className="flex items-center gap-2 lg:mt-2">
//                       {/* <p className="text-gray-600">Quantity:</p> */}
//                       <div className='flex items-center border rounded-full px-3 py-1 w-fit shadow-sm'>
//                         <button
//                           className='px-3 text-sm sm:text-sm lg:text-lg font-bold'
//                           onClick={() => updateQuantity(item._id, item.quantity - 1)}
//                         >-</button>
//                         <input
//                           type="text"
//                           className='w-10 text-center  border-none focus:outline-none bg-transparent text-sm sm:text-sm lg:text-lg'
//                           value={item.quantity}
//                           readOnly
//                         />
//                         <button
//                           className='px-3 text-sm sm:text-sm lg:text-lg font-bold'
//                           onClick={() => updateQuantity(item._id, item.quantity + 1)}
//                         >+</button>
//                       </div>
//                     </div>

//                     <div className='flex w-full justify-center items-center gap-8 sm:gap-8 lg:gap-8'>
//                       {/* Total Price */}
//                       <p className="text-gray-600 lg:mt-2 flex justify-center items-center"><span className="font-medium">{currency}{(productData.price * item.quantity).toFixed(2)}</span></p>

//                       {/* Remove Button */}
//                       <div className="flex justify-center items-center lg:mt-2">
//                         <p className="text-red-500 flex items-center gap-2 cursor-pointer" onClick={() => updateQuantity(item._id, 0)}>
//                           <img src={assets.bin_icon} alt="" className="w-2 h-2 lg:w-4 lg:h-4" />
//                         </p>
//                       </div>

//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//           </div>
//         )}
       

//       {/* Checkout Section */}
//       {cartData.length > 0 && (
//         <div className="w-full lg:w-2/5 ">
//           <CartTotal />

//         </div>
//       )}
//     </div>
//   );
// };

// export default Cart;



import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import { assets } from '../assets/frontend_assets/assets';
import CartTotal from '../components/CartTotal';
import Button from '../components/Button';
import { IoIosArrowDown } from "react-icons/io";

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, navigate ,conversionRate} = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    const tempData = [];
    for (const cartItemKey in cartItems) {
      const item = cartItems[cartItemKey];
      if (item && item.quantity > 0) {
        // Extract the itemId from the composite key or use the stored itemId
        const itemId = item.itemId || cartItemKey.split('_')[0];
        // Extract attributes from the stored object
        const attributes = item.attributes || {};
        
        tempData.push({
          cartItemKey: cartItemKey, // Store the full composite key
          itemId: itemId, // Store the actual product ID
          quantity: item.quantity,
          attributes: attributes
        });
      }
    }
    setCartData(tempData);
    console.log("CartData in cart",cartData)
  }, [cartItems]);

  return (
    <div className="border-t pt-14 flex flex-col lg:flex-row lg:justify-between gap-10">
      {cartData.length === 0 ? (
        <div className="text-center text-gray-500 mt-15 w-full flex flex-col items-center justify-center gap-8">
          <p>Your cart is empty.</p>
          <Button onClick={() => navigate('/')}>Continue Shopping</Button>
        </div>
      ) : (
        <div className='w-full lg:w-3/5'>
          <h1 className='text-2xl font-medium py-4 border-b'>Products</h1>
          <div className="flex flex-col gap-6">
            {products.length > 0 && cartData.map((item, index) => {
              const productData = products.find((product) => product._id === item.itemId);
              
              if (!productData) {
                return <div key={item.cartItemKey} className="py-4 text-red-500"></div>;
              }
              
              return (
                <div key={index} className="p-4 border rounded-lg shadow-sm flex items-center gap-4">
                  {/* Product Image */}
                  <img src={productData.image[0]} alt="" className="w-24 h-24 object-cover rounded-lg" />

                  {/* Product Details */}
                  <div className="flex flex-col sm:flex sm:flex-col lg:grid lg:grid-cols-[3fr_1fr_2fr] w-full gap-2 lg:gap-4 justify-center items-center">
                    <div>
                      <p className="text-lg font-medium">{productData.name}</p>

                      {/* Color & Size Dropdowns */}
                      <div className="flex gap-2 mt-2 lg:flex-row">
                        {Object.entries(item.attributes).map(([key, value], index) => (
                          <p key={index} className="px-2 py-1 border bg-slate-50 text-xs sm:text-sm lg:text-md rounded-md">
                          {value[0].toUpperCase()+value.slice(1)}
                          </p>
                        ))}
                      </div>
                      </div>

                      {/* Quantity Selector */}
                    <div className="flex items-center gap-2 lg:mt-2">
                      <div className='flex items-center border rounded-full px-3 py-1 w-fit shadow-sm'>
                        <button
                          className='px-3 text-sm sm:text-sm lg:text-lg font-bold'
                          onClick={() => updateQuantity(item.itemId, item.quantity - 1, item.attributes)}
                        >-</button>
                        <input
                          type="text"
                          className='w-10 text-center border-none focus:outline-none bg-transparent text-sm sm:text-sm lg:text-lg'
                          value={item.quantity}
                          readOnly
                        />
                        <button
                          className='px-3 text-sm sm:text-sm lg:text-lg font-bold'
                          onClick={() => updateQuantity(item.itemId, item.quantity + 1, item.attributes)}
                        >+</button>
                      </div>
                    </div>

                    <div className='flex w-full justify-center items-center gap-8 sm:gap-8 lg:gap-8'>
                      {/* Total Price */}
                      <p className="text-gray-600 lg:mt-2 flex justify-center items-center">
                        <span className="font-medium">{currency} {(productData.price * conversionRate * item.quantity).toFixed(2)}</span>
                      </p>

                      {/* Remove Button */}
                      <div className="flex justify-center items-center lg:mt-2">
                        <p 
                          className="text-red-500 flex items-center gap-2 cursor-pointer" 
                          onClick={() => updateQuantity(item.itemId, 0, item.attributes)}
                        >
                          <img src={assets.bin_icon} alt="" className="w-2 h-2 lg:w-4 lg:h-4" />
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Checkout Section */}
      {cartData.length > 0 && (
        <div className="w-full lg:w-2/5 ">
          <CartTotal />
        </div>
      )}
    </div>
  );
};

export default Cart;
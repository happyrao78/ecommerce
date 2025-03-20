// import React, { useContext, useEffect, useState } from 'react';
// import { ShopContext } from '../context/ShopContext';
// import CartTotal from '../components/CartTotal';
// import Button from '../components/Button';
// import { IoClose } from 'react-icons/io5';
// import { UiContext } from '../context/UiContext';
// import { assets } from '../assets/frontend_assets/assets';

// const FREE_SHIPPING_THRESHOLD = 10000; // Set your free shipping amount

// const SlideCart = () => {
//   const { products, currency, cartItems, updateQuantity, navigate } = useContext(ShopContext);
//   const [cartData, setCartData] = useState([]);
//   const { isSlideCartOpen, closeSlideCart } = useContext(UiContext);
//   const isOpen = isSlideCartOpen;
//   const onClose = () => closeSlideCart();

//   useEffect(() => {
//     const tempData = Object.keys(cartItems)
//       .filter(itemId => cartItems[itemId] > 0)
//       .map(itemId => ({ _id: itemId, quantity: cartItems[itemId] }));
//     setCartData(tempData);
//   }, [cartItems]);

//   const subtotal = cartData.reduce((acc, item) => {
//     const productData = products.find((product) => product._id === item._id);
//     return productData ? acc + productData.price * item.quantity : acc;
//   }, 0);

//   const progress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
//   const isEligibleForFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;

//   return (
//     <div className={`fixed top-0 right-0 bottom-0 w-full sm:w-full max-w-full overflow-x-hidden lg:w-1/3 h-full  bg-white shadow-lg transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 z-20 `}>
//       <div className="p-4 border-b flex justify-between items-center">
//         <h2 className="text-xl font-medium">Shopping Cart</h2>
//         <button onClick={onClose} className="text-gray-600 hover:text-gray-900"><IoClose size={24} /></button>
//       </div>



//       {cartData.length === 0 ? (
//         <div className="text-center text-gray-500 mt-10 p-4">
//           <p>Your cart is empty.</p>
//           <Button onClick={onClose}>Continue Shopping</Button>
//         </div>
//       ) : (

//         <div className="p-4 flex flex-col justify-start h-full gap-10 mb-8">
//           {/* Free Shipping Progress Bar  */}
//           <div className=" bg-yellow-50 rounded-lg p-4">
//             <div className="relative w-full bg-gray-200 h-2 rounded-lg overflow-hidden">
//               <div className="h-2 bg-gradient-to-r from-green-400 to-green-600" style={{ width: `${progress}%` }}></div>
//             </div>
//             <p className="text-center mt-2 text-sm font-medium text-gray-700">
//               {isEligibleForFreeShipping ? (
//                 <span className="text-green-600 font-semibold">🎉 Congratulations! You've got free shipping!</span>
//               ) : (
//                 <span>You're <strong>{currency}{(FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2)}</strong> away from free shipping!</span>
//               )}
//             </p>
//           </div>
//           {cartData.map((item) => {
//             const productData = products.find((product) => product._id === item._id);
//             if (!productData) return null;
//             return (
//               <div key={item._id} className="flex items-center justify-between border-b py-3 gap-2">
//                 <img src={productData.image[0]} alt={productData.name} className="w-16 h-16 object-cover" />
//                 <div className="flex-1 ml-4">
//                   <p className="text-sm font-medium">{productData.name}</p>
//                   <p className="text-gray-600">{currency}{productData.price}</p>
//                 </div>
//                 <div className="flex items-center gap-2 lg:mt-2">
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
//                 <img
//                   src={assets.bin_icon}
//                   alt=""
//                   className="w-4 mr-4 sm:w-5 cursor-pointer"
//                   onClick={() => updateQuantity(item._id, 0)}
//                 />
//               </div>
//             );
//           })}

//           <div className=' bg-white w-full flex flex-col justify-normal gap-4 '>
//             <CartTotal />
//             <div className='flex justify-between border-t gap-4'>
//               <Button className="mt-4 w-full" onClick={() => {
//                 navigate('/cart')
//                 onClose()
//               }}>View Cart</Button>
//               <Button className="mt-4 w-full" onClick={() => {
//                 navigate('/place-order')
//                 onClose()
//               }}>Check Out</Button>
//             </div>
//             <p className="text-gray-800 text-sm font-medium uppercase underline text-center mb-24" onClick={() => navigate('/')}>Or Continue Shopping</p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SlideCart;


import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import CartTotal from '../components/CartTotal';
import Button from '../components/Button';
import { IoClose } from 'react-icons/io5';
import { UiContext } from '../context/UiContext';
import { assets } from '../assets/frontend_assets/assets';

const FREE_SHIPPING_THRESHOLD = 10000;

const SlideCart = () => {
  const { products, currency, cartItems, updateQuantity, navigate,conversionRate } = useContext(ShopContext);
  const { isSlideCartOpen, closeSlideCart } = useContext(UiContext);
  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    const tempData = Object.keys(cartItems)
      .map(cartItemKey => {
        const item = cartItems[cartItemKey];
        if (!item || item.quantity <= 0) return null;
        return {
          cartItemKey,
          itemId: item.itemId || cartItemKey.split('_')[0],
          quantity: item.quantity,
          attributes: item.attributes || {}
        };
      })
      .filter(item => item !== null);

    setCartData(tempData);
  }, [cartItems]);

  const subtotal = cartData.reduce((acc, item) => {
    const productData = products.find((product) => product._id === item.itemId);
    return productData ? acc + productData.price * item.quantity : acc;
  }, 0);

  const progress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const isEligibleForFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;

  return (
    <div className={`fixed top-0 right-0 bottom-0 w-full sm:w-full max-w-full lg:w-1/3 h-full bg-white shadow-lg transform ${isSlideCartOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 z-20`}>
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-xl font-medium">Shopping Cart</h2>
        <button onClick={closeSlideCart} className="text-gray-600 hover:text-gray-900"><IoClose size={24} /></button>
      </div>

      {cartData.length === 0 ? (
        <div className="text-center text-gray-500 mt-10 p-4">
          <p>Your cart is empty.</p>
          <Button onClick={closeSlideCart}>Continue Shopping</Button>
        </div>
      ) : (
        <div className="p-4 flex flex-col gap-6 h-full overflow-y-auto">
          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="relative w-full bg-gray-200 h-2 rounded-lg overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-green-400 to-green-600" style={{ width: `${progress}%` }}></div>
            </div>
            <p className="text-center mt-2 text-sm font-medium text-gray-700">
              {isEligibleForFreeShipping ? (
                <span className="text-green-600 font-semibold">🎉 Free Shipping Unlocked!</span>
              ) : (
                <span>You're <strong>{currency}{(FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2)}</strong> away from free shipping!</span>
              )}
            </p>
          </div>

          {cartData.map((item) => {
            const productData = products.find((product) => product._id === item.itemId);
            if (!productData) return null;
            return (
              <div key={item.cartItemKey} className="flex items-center justify-between border-b py-3 gap-2">
                <img src={productData.image[0]} alt={productData.name} className="w-16 h-16 object-cover" />
                <div className="flex-1 ml-4">
                  <p className="text-sm font-medium">{productData.name}</p>
                  <div className="flex gap-2 mt-2">
                    {Object.entries(item.attributes).map(([key, value], index) => (
                      <p key={index} className="px-2 py-1 border bg-gray-50 text-xs rounded-md">{value}</p>
                    ))}
                  </div>
                  <p className="text-gray-600 mt-2">{currency} {(productData.price * conversionRate).toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className='flex items-center border rounded-full px-3 py-1 shadow-sm'>
                    <button className='px-3 text-lg font-bold' onClick={() => updateQuantity(item.itemId, item.quantity - 1, item.attributes)}>-</button>
                    <input type="text" className='w-10 text-center border-none bg-transparent text-lg' value={item.quantity} readOnly />
                    <button className='px-3 text-lg font-bold' onClick={() => updateQuantity(item.itemId, item.quantity + 1, item.attributes)}>+</button>
                  </div>
                </div>
                <img src={assets.bin_icon} alt="Delete" className="w-5 cursor-pointer" onClick={() => updateQuantity(item.itemId, 0, item.attributes)} />
              </div>
            );
          })}

          <div className='w-full flex flex-col gap-4'>
            <CartTotal />
            <div className='flex justify-between border-t gap-4 pt-4'>
              <Button className="w-full" onClick={() => { navigate('/cart'); closeSlideCart(); }}>View Cart</Button>
              <Button className="w-full" onClick={() => { navigate('/place-order'); closeSlideCart(); }}>Check Out</Button>
            </div>
            <p className="text-center text-sm font-medium uppercase underline cursor-pointer mb-10" onClick={() => navigate('/')}>Continue Shopping</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SlideCart;

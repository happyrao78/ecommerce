// import React, { useContext, useEffect, useState } from 'react'
// import { ShopContext } from '../context/ShopContext'
// import Title from './Title'
// import Slider from 'react-slick'
// import { FaShoppingCart, FaTrash } from 'react-icons/fa'
// import { toast } from 'react-toastify'
// import { Link } from 'react-router-dom'

// const WishlistItems = () => {
//   const {
//     products,
//     wishlistItems,
//     removeFromWishlist,
//     moveToCart,
//     currency
//   } = useContext(ShopContext)

//   const [wishlistedProducts, setWishlistedProducts] = useState([])

//   // Filter products that are in the wishlist by matching product._id with keys in wishlistItems
//   useEffect(() => {
//     if (products.length > 0 && wishlistItems) {
//       const filteredProducts = products.filter(product =>
//         wishlistItems.hasOwnProperty(product._id)
//       )
//       setWishlistedProducts(filteredProducts)
//       console.log(wishlistItems)
//     }
//   }, [products, wishlistItems])

//   const handleRemoveFromWishlist = (itemId) => {
//     removeFromWishlist(itemId)
//     toast.success("Removed from wishlist")
//   }

//   const handleMoveToCart = (itemId) => {
//     moveToCart(itemId)
//     toast.success("Moved to cart")
//   }

//   const settings = {
//     dots: true,
//     infinite: true,
//     slidesToShow: 2,
//     slidesToScroll: 1,
//     responsive: [
//       {
//         breakpoint: 640,
//         settings: {
//           slidesToShow: 1,
//           slidesToScroll: 1,
//           arrows: false,
//         },
//       },
//     ],
//   }


//   // useEffect(()=>{
//   //   console.log("Wishlisted products",wishlistedProducts)
//   // },[wishlistedProducts])

//   // If wishlist is empty
//   if (wishlistedProducts.length === 0) {
//     return (
//       <div className="py-12 text-center">
//         <Title text1={"Your"} text2={"Wishlist"} />
//         <div className="mt-8 p-6 bg-gray-50 rounded-lg max-w-lg mx-auto">
//           <p className="text-gray-600">Your wishlist is empty. Add items to your wishlist to see them here.</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="mb-4 overflow-hidden py-8">
//       <div className="text-left text-3xl lg:py-8 flex flex-col justify-center items-center gap-2">
//         {/* <Title text1={"Your"} text2={"Wishlisted Items"} /> */}
//         <p className="text-gray-600 text-sm">
//           {wishlistedProducts.length} {wishlistedProducts.length === 1 ? 'item' : 'items'} in your wishlist
//         </p>
//       </div>

//       {/* Grid layout for large screens */}
//       <div className="lg:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
//         {wishlistedProducts.map((item) => (
//           <WishlistItemCard
//             key={item._id}
//             item={item}
//             currency={currency}
//             onRemove={handleRemoveFromWishlist}
//             onMoveToCart={handleMoveToCart}
//           />
//         ))}
//       </div>


//     </div>
//   )
// }

// // Separate card component for each wishlist item
// const WishlistItemCard = ({ item, currency, onRemove, onMoveToCart }) => {
//   return (
//     <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 h-full flex flex-col">
//       <div className="overflow-hidden h-[200px] sm:h-[100px] lg:h-[400px] relative rounded-lg bg-black flex flex-col justify-center items-center">
//         {/* First Image (default) */}
//         <Link to={`/product/${item._id}`} className="text-gray-800 cursor-pointer block">
//           <img
//             className="absolute inset-0 h-full w-full object-cover transition-transform ease-in-out lg:group-hover:scale-105 lg:group-hover:opacity-0"
//             src={item.image[0]}
//             alt={item.name}
//             loading="lazy"
//           />

//           {/* Second Image (shows on hover) */}
//           <img
//             className="absolute inset-0 h-full w-full object-cover opacity-0 transition-all duration-500 ease-in-out lg:group-hover:opacity-100 lg:group-hover:scale-105"
//             src={item.image[1]}
//             alt={`${item.name} alternate view`}
//             loading="lazy"
//           />
//         </Link>

//         <button className="absolute bottom-12 sm:bottom-12  lg:bottom-4 opacity-100 sm:opacity-100  lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-300 ease-in-out bg-white text-black px-4 py-1 lg:px-8 lg:py-2 rounded-full shadow-sm font-medium  translate-y-10 lg:group-hover:translate-y-0 hover:bg-black hover:text-white text-xs sm:text-sm lg:text-base uppercase" onClick={async () => {
//           await addToCart(item.id); // Wait for the addToCart function to complete
//           openSlideCart() // Navigate to the cart page
//         }
//         } >
//           Add to Cart
//         </button>
//       </div>

//       {/* Action buttons */}
//       {/* <div className="flex mt-auto pt-3 gap-2">
//         <button
//           onClick={() => onMoveToCart(item._id)}
//           className="flex-1 bg-black text-white py-2 rounded-md hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
//         >
//           <FaShoppingCart className="text-sm" />
//           <span>Move to Cart</span>
//         </button>

//         <button
//           onClick={() => onRemove(item._id)}
//           className="p-2 bg-red-50 text-red-500 rounded-md hover:bg-red-100 transition-colors"
//           title="Remove from wishlist"
//         >
//           <FaTrash />
//         </button>
//       </div> */}

//       <div className="mx-4 my-4">
//         <h3 className="text-base font-medium text-gray-800">{item.name}</h3>

//         <div className="flex items-center mt-1 ">
//           <p className="text-[12px] sm:text-[10px] lg:text-sm font-semibold text-gray-800 w-1/2">
//             {currency}{item.price.toFixed(2)}
//           </p>

//           <div className='flex w-1/2 gap-4 justify-end '>
//             <button
//               onClick={() => onMoveToCart(item._id)}
//               className="bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
//               title="Move to Cart"
//             >
//               <FaShoppingCart className="text-sm" />

//             </button>

//             <button
//               onClick={() => onRemove(item._id)}
//               className="py-2 px-4  bg-red-50 text-red-500 rounded-md hover:bg-red-100 transition-colors"
//               title="Remove from wishlist"
//             >
//               <FaTrash />
//             </button>
//           </div>
//           {/* {originalPrice > 0 && (
//             <p className="text-[12px] sm:text-[10px] lg:text-sm text-gray-500 line-through ml-2">
//               {currency}{item.originalPrice.toFixed(2)}
//             </p>
//           )} */}
//         </div>

//         {/* Color Options */}
//         {/* {colors.length > 0 && (
//             <div className="flex mt-2 gap-1">
//               {colors.map((color, index) => (
//                 <div
//                   key={index}
//                   className="w-6 h-6 rounded-full border border-gray-300"
//                   style={{ backgroundColor: color }}
//                 />
//               ))}
//             </div>
//           )} */}


//         {/* <div className="flex mt-auto pt-3 gap-4">
//           <button
//             onClick={() => onMoveToCart(item._id)}
//             className="flex-1 bg-black text-white py-2 rounded-md hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
//           >
//             <FaShoppingCart className="text-sm" />
//             <span>Move to Cart</span>
//           </button>

//           <button
//             onClick={() => onRemove(item._id)}
//             className="p-2 bg-red-50 text-red-500 rounded-md hover:bg-red-100 transition-colors"
//             title="Remove from wishlist"
//           >
//             <FaTrash />
//           </button>
//         </div> */}
//       </div>




//     </div>

//   )
// }

// export default WishlistItems



import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title'
import { FaShoppingCart, FaTrash } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'

const WishlistItems = () => {
  const {
    products,
    wishlistItems,
    removeFromWishlist,
    moveToCart,
    currency
  } = useContext(ShopContext)

  const [wishlistedProducts, setWishlistedProducts] = useState([])

  useEffect(() => {
    if (products.length > 0 && wishlistItems) {
      // Extract itemId and attributes from wishlistItems
      const formattedWishlist = Object.entries(wishlistItems).map(([key, value]) => {
        return {
          itemId: value.itemId,
          attributes: value.attributes,
          product: products.find(product => product._id === value.itemId)
        }
      }).filter(item => item.product) // Filter out unmatched items

      setWishlistedProducts(formattedWishlist)
    }
  }, [products, wishlistItems])

  const handleRemoveFromWishlist = (itemId, attributes) => {
    removeFromWishlist(itemId, attributes)
    toast.success("Removed from wishlist")
  }

  const handleMoveToCart = (itemId, attributes) => {
    moveToCart(itemId, attributes)
    toast.success("Moved to cart")
  }

  if (wishlistedProducts.length === 0) {
    return (
      <div className="py-12 text-center">
        <Title text1={"Your"} text2={"Wishlist"} />
        <div className="mt-8 p-6 bg-gray-50 rounded-lg max-w-lg mx-auto">
          <p className="text-gray-600">Your wishlist is empty. Add items to your wishlist to see them here.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mb-4 overflow-hidden py-8">
      <div className="text-left text-3xl lg:py-8 flex flex-col justify-center items-center gap-2">
        <p className="text-gray-600 text-sm">
          {wishlistedProducts.length} {wishlistedProducts.length === 1 ? 'item' : 'items'} in your wishlist
        </p>
      </div>

      <div className="lg:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {wishlistedProducts.map(({ itemId, attributes, product }) => (
          <WishlistItemCard
            key={itemId + JSON.stringify(attributes)}
            item={product}
            currency={currency}
            attributes={attributes}
            onRemove={handleRemoveFromWishlist}
            onMoveToCart={handleMoveToCart}
          />
        ))}
      </div>
    </div>
  )
}

const WishlistItemCard = ({ item, currency, attributes, onRemove, onMoveToCart }) => {
  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 h-full flex flex-col">
      <div className="overflow-hidden h-[200px] sm:h-[100px] lg:h-[400px] relative rounded-lg bg-black flex flex-col justify-center items-center">
        <Link to={`/product/${item._id}`} className="text-gray-800 cursor-pointer block">
          <img
            className="absolute inset-0 h-full w-full object-cover transition-transform ease-in-out lg:group-hover:scale-105 lg:group-hover:opacity-0"
            src={item.image[0]}
            alt={item.name}
            loading="lazy"
          />
          <img
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-all duration-500 ease-in-out lg:group-hover:opacity-100 lg:group-hover:scale-105"
            src={item.image[1]}
            alt={`${item.name} alternate view`}
            loading="lazy"
          />
        </Link>
      </div>

      <div className="mx-4 my-4">
        <h3 className="text-base font-medium text-gray-800">{item.name}</h3>

        {/* Display Selected Attributes */}
        <div className="mt-2 text-sm text-gray-600">
          {Object.entries(attributes).map(([key, value]) => (
            <p key={key} className="capitalize"><strong>{key}:</strong> {value}</p>
          ))}
        </div>

        <div className="flex items-center mt-1 ">
          <p className="text-[12px] sm:text-[10px] lg:text-sm font-semibold text-gray-800 w-1/2">
            {currency}{item.price.toFixed(2)}
          </p>

          <div className='flex w-1/2 gap-4 justify-end '>
            <button
              onClick={() => onMoveToCart(item._id, attributes)}
              className="bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
              title="Move to Cart"
            >
              <FaShoppingCart className="text-sm" />
            </button>

            <button
              onClick={() => onRemove(item._id, attributes)}
              className="py-2 px-4  bg-red-50 text-red-500 rounded-md hover:bg-red-100 transition-colors"
              title="Remove from wishlist"
            >
              <FaTrash />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WishlistItems

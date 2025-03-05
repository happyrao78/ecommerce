// import React, { useContext, useEffect, useState } from 'react'
// import { ShopContext } from '../context/ShopContext'
// import { assets } from '../assets/frontend_assets/assets';
// import Title from '../components/Title';
// import ProductItem from '../components/ProductItem';

// const Collection = () => {

//   const { products,search,showSearch,subCategoryData } = useContext(ShopContext)
//   const [showFilter, setShowFilter] = useState(false);
//   const [filterProducts, setFilterProducts] = useState([]);
//   const [category, setCategory] = useState([])
//   const [subCategory, setSubCategory] = useState([])
//   const [sortType,setSortType]=useState("relevant");

//   const toggleCategory = (e) => {
//     if (category.includes(e.target.value)) {
//       setCategory(prev => prev.filter(item => item !== e.target.value))
//     } else {
//       setCategory(prev => [...prev,e.target.value])
//     }
//   }

//   const toggleSubCategory = (e) => {
//     if (subCategory.includes(e.target.value)) {
//       setSubCategory(prev => prev.filter(item => item !== e.target.value))
//     } else {
//       setSubCategory(prev => [...prev,e.target.value])
//     }
//   }

//   // useEffect(() => {
//   //   setFilterProducts(products)
//   // }, [])

//   const applyFilter = () => {
//     let productsCopy = products.slice();

//     if(showSearch && search){
//       productsCopy= productsCopy.filter(item=>item.name.toLowerCase().includes(search.toLowerCase()))
//     }

//     if (category.length > 0 ) {
//       productsCopy = productsCopy.filter(item =>category.includes(item.category) )
//     }
//     if (subCategory.length > 0 ) {
//       productsCopy = productsCopy.filter(item =>subCategory.includes(item.subCategory) )
//     }
//     setFilterProducts(productsCopy)
//   }

//   const sortProduct =()=>{
//     let fpCopy = filterProducts.slice();
//     switch(sortType){
//       case 'low-high':
//         setFilterProducts(fpCopy.sort((a,b)=>(a.price-b.price)))
//         break;
      
//         case 'high-low':
//           setFilterProducts(fpCopy.sort((a,b)=>(b.price-a.price)))
//           break;

//         default:
//           applyFilter();
//           break;
//     }
//   }

//   useEffect(() => {
//     applyFilter();
//   }, [category,subCategory,search,showSearch,products])

//   useEffect(() => {
//     sortProduct();
//   }, [sortType])

  

//   return (
//     <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t'>
//       {/* Filter Options */}
//       <div className='min-w-60'>
//         <p className='my-2 text-xl flex items-center cursor-pointer gap-2' onClick={() => setShowFilter(!showFilter)}>FILTERS
//           <img src={assets.dropdown_icon}
//             className={`h-3 sm:hidden ${showFilter ? 'rotate-90' : ''}`}
//             alt="" />
//         </p>

//         {/* Catgory Filter */}
//         <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? '' : 'hidden'
//           } sm:block`}>
//           <p className='mb-3 text-sm font-medium'>CATEGORIES</p>
//           <div className='flex flex-col gap-2 textsm font-light text-gray-700'>

//             <p className='flex gap-2'>
//               <input type="checkbox" className='w-3' value={'Men'} onChange={toggleCategory} />Men
//             </p>
//             <p className='flex gap-2'>
//               <input type="checkbox" className='w-3' value={'Women'} onChange={toggleCategory} />Women
//             </p>
//             <p className='flex gap-2'>
//               <input type="checkbox" className='w-3' value={'Kids'} onChange={toggleCategory} />Kids
//             </p>

//           </div>
//         </div>
//         {/* Sub Category Filter */}
//         <div className={`border border-gray-300 pl-5 py-3 my-5 ${showFilter ? '' : 'hidden'
//           } sm:block`}>
//           <p className='mb-3 text-sm font-medium'>TYPE</p>
//           <div className='flex flex-col gap-2 textsm font-light text-gray-700'>

//             <p className='flex gap-2'>
//               <input type="checkbox" className='w-3' value={'Topwear'} onChange={toggleSubCategory} />Topwear
//             </p>
//             <p className='flex gap-2'>
//               <input type="checkbox" className='w-3' value={'Bottomwear'} onChange={toggleSubCategory} />Bottomwear
//             </p>
//             <p className='flex gap-2'>
//               <input type="checkbox" className='w-3' value={'Winterwear'} onChange={toggleSubCategory} />Winterwear
//             </p>

//           </div>
//         </div>
//       </div>
//       {/* Right Part */}
//       <div className='flex-1 '>
//         <div className='flex justify-between text-base sm-text-2xl mb-4 '>
//           {/* <Title text1={'ALL'} text2={'COLLECTIONS'} /> */}
//           {/* Product Sort */}
//           <select className='border-2 border-gray-300 text-sm px-2 py-1'
//           onChange={(e)=>setSortType(e.target.value)}>
//             <option value="relevant">Sort By: Relevant</option>
//             <option value="low-high">Sort By: Low To High</option>
//             <option value="high-low">Sort By: High to Low</option>
//           </select>
//         </div>
//         {/* Map Products */}
//         <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 gap-y-6 my-4'>
//           {
//             filterProducts.map((item, index) => (
//               <ProductItem key={index} id={item._id} name={item.name} price={item.price} originalPrice={item.originalPrice} image={item.image}  reviews={item.reviews} attributes={item.attributes}/>
//             ))
//           }
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Collection



import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/frontend_assets/assets';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';

const Collection = () => {
  const { products, search, showSearch, subCategoryData } = useContext(ShopContext)
  
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([])
  const [subCategory, setSubCategory] = useState([])
  const [sortType, setSortType] = useState("relevant");

  // Dynamic category and subcategory generation
  const [availableCategories, setAvailableCategories] = useState([]);
  const [availableSubCategories, setAvailableSubCategories] = useState([]);

  // Populate available categories and subcategories from products
  useEffect(() => {
    // Get unique categories from products
    const uniqueCategories = [...new Set(products.map(item => item.category))];
    setAvailableCategories(uniqueCategories);

    // Get unique subcategories from products
    const uniqueSubCategories = [...new Set(products.map(item => item.subCategory))];
    setAvailableSubCategories(uniqueSubCategories);
  }, [products]);

  const toggleCategory = (e) => {
    const value = e.target.value;
    setCategory(prev => 
      prev.includes(value) 
        ? prev.filter(item => item !== value)
        : [...prev, value]
    );
  }

  const toggleSubCategory = (e) => {
    const value = e.target.value;
    setSubCategory(prev => 
      prev.includes(value) 
        ? prev.filter(item => item !== value)
        : [...prev, value]
    );
  }

  const applyFilter = () => {
    let productsCopy = products.slice();

    // Search filter
    if (showSearch && search) {
      productsCopy = productsCopy.filter(item => 
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Category filter
    if (category.length > 0) {
      productsCopy = productsCopy.filter(item => 
        category.includes(item.category)
      );
    }

    // Subcategory filter
    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter(item => 
        subCategory.includes(item.subCategory)
      );
    }

    setFilterProducts(productsCopy);
  }

  const sortProduct = () => {
    let fpCopy = filterProducts.slice();
    switch(sortType) {
      case 'low-high':
        setFilterProducts(fpCopy.sort((a,b) => a.price - b.price));
        break;
      
      case 'high-low':
        setFilterProducts(fpCopy.sort((a,b) => b.price - a.price));
        break;

      default:
        applyFilter();
        break;
    }
  }

  useEffect(() => {
    applyFilter();
  }, [category, subCategory, search, showSearch, products])

  useEffect(() => {
    sortProduct();
  }, [sortType])

  return (
    <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t'>
      {/* Filter Options */}
      <div className='min-w-60'>
        <p className='my-2 text-xl flex items-center cursor-pointer gap-2' onClick={() => setShowFilter(!showFilter)}>
          FILTERS
          <img 
            src={assets.dropdown_icon}
            className={`h-3 sm:hidden ${showFilter ? 'rotate-90' : ''}`}
            alt="" 
          />
        </p>

        {/* Category Filter */}
        <div className={`border border-gray-300 pl-5 py-3 mt-6 rounded-lg ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className='mb-3 text-sm font-medium'>CATEGORIES</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700 '>
            {availableCategories.map((cat, index) => (
              <p key={index} className='flex gap-2'>
                <input 
                  type="checkbox" 
                  className='px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500' 
                  value={cat} 
                  onChange={toggleCategory} 
                />
                {cat[0].toUpperCase()+cat.slice(1)}
              </p>
            ))}
          </div>
        </div>

        {/* Sub Category Filter */}
        <div className={`border border-gray-300 pl-5 py-3 my-5 rounded-lg ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className='mb-3 text-sm font-medium'>SUBCATEGORIES</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
            {availableSubCategories.map((subCat, index) => (
              <p key={index} className='flex gap-2'>
                <input 
                  type="checkbox" 
                  className='px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500' 
                  value={subCat} 
                  onChange={toggleSubCategory} 
                />
                {subCat[0].toUpperCase()+subCat.slice(1)}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Right Part */}
      <div className='flex-1 '>
        <div className='flex justify-end text-base sm-text-2xl mb-4 '>
          <select 
            className='px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 '
            onChange={(e) => setSortType(e.target.value)}
          >
            <option value="relevant">Sort By: Relevant</option>
            <option value="low-high">Sort By: Low To High</option>
            <option value="high-low">Sort By: High to Low</option>
          </select>
        </div>

        {/* Map Products */}
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 gap-y-6 my-4 lg:mt-6'>
          {filterProducts.map((item, index) => (
            <ProductItem 
              key={index} 
              id={item._id} 
              name={item.name} 
              price={item.price} 
              originalPrice={item.originalPrice} 
              image={item.image}  
              reviews={item.reviews} 
              attributes={item.attributes}
            />
          ))}
        </div>

        {/* No Products Found Message */}
        {filterProducts.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            No products found matching your filters.
          </div>
        )}
      </div>
    </div>
  )
}

export default Collection
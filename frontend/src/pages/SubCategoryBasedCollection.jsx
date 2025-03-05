import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';
import { Breadcrumbs } from '../components/Breadcrumbs';
import heroslider from '../assets/ecommerce-islam/hero-slider.jpg';


export const SubCategoryBasedCollectionHero = () => {
    const { categoryName, subCategoryName } = useParams();
    return (
        <div className=''>
            <div className='relative h-[150px] sm:[100px] lg:h-[300px] w-screen bg-gray-200 overflow-hidden'>
                <img src={heroslider} alt="" className='h-auto w-screen object-cover object-center' />

                <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center flex flex-col gap-2 justify-center items-center z-10'>
                    <h1 className='text-black text-2xl sm:text-2xl lg:text-4xl font-medium'>{categoryName.charAt(0).toUpperCase() + categoryName.slice(1)} Collection</h1>
                    <Breadcrumbs paths={[{ href: '/', label: 'Home' }, { href: `/category/${categoryName}`, label: `${categoryName.charAt(0).toUpperCase() + categoryName.slice(1)}` }, { href: `/category/${categoryName}/${subCategoryName}`, label: `${subCategoryName.charAt(0).toUpperCase() + subCategoryName.slice(1)}` }]} /></div>
                <div className='absolute bg-black/20 inset-0'></div>
            </div>
        </div>
    )
}





const SubCategoryBasedCollection = () => {
  const { categoryName, subCategoryName } = useParams();
  const { products } = useContext(ShopContext);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    // Filter products by both category and subcategory from URL parameters
    const filtered = products.filter(
      item => item.category === categoryName && item.subCategory === subCategoryName
    );
    setFilteredProducts(filtered);
  }, [categoryName, subCategoryName, products]);

  return (
   
     
     
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6 my-4 mt-10 lg:mt-20'>
        {filteredProducts.length > 0 ? (
          filteredProducts.map((item, index) => (
            <ProductItem 
              key={index} 
              id={item._id} 
              name={item.name} 
              price={item.price} 
              originalPrice={item.originalPrice} 
              image={item.image} 
              reviews={item.reviews}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p>No products found in {categoryName} {subCategoryName}.</p>
            <Link to={`/category/${categoryName}`} className=" hover:underline block mt-2">
              View all {categoryName} products
            </Link>
          </div>
        )}
      </div>
  );
}

export default SubCategoryBasedCollection;
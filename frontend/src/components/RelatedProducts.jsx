import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import ProductItem from './ProductItem';
import Title from './Title';

const RelatedProducts = ({category,subCategory}) => {
    const {products} =useContext(ShopContext);
    const [related,setRelated] = useState([]);

    useEffect(()=>{
        if(products.length>0){
            let productsCopy= products.slice();
            productsCopy=productsCopy.filter((item)=>category===item.category)
            productsCopy=productsCopy.filter((item)=>subCategory===item.subCategory)

            setRelated(productsCopy.slice(0,4))
        }
    },[products])

  return (
    <div className='my-12'>
        <div className='text-center text-3xl sm:text:3xl lg:text-4xl py-2'>
            <h1 className='font-medium'>Related Products</h1>
        </div>
        <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 gap-y-6 mt-4'>
            {
                related.map((item,index)=>(
                    <ProductItem key={index} id={item._id} name={item.name}
                    price={item.price}
                    originalPrice={item.originalPrice}
                    image={item.image}/>
                ))
            }
        </div>

    </div>
  )
}

export default RelatedProducts
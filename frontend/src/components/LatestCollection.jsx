import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title'
import ProductItem from './ProductItem'
import Slider from 'react-slick';

const LatestCollection = () => {

  const { products } = useContext(ShopContext)
  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
    setLatestProducts(products.slice(0, 8));
  }, [products])

  const settings = {
    dots: true,
    infinite: true,

    slidesToShow: 2,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 640, // Adjust for small devices
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          arrows: false,
        },
      },
    ],
  };
  return (
    <div
      className="mb-4 overflow-hidden"
      // style={{ boxShadow: '4px 4px 10px rgba(0, 0, 0, 0.25)' }}
    >
      <div className="text-center text-3xl lg:py-8 flex flex-col items-center justify-center gap-2">
        <Title text1={"Today's"} text2={'Top Picks'} />
        <p className="text-gray-600 w-full lg:w-3/4 text-sm  text-center mx-auto">
          Fresh Styles In !
        </p>
      </div>

      {/* Grid layout for large screens */}
      <div className="hidden lg:grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 ">
        {latestProducts.map((item, index) => (
          <ProductItem
            key={index}
            id={item._id}
            image={item.image}
            name={item.name}
            price={item.price}
            originalPrice={item.originalPrice}
            reviews={item.reviews}
            attributes={item.attributes}
          />
        ))}
      </div>

      {/* Slider for mobile and small screens */}
      <div className="lg:hidden lg:px-4 lg:mx-0 mt-8">
        <Slider {...settings}>
          {latestProducts.map((item, index) => (
            <div key={index} className='px-2'>
              <ProductItem
                id={item._id}
                image={item.image}
                name={item.name}
                price={item.price}
                originalPrice={item.originalPrice}
                reviews={item.reviews}
              />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  )
}

export default LatestCollection
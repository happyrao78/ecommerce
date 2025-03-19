import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Slider from 'react-slick';
import Title from './Title';
import ProductItem from './ProductItem';

const BestSeller = () => {
  const { products } = useContext(ShopContext);
  const [bestSeller, setBestSeller] = useState([]);

  useEffect(() => {
    const bestProduct = products.filter((item) => item.bestseller);
    setBestSeller(bestProduct.slice(0, 10));
  }, [products]);

  const settings = {
    dots: true,
    infinite: false,

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
    <section
      className="mb-4 overflow-hidden" id="best-selling"
      // style={{ boxShadow: '4px 4px 10px rgba(0, 0, 0, 0.25)' }}
    >
      <div className="text-center text-3xl lg:py-8 flex flex-col items-center justify-center gap-2">
        <Title text1={"Best"} text2={'Selling Products'} />
        <p className="text-gray-600 w-full lg:w-3/4 text-sm  text-center mx-auto">
          Fresh Styles In !
        </p>
      </div>

      {/* Grid layout for large screens */}
      <div className="lg:grid grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-8 my-4 lg:my-2 ">
        {bestSeller.map((item, index) => (
          <ProductItem
            key={index}
            id={item._id}
            image={item.image}
            name={item.name}
            price={item.price}
            originalPrice={item.originalPrice}
            reviews={item.reviews}
            attributes={item.attributes}
            quantity={item.quantity}
          />
        ))}
      </div>

      {/* Slider for mobile and small screens */}
      {/* <div className="lg:hidden lg:px-4 lg:mx-0 mt-8">
        <Slider {...settings}>
          {bestSeller.map((item, index) => (
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
      </div> */}
    </section>
  );
};

export default BestSeller;

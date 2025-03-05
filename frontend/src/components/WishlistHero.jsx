import React from 'react'
import heroslider from '../assets/ecommerce-islam/hero-slider.jpg'
import { Breadcrumbs } from './Breadcrumbs'
import Title from './Title'

const WishlistHero = () => {
  return (
    <div className=''>
        <div className='relative h-[150px] sm:[100px] lg:h-[300px] w-screen bg-gray-200 overflow-hidden'>
            <img src={heroslider} alt="" className='h-auto w-screen object-cover object-center'/>
            
            <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center flex flex-col gap-2 justify-center items-center z-10'>
            <h1 className='text-black text-2xl sm:text-2xl lg:text-4xl font-medium'>Your Wishlist</h1>
            <Breadcrumbs paths={[{href:'/',label:'Home'},{href:'/wishlist',label:'Wishlist'}]}/></div>
            <div className='absolute bg-black/20 inset-0'></div>
        </div>
    </div>
  )
}

export default WishlistHero
import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';
import Button from './Button';
import { Link } from 'react-router-dom';

const CartTotal = () => {
  const { currency, getCartAmount, delivery_fee, navigate } = useContext(ShopContext);

  // Logic for Free Shipping
  const isFreeShipping = getCartAmount() > 200;
  const finalDeliveryFee = isFreeShipping ? 0 : delivery_fee;

  return (
    <div className='w-full bg-gray-100 p-4 sm:p-4 lg:p-8 rounded-lg'>
      <div className='text-2xl '>
        <h1 className='text-2xl font-medium py-4 '>Cart Total</h1>

      </div>
      <hr className='flex justify-between border-b border-gray-200' />

      <div className='flex flex-col gap-2 mt-2 text-sm'>
        {/* Subtotal */}
        <div className='flex justify-between '>
          <p>SubTotal</p>
          <p>{currency}{getCartAmount()}.00</p>
        </div>
        <hr className='flex justify-between border-b border-gray-200' />

        {/* Shipping Fee */}
        <div className='flex justify-between items-center'>
          <p>Shipping Fee</p>
          {isFreeShipping ? (
            <div className='flex items-center gap-2'>
              <p className='line-through text-gray-400'>{currency}{delivery_fee}.00</p>
              <p className='text-green-600 font-semibold'>Free Shipping</p>
            </div>
          ) : (
            <p>{currency}{delivery_fee}.00</p>
          )}
        </div>
        <hr className='flex justify-between border-b border-gray-200' />

        {/* Total */}
        <div className='flex justify-between'>
          <b>Total</b>
          <b>
            {currency}
            {getCartAmount() === 0 ? 0 : getCartAmount() + finalDeliveryFee}.00
          </b>
        </div>
        <hr className='flex justify-between border-b border-gray-200' />

        {/* Checkout Section */}
        {getCartAmount() > 0 && (

          <div className="text-center sm:text-center  justify-center items-center flex flex-col gap-4 my-8">
            <Button className="w-full sm:w-full lg:w-3/4" onClick={() => navigate('/place-order')}>
              PROCEED TO CHECKOUT
            </Button>
            <Link to="/" className='uppercase text-xs text-black underline underline-offset-1'>or Continue shopping</Link>
          </div>

        )}
      </div>
    </div>
  )
}

export default CartTotal;

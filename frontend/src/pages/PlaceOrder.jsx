import React, { useContext, useState, useEffect } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { assets } from '../assets/frontend_assets/assets'
import { ShopContext } from '../context/ShopContext'
import { toast } from 'react-toastify'
import axios from 'axios'
import Button from '../components/Button'
import { IoIosArrowDown } from 'react-icons/io'
import visa from "../assets/ecommerce-islam/visa.png";
import payment2 from "../assets/ecommerce-islam/payment2.png";
import payment3 from "../assets/ecommerce-islam/payment3.png";
import paypal from "../assets/ecommerce-islam/paypal.png";


const PlaceOrder = () => {

  const { navigate, backendUrl, cartItems, setCartItems, token, getCartAmount, delivery_fee, products, currency, updateQuantity } = useContext(ShopContext)
  const [method, setMethod] = useState('cod');
  const [formData, setFormdata] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",

  })
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [cartData, setCartData] = useState([]);
  const [couponCode, setCouponCode] = useState('');
const [appliedCoupon, setAppliedCoupon] = useState(null);
const [couponError, setCouponError] = useState('');
const [discountAmount, setDiscountAmount] = useState(0);

// Add this function to validate the coupon
const validateCoupon = async () => {
  if (!couponCode.trim()) {
    setCouponError('Please enter a coupon code');
    return;
  }
  
  try {
    const response = await axios.post(
      `${backendUrl}/api/discount/validate`, 
      { code: couponCode },
      { headers: { token } }
    );
    
    if (response.data.success) {
      setAppliedCoupon(response.data.data);
      
      // Calculate discount amount
      const cartTotal = getCartAmount();
      let discount = 0;
      
      if (response.data.data.discountType === 'percentage') {
        discount = (cartTotal * response.data.data.discountValue) / 100;
        // Apply max discount if set
        if (response.data.data.maxDiscount && discount > response.data.data.maxDiscount) {
          discount = response.data.data.maxDiscount;
        }
      } else {
        // Fixed amount discount
        discount = response.data.data.discountValue;
      }
      
      setDiscountAmount(discount);
      setCouponError('');
      toast.success('Coupon applied successfully!');
    } else {
      setCouponError(response.data.error || 'Invalid coupon code');
      setAppliedCoupon(null);
      setDiscountAmount(0);
    }
  } catch (error) {
    console.log(error);
    setCouponError(error.response?.data?.error || 'Error validating coupon');
    setAppliedCoupon(null);
    setDiscountAmount(0);
  }
};

// Modify your getCartAmount function to account for discounts
const getTotalAmount = () => {
  const cartTotal = getCartAmount();
  return cartTotal + delivery_fee - discountAmount;
};

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
    console.log("CartData in cart", cartData)
  }, [cartItems]);

  const fetchCountries = async () => {
    try {
      const { data } = await axios.get('https://api.countrystatecity.in/v1/countries', {
        headers: {
          "X-CSCAPI-KEY": "eFRjSkFKckJCb1dHTnlNMzhhYzVYa1lOUm5SUnpwU0xVeWpDc2Yzbw=="
        }
      });
      setCountries(data);
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };

  const fetchStates = async (countryCode) => {
    try {
      const { data } = await axios.get(`https://api.countrystatecity.in/v1/countries/${countryCode}/states`, {
        headers: {
          "X-CSCAPI-KEY": "eFRjSkFKckJCb1dHTnlNMzhhYzVYa1lOUm5SUnpwU0xVeWpDc2Yzbw=="
        }
      });
      setStates(data);
    } catch (error) {
      console.error("Error fetching states:", error);
    }
  };

  const fetchCities = async (countryCode, stateCode) => {
    try {
      const { data } = await axios.get(`https://api.countrystatecity.in/v1/countries/${countryCode}/states/${stateCode}/cities`, {
        headers: {
          "X-CSCAPI-KEY": "eFRjSkFKckJCb1dHTnlNMzhhYzVYa1lOUm5SUnpwU0xVeWpDc2Yzbw=="
        }
      });
      setCities(data);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }

  };
  useEffect(() => {
    fetchCountries();
  }, []);
  const handleCountryChange = (e) => {
    const countryCode = e.target.value;
    setFormdata({ ...formData, country: countryCode });
    fetchStates(countryCode);
  };

  const handleStateChange = (e) => {
    const stateCode = e.target.value;
    setFormdata({ ...formData, state: stateCode });
    fetchCities(formData.country, stateCode);
  };





  const onChangeHandler = async (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setFormdata((data) => ({ ...data, [name]: value }))
    console.log(formData);


  }

  const initPay = async (order) => {
    console.log("Oreder",order.id)
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Order Payment",
      description: appliedCoupon ? `Order Payment (Coupon: ${appliedCoupon.code})` : "Order Payment",
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        console.log(response);
        try {
          const { data } = await axios.post(backendUrl + "/api/order/verifyRazorpay", { ...response,

            
          }, { headers: { token } })
          if (data.success) {
            navigate("/orders")
            setCartItems({})
          }
        } catch (error) {
          console.log(error);
          toast.error(error.message)

        }

      }
    }
    const rzp = new window.Razorpay(options)
    rzp.open()
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault()

    if (!token) {
      toast.error("Login to Place Order")
      return
    }

    try {
      let orderItems = []
      for (const cartItemKey in cartItems) {
        const item = cartItems[cartItemKey];

        if (item && item.quantity > 0) {
          // Extract the itemId from the composite key or use the stored itemId property
          const itemId = item.itemId || cartItemKey.split('_')[0];

          // Find product info
          const itemInfo = structuredClone(products.find(product => product._id === itemId));

          if (itemInfo) {
            // Add quantity and attributes to the product info
            itemInfo.quantity = item.quantity;
            itemInfo.attributes = item.attributes || {};

            // Push to order items
            orderItems.push(itemInfo);
          }
        }
      }

      let orderData = {
        address: formData,
        items: orderItems,
        amount: getTotalAmount(),
        originalAmount: getCartAmount()+delivery_fee,
        discountAmount: discountAmount,
        order_id: Math.random(), // Replace with actual order ID
        couponCode : appliedCoupon ? appliedCoupon.code : null,
      }

      console.log("OrderData", orderData);
      console.log(method);



      switch (method) {
        // api calls for cod
        case 'cod':
          console.log("inside case");

          const response = await axios.post(backendUrl + "/api/order/place", orderData, { headers: { token } })
          console.log(response);



          if (response.data.success) {
            setCartItems({})
            navigate("/orders")
            toast.success(response.data.message)
          } else {
            toast.error(response.data.message)
          }
          break;

        case "stripe":
          const responseStripe = await axios.post(backendUrl + "/api/order/stripe", orderData, { headers: { token } })
          if (responseStripe.data.success) {
            const { session_url } = responseStripe.data;
            window.location.replace(session_url)
          } else {
            toast.error(responseStripe.data.message)
          }
          break;

        case "razorpay":

          const responseRazorpay = await axios.post(backendUrl + "/api/order/razorpay", orderData, { headers: { token } })

          if (responseRazorpay.data.success) {
            // console.log(responseRazorpay.data.order);
            initPay(responseRazorpay.data.order);
            console.log(responseRazorpay)
            // navigate("/orders")
            toast.success(response.data.message)

          }
          break;
        default:
          break;
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message)

    }
  }


  return (
    <div className='flex flex-col lg:flex-row lg:justify-between gap-10 mt-10'>

      <div className='lg:w-1/2 w-full border p-4 lg:p-8 rounded-lg'>
        <div className='w-full '>
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
                            {value[0].toUpperCase() + value.slice(1)}
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
                        <span className="font-medium">{currency}{(productData.price * item.quantity).toFixed(2)}</span>
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
          {/* Coupon Code Section */}
<div className='w-full bg-gray-100 p-4 sm:p-4 lg:p-8 rounded-lg mt-4'>
  <h1 className='text-2xl font-medium py-4'>Apply Discount Coupon</h1>
  
  <div className='flex gap-2'>
    <input 
      type="text" 
      placeholder='Enter coupon code'
      className='border border-gray-300 rounded-lg py-2 px-4 w-full' 
      value={couponCode}
      onChange={(e) => setCouponCode(e.target.value)}
    />
    <button 
      type="button"
      onClick={validateCoupon}
      className='bg-black text-white px-4 py-2 rounded-lg'
    >
      Apply
    </button>
  </div>
  
  {couponError && (
    <p className='text-red-500 text-sm mt-2'>{couponError}</p>
  )}
  
  {appliedCoupon && (
    <div className='mt-3 p-3 bg-green-50 border border-green-200 rounded-lg'>
      <div className='flex justify-between items-center'>
        <div>
          <p className='font-medium'>{appliedCoupon.code}</p>
          <p className='text-sm text-gray-600'>
            {appliedCoupon.discountType === 'percentage' 
              ? `${appliedCoupon.discountValue}% off` 
              : `${currency}${appliedCoupon.discountValue} off`}
          </p>
        </div>
        <button 
          type="button" 
          className='text-red-500'
          onClick={() => {
            setAppliedCoupon(null);
            setDiscountAmount(0);
            setCouponCode('');
          }}
        >
          Remove
        </button>
      </div>
    </div>
  )}
</div>
{/* Modify your CartTotal component or add this directly in PlaceOrder */}
{/* Order Summary */}
<div className='w-full bg-gray-100 p-4 sm:p-4 lg:p-8 rounded-lg mt-4'>
  <h1 className='text-2xl font-medium py-4'>Order Summary</h1>
  
  <div className='space-y-2'>
    <div className='flex justify-between'>
      <span>Subtotal:</span>
      <span>{currency}{getCartAmount().toFixed(2)}</span>
    </div>
    
    <div className='flex justify-between'>
      <span>Delivery Fee:</span>
      <span>{currency}{delivery_fee.toFixed(2)}</span>
    </div>
    
    {appliedCoupon && (
      <div className='flex justify-between text-green-600'>
        <span>Discount ({appliedCoupon.code}):</span>
        <span>-{currency}{discountAmount.toFixed(2)}</span>
      </div>
    )}
    
    <div className='flex justify-between font-bold text-lg pt-2 border-t border-gray-300 mt-2'>
      <span>Total:</span>
      <span>{currency}{getTotalAmount().toFixed(2)}</span>
    </div>
  </div>
</div>
        </div>
      </div>
      <form className='lg:w-1/2 w-full flex flex-col sm:flex-col lg:flex-col justify-between gap-10 lg:gap-8 lg:overflow-y-scroll lg:max-h-[80vh]' onSubmit={onSubmitHandler}>
        {/* Left side */}
        <div className='flex flex-col gap-4 w-full  p-4 lg:p-8 bg-gray-100 rounded-lg text-sm sm:text-sm lg:text-base'>


          <h1 className='text-2xl font-medium '>Information</h1>


          <div className='flex gap-4'>
            <input type="text" placeholder='First Name'
              className='border border-gray-300 rounded-lg py-2 px-4 w-full' required onChange={onChangeHandler} name="firstName" value={formData.firstName}
            />
            <input type="text" placeholder='Last Name'
              className='border border-gray-300 rounded-lg py-2 px-4 w-full' required onChange={onChangeHandler} name="lastName" value={formData.lastName}
            />

          </div>
          <input type="email" placeholder='Email Address'
            className='border border-gray-300 rounded-lg py-2 px-4 w-full
          ' required onChange={onChangeHandler} name="email" value={formData.email}
          />
          <input type="text" placeholder='Street'
            className='border border-gray-300 rounded-lg py-2 px-4 w-full'
            required onChange={onChangeHandler} name="street" value={formData.street}

          />
          {/* <div className='flex gap-3'>
          <input type="text" placeholder='City'
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full' required onChange={onChangeHandler} name="city" value={formData.city}
          />
          <input type="text" placeholder='State'
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full' required onChange={onChangeHandler} name="state" value={formData.state}
          />

        </div> */}
          <div className='flex gap-4 '>
            <div className="relative w-full ">
              <select
                name="country"
                className='border border-gray-300 px-4 py-2 rounded-lg transition-all appearance-none w-full '
                required
                value={formData.country}
                onChange={handleCountryChange}
              >
                <option value="">Country</option>
                {countries.map((country) => (
                  <option key={country.iso2} value={country.iso2}>{country.name}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                <IoIosArrowDown />
              </div>
            </div>

            <div className='relative w-full flex'>

              <select
                name="state"
                className='border border-gray-300 px-4 py-2 rounded-lg transition-all appearance-none w-full'
                required
                value={formData.state}
                onChange={handleStateChange}
                disabled={!states.length}
              >
                <option value="">State</option>
                {states.map((state) => (
                  <option key={state.iso2} value={state.iso2}>{state.name}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                <IoIosArrowDown />
              </div>
            </div>
          </div>

          <div className='relative w-full flex'>

            <select
              name="city"
              className='border border-gray-300 px-4 py-2 rounded-lg transition-all appearance-none w-full'
              required
              value={formData.city}
              onChange={(e) => setFormdata({ ...formData, city: e.target.value })}
              disabled={!cities.length}
            >
              <option value="">City</option>
              {cities.map((city) => (
                <option key={city.name} value={city.name}>{city.name}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
              <IoIosArrowDown />
            </div>

          </div>

          <div className='flex gap-4'>
            <input type="number" placeholder='Zipcode'
              className='border border-gray-300 rounded-lg py-2 px-4 w-full' required onChange={onChangeHandler} name="zipcode" value={formData.zipcode}
            />
            {/* <input type="text" placeholder='Country'
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full' required onChange={onChangeHandler} name="country" value={formData.country}
          /> */}

          </div>

          <input type="number" placeholder='Phone No.'
            className='border border-gray-300 rounded-lg py-2 px-4 w-full'
            required onChange={onChangeHandler} name="phone" value={formData.phone}
          />





        </div>
        {/* <img src={assets.cashpayment} alt="" className='hidden sm:block w-1/3 h-full object-cover' /> */}
        {/* Right Side */}
        <div className='w-full  bg-gray-100 p-4 sm:p-4 lg:p-8 rounded-lg'>
          <h1 className='text-2xl font-medium py-4'>Choose Payment Option:</h1>

          <div className='space-y-4'>

            {/* Credit/Debit Card */}
            <div onClick={() => setMethod("card")} className={`border p-4 rounded-lg cursor-pointer ${method === 'card' ? 'border-black' : 'border-gray-300'}`}>
              <div className='flex items-center justify-between'>
                <label className='flex items-center gap-2'>
                  <input type="radio" name="paymentMethod" checked={method === 'card'} onChange={() => setMethod("card")} />
                  <span className="font-medium">Credit Card</span>
                </label>
                <div className='flex gap-2'>
                  <img src={visa} alt="Card Icons" className='h-5' />
                  <img src={payment2} alt="Card Icons" className='h-5' />
                  <img src={payment3} alt="Card Icons" className='h-5' />
                </div>
              </div>
              {method === 'card' && (
                <div className="mt-4 space-y-3">
                  <input type="text" placeholder='Name On Card' className='border border-gray-300 rounded-lg py-2 px-4 w-full' required />
                  <input type="text" placeholder='Card Numbers' className='border border-gray-300 rounded-lg py-2 px-4 w-full' required />
                  <div className='flex gap-4'>
                    <input type="text" placeholder='dd-mm-yyyy' className='border border-gray-300 rounded-lg py-2 px-4 w-full' required />
                    <input type="text" placeholder='CVV' className='border border-gray-300 rounded-lg py-2 px-4 w-full' required />
                  </div>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" />
                    <span>Save Card Details</span>
                  </label>
                </div>
              )}
            </div>

            {/* Cash on Delivery */}
            <div onClick={() => setMethod("cod")} className={`border p-4 rounded-lg cursor-pointer ${method === 'cod' ? 'border-black' : 'border-gray-300'}`}>
              <label className='flex items-center gap-2'>
                <input type="radio" name="paymentMethod" checked={method === 'cod'} onChange={() => setMethod("cod")} />
                <span className="font-medium">Cash on Delivery</span>
              </label>
            </div>

            {/* Razorpay */}
            <div onClick={() => setMethod("razorpay")} className={`border p-4 rounded-lg cursor-pointer ${method === 'razorpay' ? 'border-black' : 'border-gray-300'}`}>
              <label className='flex items-center gap-2'>
                <input type="radio" name="paymentMethod" checked={method === 'razorpay'} onChange={() => setMethod("razorpay")} />
                <img src={assets.razorpay_logo} alt="Razorpay" className='h-5' />
              </label>
            </div>

            {/* PayPal */}
            <div onClick={() => setMethod("paypal")} className={`border p-4 rounded-lg cursor-pointer ${method === 'paypal' ? 'border-black' : 'border-gray-300'}`}>
              <label className='flex items-center gap-2'>
                <input type="radio" name="paymentMethod" checked={method === 'paypal'} onChange={() => setMethod("paypal")} />
                <img src={paypal} alt="PayPal" className='h-5' />
              </label>
            </div>

          </div>

          <div className='w-full text-center mt-8'>
            <Button className='cursor-pointer w-full' type='submit'>Payment</Button>
          </div>
        </div>

      </form>
    </div>
  )
}

export default PlaceOrder
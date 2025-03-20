import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title'
import axios from 'axios'
import Button from '../components/Button'

const Orders = () => {
  const { backendUrl, currency, token,conversionRate } = useContext(ShopContext)

  const [orderData, setOrderData] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  // In the loadOrderData function, modify how you're processing orders:
const loadOrderData = async () => {
  try {
    if (!token) {
      return null
    }

    const response = await axios.post(backendUrl + "/api/order/userorders", {}, { headers: { token } })
    
    if (response.data.success) {
      let allOrdersItem = [];

      console.log(response.data.orders)

      response.data.orders.map((order) => {
        // Store order-level discount information
        const orderDiscountAmount = order.discountAmount || 0;
        const orderOriginalAmount = order.originalAmount || 0;
        const orderCouponCode = order.couponCode || null;
        const orderAmount = order.amount || 0;
        
        order.items.map((item) => {
          // Calculate the proportion of this item in the total order
          const itemTotal = item.price * item.quantity;
          const proportion = orderOriginalAmount > 0 ? itemTotal / orderOriginalAmount : 0;
          
          // Calculate this item's share of the discount
          const itemDiscountAmount = orderDiscountAmount * proportion;
          
          // Assign all necessary properties to the item
          item["status"] = order.status;
          item["payment"] = order.payment;
          item["paymentMethod"] = order.paymentMethod;
          item["date"] = order.date;
          item["orderAmount"] = order.amount;
          // item["originalPrice"] = order.originalAmount;
          // item["discountedPrice"] = order.amount;
          item["couponCode"] = orderCouponCode;
          item["orderId"] = order._id;
          item["conversionRate"] = order.conversionRate ? order.conversionRate: 1;
          item["currency"] = order.currency ? order.currency: "INR";
          
          allOrdersItem.push(item);
        });
      });
      
      setOrderData(allOrdersItem.reverse());
    }

  } catch (error) {
    console.log(error);
    console.error(error.message);
    // Make sure toast is imported or use another notification method
    // toast.error(error.message);
  }
}

  // Filter and search logic
  useEffect(() => {
    let result = orderData;

    // Filter by status
    if (statusFilter !== 'all') {
      result = result.filter(item => 
        item.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    // Search filter
    if (searchTerm) {
      result = result.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.attributes && 
          Object.values(item.attributes).some(attr => 
            attr.toLowerCase().includes(searchTerm.toLowerCase())
          ))
      );
    }

    setFilteredOrders(result);
  }, [orderData, searchTerm, statusFilter])

  useEffect(() => {
    loadOrderData();
    console.log(orderData)
  }, [token])

  return (
    <div className="border-t pt-8 md:pt-12 lg:pt-16 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto">
      {/* Section Heading with search and filter options */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-4">
          <h1 className="text-2xl sm:text-3xl font-semibold mb-4 sm:mb-0">Your Orders</h1>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="search"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Orders</option>
              <option value="order placed">Order Placed</option>
              <option value="pending">Pending</option>
              <option value="accepted">Delivered</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="grid grid-cols-1 gap-6">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((item, index) => (
            <div
              key={index}
              className="border shadow-sm rounded-lg overflow-hidden bg-white hover:shadow-md transition-all duration-300"
            >
              {/* Order Header - Mobile & Desktop */}
              {/* Order Header - Mobile & Desktop */}
<div className="bg-gray-50 p-4 flex justify-between items-center border-b gap-2 sm:gap-2 ">
  <div className='flex flex-col gap-1 '>
    <p className="text-xs text-gray-500">ORDER PLACED</p>
    <p className=" text-xs lg:text-sm font-medium">{(new Date(item.date)).toLocaleDateString()}</p>
  </div>
  <div className='flex flex-col gap-1 '>
    <p className="text-xs text-gray-500">TOTAL</p>
    {
      <p className="text-xs lg:text-sm font-medium text-nowrap">
        {item.currency} {(item.price*item.conversionRate* item.quantity).toFixed(2)}
      </p>
    }
  </div>
  <div className="hidden sm:block">
    <p className="text-xs text-gray-500">PAYMENT</p>
    <p className="text-sm font-medium">{item.paymentMethod}</p>
  </div>
  <div className="flex flex-col">
    <p className="text-xs text-gray-500 hidden sm:block">STATUS</p>
    <div className="flex items-center gap-2">
      <span className={`w-2 h-2 rounded-full hidden sm:hidden lg:block ${
        item.status === "Completed" ? "bg-green-500" :
        item.status === "Pending" ? "bg-yellow-500" :
        item.status === "Cancelled" ? "bg-red-500" : "bg-blue-500"
      }`}></span>
      <p className="text-xs lg:text-sm font-medium text-end sm:text-end lg:text-start">{item.status}</p>
    </div>
  </div>
</div>

              {/* Order Content */}
              <div className="p-4 flex flex-col sm:flex-row gap-4">
                {/* Product Image */}
                <div className="sm:w-24 md:w-32 flex-shrink-0">
                  <img
                    src={item.image[0]}
                    alt={item.name}
                    className="w-full h-auto rounded-md object-cover aspect-square"
                  />
                </div>

                {/* /* Product Details */ }
                {/* Product Details */}
<div className="flex-grow flex flex-col justify-between">
  <div>
    <h3 className="text-lg font-medium text-gray-900 mb-1">{item.name}</h3>
    <p className="text-sm text-gray-600 mb-2">Qty: {item.quantity}</p>
    <p className="text-sm text-gray-600 block sm:hidden">Payment: {item.paymentMethod}</p>
    
    {/* Show coupon information if applied
    {item.couponCode && (
      <div className="mt-1 mb-2">
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Coupon: {item.couponCode}
        </span>
        {item.discountAmount > 0 && (
          <p className="text-xs text-green-600 mt-1">
            Saved: {currency}{item.discountAmount.toFixed(2)}
          </p>
        )}
      </div>
    )} */}
    
    <div className="hidden sm:block mt-2 text-sm text-gray-500">
      <p>Order ID: {item.orderId.slice(-6)}</p>
      <p>Item #: {item._id.slice(-6, -1)}</p>
      {item.attributes && Object.entries(item.attributes).map(([key, value], attrIndex) => (
        <p key={attrIndex}>
          {key[0].toUpperCase() + key.slice(1)}: {value[0].toUpperCase() + value.slice(1)}
        </p>
      ))}
    </div>
  </div>
</div>

                {/* Action Buttons - Right Side */}
                <div className="flex flex-row sm:flex-col justify-center items-center gap-3 mt-4 sm:mt-0">
                  <Button
                    className="w-full sm:w-auto whitespace-nowrap text-sm px-4 py-2"
                    onClick={loadOrderData}
                  >
                    Track Order
                  </Button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            No orders found matching your search or filter.
          </div>
        )}
      </div>
    </div>
  )
}

export default Orders
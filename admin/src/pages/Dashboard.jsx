import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl, currency } from '../App';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { 
    ChartBarIcon, 
    CurrencyDollarIcon, 
    UserGroupIcon, 
    DocumentTextIcon 
} from '@heroicons/react/24/outline';
import Hero from '../../../frontend/src/components/Hero';
import BannerSlider from "./ImageSlider.jsx";
import { toast } from 'react-toastify';
import Cat from "../assets/admin_assets/cat.png";

const renderOrdersList = () => {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center">
            <Package size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">No Orders Found</h3>
            <p className="text-gray-500">
              {orders.length > 0
                ? "Try adjusting your filters to see more results."
                : "There are no orders in the system yet."}
            </p>
            {orders.length > 0 && (
              <button
                onClick={resetFilters}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Reset Filters
              </button>
            )}
          </div>
        ) : (
          <div>
            {filteredOrders.map((order) => (
              <div
                key={order._id}
                className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50 cursor-pointer transition duration-150"
                onClick={() => viewOrderDetails(order)}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    {/* Left Column: Order ID & Basic Info */}
                    <div className="col-span-12 md:col-span-4">
                      <div className="flex items-start space-x-4">
                        {/* Order Icon & ID */}
                        <div className="flex flex-col items-center">
                          <div className="bg-blue-100 p-3 rounded-lg mb-2">
                            <Package size={22} className="text-blue-600" />
                          </div>
                          <span className="text-xs text-gray-500 font-mono">
                            {order._id.slice(-8)}
                          </span>
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-base font-medium text-gray-900">
                              Order #{order._id.slice(-6)}
                            </h3>
                            <div>
                              {getOrderStatusBadge(order.status)}
                            </div>
                          </div>

                          <div className="text-sm text-gray-600 mb-2">
                            Placed on: {formatDate(order.date)}
                          </div>

                          <div className="flex items-center text-sm">
                            {/* <span className="font-medium text-gray-700 mr-2">
                              {order.address.firstName} {order.address.lastName}
                            </span> */}
                            <span className="text-gray-500">
                              ({getTotalQuantity(order.items)} items)
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>


                    {/* Right Column: Amount & Payment Info */}
                    <div className="col-span-12 md:col-span-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-gray-500 text-sm mb-1">Total Amount</div>
                          <div className="text-lg font-bold text-gray-900">
                            {currency}{order.amount.toFixed(2)}
                          </div>
                          <div className="flex items-center mt-2">
                            <CreditCard size={14} className="text-gray-400 mr-2" />
                            <span className="text-sm text-gray-600">{order.paymentMethod}</span>
                            <span className="ml-2">{getPaymentStatusBadge(order.payment)}</span>
                          </div>
                        </div>
                        <div className="text-blue-600 text-sm font-medium">
                          View Details →
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const CategorySlider = ({token}) => {
    const [scrollPosition, setScrollPosition] = useState(0);
    const [categories, setCategories] = useState([]);
   
const [categoriesLoading, setCategoriesLoading] = useState(true);

const fetchCategories = async () => {
  setCategoriesLoading(true);
  try {
    const response = await axios.get(
      `${backendUrl}/api/category/getSubCategory`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    if (response.data.success) {
      setCategories(response.data.categories);
    
    } else {
      toast.error('Failed to fetch categories');
    }
  } catch (error) {
    console.error(error);
    toast.error('Error occurred while fetching categories');
  } finally {
    setCategoriesLoading(false);
  }
};
useEffect(() => {
  fetchCategories();
}, [token]);
    
    const scroll = (direction) => {
      const container = document.getElementById('category-container');
      const scrollAmount = direction === 'left' ? -200 : 200;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setScrollPosition(container.scrollLeft + scrollAmount);
    };
  
    if (categoriesLoading) {
      return (
        <div className="relative mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Shop by Category</h2>
          </div>
          <div className="flex justify-center items-center h-24">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      );
    }
  
    return (
      <div className="relative mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Shop by Category</h2>
        </div>
        
        <div className="relative">
          <button 
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md z-10"
            style={{ display: scrollPosition <= 0 ? 'none' : 'block' }}
          >
            <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
          </button>
          
          <div 
            id="category-container"
            className="flex  overflow-x-auto pb-4 scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            onScroll={(e) => setScrollPosition(e.target.scrollLeft)}
          >
            {categories.map((category) => (
              <div key={category.category} className="flex flex-col items-center space-y-2 mx-auto cursor-pointer">
                <div className="w-24 h-24 rounded-full overflow-hidden border border-gray-200">
                  <img 
                    src={category.image}
                    alt={category.category} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-sm text-gray-700 text-center">{category.category}</span>
              </div>
            ))}
          </div>
          
          <button 
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md z-10"
          >
            <ChevronRightIcon className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>
    );
  };

// Add this to your component
const scrollbarStyles = `
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;
  
const Dashboard = ({ token }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reportData, setReportData] = useState({
        totalOrderValue: [],
        completedRevenue: [],
        userCount: []
    });
    const [recentOrders, setRecentOrders] = useState([]);


    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      };
useEffect(() => {
    const fetchRecentOrders = async () => {
        try {
            const response = await axios.post(
                `${backendUrl}/api/order/recent-orders`,
                { status: 'Order Placed' }, // Filter for Order Placed status
                { headers: { token } }
            );

            if (response.data.success) {
                // Limit to last 5 orders
                setRecentOrders(response.data.orders.slice(0, 5));
            }
        } catch (error) {
            console.error('Error fetching recent orders:', error);
        }
    };

    fetchRecentOrders();
}, [token]);

    useEffect(() => {
        const fetchReportData = async () => {
            try {
                // Fetch total order value
                const orderResponse = await axios.post(
                    `${backendUrl}/api/order/monthly-total`,
                    {},
                    { headers: { token } }
                );

                // Fetch completed revenue
                const revenueResponse = await axios.post(
                    `${backendUrl}/api/order/completed-revenue`,
                    {},
                    { headers: { token } }
                );

                

                // Fetch user count
                const userResponse = await axios.get(
                    `${backendUrl}/api/user/monthly-count`,
                    { headers: { token } }
                );

                if (
                    orderResponse.data.success && 
                    revenueResponse.data.success && 
                    userResponse.data.success
                ) {
                    setReportData({
                        totalOrderValue: orderResponse.data.monthlyTotals,
                        completedRevenue: revenueResponse.data.monthlyRevenue,
                        userCount: userResponse.data.monthlyUsers
                    });
                } else {
                    throw new Error('Failed to fetch report data');
                }
            } catch (err) {
                console.error('Reporting Error:', err);
                setError(err.message || 'An error occurred while fetching reports');
            } finally {
                setLoading(false);
            }
        };

        fetchReportData();
    }, [token]);

    // Loading state
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-blue-500"></div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
            </div>
        );
    }

    // Custom tooltip for charts
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-4 border border-gray-300 rounded shadow-lg">
                    <p className="font-bold text-gray-700">{label}</p>
                    {payload.map((entry, index) => (
                        <p 
                            key={`item-${index}`} 
                            className={`text-${entry.color}`}
                        >
                            {entry.name}: {currency}{entry.value.toFixed(2)}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="container mx-auto px-2 py-8">
        <style>{scrollbarStyles}</style>
        
        {/* Banner Slider */}
        <BannerSlider />
        
        {/* Category Slider */}
        <CategorySlider />
            <div className="grid grid-cols-3 gap-6 mb-8">
            
                {/* Total Amount Card */}
                <div className="bg-white shadow-md rounded-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 flex items-center">
                                <DocumentTextIcon className="h-5 w-5 mr-2 text-blue-500" />
                                Total Order Value
                            </h3>
                            <p className="text-2xl font-bold text-gray-900 mt-2">
                                {currency}{reportData.totalOrderValue.reduce((sum, item) => sum + item.total, 0).toFixed(2)}
                            </p>
                        </div>
                        <div className="text-green-500 flex items-center text-sm">
                            1.56% ↑
                        </div>
                    </div>
                </div>

                {/* Total Revenue Card */}
                <div className="bg-white shadow-md rounded-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 flex items-center">
                                <CurrencyDollarIcon className="h-5 w-5 mr-2 text-green-500" />
                                Total Revenue
                            </h3>
                            <p className="text-2xl font-bold text-gray-900 mt-2">
                                {currency}{reportData.completedRevenue.reduce((sum, item) => sum + item.revenue, 0).toFixed(2)}
                            </p>
                        </div>
                        <div className="text-green-500 flex items-center text-sm">
                            0.56% ↑
                        </div>
                    </div>
                </div>

                {/* Total Users Card */}
                <div className="bg-white shadow-md rounded-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 flex items-center">
                                <UserGroupIcon className="h-5 w-5 mr-2 text-purple-500" />
                                Total Users
                            </h3>
                            <p className="text-2xl font-bold text-gray-900 mt-2">
                                {reportData.userCount.reduce((sum, item) => sum + item.count, 0)}
                            </p>
                        </div>
                        <div className="text-green-500 flex items-center text-sm">
                            0.00% →
                        </div>
                    </div>
                    
                </div>
                
                
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Total Order Value Chart */}
                <div className="bg-white shadow-md rounded-lg p-2 w-full">
                    <div className="flex items-center mb-4">
                        <ChartBarIcon className="h-6 w-6 mr-2 text-blue-500" />
                        <h2 className="text-lg font-semibold text-gray-800">Total Order Value</h2>
                    </div>
                    <ResponsiveContainer width="80%" height={300}>
                        <BarChart data={reportData.totalOrderValue}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="total" fill="#3B82F6" barSize={20} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Total Revenue Chart */}
                <div className="bg-white shadow-md rounded-lg p-6">
                    <div className="flex items-center mb-4">
                        <CurrencyDollarIcon className="h-6 w-6 mr-2 text-green-500" />
                        <h2 className="text-lg font-semibold text-gray-800">Total Revenue</h2>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={reportData.completedRevenue}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="revenue" fill="#10B981" barSize={20} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <div className="bg-white shadow-md rounded-lg p-6 mt-5">
    <div className="flex items-center mb-4">
        {/* <Package className="h-5 w-5 mr-2 text-blue-500" /> */}
        <h3 className="text-lg font-semibold text-gray-800">Recent Order Placed Orders</h3>
    </div>
    {recentOrders.length > 0 ? (
        <div className="divide-y divide-gray-200">
            {recentOrders.map(order => (
                <div key={order._id} className="py-3 flex justify-between items-center">
                    <div>
                        <p className="text-sm font-medium text-gray-900">
                            Order #{order._id.slice(-6)}
                        </p>
                        <p className="text-sm text-gray-500">
                            {formatDate(order.date)}
                        </p>
                    </div>
                    <div className="text-sm font-bold text-gray-900">
                        {currency}{order.amount.toFixed(2)}
                    </div>
                </div>
            ))}
        </div>
    ) : (
        <p className="text-gray-500 text-sm">No recent order placed orders</p>
    )}
</div>
        </div>
    );
};
export default Dashboard;
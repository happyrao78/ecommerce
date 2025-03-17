import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { assets } from "../assets/admin_assets/assets.js";
import {
  Bell, MessageSquare, Search, Moon, Sun,
  ChevronDown, Settings, LogOut, User, HelpCircle,
  Package, ShoppingCart, Clock
} from 'lucide-react';
import { backendUrl } from '../App';

const Navbar = ({ token, isOpen }) => {
  const location = useLocation();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [searchFocused, setSearchFocused] = useState(false);
  const [recentOrders, setRecentOrders] = useState([]);


  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
    if (showNotifications) setShowNotifications(false);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (showProfileMenu) setShowProfileMenu(false);
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
          // Show all orders without slicing
          setRecentOrders(response.data.orders);
          console.log('Recent orders in Navbar:', response.data.orders);
        }
      } catch (error) {
        console.error('Error fetching recent orders:', error);
      }
    };

    console.log('Token:', token);

    fetchRecentOrders();
  }, [token]);

  // Format date for notifications
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format order number for display
  const formatOrderNumber = (id) => {
    return `#${id.substring(id.length - 6).toUpperCase()}`;
  };

  // Function to get the current page title based on the route
  const getCurrentPageTitle = () => {
    const path = location.pathname.split('/')[1];
    if (!path) return "Dashboard";

    // Map routes to readable titles
    const routeTitles = {
      'dashboard': 'Dashboard',
      'add': 'Add Product',
      'list': 'Product List',
      'edit': 'Edit Product',
      'orders': 'Orders',
      'add-category': 'Add Category',
      'list-category': 'Category List',
      'add-attribute': 'Add Attribute',
      'list-attribute': 'Attribute List',
      'add-dynamic': 'Add Component',
      'list-dynamic': 'Component List',
      'admin-phone': 'Admin Phone',
      'users': 'Users',
      'add-discount': 'Add Discount',
      'list-discount': 'Discount List',
      'reports': 'Reports'
    };

    return routeTitles[path] || path.charAt(0).toUpperCase() + path.slice(1).replace('-', ' ');
  };

  const currentPage = getCurrentPageTitle();

  return (
    <div
      className={`fixed top-0 z-40 transition-all duration-300 ${isOpen ? 'left-72 w-[calc(100%-18rem)]' : 'left-24 w-[calc(100%-6rem)]'
        }`}
    >
      {/* Improved frosted glass effect with gradient */}
      <div className="absolute inset-0 bg-gray-900 shadow-lg"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-transparent pointer-events-none opacity-40 z-0"></div>
      
      <div className="relative flex items-center justify-between h-20 px-6">
        {/* Left section - Page title and breadcrumbs with improved styling */}
        <div className="flex items-center">
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-blue-300 bg-clip-text text-transparent">{currentPage}</h1>
            <div className="flex items-center text-xs text-gray-400">
              <span>Home</span>
              <span className="mx-2">/</span>
              <span className="text-blue-400">{currentPage}</span>
            </div>
          </div>
        </div>

        {/* Middle section - Search bar */}
        {/* <div className={`hidden md:flex items-center relative max-w-xl w-1/3 transition-all ${searchFocused ? 'w-2/5' : ''}`}>
          <div className={`flex items-center w-full overflow-hidden transition-all duration-300 bg-gray-800 ${searchFocused
              ? 'border border-blue-500 shadow-lg shadow-blue-500/20'
              : 'border border-white'
            } rounded-full px-4 py-2`}>
            <Search size={18} className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search"
              className="bg-transparent border-none text-white text-sm w-full focus:outline-none"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
          </div>
        </div> */}

        {/* Right section - Actions and profile with enhanced styling */}
        <div className="flex items-center space-x-1 md:space-x-3">
          {/* Notifications with dropdown */}
          <div className="relative">
            <button
              onClick={toggleNotifications}
              className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-800/70 transition-all duration-300 hover:shadow-md hover:shadow-blue-500/10"
            >
              <Bell size={18} />
              {recentOrders.length > 0 && (
                <span className="absolute top-0 right-0 flex h-5 w-5">
                  <span className="relative inline-flex rounded-full h-5 w-5 bg-gradient-to-r from-rose-500 to-pink-500">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-5 w-5 bg-gradient-to-r from-rose-500 to-pink-500 text-xs text-white items-center justify-center  ">
                      {recentOrders.length}
                    </span>
                  </span>
                </span>
              )}
            </button>

            {/* Notifications dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-gray-800 border border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden">
                <div className="p-3 border-b border-gray-700 flex justify-between items-center">
                  <h3 className="text-sm font-medium text-white">Notifications</h3>
                  <span className="text-xs px-2 py-1 bg-blue-600 text-white rounded-full">
                    {recentOrders.length} new
                  </span>
                </div>

                {recentOrders.length > 0 ? (
                  <div className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 sidebar-scroll"

                    style={{
                      scrollbarWidth: 'none',
                      msOverflowStyle: 'none',
                      WebkitOverflowScrolling: 'touch'
                    }}
                  >
                    <style
                      dangerouslySetInnerHTML={{
                        __html: `
        .sidebar-scroll::-webkit-scrollbar {
          display: none;
        }
      `
                      }}
                    />
                    {recentOrders.map((order) => (
                      <div key={order._id} className="p-3 border-b border-gray-700 hover:bg-gray-700/50 transition-colors">
                        <div className="flex items-start">
                          <div className="h-8 w-8 rounded-full bg-blue-600/20 flex items-center justify-center mr-3">
                            <Package size={16} className="text-blue-400" />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <p className="text-sm font-medium text-white">New Order {formatOrderNumber(order._id)}</p>
                              {/* <span className="text-xs text-gray-400">{formatDate(order.createdAt)}</span> */}
                            </div>
                            <p className="text-xs text-gray-400 mt-1">
                              Amount: ₹{order.amount.toLocaleString()}
                            </p>
                            {/* <p className="text-xs text-gray-400">
                              Items: {order.items.length}
                            </p> */}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-gray-400 text-sm">
                    No new orders to display
                  </div>
                )}

                <div className="p-3 border-t border-gray-700 bg-gray-800/80">
                  <button
                    className="w-full text-center text-xs text-blue-400 hover:text-blue-300 py-1"
                    onClick={() => {
                      // Navigate to orders page
                      window.location.href = '/orders';
                    }}
                  >
                    View All Orders
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Divider with glow effect */}
          <div className="hidden md:block h-8 w-px bg-gradient-to-b from-gray-700 via-blue-700/30 to-gray-700"></div>

          {/* Profile dropdown with enhanced styling */}
          <div className="relative">
            <button
              onClick={toggleProfileMenu}
              className="flex items-center space-x-3 p-2 rounded-full hover:bg-gray-800/70 transition-all duration-300 text-gray-200 hover:shadow-md hover:shadow-blue-500/10"
            >
              <div className="relative">
                <img
                  src={assets.logo}
                  alt="Profile"
                  className="w-8 h-8 rounded-full border-2 border-gray-700 object-cover hover:border-blue-500 transition-all duration-300"
                />
                <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-gray-900"></div>
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-white">Happy Yadav</p>
                <p className="text-xs text-gray-400">Administrator</p>
              </div>
              <ChevronDown size={16} className="hidden md:block text-gray-400" />
            </button>

            {/* Enhanced dropdown menu */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden">
                <div className="p-4 border-b border-gray-700">
                  <p className="text-sm font-medium text-white">Happy Yadav</p>
                  <p className="text-xs text-gray-400">admin1234@gmail.com</p>
                </div>

                {/* <div className="p-2">
                  <button className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors">
                    <User size={16} className="mr-3 text-gray-400" />
                    Profile
                  </button>
                  <button className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors">
                    <Settings size={16} className="mr-3 text-gray-400" />
                    Settings
                  </button>
                  <button className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors">
                    <HelpCircle size={16} className="mr-3 text-gray-400" />
                    Help Center
                  </button>
                </div> */}

                <div className="p-2 border-t border-gray-700">
                  <button
                    className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-red-900/30 hover:text-red-300 rounded-lg transition-colors"
                    onClick={() => setToken("")}
                  >
                    <LogOut size={16} className="mr-3" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
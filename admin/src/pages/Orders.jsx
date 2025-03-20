import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl, currency } from '../App';
import { toast } from "react-toastify";
import { Package, Search, Calendar, Filter, ChevronDown, ArrowLeft, Truck, CreditCard, MapPin, Phone, Mail, User, LinkIcon } from 'lucide-react';

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'detail'
  const [filters, setFilters] = useState({
    status: '',
    paymentStatus: '',
    dateRange: 'all'
  });
  const [isTrackingLinkModalOpen, setIsTrackingLinkModalOpen] = useState(false);
  const [trackingLink, setTrackingLink] = useState('');
  const [currentOrderForTracking, setCurrentOrderForTracking] = useState(null);

  // New function to open tracking link modal
  const openTrackingLinkModal = (order) => {
    setCurrentOrderForTracking(order);
    setTrackingLink(order.trackingLink || '');
    setIsTrackingLinkModalOpen(true);
  };

  // Function to save tracking link
  const saveTrackingLink = async () => {
    if (!trackingLink.trim()) {
      toast.error("Please enter a valid tracking link");
      return;
    }

    try {
      const response = await axios.post(
        `${backendUrl}/api/order/addTrackingLink`,
        {
          orderId: currentOrderForTracking._id,
          trackingLink: trackingLink.trim()
        },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success("Tracking link added successfully");

        // Update the order in the state
        if (viewMode === 'list') {
          // Update in orders list
          const updatedOrders = orders.map(order =>
            order._id === currentOrderForTracking._id
              ? { ...order, trackingLink: trackingLink.trim() }
              : order
          );
          setOrders(updatedOrders);
        } else {
          // Update in selected order
          setSelectedOrder(prev => ({
            ...prev,
            trackingLink: trackingLink.trim()
          }));
        }

        setIsTrackingLinkModalOpen(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to add tracking link");
    }
  };

  const TrackingLinkModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md">
        <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 flex items-center">
          <LinkIcon className="mr-2 text-blue-600" size={20} />
          {currentOrderForTracking.trackingLink ? 'Edit' : 'Add'} Tracking Link
        </h2>
        <p className="text-gray-600 text-sm sm:text-base mb-3 sm:mb-4">
          Enter the tracking link for Order #{currentOrderForTracking?._id.slice(-6)}
        </p>
        <input
          type="text"
          placeholder="Enter tracking link"
          className="w-full p-2 sm:p-2.5 border border-gray-300 rounded-md mb-3 sm:mb-4 text-sm sm:text-base"
          value={trackingLink}
          onChange={(e) => setTrackingLink(e.target.value)}
          autoFocus
        />
        <div className="flex justify-end space-x-2 sm:space-x-3">
          <button
            onClick={() => setIsTrackingLinkModalOpen(false)}
            className="px-3 py-1.5 sm:px-4 sm:py-2 border border-gray-300 rounded-md text-sm sm:text-base text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={saveTrackingLink}
            className="px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-600 text-sm sm:text-base text-white rounded-md hover:bg-blue-700"
          >
            Save Tracking Link
          </button>
        </div>
      </div>
    </div>
  );

  const fetchAllOrders = async () => {
    if (!token) return;

    try {
      const response = await axios.post(
        `${backendUrl}/api/order/list`,
        {},
        { headers: { token } }
      );

      console.log(response)

      if (response.data.success) {
        const sortedOrders = response.data.orders.sort((a, b) => new Date(b.date) - new Date(a.date));
        setOrders(sortedOrders);
        console.log(sortedOrders)
        setFilteredOrders(sortedOrders);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const statusHandler = async (e, orderId) => {
    try {
      const status = e.target.value;
      const response = await axios.post(
        `${backendUrl}/api/order/status`,
        { orderId, status },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success("Status updated successfully");
        await fetchAllOrders();

        // Update selected order if it's the one being modified
        if (selectedOrder && selectedOrder._id === orderId) {
          const updatedOrder = response.data.order ||
            orders.find(order => order._id === orderId);

          // Special handling for cancelled orders with COD payment
          if (status === "Cancelled" && updatedOrder.paymentMethod === "COD") {
            setSelectedOrder({
              ...updatedOrder,
              status: status,
              payment: false  // Set payment to pending for COD cancelled orders
            });
          } else {
            setSelectedOrder({
              ...updatedOrder,
              status: status,
              payment: status === "Completed" ? true : updatedOrder.payment
            });
          }
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };


  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setViewMode('detail');
  };

  const backToOrdersList = () => {
    setViewMode('list');
    setSelectedOrder(null);
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  // Apply filters and search
  useEffect(() => {
    let result = [...orders];

    // Filter by status
    if (filters.status) {
      result = result.filter(order => order.status === filters.status);
    }

    // Filter by payment status
    if (filters.paymentStatus) {
      const isPaid = filters.paymentStatus === 'paid';
      result = result.filter(order => order.payment === isPaid);
    }

    // Filter by date range
    if (filters.dateRange !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const lastWeek = new Date(today);
      lastWeek.setDate(lastWeek.getDate() - 7);
      const lastMonth = new Date(today);
      lastMonth.setMonth(lastMonth.getMonth() - 1);

      result = result.filter(order => {
        const orderDate = new Date(order.date);
        switch (filters.dateRange) {
          case 'today':
            return orderDate >= today;
          case 'yesterday':
            return orderDate >= yesterday && orderDate < today;
          case 'lastWeek':
            return orderDate >= lastWeek;
          case 'lastMonth':
            return orderDate >= lastMonth;
          default:
            return true;
        }
      });
    }

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(order =>
        order._id.toLowerCase().includes(query) ||
        `${order.address.firstName} ${order.address.lastName}`.toLowerCase().includes(query) ||
        order.address.city.toLowerCase().includes(query) ||
        order.items.some(item => item.name.toLowerCase().includes(query))
      );
    }

    result.sort((a, b) => new Date(b.date) - new Date(a.date));
    setFilteredOrders(result);
  }, [filters, searchQuery, orders]);

  const resetFilters = () => {
    setFilters({
      status: '',
      paymentStatus: '',
      dateRange: 'all'
    });
    setSearchQuery('');
  };

  // Function to get the total quantity from all items
  const getTotalQuantity = (items) => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  // Function to format date nicely
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

  // Function to get payment status badge
  const getPaymentStatusBadge = (isPaid) => {
    return isPaid ?
      <span className="bg-green-100 text-green-800 text-xs px-2.5 py-0.5 rounded-full">Paid</span> :
      <span className="bg-yellow-100 text-yellow-800 text-xs px-2.5 py-0.5 rounded-full">Pending</span>;
  };

  // Function to get order status badge
  const getOrderStatusBadge = (status) => {
    switch (status) {
      case 'Cancelled':
        return <span className="bg-red-100 text-red-800 text-xs px-2.5 py-0.5 rounded-full">{status}</span>;
      case 'Accepted':
        return <span className="bg-green-100 text-green-800 text-xs px-2.5 py-0.5 rounded-full">{status}</span>;
      case 'Pending':
        return <span className="bg-yellow-100 text-yellow-800 text-xs px-2.5 py-0.5 rounded-full">{status}</span>;
      case 'Completed':
        return <span className="bg-purple-100 text-purple-800 text-xs px-2.5 py-0.5 rounded-full">{status}</span>;
      default:
        return <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full">{status}</span>;
    }
  };

  // Function to get expected delivery date
  const getExpectedDeliveryDate = (orderDate) => {
    const date = new Date(orderDate);
    date.setDate(date.getDate() + 6); // Assuming 6 days delivery time
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Render the order list view
  const renderOrdersList = () => {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="p-6 sm:p-12 text-center">
            <Package size={40} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">No Orders Found</h3>
            <p className="text-gray-500">
              {orders.length > 0
                ? "Try adjusting your filters to see more results."
                : "There are no orders in the system yet."}
            </p>
            {orders.length > 0 && (
              <button
                onClick={resetFilters}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm sm:text-base"
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
                <div className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    {/* Order ID & Basic Info */}
                    <div className="flex items-start space-x-3 sm:space-x-4">
                      {/* Order Icon & ID */}
                      <div className="flex flex-col items-center">
                        <div className="bg-blue-100 p-2 sm:p-3 rounded-lg mb-1 sm:mb-2">
                          <Package size={18} className="text-blue-600" />
                        </div>
                        <span className="text-xs text-gray-500 font-mono">
                          {order._id.slice(-8)}
                        </span>
                      </div>

                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1 sm:mb-2 gap-2">
                          <h3 className="text-sm sm:text-base font-medium text-gray-900">
                            Order #{order._id.slice(-6)}
                          </h3>
                          <div>
                            {getOrderStatusBadge(order.status)}
                          </div>
                        </div>

                        <div className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">
                          Placed on: {formatDate(order.date)}
                        </div>

                        <div className="flex items-center text-xs sm:text-sm">
                          <span className="text-gray-500">
                            ({getTotalQuantity(order.items)} items)
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Amount & Payment Info */}
                    <div className="mt-3 sm:mt-0 border-t sm:border-t-0 pt-3 sm:pt-0 flex justify-between items-center sm:flex-col sm:items-end">
                      <div>
                        <div className="text-gray-500 text-xs sm:text-sm mb-1">Total</div>
                        <div className="text-base sm:text-lg font-bold text-gray-900">
                          {order.currency} {order.amount.toFixed(2)}
                        </div>
                        <div className="flex items-center mt-1 sm:mt-2">
                          <CreditCard size={12} className="text-gray-400 mr-1 sm:mr-2" />
                          <span className="text-xs sm:text-sm text-gray-600">{order.paymentMethod}</span>
                          <span className="ml-1 sm:ml-2">{getPaymentStatusBadge(order.payment)}</span>
                        </div>
                      </div>
                      <div className="text-blue-600 text-xs sm:text-sm font-medium sm:mt-2">
                        View Details →
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

  // Render the detailed order view
  const renderOrderDetail = () => {
    if (!selectedOrder) return null;

    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        {/* Header with back button */}
        <div className="border-b border-gray-200 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <button
              onClick={backToOrdersList}
              className="flex items-center text-blue-600 hover:text-blue-800 text-sm sm:text-base"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Orders
            </button>
            <div className="text-xs sm:text-sm text-gray-500">
              Order Date: {formatDate(selectedOrder.date)}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="border-b border-gray-200 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between mb-4 sm:mb-6 gap-3">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                Order #{selectedOrder._id.slice(-6)}
              </h2>
              <div className="flex items-center">
                <span className="text-gray-600 mr-3 text-sm sm:text-base">Status:</span>
                {getOrderStatusBadge(selectedOrder.status)}
              </div>
            </div>
            <div className="mt-3 sm:mt-0">
              <div className="text-xs sm:text-sm text-gray-500 mb-1">Total Amount</div>
              <div className="text-xl sm:text-2xl font-bold text-gray-900">
                {selectedOrder.currency} {selectedOrder.amount.toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        {/* Customer & Shipping Info */}
        <div className="border-b border-gray-200 p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-4">Customer Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Customer */}
            <div>
              <div className="flex items-center mb-2 sm:mb-3">
                <User size={16} className="text-gray-500 mr-2" />
                <span className="text-sm sm:text-base font-medium text-gray-700">Customer Details</span>
              </div>
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                <div className="text-sm sm:text-base font-medium text-gray-800 mb-1">
                  {selectedOrder.address.firstName} {selectedOrder.address.lastName}
                </div>
                <div className="flex items-center text-xs sm:text-sm text-gray-600 mb-2">
                  <Phone size={14} className="mr-2 text-gray-400" />
                  {selectedOrder.address.phone}
                </div>
                <div className="flex items-center text-xs sm:text-sm text-gray-600">
                  <Mail size={14} className="mr-2 text-gray-400" />
                  {selectedOrder.address.email || 'email@example.com'}
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div>
              <div className="flex items-center mb-2 sm:mb-3">
                <MapPin size={16} className="text-gray-500 mr-2" />
                <span className="text-sm sm:text-base font-medium text-gray-700">Shipping Address</span>
              </div>
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                <div className="text-xs sm:text-sm text-gray-800">
                  {selectedOrder.address.street}
                </div>
                <div className="text-xs sm:text-sm text-gray-800">
                  {selectedOrder.address.city}, {selectedOrder.address.state} {selectedOrder.address.zipcode}
                </div>
                <div className="text-xs sm:text-sm text-gray-800 mt-1">
                  {selectedOrder.address.country}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="border-b border-gray-200 p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-4">Order Items</h3>

          <div className="overflow-x-auto">
            <div className="min-w-full">
              {/* Mobile view for items */}
              <div className="sm:hidden space-y-4">
                {selectedOrder.items.map((item, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex items-start mb-3">
                      <div className="h-10 w-10 flex-shrink-0 bg-gray-100 rounded-md flex items-center justify-center mr-3">
                        <Package size={20} className="text-gray-400" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                        <div className="text-xs text-gray-500">SKU: {item.productId || 'N/A'}</div>
                      </div>
                    </div>
                    
                    {item.attributes && (
                      <div className="mb-3 text-xs text-gray-600">
                        {Object.entries(item.attributes).map(([key, value]) => (
                          <p key={key} className="capitalize"><strong>{key}:</strong> {value}</p>
                        ))}
                      </div>
                    )}
                    
                    <div className="grid grid-cols-2 text-xs">
                      <div>
                        <div className="text-gray-500">Quantity</div>
                        <div className="font-medium">{item.quantity}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Price</div>
                        <div className="font-medium">
                          {selectedOrder.currency} {(item.price * selectedOrder.conversionRate || 0).toFixed(2)}
                        </div>
                      </div>
                      <div className="col-span-2 mt-2">
                        <div className="text-gray-500">Total</div>
                        <div className="font-medium">
                          {selectedOrder.currency} {((item.price * selectedOrder.conversionRate || 0) * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="border-t border-gray-200 mt-4 pt-4">
                  <div className="flex justify-between mb-2">
                    <div className="text-sm text-gray-500">Shipping</div>
                    <div className="text-sm font-medium">{selectedOrder.currency} {10*selectedOrder.conversionRate}</div>
                  </div>
                  <div className="flex justify-between">
                    <div className="text-sm font-bold">Total</div>
                    <div className="text-base font-bold">{selectedOrder.currency} {selectedOrder.amount.toFixed(2)}</div>
                  </div>
                </div>
              </div>

              {/* Desktop view for items */}
              <table className="hidden sm:table w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {selectedOrder.items.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 bg-gray-100 rounded-md flex items-center justify-center">
                            <Package size={20} className="text-gray-400" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{item.name}</div>
                            <div className="text-sm text-gray-500">SKU: {item.productId || 'N/A'}</div>
                            {item.attributes &&
                              <div className="mt-2 text-sm text-gray-600">
                                {Object.entries(item.attributes).map(([key, value]) => (
                                  <p key={key} className="capitalize"><strong>{key}:</strong> {value}</p>
                                ))}
                              </div>
                            }
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {selectedOrder.currency} {(item.price *
                          selectedOrder.conversionRate || 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {selectedOrder.currency} {((item.price *
                          selectedOrder.conversionRate || 0) * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan="2" className="px-6 py-4 whitespace-nowrap"></td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">Shipping</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{selectedOrder.currency} {10*selectedOrder.conversionRate} </td>
                  </tr>
                  <tr>
                    <td colSpan="2" className="px-6 py-4 whitespace-nowrap"></td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Total</td>
                    <td className="px-6 py-4 whitespace-nowrap text-base font-bold text-gray-900">
                      {selectedOrder.currency} {selectedOrder.amount.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        {/* Payment & Actions */}
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Payment Info */}
            <div>
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">Payment Information</h3>
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2 sm:mb-3 text-xs sm:text-sm">
                  <div className="text-gray-700">Payment Method</div>
                  <div className="font-medium text-gray-900">{selectedOrder.paymentMethod}</div>
                </div>
                <div className="flex justify-between items-center mb-2 sm:mb-3 text-xs sm:text-sm">
                  <div className="text-gray-700">Payment Status</div>
                  <div>{getPaymentStatusBadge(selectedOrder.payment)}</div>
                </div>
                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <div className="text-gray-700">Transaction ID</div>
                  <div className="font-mono text-gray-900 break-all">
                    {selectedOrder.transactionId || 'TXN_' + selectedOrder._id.slice(-10)}
                  </div>
                </div>
              </div>
            </div>

            {/* Order Actions */}
            <div>
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">Order Actions</h3>
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                <div className="mb-4">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Update Order Status</label>
                  <select
                    className="w-full p-2 sm:p-2.5 border border-gray-300 rounded-md bg-white text-sm"
                    value={selectedOrder.status}
                    onChange={(e) => statusHandler(e, selectedOrder._id)}
                  >
                    <option value="Order Placed">Order Placed</option>
                    <option value="Pending">Pending</option>
                    <option value="Accepted">Accepted</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
</select>
                </div>
                {(selectedOrder.status === 'Accepted' ) && (
        <button
            onClick={() => openTrackingLinkModal(selectedOrder)}
            className="w-full p-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center justify-center mt-2"
        >
            <LinkIcon size={16} className="mr-2" /> 
            {selectedOrder.trackingLink ? 'Edit Tracking Link' : 'Add Tracking Link'}
        </button>
    )}
                {selectedOrder.status === 'Completed'|| selectedOrder.status === 'Cancelled' && selectedOrder.trackingLink && (
        <div className="w-full p-3 bg-gray-100 text-gray-600 rounded-md flex items-center justify-between mt-2">
            <div className="flex items-center">
                <LinkIcon size={16} className="mr-2" />
                <span>Tracking Link</span>
            </div>
            <button
                onClick={() => openTrackingLinkModal(selectedOrder)}
                className="text-blue-600 hover:underline"
            >
                View
            </button>
        </div>
    )}

{selectedOrder.trackingLink && (
    <div className="mt-4 bg-blue-50 p-3 rounded-md">
        <div className="flex items-center justify-between">
            <span className="text-sm text-blue-700">Tracking Link</span>
            <a 
                href={selectedOrder.trackingLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline"
            >
                View Tracking
            </a>
        </div>
    </div>
)}

                {/* <div className="mt-4 flex items-center justify-end">
                  <button
                    onClick={() => window.print()}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Print Order Details
                  </button>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header and Search Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {viewMode === 'list' ? 'Order Management' : 'Order Details'}
          </h1>
          {viewMode === 'list' && (
            <p className="text-gray-600">Total Orders: {filteredOrders.length} of {orders.length}</p>
          )}
        </div>

        {viewMode === 'list' && (
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-grow md:w-64">
              <input
                type="text"
                placeholder="Search orders..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            </div>

            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              <Filter size={18} />
              <span>Filters</span>
              <ChevronDown size={16} className={isFilterOpen ? 'rotate-180 transform' : ''} />
            </button>
          </div>
        )}
      </div>

      {/* Filter Panel */}
      {viewMode === 'list' && isFilterOpen && (
        <div className="bg-white p-5 mb-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-gray-700">Filter Orders</h3>
            <button
              onClick={resetFilters}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Reset Filters
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                className="w-full p-2.5 border border-gray-300 rounded-md bg-white"
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              >
                <option value="">All Statuses</option>
                <option value="Order Placed">Order Placed</option>
                <option value="Pending">Pending</option>
                <option value="Accepted">Accepted</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment</label>
              <select
                className="w-full p-2.5 border border-gray-300 rounded-md bg-white"
                value={filters.paymentStatus}
                onChange={(e) => setFilters({ ...filters, paymentStatus: e.target.value })}
              >
                <option value="">All Payments</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
              <select
                className="w-full p-2.5 border border-gray-300 rounded-md bg-white"
                value={filters.dateRange}
                onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="lastWeek">Last 7 Days</option>
                <option value="lastMonth">Last 30 Days</option>
              </select>
            </div>
          </div>
        </div>
      )}
      {isTrackingLinkModalOpen && <TrackingLinkModal />}
      {/* Content - Either Order List or Order Detail */}
      {viewMode === 'list' ? renderOrdersList() : renderOrderDetail()}
    </div>
  );
};

export default Orders;
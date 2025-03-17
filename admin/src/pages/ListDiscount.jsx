import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Pencil, Trash2, PlusCircle, X, Check, Info, Search, Filter, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { backendUrl } from "../App";

const ListDiscount = () => {
  const [discounts, setDiscounts] = useState([]);
  const [editModal, setEditModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewModal, setViewModal] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // "all", "active", "expired"

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const fetchDiscounts = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${backendUrl}/api/discount`);
      // Assuming the API returns data in { success: true, data: [...] } format
      const discountsArray = data.data || [];
      setDiscounts(discountsArray);
    } catch (error) {
      toast.error("Failed to fetch discounts");
      setDiscounts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this discount?")) {
      try {
        await axios.delete(`${backendUrl}/api/discount/${id}`);
        toast.success("Discount deleted successfully!");
        fetchDiscounts();
      } catch (error) {
        toast.error("Error deleting discount");
      }
    }
  };

  const openEditModal = (discount) => {
    // Format dates for the form
    const formattedDiscount = {
      ...discount,
      startDate: discount.startDate ? new Date(discount.startDate).toISOString().split('T')[0] : '',
      endDate: discount.endDate ? new Date(discount.endDate).toISOString().split('T')[0] : ''
    };
    setEditData(formattedDiscount);
    setEditModal(true);
  };

  const openViewModal = (discount) => {
    setViewData(discount);
    setViewModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditData({
      ...editData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${backendUrl}/api/discount/${editData._id}`, editData);
      toast.success("Discount updated successfully!");
      fetchDiscounts();
      setEditModal(false);
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to update discount");
    }
  };

  const handleToggleActive = async (id, currentStatus) => {
    try {
      await axios.put(`${backendUrl}/api/discount/${id}`, {
        isActive: !currentStatus
      });
      toast.success(`Discount ${currentStatus ? 'deactivated' : 'activated'} successfully!`);
      fetchDiscounts();
    } catch (error) {
      toast.error("Failed to update discount status");
    }
  };

  // Filter discounts based on search term and filter status
  const filteredDiscounts = discounts.filter(discount => {
    const matchesSearch = discount.code.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (discount.description && discount.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const now = new Date();
    const isExpired = new Date(discount.endDate) < now;
    
    if (filterStatus === "all") return matchesSearch;
    if (filterStatus === "active") return matchesSearch && discount.isActive && !isExpired;
    if (filterStatus === "expired") return matchesSearch && isExpired;
    if (filterStatus === "inactive") return matchesSearch && !discount.isActive;
    
    return matchesSearch;
  });

  // Check if a discount is currently valid (not expired and is active)
  const isDiscountValid = (discount) => {
    const now = new Date();
    return discount.isActive && new Date(discount.endDate) >= now;
  };

  // Create a formatted date string
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="p-3 md:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-4 md:mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-1 md:mb-2">Discount Coupons</h2>
        <p className="text-sm md:text-base text-gray-600">Manage your store's discount coupons and promotions</p>
      </div>

      {/* Action Bar */}
      <div className="bg-white p-3 md:p-4 rounded-lg shadow mb-4 md:mb-6">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="w-full sm:max-w-md flex flex-col md:flex-row gap-2">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search coupons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-auto"
            >
              <option value="all">All Coupons</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          
          <Link to="/add-discount" className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition duration-200 flex items-center gap-2 w-full sm:w-auto justify-center">
            <PlusCircle size={18} />
            <span>Add New Coupon</span>
          </Link>
        </div>
      </div>

      {/* Discount Table/Cards */}
      <div className="bg-white overflow-hidden shadow-lg rounded-lg">
        {loading ? (
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading discounts...</p>
          </div>
        ) : (
          <>
            {/* Desktop Table - Hidden on small screens */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100 border-b">
                    <th className="p-4 font-semibold">Code</th>
                    <th className="p-4 font-semibold">Type</th>
                    <th className="p-4 font-semibold">Value</th>
                    <th className="p-4 font-semibold">Min Order</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold">Valid Until</th>
                    <th className="p-4 font-semibold text-center">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredDiscounts.length > 0 ? (
                    filteredDiscounts.map((discount) => (
                      <tr key={discount._id} className="border-b hover:bg-gray-50 transition">
                        <td className="p-4 font-medium text-blue-600">{discount.code}</td>
                        <td className="p-4 capitalize">{discount.discountType}</td>
                        <td className="p-4">
                          {discount.discountValue}
                          {discount.discountType === 'percentage' ? '%' : ' USD'}
                        </td>
                        <td className="p-4">{discount.minOrderAmount > 0 ? `₹ ${discount.minOrderAmount}` : "-"}</td>
                        <td className="p-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            isDiscountValid(discount) 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {isDiscountValid(discount) ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="p-4">{formatDate(discount.endDate)}</td>
                        <td className="p-4">
                          <div className="flex justify-center gap-3">
                            <button 
                              className="text-blue-600 hover:text-blue-800 transition p-1"
                              onClick={() => openEditModal(discount)}
                              title="Edit discount"
                            >
                              <Pencil size={18} />
                            </button>
                            <button 
                              className="text-purple-600 hover:text-purple-800 transition p-1"
                              onClick={() => openViewModal(discount)}
                              title="View details"
                            >
                              <Info size={18} />
                            </button>
                            <button 
                              className={`${discount.isActive ? 'text-yellow-600 hover:text-yellow-800' : 'text-green-600 hover:text-green-800'} transition p-1`}
                              onClick={() => handleToggleActive(discount._id, discount.isActive)}
                              title={discount.isActive ? "Deactivate" : "Activate"}
                            >
                              {discount.isActive ? <X size={18} /> : <Check size={18} />}
                            </button>
                            <button 
                              className="text-red-600 hover:text-red-800 transition p-1"
                              onClick={() => handleDelete(discount._id)}
                              title="Delete discount"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center py-8 text-gray-500">
                        {searchTerm || filterStatus !== "all" 
                          ? "No matching discounts found." 
                          : "No discounts available."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Mobile Cards - Shown only on small screens */}
            <div className="md:hidden">
              {filteredDiscounts.length > 0 ? (
                <div className="divide-y">
                  {filteredDiscounts.map((discount) => (
                    <div key={discount._id} className="p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium text-blue-600">{discount.code}</h3>
                          <p className="text-xs text-gray-500 mt-1">
                            {discount.discountType === 'percentage' 
                              ? `${discount.discountValue}% off` 
                              : `$${discount.discountValue} off`}
                          </p>
                        </div>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          isDiscountValid(discount) 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {isDiscountValid(discount) ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      
                      <div className="flex text-xs text-gray-500 mb-3">
                        <div className="mr-4">
                          <span>Min: {discount.minOrderAmount > 0 ? `₹${discount.minOrderAmount}` : "None"}</span>
                        </div>
                        <div>
                          <span>Until: {formatDate(discount.endDate)}</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <button 
                          onClick={() => openViewModal(discount)}
                          className="text-blue-600 text-sm flex items-center"
                        >
                          View Details
                          <ChevronRight size={16} />
                        </button>
                        
                        <div className="flex gap-2">
                          <button 
                            className="text-blue-600 bg-blue-50 p-1.5 rounded-full"
                            onClick={() => openEditModal(discount)}
                            title="Edit"
                          >
                            <Pencil size={16} />
                          </button>
                          <button 
                            className={`${discount.isActive ? 'text-yellow-600 bg-yellow-50' : 'text-green-600 bg-green-50'} p-1.5 rounded-full`}
                            onClick={() => handleToggleActive(discount._id, discount.isActive)}
                            title={discount.isActive ? "Deactivate" : "Activate"}
                          >
                            {discount.isActive ? <X size={16} /> : <Check size={16} />}
                          </button>
                          <button 
                            className="text-red-600 bg-red-50 p-1.5 rounded-full"
                            onClick={() => handleDelete(discount._id)}
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 px-4">
                  {searchTerm || filterStatus !== "all" 
                    ? "No matching discounts found." 
                    : "No discounts available."}
                </div>
              )}
            </div>
            
            
              <div className="px-4 py-3 flex items-center justify-between border-t bg-gray-50">
                <div className="text-sm text-gray-600">
                  Showing <span className="font-medium">{filteredDiscounts.length}</span> of{" "}
                  <span className="font-medium">{discounts.length}</span> discounts
                </div>
              </div>
            
          </>
        )}
      </div>

      {/* Edit Discount Modal */}
      {editModal && editData && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white z-10 flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-800">Edit Discount</h3>
              <button onClick={() => setEditModal(false)} className="text-gray-600 hover:text-gray-800">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code</label>
                  <input 
                    type="text"
                    name="code"
                    value={editData.code}
                    onChange={handleEditChange}
                    className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea 
                    name="description"
                    value={editData.description || ""}
                    onChange={handleEditChange}
                    className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="2"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type</label>
                    <select 
                      name="discountType"
                      value={editData.discountType}
                      onChange={handleEditChange}
                      className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="percentage">Percentage</option>
                      <option value="fixed">Fixed Amount</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Discount Value</label>
                    <input 
                      type="number"
                      name="discountValue"
                      value={editData.discountValue}
                      onChange={handleEditChange}
                      className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Min Order Amount</label>
                    <input 
                      type="number"
                      name="minOrderAmount"
                      value={editData.minOrderAmount || ""}
                      onChange={handleEditChange}
                      className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Discount Amount</label>
                    <input 
                      type="number"
                      name="maxDiscountAmount"
                      value={editData.maxDiscountAmount || ""}
                      onChange={handleEditChange}
                      className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <input 
                      type="date"
                      name="startDate"
                      value={editData.startDate}
                      onChange={handleEditChange}
                      className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <input 
                      type="date"
                      name="endDate"
                      value={editData.endDate}
                      onChange={handleEditChange}
                      className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Usage Limit</label>
                    <input 
                      type="number"
                      name="usageLimit"
                      value={editData.usageLimit || ""}
                      onChange={handleEditChange}
                      className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Unlimited"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Per User Limit</label>
                    <input 
                      type="number"
                      name="perUserLimit"
                      value={editData.perUserLimit || ""}
                      onChange={handleEditChange}
                      className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Unlimited"
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input 
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={editData.isActive}
                    onChange={handleEditChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                    Active
                  </label>
                </div>

                <div className="flex gap-3 pt-2">
                  <button 
                    type="button"
                    onClick={() => setEditModal(false)}
                    className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Discount Details Modal */}
      {viewModal && viewData && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white z-10 flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-800">Discount Details</h3>
              <button onClick={() => setViewModal(false)} className="text-gray-600 hover:text-gray-800">
                <X size={20} />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <h4 className="text-lg font-bold text-blue-800">{viewData.code}</h4>
                <p className="text-sm text-gray-600">{viewData.description || "No description provided"}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Discount Type</p>
                  <p className="font-medium capitalize">{viewData.discountType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Discount Value</p>
                  <p className="font-medium">
                    {viewData.discountValue}
                    {viewData.discountType === 'percentage' ? '%' : ' USD'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Min Order Amount</p>
                  <p className="font-medium">{viewData.minOrderAmount ? `₹${viewData.minOrderAmount}` : "None"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Max Discount</p>
                  <p className="font-medium">{viewData.maxDiscountAmount ? `₹${viewData.maxDiscountAmount}` : "Unlimited"}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Start Date</p>
                  <p className="font-medium">{formatDate(viewData.startDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">End Date</p>
                  <p className="font-medium">{formatDate(viewData.endDate)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Usage Limit</p>
                  <p className="font-medium">{viewData.usageLimit || "Unlimited"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Current Usage</p>
                  <p className="font-medium">{viewData.currentUsage || 0}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500">Per User Limit</p>
                <p className="font-medium">{viewData.perUserLimit || "Unlimited"}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Status</p>
                <div className="flex items-center mt-1">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    viewData.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {viewData.isActive ? 'Active' : 'Inactive'}
                  </span>
                  
                  {viewData.isActive && new Date(viewData.endDate) < new Date() && (
                    <span className="inline-flex items-center ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Expired
                    </span>
                  )}
                </div>
              </div>

              {/* Restrictions section */}
              {(viewData.userRestrictions?.length > 0 || 
                viewData.productRestrictions?.length > 0 || 
                viewData.categoryRestrictions?.length > 0) && (
                <div className="mt-4 pt-4 border-t">
                  <h4 className="font-medium mb-2">Restrictions</h4>
                  
                  {viewData.userRestrictions?.length > 0 && (
                    <div className="mb-2">
                      <p className="text-sm text-gray-500">User Restrictions</p>
                      <p className="text-sm">{viewData.userRestrictions.length} specific users</p>
                    </div>
                  )}
                  
                  {viewData.productRestrictions?.length > 0 && (
                    <div className="mb-2">
                      <p className="text-sm text-gray-500">Product Restrictions</p>
                      <p className="text-sm">{viewData.productRestrictions.length} specific products</p>
                    </div>
                  )}
                  
                  {viewData.categoryRestrictions?.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-500">Category Restrictions</p>
                      <p className="text-sm">{viewData.categoryRestrictions.length} specific categories</p>
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button 
                  onClick={() => setViewModal(false)}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListDiscount;
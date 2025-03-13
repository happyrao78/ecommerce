import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Save, ArrowLeft, Calendar, Percent, IndianRupeeIcon,IndianRupee, Tag, AlertCircle, Users } from "lucide-react";
import {backendUrl} from "../App"

const AddDiscount = () => {
  const [formData, setFormData] = useState({
    code: "",
    description: "",
    discountType: "percentage",
    discountValue: "",
    minOrderAmount: "",
    maxDiscountAmount: "",
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Default to 30 days from now
    isActive: true,
    usageLimit: "",
    perUserLimit: "",
    productRestrictions: [],
    categoryRestrictions: [],
    userRestrictions: []
  });

  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [discountPreview, setDiscountPreview] = useState(null);
  const navigate = useNavigate();

  // Validate form fields
  const validateForm = () => {
    const errors = {};
    if (!formData.code) errors.code = "Coupon code is required";
    if (!formData.discountValue) errors.discountValue = "Discount value is required";
    if (formData.discountType === 'percentage' && formData.discountValue > 100) {
      errors.discountValue = "Percentage discount cannot exceed 100%";
    }
    if (!formData.startDate) errors.startDate = "Start date is required";
    if (!formData.endDate) errors.endDate = "End date is required";
    
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end < start) {
        errors.endDate = "End date cannot be before start date";
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Update discount preview when form values change
  useEffect(() => {
    if (formData.discountType && formData.discountValue) {
      const previewValue = formData.discountType === 'percentage' 
        ? `${formData.discountValue}% off` 
        : `Rs.${formData.discountValue} off`;
      
      let conditions = [];
      
      if (formData.minOrderAmount) {
        conditions.push(`on orders over ₹ ${formData.minOrderAmount}`);
      }
      
      if (formData.maxDiscountAmount && formData.discountType === 'percentage') {
        conditions.push(`(max ₹ ${formData.maxDiscountAmount})`);
      }
      
      const conditionText = conditions.length > 0 ? conditions.join(' ') : '';
      
      setDiscountPreview(`${previewValue} ${conditionText}`);
    } else {
      setDiscountPreview(null);
    }
  }, [formData.discountType, formData.discountValue, formData.minOrderAmount, formData.maxDiscountAmount]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Clear errors when field is modified
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: undefined
      });
    }
    
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please correct the errors in the form");
      return;
    }
    
    setLoading(true);
    
    try {
      // Format the data for submission
      const submitData = {
        ...formData,
        discountValue: parseFloat(formData.discountValue),
        minOrderAmount: formData.minOrderAmount ? parseFloat(formData.minOrderAmount) : 0,
        maxDiscountAmount: formData.maxDiscountAmount ? parseFloat(formData.maxDiscountAmount) : 0,
        usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : 0,
        perUserLimit: formData.perUserLimit ? parseInt(formData.perUserLimit) : 0,
      };
      
      await axios.post(`${backendUrl}/api/discount`, submitData);
      toast.success("Discount coupon created successfully!");
      navigate("/list-discount");
    } catch (error) {
      console.error("Error creating discount:", error);
      const errorMsg = error.response?.data?.error || "Failed to create discount coupon";
      toast.error(Array.isArray(errorMsg) ? errorMsg[0] : errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Generate a random code
  const generateRandomCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    setFormData({
      ...formData,
      code: result
    });
    
    // Clear any error for code field
    if (formErrors.code) {
      setFormErrors({
        ...formErrors,
        code: undefined
      });
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-white p-6 rounded-t-lg shadow-sm border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Create Discount Coupon</h1>
              <p className="text-gray-600 mt-1">Add a new discount coupon to your store</p>
            </div>
            <button 
              className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
              onClick={() => navigate("/list-discount")}
            >
              <ArrowLeft size={18} />
              Back to List
            </button>
          </div>
        </div>

        {/* Main Form */}
        <div className="bg-white p-6 rounded-b-lg shadow-sm mb-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Preview Card */}
            {discountPreview && (
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <h3 className="text-blue-800 font-medium mb-1">Discount Preview</h3>
                <div className="flex items-center gap-2">
                  <Tag className="text-blue-600" size={20} />
                  <div>
                    <p className="font-bold text-gray-700">{formData.code || "COUPONCODE"}</p>
                    <p className="text-gray-600">{discountPreview}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Main Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-800 text-lg">Basic Information</h3>
                  
                  {/* Coupon Code */}
                  <div>
                    <div className="flex justify-between">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code*</label>
                      <button 
                        type="button" 
                        onClick={generateRandomCode}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        Generate Random Code
                      </button>
                    </div>
                    <div className="relative">
                      <input 
                        type="text"
                        name="code"
                        placeholder="e.g. SUMMER25"
                        value={formData.code}
                        onChange={handleChange}
                        className={`pl-9 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.code ? 'border-red-500' : 'border-gray-300'}`}
                      />
                      <Tag className="absolute left-3 top-2.5 text-gray-400" size={18} />
                    </div>
                    {formErrors.code && <p className="text-red-500 text-xs mt-1">{formErrors.code}</p>}
                  </div>
                  
                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                    <textarea 
                      name="description"
                      placeholder="Briefly describe this discount"
                      value={formData.description}
                      onChange={handleChange}
                      className="border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]"
                    />
                  </div>
                  
                  {/* Discount Type & Value */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type*</label>
                      <div className="relative">
                        <select 
                          name="discountType"
                          value={formData.discountType}
                          onChange={handleChange}
                          className="pl-9 pr-2 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                        >
                          <option value="percentage">Percentage</option>
                          <option value="fixed">Fixed Amount</option>
                        </select>
                        {formData.discountType === 'percentage' ? (
                          <Percent className="absolute left-3 top-2.5 text-gray-400" size={18} />
                        ) : (
                          <IndianRupeeIcon className="absolute left-3 top-2.5 text-gray-400" size={18} />
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Discount Value*</label>
                      <div className="relative">
                        <input 
                          type="number"
                          name="discountValue"
                          placeholder={formData.discountType === 'percentage' ? "e.g. 20" : "e.g. 10"}
                          value={formData.discountValue}
                          onChange={handleChange}
                          min="0"
                          max={formData.discountType === 'percentage' ? "100" : ""}
                          className={`pl-9 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.discountValue ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {formData.discountType === 'percentage' ? (
                          <Percent className="absolute left-3 top-2.5 text-gray-400" size={18} />
                        ) : (
                          <IndianRupeeIcon className="absolute left-3 top-2.5 text-gray-400" size={18} />
                        )}
                      </div>
                      {formErrors.discountValue && <p className="text-red-500 text-xs mt-1">{formErrors.discountValue}</p>}
                    </div>
                  </div>
                  
                  {/* Min Order & Max Discount */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Min Order Amount</label>
                      <div className="relative">
                        <input 
                          type="number"
                          name="minOrderAmount"
                          placeholder="e.g. 50"
                          value={formData.minOrderAmount}
                          onChange={handleChange}
                          min="0"
                          className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <IndianRupeeIcon className="absolute left-3 top-2.5 text-gray-400" size={18} />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Max Discount Amount</label>
                      <div className="relative">
                        <input 
                          type="number"
                          name="maxDiscountAmount"
                          placeholder="e.g. 100"
                          value={formData.maxDiscountAmount}
                          onChange={handleChange}
                          min="0"
                          className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <IndianRupeeIcon className="absolute left-3 top-2.5 text-gray-400" size={18} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right Column */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-800 text-lg">Validity & Usage</h3>
                  
                  {/* Date Range */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Start Date*</label>
                      <div className="relative">
                        <input 
                          type="date"
                          name="startDate"
                          value={formData.startDate}
                          onChange={handleChange}
                          className={`pl-9 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.startDate ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        <Calendar className="absolute left-3 top-2.5 text-gray-400" size={18} />
                      </div>
                      {formErrors.startDate && <p className="text-red-500 text-xs mt-1">{formErrors.startDate}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">End Date*</label>
                      <div className="relative">
                        <input 
                          type="date"
                          name="endDate"
                          value={formData.endDate}
                          onChange={handleChange}
                          className={`pl-9 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.endDate ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        <Calendar className="absolute left-3 top-2.5 text-gray-400" size={18} />
                      </div>
                      {formErrors.endDate && <p className="text-red-500 text-xs mt-1">{formErrors.endDate}</p>}
                    </div>
                  </div>
                  
                  {/* Usage Limits */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Total Usage Limit</label>
                      <div className="relative">
                        <input 
                          type="number"
                          name="usageLimit"
                          placeholder="Leave empty for unlimited"
                          value={formData.usageLimit}
                          onChange={handleChange}
                          min="0"
                          className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <Users className="absolute left-3 top-2.5 text-gray-400" size={18} />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Per User Limit</label>
                      <div className="relative">
                        <input 
                          type="number"
                          name="perUserLimit"
                          placeholder="Leave empty for unlimited"
                          value={formData.perUserLimit}
                          onChange={handleChange}
                          min="0"
                          className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <Users className="absolute left-3 top-2.5 text-gray-400" size={18} />
                      </div>
                    </div>
                  </div>
                  
                  {/* Status */}
                  <div className="mt-4">
                    <div className="flex items-center">
                      <input 
                        type="checkbox"
                        id="isActive"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                        Make coupon active immediately
                      </label>
                    </div>
                    {!formData.isActive && (
                      <div className="mt-2 flex items-start gap-2 text-yellow-600 bg-yellow-50 p-2 rounded">
                        <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                        <p className="text-xs">This discount will be saved but won't be active until you enable it later.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Form Actions */}
            <div className="pt-4 border-t border-gray-200 flex gap-3 justify-end">
              <button 
                type="button"
                onClick={() => navigate("/list-discount")}
                className="bg-white text-gray-700 border border-gray-300 px-5 py-2 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    <span>Create Discount</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddDiscount;
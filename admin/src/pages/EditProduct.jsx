import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';

const EditProduct = ({ token }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [product, setProduct] = useState({
    name: "",
    description: "",
    detailedDescription: "",
    price: 0,
    originalPrice: 0,
    quantity: 0,
    bestseller: false,
    top: false,
    newly: false,
    hot: false,
    popular: false,
    image: []
  });

  // Common size options
  const availableSizes = ["XS", "S", "M", "L", "XL", "XXL"];
  
  // Category states
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [loadingCategories, setLoadingCategories] = useState(false);

  // State for image files
  const [imageFiles, setImageFiles] = useState({
    image1: null,
    image2: null,
    image3: null,
    image4: null,
    video: null
  });

  // State for image previews
  const [previews, setPreviews] = useState({
    image1: "",
    image2: "",
    image3: "",
    image4: "",
    video: ""
  });

  // Fetch categories from the backend
  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const response = await axios.get(
        `${backendUrl}/api/category/getSubCategory`,
        { headers: { token } }
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
      setLoadingCategories(false);
    }
  };

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${backendUrl}/api/product/single`, 
        { productId: id },
        { 
          headers: { 
            token,
            'Content-Type': 'application/json'
          } 
        }
      );
      
      if (response.data.success) {
        const fetchedProduct = response.data.product;
        
        if (!fetchedProduct) {
          toast.error("Product data is empty");
          return;
        }
        
        // Set product data with fallbacks to prevent null errors
        // Explicitly use Number for quantity to ensure correct type
        setProduct({
          name: fetchedProduct.name || "",
          description: fetchedProduct.description || "",
          detailedDescription: fetchedProduct.detailedDescription || "",
          price: parseFloat(fetchedProduct.price) || 0,
          originalPrice: parseFloat(fetchedProduct.originalPrice) || 0,
          sizes: Array.isArray(fetchedProduct.sizes) ? fetchedProduct.sizes : [],
          quantity: Number(fetchedProduct.quantity) || 0,
          bestseller: Boolean(fetchedProduct.bestseller),
          top: Boolean(fetchedProduct.top),
          newly: Boolean(fetchedProduct.newly),
          hot: Boolean(fetchedProduct.hot),
          popular: Boolean(fetchedProduct.popular),
          image: fetchedProduct.image || []
        });

        // Set category and subcategory
        setSelectedCategory(fetchedProduct.category || "");
        setSelectedSubcategory(fetchedProduct.subCategory || "");

        // Set image previews from existing product images
        if (fetchedProduct.image && fetchedProduct.image.length > 0) {
          const imagePreviewsObj = {};
          fetchedProduct.image.forEach((url, index) => {
            if (index < 4) {
              imagePreviewsObj[`image${index + 1}`] = url;
            }
          });
          setPreviews({
            ...previews,
            ...imagePreviewsObj,
            video: fetchedProduct.video || ""
          });
        }
        
      } else {
        toast.error(response.data.message || "Failed to fetch product");
      }
    } catch (error) {
      toast.error(`Error fetching product: ${error.message || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  // Update subcategories based on selected category
  const updateSubcategories = () => {
    if (selectedCategory && categories.length > 0) {
      const categoryObj = categories.find(cat => cat.category === selectedCategory);
      if (categoryObj) {
        setSubcategories(categoryObj.subcategories);
      }
    }
  };

  useEffect(() => {
    if (!token) {
      toast.error("Authentication token is missing");
      navigate('/login');
      return;
    }
    
    if (!id) {
      toast.error("Product ID is missing");
      navigate('/list');
      return;
    }
    
    fetchCategories();
    fetchProduct();
  }, [id, token, navigate]);

  // Update subcategories when categories are loaded or selected category changes
  useEffect(() => {
    updateSubcategories();
  }, [selectedCategory, categories]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === "checkbox") {
      setProduct(prev => ({ ...prev, [name]: checked }));
    } else if (name === "quantity") {
      // Ensure it's always a number, not a string
      const numericValue = value === "" ? 0 : parseInt(value, 10);
      setProduct(prev => ({ 
        ...prev, 
        quantity: isNaN(numericValue) ? 0 : numericValue 
      }));
    } else if (type === "number") {
      setProduct(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setProduct(prev => ({ ...prev, [name]: value }));
    }
  };

  // Handle category change
  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;
    setSelectedCategory(newCategory);
    
    // Find the selected category object
    const categoryObj = categories.find(cat => cat.category === newCategory);
    
    // Update subcategories based on selected category
    if (categoryObj) {
      setSubcategories(categoryObj.subcategories);
      
      // Set default subcategory if available, otherwise clear it
      if (categoryObj.subcategories.length > 0) {
        setSelectedSubcategory(categoryObj.subcategories[0]);
      } else {
        setSelectedSubcategory("");
      }
    } else {
      setSubcategories([]);
      setSelectedSubcategory("");
    }
  };

  const handleSizeToggle = (size) => {
    setProduct(prev => {
      const sizes = [...prev.sizes];
      if (sizes.includes(size)) {
        // Remove size if already selected
        return { ...prev, sizes: sizes.filter(s => s !== size) };
      } else {
        // Add size if not selected
        return { ...prev, sizes: [...sizes, size] };
      }
    });
  };

  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    // Update imageFiles state with the correct key
    setImageFiles(prev => ({
      ...prev,
      [`image${index}`]: file
    }));

    // Create preview URL for the image
    const previewUrl = URL.createObjectURL(file);
    setPreviews(prev => ({
      ...prev,
      [`image${index}`]: previewUrl
    }));
  };

  const handleRemoveImage = (index) => {
    // Clear the preview and file for the specific index
    setPreviews(prev => ({
      ...prev,
      [`image${index}`]: ""
    }));
    
    setImageFiles(prev => ({
      ...prev,
      [`image${index}`]: null
    }));
    
    // Update the product's image array by removing the image at index-1
    setProduct(prev => {
      // Create a copy of the current image array
      const updatedImages = [...prev.image];
      
      // Remove the image at the specified index-1 (zero-based array)
      if (updatedImages.length >= index) {
        updatedImages.splice(index - 1, 1);
      }
      
      return { ...prev, image: updatedImages };
    });
  
    // Shift all images after the removed one to fill the gap in previews
    for (let i = index; i < 4; i++) {
      if (i < 3) { // Only shift if not the last position
        setPreviews(prev => ({
          ...prev,
          [`image${i}`]: prev[`image${i+1}`] || "",
          [`image${i+1}`]: i === 3 ? "" : prev[`image${i+1}`]
        }));
        
        setImageFiles(prev => ({
          ...prev,
          [`image${i}`]: prev[`image${i+1}`] || null,
          [`image${i+1}`]: i === 3 ? null : prev[`image${i+1}`]
        }));
      } else {
        // Clear the last position
        setPreviews(prev => ({ ...prev, [`image${i}`]: "" }));
        setImageFiles(prev => ({ ...prev, [`image${i}`]: null }));
      }
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    // Validate if category and subcategory are selected
    if (!selectedCategory) {
        toast.error("Please select a category");
        return;
    }
    
    if (!selectedSubcategory) {
        toast.error("Please select a subcategory");
        return;
    }
    
    setSaving(true);
    
    // Log quantity before sending
    console.log("Quantity before submission:", product.quantity, typeof product.quantity);
  
    try {
      const formData = new FormData();
  
      // Append basic product information
      formData.append("name", product.name);
      formData.append("description", product.description);
      formData.append("detailedDescription", product.detailedDescription);
      formData.append("price", product.price);
      formData.append("originalPrice", product.originalPrice);
      formData.append("category", selectedCategory);
      formData.append("subCategory", selectedSubcategory);
      formData.append("sizes", JSON.stringify(product.sizes));
      
      // Convert quantity to string explicitly to avoid type issues
      formData.append("quantity", String(product.quantity));
      
      formData.append("bestseller", product.bestseller ? "true" : "false");
      formData.append("top", product.top ? "true" : "false");
      formData.append("newly", product.newly ? "true" : "false");
      formData.append("hot", product.hot ? "true" : "false");
      formData.append("popular", product.popular ? "true" : "false");
      formData.append("productId", id);
  
      // Handle image uploads - both new and existing
      for (let i = 1; i <= 4; i++) {
        if (imageFiles[`image${i}`]) {
          formData.append(`image${i}`, imageFiles[`image${i}`]);
        }
      }
  
      // Filter out blob URLs from existing images
      const existingImagesWithOrder = [
        previews.image1 && !previews.image1.startsWith('blob:') ? previews.image1 : null,
        previews.image2 && !previews.image2.startsWith('blob:') ? previews.image2 : null,
        previews.image3 && !previews.image3.startsWith('blob:') ? previews.image3 : null,
        previews.image4 && !previews.image4.startsWith('blob:') ? previews.image4 : null
      ];
  
      // Pass the existing images to the backend with their exact ordering
      formData.append("existingImages", JSON.stringify(existingImagesWithOrder));
      
      // Handle video
      if (imageFiles.video) {
        formData.append("video", imageFiles.video);
      } else if (previews.video && !previews.video.startsWith('blob:')) {
        formData.append("existingVideo", previews.video);
      }
  
      // Log the data being sent to verify quantity
      console.log("FormData quantity:", formData.get("quantity"));
  
      const response = await axios.put(`${backendUrl}/api/product/update`, formData, {
        headers: {
          token,
          "Content-Type": "multipart/form-data",
        },
      });
  
      if (response.data.success) {
        toast.success(response.data.message || "Product updated successfully");
        navigate("/list");
      } else {
        toast.error(response.data.message || "Failed to update product");
      }
    } catch (error) {
      toast.error(`Error updating product: ${error.message || "Unknown error"}`);
    } finally {
      setSaving(false);
    }
  };

  // Fix the useEffect for setting initial previews
  useEffect(() => {
    if (product && product.image && product.image.length > 0) {
      // Filter out any blob URLs from initial load
      const initialPreviews = {
        image1: product.image[0] && !product.image[0].startsWith('blob:') ? product.image[0] : "",
        image2: product.image[1] && !product.image[1].startsWith('blob:') ? product.image[1] : "",
        image3: product.image[2] && !product.image[2].startsWith('blob:') ? product.image[2] : "",
        image4: product.image[3] && !product.image[3].startsWith('blob:') ? product.image[3] : "",
        video: product.video && !product.video.startsWith('blob:') ? product.video : ""
      };
      setPreviews(initialPreviews);
    }
  }, [product.image, product.video]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent mb-4"></div>
          <p className="text-lg text-gray-700 font-medium">Loading product details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
        <button 
          onClick={() => navigate('/list')}
          className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition"
        >
          Back to List
        </button>
      </div>
      
      <form onSubmit={handleUpdate} className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="border-b border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
              <input 
                type="text" 
                name="name" 
                value={product.name} 
                onChange={handleChange} 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                required 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              {loadingCategories ? (
                <div className="animate-pulse h-10 bg-gray-200 rounded-md w-full"></div>
              ) : (
                <select 
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat.category} value={cat.category}>{cat.category}</option>
                  ))}
                </select>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sub-Category</label>
              {loadingCategories ? (
                <div className="animate-pulse h-10 bg-gray-200 rounded-md w-full"></div>
              ) : (
                <select 
                  value={selectedSubcategory}
                  onChange={(e) => setSelectedSubcategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  <option value="">Select a sub-category</option>
                  {subcategories.map(subcat => (
                    <option key={subcat} value={subcat}>{subcat}</option>
                  ))}
                  {subcategories.length === 0 && (
                    <option value="" disabled>No subcategories available</option>
                  )}
                </select>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bestseller</label>
              <div className="flex items-center mt-2">
                <div 
                  className={`relative inline-block w-12 h-6 transition-colors duration-200 ease-in-out rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${product.bestseller ? 'bg-indigo-600' : 'bg-gray-200'}`}
                  onClick={() => setProduct(prev => ({ ...prev, bestseller: !prev.bestseller }))}
                >
                  <span 
                    className={`inline-block w-5 h-5 transition duration-200 ease-in-out transform bg-white rounded-full shadow-md ${product.bestseller ? 'translate-x-6' : 'translate-x-1'}`}
                  />
                </div>
                <span className="ml-3 text-sm">{product.bestseller ? 'Yes' : 'No'}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Top Section</label>
              <div className="flex items-center mt-2">
                <div 
                  className={`relative inline-block w-12 h-6 transition-colors duration-200 ease-in-out rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${product.top ? 'bg-indigo-600' : 'bg-gray-200'}`}
                  onClick={() => setProduct(prev => ({ ...prev, top: !prev.top }))}
                >
                  <span 
                    className={`inline-block w-5 h-5 transition duration-200 ease-in-out transform bg-white rounded-full shadow-md ${product.top ? 'translate-x-6' : 'translate-x-1'}`}
                  />
                </div>
                <span className="ml-3 text-sm">{product.top ? 'Yes' : 'No'}</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Newly Launched</label>
              <div className="flex items-center mt-2">
                <div 
                  className={`relative inline-block w-12 h-6 transition-colors duration-200 ease-in-out rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${product.newly ? 'bg-indigo-600' : 'bg-gray-200'}`}
                  onClick={() => setProduct(prev => ({ ...prev, newly: !prev.newly }))}
                >
                  <span 
                    className={`inline-block w-5 h-5 transition duration-200 ease-in-out transform bg-white rounded-full shadow-md ${product.newly ? 'translate-x-6' : 'translate-x-1'}`}
                  />
                </div>
                <span className="ml-3 text-sm">{product.newly ? 'Yes' : 'No'}</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hot Section</label>
              <div className="flex items-center mt-2">
                <div 
                  className={`relative inline-block w-12 h-6 transition-colors duration-200 ease-in-out rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${product.hot ? 'bg-indigo-600' : 'bg-gray-200'}`}
                  onClick={() => setProduct(prev => ({ ...prev, hot: !prev.hot }))}
                >
                  <span 
                    className={`inline-block w-5 h-5 transition duration-200 ease-in-out transform bg-white rounded-full shadow-md ${product.hot ? 'translate-x-6' : 'translate-x-1'}`}
                  />
                </div>
                <span className="ml-3 text-sm">{product.hot ? 'Yes' : 'No'}</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Popular Section</label>
              <div className="flex items-center mt-2">
                <div 
                  className={`relative inline-block w-12 h-6 transition-colors duration-200 ease-in-out rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${product.popular ? 'bg-indigo-600' : 'bg-gray-200'}`}
                  onClick={() => setProduct(prev => ({ ...prev, popular: !prev.popular }))}
                >
                  <span 
                    className={`inline-block w-5 h-5 transition duration-200 ease-in-out transform bg-white rounded-full shadow-md ${product.popular ? 'translate-x-6' : 'translate-x-1'}`}
                  />
                </div>
                <span className="ml-3 text-sm">{product.popular ? 'Yes' : 'No'}</span>
              </div>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea 
                name="description" 
                value={product.description} 
                onChange={handleChange} 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                required 
                rows={4}
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Detailed Description</label>
              <textarea
                name="detailedDescription"
                value={product.detailedDescription}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
                rows={6}
              />
            </div>

          </div>
        </div>
        
        <div className="border-b border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Pricing & Inventory</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Price ($)</label>
              <input 
                type="number" 
                name="price" 
                value={product.price} 
                onChange={handleChange} 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                required 
                min="0"
                step="0.01"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Original Price ($)</label>
              <input 
                type="number" 
                name="originalPrice" 
                value={product.originalPrice} 
                onChange={handleChange} 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                required 
                min="0"
                step="0.01"
              />
              {product.originalPrice > 0 && product.price > 0 && (
                <p className="text-sm text-gray-500 mt-1">
                  Discount: {Math.round((1 - product.price / product.originalPrice) * 100)}%
                </p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity in Stock</label>
              <input 
                type="number" 
                name="quantity" 
                value={product.quantity} 
                onChange={handleChange} 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                required 
                min="0"
                step="1"
              />
              {/* Debug info - can be removed after fix */}
              <p className="text-xs text-gray-500 mt-1">
                Current quantity value: {product.quantity} (type: {typeof product.quantity})
              </p>
              {product.quantity <= 20 && (
                <p className="text-sm text-orange-500 mt-1">
                  Low stock alert: {product.quantity} items left
                </p>
              )}
            </div>
          </div>
        </div>
        
        <div className="border-b border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Sizes</h2>
          
          <div className="flex flex-wrap gap-3">
            {availableSizes.map(size => (
              <div 
                key={size}
                onClick={() => handleSizeToggle(size)}
                className={`
                  cursor-pointer px-5 py-2 rounded-md border-2 transition-all
                  ${product.sizes.includes(size) 
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-medium' 
                    : 'border-gray-300 bg-white text-gray-700'}
                `}
              >
                {size}
              </div>
            ))}
          </div>
          {product.sizes.length === 0 && (
            <p className="text-sm text-red-500 mt-2">Please select at least one size</p>
          )}
        </div>
        
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Product Images</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="relative">
                <div className="aspect-square border-2 border-dashed border-gray-300 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
                  {previews[`image${index + 1}`] ? (
                    <>
                      <img 
                        src={previews[`image${index + 1}`]} 
                        alt={`Product preview ${index + 1}`} 
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index + 1)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-md hover:bg-red-600 transition"
                      >
                        ×
                      </button>
                    </>
                  ) : (
                    <div className="text-center p-4">
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="mt-1 text-sm text-gray-500">No image</p>
                    </div>
                  )}
                </div>
                
                <div className="mt-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image {index + 1}</label>
                  <input
                    type="file"
                    onChange={(e) => handleImageChange(e, index + 1)}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                    accept="image/*"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
          <button 
            type="button" 
            onClick={() => navigate('/list')}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          
          <button 
            type="submit" 
            disabled={saving}
            className={`px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition flex items-center ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {saving && (
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {saving ? 'Saving...' : 'Update Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
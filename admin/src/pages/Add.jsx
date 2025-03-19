import React, { useEffect, useState } from 'react'
import { assets } from '../assets/admin_assets/assets'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'

const Add = ({ token }) => {
    // Image states
    const [image1, setImage1] = useState(false)
    const [image2, setImage2] = useState(false)
    const [image3, setImage3] = useState(false)
    const [image4, setImage4] = useState(false)

    // Product details states
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [detailedDescription, setDetailedDescription] = useState("")
    const [price, setPrice] = useState("")
    const [originalPrice, setOriginalPrice] = useState("")
    const [sizes, setSizes] = useState([]);
    const [quantity, setQuantity] = useState("")
    const [bestseller, setBestseller] = useState(false)
    const [top, setTop] = useState(false)
    const [newly, setNewly] = useState(false)
    const [hot, setHot] = useState(false)
    const [popular, setPopular] = useState(false)
    
    // Category states - Note: these are now strings, not arrays or objects
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("")
    const [subcategories, setSubcategories] = useState([]);
    const [selectedSubcategory, setSelectedSubcategory] = useState("")
    
    // Loading states
    const [loading, setLoading] = useState(false)
    const [adding, setAdding] = useState(false)

    // Changed: Replaced single attribute with multiple attributes array
    const [attributes, setAttributes] = useState([]);
    const [selectedAttributes, setSelectedAttributes] = useState([]);

    // Function to fetch attributes from backend
    const fetchAttributes = async () => {
        try {
            const response = await axios.get(
                `${backendUrl}/api/attribute/list`,
                { headers: {token} }
            );
            
            if (response.data.success) {
                setAttributes(response.data.attributes);
            } else {
                toast.error('Failed to fetch attributes');
            }
        } catch (error) {
            console.error(error);
            toast.error('Error occurred while fetching attributes');
        }
    };

    // Add attribute to selected attributes
    const addAttribute = () => {
        // Prevent adding empty attributes
        if (attributes.length === 0) return;
        
        // Find first available attribute that hasn't been added yet
        const availableAttributes = attributes.filter(attr => 
            !selectedAttributes.some(selected => selected.attributeId === attr._id)
        );
        
        if (availableAttributes.length > 0) {
            setSelectedAttributes([
                ...selectedAttributes, 
                { 
                    attributeId: availableAttributes[0]._id,
                    attributeName: availableAttributes[0].attributeName,
                    values: []
                }
            ]);
        } else {
            toast.info('All available attributes have been added');
        }
    };

    // Remove attribute from selected attributes
    const removeAttribute = (attributeId) => {
        setSelectedAttributes(selectedAttributes.filter(attr => attr.attributeId !== attributeId));
    };

    // Update selected attribute values
    const toggleAttributeValue = (attributeId, value) => {
        setSelectedAttributes(selectedAttributes.map(attr => {
            if (attr.attributeId === attributeId) {
                const newValues = attr.values.includes(value)
                    ? attr.values.filter(v => v !== value)
                    : [...attr.values, value];
                
                return { ...attr, values: newValues };
            }
            return attr;
        }));
    };

    // Update attribute ID when changed
    const handleAttributeChange = (oldAttributeId, newAttributeId) => {
        setSelectedAttributes(selectedAttributes.map(attr => {
            if (attr.attributeId === oldAttributeId) {
                const newAttribute = attributes.find(a => a._id === newAttributeId);
                return { 
                    attributeId: newAttributeId,
                    attributeName: newAttribute.attributeName,
                    values: [] // Reset values when changing attribute
                };
            }
            return attr;
        }));
    };

    const fetchCategories = async () => {
        setLoading(true)
        try {
            const response = await axios.get(
                `${backendUrl}/api/category/getSubCategory`,
                { headers: {token} }
            );
            
            if (response.data.success) {
                const categoryData = response.data.categories;
                setCategories(categoryData);
                
                // Set default selected category if available
                if (categoryData.length > 0) {
                    setSelectedCategory(categoryData[0].category);
                    
                    // Set available subcategories for the selected category
                    setSubcategories(categoryData[0].subcategories);
                    
                    // Set default subcategory if available
                    if (categoryData[0].subcategories.length > 0) {
                        setSelectedSubcategory(categoryData[0].subcategories[0]);
                    } else {
                        setSelectedSubcategory("");
                    }
                }
            } else {
                toast.error('Failed to fetch categories');
            }
        } catch (error) {
            console.error(error);
            toast.error('Error occurred while fetching categories');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        console.log("token added ", token)
        fetchCategories();
        fetchAttributes();
    }, [token]);

    // Update subcategories when category changes
    const handleCategoryChange = (e) => {
        const newCategory = e.target.value;
        setSelectedCategory(newCategory);
        
        // Find the selected category object
        const categoryObj = categories.find(cat => cat.category === newCategory);
        
        // Update subcategories based on selected category
        if (categoryObj) {
            setSubcategories(categoryObj.subcategories);
            
            // Set default subcategory if available
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
    
    const onSubmitHandler = async (e) => {
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
        
        setAdding(true);
        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("description", description);
            formData.append("detailedDescription", detailedDescription);
            formData.append("price", price);
            formData.append("originalPrice", originalPrice);
            formData.append("category", selectedCategory);
            formData.append("subCategory", selectedSubcategory);
            formData.append("bestseller", bestseller);
            formData.append("top", top);
            formData.append("newly", newly);
            formData.append("hot", hot);
            formData.append("popular", popular);
            formData.append("sizes", JSON.stringify(sizes));
            formData.append("quantity", quantity);
            
            // Changed: Filter out attributes with no values and format for API
            const attributesData = selectedAttributes
                .filter(attr => attr.values.length > 0)
                .map(attr => ({
                    attributeId: attr.attributeId,
                    values: attr.values
                }));
            
            if (attributesData.length > 0) {
                formData.append("attributes", JSON.stringify(attributesData));
            }

            if (image1) formData.append("image1", image1);
            if (image2) formData.append("image2", image2);
            if (image3) formData.append("image3", image3);
            if (image4) formData.append("image4", image4);

            const response = await axios.post(
                `${backendUrl}/api/product/add`, 
                formData, 
                { headers: {token} }
            );

            if (response.data.success) {
                toast.success(response.data.message);
                // Reset form
                setName("");
                setDescription("");
                setDetailedDescription("");
                setPrice("");
                setOriginalPrice("");
                setSizes([]);
                setQuantity("");
                setBestseller(false);
                setTop(false);
                setNewly(false);
                setHot(false);
                setPopular(false);
                setImage1(false);
                setImage2(false);
                setImage3(false);
                setImage4(false);
                setSelectedAttributes([]);
                // Don't reset category and subcategory to maintain user context
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setAdding(false);
        }
    }

    return (
        <form onSubmit={onSubmitHandler} className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto my-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Add New Product</h2>
            
            <div className='flex flex-col w-full items-start gap-3'>
                <p className='mb-2 font-medium'>Upload Images</p>

                <div className='flex gap-2'>
                    <label htmlFor="image1" className="cursor-pointer">
                        <img className="w-20 h-20 object-cover border border-gray-300 rounded-md" 
                             src={!image1 ? assets.upload_area : URL.createObjectURL(image1)} 
                             alt="Product preview" />
                        <input onChange={(e) => setImage1(e.target.files[0])} type="file" id='image1' hidden />
                    </label>

                    <label htmlFor="image2" className="cursor-pointer">
                        <img className="w-20 h-20 object-cover border border-gray-300 rounded-md" 
                             src={!image2 ? assets.upload_area : URL.createObjectURL(image2)} 
                             alt="Product preview" />
                        <input onChange={(e) => setImage2(e.target.files[0])} type="file" id='image2' hidden />
                    </label>

                    <label htmlFor="image3" className="cursor-pointer">
                        <img className="w-20 h-20 object-cover border border-gray-300 rounded-md" 
                             src={!image3 ? assets.upload_area : URL.createObjectURL(image3)} 
                             alt="Product preview" />
                        <input onChange={(e) => setImage3(e.target.files[0])} type="file" id='image3' hidden />
                    </label>

                    <label htmlFor="image4" className="cursor-pointer">
                        <img className="w-20 h-20 object-cover border border-gray-300 rounded-md" 
                             src={!image4 ? assets.upload_area : URL.createObjectURL(image4)} 
                             alt="Product preview" />
                        <input onChange={(e) => setImage4(e.target.files[0])} type="file" id='image4' hidden />
                    </label>
                </div>

                <div className='w-full mt-4'>
                    <p className='mb-2 font-medium'>Product Name</p>
                    <input 
                        type="text" 
                        placeholder='Type Here' 
                        required 
                        className='w-full max-w-[500px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                        onChange={(e) => setName(e.target.value)}
                        value={name} 
                    />
                </div>
                
                <div className='w-full mt-2'>
                    <p className='mb-2 font-medium'>Product Description</p>
                    <textarea 
                        placeholder='Write content here' 
                        required 
                        className='w-full max-w-[500px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]'
                        onChange={(e) => setDescription(e.target.value)}
                        value={description} 
                    />
                </div>

                <div className='w-full mt-2'>
                    <p className='mb-2 font-medium'>Detailed Description</p>
                    <textarea
                        placeholder='Write content here'
                        required
                        className='w-full max-w-[500px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]'
                        onChange={(e) => setDetailedDescription(e.target.value)}
                        value={detailedDescription}
                    />
                </div>

                <div className='flex flex-col sm:flex-row gap-3 w-full sm:gap-8 mt-2'>
                    <div className="w-full sm:w-1/3">
                        <p className='mb-2 font-medium'>
                            Product Category
                        </p>
                        {loading ? (
                            <div className="animate-pulse h-10 bg-gray-200 rounded-md w-full"></div>
                        ) : (
                            <select 
                                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500' 
                                onChange={handleCategoryChange}
                                value={selectedCategory}
                                required
                            >
                                <option value="" disabled>Select Category</option>
                                {categories.map((cat) => (
                                    <option key={cat.category} value={cat.category}>
                                        {cat.category}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>


                    <div className="w-full sm:w-1/3">
                        <p className='mb-2 font-medium'>
                            Product Subcategory
                        </p>
                        {loading ? (
                            <div className="animate-pulse h-10 bg-gray-200 rounded-md w-full"></div>
                        ) : (
                            <select 
                                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                                onChange={(e) => setSelectedSubcategory(e.target.value)}
                                value={selectedSubcategory}
                                required
                            >
                                <option value="" disabled>Select Subcategory</option>
                                {subcategories.map((subcat) => (
                                    <option key={subcat} value={subcat}>
                                        {subcat}
                                    </option>
                                ))}
                                {subcategories.length === 0 && (
                                    <option value="" disabled>No subcategories available</option>
                                )}
                            </select>
                        )}
                    </div>
                    
                    <div className="w-full sm:w-1/3">
                        <p className='mb-2 font-medium'>Quantity</p>
                        <input 
                            type="number" 
                            placeholder='Quantity' 
                            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500' 
                            onChange={(e) => setQuantity(e.target.value)}
                            value={quantity}
                            required
                            min="1"
                        />
                    </div>
                </div>
                
                <div className='flex flex-col sm:flex-row gap-3 sm:gap-8 mt-2'>
                    <div className="w-full sm:w-1/2">
                        <p className='mb-2 font-medium'>Discounted Price</p>
                        <input 
                            type="number" 
                            placeholder='0' 
                            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500' 
                            onChange={(e) => setPrice(e.target.value)}
                            value={price}
                            required
                            min="0"
                        />
                    </div>
                    <div className="w-full sm:w-1/2">
                        <p className='mb-2 font-medium'>Original Price</p>
                        <input 
                            type="number" 
                            placeholder='0' 
                            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500' 
                            onChange={(e) => setOriginalPrice(e.target.value)}
                            value={originalPrice}
                            required
                            min="0"
                        />
                    </div>
                </div>

                <div className="w-full mt-4">
                    <p className='mb-3 font-medium'>Product Sizes</p>
                    <div className='flex flex-wrap gap-3'>
                        {["S", "M", "L", "XL", "XXL"].map(size => (
                            <div
                                key={size}
                                onClick={() => setSizes(prev => prev.includes(size)
                                    ? prev.filter(item => item !== size)
                                    : [...prev, size])}
                                className={`px-4 py-2 cursor-pointer rounded-md transition-colors ${
                                    sizes.includes(size) 
                                        ? "bg-blue-100 border border-blue-300" 
                                        : "bg-gray-100 border border-gray-300"
                                }`}
                            >
                                {size}
                            </div>
                        ))}
                    </div>
                </div>

                <div className='flex items-center gap-2 mt-4'>
                    <input 
                        type="checkbox" 
                        id="bestseller" 
                        onChange={() => setBestseller(prev => !prev)} 
                        checked={bestseller} 
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="bestseller" className='cursor-pointer font-medium'>
                        Add To Bestseller Section
                    </label>
                </div>

                <div className='flex items-center gap-2 mt-4'>
                    <input 
                        type="checkbox" 
                        id="top" 
                        onChange={() => setTop(prev => !prev)} 
                        checked={top} 
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="top" className='cursor-pointer font-medium'>
                        Add To Top Section
                    </label>
                </div>

                <div className='flex items-center gap-2 mt-4'>
                    <input 
                        type="checkbox" 
                        id="newly" 
                        onChange={() => setNewly(prev => !prev)} 
                        checked={newly} 
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="newly" className='cursor-pointer font-medium'>
                        Add To New Section
                    </label>
                </div>

                <div className='flex items-center gap-2 mt-4'>
                    <input 
                        type="checkbox" 
                        id="hot" 
                        onChange={() => setHot(prev => !prev)} 
                        checked={hot} 
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="hot" className='cursor-pointer font-medium'>
                        Add To Hot Section
                    </label>
                </div>

                <div className='flex items-center gap-2 mt-4'>
                    <input 
                        type="checkbox" 
                        id="popular" 
                        onChange={() => setPopular(prev => !prev)} 
                        checked={popular} 
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="popular" className='cursor-pointer font-medium'>
                        Add To Popular Section
                    </label>
                </div>
                
                {/* Product Attributes Section */}
                <div className="w-full mt-4">
                    <div className="flex items-center justify-between max-w-[500px]">
                        <p className='font-medium'>Product Attributes</p>
                        <button 
                            type="button"
                            onClick={addAttribute}
                            className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 transition"
                        >
                            Add Attribute
                        </button>
                    </div>
                    
                    {selectedAttributes.length === 0 && (
                        <p className="text-gray-500 mt-2 text-sm">Click "Add Attribute" to add product attributes</p>
                    )}
                    
                    {selectedAttributes.map((attributeItem, index) => (
                        <div key={index} className="mt-4 p-4 border border-gray-200 rounded-md max-w-[500px]">
                            <div className="flex justify-between items-center mb-3">
                                <select
                                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                                    value={attributeItem.attributeId}
                                    onChange={(e) => handleAttributeChange(attributeItem.attributeId, e.target.value)}
                                >
                                    {attributes.map((attr) => (
                                        <option 
                                            key={attr._id} 
                                            value={attr._id}
                                            disabled={
                                                attr._id !== attributeItem.attributeId && 
                                                selectedAttributes.some(a => a.attributeId === attr._id)
                                            }
                                        >
                                            {attr.attributeName} {
                                                attr._id !== attributeItem.attributeId && 
                                                selectedAttributes.some(a => a.attributeId === attr._id) 
                                                    ? "(Already Selected)" 
                                                    : ""
                                            }
                                        </option>
                                    ))}
                                </select>
                                <button
                                    type="button"
                                    onClick={() => removeAttribute(attributeItem.attributeId)}
                                    className="ml-2 p-1 text-red-500 hover:text-red-700 transition"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            
                            <p className='mb-2 text-sm font-medium'>Select Values</p>
                            <div className='flex flex-wrap gap-2'>
                                {attributes.find(attr => attr._id === attributeItem.attributeId)?.attributeValues.map((value, valueIndex) => (
                                    <div
                                        key={valueIndex}
                                        onClick={() => toggleAttributeValue(attributeItem.attributeId, value)}
                                        className={`px-3 py-1 cursor-pointer rounded-md transition-colors text-sm ${
                                            attributeItem.values.includes(value) 
                                                ? "bg-blue-100 border border-blue-300" 
                                                : "bg-gray-100 border border-gray-300"
                                        }`}
                                    >
                                        {value}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <button 
                    type="submit" 
                    disabled={adding || loading}
                    className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex mt-6 items-center ${
                        (adding || loading) ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                >
                    {adding && (
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    )}
                    {adding ? 'Adding Product...' : 'Add Product'}
                </button>
            </div>
        </form>
    )
}

export default Add
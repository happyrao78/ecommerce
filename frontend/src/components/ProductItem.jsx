import React, { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";
import { UiContext } from "../context/UiContext";
import axios from "axios";
import { toast } from "react-toastify";
import { ShoppingBag, Heart, Maximize2, Eye, Award, Package } from "lucide-react";

const ProductItem = ({ id, image, name, price, originalPrice, colors = [], attributes = [], quantity }) => {
  const { currency, addToCart, addToWishlist, removeFromWishlist, navigate, isInWishlist, token, backendUrl, conversionRate } = useContext(ShopContext);
  const { openSlideCart } = useContext(UiContext);
  const [attributesList, setAttributesList] = useState([]);
  const [processedAttributes, setProcessedAttributes] = useState([]);
  const [selectedAttributeValues, setSelectedAttributeValues] = useState({});
  const [salesCount, setSalesCount] = useState(0);

  // Generate random sales number between 1.5k and 9.5k
  useEffect(() => {
    const min = 1500;
    const max = 9500;
    const randomSales = Math.floor(Math.random() * (max - min + 1)) + min;
    setSalesCount(randomSales);
  }, [id]);

  // Format sales number with k suffix
  const formatSales = (num) => {
    return `${(num / 1000).toFixed(1)}k`;
  };

  // Fetch all attributes
  const fetchAttributes = async () => {
    if (!token) return;
    
    try {
      const response = await axios.get(`${backendUrl}/api/attribute/list`, {
        headers: { token }
      });
      setAttributesList(response.data.attributes);
    } catch (err) {
      console.error('Error fetching attributes:', err);
      toast.error('Failed to fetch attributes');
    }
  };

  useEffect(() => {
    fetchAttributes();
  }, [token]);

  const convertedPrice = conversionRate * price;
  const convertedOriginalPrice = conversionRate * originalPrice;

  // Process attributes when attribute list is available
  useEffect(() => {
    if (attributes && attributes.length > 0 && attributesList.length > 0) {
      const processed = attributes.map(attr => {
        const foundAttribute = attributesList.find(a => a._id === attr.attributeId);
        
        if (foundAttribute) {
          return {
            _id: attr.attributeId,
            name: foundAttribute.attributeName,
            values: attr.selectedValues,
            displayType: foundAttribute.attributeName.toLowerCase() === 'colour' || 
                        foundAttribute.attributeName.toLowerCase() === 'color' ? 'color' : 
                        foundAttribute.attributeName.toLowerCase() === 'size' ? 'size' : 'select'
          };
        }
        return null;
      }).filter(Boolean); // Remove null entries
      
      setProcessedAttributes(processed);
    }
  }, [attributes, attributesList]);

  // Initialize selected attribute values
  useEffect(() => {
    if (processedAttributes.length > 0) {
      const initialValues = {};
      processedAttributes.forEach(attr => {
        if (attr.values && attr.values.length > 0) {
          initialValues[attr.name] = attr.values[0];
        }
      });
      setSelectedAttributeValues(initialValues);
    }
  }, [processedAttributes]);

  const calculateDiscount = (originalPrice, price) => {
    if (originalPrice > 0 && price < originalPrice) {
      return Math.round(((originalPrice - price) / originalPrice) * 100);
    }
    return 0;
  };

  const discountPercentage = calculateDiscount(originalPrice, price);

  // Function to handle attribute selection
  const handleAttributeSelection = (attributeId, value, attributeName) => {
    setSelectedAttributeValues(prev => ({
      ...prev,
      [attributeName]: value
    }));
  };

  // Helper function to get color class
  const getColorClass = (colorName) => {
    const colorMap = {
      'red': 'bg-red-500',
      'blue': 'bg-blue-500',
      'green': 'bg-green-500',
      'yellow': 'bg-yellow-500',
      'black': 'bg-black',
      'white': 'bg-white border',
      'purple': 'bg-purple-500',
      'orange': 'bg-orange-500',
      'pink': 'bg-pink-500',
      'gray': 'bg-gray-500',
      'brown': 'bg-yellow-800',
    };
    
    return colorMap[colorName.toLowerCase()] || 'bg-gray-200';
  };

  // Get stock status
  const getStockStatus = () => {
    if (quantity <= 0) return { text: "Out of Stock", color: "bg-red-100 text-red-600" };
    if (quantity < 5) return { text: "Low Stock", color: "bg-orange-100 text-orange-600" };
    if (quantity < 20) return { text: "In Stock", color: "bg-green-100 text-green-600" };
    return { text: "Available", color: "bg-blue-100 text-blue-600" };
  };

  const stockStatus = getStockStatus();

  return (
    <div className="mb-4 group">
      <div className="relative overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
        {/* Image Section - Reduced height on mobile */}
        <div className="overflow-hidden h-40 sm:h-48 lg:h-80 relative rounded-t-lg bg-gray-50 flex flex-col justify-center items-center">
          <Link to={`/product/${id}`} className="text-gray-800 cursor-pointer block">
            <img
              className="absolute inset-0 h-full w-full object-cover transition-transform ease-in-out lg:group-hover:scale-105 lg:group-hover:opacity-0 object-top"
              src={image[0]}
              alt={name}
              loading="lazy"
            />

            {/* Second Image (shows on hover) */}
            {image[1] && (
              <img
                className="absolute inset-0 h-full w-full object-cover opacity-0 transition-all duration-500 ease-in-out lg:group-hover:opacity-100 lg:group-hover:scale-105"
                src={image[1]}
                alt={`${name} alternate view`}
                loading="lazy"
              />
            )}
          </Link>

          {/* Badges Section - Simplified and positioned better for mobile */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {/* Discount Badge */}
            {discountPercentage > 0 && (
              <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                -{discountPercentage}%
              </div>
            )}
          </div>
          
          {/* Mobile-Friendly Stock Badge - Top right */}
          <div className="absolute top-2 right-2">
            <div className={`text-xs font-medium px-2 py-1 rounded-full ${stockStatus.color}`}>
              {stockStatus.text}
            </div>
          </div>

          {/* Quick Add Button - Always visible on mobile */}
          <button 
            className={`absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black text-white px-3 py-1.5 rounded-full shadow-md font-medium text-xs flex items-center gap-1 ${quantity <= 0 ? 'bg-gray-400 cursor-not-allowed' : ''}`}
            onClick={() => {
              if (quantity > 0) {
                addToCart(id, selectedAttributeValues);
                openSlideCart();
              }
            }}
            disabled={quantity <= 0}
          >
            <ShoppingBag size={14} />
            {quantity > 0 ? "ADD" : "OUT OF STOCK"}
          </button>
        </div>

        {/* Product Details Section - Simplified for mobile */}
        <div className="p-2">
          {/* Product Title - Larger text and improved truncation */}
          <h3 className="font-medium text-gray-800 truncate mb-1">
            <Link to={`/product/${id}`}>{name}</Link>
          </h3>
          
          {/* Price Section - Better alignment */}
          <div className="sm:grid lg:flex sm:gap-3 items-center justify-between mb-1">
            <div className="flex items-center">
              <p className="font-semibold text-gray-800">
                {currency} {convertedPrice.toFixed(2)}
              </p>
              {originalPrice > 0 && price < originalPrice && (
                <p className="text-xs text-gray-500 line-through ml-2">
                  {currency} {convertedOriginalPrice.toFixed(2)}
                </p>
              )}
            </div>
            
            {/* Sales Count */}
            <div className="text-sm text-gray-600">
              <ShoppingBag size={14} className="inline mr-1" /> {formatSales(salesCount)} sold
            </div>
          </div>
          
          {/* Stock Quantity - Clear display */}
          {quantity > 0 && (
            <div className="text-xs text-gray-500 mb-1">
              {quantity} in stock
            </div>
          )}

          {/* Color/Size Selection - Simplified and more touch-friendly */}
          {processedAttributes.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-1">
              {processedAttributes
                .filter(attr => attr.displayType === 'color' || attr.displayType === 'size')
                .map((attribute, index) => (
                  <div key={index} className="flex flex-col">
                    {attribute.displayType === 'color' ? (
                      <div className="flex gap-1">
                        {attribute.values.slice(0, 4).map((value, valueIndex) => (
                          <div
                            key={valueIndex}
                            className={`w-6 h-6 rounded-full cursor-pointer ${
                              selectedAttributeValues[attribute.name] === value ? 'ring-2 ring-black' : 'ring-1 ring-gray-300'
                            } ${getColorClass(value)}`}
                            onClick={() => handleAttributeSelection(attribute._id, value, attribute.name)}
                            title={value}
                          />
                        ))}
                      </div>
                    ) : attribute.displayType === 'size' && (
                      <div className="flex flex-wrap gap-1">
                        {attribute.values.slice(0, 3).map((value, valueIndex) => (
                          <div
                            key={valueIndex}
                            className={`text-xs px-2 py-1 cursor-pointer ${
                              selectedAttributeValues[attribute.name] === value 
                                ? 'bg-black text-white' 
                                : 'bg-gray-100'
                            }`}
                            onClick={() => handleAttributeSelection(attribute._id, value, attribute.name)}
                          >
                            {value}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
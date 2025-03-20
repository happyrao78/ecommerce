import React, { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";
import Button from "./Button";
import { UiContext } from "../context/UiContext";
import axios from "axios";
import { toast } from "react-toastify";
import { ShoppingBag, Heart, Maximize2, Plus, Eye, Award, Package } from "lucide-react";

const ProductItem = ({ id, image, name, price, originalPrice, colors = [], attributes = [], quantity }) => {
  const { currency, addToCart, addToWishlist, removeFromWishlist, navigate, isInWishlist, token, backendUrl,conversionRate } = useContext(ShopContext);
  const [isLoading, setIsLoading] = useState(true);
  const { openSlideCart } = useContext(UiContext);
  const [attributesList, setAttributesList] = useState([]);
  const [processedAttributes, setProcessedAttributes] = useState([]);
  const [selectedAttributeValues, setSelectedAttributeValues] = useState({});
  const [salesCount, setSalesCount] = useState(0);

  console.log(`Product ${name} quantity:`, quantity);

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

  const convertedPrice = conversionRate * price
  const convertedOriginalPrice = conversionRate * originalPrice

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
    <div className="mb-6 group">
      <div className="relative overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
        {/* Image Section */}
        <div className="overflow-hidden h-[250px] sm:h-[180px] lg:h-[400px] relative rounded-t-xl bg-gray-50 flex flex-col justify-center items-center">
          {/* First Image (default) */}
          <Link to={`/product/${id}`} className="text-gray-800 cursor-pointer block">
            <img
              className="absolute inset-0 h-full w-full object-cover transition-transform ease-in-out lg:group-hover:scale-105 lg:group-hover:opacity-0"
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

          {/* Quick Add To Cart Button */}
          <button 
            className={`absolute bottom-6 sm:bottom-8 lg:bottom-4 left-1/2 transform -translate-x-1/2 opacity-100 sm:opacity-10  lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-300 ease-in-out bg-black text-white px-4 py-2 rounded-full shadow-md font-medium translate-y-10 lg:group-hover:translate-y-0 hover:bg-black hover:text-white text-xs sm:text-xs lg:text-sm uppercase flex items-center gap-2 mb-5 ${quantity <= 0 ? 'bg-gray-200 cursor-not-allowed' : ''}`}
            onClick={() => {
              if (quantity > 0) {
                addToCart(id, selectedAttributeValues);
                openSlideCart();
              }
            }}
            disabled={quantity <= 0}
          >
            <ShoppingBag size={18} />
            {quantity > 0 ? "Add" : "Out of Stock"}
          </button>
        </div>

        {/* Badges Section */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {/* Discount Badge */}
          {discountPercentage > 0 && (
            <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
              <Award size={12} />
              -{discountPercentage}%
            </div>
          )}
          
          {/* Stock Status Badge */}
          <div className={`text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1 ${stockStatus.color}`}>
            <Package size={12} />
            {stockStatus.text}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex flex-col space-y-3 opacity-0 lg:group-hover:opacity-100 translate-y-10 lg:group-hover:translate-y-0 transition-all duration-300 ease-in-out">
          <button className="bg-white p-2 rounded-full shadow-md hover:bg-black hover:text-white flex items-center justify-center" 
            onClick={() => {
              if (isInWishlist(id)) {
                removeFromWishlist(id, selectedAttributeValues);
              } else {
                addToWishlist(id, selectedAttributeValues);
                navigate("/wishlist");
              }
            }}
          >
            <Heart size={18} fill={isInWishlist(id) ? "currentColor" : "none"} />
          </button>
          <Link className="bg-white p-2 rounded-full shadow-md hover:bg-black hover:text-white flex items-center justify-center" to={`/product/${id}`}>
            <Maximize2 size={18} />
          </Link>
          <button className="bg-white p-2 rounded-full shadow-md hover:bg-black hover:text-white flex items-center justify-center" 
            onClick={() => {
              navigate(`/product/${id}`);
            }}
          >
            <Eye size={18} />
          </button>
        </div>
      </div>

      {/* Product Details Section */}
      <div className="mt-4 px-2">
        <div className="flex justify-between items-start">
          <h3 className="text-base font-medium text-gray-800 hover:text-black transition-colors duration-200 truncate max-w-[80%]">
            <Link to={`/product/${id}`}>{name}</Link>
          </h3>
          
          {/* Sales Count */}
          <div className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600 flex items-center">
            <ShoppingBag size={12} className="mr-1" /> {formatSales(salesCount)}
          </div>
        </div>

        <div className="flex items-center mt-1 justify-between">
          <div className="flex items-center">
            <p className="text-sm font-semibold text-gray-800">
              {/* {currency}{price.toFixed(2)} */}
              {currency} {convertedPrice.toFixed(2)}
            </p>
            {originalPrice > 0 && price < originalPrice && (
              <p className="text-xs text-gray-500 line-through ml-2">
                {currency} {convertedOriginalPrice.toFixed(2)}
              </p>
            )}
          </div>
          
          {/* Quantity Indicator */}
          <div className="text-xs text-gray-500">
            {quantity > 0 ? `${quantity} in stock` : ""}
          </div>
        </div>

        {/* Display Attributes (in compact form) */}
        {processedAttributes.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-3">
            {processedAttributes.map((attribute, index) => (
              <div key={index} className="mb-1">
                <p className="text-xs font-medium text-gray-500 capitalize mb-1">{attribute.name}:</p>
                {attribute.displayType === 'color' ? (
                  <div className="flex gap-1">
                    {attribute.values.map((value, valueIndex) => (
                      <div
                        key={valueIndex}
                        className={`w-5 h-5 rounded-full cursor-pointer ${
                          selectedAttributeValues[attribute.name] === value ? 'ring-2 ring-black ring-offset-1' : 'ring-1 ring-gray-300'
                        } ${getColorClass(value)}`}
                        onClick={() => handleAttributeSelection(attribute._id, value, attribute.name)}
                        title={value}
                      />
                    ))}
                  </div>
                ) : attribute.displayType === 'size' ? (
                  <div className="flex flex-wrap gap-1">
                    {attribute.values.map((value, valueIndex) => (
                      <div
                        key={valueIndex}
                        className={`text-xs px-2 py-1 border cursor-pointer transition-colors ${
                          selectedAttributeValues[attribute.name] === value 
                            ? 'bg-black text-white border-black' 
                            : 'bg-white border-gray-300 hover:bg-gray-100'
                        }`}
                        onClick={() => handleAttributeSelection(attribute._id, value, attribute.name)}
                      >
                        {value}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-1">
                    {attribute.values.map((value, valueIndex) => (
                      <div
                        key={valueIndex}
                        className={`text-xs px-2 py-1 rounded cursor-pointer transition-colors ${
                          selectedAttributeValues[attribute.name] === value 
                            ? 'bg-black text-white' 
                            : 'bg-gray-100 hover:bg-gray-200'
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

        {/* If no processed attributes but has colors prop, show color options */}
        {processedAttributes.length === 0 && colors.length > 0 && (
          <div className="flex mt-2 gap-1">
            {colors.map((color, index) => (
              <div
                key={index}
                className="w-5 h-5 rounded-full border border-gray-300"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductItem;
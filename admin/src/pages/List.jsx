import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { backendUrl, currency } from '../App';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Pencil, Trash, Search, Eye, Filter, RefreshCw, Plus, ArrowUpDown } from 'lucide-react';

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [viewType, setViewType] = useState('table'); // 'table' or 'grid'

  const navigate = useNavigate();

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/api/category/getSubCategory`, {
        headers: { token }
      });

      if (response.data.success) {
        setCategories(response.data.categories);
        console.log(response.data.categories);
      } else {
        toast.error("Failed to fetch categories");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message || "Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  const fetchList = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/api/product/list`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        console.log("Product data sample:", response.data.products[0]);
        setList(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
    fetchCategories();
  }, []);

  const handleCategoryChange = (e) => {
    const selectedCategoryId = e.target.value;
    setSelectedCategory(selectedCategoryId);
    setSelectedSubcategory('');

    // Find the selected category object
    const categoryObj = categories.find(cat => cat.category === selectedCategoryId);

    // Update subcategories based on selected category
    if (categoryObj && categoryObj.subcategories) {
      setSubcategories(categoryObj.subcategories);
      console.log("Subcategories set to:", categoryObj.subcategories);
    } else {
      setSubcategories([]);
      console.log("No subcategories found ");
    }
  };

  const removeProduct = async (id) => {
    try {
      const confirmed = window.confirm("Are you sure you want to delete this product?");
      if (!confirmed) return;

      setLoading(true);
      const response = await axios.post(`${backendUrl}/api/product/remove`,
        { id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message || "Failed to remove product");
    } finally {
      setLoading(false);
    }
  };

  const editProduct = (id) => {
    navigate(`/edit/${id}`);
  };

  // Sorting function
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Function to get sorted and filtered products
  const getSortedFilteredProducts = () => {
    let filteredProducts = [...list];

    // Apply category filter
    if (selectedCategory) {
      filteredProducts = filteredProducts.filter(product =>
        product.categoryId === selectedCategory || product.category === selectedCategory
      );
    }

    // Apply subcategory filter
    if (selectedSubcategory) {
      filteredProducts = filteredProducts.filter(product =>
        product.subCategoryId === selectedSubcategory || product.subCategory === selectedSubcategory
      );
    }

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filteredProducts = filteredProducts.filter(product =>
        (product.name && product.name.toLowerCase().includes(searchLower)) ||
        (product.category && product.category.toLowerCase().includes(searchLower)) ||
        (product.description && product.description.toLowerCase().includes(searchLower))
      );
    }

    // Apply sorting
    if (sortConfig.key) {
      filteredProducts.sort((a, b) => {
        // Handle null or undefined values
        if (a[sortConfig.key] === null || a[sortConfig.key] === undefined) return 1;
        if (b[sortConfig.key] === null || b[sortConfig.key] === undefined) return -1;

        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }

    return filteredProducts;
  };

  // Get the sorted and filtered products
  const sortedFilteredProducts = getSortedFilteredProducts();

  // Calculate stock status for styling
  const getStockStatus = (quantity) => {
    if (quantity <= 0) return { text: 'Out of Stock', color: 'bg-red-100 text-red-800' };
    if (quantity <= 5) return { text: 'Low Stock', color: 'bg-orange-100 text-orange-800' };
    if (quantity <= 20) return { text: 'Limited', color: 'bg-yellow-100 text-yellow-800' };
    return { text: 'In Stock', color: 'bg-green-100 text-green-800' };
  };

  // Calculate discount percentage
  const calculateDiscount = (originalPrice, currentPrice) => {
    if (!originalPrice || originalPrice <= currentPrice) return null;
    return Math.round((1 - currentPrice / originalPrice) * 100);
  };

  // Display the sort direction indicator
  const getSortDirectionIcon = (key) => {
    if (sortConfig.key !== key) return <ArrowUpDown size={14} className="inline ml-1 text-gray-400" />;
    return sortConfig.direction === 'ascending'
      ? <ArrowUpDown size={14} className="inline ml-1 text-blue-500" />
      : <ArrowUpDown size={14} className="inline ml-1 text-blue-500 rotate-180" />;
  };

  // Add this helper function to safely format dates
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';

    try {
      const date = new Date(dateString);
      // Check if date is valid
      if (isNaN(date.getTime())) return 'N/A';

      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return 'N/A';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-2 py-8">
      <div className="mb-6">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Products</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your product inventory
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <button
              onClick={() => navigate('/add')}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Plus size={16} className="mr-2" />
              Add Product
            </button>
            <button
              onClick={() => {
                fetchList();
                fetchCategories();
              }}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <RefreshCw size={16} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 sm:flex sm:items-center sm:justify-between">
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 mb-4 sm:mb-0">
          <div className="relative flex-1 min-w-0">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter size={18} className="text-gray-400" />
              </div>
              <select
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm "
                value={selectedCategory}
                onChange={handleCategoryChange}
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.category} value={category.category}>
                    {category.category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter size={18} className="text-gray-400" />
              </div>
              <select
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={selectedSubcategory}
                onChange={(e) => setSelectedSubcategory(e.target.value)}
              // disabled={!selectedCategory || subcategories.length === 0}
              >
                <option value="">Select Subcategory</option>
                {subcategories.map((subcategory) => (
                  <option key={subcategory} value={subcategory}>
                    {subcategory}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="inline-flex rounded-md shadow-sm">
          <button
            onClick={() => setViewType('table')}
            className={`px-4 py-2 text-sm font-medium rounded-l-md border ${viewType === 'table'
              ? 'bg-indigo-50 text-indigo-700 border-indigo-500'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
          >
            Table View
          </button>
          <button
            onClick={() => setViewType('grid')}
            className={`px-4 py-2 text-sm font-medium rounded-r-md border-t border-r border-b ${viewType === 'grid'
              ? 'bg-indigo-50 text-indigo-700 border-indigo-500'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
          >
            Grid View
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="bg-white shadow rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="text-indigo-500 bg-indigo-100 rounded-md p-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
                  <path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Total Products</h3>
              <p className="text-3xl font-semibold text-gray-700">{list.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="text-green-500 bg-green-100 rounded-md p-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z" clipRule="evenodd" />
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Total Categories</h3>
              <p className="text-3xl font-semibold text-gray-700">{categories.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="text-yellow-500 bg-yellow-100 rounded-md p-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Bestseller Products</h3>
              <p className="text-3xl font-semibold text-gray-700">
                {list.filter(product => product.bestseller).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {loading && list.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        </div>
      ) : sortedFilteredProducts.length === 0 ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-md p-6 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || selectedCategory
              ? "Try changing your search or filter criteria."
              : "Get started by adding a new product."}
          </p>
          <div className="mt-6">
            <button
              onClick={() => navigate('/add')}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Plus size={16} className="mr-2" />
              Add Product
            </button>
          </div>
        </div>
      ) : viewType === 'table' ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                    Image
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('name')}
                  >
                    Name {getSortDirectionIcon('name')}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('category')}
                  >
                    Category {getSortDirectionIcon('category')}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('price')}
                  >
                    Price {getSortDirectionIcon('price')}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('quantity')}
                  >
                    Stock {getSortDirectionIcon('quantity')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('createdAt')}
                  >
                    Created At {getSortDirectionIcon('createdAt')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedFilteredProducts.map((item) => {
                  const stockStatus = getStockStatus(item.quantity);
                  const discount = calculateDiscount(item.originalPrice, item.price);

                  return (
                    <tr key={item._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex-shrink-0 h-12 w-12 rounded-md overflow-hidden">
                          {item.image && item.image[0] ? (
                            <img src={item.image[0]} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                              <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900 truncate max-w-xs">{item.name}</div>
                        {item.bestseller && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 mt-1">
                            Bestseller
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>{item.category}</div>
                        {item.subCategory && <div className="text-xs text-gray-400">{item.subCategory}</div>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{currency}{item.price}</div>
                        {discount && (
                          <div className="flex items-center">
                            <span className="text-xs text-gray-500 line-through mr-1">{currency}{item.originalPrice}</span>
                            <span className="text-xs font-medium text-green-600">-{discount}%</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {typeof item.quantity === 'number' ? item.quantity : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${stockStatus.color}`}>
                          {stockStatus.text}
                        </span>
                      </td>
                      {/* New CreatedAt cell */}
                      {/* New CreatedAt cell */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(item.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        <div className="flex items-center justify-center space-x-3">
                          <button onClick={() => editProduct(item._id)} className="text-blue-600 hover:text-blue-900" title="Edit product">
                            <Pencil size={18} />
                          </button>
                          <button onClick={() => removeProduct(item._id)} className="text-red-600 hover:text-red-900" title="Delete product">
                            <Trash size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        // Grid View
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedFilteredProducts.map((item) => {
            const stockStatus = getStockStatus(item.quantity);
            const discount = calculateDiscount(item.originalPrice, item.price);

            return (
              <div key={item._id} className="bg-white overflow-hidden shadow rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-300">
                <div className="relative">
                  <div className="aspect-w-3 aspect-h-2 w-full overflow-hidden bg-gray-200">
                    {item.image && item.image[0] ? (
                      <img src={item.image[0]} alt="" className="w-full h-48 object-cover" />
                    ) : (
                      <div className="w-full h-48 flex items-center justify-center bg-gray-100">
                        <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-2">
                    {item.bestseller && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        Bestseller
                      </span>
                    )}

                    {discount && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {discount}% OFF
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-medium text-gray-900 truncate" title={item.name}>{item.name}</h3>
                    <span className={`ml-2 px-2 py-1 text-xs font-medium rounded ${stockStatus.color}`}>
                      {stockStatus.text}
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-gray-500 truncate">
                    {item.category} {item.subCategory ? `› ${item.subCategory}` : ''}
                  </p>

                  <div className="mt-2 flex items-baseline">
                    <div className="text-lg font-semibold text-gray-900">{currency}{item.price}</div>
                    {discount && (
                      <div className="ml-2 text-sm text-gray-500 line-through">{currency}{item.originalPrice}</div>
                    )}
                  </div>

                  {typeof item.quantity === 'number' && (
                    <p className="mt-1 text-sm text-gray-500">
                      Stock: {item.quantity} {item.sizes && item.sizes.length > 0 && `· ${item.sizes.join(', ')}`}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-400">
                    Added: {formatDate(item.createdAt)}
                  </p>

                  <div className="mt-4 flex justify-between">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => editProduct(item._id)}
                        className="inline-flex items-center p-1.5 border border-gray-300 rounded-md text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <Pencil size={14} />
                      </button>

                      <button
                        onClick={() => removeProduct(item._id)}
                        className="inline-flex items-center p-1.5 border border-gray-300 rounded-md text-red-600 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <Trash size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination or product count */}
      <div className="mt-6 flex justify-between items-center text-sm text-gray-500">
        <div>
          Showing {sortedFilteredProducts.length} of {list.length} products
        </div>

        {(searchTerm || selectedCategory) && (
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('');
              setSelectedSubcategory('');
            }}
            className="text-indigo-600 hover:text-indigo-900"
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
};

export default List;
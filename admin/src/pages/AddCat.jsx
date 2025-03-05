import React, { useState } from 'react';
import { assets } from '../assets/admin_assets/assets';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';

const AddCat = ({ token }) => {
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleAddSubcategory = () => {
    if (subcategory.trim()) {
      setSubcategories([...subcategories, subcategory.trim()]);
      setSubcategory('');
    }
  };

  const removeSubcategory = (index) => {
    const updatedSubcategories = [...subcategories];
    updatedSubcategories.splice(index, 1);
    setSubcategories(updatedSubcategories);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!category.trim()) {
      toast.error('Please enter a category name');
      return;
    }

    setLoading(true);

    try {
      // Add the category first
      const categoryRes = await axios.post(
        `${backendUrl}/api/category/addCategory`,
        { category: category.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (categoryRes.data.success) {
        toast.success('Category added successfully');
        
        // Add subcategories if any
        if (subcategories.length > 0) {
          const promises = subcategories.map(subcat => 
            axios.post(
              `${backendUrl}/api/category/addSubCategory`,
              { 
                category: category.trim(), 
                subCategory: subcat 
              },
              { headers: { Authorization: `Bearer ${token}` } }
            )
          );
          
          await Promise.all(promises);
          toast.success('Subcategories added successfully');
        }
        
        // Reset form
        setCategory('');
        setSubcategories([]);
      } else {
        toast.error(categoryRes.data.message || 'Failed to add category');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error occurred while adding category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto my-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Add Category & Subcategories</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-5">
          <label htmlFor="category" className="block text-gray-700 font-medium mb-2">
            Category Name
          </label>
          <input
            id="category"
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter category name"
          />
        </div>

        <div className="mb-5">
          <label className="block text-gray-700 font-medium mb-2">
            Add Subcategories
          </label>
          
          <div className="flex items-center mb-2">
            <input
              type="text"
              value={subcategory}
              onChange={(e) => setSubcategory(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter subcategory name"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSubcategory())}
            />
            <button
              type="button"
              onClick={handleAddSubcategory}
              className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700"
            >
              Add
            </button>
          </div>
          
          {subcategories.length > 0 && (
            <div className="mt-3">
              <h3 className="text-sm font-semibold text-gray-600 mb-2">Subcategories:</h3>
              <div className="flex flex-wrap gap-2">
                {subcategories.map((subcat, index) => (
                  <div
                    key={index}
                    className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-2"
                  >
                    <span>{subcat}</span>
                    <button
                      type="button"
                      onClick={() => removeSubcategory(index)}
                      className="text-red-500 hover:text-red-700 focus:outline-none"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Saving...' : 'Save Category'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCat;
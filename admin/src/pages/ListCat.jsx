import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';

const ListCat = ({ token }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingSubcategory, setEditingSubcategory] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newSubcategoryName, setNewSubcategoryName] = useState('');
  const [expandedCategories, setExpandedCategories] = useState({});

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${backendUrl}/api/category/getSubCategory`,
        { headers: { Authorization: `Bearer ${token}` } }
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
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [token]);

  const toggleCategoryExpand = (categoryName) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryName]: !prev[categoryName]
    }));
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setNewCategoryName(category);
  };

  const handleEditSubcategory = (category, subcategory) => {
    setEditingCategory(category);
    setEditingSubcategory(subcategory);
    setNewSubcategoryName(subcategory);
  };

  const saveEditedCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error('Category name cannot be empty');
      return;
    }

    try {
      const response = await axios.put(
        `${backendUrl}/api/category/editCategory`,
        {
          category: editingCategory,
          newCategory: newCategoryName.trim()
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success('Category updated successfully');
        setEditingCategory(null);
        fetchCategories();
      } else {
        toast.error(response.data.message || 'Failed to update category');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error occurred while updating category');
    }
  };

  const saveEditedSubcategory = async () => {
    if (!newSubcategoryName.trim()) {
      toast.error('Subcategory name cannot be empty');
      return;
    }

    try {
      const response = await axios.put(
        `${backendUrl}/api/category/editSubCategory`,
        {
          category: editingCategory,
          subCategory: editingSubcategory,
          newSubCategory: newSubcategoryName.trim()
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success('Subcategory updated successfully');
        setEditingCategory(null);
        setEditingSubcategory(null);
        fetchCategories();
      } else {
        toast.error(response.data.message || 'Failed to update subcategory');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error occurred while updating subcategory');
    }
  };

  const deleteCategory = async (category) => {
    if (!window.confirm(`Are you sure you want to delete "${category}" and all its subcategories?`)) {
      return;
    }

    try {
      const response = await axios.delete(
        `${backendUrl}/api/category/removeCategory`,
        {
          headers: { Authorization: `Bearer ${token}` },
          data: { category }
        }
      );

      if (response.data.success) {
        toast.success('Category deleted successfully');
        fetchCategories();
      } else {
        toast.error(response.data.message || 'Failed to delete category');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error occurred while deleting category');
    }
  };

  const deleteSubcategory = async (category, subcategory) => {
    if (!window.confirm(`Are you sure you want to delete subcategory "${subcategory}"?`)) {
      return;
    }

    try {
      const response = await axios.delete(
        `${backendUrl}/api/category/removeSubCategory`,
        {
          headers: { Authorization: `Bearer ${token}` },
          data: { category, subCategory: subcategory }
        }
      );

      if (response.data.success) {
        toast.success('Subcategory deleted successfully');
        fetchCategories();
      } else {
        toast.error(response.data.message || 'Failed to delete subcategory');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error occurred while deleting subcategory');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto my-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Categories & Subcategories</h2>
      
      {categories.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No categories found.</p>
      ) : (
        <div className="space-y-4">
          {categories.map((cat) => (
            <div key={cat.category} className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 flex items-center justify-between">
                {editingCategory === cat.category && !editingSubcategory ? (
                  <div className="flex flex-1 mr-2">
                    <input
                      type="text"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      className="flex-1 px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      autoFocus
                    />
                    <button
                      onClick={saveEditedCategory}
                      className="ml-2 bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingCategory(null)}
                      className="ml-2 bg-gray-500 text-white px-3 py-1 rounded-md hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <h3 className="text-lg font-medium text-gray-800 flex-1">
                    {cat.category}
                    <span className="ml-2 text-sm text-gray-500">
                      ({cat.subcategories.length} subcategories)
                    </span>
                  </h3>
                )}
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEditCategory(cat.category)}
                    className="text-blue-600 hover:text-blue-800 p-1"
                    title="Edit Category"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => deleteCategory(cat.category)}
                    className="text-red-600 hover:text-red-800 p-1"
                    title="Delete Category"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button
                    onClick={() => toggleCategoryExpand(cat.category)}
                    className="text-gray-600 hover:text-gray-800 p-1"
                    title={expandedCategories[cat.category] ? "Collapse" : "Expand"}
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className={`h-5 w-5 transition-transform ${expandedCategories[cat.category] ? 'transform rotate-180' : ''}`}
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {expandedCategories[cat.category] && (
                <div className="p-4 bg-white">
                  {cat.subcategories.length === 0 ? (
                    <p className="text-gray-500 italic text-sm">No subcategories</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                      {cat.subcategories.map((subcat) => (
                        <div 
                          key={`${cat.category}-${subcat}`} 
                          className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md border border-gray-200"
                        >
                          {editingCategory === cat.category && editingSubcategory === subcat ? (
                            <div className="items-center flex-1">
                              <input
                                type="text"
                                value={newSubcategoryName}
                                onChange={(e) => setNewSubcategoryName(e.target.value)}
                                className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
                                autoFocus
                              />
                              <button
                                onClick={saveEditedSubcategory}
                                className="ml-2 bg-green-500 text-white px-2 py-1 text-sm rounded-md hover:bg-green-600"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => {
                                  setEditingCategory(null);
                                  setEditingSubcategory(null);
                                }}
                                className="ml-2 bg-gray-500 text-white px-2 py-1 text-sm rounded-md hover:bg-gray-600"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <>
                              <span className="text-gray-800">{subcat}</span>
                              <div className="flex items-center space-x-1">
                                <button
                                  onClick={() => handleEditSubcategory(cat.category, subcat)}
                                  className="text-blue-600 hover:text-blue-800 p-1"
                                  title="Edit Subcategory"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => deleteSubcategory(cat.category, subcat)}
                                  className="text-red-600 hover:text-red-800 p-1"
                                  title="Delete Subcategory"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                  </svg>
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListCat;
import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { backendUrl } from '../App';
import { toast } from 'react-toastify'

const AddAtr = () => {
  const navigate = useNavigate();
  const [attributeName, setAttributeName] = useState('');
  const [attributeValues, setAttributeValues] = useState(['']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAddValue = () => {
    setAttributeValues([...attributeValues, '']);
  };

  const handleRemoveValue = (index) => {
    const newValues = [...attributeValues];
    newValues.splice(index, 1);
    setAttributeValues(newValues);
  };

  const handleValueChange = (index, value) => {
    const newValues = [...attributeValues];
    newValues[index] = value;
    setAttributeValues(newValues);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate inputs
    if (!attributeName.trim()) {
      setError('Attribute name is required');
      return;
    }

    // Filter out empty values
    const filteredValues = attributeValues.filter(value => value.trim() !== '');
    
    try {
      setLoading(true);
      const response = await axios.post(`${backendUrl}/api/attribute/add`, {
        attributeName,
        attributeValues: filteredValues
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.data.success) {
        toast.success(response.data.message);
        navigate('/list-attribute');
      } else {
        setError(response.data.message);
      }
      setLoading(false);
    } catch (error) {
      setError('Error adding attribute. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Add Attribute</h1>
          {/* <div className="flex items-center">
            <Link to="/dashboard" className="text-gray-600 hover:text-gray-800">Dashboard</Link>
            <span className="mx-2 text-gray-400">&gt;</span>
            <Link to="/attributes" className="text-gray-600 hover:text-gray-800">Attributes</Link>
            <span className="mx-2 text-gray-400">&gt;</span>
            <span className="text-gray-400">Add attribute</span>
          </div> */}
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="attributeName" className="block text-gray-700 font-medium mb-2">
              Attribute Name
            </label>
            <input
              type="text"
              id="attributeName"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={attributeName}
              onChange={(e) => setAttributeName(e.target.value)}
              placeholder="Enter attribute name"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Attribute Values
            </label>
            {attributeValues.map((value, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  className="flex-grow border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={value}
                  onChange={(e) => handleValueChange(index, e.target.value)}
                  placeholder="Enter attribute value"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveValue(index)}
                  className="ml-2 text-red-500 hover:text-red-700"
                  disabled={attributeValues.length === 1}
                >
                  <FaTrash />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddValue}
              className="flex items-center text-blue-500 hover:text-blue-700 mt-2"
            >
              <FaPlus className="mr-1" />
              Add another value
            </button>
          </div>

          <div className="flex justify-end">
            {/* <Link 
              to="/attributes" 
              className="px-4 py-2 border border-gray-300 rounded mr-3 hover:bg-gray-100 transition"
            >
              Cancel
            </Link> */}
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Attribute'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAtr;
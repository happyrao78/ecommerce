import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaEye, FaEdit, FaTrash, FaSearch, FaSave, FaTimes, FaPlus } from 'react-icons/fa';
import { backendUrl } from '../App';
import { toast } from 'react-toastify'

const ListAtr = () => {
  const [attributes, setAttributes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingAttributeId, setEditingAttributeId] = useState(null);
  const [editingAttribute, setEditingAttribute] = useState({
    attributeName: '',
    attributeValues: []
  });
  const [editingValueIndex, setEditingValueIndex] = useState(-1);
  const [newValue, setNewValue] = useState('');

  useEffect(() => {
    fetchAttributes();
  }, []);

  const fetchAttributes = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/api/attribute/list`);
      
      if (response.data.success) {
        setAttributes(response.data.attributes);
      } else {
        setError(response.data.message);
      }
      setLoading(false);
    } catch (error) {
      setError('Error fetching attributes. Please try again.');
      setLoading(false);
    }
  };

  const handleDelete = async (attributeId) => {
    if (window.confirm('Are you sure you want to delete this attribute?')) {
      try {
        const response = await axios.delete(`${backendUrl}/api/attribute/delete`, {
          data: { attributeId },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (response.data.success) {
          fetchAttributes();
        } else {
          alert(response.data.message);
        }
      } catch (error) {
        alert('Error deleting attribute. Please try again.');
      }
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const startEditing = (attribute) => {
    setEditingAttributeId(attribute._id);
    setEditingAttribute({
      attributeName: attribute.attributeName,
      attributeValues: [...attribute.attributeValues]
    });
  };

  const cancelEditing = () => {
    setEditingAttributeId(null);
    setEditingValueIndex(-1);
    setNewValue('');
  };

  const updateAttributeName = (e) => {
    setEditingAttribute({
      ...editingAttribute,
      attributeName: e.target.value
    });
  };

  const addAttributeValue = () => {
    if (newValue.trim()) {
      setEditingAttribute({
        ...editingAttribute,
        attributeValues: [...editingAttribute.attributeValues, newValue.trim()]
      });
      setNewValue('');
    }
  };

  const removeAttributeValue = (index) => {
    const newValues = [...editingAttribute.attributeValues];
    newValues.splice(index, 1);
    setEditingAttribute({
      ...editingAttribute,
      attributeValues: newValues
    });
  };

  const startEditingValue = (index, value) => {
    setEditingValueIndex(index);
    setNewValue(value);
  };

  const saveEditedValue = () => {
    if (newValue.trim() && editingValueIndex !== -1) {
      const newValues = [...editingAttribute.attributeValues];
      newValues[editingValueIndex] = newValue.trim();
      setEditingAttribute({
        ...editingAttribute,
        attributeValues: newValues
      });
      setEditingValueIndex(-1);
      setNewValue('');
    }
  };

  const saveAttribute = async () => {
    try {
      const response = await axios.put(`${backendUrl}/api/attribute/update`, {
        attributeId: editingAttributeId,
        attributeName: editingAttribute.attributeName,
        attributeValues: editingAttribute.attributeValues
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.data.success) {
        fetchAttributes();
        cancelEditing();
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      alert('Error updating attribute. Please try again.');
    }
  };

  const filteredAttributes = attributes.filter(attribute =>
    attribute.attributeName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentAttributes = filteredAttributes.slice(indexOfFirstEntry, indexOfLastEntry);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="p-2 md:p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm p-3 md:p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-6">
          <h1 className="text-xl md:text-2xl font-bold mb-2 md:mb-0">Add Attribute</h1>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-6 gap-3">
          <div className="flex items-center w-full md:w-auto">
            <span className="mr-2 text-gray-600 text-sm md:text-base">Showing</span>
            <select
              className="border rounded px-1 py-1 text-sm md:text-base"
              value={entriesPerPage}
              onChange={(e) => setEntriesPerPage(Number(e.target.value))}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
            </select>
            <span className="ml-2 text-gray-600 text-sm md:text-base">entries</span>
          </div>

          <div className="relative w-full md:w-auto">
            <input
              type="text"
              placeholder="Search here..."
              className="border rounded px-3 py-1 pl-8 w-full md:w-64 text-sm md:text-base"
              value={searchTerm}
              onChange={handleSearch}
            />
            <FaSearch className="absolute left-2 top-2 text-gray-400" />
          </div>

          <Link 
            to="/add-attribute" 
            className="flex items-center px-3 py-1 md:px-4 md:py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition w-full md:w-auto justify-center md:justify-start text-sm md:text-base"
          >
            <span className="mr-1">+</span>
            Add new
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-4">{error}</div>
        ) : (
          <>
            <div className="overflow-x-auto -mx-3 md:mx-0">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-2 md:py-3 md:px-4 text-left text-sm md:text-base">Category</th>
                    <th className="py-2 px-2 md:py-3 md:px-4 text-left text-sm md:text-base">Value</th>
                    <th className="py-2 px-2 md:py-3 md:px-4 text-right text-sm md:text-base">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentAttributes.map((attribute) => (
                    <tr key={attribute._id} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-2 md:py-3 md:px-4 text-sm md:text-base">
                        {editingAttributeId === attribute._id ? (
                          <input
                            type="text"
                            className="w-full border border-gray-300 rounded px-2 py-1 text-sm md:text-base"
                            value={editingAttribute.attributeName}
                            onChange={updateAttributeName}
                          />
                        ) : (
                          attribute.attributeName
                        )}
                      </td>
                      <td className="py-2 px-2 md:py-3 md:px-4 text-sm md:text-base">
                        {editingAttributeId === attribute._id ? (
                          <div className="space-y-2">
                            {editingAttribute.attributeValues.map((value, index) => (
                              <div key={index} className="flex items-center">
                                {editingValueIndex === index ? (
                                  <>
                                    <input
                                      type="text"
                                      className="flex-grow border border-gray-300 rounded px-2 py-1 text-sm md:text-base"
                                      value={newValue}
                                      onChange={(e) => setNewValue(e.target.value)}
                                    />
                                    <button
                                      onClick={saveEditedValue}
                                      className="ml-1 text-green-500 hover:text-green-700"
                                    >
                                      <FaSave size={12} className="md:text-base" />
                                    </button>
                                    <button
                                      onClick={() => {
                                        setEditingValueIndex(-1);
                                        setNewValue('');
                                      }}
                                      className="ml-1 text-red-500 hover:text-red-700"
                                    >
                                      <FaTimes size={12} className="md:text-base" />
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <span className="flex-grow">{value}</span>
                                    <button
                                      onClick={() => startEditingValue(index, value)}
                                      className="ml-1 text-blue-500 hover:text-blue-700"
                                    >
                                      <FaEdit size={12} className="md:text-base" />
                                    </button>
                                    <button
                                      onClick={() => removeAttributeValue(index)}
                                      className="ml-1 text-red-500 hover:text-red-700"
                                    >
                                      <FaTrash size={12} className="md:text-base" />
                                    </button>
                                  </>
                                )}
                              </div>
                            ))}
                            <div className="flex items-center mt-2">
                              <input
                                type="text"
                                className="flex-grow border border-gray-300 rounded px-2 py-1 text-sm md:text-base"
                                value={newValue}
                                onChange={(e) => setNewValue(e.target.value)}
                                placeholder="Add new value"
                                disabled={editingValueIndex !== -1}
                              />
                              <button
                                onClick={addAttributeValue}
                                className="ml-1 text-green-500 hover:text-green-700"
                                disabled={editingValueIndex !== -1}
                              >
                                <FaPlus size={12} className="md:text-base" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="break-words max-w-xs md:max-w-md">
                            {attribute.attributeValues.join(', ')}
                          </div>
                        )}
                      </td>
                      <td className="py-2 px-2 md:py-3 md:px-4 text-right">
                        <div className="flex justify-end">
                          {editingAttributeId === attribute._id ? (
                            <>
                              <button
                                onClick={saveAttribute}
                                className="text-green-500 hover:text-green-700 mx-1"
                                title="Save"
                              >
                                <FaSave size={14} className="md:text-base" />
                              </button>
                              <button
                                onClick={cancelEditing}
                                className="text-red-500 hover:text-red-700 mx-1"
                                title="Cancel"
                              >
                                <FaTimes size={14} className="md:text-base" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => startEditing(attribute)}
                                className="text-green-500 hover:text-green-700 mx-1"
                                title="Edit"
                              >
                                <FaEdit size={14} className="md:text-base" />
                              </button>
                              <button
                                onClick={() => handleDelete(attribute._id)}
                                className="text-red-500 hover:text-red-700 mx-1"
                                title="Delete"
                              >
                                <FaTrash size={14} className="md:text-base" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center mt-4 md:mt-6 gap-3">
              <div className="text-gray-600 text-sm md:text-base text-center md:text-left">
                Showing {indexOfFirstEntry + 1} to {Math.min(indexOfLastEntry, filteredAttributes.length)} of {filteredAttributes.length} entries
              </div>
              <div className="flex flex-wrap justify-center">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="mx-1 px-2 py-1 rounded border disabled:opacity-50 text-sm md:text-base"
                >
                  &lt;
                </button>
                {Array.from({ length: Math.ceil(filteredAttributes.length / entriesPerPage) }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => paginate(i + 1)}
                    className={`mx-1 px-2 py-1 rounded text-sm md:text-base ${
                      currentPage === i + 1 ? 'bg-blue-500 text-white' : 'border'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === Math.ceil(filteredAttributes.length / entriesPerPage)}
                  className="mx-1 px-2 py-1 rounded border disabled:opacity-50 text-sm md:text-base"
                >
                  &gt;
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ListAtr;
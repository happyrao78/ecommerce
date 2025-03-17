import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';

const ListDynamic = ({ token }) => {
    const [dynamics, setDynamics] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedDynamic, setSelectedDynamic] = useState(null);
    const [editFormData, setEditFormData] = useState({
        title: '',
        subtitle: '',
        redirectLink: '',
        image1: null,
        image2: null
    });

    // Fetch all dynamic components
    const fetchDynamics = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${backendUrl}/api/dynamic/all`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            
            if (response.data.success) {
                setDynamics(response.data.dynamics);
            } else {
                toast.error(response.data.message || "Failed to fetch dynamic components");
            }
        } catch (error) {
            console.error("Error fetching dynamic components:", error);
            toast.error("An error occurred while fetching the components");
        } finally {
            setLoading(false);
        }
    };

    // Initial fetch
    useEffect(() => {
        if (token) {
            fetchDynamics();
        }
    }, [token]);

    // Handle view dynamic component
    const handleView = (dynamic) => {
        window.open(dynamic.redirectLink, '_blank');
    };

    // Handle edit dynamic component
    const handleEditClick = (dynamic) => {
        setSelectedDynamic(dynamic);
        setEditFormData({
            title: dynamic.title,
            subtitle: dynamic.subtitle,
            redirectLink: dynamic.redirectLink,
            image1: null,
            image2: null
        });
        setShowEditModal(true);
    };

    // Handle delete dynamic component
    const handleDeleteClick = (dynamic) => {
        setSelectedDynamic(dynamic);
        setShowDeleteModal(true);
    };

    // Handle form input change for edit
    const handleEditFormChange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            setEditFormData(prev => ({
                ...prev,
                [name]: files[0]
            }));
        } else {
            setEditFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    // Submit edit form
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        
        try {
            setLoading(true);
            
            const formData = new FormData();
            formData.append("title", editFormData.title);
            formData.append("subtitle", editFormData.subtitle);
            formData.append("redirectLink", editFormData.redirectLink);
            
            if (editFormData.image1) {
                formData.append("image1", editFormData.image1);
            }
            
            if (editFormData.image2) {
                formData.append("image2", editFormData.image2);
            }
            
            const response = await axios.put(
                `${backendUrl}/api/dynamic/update/${selectedDynamic._id}`, 
                formData, 
                {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "multipart/form-data"
                    }
                }
            );
            
            if (response.data.success) {
                toast.success(response.data.message || "Dynamic component updated successfully");
                setShowEditModal(false);
                fetchDynamics();
            } else {
                toast.error(response.data.message || "Failed to update dynamic component");
            }
        } catch (error) {
            console.error("Error updating dynamic component:", error);
            toast.error(error.response?.data?.message || "An error occurred while updating the component");
        } finally {
            setLoading(false);
        }
    };

    // Confirm delete
    const handleDeleteConfirm = async () => {
        try {
            setLoading(true);
            
            const response = await axios.delete(
                `${backendUrl}/api/dynamic/delete/${selectedDynamic._id}`, 
                {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );
            
            if (response.data.success) {
                toast.success(response.data.message || "Dynamic component deleted successfully");
                setShowDeleteModal(false);
                fetchDynamics();
            } else {
                toast.error(response.data.message || "Failed to delete dynamic component");
            }
        } catch (error) {
            console.error("Error deleting dynamic component:", error);
            toast.error(error.response?.data?.message || "An error occurred while deleting the component");
        } finally {
            setLoading(false);
        }
    };

    // Card view for mobile screens
    const renderMobileView = () => {
        return dynamics.map((dynamic) => (
            <div key={dynamic._id} className="bg-white rounded-lg shadow p-4 mb-4 border border-gray-200">
                <div className="flex flex-wrap gap-2 mb-3">
                    {dynamic.image && dynamic.image.map((img, index) => (
                        <img 
                            key={index}
                            src={img} 
                            alt={`Dynamic ${dynamic.title} - ${index}`}
                            className="w-16 h-16 object-cover rounded-md border border-gray-300"
                        />
                    ))}
                </div>
                
                <h3 className="font-medium text-lg mb-1">{dynamic.title}</h3>
                
                <div className="text-gray-600 mb-2 line-clamp-2">{dynamic.subtitle}</div>
                
                <div className="text-blue-600 text-sm mb-4 truncate">
                    {dynamic.redirectLink}
                </div>
                
                <div className="flex gap-2 justify-end">
                    <button 
                        onClick={() => handleView(dynamic)}
                        className="p-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                        aria-label="View"
                    >
                        <FaEye />
                    </button>
                    <button 
                        onClick={() => handleEditClick(dynamic)}
                        className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        aria-label="Edit"
                    >
                        <FaEdit />
                    </button>
                    <button 
                        onClick={() => handleDeleteClick(dynamic)}
                        className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                        aria-label="Delete"
                    >
                        <FaTrash />
                    </button>
                </div>
            </div>
        ));
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-3 sm:p-6 max-w-6xl mx-auto my-4 sm:my-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">Dynamic Components</h2>
            
            {loading && (
                <div className="flex justify-center my-6">
                    <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </div>
            )}
            
            {!loading && dynamics.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    No dynamic components found. Create one to get started.
                </div>
            )}
            
            {!loading && dynamics.length > 0 && (
                <>
                    {/* Mobile view (card-based layout) */}
                    <div className="md:hidden">
                        {renderMobileView()}
                    </div>
                    
                    {/* Desktop view (table-based layout) */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="py-3 px-4 border-b text-left">Images</th>
                                    <th className="py-3 px-4 border-b text-left">Title</th>
                                    <th className="py-3 px-4 border-b text-left">Subtitle</th>
                                    <th className="py-3 px-4 border-b text-left">Link</th>
                                    <th className="py-3 px-4 border-b text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dynamics.map((dynamic) => (
                                    <tr key={dynamic._id} className="hover:bg-gray-50">
                                        <td className="py-3 px-4 border-b">
                                            <div className="flex gap-2">
                                                {dynamic.image && dynamic.image.map((img, index) => (
                                                    <img 
                                                        key={index}
                                                        src={img} 
                                                        alt={`Dynamic ${dynamic.title} - ${index}`}
                                                        className="w-16 h-16 object-cover rounded-md border border-gray-300"
                                                    />
                                                ))}
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 border-b">{dynamic.title}</td>
                                        <td className="py-3 px-4 border-b">
                                            <div className="max-w-xs truncate">{dynamic.subtitle}</div>
                                        </td>
                                        <td className="py-3 px-4 border-b">
                                            <div className="max-w-xs truncate">{dynamic.redirectLink}</div>
                                        </td>
                                        <td className="py-3 px-4 border-b">
                                            <div className="flex justify-center gap-2">
                                                <button 
                                                    onClick={() => handleView(dynamic)}
                                                    className="p-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                                                    aria-label="View"
                                                >
                                                    <FaEye />
                                                </button>
                                                <button 
                                                    onClick={() => handleEditClick(dynamic)}
                                                    className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                                    aria-label="Edit"
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteClick(dynamic)}
                                                    className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                                                    aria-label="Delete"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
            
            {/* Edit Modal - Responsive */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <h3 className="text-lg sm:text-xl font-semibold mb-4">Edit Dynamic Component</h3>
                        
                        <form onSubmit={handleEditSubmit}>
                            <div className="mb-4">
                                <label className="block font-medium mb-2">Current Images</label>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {selectedDynamic.image && selectedDynamic.image.map((img, index) => (
                                        <img 
                                            key={index}
                                            src={img} 
                                            alt={`Current ${index}`}
                                            className="w-20 h-20 object-cover rounded-md border border-gray-300"
                                        />
                                    ))}
                                </div>
                                
                                <label className="block font-medium mb-2 mt-4">Upload New Images (Optional)</label>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="w-full sm:w-1/2">
                                        <input 
                                            type="file" 
                                            name="image1" 
                                            onChange={handleEditFormChange}
                                            className="block w-full text-sm text-gray-500
                                                file:mr-4 file:py-2 file:px-4
                                                file:rounded-md file:border-0
                                                file:text-sm file:font-semibold
                                                file:bg-blue-50 file:text-blue-700
                                                hover:file:bg-blue-100"
                                        />
                                        {editFormData.image1 && (
                                            <div className="mt-2">
                                                <img 
                                                    src={URL.createObjectURL(editFormData.image1)} 
                                                    alt="New preview 1" 
                                                    className="w-20 h-20 object-cover rounded-md border border-gray-300"
                                                />
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="w-full sm:w-1/2">
                                        <input 
                                            type="file" 
                                            name="image2" 
                                            onChange={handleEditFormChange}
                                            className="block w-full text-sm text-gray-500
                                                file:mr-4 file:py-2 file:px-4
                                                file:rounded-md file:border-0
                                                file:text-sm file:font-semibold
                                                file:bg-blue-50 file:text-blue-700
                                                hover:file:bg-blue-100"
                                        />
                                        {editFormData.image2 && (
                                            <div className="mt-2">
                                                <img 
                                                    src={URL.createObjectURL(editFormData.image2)} 
                                                    alt="New preview 2" 
                                                    className="w-20 h-20 object-cover rounded-md border border-gray-300"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mb-4">
                                <label className="block font-medium mb-2">Title</label>
                                <input 
                                    type="text"
                                    name="title"
                                    value={editFormData.title}
                                    onChange={handleEditFormChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            
                            <div className="mb-4">
                                <label className="block font-medium mb-2">Subtitle</label>
                                <textarea 
                                    name="subtitle"
                                    value={editFormData.subtitle}
                                    onChange={handleEditFormChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                                />
                            </div>
                            
                            <div className="mb-4">
                                <label className="block font-medium mb-2">Redirect Link</label>
                                <input 
                                    type="text"
                                    name="redirectLink"
                                    value={editFormData.redirectLink}
                                    onChange={handleEditFormChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            
                            <div className="flex flex-col sm:flex-row sm:justify-end gap-2 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowEditModal(false)}
                                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 w-full sm:w-auto mb-2 sm:mb-0"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 w-full sm:w-auto ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {loading ? 'Updating...' : 'Update Component'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            
            {/* Delete Confirmation Modal - Responsive */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md">
                        <h3 className="text-lg sm:text-xl font-semibold mb-4">Confirm Delete</h3>
                        <p className="mb-6">Are you sure you want to delete the dynamic component "{selectedDynamic.title}"? This action cannot be undone.</p>
                        
                        <div className="flex flex-col sm:flex-row sm:justify-end gap-2">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 w-full sm:w-auto mb-2 sm:mb-0"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteConfirm}
                                disabled={loading}
                                className={`px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 w-full sm:w-auto ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {loading ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ListDynamic;
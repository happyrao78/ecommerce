import React, { useState } from 'react';
import { assets } from '../assets/admin_assets/assets';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';

const AddDynamic = ({ token, fetchDynamics }) => {
    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [image1, setImage1] = useState('');
    const [image2, setImage2] = useState('');
    const [redirectLink, setRedirectLink] = useState('');
    const [adding, setAdding] = useState(false);
    const [loading, setLoading] = useState(false);

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        
        if (!title || !subtitle || !redirectLink) {
            toast.error("Please fill all required fields");
            return;
        }

        if (!image1) {
            toast.error("At least one image is required");
            return;
        }

        try {
            setAdding(true);
            
            const formData = new FormData();
            formData.append("title", title);
            formData.append("subtitle", subtitle);
            formData.append("redirectLink", redirectLink);
            
            if (image1) {
                formData.append("image1", image1);
            }
            
            if (image2) {
                formData.append("image2", image2);
            }
            
            const response = await axios.post(`${backendUrl}/api/dynamic/add`, formData, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            });
            
            if (response.data.success) {
                toast.success(response.data.message);
                // Reset form after successful submission
                setTitle('');
                setSubtitle('');
                setImage1('');
                setImage2('');
                setRedirectLink('');
                
                // Refresh the dynamic components list if fetchDynamics function is passed
                if (typeof fetchDynamics === 'function') {
                    fetchDynamics();
                }
            } else {
                toast.error(response.data.message || "Failed to add dynamic component");
            }
        } catch (error) {
            console.error("Error adding dynamic component:", error);
            toast.error(error.response?.data?.message || "An error occurred while adding the component");
        } finally {
            setAdding(false);
        }
    };

    return (
        <form onSubmit={onSubmitHandler} className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto my-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Add New Dynamic Component</h2>
            
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
                </div>

                <div className='w-full mt-4'>
                    <p className='mb-2 font-medium'>Component Title</p>
                    <input 
                        type="text" 
                        placeholder='Type Here' 
                        required 
                        className='w-full max-w-[500px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                        onChange={(e) => setTitle(e.target.value)}
                        value={title} 
                    />
                </div>
                
                <div className='w-full mt-2'>
                    <p className='mb-2 font-medium'>Component Subtitle</p>
                    <textarea 
                        placeholder='Write content here' 
                        required 
                        className='w-full max-w-[500px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]'
                        onChange={(e) => setSubtitle(e.target.value)}
                        value={subtitle} 
                    />
                </div>

                <div className='w-full mt-4'>
                    <p className='mb-2 font-medium'>Redirect Link</p>
                    <input 
                        type="text" 
                        placeholder='Type Here' 
                        required 
                        className='w-full max-w-[500px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                        onChange={(e) => setRedirectLink(e.target.value)}
                        value={redirectLink} 
                    />
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
                    {adding ? 'Adding Component...' : 'Add Component'}
                </button>
            </div>
        </form>
    );
};

export default AddDynamic;
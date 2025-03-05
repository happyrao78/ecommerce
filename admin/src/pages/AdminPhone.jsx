import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from "react-toastify";
import {backendUrl} from "../App"

const AdminPhone = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [savedPhoneNumber, setSavedPhoneNumber] = useState('');

    useEffect(() => {
        axios.get(`${backendUrl}/api/admin/admin-phone`)
            .then(response => {
                setSavedPhoneNumber(response.data.phoneNumber);
            })
            .catch(error => {
                toast.error(error)
                console.error('Error fetching the phone number!', error);
            });
    }, []);

    const handleInputChange = (e) => {
        setPhoneNumber(e.target.value);
    };

    const handleSave = () => {
        axios.post(`${backendUrl}/api/admin/admin-phone`, { phoneNumber })
            .then(response => {
                console.log(response.data)
                setSavedPhoneNumber(response.data.adminPhone.phoneNumber);
                
                setPhoneNumber('');
                toast.success(response.data.message)
            })
            .catch(error => {
                toast.error(error.response.data.message)

                console.error('Error saving the phone number!', error);
            });
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200 p-6">
        
            <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
                <h1 className="text-xl font-bold text-gray-800 text-center mb-4">Admin Phone Number</h1>
                <input
                    type="text"
                    value={phoneNumber}
                    onChange={handleInputChange}
                    placeholder="Enter phone number"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button 
                    onClick={handleSave} 
                    className="w-full bg-blue-500 text-white p-2 mt-4 rounded-md hover:bg-blue-600 transition duration-200">
                    Save
                </button>
                {savedPhoneNumber && (
                    <div className="mt-6 text-center">
                        <h2 className="text-lg font-semibold text-gray-700">Saved Phone Number:</h2>
                        <p className="text-gray-900 text-lg font-medium">{savedPhoneNumber}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminPhone;
// import React, { useContext, useEffect, useState } from 'react'
// import axios from 'axios';
// import { ShopContext } from '../context/ShopContext';


// const Account = () => {

//     const { backendUrl, token } = useContext(ShopContext)
//     const [userData, setUserData]=useState({})
//     const [orderData, setOrderData]=useState({})


//     useEffect(()=>{
//         getUserDetails(token)
//         getUserOrders(token)

//     },[])

//     useEffect(()=>{
//         console.log(userData)
//     },[userData])

//     useEffect(()=>{
//         console.log("OrderData",orderData)
//     },[orderData])

//     const getUserDetails = async (token) => {
//         try {
//             const response = await axios.get(`${backendUrl}/api/user/get-user`, {
//                 headers: { token }
//             });
//             console.log(response.data.user)
//             setUserData(response.data.user)
//         } catch (error) {
//             console.error('There was a problem with the fetch operation:', error);
//         }
//     };


//     const getUserOrders = async (token) => {
//         try {
//             const response = await axios.post(`${backendUrl}/api/order/userorders`, {token}, {
//                 headers: { token }
//             });
//             console.log("OrderData",response.data.orders)
//             setOrderData(response.data.orders)
//         } catch (error) {
//             console.error('There was a problem with the fetch operation:', error);
//         }
//     };


//     return (
//         <div>Account</div>
//     )
// }

// export default Account


import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios';
import { ShopContext } from '../context/ShopContext';
import {
    User,
    Mail,
    Calendar,
    Key,
    PhoneCall
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from "../components/Button.jsx"
import Orders from './Orders.jsx';

const Account = () => {
    const { backendUrl, token, navigate, setCartItems,setToken} = useContext(ShopContext)
    const [userData, setUserData] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    const logout = () => {
        navigate("/login")
        localStorage.removeItem("token")
        setToken("");
        setCartItems({})
        // navigate("/login")
        
    }

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                setIsLoading(true)
                const response = await axios.get(`${backendUrl}/api/user/get-user`, {
                    headers: { token }
                });
                setUserData(response.data.user)
            } catch (error) {
                console.error('Error fetching user details:', error);
            } finally {
                setIsLoading(false)
            }
        }
        fetchUserDetails()
    }, [token, backendUrl])

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-blue-500"></div>
            </div>
        )
    }

    return (
        (userData && <div className="container  rounded-lg mx-auto py-8 my-10 flex flex-col  lg:flex lg:flex-row gap-10">
            <div className="bg-white  rounded-lg border lg:w-1/2">
                {/* Page Header */}
                <div className="border-b p-6">
                    <h1 className="text-2xl font-medium text-center sm:text-center lg:text-start">Personal Information</h1>
                </div>

                {/* Personal Details Section */}
                <div className="p-2 sm:p-2 lg:p-6 space-y-6">
                    <div className="flex flex-col gap-6 mt-2">
                        {/* Personal Info Card */}
                        <div className="bg-gray-50 p-1 sm:p-1 lg:p-6 rounded-lg">
                            <h2 className="text-xl font-semibold mb-4 flex items-center">
                                <User className="mr-3 text-blue-500" />
                                Basic Information
                            </h2>
                            <div className="space-y-3">
                                <div className="flex items-center">
                                    <span className="font-medium mr-2">Name:</span>
                                    <span>{userData.name || 'Not provided'}</span>
                                </div>
                                <div className="flex items-center">
                                <span className="font-medium mr-2">Email:</span>
                                    <span>{userData.email || 'Not provided'}</span>
                                </div>
                            </div>
                        </div>

                        <hr />

                        {/* Account Details Card */}
                        <div className="bg-gray-50 p-1 sm:p-1 lg:p-6 rounded-lg">
                            <h2 className="text-xl font-semibold mb-4 flex items-center">
                                <Key className="mr-3 text-green-500" />
                                Account Details
                            </h2>
                            <div className="space-y-3">
                                
                                <div className="flex items-center">
                                    <span className="font-medium mr-2">Authentication:</span>
                                    <span className="capitalize">
                                        {userData.authMethod || 'Not specified'}
                                    </span>
                                </div>
                                <div className="flex items-center">
                                    {/* <Calendar className="mr-2 text-gray-500" /> */}
                                    <span className='text-xs'>Created at {formatDate(userData.createdAt)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <hr />
                    {/* Additional Actions */}
                    <div className="mt-6 flex flex-col  sm:flex-col lg:flex-row lg:justify-between gap-4 lg:items-center">
                        <Link to="/cart">
                            <Button
                                className="w-full sm:w-full"
                            >
                                View Cart
                            </Button>
                        </Link>
                        <Link to="/wishlist">
                            <Button
                                className="w-full sm:w-full"
                            >
                                View Wishlist
                            </Button>
                        </Link>
                        <Link>
                            <Button
                                className=" w-full sm:w-full"
                                onClick={logout}
                            >
                                Logout
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            <div className='rounded-lg border lg:w-1/2'>
                <Orders/>
            </div>
        </div>
    ))
}

export default Account
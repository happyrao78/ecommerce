import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    UserCircleIcon, 
    EnvelopeIcon, 
    DevicePhoneMobileIcon, 
    ClockIcon,
    DeviceTabletIcon,
    ComputerDesktopIcon 
} from '@heroicons/react/24/outline';
import { backendUrl } from '../App';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
      const fetchAllUsers = async () => {
          try {
              const response = await axios.get(`${backendUrl}/api/user/all`);

              console.log("Full Response:", response);

              // Check if response.data exists and has the expected structure
              if (response.data && response.data.success) {
                  // Use optional chaining and provide a fallback empty array
                  const usersData = response.data.orders || response.data.users || [];

                  // Safe sorting with fallback
                  const sortedUsers = [...usersData].sort((a, b) => {
                      // Get the most recent login timestamp for each user
                      const getLastLoginTime = (user) => {
                          if (user.loginHistory && user.loginHistory.length > 0) {
                              const lastLogin = user.loginHistory[user.loginHistory.length - 1];
                              return lastLogin.timestamp ? new Date(lastLogin.timestamp).getTime() : 0;
                          }
                          return 0;
                      };

                      const aLastLogin = getLastLoginTime(a);
                      const bLastLogin = getLastLoginTime(b);
                      
                      // Sort in descending order (most recent first)
                      return bLastLogin - aLastLogin;
                  });

                  setUsers(sortedUsers);
              } else {
                  throw new Error(response.data?.message || 'Failed to fetch users');
              }
          } catch (err) {
              console.error('Complete Error:', err);
              
              if (err.response) {
                  setError(err.response.data?.message || 'Server error occurred');
              } else if (err.request) {
                  setError('No response received from server');
              } else {
                  setError(err.message);
              }
          } finally {
              setLoading(false);
          }
      };

      fetchAllUsers();
  }, []);


    // Filtering users based on search term
    const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.authMethod.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.loginHistory.some(login => 
            login.deviceInfo.os.toLowerCase().includes(searchTerm.toLowerCase()) ||
            login.deviceInfo.browser.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    // Function to get device icon and color
    const getDeviceIcon = (deviceType, isMobile) => {
        if (isMobile) {
            return {
                icon: <DevicePhoneMobileIcon className="h-5 w-5 text-blue-500" />,
                color: 'bg-blue-100 text-blue-800'
            };
        }
        
        switch (deviceType.toLowerCase()) {
            case 'windows':
            case 'mac':
            case 'linux':
                return {
                    icon: <ComputerDesktopIcon className="h-5 w-5 text-green-500" />,
                    color: 'bg-green-100 text-green-800'
                };
            default:
                return {
                    icon: <DeviceTabletIcon className="h-5 w-5 text-purple-500" />,
                    color: 'bg-purple-100 text-purple-800'
                };
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-blue-500"></div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white shadow-md rounded-lg">
                <div className="flex justify-between items-center p-6 bg-gray-50 border-b">
                    <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                        <UserCircleIcon className="h-10 w-10 mr-3 text-blue-500" />
                        Users Management
                    </h1>
                    
                    {/* Search Input */}
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="Search users..." 
                            className="w-64 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <span className="absolute right-3 top-3 text-gray-400">
                            🔍
                        </span>
                    </div>
                </div>

                {/* Users Table */}
                {filteredUsers.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-100 border-b">
                                <tr>
                                    <th className="p-4 text-left flex items-center">
                                        <UserCircleIcon className="h-5 w-5 mr-2 text-gray-600" />
                                        Name
                                    </th>
                                    <th className="p-4 text-left">
                                        <EnvelopeIcon className="h-5 w-5 mr-2 inline text-gray-600" />
                                        Email
                                    </th>
                                    <th className="p-4 text-left">
                                        <DevicePhoneMobileIcon className="h-5 w-5 mr-2 inline text-gray-600" />
                                        Last Login Device
                                    </th>
                                    <th className="p-4 text-left">
                                        <ClockIcon className="h-5 w-5 mr-2 inline text-gray-600" />
                                        Last Login Time
                                    </th>
                                    <th className="p-4 text-center">
                                        Login History
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user) => {
                                    // Get the most recent login
                                    const lastLogin = user.loginHistory.length > 0 
                                        ? user.loginHistory[user.loginHistory.length - 1] 
                                        : null;
                                    
                                    // Get device icon and color
                                    const deviceDetails = lastLogin 
                                        ? getDeviceIcon(
                                            lastLogin.deviceInfo.osName, 
                                            lastLogin.deviceInfo.isMobile
                                        ) 
                                        : { icon: null, color: '' };

                                    return (
                                        <tr 
                                            key={user._id} 
                                            className="border-b hover:bg-gray-50 transition duration-200"
                                        >
                                            <td className="p-4 font-medium text-gray-700">{user.name}</td>
                                            <td className="p-4 text-gray-600">{user.email}</td>
                                            <td className="p-4">
                                                {lastLogin ? (
                                                    <span className="flex items-center">
                                                        {deviceDetails.icon}
                                                        <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${deviceDetails.color}`}>
                                                            {lastLogin.deviceInfo.osName} - {lastLogin.deviceInfo.browser}
                                                        </span>
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-500">No login data</span>
                                                )}
                                            </td>
                                            <td className="p-4 text-gray-600">
                                                {lastLogin 
                                                    ? new Date(lastLogin.timestamp).toLocaleString() 
                                                    : 'Never'}
                                            </td>
                                            <td className="p-4 text-center">
                                                <span className={`
                                                    px-2 py-1 rounded-full text-xs font-semibold
                                                    ${user.loginHistory.length > 5 ? 'bg-green-100 text-green-800' : 
                                                      user.loginHistory.length > 0 ? 'bg-yellow-100 text-yellow-800' : 
                                                      'bg-red-100 text-red-800'}
                                                `}>
                                                    {user.loginHistory.length}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-10 text-gray-500">
                        <UserCircleIcon className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                        No users found matching your search
                    </div>
                )}

                {/* Footer */}
                <div className="bg-gray-50 p-4 border-t flex justify-between items-center">
                    <span className="text-gray-600">
                        Total Users: {filteredUsers.length}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Users;
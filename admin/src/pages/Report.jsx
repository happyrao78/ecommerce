import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl, currency } from '../App';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { 
    ChartBarIcon, 
    CurrencyDollarIcon, 
    UserGroupIcon, 
    DocumentTextIcon 
} from '@heroicons/react/24/outline';

const Report = ({ token }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reportData, setReportData] = useState({
        totalOrderValue: [],
        completedRevenue: [],
        userCount: []
    });

    useEffect(() => {
        const fetchReportData = async () => {
            try {
                // Fetch total order value
                const orderResponse = await axios.post(
                    `${backendUrl}/api/order/monthly-total`,
                    {},
                    { headers: { token } }
                );

                // Fetch completed revenue
                const revenueResponse = await axios.post(
                    `${backendUrl}/api/order/completed-revenue`,
                    {},
                    { headers: { token } }
                );

                // Fetch user count
                const userResponse = await axios.get(
                    `${backendUrl}/api/user/monthly-count`,
                    { headers: { token } }
                );

                if (
                    orderResponse.data.success && 
                    revenueResponse.data.success && 
                    userResponse.data.success
                ) {
                    setReportData({
                        totalOrderValue: orderResponse.data.monthlyTotals,
                        completedRevenue: revenueResponse.data.monthlyRevenue,
                        userCount: userResponse.data.monthlyUsers
                    });
                } else {
                    throw new Error('Failed to fetch report data');
                }
            } catch (err) {
                console.error('Reporting Error:', err);
                setError(err.message || 'An error occurred while fetching reports');
            } finally {
                setLoading(false);
            }
        };

        fetchReportData();
    }, [token]);

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

    // Custom tooltip for charts
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-4 border border-gray-300 rounded shadow-lg">
                    <p className="font-bold text-gray-700">{label}</p>
                    {payload.map((entry, index) => (
                        <p 
                            key={`item-${index}`} 
                            className={`text-${entry.color}`}
                        >
                            {entry.name}: {currency}{entry.value.toFixed(2)}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-3 gap-6 mb-8">
                {/* Total Amount Card */}
                <div className="bg-white shadow-md rounded-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 flex items-center">
                                <DocumentTextIcon className="h-5 w-5 mr-2 text-blue-500" />
                                Total Order Value
                            </h3>
                            <p className="text-2xl font-bold text-gray-900 mt-2">
                                {currency}{reportData.totalOrderValue.reduce((sum, item) => sum + item.total, 0).toFixed(2)}
                            </p>
                        </div>
                        <div className="text-green-500 flex items-center text-sm">
                            1.56% ↑
                        </div>
                    </div>
                </div>

                {/* Total Revenue Card */}
                <div className="bg-white shadow-md rounded-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 flex items-center">
                                <CurrencyDollarIcon className="h-5 w-5 mr-2 text-green-500" />
                                Total Revenue
                            </h3>
                            <p className="text-2xl font-bold text-gray-900 mt-2">
                                {currency}{reportData.completedRevenue.reduce((sum, item) => sum + item.revenue, 0).toFixed(2)}
                            </p>
                        </div>
                        <div className="text-green-500 flex items-center text-sm">
                            0.56% ↑
                        </div>
                    </div>
                </div>

                {/* Total Users Card */}
                <div className="bg-white shadow-md rounded-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 flex items-center">
                                <UserGroupIcon className="h-5 w-5 mr-2 text-purple-500" />
                                Total Customers
                            </h3>
                            <p className="text-2xl font-bold text-gray-900 mt-2">
                                {reportData.userCount.reduce((sum, item) => sum + item.count, 0)}
                            </p>
                        </div>
                        <div className="text-green-500 flex items-center text-sm">
                            0.00% →
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Total Order Value Chart */}
                <div className="bg-white shadow-md rounded-lg p-6">
                    <div className="flex items-center mb-4">
                        <ChartBarIcon className="h-6 w-6 mr-2 text-blue-500" />
                        <h2 className="text-lg font-semibold text-gray-800">Total Order Value</h2>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={reportData.totalOrderValue}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="total" fill="#3B82F6" barSize={20} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Total Revenue Chart */}
                <div className="bg-white shadow-md rounded-lg p-6">
                    <div className="flex items-center mb-4">
                        <CurrencyDollarIcon className="h-6 w-6 mr-2 text-green-500" />
                        <h2 className="text-lg font-semibold text-gray-800">Total Revenue</h2>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={reportData.completedRevenue}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="revenue" fill="#10B981" barSize={20} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Report;
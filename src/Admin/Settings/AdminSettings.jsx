import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, CreditCard, Hash, Settings, Users, Building } from 'lucide-react';

const AdminSettings = () => {
    const settingsCategories = [
        {
            title: 'Company Management',
            description: 'Manage company-wide settings and configurations',
            items: [
                {
                    name: 'Holiday Management',
                    description: 'Manage company holidays and calendar',
                    path: '/admin/holidays',
                    icon: Calendar,
                    color: 'bg-blue-500',
                    bgColor: 'bg-blue-50',
                    textColor: 'text-blue-600'
                },
                {
                    name: 'Department Management',
                    description: 'Manage company departments and structure',
                    path: '/admin/departments',
                    icon: Building,
                    color: 'bg-purple-500',
                    bgColor: 'bg-purple-50',
                    textColor: 'text-purple-600'
                }
            ]
        },
        {
            title: 'Employee Management',
            description: 'Employee-related tools and configurations',
            items: [
                {
                    name: 'Employee Codes',
                    description: 'Manage employee identification codes',
                    path: '/admin/employee-codes',
                    icon: Hash,
                    color: 'bg-green-500',
                    bgColor: 'bg-green-50',
                    textColor: 'text-green-600'
                },
                {
                    name: 'ID Card Generator',
                    description: 'Generate employee ID cards and visiting cards',
                    path: '/id-card-generator',
                    icon: CreditCard,
                    color: 'bg-orange-500',
                    bgColor: 'bg-orange-50',
                    textColor: 'text-orange-600'
                }
            ]
        },
        {
            title: 'System Tools',
            description: 'System administration and utility tools',
            items: [
                {
                    name: 'Enhanced Attendance',
                    description: 'Advanced attendance tracking with photos and location',
                    path: '/enhanced-attendance',
                    icon: Users,
                    color: 'bg-indigo-500',
                    bgColor: 'bg-indigo-50',
                    textColor: 'text-indigo-600'
                }
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center mb-4">
                        <div className="bg-gray-800 p-3 rounded-lg">
                            <Settings className="w-8 h-8 text-white" />
                        </div>
                        <div className="ml-4">
                            <h1 className="text-3xl font-bold text-gray-800">Admin Settings</h1>
                            <p className="text-gray-600">Manage system settings and configurations</p>
                        </div>
                    </div>
                </div>

                {/* Settings Categories */}
                <div className="space-y-8">
                    {settingsCategories.map((category, categoryIndex) => (
                        <div key={categoryIndex} className="bg-white rounded-lg shadow-md p-6">
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                                    {category.title}
                                </h2>
                                <p className="text-gray-600">{category.description}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {category.items.map((item, itemIndex) => (
                                    <Link
                                        key={itemIndex}
                                        to={item.path}
                                        className="block group hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
                                    >
                                        <div className="bg-white border border-gray-200 rounded-lg p-6 h-full">
                                            <div className="flex items-start space-x-4">
                                                <div className={`${item.bgColor} p-3 rounded-lg`}>
                                                    <item.icon className={`w-6 h-6 ${item.textColor}`} />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                                                        {item.name}
                                                    </h3>
                                                    <p className="text-sm text-gray-600 leading-relaxed">
                                                        {item.description}
                                                    </p>
                                                </div>
                                            </div>
                                            
                                            <div className="mt-4 flex items-center text-sm text-blue-600 group-hover:text-blue-700">
                                                <span>Access Tool</span>
                                                <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Quick Stats */}
                <div className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-semibold mb-2">System Status</h3>
                            <p className="text-blue-100">All systems operational and ready for use</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold">{settingsCategories.reduce((acc, cat) => acc + cat.items.length, 0)}</div>
                                <div className="text-sm text-blue-100">Tools Available</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold">{settingsCategories.length}</div>
                                <div className="text-sm text-blue-100">Categories</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Help Section */}
                <div className="mt-8 bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Need Help?</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-start space-x-3">
                            <div className="bg-blue-100 p-2 rounded-lg">
                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-800">Documentation</h4>
                                <p className="text-sm text-gray-600">Access comprehensive guides and tutorials</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <div className="bg-green-100 p-2 rounded-lg">
                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 110 19.5 9.75 9.75 0 010-19.5z" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-800">Support</h4>
                                <p className="text-sm text-gray-600">Get help from our technical support team</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;

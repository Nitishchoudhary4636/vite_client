import React from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, Camera, Folder, Settings, User, Clock } from 'lucide-react';

const EmployeeTools = () => {
    const toolsCategories = [
        {
            title: 'Personal Tools',
            description: 'Tools for managing your personal information and documents',
            items: [
                {
                    name: 'ID Card Generator',
                    description: 'Generate your employee ID card and visiting card',
                    path: '/id-card-generator',
                    icon: CreditCard,
                    color: 'bg-blue-500',
                    bgColor: 'bg-blue-50',
                    textColor: 'text-blue-600'
                },
                {
                    name: 'Profile Management',
                    description: 'Update your profile information and photo',
                    path: '/profile-details',
                    icon: User,
                    color: 'bg-green-500',
                    bgColor: 'bg-green-50',
                    textColor: 'text-green-600'
                }
            ]
        },
        {
            title: 'Work Management',
            description: 'Tools for tracking your work and projects',
            items: [
                {
                    name: 'Enhanced Attendance',
                    description: 'Clock in/out with photo and location tracking',
                    path: '/enhanced-attendance',
                    icon: Camera,
                    color: 'bg-purple-500',
                    bgColor: 'bg-purple-50',
                    textColor: 'text-purple-600'
                },
                {
                    name: 'My Projects',
                    description: 'View and manage your assigned projects',
                    path: '/employee/project-dashboard',
                    icon: Folder,
                    color: 'bg-orange-500',
                    bgColor: 'bg-orange-50',
                    textColor: 'text-orange-600'
                }
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center mb-4">
                        <div className="bg-blue-600 p-3 rounded-lg">
                            <Settings className="w-8 h-8 text-white" />
                        </div>
                        <div className="ml-4">
                            <h1 className="text-3xl font-bold text-gray-800">Employee Tools</h1>
                            <p className="text-gray-600">Access your personal tools and utilities</p>
                        </div>
                    </div>
                </div>

                {/* Tools Categories */}
                <div className="space-y-8">
                    {toolsCategories.map((category, categoryIndex) => (
                        <div key={categoryIndex} className="bg-white rounded-lg shadow-md p-6">
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                                    {category.title}
                                </h2>
                                <p className="text-gray-600">{category.description}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                {/* Quick Access */}
                <div className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-semibold mb-2">Quick Access</h3>
                            <p className="text-blue-100">Frequently used tools for your convenience</p>
                        </div>
                        <div className="flex space-x-4">
                            <Link
                                to="/enhanced-attendance"
                                className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2"
                            >
                                <Camera className="w-4 h-4" />
                                <span>Clock In/Out</span>
                            </Link>
                            <Link
                                to="/id-card-generator"
                                className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2"
                            >
                                <CreditCard className="w-4 h-4" />
                                <span>ID Card</span>
                            </Link>
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
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-800">User Guide</h4>
                                <p className="text-sm text-gray-600">Learn how to use the employee tools effectively</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <div className="bg-green-100 p-2 rounded-lg">
                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 110 19.5 9.75 9.75 0 010-19.5z" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-800">IT Support</h4>
                                <p className="text-sm text-gray-600">Contact IT support for technical assistance</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeTools;

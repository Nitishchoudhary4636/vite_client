import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
    Building, 
    Calendar, 
    CreditCard, 
    Hash, 
    Camera, 
    MapPin, 
    Users, 
    Folder,
    ChevronDown,
    ChevronRight
} from 'lucide-react';
import { useSelector } from 'react-redux';

const NavigationMenu = () => {
    const location = useLocation();
    const [expandedSections, setExpandedSections] = useState({
        admin: true,
        employee: true,
        shared: true
    });
    
    const user = useSelector((state) => state.auth.user);
    const isAdmin = user?.role === 'admin';

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const isActive = (path) => {
        return location.pathname === path;
    };

    const adminMenuItems = [
        {
            title: 'Department Management',
            path: '/admin/departments',
            icon: Building,
            description: 'Manage company departments'
        },
        {
            title: 'Holiday Management',
            path: '/admin/holidays',
            icon: Calendar,
            description: 'Manage company holidays'
        },
        {
            title: 'Employee Codes',
            path: '/admin/employee-codes',
            icon: Hash,
            description: 'Manage employee ID codes'
        }
    ];

    const employeeMenuItems = [
        {
            title: 'My Projects',
            path: '/employee/project-dashboard',
            icon: Folder,
            description: 'View your projects and tasks'
        }
    ];

    const sharedMenuItems = [
        {
            title: 'Enhanced Attendance',
            path: '/enhanced-attendance',
            icon: Camera,
            description: 'Clock in/out with photos and location'
        },
        {
            title: 'ID Card Generator',
            path: '/id-card-generator',
            icon: CreditCard,
            description: 'Generate employee ID cards'
        }
    ];

    const MenuSection = ({ title, items, isExpanded, onToggle, sectionKey }) => (
        <div className="mb-4">
            <button
                onClick={() => onToggle(sectionKey)}
                className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
            >
                <span>{title}</span>
                {isExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                ) : (
                    <ChevronRight className="w-4 h-4" />
                )}
            </button>
            
            {isExpanded && (
                <div className="mt-2 space-y-1">
                    {items.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center px-4 py-2 text-sm rounded-lg transition-colors ${
                                isActive(item.path)
                                    ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-500'
                                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                            }`}
                        >
                            <item.icon className="w-4 h-4 mr-3" />
                            <div>
                                <div className="font-medium">{item.title}</div>
                                <div className="text-xs text-gray-500">{item.description}</div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );

    return (
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-2 rounded-lg">
                    <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div className="ml-3">
                    <h2 className="text-lg font-semibold text-gray-800">New Features</h2>
                    <p className="text-sm text-gray-600">Enhanced EMS functionality</p>
                </div>
            </div>

            <div className="space-y-2">
                {isAdmin && (
                    <MenuSection
                        title="Admin Features"
                        items={adminMenuItems}
                        isExpanded={expandedSections.admin}
                        onToggle={toggleSection}
                        sectionKey="admin"
                    />
                )}

                <MenuSection
                    title="Employee Features"
                    items={employeeMenuItems}
                    isExpanded={expandedSections.employee}
                    onToggle={toggleSection}
                    sectionKey="employee"
                />

                <MenuSection
                    title="Shared Features"
                    items={sharedMenuItems}
                    isExpanded={expandedSections.shared}
                    onToggle={toggleSection}
                    sectionKey="shared"
                />
            </div>

            {/* Quick Access Buttons */}
            <div className="mt-6 pt-4 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Access</h3>
                <div className="grid grid-cols-2 gap-2">
                    <Link
                        to="/enhanced-attendance"
                        className="flex items-center justify-center px-3 py-2 text-xs bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        <Camera className="w-3 h-3 mr-1" />
                        Clock In/Out
                    </Link>
                    <Link
                        to="/id-card-generator"
                        className="flex items-center justify-center px-3 py-2 text-xs bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                        <CreditCard className="w-3 h-3 mr-1" />
                        ID Cards
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NavigationMenu;

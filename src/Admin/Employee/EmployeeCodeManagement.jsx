import React, { useState, useEffect } from 'react';
import { Hash, Edit, Save, X, Search, Filter } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const EmployeeCodeManagement = () => {
    const [employees, setEmployees] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [newCode, setNewCode] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [codeStats, setCodeStats] = useState({
        total: 0,
        assigned: 0,
        unassigned: 0
    });

    useEffect(() => {
        fetchEmployees();
        fetchDepartments();
    }, []);

    useEffect(() => {
        calculateStats();
    }, [employees]);

    const fetchEmployees = async () => {
        try {
            const token = localStorage.getItem('token');
            // This would need to be implemented in the backend
            const response = await axios.get('/api/v1/admin/employees/all', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.data.success) {
                setEmployees(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching employees:', error);
            // Mock data for demonstration
            setEmployees([
                {
                    _id: '1',
                    name: 'John Doe',
                    lastName: 'Doe',
                    email: 'john.doe@company.com',
                    employeeCode: 'IT24001',
                    department: 'Information Technology',
                    jobTitle: 'Software Engineer',
                    joiningDate: '2024-01-15',
                    isActive: true
                },
                {
                    _id: '2',
                    name: 'Jane Smith',
                    lastName: 'Smith',
                    email: 'jane.smith@company.com',
                    employeeCode: null,
                    department: 'Human Resources',
                    jobTitle: 'HR Manager',
                    joiningDate: '2024-02-01',
                    isActive: true
                }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchDepartments = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/api/v1/admin/department/all', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.data.success) {
                setDepartments(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching departments:', error);
        }
    };

    const calculateStats = () => {
        const total = employees.length;
        const assigned = employees.filter(emp => emp.employeeCode).length;
        const unassigned = total - assigned;

        setCodeStats({ total, assigned, unassigned });
    };

    const generateEmployeeCode = async (employeeId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `/api/v1/admin/employees/generate-code/${employeeId}`,
                {},
                {
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            );

            if (response.data.success) {
                toast.success('Employee code generated successfully');
                fetchEmployees();
            }
        } catch (error) {
            console.error('Error generating code:', error);
            toast.error('Failed to generate employee code');
        }
    };

    const updateEmployeeCode = async (employeeId, code) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(
                `/api/v1/admin/employees/update-code/${employeeId}`,
                { employeeCode: code },
                {
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            );

            if (response.data.success) {
                toast.success('Employee code updated successfully');
                setEditingEmployee(null);
                setNewCode('');
                fetchEmployees();
            }
        } catch (error) {
            console.error('Error updating code:', error);
            toast.error('Failed to update employee code');
        }
    };

    const handleEdit = (employee) => {
        setEditingEmployee(employee._id);
        setNewCode(employee.employeeCode || '');
    };

    const handleSave = (employeeId) => {
        if (!newCode.trim()) {
            toast.error('Employee code cannot be empty');
            return;
        }
        updateEmployeeCode(employeeId, newCode.trim().toUpperCase());
    };

    const handleCancel = () => {
        setEditingEmployee(null);
        setNewCode('');
    };

    const filteredEmployees = employees.filter(employee => {
        const matchesSearch = 
            employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (employee.employeeCode && employee.employeeCode.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const matchesDepartment = !selectedDepartment || employee.department === selectedDepartment;
        
        return matchesSearch && matchesDepartment;
    });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Employee Code Management</h1>
                    <p className="text-gray-600">Manage and assign employee identification codes</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center">
                        <div className="bg-blue-100 p-3 rounded-full">
                            <Hash className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Employees</p>
                            <p className="text-2xl font-bold text-gray-900">{codeStats.total}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center">
                        <div className="bg-green-100 p-3 rounded-full">
                            <Hash className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Codes Assigned</p>
                            <p className="text-2xl font-bold text-gray-900">{codeStats.assigned}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center">
                        <div className="bg-red-100 p-3 rounded-full">
                            <Hash className="w-6 h-6 text-red-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Unassigned</p>
                            <p className="text-2xl font-bold text-gray-900">{codeStats.unassigned}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search employees..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <select
                            value={selectedDepartment}
                            onChange={(e) => setSelectedDepartment(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">All Departments</option>
                            {departments.map(dept => (
                                <option key={dept._id} value={dept.name}>{dept.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Employee Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800">Employee Codes</h2>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Employee
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Department
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Employee Code
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Joining Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredEmployees.map((employee) => (
                                <tr key={employee._id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                                <span className="text-sm font-medium text-gray-600">
                                                    {employee.name.charAt(0)}{employee.lastName.charAt(0)}
                                                </span>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {employee.name} {employee.lastName}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {employee.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {employee.department}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {editingEmployee === employee._id ? (
                                            <div className="flex items-center space-x-2">
                                                <input
                                                    type="text"
                                                    value={newCode}
                                                    onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                                                    className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    placeholder="Enter code"
                                                />
                                                <button
                                                    onClick={() => handleSave(employee._id)}
                                                    className="text-green-600 hover:text-green-800"
                                                >
                                                    <Save className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={handleCancel}
                                                    className="text-red-600 hover:text-red-800"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center space-x-2">
                                                {employee.employeeCode ? (
                                                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                                        {employee.employeeCode}
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                                                        Not Assigned
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {new Date(employee.joiningDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                            employee.isActive 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            {employee.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        {editingEmployee === employee._id ? null : (
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleEdit(employee)}
                                                    className="text-blue-600 hover:text-blue-800"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                {!employee.employeeCode && (
                                                    <button
                                                        onClick={() => generateEmployeeCode(employee._id)}
                                                        className="text-green-600 hover:text-green-800 text-xs px-2 py-1 border border-green-300 rounded"
                                                    >
                                                        Generate
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredEmployees.length === 0 && (
                    <div className="text-center py-12">
                        <Hash className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No employees found</h3>
                        <p className="text-gray-600">Try adjusting your search or filter criteria</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmployeeCodeManagement;

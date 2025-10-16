import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Users, Building } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const DepartmentManagement = () => {
    const [departments, setDepartments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingDepartment, setEditingDepartment] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        description: '',
        manager: '',
        budget: '',
        location: ''
    });

    useEffect(() => {
        fetchDepartments();
    }, []);

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
            toast.error('Failed to fetch departments');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const token = localStorage.getItem('token');
            const url = editingDepartment 
                ? `/api/v1/admin/department/update/${editingDepartment._id}`
                : '/api/v1/admin/department/create';
            
            const method = editingDepartment ? 'put' : 'post';
            
            const response = await axios[method](url, formData, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.data.success) {
                toast.success(editingDepartment ? 'Department updated successfully' : 'Department created successfully');
                fetchDepartments();
                handleCloseModal();
            }
        } catch (error) {
            console.error('Error saving department:', error);
            toast.error(error.response?.data?.message || 'Failed to save department');
        }
    };

    const handleEdit = (department) => {
        setEditingDepartment(department);
        setFormData({
            name: department.name,
            code: department.code,
            description: department.description || '',
            manager: department.manager?._id || '',
            budget: department.budget || '',
            location: department.location || ''
        });
        setShowModal(true);
    };

    const handleDelete = async (departmentId) => {
        if (!window.confirm('Are you sure you want to delete this department?')) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await axios.delete(`/api/v1/admin/department/delete/${departmentId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.data.success) {
                toast.success('Department deleted successfully');
                fetchDepartments();
            }
        } catch (error) {
            console.error('Error deleting department:', error);
            toast.error(error.response?.data?.message || 'Failed to delete department');
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingDepartment(null);
        setFormData({
            name: '',
            code: '',
            description: '',
            manager: '',
            budget: '',
            location: ''
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Department Management</h1>
                    <p className="text-gray-600">Manage company departments and their details</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add Department</span>
                </button>
            </div>

            {/* Departments Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {departments.map((department) => (
                    <div key={department._id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-3">
                                <div className="bg-blue-100 p-2 rounded-lg">
                                    <Building className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">{department.name}</h3>
                                    <p className="text-sm text-gray-600">Code: {department.code}</p>
                                </div>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleEdit(department)}
                                    className="text-blue-600 hover:text-blue-800"
                                >
                                    <Edit className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(department._id)}
                                    className="text-red-600 hover:text-red-800"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            {department.description && (
                                <p className="text-sm text-gray-600">{department.description}</p>
                            )}
                            
                            <div className="flex items-center space-x-2">
                                <Users className="w-4 h-4 text-gray-400" />
                                <span className="text-sm text-gray-600">
                                    {department.employees?.length || 0} employees
                                </span>
                            </div>

                            {department.manager && (
                                <div className="text-sm">
                                    <span className="text-gray-600">Manager: </span>
                                    <span className="font-medium">
                                        {department.manager.name} {department.manager.lastName}
                                    </span>
                                </div>
                            )}

                            {department.location && (
                                <div className="text-sm">
                                    <span className="text-gray-600">Location: </span>
                                    <span>{department.location}</span>
                                </div>
                            )}

                            {department.budget > 0 && (
                                <div className="text-sm">
                                    <span className="text-gray-600">Budget: </span>
                                    <span className="font-medium">${department.budget.toLocaleString()}</span>
                                </div>
                            )}
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                department.isActive 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                            }`}>
                                {department.isActive ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {departments.length === 0 && (
                <div className="text-center py-12">
                    <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No departments found</h3>
                    <p className="text-gray-600 mb-4">Get started by creating your first department</p>
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        Add Department
                    </button>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                        <h2 className="text-xl font-bold mb-4">
                            {editingDepartment ? 'Edit Department' : 'Add New Department'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Department Name *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Department Code *
                                </label>
                                <input
                                    type="text"
                                    name="code"
                                    value={formData.code}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., IT, HR, FIN"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows="3"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Location
                                </label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Budget
                                </label>
                                <input
                                    type="number"
                                    name="budget"
                                    value={formData.budget}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                >
                                    {editingDepartment ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DepartmentManagement;

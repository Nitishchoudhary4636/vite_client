import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Calendar, MapPin } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../../Shared/LoadingSpinner';
import SkeletonLoader from '../../Shared/SkeletonLoader';
import LoadingButton from '../../Shared/LoadingButton';

const HolidayManagement = () => {
    const [holidays, setHolidays] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingHoliday, setEditingHoliday] = useState(null);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        date: '',
        type: 'Company',
        description: '',
        isRecurring: false
    });

    useEffect(() => {
        fetchHolidays();
    }, [selectedYear]);

    const fetchHolidays = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`/api/v1/admin/holiday/all?year=${selectedYear}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.data.success) {
                setHolidays(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching holidays:', error);
            toast.error('Failed to fetch holidays');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            const token = localStorage.getItem('token');
            const url = editingHoliday 
                ? `/api/v1/admin/holiday/update/${editingHoliday._id}`
                : '/api/v1/admin/holiday/create';
            
            const method = editingHoliday ? 'put' : 'post';
            
            const response = await axios[method](url, formData, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.data.success) {
                toast.success(editingHoliday ? 'Holiday updated successfully' : 'Holiday created successfully');
                fetchHolidays();
                handleCloseModal();
            }
        } catch (error) {
            console.error('Error saving holiday:', error);
            toast.error(error.response?.data?.message || 'Failed to save holiday');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (holiday) => {
        setEditingHoliday(holiday);
        setFormData({
            name: holiday.name,
            date: new Date(holiday.date).toISOString().split('T')[0],
            type: holiday.type,
            description: holiday.description || '',
            isRecurring: holiday.isRecurring
        });
        setShowModal(true);
    };

    const handleDelete = async (holidayId) => {
        if (!window.confirm('Are you sure you want to delete this holiday?')) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await axios.delete(`/api/v1/admin/holiday/delete/${holidayId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.data.success) {
                toast.success('Holiday deleted successfully');
                fetchHolidays();
            }
        } catch (error) {
            console.error('Error deleting holiday:', error);
            toast.error(error.response?.data?.message || 'Failed to delete holiday');
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingHoliday(null);
        setFormData({
            name: '',
            date: '',
            type: 'Company',
            description: '',
            isRecurring: false
        });
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'National': return 'bg-red-100 text-red-800';
            case 'Regional': return 'bg-blue-100 text-blue-800';
            case 'Company': return 'bg-green-100 text-green-800';
            case 'Optional': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
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
                    <h1 className="text-2xl font-bold text-gray-800">Holiday Management</h1>
                    <p className="text-gray-600">Manage company holidays and calendar</p>
                </div>
                <div className="flex items-center space-x-4">
                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {[2023, 2024, 2025, 2026].map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add Holiday</span>
                    </button>
                </div>
            </div>

            {/* Holidays Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {holidays.map((holiday) => (
                    <div key={holiday._id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-3">
                                <div className="bg-blue-100 p-2 rounded-lg">
                                    <Calendar className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">{holiday.name}</h3>
                                    <p className="text-sm text-gray-600">
                                        {new Date(holiday.date).toLocaleDateString('en-US', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleEdit(holiday)}
                                    className="text-blue-600 hover:text-blue-800"
                                >
                                    <Edit className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(holiday._id)}
                                    className="text-red-600 hover:text-red-800"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            {holiday.description && (
                                <p className="text-sm text-gray-600">{holiday.description}</p>
                            )}
                            
                            <div className="flex items-center justify-between">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(holiday.type)}`}>
                                    {holiday.type}
                                </span>
                                {holiday.isRecurring && (
                                    <span className="text-xs text-blue-600 font-medium">Recurring</span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {holidays.length === 0 && (
                <div className="text-center py-12">
                    <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No holidays found</h3>
                    <p className="text-gray-600 mb-4">Get started by adding your first holiday for {selectedYear}</p>
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        Add Holiday
                    </button>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                        <h2 className="text-xl font-bold mb-4">
                            {editingHoliday ? 'Edit Holiday' : 'Add New Holiday'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Holiday Name *
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
                                    Date *
                                </label>
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Type *
                                </label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="National">National</option>
                                    <option value="Regional">Regional</option>
                                    <option value="Company">Company</option>
                                    <option value="Optional">Optional</option>
                                </select>
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

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="isRecurring"
                                    checked={formData.isRecurring}
                                    onChange={handleInputChange}
                                    className="mr-2"
                                />
                                <label className="text-sm text-gray-700">
                                    Recurring holiday (repeats every year)
                                </label>
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
                                    {editingHoliday ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HolidayManagement;

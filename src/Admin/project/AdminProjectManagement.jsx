import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Users, Calendar, User, Search, Filter } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../../Shared/LoadingSpinner';
import SkeletonLoader from '../../Shared/SkeletonLoader';
import LoadingButton from '../../Shared/LoadingButton';

const AdminProjectManagement = () => {
    const [projects, setProjects] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        status: 'Planning',
        priority: 'Medium',
        budget: '',
        managerId: '',
        teamMembers: []
    });

    useEffect(() => {
        fetchProjects();
        fetchEmployees();
    }, []);

    const fetchProjects = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/api/v1/admin/projects/all', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.data.success) {
                setProjects(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching projects:', error);
            // Mock data for demonstration
            setProjects([
                {
                    _id: '1',
                    name: 'Employee Management System',
                    description: 'Complete EMS with advanced features',
                    status: 'In Progress',
                    priority: 'High',
                    startDate: '2024-01-15',
                    endDate: '2024-12-31',
                    budget: 50000,
                    manager: { name: 'John Manager', _id: 'mgr1' },
                    teamMembers: [
                        { name: 'Alice Developer', _id: 'emp1' },
                        { name: 'Bob Designer', _id: 'emp2' }
                    ],
                    progress: 75
                },
                {
                    _id: '2',
                    name: 'Mobile App Development',
                    description: 'React Native mobile application',
                    status: 'Planning',
                    priority: 'Medium',
                    startDate: '2024-11-01',
                    endDate: '2024-12-31',
                    budget: 30000,
                    manager: { name: 'Jane Manager', _id: 'mgr2' },
                    teamMembers: [],
                    progress: 10
                }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchEmployees = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/api/v1/admin/employees/all', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.data.success) {
                setEmployees(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching employees:', error);
            // Mock data
            setEmployees([
                { _id: 'mgr1', name: 'John Manager', role: 'Manager', department: 'IT' },
                { _id: 'mgr2', name: 'Jane Manager', role: 'Manager', department: 'Development' },
                { _id: 'emp1', name: 'Alice Developer', role: 'Developer', department: 'IT' },
                { _id: 'emp2', name: 'Bob Designer', role: 'Designer', department: 'Design' },
                { _id: 'emp3', name: 'Charlie Tester', role: 'QA', department: 'Quality' }
            ]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            const token = localStorage.getItem('token');
            const url = editingProject 
                ? `/api/v1/admin/projects/update/${editingProject._id}`
                : '/api/v1/admin/projects/create';
            
            const method = editingProject ? 'put' : 'post';
            
            const response = await axios[method](url, formData, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.data.success) {
                toast.success(editingProject ? 'Project updated successfully' : 'Project created successfully');
                fetchProjects();
                handleCloseModal();
            }
        } catch (error) {
            console.error('Error saving project:', error);
            toast.error(error.response?.data?.message || 'Failed to save project');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (project) => {
        setEditingProject(project);
        setFormData({
            name: project.name,
            description: project.description,
            startDate: project.startDate,
            endDate: project.endDate,
            status: project.status,
            priority: project.priority,
            budget: project.budget,
            managerId: project.manager?._id || '',
            teamMembers: project.teamMembers?.map(member => member._id) || []
        });
        setShowModal(true);
    };

    const handleDelete = async (projectId) => {
        if (!window.confirm('Are you sure you want to delete this project?')) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await axios.delete(`/api/v1/admin/projects/delete/${projectId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.data.success) {
                toast.success('Project deleted successfully');
                fetchProjects();
            }
        } catch (error) {
            console.error('Error deleting project:', error);
            toast.error(error.response?.data?.message || 'Failed to delete project');
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingProject(null);
        setFormData({
            name: '',
            description: '',
            startDate: '',
            endDate: '',
            status: 'Planning',
            priority: 'Medium',
            budget: '',
            managerId: '',
            teamMembers: []
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleTeamMemberChange = (employeeId) => {
        setFormData(prev => ({
            ...prev,
            teamMembers: prev.teamMembers.includes(employeeId)
                ? prev.teamMembers.filter(id => id !== employeeId)
                : [...prev.teamMembers, employeeId]
        }));
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed': return 'bg-green-100 text-green-800';
            case 'In Progress': return 'bg-blue-100 text-blue-800';
            case 'Planning': return 'bg-yellow-100 text-yellow-800';
            case 'On Hold': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'High': return 'bg-red-100 text-red-800';
            case 'Medium': return 'bg-yellow-100 text-yellow-800';
            case 'Low': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const filteredProjects = projects.filter(project => {
        const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            project.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = !statusFilter || project.status === statusFilter;
        return matchesSearch && matchesStatus;
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
                    <h1 className="text-2xl font-bold text-gray-800">Project Management</h1>
                    <p className="text-gray-600">Create and manage company projects</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    <span>New Project</span>
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search projects..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">All Status</option>
                            <option value="Planning">Planning</option>
                            <option value="In Progress">In Progress</option>
                            <option value="On Hold">On Hold</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {isLoading ? (
                    // Loading skeleton for projects
                    Array.from({ length: 6 }, (_, index) => (
                        <div key={index} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex-1">
                                    <SkeletonLoader type="text" height="h-6" width="w-3/4" />
                                    <div className="mt-2">
                                        <SkeletonLoader type="text" lines={2} height="h-4" />
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <SkeletonLoader type="button" width="w-8" height="h-8" />
                                    <SkeletonLoader type="button" width="w-8" height="h-8" />
                                </div>
                            </div>
                            <div className="flex space-x-2 mb-3">
                                <SkeletonLoader type="text" height="h-6" width="w-20" />
                                <SkeletonLoader type="text" height="h-6" width="w-16" />
                            </div>
                            <div className="mb-4">
                                <SkeletonLoader type="text" height="h-2" width="w-full" />
                            </div>
                            <div className="space-y-2">
                                <SkeletonLoader type="text" height="h-4" />
                                <SkeletonLoader type="text" height="h-4" />
                                <SkeletonLoader type="text" height="h-4" />
                            </div>
                        </div>
                    ))
                ) : (
                    filteredProjects.map((project) => (
                    <div key={project._id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">{project.name}</h3>
                                <p className="text-sm text-gray-600 mb-3">{project.description}</p>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleEdit(project)}
                                    className="text-blue-600 hover:text-blue-800"
                                >
                                    <Edit className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(project._id)}
                                    className="text-red-600 hover:text-red-800"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Status and Priority */}
                        <div className="flex space-x-2 mb-3">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(project.status)}`}>
                                {project.status}
                            </span>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(project.priority)}`}>
                                {project.priority}
                            </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-4">
                            <div className="flex justify-between text-sm text-gray-600 mb-1">
                                <span>Progress</span>
                                <span>{project.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                    className="bg-blue-600 h-2 rounded-full" 
                                    style={{ width: `${project.progress}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Project Details */}
                        <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex items-center">
                                <User className="w-4 h-4 mr-2" />
                                <span>Manager: {project.manager?.name || 'Not assigned'}</span>
                            </div>
                            <div className="flex items-center">
                                <Users className="w-4 h-4 mr-2" />
                                <span>Team: {project.teamMembers?.length || 0} members</span>
                            </div>
                            <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-2" />
                                <span>{new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}</span>
                            </div>
                            {project.budget && (
                                <div className="flex items-center">
                                    <span className="w-4 h-4 mr-2">💰</span>
                                    <span>Budget: ${project.budget.toLocaleString()}</span>
                                </div>
                            )}
                        </div>
                    </div>
                    ))
                )}
            </div>

            {filteredProjects.length === 0 && (
                <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Plus className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
                    <p className="text-gray-600 mb-4">Get started by creating your first project</p>
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        Create Project
                    </button>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4">
                            {editingProject ? 'Edit Project' : 'Create New Project'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Project Name *
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
                                        Project Manager
                                    </label>
                                    <select
                                        name="managerId"
                                        value={formData.managerId}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Select Manager</option>
                                        {employees.filter(emp => emp.role === 'Manager').map(manager => (
                                            <option key={manager._id} value={manager._id}>
                                                {manager.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
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

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Start Date *
                                    </label>
                                    <input
                                        type="date"
                                        name="startDate"
                                        value={formData.startDate}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        End Date *
                                    </label>
                                    <input
                                        type="date"
                                        name="endDate"
                                        value={formData.endDate}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Status
                                    </label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="Planning">Planning</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="On Hold">On Hold</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Priority
                                    </label>
                                    <select
                                        name="priority"
                                        value={formData.priority}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Budget ($)
                                    </label>
                                    <input
                                        type="number"
                                        name="budget"
                                        value={formData.budget}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            {/* Team Members Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Team Members
                                </label>
                                <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-3">
                                    {employees.filter(emp => emp.role !== 'Manager').map(employee => (
                                        <label key={employee._id} className="flex items-center space-x-2 mb-2">
                                            <input
                                                type="checkbox"
                                                checked={formData.teamMembers.includes(employee._id)}
                                                onChange={() => handleTeamMemberChange(employee._id)}
                                                className="rounded"
                                            />
                                            <span className="text-sm">{employee.name} - {employee.role}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <LoadingButton
                                    type="submit"
                                    loading={isSubmitting}
                                    loadingText={editingProject ? 'Updating...' : 'Creating...'}
                                    variant="primary"
                                >
                                    {editingProject ? 'Update' : 'Create'}
                                </LoadingButton>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProjectManagement;

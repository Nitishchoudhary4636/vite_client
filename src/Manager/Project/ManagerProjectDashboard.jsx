import React, { useState, useEffect } from 'react';
import { Plus, Users, Calendar, CheckCircle, Clock, UserPlus, Settings } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useSelector } from 'react-redux';

const ManagerProjectDashboard = () => {
    const [projects, setProjects] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedEmployees, setSelectedEmployees] = useState([]);
    
    const user = useSelector((state) => state.auth.user);

    useEffect(() => {
        fetchManagerProjects();
        fetchAvailableEmployees();
    }, []);

    const fetchManagerProjects = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/api/v1/manager/projects/my-projects', {
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
                    progress: 75,
                    teamMembers: [
                        { _id: 'emp1', name: 'Alice Developer', role: 'Developer', status: 'Active' },
                        { _id: 'emp2', name: 'Bob Designer', role: 'Designer', status: 'Active' }
                    ],
                    tasks: [
                        { _id: 'task1', title: 'Database Design', status: 'Completed', assignee: 'Alice Developer' },
                        { _id: 'task2', title: 'UI Design', status: 'In Progress', assignee: 'Bob Designer' },
                        { _id: 'task3', title: 'API Development', status: 'Pending', assignee: 'Alice Developer' }
                    ]
                },
                {
                    _id: '2',
                    name: 'Mobile App Development',
                    description: 'React Native mobile application',
                    status: 'Planning',
                    priority: 'Medium',
                    startDate: '2024-11-01',
                    endDate: '2024-12-31',
                    progress: 10,
                    teamMembers: [],
                    tasks: []
                }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchAvailableEmployees = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/api/v1/manager/employees/available', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.data.success) {
                setEmployees(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching employees:', error);
            // Mock data
            setEmployees([
                { _id: 'emp3', name: 'Charlie Tester', role: 'QA Engineer', department: 'Quality', available: true },
                { _id: 'emp4', name: 'Diana Frontend', role: 'Frontend Developer', department: 'Development', available: true },
                { _id: 'emp5', name: 'Eve Backend', role: 'Backend Developer', department: 'Development', available: true },
                { _id: 'emp6', name: 'Frank DevOps', role: 'DevOps Engineer', department: 'Infrastructure', available: true }
            ]);
        }
    };

    const addEmployeesToProject = async () => {
        if (selectedEmployees.length === 0) {
            toast.error('Please select at least one employee');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `/api/v1/manager/projects/${selectedProject._id}/add-employees`,
                { employeeIds: selectedEmployees },
                {
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            );

            if (response.data.success) {
                toast.success('Employees added to project successfully');
                fetchManagerProjects();
                setShowAddEmployeeModal(false);
                setSelectedEmployees([]);
            }
        } catch (error) {
            console.error('Error adding employees:', error);
            toast.error('Failed to add employees to project');
        }
    };

    const removeEmployeeFromProject = async (projectId, employeeId) => {
        if (!window.confirm('Are you sure you want to remove this employee from the project?')) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await axios.delete(
                `/api/v1/manager/projects/${projectId}/remove-employee/${employeeId}`,
                {
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            );

            if (response.data.success) {
                toast.success('Employee removed from project');
                fetchManagerProjects();
            }
        } catch (error) {
            console.error('Error removing employee:', error);
            toast.error('Failed to remove employee from project');
        }
    };

    const updateProjectProgress = async (projectId, newProgress) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(
                `/api/v1/manager/projects/${projectId}/progress`,
                { progress: newProgress },
                {
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            );

            if (response.data.success) {
                toast.success('Project progress updated');
                fetchManagerProjects();
            }
        } catch (error) {
            console.error('Error updating progress:', error);
            toast.error('Failed to update project progress');
        }
    };

    const handleEmployeeSelection = (employeeId) => {
        setSelectedEmployees(prev => 
            prev.includes(employeeId)
                ? prev.filter(id => id !== employeeId)
                : [...prev, employeeId]
        );
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
                    <h1 className="text-2xl font-bold text-gray-800">My Projects</h1>
                    <p className="text-gray-600">Manage your assigned projects and team members</p>
                </div>
                <div className="text-sm text-gray-600">
                    Manager: <span className="font-medium">{user?.name}</span>
                </div>
            </div>

            {/* Projects Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center">
                        <div className="bg-blue-100 p-3 rounded-full">
                            <Calendar className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Projects</p>
                            <p className="text-2xl font-bold text-gray-900">{projects.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center">
                        <div className="bg-green-100 p-3 rounded-full">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Active Projects</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {projects.filter(p => p.status === 'In Progress').length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center">
                        <div className="bg-purple-100 p-3 rounded-full">
                            <Users className="w-6 h-6 text-purple-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Team Members</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {projects.reduce((acc, p) => acc + (p.teamMembers?.length || 0), 0)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Projects List */}
            <div className="space-y-6">
                {projects.map((project) => (
                    <div key={project._id} className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                    <h3 className="text-xl font-semibold text-gray-800">{project.name}</h3>
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(project.status)}`}>
                                        {project.status}
                                    </span>
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(project.priority)}`}>
                                        {project.priority}
                                    </span>
                                </div>
                                <p className="text-gray-600 mb-3">{project.description}</p>
                            </div>
                            <button
                                onClick={() => {
                                    setSelectedProject(project);
                                    setShowAddEmployeeModal(true);
                                }}
                                className="flex items-center space-x-2 bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                <UserPlus className="w-4 h-4" />
                                <span>Add Employee</span>
                            </button>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-4">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-gray-600">Progress</span>
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm text-gray-600">{project.progress}%</span>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={project.progress}
                                        onChange={(e) => updateProjectProgress(project._id, parseInt(e.target.value))}
                                        className="w-20"
                                    />
                                </div>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                    className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                                    style={{ width: `${project.progress}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Project Timeline */}
                        <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600">
                            <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                <span>Start: {new Date(project.startDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                <span>End: {new Date(project.endDate).toLocaleDateString()}</span>
                            </div>
                        </div>

                        {/* Team Members */}
                        <div className="border-t pt-4">
                            <h4 className="font-medium text-gray-800 mb-3">Team Members ({project.teamMembers?.length || 0})</h4>
                            {project.teamMembers && project.teamMembers.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {project.teamMembers.map((member) => (
                                        <div key={member._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                                    {member.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-800">{member.name}</p>
                                                    <p className="text-xs text-gray-600">{member.role}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => removeEmployeeFromProject(project._id, member._id)}
                                                className="text-red-600 hover:text-red-800 text-sm"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <Users className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                                    <p>No team members assigned yet</p>
                                    <button
                                        onClick={() => {
                                            setSelectedProject(project);
                                            setShowAddEmployeeModal(true);
                                        }}
                                        className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
                                    >
                                        Add team members
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {projects.length === 0 && (
                <div className="text-center py-12">
                    <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No projects assigned</h3>
                    <p className="text-gray-600">You don't have any projects assigned yet. Contact your admin to get started.</p>
                </div>
            )}

            {/* Add Employee Modal */}
            {showAddEmployeeModal && selectedProject && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4">
                            Add Employees to {selectedProject.name}
                        </h2>

                        <div className="mb-4">
                            <p className="text-sm text-gray-600">
                                Select employees to add to this project. You can select multiple employees.
                            </p>
                        </div>

                        <div className="space-y-3 mb-6">
                            {employees.filter(emp => 
                                !selectedProject.teamMembers?.some(member => member._id === emp._id)
                            ).map((employee) => (
                                <label key={employee._id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedEmployees.includes(employee._id)}
                                        onChange={() => handleEmployeeSelection(employee._id)}
                                        className="rounded"
                                    />
                                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                                        {employee.name.charAt(0)}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-800">{employee.name}</p>
                                        <p className="text-sm text-gray-600">{employee.role} - {employee.department}</p>
                                    </div>
                                    {employee.available && (
                                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                            Available
                                        </span>
                                    )}
                                </label>
                            ))}
                        </div>

                        {employees.filter(emp => 
                            !selectedProject.teamMembers?.some(member => member._id === emp._id)
                        ).length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                <Users className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                                <p>No available employees to add</p>
                            </div>
                        )}

                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => {
                                    setShowAddEmployeeModal(false);
                                    setSelectedEmployees([]);
                                }}
                                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={addEmployeesToProject}
                                disabled={selectedEmployees.length === 0}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Add {selectedEmployees.length} Employee{selectedEmployees.length !== 1 ? 's' : ''}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManagerProjectDashboard;

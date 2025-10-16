import React, { useState, useEffect } from 'react';
import { Folder, Clock, CheckCircle, AlertCircle, Plus, Calendar } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const EmployeeProjectDashboard = () => {
    const [projects, setProjects] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({
        totalProjects: 0,
        activeTasks: 0,
        completedTasks: 0,
        overdueTasks: 0
    });
    const navigate = useNavigate();

    useEffect(() => {
        fetchProjects();
        fetchTasks();
    }, []);

    const fetchProjects = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/api/v1/employee/projects', {
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
                    deadline: '2024-12-31',
                    progress: 75,
                    tasks: 12,
                    completedTasks: 9
                },
                {
                    _id: '2',
                    name: 'Mobile App Development',
                    description: 'React Native mobile application',
                    status: 'Planning',
                    deadline: '2024-11-30',
                    progress: 25,
                    tasks: 8,
                    completedTasks: 2
                }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchTasks = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/api/v1/both/project-task/my-tasks', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.data.success) {
                setTasks(response.data.data);
                calculateStats(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching tasks:', error);
            // Mock data for demonstration
            const mockTasks = [
                {
                    _id: '1',
                    taskDescription: 'Implement user authentication',
                    status: 'Completed',
                    date: '2024-10-10',
                    project: { name: 'EMS Project' }
                },
                {
                    _id: '2',
                    taskDescription: 'Design database schema',
                    status: 'In Progress',
                    date: '2024-10-15',
                    project: { name: 'EMS Project' }
                },
                {
                    _id: '3',
                    taskDescription: 'Create API endpoints',
                    status: 'Not Started',
                    date: '2024-10-20',
                    project: { name: 'Mobile App' }
                }
            ];
            setTasks(mockTasks);
            calculateStats(mockTasks);
        }
    };

    const calculateStats = (taskList) => {
        const totalProjects = projects.length;
        const activeTasks = taskList.filter(t => t.status === 'In Progress').length;
        const completedTasks = taskList.filter(t => t.status === 'Completed').length;
        const overdueTasks = taskList.filter(t => {
            const taskDate = new Date(t.date);
            const today = new Date();
            return taskDate < today && t.status !== 'Completed';
        }).length;

        setStats({
            totalProjects,
            activeTasks,
            completedTasks,
            overdueTasks
        });
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

    const getTaskStatusColor = (status) => {
        switch (status) {
            case 'Completed': return 'bg-green-100 text-green-800';
            case 'In Progress': return 'bg-blue-100 text-blue-800';
            case 'Not Started': return 'bg-gray-100 text-gray-800';
            case 'On Hold': return 'bg-red-100 text-red-800';
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
                    <p className="text-gray-600">Track your projects and tasks</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center">
                        <div className="bg-blue-100 p-3 rounded-full">
                            <Folder className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Projects</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalProjects}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center">
                        <div className="bg-yellow-100 p-3 rounded-full">
                            <Clock className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Active Tasks</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.activeTasks}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center">
                        <div className="bg-green-100 p-3 rounded-full">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Completed</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.completedTasks}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center">
                        <div className="bg-red-100 p-3 rounded-full">
                            <AlertCircle className="w-6 h-6 text-red-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Overdue</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.overdueTasks}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Projects */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-gray-800">My Projects</h2>
                        <button
                            onClick={() => navigate('/employee/projects')}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                            View All
                        </button>
                    </div>

                    <div className="space-y-4">
                        {projects.slice(0, 3).map((project) => (
                            <div key={project._id} className="border border-gray-200 rounded-lg p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-medium text-gray-800">{project.name}</h3>
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(project.status)}`}>
                                        {project.status}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 mb-3">{project.description}</p>
                                
                                {/* Progress Bar */}
                                <div className="mb-3">
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

                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Tasks: {project.completedTasks}/{project.tasks}</span>
                                    <span>Due: {new Date(project.deadline).toLocaleDateString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Tasks */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-gray-800">Recent Tasks</h2>
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                            View All
                        </button>
                    </div>

                    <div className="space-y-4">
                        {tasks.slice(0, 5).map((task) => (
                            <div key={task._id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                                <div className="flex-1">
                                    <h4 className="font-medium text-gray-800 text-sm">{task.taskDescription}</h4>
                                    <div className="flex items-center space-x-2 mt-1">
                                        <span className="text-xs text-gray-500">{task.project?.name}</span>
                                        <span className="text-xs text-gray-400">•</span>
                                        <div className="flex items-center text-xs text-gray-500">
                                            <Calendar className="w-3 h-3 mr-1" />
                                            {new Date(task.date).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTaskStatusColor(task.status)}`}>
                                    {task.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                        onClick={() => navigate('/employee/projects')}
                        className="flex items-center justify-center space-x-2 bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        <Folder className="w-5 h-5" />
                        <span>View All Projects</span>
                    </button>
                    
                    <button
                        onClick={() => navigate('/employee/tasks')}
                        className="flex items-center justify-center space-x-2 bg-green-500 text-white px-4 py-3 rounded-lg hover:bg-green-600 transition-colors"
                    >
                        <CheckCircle className="w-5 h-5" />
                        <span>My Tasks</span>
                    </button>
                    
                    <button
                        onClick={() => navigate('/employee/timesheet')}
                        className="flex items-center justify-center space-x-2 bg-purple-500 text-white px-4 py-3 rounded-lg hover:bg-purple-600 transition-colors"
                    >
                        <Clock className="w-5 h-5" />
                        <span>Time Tracking</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EmployeeProjectDashboard;

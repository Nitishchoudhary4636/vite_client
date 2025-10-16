import React, { useState, useEffect } from 'react';
import { Camera, MapPin, Clock, Calendar, Users, CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import EnhancedClockInOut from './EnhancedClockInOut';

const EnhancedAttendanceDashboard = () => {
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [stats, setStats] = useState({
        totalPresent: 0,
        totalAbsent: 0,
        totalLate: 0,
        averageHours: 0
    });

    useEffect(() => {
        fetchAttendanceData();
    }, [selectedDate]);

    const fetchAttendanceData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `/api/v1/both/enhanced-attendance/details?date=${selectedDate}`,
                {
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            );

            if (response.data.success) {
                setAttendanceRecords(response.data.data);
                calculateStats(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching attendance:', error);
            toast.error('Failed to fetch attendance data');
        } finally {
            setIsLoading(false);
        }
    };

    const calculateStats = (records) => {
        const totalRecords = records.length;
        const presentRecords = records.filter(r => r.status === 'present');
        const lateRecords = records.filter(r => r.isLateArrival);
        const totalHours = records.reduce((sum, r) => sum + (r.effectiveHours || 0), 0);

        setStats({
            totalPresent: presentRecords.length,
            totalAbsent: totalRecords - presentRecords.length,
            totalLate: lateRecords.length,
            averageHours: totalRecords > 0 ? (totalHours / totalRecords).toFixed(2) : 0
        });
    };

    const handleAttendanceUpdate = (newRecord) => {
        setAttendanceRecords(prev => {
            const updated = prev.filter(r => r._id !== newRecord._id);
            return [...updated, newRecord];
        });
        fetchAttendanceData(); // Refresh data
    };

    const formatTime = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
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
                    <h1 className="text-2xl font-bold text-gray-800">Enhanced Attendance</h1>
                    <p className="text-gray-600">Track attendance with photos and location</p>
                </div>
                <div className="flex items-center space-x-4">
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center">
                        <div className="bg-green-100 p-3 rounded-full">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Present</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalPresent}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center">
                        <div className="bg-red-100 p-3 rounded-full">
                            <XCircle className="w-6 h-6 text-red-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Absent</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalAbsent}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center">
                        <div className="bg-yellow-100 p-3 rounded-full">
                            <Clock className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Late Arrivals</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalLate}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center">
                        <div className="bg-blue-100 p-3 rounded-full">
                            <Users className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Avg Hours</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.averageHours}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Clock In/Out Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Clock In/Out</h2>
                <EnhancedClockInOut onAttendanceUpdate={handleAttendanceUpdate} />
            </div>

            {/* Attendance Records */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    Attendance Records - {formatDate(selectedDate)}
                </h2>

                {attendanceRecords.length === 0 ? (
                    <div className="text-center py-8">
                        <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No attendance records found for this date</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Employee
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Clock In
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Clock Out
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Hours
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Location
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Photos
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {attendanceRecords.map((record) => (
                                    <tr key={record._id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {record.userId?.name || 'Unknown'}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {record.userId?.employeeCode || 'N/A'}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <div className="flex items-center">
                                                <Clock className="w-4 h-4 text-gray-400 mr-2" />
                                                {formatTime(record.clockIn)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <div className="flex items-center">
                                                <Clock className="w-4 h-4 text-gray-400 mr-2" />
                                                {formatTime(record.clockOut)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {record.effectiveHours ? `${record.effectiveHours.toFixed(2)}h` : '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {record.clockInLocation && (
                                                <div className="flex items-center">
                                                    <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                                                    <span className="truncate max-w-xs">
                                                        {record.clockInLocation.address || 'Location tracked'}
                                                    </span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-col space-y-1">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                    record.status === 'present' 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {record.status}
                                                </span>
                                                {record.isLateArrival && (
                                                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                                        Late
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <div className="flex space-x-2">
                                                {record.clockInImage && (
                                                    <button
                                                        onClick={() => window.open(`/api/v1/both/enhanced-attendance/photo/${record._id}/clockin`, '_blank')}
                                                        className="flex items-center text-blue-600 hover:text-blue-800"
                                                    >
                                                        <Camera className="w-4 h-4 mr-1" />
                                                        In
                                                    </button>
                                                )}
                                                {record.clockOutImage && (
                                                    <button
                                                        onClick={() => window.open(`/api/v1/both/enhanced-attendance/photo/${record._id}/clockout`, '_blank')}
                                                        className="flex items-center text-blue-600 hover:text-blue-800"
                                                    >
                                                        <Camera className="w-4 h-4 mr-1" />
                                                        Out
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EnhancedAttendanceDashboard;

import React, { useState, useRef, useEffect } from 'react';
import { Camera, MapPin, Clock, Wifi, Monitor, Smartphone } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const EnhancedClockInOut = ({ onAttendanceUpdate }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [location, setLocation] = useState(null);
    const [locationError, setLocationError] = useState(null);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [todayAttendance, setTodayAttendance] = useState(null);
    const [capturedImage, setCapturedImage] = useState(null);
    const [showCamera, setShowCamera] = useState(false);
    
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const fileInputRef = useRef(null);

    // Update current time every second
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Get user location
    useEffect(() => {
        getCurrentLocation();
        fetchTodayAttendance();
    }, []);

    const getCurrentLocation = () => {
        if (!navigator.geolocation) {
            setLocationError('Geolocation is not supported by this browser');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude, accuracy } = position.coords;
                
                try {
                    // Reverse geocoding to get address
                    const response = await fetch(
                        `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=YOUR_API_KEY`
                    );
                    const data = await response.json();
                    const address = data.results[0]?.formatted || 'Address not found';
                    
                    setLocation({
                        latitude,
                        longitude,
                        accuracy,
                        address
                    });
                } catch (error) {
                    setLocation({
                        latitude,
                        longitude,
                        accuracy,
                        address: 'Address lookup failed'
                    });
                }
            },
            (error) => {
                setLocationError(`Location error: ${error.message}`);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000 // 5 minutes
            }
        );
    };

    const fetchTodayAttendance = async () => {
        try {
            const token = localStorage.getItem('token');
            const today = new Date().toISOString().split('T')[0];
            
            const response = await axios.get(
                `/api/v1/both/enhanced-attendance/details?date=${today}`,
                {
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            );

            if (response.data.success && response.data.data.length > 0) {
                setTodayAttendance(response.data.data[0]);
            }
        } catch (error) {
            console.error('Error fetching attendance:', error);
        }
    };

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user' }
            });
            videoRef.current.srcObject = stream;
            setShowCamera(true);
        } catch (error) {
            toast.error('Unable to access camera');
            console.error('Camera error:', error);
        }
    };

    const capturePhoto = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);

        canvas.toBlob((blob) => {
            setCapturedImage(blob);
            setShowCamera(false);
            
            // Stop camera stream
            const stream = video.srcObject;
            const tracks = stream.getTracks();
            tracks.forEach(track => track.stop());
        }, 'image/jpeg', 0.8);
    };

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            setCapturedImage(file);
        }
    };

    const getDeviceInfo = () => {
        const userAgent = navigator.userAgent;
        let deviceType = 'Unknown';
        
        if (/Mobile|Android|iPhone|iPad/.test(userAgent)) {
            deviceType = 'Mobile';
        } else if (/Tablet/.test(userAgent)) {
            deviceType = 'Tablet';
        } else {
            deviceType = 'Desktop';
        }

        return {
            userAgent,
            deviceType,
            ipAddress: 'Client-side IP detection requires external service'
        };
    };

    const handleClockIn = async () => {
        if (!location) {
            toast.error('Location is required for clock in');
            return;
        }

        if (!capturedImage) {
            toast.error('Photo is required for clock in');
            return;
        }

        setIsLoading(true);

        try {
            const formData = new FormData();
            formData.append('attendancePhoto', capturedImage);
            formData.append('latitude', location.latitude);
            formData.append('longitude', location.longitude);
            formData.append('address', location.address);
            formData.append('accuracy', location.accuracy);
            formData.append('workLocation', 'office'); // or get from user selection
            
            const deviceInfo = getDeviceInfo();
            formData.append('userAgent', deviceInfo.userAgent);
            formData.append('deviceType', deviceInfo.deviceType);
            formData.append('ipAddress', deviceInfo.ipAddress);

            const token = localStorage.getItem('token');
            const response = await axios.post(
                '/api/v1/both/enhanced-attendance/clock-in',
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            if (response.data.success) {
                toast.success('Clocked in successfully!');
                setTodayAttendance(response.data.data);
                setCapturedImage(null);
                onAttendanceUpdate && onAttendanceUpdate(response.data.data);
            }
        } catch (error) {
            console.error('Clock in error:', error);
            toast.error(error.response?.data?.message || 'Failed to clock in');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClockOut = async () => {
        if (!location) {
            toast.error('Location is required for clock out');
            return;
        }

        if (!capturedImage) {
            toast.error('Photo is required for clock out');
            return;
        }

        setIsLoading(true);

        try {
            const formData = new FormData();
            formData.append('attendancePhoto', capturedImage);
            formData.append('latitude', location.latitude);
            formData.append('longitude', location.longitude);
            formData.append('address', location.address);
            formData.append('accuracy', location.accuracy);
            
            const deviceInfo = getDeviceInfo();
            formData.append('userAgent', deviceInfo.userAgent);
            formData.append('deviceType', deviceInfo.deviceType);
            formData.append('ipAddress', deviceInfo.ipAddress);

            const token = localStorage.getItem('token');
            const response = await axios.post(
                '/api/v1/both/enhanced-attendance/clock-out',
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            if (response.data.success) {
                toast.success('Clocked out successfully!');
                setTodayAttendance(response.data.data);
                setCapturedImage(null);
                onAttendanceUpdate && onAttendanceUpdate(response.data.data);
            }
        } catch (error) {
            console.error('Clock out error:', error);
            toast.error(error.response?.data?.message || 'Failed to clock out');
        } finally {
            setIsLoading(false);
        }
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', {
            hour12: true,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    const canClockIn = !todayAttendance?.clockIn;
    const canClockOut = todayAttendance?.clockIn && !todayAttendance?.clockOut;

    return (
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
            {/* Current Time */}
            <div className="text-center mb-6">
                <div className="flex items-center justify-center mb-2">
                    <Clock className="w-6 h-6 text-blue-500 mr-2" />
                    <h2 className="text-xl font-semibold">Attendance</h2>
                </div>
                <div className="text-3xl font-bold text-gray-800">
                    {formatTime(currentTime)}
                </div>
                <div className="text-sm text-gray-600">
                    {currentTime.toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
                </div>
            </div>

            {/* Location Status */}
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center mb-2">
                    <MapPin className="w-4 h-4 text-green-500 mr-2" />
                    <span className="text-sm font-medium">Location Status</span>
                </div>
                {location ? (
                    <div className="text-xs text-gray-600">
                        <p>{location.address}</p>
                        <p>Accuracy: ±{Math.round(location.accuracy)}m</p>
                    </div>
                ) : locationError ? (
                    <p className="text-xs text-red-600">{locationError}</p>
                ) : (
                    <p className="text-xs text-gray-600">Getting location...</p>
                )}
            </div>

            {/* Today's Attendance Status */}
            {todayAttendance && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <h3 className="text-sm font-medium mb-2">Today's Status</h3>
                    <div className="text-xs space-y-1">
                        {todayAttendance.clockIn && (
                            <p>Clock In: {new Date(todayAttendance.clockIn).toLocaleTimeString()}</p>
                        )}
                        {todayAttendance.clockOut && (
                            <p>Clock Out: {new Date(todayAttendance.clockOut).toLocaleTimeString()}</p>
                        )}
                        {todayAttendance.effectiveHours > 0 && (
                            <p>Hours Worked: {todayAttendance.effectiveHours.toFixed(2)}</p>
                        )}
                    </div>
                </div>
            )}

            {/* Camera Section */}
            {showCamera ? (
                <div className="mb-4">
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="w-full rounded-lg"
                    />
                    <div className="flex justify-center mt-2 space-x-2">
                        <button
                            onClick={capturePhoto}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                            Capture
                        </button>
                        <button
                            onClick={() => setShowCamera(false)}
                            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ) : capturedImage ? (
                <div className="mb-4">
                    <img
                        src={URL.createObjectURL(capturedImage)}
                        alt="Captured"
                        className="w-full rounded-lg"
                    />
                    <button
                        onClick={() => setCapturedImage(null)}
                        className="mt-2 text-sm text-red-600 hover:text-red-800"
                    >
                        Remove Photo
                    </button>
                </div>
            ) : (
                <div className="mb-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 mb-2">Photo required for attendance</p>
                        <div className="space-x-2">
                            <button
                                onClick={startCamera}
                                className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                            >
                                Take Photo
                            </button>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                            >
                                Upload Photo
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
                {canClockIn && (
                    <button
                        onClick={handleClockIn}
                        disabled={isLoading || !location || !capturedImage}
                        className="w-full py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Clocking In...' : 'Clock In'}
                    </button>
                )}

                {canClockOut && (
                    <button
                        onClick={handleClockOut}
                        disabled={isLoading || !location || !capturedImage}
                        className="w-full py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Clocking Out...' : 'Clock Out'}
                    </button>
                )}

                {!canClockIn && !canClockOut && (
                    <div className="text-center py-3 text-gray-600">
                        You have completed attendance for today
                    </div>
                )}
            </div>

            {/* Hidden Elements */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
            />
            <canvas ref={canvasRef} className="hidden" />
            <video ref={videoRef} className="hidden" />
        </div>
    );
};

export default EnhancedClockInOut;

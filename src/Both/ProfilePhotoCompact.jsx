import React, { useState, useRef } from 'react';
import { Camera, Upload, User, Edit } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const ProfilePhotoCompact = ({ currentPhoto, employeeId, onPhotoUpdate, size = 'md' }) => {
    const [isUploading, setIsUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(currentPhoto);
    const [showUploadOptions, setShowUploadOptions] = useState(false);
    const fileInputRef = useRef(null);
    const cameraInputRef = useRef(null);

    // Size configurations
    const sizeClasses = {
        sm: 'w-12 h-12',
        md: 'w-16 h-16 md:w-20 md:h-20',
        lg: 'w-24 h-24 md:w-32 md:h-32'
    };

    const handleFileSelect = async (file) => {
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file');
            return;
        }

        // Validate file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('File size must be less than 5MB');
            return;
        }

        setIsUploading(true);
        setShowUploadOptions(false);

        try {
            const formData = new FormData();
            formData.append('profilePhoto', file);

            const token = localStorage.getItem('token');
            const response = await axios.post(
                '/api/v1/both/profile-photo/upload',
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            if (response.data.success) {
                const newPhotoUrl = `/api/v1/both/profile-photo/${employeeId}?t=${Date.now()}`;
                setPreviewUrl(newPhotoUrl);
                onPhotoUpdate && onPhotoUpdate(newPhotoUrl);
                toast.success('Profile photo updated successfully');
            }
        } catch (error) {
            console.error('Upload error:', error);
            toast.error(error.response?.data?.message || 'Failed to upload photo');
        } finally {
            setIsUploading(false);
        }
    };

    const handleFileInputChange = (event) => {
        const file = event.target.files[0];
        handleFileSelect(file);
    };

    const handleCameraCapture = (event) => {
        const file = event.target.files[0];
        handleFileSelect(file);
    };

    return (
        <div className="relative group">
            {/* Profile Photo Display */}
            <div className={`${sizeClasses[size]} rounded-full overflow-hidden bg-gray-200 border-2 border-white shadow-lg relative`}>
                {previewUrl ? (
                    <img
                        src={previewUrl}
                        alt="Profile"
                        className="w-full h-full object-cover"
                        onError={() => setPreviewUrl(null)}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <User className="w-1/2 h-1/2 text-gray-400" />
                    </div>
                )}

                {/* Upload Overlay - Shows on Hover */}
                {!isUploading && (
                    <div 
                        className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        onClick={() => setShowUploadOptions(!showUploadOptions)}
                    >
                        <Edit className="w-4 h-4 text-white" />
                    </div>
                )}

                {/* Loading Overlay */}
                {isUploading && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    </div>
                )}
            </div>

            {/* Upload Options Dropdown */}
            {showUploadOptions && !isUploading && (
                <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50 min-w-max">
                    <div className="p-2">
                        <button
                            onClick={() => {
                                fileInputRef.current?.click();
                                setShowUploadOptions(false);
                            }}
                            className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                        >
                            <Upload className="w-4 h-4" />
                            <span>Upload Photo</span>
                        </button>
                        <button
                            onClick={() => {
                                cameraInputRef.current?.click();
                                setShowUploadOptions(false);
                            }}
                            className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                        >
                            <Camera className="w-4 h-4" />
                            <span>Take Photo</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Hidden File Inputs */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                className="hidden"
            />
            <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="user"
                onChange={handleCameraCapture}
                className="hidden"
            />

            {/* Click Outside to Close */}
            {showUploadOptions && (
                <div 
                    className="fixed inset-0 z-40"
                    onClick={() => setShowUploadOptions(false)}
                />
            )}
        </div>
    );
};

export default ProfilePhotoCompact;

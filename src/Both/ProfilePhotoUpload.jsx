import React, { useState, useRef } from 'react';
import { Camera, Upload, X, User } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const ProfilePhotoUpload = ({ currentPhoto, employeeId, onPhotoUpdate }) => {
    const [isUploading, setIsUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(currentPhoto);
    const fileInputRef = useRef(null);
    const cameraInputRef = useRef(null);

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

    const handleDeletePhoto = async () => {
        if (!window.confirm('Are you sure you want to delete your profile photo?')) {
            return;
        }

        setIsUploading(true);

        try {
            const token = localStorage.getItem('token');
            const response = await axios.delete('/api/v1/both/profile-photo/delete', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.success) {
                setPreviewUrl(null);
                onPhotoUpdate && onPhotoUpdate(null);
                toast.success('Profile photo deleted successfully');
            }
        } catch (error) {
            console.error('Delete error:', error);
            toast.error(error.response?.data?.message || 'Failed to delete photo');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="flex flex-col items-center space-y-4">
            {/* Photo Display */}
            <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 border-4 border-white shadow-lg">
                    {previewUrl ? (
                        <img
                            src={previewUrl}
                            alt="Profile"
                            className="w-full h-full object-cover"
                            onError={() => setPreviewUrl(null)}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                            <User className="w-16 h-16 text-gray-400" />
                        </div>
                    )}
                </div>

                {/* Delete Button */}
                {previewUrl && !isUploading && (
                    <button
                        onClick={handleDeletePhoto}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        title="Delete photo"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Upload Buttons */}
            <div className="flex space-x-3">
                {/* File Upload */}
                <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <Upload className="w-4 h-4" />
                    <span>{isUploading ? 'Uploading...' : 'Upload Photo'}</span>
                </button>

                {/* Camera Capture */}
                <button
                    onClick={() => cameraInputRef.current?.click()}
                    disabled={isUploading}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <Camera className="w-4 h-4" />
                    <span>Take Photo</span>
                </button>
            </div>

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

            {/* Upload Progress */}
            {isUploading && (
                <div className="w-full max-w-xs">
                    <div className="bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full animate-pulse"></div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1 text-center">Uploading...</p>
                </div>
            )}

            {/* Guidelines */}
            <div className="text-xs text-gray-500 text-center max-w-xs">
                <p>• Maximum file size: 5MB</p>
                <p>• Supported formats: JPG, PNG, GIF</p>
                <p>• Recommended: Square image for best results</p>
            </div>
        </div>
    );
};

export default ProfilePhotoUpload;

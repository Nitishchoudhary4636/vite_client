import React from 'react';

const LoadingSpinner = ({ 
    size = 'md', 
    color = 'blue', 
    text = '', 
    fullScreen = false,
    overlay = false 
}) => {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
        xl: 'w-16 h-16'
    };

    const colorClasses = {
        blue: 'border-blue-500',
        green: 'border-green-500',
        red: 'border-red-500',
        purple: 'border-purple-500',
        gray: 'border-gray-500',
        white: 'border-white'
    };

    const spinnerElement = (
        <div className="flex flex-col items-center justify-center space-y-3">
            <div 
                className={`${sizeClasses[size]} ${colorClasses[color]} border-2 border-t-transparent rounded-full animate-spin`}
            ></div>
            {text && (
                <p className="text-sm text-gray-600 font-medium animate-pulse">
                    {text}
                </p>
            )}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
                {spinnerElement}
            </div>
        );
    }

    if (overlay) {
        return (
            <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
                {spinnerElement}
            </div>
        );
    }

    return spinnerElement;
};

export default LoadingSpinner;

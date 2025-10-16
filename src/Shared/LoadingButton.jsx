import React from 'react';
import LoadingSpinner from './LoadingSpinner';

const LoadingButton = ({
    children,
    loading = false,
    disabled = false,
    onClick,
    type = 'button',
    variant = 'primary',
    size = 'md',
    className = '',
    loadingText = 'Loading...',
    icon = null,
    ...props
}) => {
    const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variantClasses = {
        primary: 'bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-500',
        secondary: 'bg-gray-500 hover:bg-gray-600 text-white focus:ring-gray-500',
        success: 'bg-green-500 hover:bg-green-600 text-white focus:ring-green-500',
        danger: 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-500',
        warning: 'bg-yellow-500 hover:bg-yellow-600 text-white focus:ring-yellow-500',
        outline: 'border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white focus:ring-blue-500',
        ghost: 'text-blue-500 hover:bg-blue-50 focus:ring-blue-500'
    };

    const sizeClasses = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base',
        xl: 'px-8 py-4 text-lg'
    };

    const isDisabled = disabled || loading;

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={isDisabled}
            className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
            {...props}
        >
            {loading ? (
                <>
                    <LoadingSpinner size="sm" color="white" />
                    <span className="ml-2">{loadingText}</span>
                </>
            ) : (
                <>
                    {icon && <span className="mr-2">{icon}</span>}
                    {children}
                </>
            )}
        </button>
    );
};

export default LoadingButton;

import React from 'react';

const SkeletonLoader = ({ 
    type = 'text', 
    lines = 1, 
    height = 'h-4', 
    width = 'w-full',
    className = '' 
}) => {
    const baseClasses = 'bg-gray-200 animate-pulse rounded';

    const renderSkeleton = () => {
        switch (type) {
            case 'text':
                return Array.from({ length: lines }, (_, index) => (
                    <div 
                        key={index}
                        className={`${baseClasses} ${height} ${
                            index === lines - 1 && lines > 1 ? 'w-3/4' : width
                        } ${index > 0 ? 'mt-2' : ''}`}
                    ></div>
                ));

            case 'card':
                return (
                    <div className={`${baseClasses} rounded-lg p-4 space-y-3 ${className}`}>
                        <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                        <div className="space-y-2">
                            <div className="h-4 bg-gray-300 rounded"></div>
                            <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                        </div>
                        <div className="flex space-x-2">
                            <div className="h-8 bg-gray-300 rounded w-20"></div>
                            <div className="h-8 bg-gray-300 rounded w-16"></div>
                        </div>
                    </div>
                );

            case 'table':
                return (
                    <div className="space-y-2">
                        {/* Table Header */}
                        <div className="flex space-x-4">
                            {Array.from({ length: 4 }, (_, index) => (
                                <div key={index} className="h-6 bg-gray-300 rounded flex-1"></div>
                            ))}
                        </div>
                        {/* Table Rows */}
                        {Array.from({ length: 5 }, (_, rowIndex) => (
                            <div key={rowIndex} className="flex space-x-4">
                                {Array.from({ length: 4 }, (_, colIndex) => (
                                    <div key={colIndex} className="h-4 bg-gray-200 rounded flex-1"></div>
                                ))}
                            </div>
                        ))}
                    </div>
                );

            case 'avatar':
                return (
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                        <div className="space-y-1">
                            <div className="h-4 bg-gray-300 rounded w-24"></div>
                            <div className="h-3 bg-gray-200 rounded w-16"></div>
                        </div>
                    </div>
                );

            case 'button':
                return (
                    <div className={`${baseClasses} h-10 w-24 ${className}`}></div>
                );

            case 'image':
                return (
                    <div className={`${baseClasses} ${height} ${width} ${className}`}></div>
                );

            default:
                return <div className={`${baseClasses} ${height} ${width} ${className}`}></div>;
        }
    };

    return <div className={className}>{renderSkeleton()}</div>;
};

export default SkeletonLoader;

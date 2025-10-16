import React from 'react';
import LoadingSpinner from './LoadingSpinner';

const PageLoader = ({ 
    message = 'Loading...', 
    showLogo = true,
    backgroundColor = 'bg-white'
}) => {
    return (
        <div className={`min-h-screen ${backgroundColor} flex flex-col items-center justify-center`}>
            {showLogo && (
                <div className="mb-8">
                    <div className="flex items-center space-x-2">
                        <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-xl">EMS</span>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Employee Management</h1>
                            <p className="text-sm text-gray-600">System</p>
                        </div>
                    </div>
                </div>
            )}
            
            <LoadingSpinner 
                size="xl" 
                color="blue" 
                text={message}
            />
            
            <div className="mt-8 text-center">
                <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
            </div>
        </div>
    );
};

export default PageLoader;

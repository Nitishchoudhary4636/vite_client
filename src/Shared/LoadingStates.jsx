import React from 'react';
import LoadingSpinner from './LoadingSpinner';
import SkeletonLoader from './SkeletonLoader';
import LoadingButton from './LoadingButton';
import PageLoader from './PageLoader';

// Comprehensive loading states showcase component
const LoadingStates = () => {
    return (
        <div className="p-8 space-y-12 bg-gray-50 min-h-screen">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Loading States Showcase</h1>
                
                {/* Loading Spinners */}
                <section className="bg-white rounded-lg p-6 shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Loading Spinners</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="text-center">
                            <LoadingSpinner size="sm" color="blue" />
                            <p className="mt-2 text-sm text-gray-600">Small</p>
                        </div>
                        <div className="text-center">
                            <LoadingSpinner size="md" color="green" />
                            <p className="mt-2 text-sm text-gray-600">Medium</p>
                        </div>
                        <div className="text-center">
                            <LoadingSpinner size="lg" color="purple" />
                            <p className="mt-2 text-sm text-gray-600">Large</p>
                        </div>
                        <div className="text-center">
                            <LoadingSpinner size="xl" color="red" text="Loading..." />
                            <p className="mt-2 text-sm text-gray-600">Extra Large with Text</p>
                        </div>
                    </div>
                </section>

                {/* Skeleton Loaders */}
                <section className="bg-white rounded-lg p-6 shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Skeleton Loaders</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-lg font-medium mb-3">Text Skeleton</h3>
                            <SkeletonLoader type="text" lines={3} />
                        </div>
                        <div>
                            <h3 className="text-lg font-medium mb-3">Avatar Skeleton</h3>
                            <SkeletonLoader type="avatar" />
                        </div>
                        <div>
                            <h3 className="text-lg font-medium mb-3">Card Skeleton</h3>
                            <SkeletonLoader type="card" />
                        </div>
                        <div>
                            <h3 className="text-lg font-medium mb-3">Table Skeleton</h3>
                            <SkeletonLoader type="table" />
                        </div>
                    </div>
                </section>

                {/* Loading Buttons */}
                <section className="bg-white rounded-lg p-6 shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Loading Buttons</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <LoadingButton loading={true} variant="primary" loadingText="Saving...">
                            Save
                        </LoadingButton>
                        <LoadingButton loading={true} variant="success" loadingText="Creating...">
                            Create
                        </LoadingButton>
                        <LoadingButton loading={true} variant="danger" loadingText="Deleting...">
                            Delete
                        </LoadingButton>
                        <LoadingButton loading={false} variant="outline">
                            Normal Button
                        </LoadingButton>
                    </div>
                </section>

                {/* Usage Examples */}
                <section className="bg-white rounded-lg p-6 shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Usage Examples</h2>
                    <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-medium mb-2">Dashboard Loading</h3>
                            <div className="space-y-3">
                                <SkeletonLoader type="card" className="h-32" />
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <SkeletonLoader type="card" className="h-24" />
                                    <SkeletonLoader type="card" className="h-24" />
                                    <SkeletonLoader type="card" className="h-24" />
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-medium mb-2">Form Loading</h3>
                            <div className="space-y-3">
                                <SkeletonLoader type="text" height="h-10" />
                                <SkeletonLoader type="text" height="h-10" />
                                <SkeletonLoader type="text" height="h-20" />
                                <SkeletonLoader type="button" width="w-32" height="h-10" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Implementation Guide */}
                <section className="bg-white rounded-lg p-6 shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Implementation Guide</h2>
                    <div className="prose max-w-none">
                        <h3>How to Use Loading States</h3>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>LoadingSpinner:</strong> Use for general loading indicators</li>
                            <li><strong>SkeletonLoader:</strong> Use to show content structure while loading</li>
                            <li><strong>LoadingButton:</strong> Use for form submissions and actions</li>
                            <li><strong>PageLoader:</strong> Use for full page loading states</li>
                        </ul>
                        
                        <h3 className="mt-6">Best Practices</h3>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Always provide loading feedback for actions taking more than 200ms</li>
                            <li>Use skeleton loaders for content that has a predictable structure</li>
                            <li>Provide meaningful loading messages</li>
                            <li>Disable interactive elements during loading states</li>
                            <li>Use appropriate loading indicators based on context</li>
                        </ul>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default LoadingStates;

import React from 'react';

const LoadingSpinner = ({ size = 8, className = '' }) => {
    return (
        <div className={`inline-block animate-spin rounded-full h-${size} w-${size} border-b-2 border-gray-900 ${className}`}></div>
    );
};

export default LoadingSpinner;
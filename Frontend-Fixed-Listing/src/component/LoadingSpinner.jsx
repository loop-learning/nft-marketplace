import React from 'react';

const LoadingSpinner = ({ 
  size = 'md', 
  text = 'Loading...', 
  showText = true,
  color = 'blue' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const colorClasses = {
    blue: 'border-blue-600',
    green: 'border-green-600',
    purple: 'border-purple-600',
    red: 'border-red-600'
  };


  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div 
        className={`
          ${sizeClasses[size]} 
          border-4 
          border-gray-600 
          border-t-${colorClasses[color] || 'border-t-blue-600'} 
          rounded-full 
          animate-spin
        `}
      ></div>
      
      {showText && text && (
        <p className="mt-4 text-gray-400 text-sm animate-pulse">
          {text}
        </p>
      )}

    </div>
  );
};

export const SkeletonLoader = ({ className = '' }) => {
  return (
    <div className={`animate-pulse bg-gray-700 rounded ${className}`}>
    </div>
  );
};

export const NFTCardSkeleton = () => {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden">
      <div className="aspect-square bg-gray-700 animate-pulse"></div>
      
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-700 rounded animate-pulse"></div>
        <div className="h-3 bg-gray-700 rounded w-3/4 animate-pulse"></div>
        <div className="flex justify-between">
          <div className="h-4 bg-gray-700 rounded w-20 animate-pulse"></div>
          <div className="h-4 bg-gray-700 rounded w-16 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export const PageLoader = ({ message = 'Loading marketplace...' }) => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="xl" text={message} color="blue" />
      </div>
    </div>
  );
};

export default LoadingSpinner;
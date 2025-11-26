import React from 'react';

interface LoadingSkeletonProps {
  variant?: 'text' | 'card' | 'avatar' | 'button';
  width?: string;
  height?: string;
  className?: string;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  variant = 'text',
  width,
  height,
  className = '',
}) => {
  const baseClasses = 'animate-pulse bg-gray-200 dark:bg-gray-700 rounded';
  
  const variantClasses = {
    text: 'h-4 w-full',
    card: 'h-32 w-full',
    avatar: 'h-10 w-10 rounded-full',
    button: 'h-10 w-24',
  };

  const style = {
    width: width || undefined,
    height: height || undefined,
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
    />
  );
};

// Preset skeleton components
export const TextSkeleton: React.FC<{ lines?: number; className?: string }> = ({
  lines = 3,
  className = '',
}) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <LoadingSkeleton
        key={i}
        variant="text"
        width={i === lines - 1 ? '75%' : '100%'}
      />
    ))}
  </div>
);

export const CardSkeleton: React.FC<{ className?: string }> = ({
  className = '',
}) => (
  <div className={`p-4 border border-gray-200 dark:border-gray-700 rounded-lg ${className}`}>
    <LoadingSkeleton variant="text" width="60%" className="mb-2" />
    <TextSkeleton lines={2} />
  </div>
);

export const ListSkeleton: React.FC<{ items?: number; className?: string }> = ({
  items = 5,
  className = '',
}) => (
  <div className={`space-y-4 ${className}`}>
    {Array.from({ length: items }).map((_, i) => (
      <CardSkeleton key={i} />
    ))}
  </div>
);

export default LoadingSkeleton;
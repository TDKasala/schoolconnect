import React from 'react';
import { cn } from '../../utils/cn';

interface LoadingSkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'card';
  width?: string | number;
  height?: string | number;
  lines?: number;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  className,
  variant = 'rectangular',
  width,
  height,
  lines = 1
}) => {
  const baseClasses = 'animate-pulse bg-gray-200 rounded';
  
  const getVariantClasses = () => {
    switch (variant) {
      case 'text':
        return 'h-4 rounded';
      case 'circular':
        return 'rounded-full';
      case 'card':
        return 'h-32 rounded-lg';
      default:
        return 'rounded';
    }
  };

  const style = {
    width: width || (variant === 'text' ? '100%' : undefined),
    height: height || (variant === 'circular' ? width : undefined)
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className={cn('space-y-2', className)}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={cn(baseClasses, getVariantClasses())}
            style={{
              ...style,
              width: index === lines - 1 ? '75%' : '100%'
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(baseClasses, getVariantClasses(), className)}
      style={style}
    />
  );
};

// Pre-built skeleton components for common use cases
export const DashboardCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center justify-between mb-4">
      <LoadingSkeleton variant="text" width="40%" />
      <LoadingSkeleton variant="circular" width={32} height={32} />
    </div>
    <LoadingSkeleton variant="text" width="60%" className="mb-2" />
    <LoadingSkeleton variant="text" width="80%" />
  </div>
);

export const StatCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center justify-between">
      <div className="flex items-center min-w-0 flex-1">
        <LoadingSkeleton variant="rectangular" width={48} height={48} className="rounded-lg flex-shrink-0" />
        <div className="ml-4 min-w-0 flex-1">
          <LoadingSkeleton variant="text" width="70%" className="mb-2" />
          <LoadingSkeleton variant="text" width="50%" />
        </div>
      </div>
    </div>
  </div>
);

export const TableRowSkeleton: React.FC<{ columns: number }> = ({ columns }) => (
  <tr>
    {Array.from({ length: columns }).map((_, index) => (
      <td key={index} className="px-6 py-4 whitespace-nowrap">
        <LoadingSkeleton variant="text" width="80%" />
      </td>
    ))}
  </tr>
);

export const ActivityItemSkeleton: React.FC = () => (
  <div className="flex items-start space-x-3 p-4">
    <LoadingSkeleton variant="circular" width={40} height={40} />
    <div className="flex-1 min-w-0">
      <LoadingSkeleton variant="text" width="60%" className="mb-2" />
      <LoadingSkeleton variant="text" width="40%" />
    </div>
    <LoadingSkeleton variant="text" width="60px" />
  </div>
);

export default LoadingSkeleton;

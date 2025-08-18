import React from 'react';
import { StatCardSkeleton, DashboardCardSkeleton, ActivityItemSkeleton } from '../ui/LoadingSkeleton';

interface DashboardSkeletonProps {
  variant?: 'overview' | 'admin' | 'teacher' | 'parent';
}

const DashboardSkeleton: React.FC<DashboardSkeletonProps> = ({ variant = 'overview' }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="space-y-6">
        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <StatCardSkeleton key={index} />
          ))}
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Primary Content */}
          <div className="lg:col-span-2 space-y-6">
            <DashboardCardSkeleton />
            <DashboardCardSkeleton />
          </div>

          {/* Sidebar Content */}
          <div className="space-y-6">
            {/* Recent Activities Skeleton */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <div className="animate-pulse bg-gray-200 h-5 w-32 rounded"></div>
              </div>
              <div className="divide-y divide-gray-200">
                {Array.from({ length: 5 }).map((_, index) => (
                  <ActivityItemSkeleton key={index} />
                ))}
              </div>
            </div>

            {/* Additional Card */}
            <DashboardCardSkeleton />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;

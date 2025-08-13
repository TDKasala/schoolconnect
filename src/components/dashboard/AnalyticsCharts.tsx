import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { TrendingUp, Users, DollarSign, School } from 'lucide-react';
import PlatformAdminService from '../../services/platformAdminService';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface AnalyticsData {
  userRegistrations: Array<{ month: string; count: number }>;
  schoolGrowth: Array<{ month: string; count: number }>;
  revenueData: Array<{ month: string; amount: number }>;
  usersByRole: Array<{ role: string; count: number }>;
}

interface AnalyticsChartsProps {
  stats: {
    totalSchools: number;
    totalStudents: number;
    totalTeachers: number;
    totalUsers: number;
  };
}

const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ stats }) => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const data = await PlatformAdminService.getSystemAnalytics();
      setAnalyticsData(data);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      setError('Erreur lors du chargement des données analytiques');
    } finally {
      setLoading(false);
    }
  };

  // Chart configurations
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const userGrowthData = {
    labels: analyticsData?.userRegistrations.map(item => item.month) || [],
    datasets: [
      {
        label: 'Nouveaux Utilisateurs',
        data: analyticsData?.userRegistrations.map(item => item.count) || [],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const schoolGrowthData = {
    labels: analyticsData?.schoolGrowth.map(item => item.month) || [],
    datasets: [
      {
        label: 'Nouvelles Écoles',
        data: analyticsData?.schoolGrowth.map(item => item.count) || [],
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 1,
      },
    ],
  };

  const revenueData = {
    labels: analyticsData?.revenueData.map(item => item.month) || [],
    datasets: [
      {
        label: 'Revenus (USD)',
        data: analyticsData?.revenueData.map(item => item.amount) || [],
        backgroundColor: 'rgba(168, 85, 247, 0.8)',
        borderColor: 'rgb(168, 85, 247)',
        borderWidth: 1,
      },
    ],
  };

  const usersByRoleData = {
    labels: analyticsData?.usersByRole.map(item => {
      switch (item.role) {
        case 'platform_admin': return 'Admin Plateforme';
        case 'school_admin': return 'Admin École';
        case 'teacher': return 'Enseignant';
        case 'parent': return 'Parent';
        default: return item.role;
      }
    }) || [],
    datasets: [
      {
        data: analyticsData?.usersByRole.map(item => item.count) || [],
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(251, 191, 36, 0.8)',
        ],
        borderColor: [
          'rgb(239, 68, 68)',
          'rgb(59, 130, 246)',
          'rgb(34, 197, 94)',
          'rgb(251, 191, 36)',
        ],
        borderWidth: 2,
      },
    ],
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white rounded-lg shadow p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-64 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <School className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Écoles Actives</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalSchools}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Élèves Inscrits</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Enseignants</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalTeachers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Utilisateurs</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <TrendingUp className="h-5 w-5 text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Croissance des Utilisateurs</h3>
          </div>
          <div className="h-64">
            <Line data={userGrowthData} options={chartOptions} />
          </div>
        </div>

        {/* School Growth Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <School className="h-5 w-5 text-green-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Nouvelles Écoles</h3>
          </div>
          <div className="h-64">
            <Bar data={schoolGrowthData} options={chartOptions} />
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <DollarSign className="h-5 w-5 text-purple-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Revenus Mensuels</h3>
          </div>
          <div className="h-64">
            <Bar data={revenueData} options={chartOptions} />
          </div>
        </div>

        {/* Users by Role Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <Users className="h-5 w-5 text-red-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Répartition par Rôle</h3>
          </div>
          <div className="h-64 flex items-center justify-center">
            <div className="w-64 h-64">
              <Doughnut data={usersByRoleData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCharts;

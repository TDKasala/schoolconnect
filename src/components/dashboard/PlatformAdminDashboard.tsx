import React, { useState } from 'react';
import { Building, Users, TrendingUp, Plus } from 'lucide-react';

const PlatformAdminDashboard: React.FC = () => {
  const [schools] = useState([
    { id: '1', name: 'École Primaire Saint-Joseph', students: 247, teachers: 18, status: 'active' },
    { id: '2', name: 'Institut Technique de Lubumbashi', students: 412, teachers: 28, status: 'active' },
    { id: '3', name: 'Collège Moderne de Goma', students: 189, teachers: 15, status: 'active' }
  ]);

  const stats = [
    { name: 'Total Écoles', value: schools.length.toString(), icon: Building, color: 'bg-blue-500' },
    { name: 'Total Élèves', value: schools.reduce((sum, school) => sum + school.students, 0).toString(), icon: Users, color: 'bg-green-500' },
    { name: 'Total Enseignants', value: schools.reduce((sum, school) => sum + school.teachers, 0).toString(), icon: Users, color: 'bg-purple-500' },
    { name: 'Croissance', value: '+12%', icon: TrendingUp, color: 'bg-yellow-500' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Administration Plateforme</h1>
        <p className="mt-2 text-gray-600">Gérez toutes les écoles sur SchoolConnect</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className={`${stat.color} rounded-lg p-3`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Schools List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Écoles</h2>
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter une école
          </button>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {schools.map((school) => (
              <div key={school.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900">{school.name}</h3>
                    <div className="mt-2 flex space-x-4 text-sm text-gray-600">
                      <span>{school.students} élèves</span>
                      <span>{school.teachers} enseignants</span>
                    </div>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {school.status === 'active' ? 'Actif' : 'Inactif'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformAdminDashboard;

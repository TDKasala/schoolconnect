import React from 'react';
import { User, BookOpen, CreditCard, Calendar } from 'lucide-react';

const ParentDashboard: React.FC = () => {
  const children = [
    { id: '1', name: 'Marie Kabongo', class: '6ème A', average: 15.2, attendance: 95 }
  ];

  const stats = [
    { name: 'Enfants', value: children.length.toString(), icon: User, color: 'bg-blue-500' },
    { name: 'Moyenne générale', value: '15.2/20', icon: BookOpen, color: 'bg-green-500' },
    { name: 'Frais scolaires', value: 'À jour', icon: CreditCard, color: 'bg-purple-500' },
    { name: 'Présence', value: '95%', icon: Calendar, color: 'bg-yellow-500' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Portail Parent</h1>
        <p className="mt-2 text-gray-600">Suivez les progrès de votre enfant</p>
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

      {/* Children Info */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Mes Enfants</h2>
        </div>
        <div className="p-6">
          {children.map((child) => (
            <div key={child.id} className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900">{child.name}</h3>
              <p className="text-sm text-gray-600">{child.class}</p>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-500">Moyenne:</span>
                  <span className="ml-2 font-medium">{child.average}/20</span>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Présence:</span>
                  <span className="ml-2 font-medium">{child.attendance}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;

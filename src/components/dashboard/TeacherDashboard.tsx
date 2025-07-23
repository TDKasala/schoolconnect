import React from 'react';
import { BookOpen, Users, ClipboardCheck, Calendar } from 'lucide-react';

const TeacherDashboard: React.FC = () => {
  const stats = [
    { name: 'Mes Classes', value: '3', icon: BookOpen, color: 'bg-primary-500' },
    { name: 'Total Élèves', value: '87', icon: Users, color: 'bg-secondary-500' },
    { name: 'Devoirs à corriger', value: '12', icon: ClipboardCheck, color: 'bg-secondary-600' },
    { name: 'Cours cette semaine', value: '18', icon: Calendar, color: 'bg-primary-600' }
  ];

  const classes = [
    { id: '1', name: '6ème A', subject: 'Mathématiques', students: 28, nextClass: '14:00' },
    { id: '2', name: '5ème B', subject: 'Mathématiques', students: 31, nextClass: '15:30' },
    { id: '3', name: '4ème C', subject: 'Sciences', students: 28, nextClass: 'Demain 08:00' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mon Tableau de bord</h1>
        <p className="mt-2 text-gray-600">Gérez vos classes et suivez vos élèves</p>
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

      {/* Classes */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Mes Classes</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((cls) => (
              <div key={cls.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-gray-900">{cls.name}</h3>
                <p className="text-sm text-gray-600">{cls.subject}</p>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Élèves:</span>
                    <span className="font-medium">{cls.students}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Prochain cours:</span>
                    <span className="font-medium">{cls.nextClass}</span>
                  </div>
                </div>
                <button className="mt-4 w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition-colors">
                  Gérer la classe
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;

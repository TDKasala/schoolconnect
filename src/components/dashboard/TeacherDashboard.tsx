import React, { useState } from 'react';
import { BookOpen, Users, ClipboardCheck, Calendar, Plus, Eye, Edit, MessageSquare, BarChart3, CheckCircle, FileText } from 'lucide-react';

const TeacherDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { name: 'Mes Classes', value: '3', icon: BookOpen, color: 'bg-primary-500' },
    { name: 'Total Élèves', value: '87', icon: Users, color: 'bg-secondary-500' },
    { name: 'Devoirs à corriger', value: '12', icon: ClipboardCheck, color: 'bg-secondary-600' },
    { name: 'Cours cette semaine', value: '18', icon: Calendar, color: 'bg-primary-600' }
  ];

  const classes = [
    { id: '1', name: '6ème A', subject: 'Mathématiques', students: 28, nextClass: '14:00', attendance: 92, avgGrade: 14.5 },
    { id: '2', name: '5ème B', subject: 'Mathématiques', students: 31, nextClass: '15:30', attendance: 88, avgGrade: 13.2 },
    { id: '3', name: '4ème C', subject: 'Sciences', students: 28, nextClass: 'Demain 08:00', attendance: 95, avgGrade: 15.8 }
  ];

  const recentActivities = [
    { id: '1', type: 'grade', message: 'Notes ajoutées pour le contrôle de Mathématiques - 6ème A', time: '2h', icon: BarChart3, color: 'text-primary-600' },
    { id: '2', type: 'attendance', message: 'Présences marquées pour 5ème B', time: '4h', icon: CheckCircle, color: 'text-green-600' },
    { id: '3', type: 'message', message: 'Nouveau message de parent - Marie Kabongo', time: '6h', icon: MessageSquare, color: 'text-secondary-600' },
    { id: '4', type: 'homework', message: 'Devoir créé: Exercices de géométrie', time: '1j', icon: ClipboardCheck, color: 'text-purple-600' }
  ];

  const upcomingTasks = [
    { id: '1', task: 'Corriger contrôle de Mathématiques', deadline: 'Demain 16:00', priority: 'high', class: '6ème A' },
    { id: '2', task: 'Préparer cours sur les fractions', deadline: 'Vendredi 08:00', priority: 'medium', class: '5ème B' },
    { id: '3', task: 'Générer bulletins trimestriels', deadline: 'Vendredi 17:00', priority: 'high', class: 'Toutes classes' }
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

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Actions Rapides</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors">
              <Plus className="h-8 w-8 text-gray-400 mb-2" />
              <span className="text-sm font-medium text-gray-700">Nouveau Devoir</span>
            </button>
            <button className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-secondary-500 hover:bg-secondary-50 transition-colors">
              <ClipboardCheck className="h-8 w-8 text-gray-400 mb-2" />
              <span className="text-sm font-medium text-gray-700">Voir les notes</span>
            </button>
            <button className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors">
              <FileText className="h-8 w-8 text-gray-400 mb-2" />
              <span className="text-sm font-medium text-gray-700">AI Bulletins</span>
            </button>
            <button className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-secondary-500 hover:bg-secondary-50 transition-colors">
              <MessageSquare className="h-8 w-8 text-gray-400 mb-2" />
              <span className="text-sm font-medium text-gray-700">Messages</span>
              <span className="text-sm font-medium text-gray-700 group-hover:text-secondary-700">Messages Parents</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Classes */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Mes Classes</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {classes.map((cls) => (
                <div key={cls.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">{cls.name}</h3>
                      <p className="text-sm text-gray-600">{cls.subject}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-full">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-secondary-600 hover:bg-secondary-50 rounded-full">
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-900">{cls.students}</div>
                      <div className="text-xs text-gray-500">Élèves</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-green-600">{cls.attendance}%</div>
                      <div className="text-xs text-gray-500">Présence</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-primary-600">{cls.avgGrade}/20</div>
                      <div className="text-xs text-gray-500">Moyenne</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-900">{cls.nextClass}</div>
                      <div className="text-xs text-gray-500">Prochain cours</div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition-colors text-sm">
                      Gérer la classe
                    </button>
                    <button className="flex-1 bg-secondary-600 text-white py-2 px-4 rounded-md hover:bg-secondary-700 transition-colors text-sm">
                      Voir les notes
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activities & Tasks */}
        <div className="space-y-6">
          {/* Recent Activities */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Activités Récentes</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <activity.icon className={`h-4 w-4 ${activity.color}`} />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500">Il y a {activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Upcoming Tasks */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Tâches à Venir</h2>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {upcomingTasks.map((task) => (
                  <div key={task.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0">
                      <div className={`h-3 w-3 rounded-full ${
                        task.priority === 'high' ? 'bg-red-500' :
                        task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                      }`}></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{task.task}</p>
                      <p className="text-xs text-gray-500">{task.class} • {task.deadline}</p>
                    </div>
                    <button className="text-primary-600 hover:text-primary-700">
                      <CheckCircle className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;

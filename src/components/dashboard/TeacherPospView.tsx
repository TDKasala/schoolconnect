import React, { useState } from 'react';
import { 
  Users, 
  BookOpen, 
  Plus, 
  Search, 
  Edit,
  Eye,
  ClipboardCheck,
  Calendar,
  BarChart3,
  CheckCircle,
  Clock
} from 'lucide-react';

const TeacherPospView: React.FC = () => {
  const [activeTab, setActiveTab] = useState('classes');
  
  const myClasses = [
    { 
      id: '1', 
      name: '6ème A', 
      subject: 'Mathématiques', 
      students: 28, 
      nextClass: 'Aujourd\'hui 14:00',
      attendance: 92,
      avgGrade: 14.5,
      recentActivity: 'Notes ajoutées il y a 2h'
    },
    { 
      id: '2', 
      name: '5ème B', 
      subject: 'Mathématiques', 
      students: 31, 
      nextClass: 'Demain 08:00',
      attendance: 88,
      avgGrade: 13.2,
      recentActivity: 'Présences marquées il y a 4h'
    },
    { 
      id: '3', 
      name: '4ème C', 
      subject: 'Sciences', 
      students: 28, 
      nextClass: 'Vendredi 10:00',
      attendance: 95,
      avgGrade: 15.8,
      recentActivity: 'Devoir créé il y a 1j'
    }
  ];

  const students = [
    { id: '1', name: 'Marie Tshala', class: '6ème A', avgGrade: 16.5, attendance: 98, status: 'excellent' },
    { id: '2', name: 'Jean Kabila', class: '6ème A', avgGrade: 12.3, attendance: 85, status: 'attention' },
    { id: '3', name: 'Sarah Mukendi', class: '5ème B', avgGrade: 14.8, attendance: 92, status: 'good' },
    { id: '4', name: 'Paul Mbuyi', class: '5ème B', avgGrade: 11.2, attendance: 78, status: 'attention' },
    { id: '5', name: 'Grace Kasala', class: '4ème C', avgGrade: 17.2, attendance: 100, status: 'excellent' },
    { id: '6', name: 'David Tshimanga', class: '4ème C', avgGrade: 13.5, attendance: 90, status: 'good' }
  ];

  const assignments = [
    { id: '1', title: 'Contrôle de Mathématiques', class: '6ème A', dueDate: 'Demain', submitted: 25, total: 28, status: 'pending' },
    { id: '2', title: 'Exercices de géométrie', class: '5ème B', dueDate: 'Vendredi', submitted: 31, total: 31, status: 'completed' },
    { id: '3', title: 'Expérience de Sciences', class: '4ème C', dueDate: 'Lundi prochain', submitted: 15, total: 28, status: 'in_progress' }
  ];

  const stats = [
    { name: 'Mes Classes', value: '3', icon: BookOpen, color: 'bg-blue-500' },
    { name: 'Total Élèves', value: '87', icon: Users, color: 'bg-green-500' },
    { name: 'Devoirs en cours', value: '12', icon: ClipboardCheck, color: 'bg-orange-500' },
    { name: 'Moyenne générale', value: '14.5/20', icon: BarChart3, color: 'bg-purple-500' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'attention': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'excellent': return 'Excellent';
      case 'good': return 'Bien';
      case 'attention': return 'Attention';
      default: return 'Normal';
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Actions Rapides</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors">
            <Plus className="h-8 w-8 text-gray-400 mb-2" />
            <span className="text-sm font-medium text-gray-700">Nouveau Devoir</span>
          </button>
          <button className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-secondary-500 hover:bg-secondary-50 transition-colors">
            <ClipboardCheck className="h-8 w-8 text-gray-400 mb-2" />
            <span className="text-sm font-medium text-gray-700">Marquer Présences</span>
          </button>
          <button className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors">
            <BarChart3 className="h-8 w-8 text-gray-400 mb-2" />
            <span className="text-sm font-medium text-gray-700">Ajouter Notes</span>
          </button>
          <button className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors">
            <Calendar className="h-8 w-8 text-gray-400 mb-2" />
            <span className="text-sm font-medium text-gray-700">Planning</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('classes')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'classes'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Mes Classes
            </button>
            <button
              onClick={() => setActiveTab('students')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'students'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Mes Élèves
            </button>
            <button
              onClick={() => setActiveTab('assignments')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'assignments'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Devoirs & Évaluations
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'classes' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Mes Classes</h3>
                <p className="text-sm text-gray-500">Gérez vos classes et suivez les progrès</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myClasses.map((classe) => (
                  <div key={classe.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">{classe.name}</h4>
                        <p className="text-sm text-gray-500">{classe.subject}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary-600">{classe.students}</div>
                        <div className="text-xs text-gray-500">élèves</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-lg font-semibold text-green-600">{classe.attendance}%</div>
                        <div className="text-xs text-gray-500">Présence</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-primary-600">{classe.avgGrade}/20</div>
                        <div className="text-xs text-gray-500">Moyenne</div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="text-sm text-gray-600 mb-1">Prochain cours:</div>
                      <div className="text-sm font-medium text-gray-900">{classe.nextClass}</div>
                    </div>

                    <div className="mb-4">
                      <div className="text-xs text-gray-500">{classe.recentActivity}</div>
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
          )}

          {activeTab === 'students' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Mes Élèves</h3>
                  <p className="text-sm text-gray-500">Suivez les performances individuelles</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Rechercher un élève..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
              </div>

              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Élève
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Classe
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Moyenne
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Présence
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {students.map((student) => (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-8 w-8 bg-primary-600 rounded-full flex items-center justify-center">
                              <span className="text-xs font-medium text-white">
                                {student.name.charAt(0)}
                              </span>
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">{student.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{student.class}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{student.avgGrade}/20</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{student.attendance}%</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(student.status)}`}>
                            {getStatusText(student.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button className="text-primary-600 hover:text-primary-900">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="text-gray-600 hover:text-gray-900">
                              <Edit className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'assignments' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Devoirs & Évaluations</h3>
                  <p className="text-sm text-gray-500">Gérez vos devoirs et évaluations</p>
                </div>
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Nouveau Devoir
                </button>
              </div>

              <div className="space-y-4">
                {assignments.map((assignment) => (
                  <div key={assignment.id} className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h4 className="text-lg font-medium text-gray-900">{assignment.title}</h4>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {assignment.class}
                          </span>
                        </div>
                        <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            Échéance: {assignment.dueDate}
                          </div>
                          <div className="flex items-center">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            {assignment.submitted}/{assignment.total} rendus
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="text-primary-600 hover:text-primary-900">
                          <Eye className="h-5 w-5" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                          <Edit className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Progression</span>
                        <span className="text-gray-900">{Math.round((assignment.submitted / assignment.total) * 100)}%</span>
                      </div>
                      <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary-600 h-2 rounded-full" 
                          style={{ width: `${(assignment.submitted / assignment.total) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherPospView;

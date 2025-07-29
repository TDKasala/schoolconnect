import React, { useState } from 'react';
import { 
  Users, 
  BookOpen, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  GraduationCap,
  Calendar,
  BarChart3
} from 'lucide-react';

const AdminPospView: React.FC = () => {
  const [activeTab, setActiveTab] = useState('classes');
  
  const classes = [
    { id: '1', name: '6ème A', teacher: 'Marie Kabongo', students: 28, subjects: 8, avgGrade: 14.5 },
    { id: '2', name: '5ème B', teacher: 'Jean Mukendi', students: 31, subjects: 9, avgGrade: 13.2 },
    { id: '3', name: '4ème C', teacher: 'Sarah Mbuyi', students: 28, subjects: 10, avgGrade: 15.8 },
    { id: '4', name: '3ème A', teacher: 'Paul Tshimanga', students: 25, subjects: 11, avgGrade: 12.9 }
  ];

  const teachers = [
    { id: '1', name: 'Marie Kabongo', subject: 'Mathématiques', classes: 3, students: 87, avgGrade: 14.2 },
    { id: '2', name: 'Jean Mukendi', subject: 'Français', classes: 2, students: 59, avgGrade: 13.8 },
    { id: '3', name: 'Sarah Mbuyi', subject: 'Sciences', classes: 4, students: 112, avgGrade: 15.1 },
    { id: '4', name: 'Paul Tshimanga', subject: 'Histoire', classes: 3, students: 78, avgGrade: 13.5 }
  ];

  const stats = [
    { name: 'Total Classes', value: '12', icon: BookOpen, color: 'bg-blue-500' },
    { name: 'Total Élèves', value: '336', icon: Users, color: 'bg-green-500' },
    { name: 'Enseignants Actifs', value: '18', icon: GraduationCap, color: 'bg-purple-500' },
    { name: 'Moyenne Générale', value: '14.1/20', icon: BarChart3, color: 'bg-orange-500' }
  ];

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
              Gestion des Classes
            </button>
            <button
              onClick={() => setActiveTab('teachers')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'teachers'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Gestion des Enseignants
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'reports'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Rapports & Analyses
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'classes' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Classes</h3>
                  <p className="text-sm text-gray-500">Gérez toutes les classes de votre établissement</p>
                </div>
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvelle Classe
                </button>
              </div>

              {/* Search and Filter */}
              <div className="flex items-center space-x-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher une classe..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtrer
                </button>
              </div>

              {/* Classes Table */}
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Classe
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Enseignant Principal
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Élèves
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Matières
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Moyenne
                      </th>
                      <th className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {classes.map((classe) => (
                      <tr key={classe.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{classe.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{classe.teacher}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{classe.students}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{classe.subjects}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{classe.avgGrade}/20</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button className="text-primary-600 hover:text-primary-900">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="text-gray-600 hover:text-gray-900">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                              <Trash2 className="h-4 w-4" />
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

          {activeTab === 'teachers' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Enseignants</h3>
                  <p className="text-sm text-gray-500">Gérez le personnel enseignant</p>
                </div>
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvel Enseignant
                </button>
              </div>

              {/* Teachers Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teachers.map((teacher) => (
                  <div key={teacher.id} className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 bg-primary-600 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-white">
                            {teacher.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">{teacher.name}</h4>
                          <p className="text-xs text-gray-500">{teacher.subject}</p>
                        </div>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-lg font-semibold text-gray-900">{teacher.classes}</div>
                        <div className="text-xs text-gray-500">Classes</div>
                      </div>
                      <div>
                        <div className="text-lg font-semibold text-gray-900">{teacher.students}</div>
                        <div className="text-xs text-gray-500">Élèves</div>
                      </div>
                      <div>
                        <div className="text-lg font-semibold text-gray-900">{teacher.avgGrade}/20</div>
                        <div className="text-xs text-gray-500">Moyenne</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Rapports & Analyses</h3>
                <p className="text-sm text-gray-500">Analyses détaillées des performances</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Rapport de Performance</h4>
                  <p className="text-xs text-gray-500 mb-4">Analyse des notes par classe et matière</p>
                  <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-xs font-medium text-gray-700 bg-white hover:bg-gray-50">
                    Générer le rapport
                  </button>
                </div>

                <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Rapport de Présence</h4>
                  <p className="text-xs text-gray-500 mb-4">Statistiques d'assiduité des élèves</p>
                  <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-xs font-medium text-gray-700 bg-white hover:bg-gray-50">
                    Générer le rapport
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPospView;

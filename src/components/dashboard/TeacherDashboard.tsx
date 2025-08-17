import React, { useMemo, useState } from 'react';
import { BookOpen, Users, ClipboardCheck, Calendar, Plus, Eye, Edit, MessageSquare, BarChart3, CheckCircle, FileText } from 'lucide-react';
import { useAuth, type UserWithProfile } from '../../contexts/AuthContext';
import { useTeacher } from '../../hooks/useTeacher';
import { useAIBulletin } from '../../hooks/useAIIntegration';

const TeacherDashboard: React.FC = () => {
  const { user } = useAuth();
  const typedUser = user as UserWithProfile | null;
  const teacherId = typedUser?.id ?? '';

  const {
    stats,
    classes,
    activities,
    tasks,
    loading,
    error,
    createHomework
  } = useTeacher(teacherId);

  const ai = useAIBulletin();

  const statsData = useMemo(() => ([
    { name: 'Mes Classes', value: stats?.classCount ?? stats?.totalClasses ?? 0, icon: BookOpen, color: 'bg-primary-500' },
    { name: 'Total Élèves', value: stats?.totalStudents ?? 0, icon: Users, color: 'bg-secondary-500' },
    { name: 'Devoirs à corriger', value: stats?.pendingGrades ?? 0, icon: ClipboardCheck, color: 'bg-secondary-600' },
    { name: 'Cours cette semaine', value: stats?.weeklyClasses ?? 0, icon: Calendar, color: 'bg-primary-600' },
  ]), [stats]);

  const [showHomeworkModal, setShowHomeworkModal] = useState(false);
  const [newHomework, setNewHomework] = useState({
    classId: '',
    title: '',
    description: '',
    dueDate: '',
    subject: ''
  });

  const [showAIReportModal, setShowAIReportModal] = useState(false);
  const [aiParams, setAiParams] = useState({ classId: '', semester: 'S1', year: new Date().getFullYear().toString() });
  const [aiOutput, setAiOutput] = useState<string | null>(null);

  const handleCreateHomework = async () => {
    if (!newHomework.classId || !newHomework.title) return;
    await createHomework({
      classId: newHomework.classId,
      title: newHomework.title,
      description: newHomework.description,
      dueDate: newHomework.dueDate,
      subject: newHomework.subject,
    });
    setNewHomework({ classId: '', title: '', description: '', dueDate: '', subject: '' });
    setShowHomeworkModal(false);
  };

  const handleGenerateClassReport = async () => {
    if (!aiParams.classId) return;
    setAiOutput(null);
    const res = await ai.generateClassReport(aiParams.classId, aiParams.semester, aiParams.year);
    setAiOutput(res.content);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mon Tableau de bord</h1>
        <p className="mt-2 text-gray-600">Gérez vos classes et suivez vos élèves</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsData.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className={`${stat.color} rounded-lg p-3`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900">{loading ? '—' : String(stat.value)}</p>
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
            <button className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors" onClick={() => setShowHomeworkModal(true)}>
              <Plus className="h-8 w-8 text-gray-400 mb-2" />
              <span className="text-sm font-medium text-gray-700">Nouveau Devoir</span>
            </button>
            <a href="/dashboard/grades" className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-secondary-500 hover:bg-secondary-50 transition-colors">
              <ClipboardCheck className="h-8 w-8 text-gray-400 mb-2" />
              <span className="text-sm font-medium text-gray-700">Voir les notes</span>
            </a>
            <button className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors" onClick={() => setShowAIReportModal(true)}>
              <FileText className="h-8 w-8 text-gray-400 mb-2" />
              <span className="text-sm font-medium text-gray-700">AI Bulletins/Rapport</span>
            </button>
            <a href="/dashboard/messagerie" className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-secondary-500 hover:bg-secondary-50 transition-colors">
              <MessageSquare className="h-8 w-8 text-gray-400 mb-2" />
              <span className="text-sm font-medium text-gray-700">Messages Parents</span>
            </a>
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
                      {('subject' in cls) && (<p className="text-sm text-gray-600">{(cls as any).subject}</p>)}
                    </div>
                    <div className="flex space-x-2">
                      <a href="/dashboard/attendance" className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-full" title="Présence">
                        <Eye className="h-4 w-4" />
                      </a>
                      <a href="/dashboard/grades" className="p-2 text-gray-400 hover:text-secondary-600 hover:bg-secondary-50 rounded-full" title="Notes">
                        <Edit className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-900">{cls.studentCount}</div>
                      <div className="text-xs text-gray-500">Élèves</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-green-600">{cls.attendanceRate}%</div>
                      <div className="text-xs text-gray-500">Présence</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-primary-600">{cls.averageGrade}/20</div>
                      <div className="text-xs text-gray-500">Moyenne</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-900">{cls.nextClass}</div>
                      <div className="text-xs text-gray-500">Prochain cours</div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <a href="/dashboard/classes" className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition-colors text-sm text-center">Gérer la classe</a>
                    <a href="/dashboard/grades" className="flex-1 bg-secondary-600 text-white py-2 px-4 rounded-md hover:bg-secondary-700 transition-colors text-sm text-center">Voir les notes</a>
                  </div>
                </div>
              ))}
              {classes.length === 0 && !loading && (
                <p className="text-sm text-gray-500">Aucune classe assignée.</p>
              )}
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
              {loading && <p className="text-sm text-gray-500">Chargement…</p>}
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                        {activity.icon === 'BarChart3' && <BarChart3 className={`h-4 w-4 ${activity.color}`} />}
                        {activity.icon === 'CheckCircle' && <CheckCircle className={`h-4 w-4 ${activity.color}`} />}
                        {activity.icon === 'MessageSquare' && <MessageSquare className={`h-4 w-4 ${activity.color}`} />}
                        {activity.icon === 'ClipboardCheck' && <ClipboardCheck className={`h-4 w-4 ${activity.color}`} />}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500">Il y a {activity.time}</p>
                    </div>
                  </div>
                ))}
                {activities.length === 0 && !loading && !error && (
                  <p className="text-sm text-gray-500">Aucune activité récente</p>
                )}
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
                {tasks.map((task) => (
                  <div key={task.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0">
                      <div className={`h-3 w-3 rounded-full ${
                        task.priority === 'high' ? 'bg-red-500' : task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                      }`}></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{task.task}</p>
                      <p className="text-xs text-gray-500">{task.class} • {task.deadline}</p>
                    </div>
                    <button className="text-primary-600 hover:text-primary-700" title="Marquer comme fait">
                      <CheckCircle className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                {tasks.length === 0 && !loading && (
                  <p className="text-sm text-gray-500">Aucune tâche à venir</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Homework Modal */}
      {showHomeworkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Créer un nouveau devoir</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Classe</label>
                  <select value={newHomework.classId} onChange={(e) => setNewHomework({ ...newHomework, classId: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <option value="">Sélectionnez une classe</option>
                    {classes.map(cls => (<option key={cls.id} value={cls.id}>{cls.name}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
                  <input type="text" value={newHomework.title} onChange={(e) => setNewHomework({ ...newHomework, title: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Titre du devoir" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea value={newHomework.description} onChange={(e) => setNewHomework({ ...newHomework, description: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Description du devoir" rows={3} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date limite</label>
                  <input type="date" value={newHomework.dueDate} onChange={(e) => setNewHomework({ ...newHomework, dueDate: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Matière</label>
                  <input type="text" value={newHomework.subject} onChange={(e) => setNewHomework({ ...newHomework, subject: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Matière" />
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
              <button onClick={() => setShowHomeworkModal(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">Annuler</button>
              <button onClick={handleCreateHomework} className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700">Créer</button>
            </div>
          </div>
        </div>
      )}

      {/* AI Report Modal */}
      {showAIReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Générer un rapport de classe (IA)</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Classe</label>
                <select value={aiParams.classId} onChange={(e) => setAiParams({ ...aiParams, classId: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option value="">Sélectionnez une classe</option>
                  {classes.map(cls => (<option key={cls.id} value={cls.id}>{cls.name}</option>))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Semestre</label>
                  <select value={aiParams.semester} onChange={(e) => setAiParams({ ...aiParams, semester: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option value="S1">S1</option>
                    <option value="S2">S2</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Année</label>
                  <input type="text" value={aiParams.year} onChange={(e) => setAiParams({ ...aiParams, year: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button onClick={() => setShowAIReportModal(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">Fermer</button>
                <button onClick={handleGenerateClassReport} disabled={ai.loading || !aiParams.classId} className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50">
                  {ai.loading ? 'Génération…' : 'Générer'}
                </button>
              </div>
              {ai.error && <p className="text-sm text-red-600">{ai.error}</p>}
              {aiOutput && (
                <div className="mt-4 p-4 bg-gray-50 rounded border border-gray-200 text-sm whitespace-pre-wrap">
                  {aiOutput}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;

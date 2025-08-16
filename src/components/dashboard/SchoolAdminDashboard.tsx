import React, { useEffect, useMemo, useState } from 'react';
import {
  Users,
  BookOpen,
  MessageSquare,
  BarChart3,
  FileText,
  UserPlus,
  UserCheck,
  Clock,
  Layers,
  Target,
  Sparkles
} from 'lucide-react';
import { useAuth, type UserWithProfile } from '../../contexts/AuthContext';
import { useOverview } from '../../hooks/useOverview';
import { supabase } from '../../lib/supabase';
import { Link, useNavigate } from 'react-router-dom';

const SchoolAdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const typedUser = user as UserWithProfile | null;
  const schoolId = typedUser?.profile?.school_id as string | undefined;
  const userId = typedUser?.id ?? '';
  const role = typedUser?.profile?.role ?? 'school_admin';

  const { stats, recentActivities, loading, error } = useOverview(userId, role, schoolId);

  const navigate = useNavigate();

  // Live KPIs (fallbacks if useOverview lacks them)
  const [kpisLoading, setKpisLoading] = useState(false);
  const [kpis, setKpis] = useState({
    students: 0,
    teachers: 0,
    classes: 0,
    attendanceTodayRate: 0,
  });

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

  useEffect(() => {
    const fetchKpis = async () => {
      if (!schoolId) return;
      setKpisLoading(true);
      try {
        const [studentsCount, teachersCount, classesCount, attendanceToday] = await Promise.all([
          supabase.from('students').select('id', { count: 'exact', head: true }).eq('school_id', schoolId),
          supabase.from('users').select('id', { count: 'exact', head: true }).eq('role', 'teacher').eq('school_id', schoolId),
          supabase.from('classes').select('id', { count: 'exact', head: true }).eq('school_id', schoolId),
          supabase
            .from('attendance')
            .select('id, status, date, created_at')
            .eq('school_id', schoolId)
            .or(`date.eq.${today},created_at.gte.${today}T00:00:00Z`),
        ]);

        const attData = (attendanceToday.data as any[]) || [];
        const present = attData.filter(a => a.status === 'present').length;
        const rate = attData.length ? Math.round((present / attData.length) * 100) : 0;

        setKpis({
          students: studentsCount.count || 0,
          teachers: teachersCount.count || 0,
          classes: classesCount.count || 0,
          attendanceTodayRate: rate,
        });
      } catch (e) {
        // non-blocking
        console.warn('Failed loading KPIs', e);
      } finally {
        setKpisLoading(false);
      }
    };
    fetchKpis();
  }, [schoolId]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Tableau de bord - Admin École</h1>
        <p className="mt-2 text-gray-600">Vue d'ensemble et actions rapides pour votre établissement</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-primary-500 rounded-lg p-3"><Users className="h-6 w-6 text-white" /></div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Élèves</p>
              <p className="text-2xl font-semibold text-gray-900">{(loading || kpisLoading) ? '—' : (stats?.totalStudents ?? kpis.students)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-green-500 rounded-lg p-3"><UserCheck className="h-6 w-6 text-white" /></div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Enseignants</p>
              <p className="text-2xl font-semibold text-gray-900">{(loading || kpisLoading) ? '—' : (stats?.totalTeachers ?? kpis.teachers)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-indigo-500 rounded-lg p-3"><Layers className="h-6 w-6 text-white" /></div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Classes</p>
              <p className="text-2xl font-semibold text-gray-900">{(loading || kpisLoading) ? '—' : (stats?.totalClasses ?? kpis.classes)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-yellow-500 rounded-lg p-3"><Clock className="h-6 w-6 text-white" /></div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Présence Aujourd'hui</p>
              <p className="text-2xl font-semibold text-gray-900">{(loading || kpisLoading) ? '—' : `${kpis.attendanceTodayRate}%`}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <button onClick={() => navigate('/dashboard/students')} className="bg-white rounded-lg shadow p-5 hover:shadow-md transition flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-500">Gestion des élèves</div>
            <div className="text-lg font-semibold">Inscrire / Gérer</div>
          </div>
          <UserPlus className="h-6 w-6 text-primary-600" />
        </button>
        <button onClick={() => navigate('/dashboard/classes')} className="bg-white rounded-lg shadow p-5 hover:shadow-md transition flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-500">Gestion des enseignants</div>
            <div className="text-lg font-semibold">Assigner aux classes</div>
          </div>
          <BookOpen className="h-6 w-6 text-indigo-600" />
        </button>
        <button onClick={() => navigate('/dashboard/reports')} className="bg-white rounded-lg shadow p-5 hover:shadow-md transition flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-500">Rapports & Bulletins</div>
            <div className="text-lg font-semibold">Générer et Exporter</div>
          </div>
          <FileText className="h-6 w-6 text-green-600" />
        </button>
      </div>

      {/* Management Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Student Management */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2"><Users className="h-5 w-5 text-primary-600" /> Gestion des élèves</h2>
            <Link className="text-primary-600 text-sm hover:underline" to="/dashboard/students">Voir tout</Link>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <button onClick={() => navigate('/dashboard/students?tab=enroll')} className="inline-flex items-center justify-center px-4 py-2 rounded-md border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50">Inscrire un élève</button>
            <button onClick={() => navigate('/dashboard/attendance')} className="inline-flex items-center justify-center px-4 py-2 rounded-md border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50">Gérer la présence</button>
          </div>
        </div>

        {/* Teacher Management */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2"><UserCheck className="h-5 w-5 text-green-600" /> Gestion des enseignants</h2>
            <Link className="text-primary-600 text-sm hover:underline" to="/dashboard/classes">Voir tout</Link>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <button onClick={() => navigate('/dashboard/classes?tab=assign')} className="inline-flex items-center justify-center px-4 py-2 rounded-md border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50">Assigner à une classe</button>
            <button onClick={() => navigate('/dashboard/grades')} className="inline-flex items-center justify-center px-4 py-2 rounded-md border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50">Résumé des performances</button>
          </div>
        </div>

        {/* Class & Timetable Management */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2"><Layers className="h-5 w-5 text-indigo-600" /> Cours & Emploi du temps</h2>
            <Link className="text-primary-600 text-sm hover:underline" to="/dashboard/classes">Gérer</Link>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <button onClick={() => navigate('/dashboard/classes?tab=create')} className="inline-flex items-center justify-center px-4 py-2 rounded-md border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50">Créer une classe</button>
            <button onClick={() => navigate('/dashboard/pedagogie')} className="inline-flex items-center justify-center px-4 py-2 rounded-md border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50">Matières & Horaires</button>
          </div>
        </div>

        {/* Announcements & Communication */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2"><MessageSquare className="h-5 w-5 text-orange-600" /> Annonces & Communication</h2>
            <Link className="text-primary-600 text-sm hover:underline" to="/dashboard/messagerie">Ouvrir</Link>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <button onClick={() => navigate('/dashboard/messagerie?compose=all-teachers')} className="inline-flex items-center justify-center px-4 py-2 rounded-md border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50">Message aux enseignants</button>
            <button onClick={() => navigate('/dashboard/messagerie?compose=all-parents')} className="inline-flex items-center justify-center px-4 py-2 rounded-md border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50">Avis aux parents</button>
          </div>
        </div>

        {/* Reports & Analytics */}
        <div className="bg-white rounded-lg shadow lg:col-span-2">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2"><BarChart3 className="h-5 w-5 text-teal-600" /> Rapports & Analyses</h2>
            <Link className="text-primary-600 text-sm hover:underline" to="/dashboard/reports">Voir</Link>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 border">
              <div className="text-sm text-gray-500">Présence (aujourd'hui)</div>
              <div className="text-2xl font-bold">{(loading || kpisLoading) ? '—' : `${kpis.attendanceTodayRate}%`}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border">
              <div className="text-sm text-gray-500">Total élèves</div>
              <div className="text-2xl font-bold">{(loading || kpisLoading) ? '—' : (stats?.totalStudents ?? kpis.students)}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border">
              <div className="text-sm text-gray-500">Total classes</div>
              <div className="text-2xl font-bold">{(loading || kpisLoading) ? '—' : (stats?.totalClasses ?? kpis.classes)}</div>
            </div>
          </div>
          {/* Recent Activities */}
          <div className="px-6 pb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Activités récentes</h3>
            <div className="space-y-3">
              {loading && (<p className="text-sm text-gray-500">Chargement…</p>)}
              {error && (<p className="text-sm text-red-600">{error}</p>)}
              {!loading && recentActivities.length === 0 && (<p className="text-sm text-gray-500">Aucune activité récente</p>)}
              {recentActivities.slice(0,6).map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Clock className="h-4 w-4 text-blue-600" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.description || `${activity.userName} a effectué: ${activity.action}${activity.target ? ` sur ${activity.target}` : ''}`}</p>
                    <p className="text-xs text-gray-500">{new Date(activity.timestamp).toLocaleString('fr-FR')}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI-Powered Report Generator */}
        <div className="bg-white rounded-lg shadow lg:col-span-2">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2"><Sparkles className="h-5 w-5 text-fuchsia-600" /> Générateur de rapports (IA)</h2>
            <Link className="text-primary-600 text-sm hover:underline" to="/dashboard/reports">Ouvrir</Link>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <button onClick={() => navigate('/dashboard/reports')} className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-primary-600 text-white hover:bg-primary-700 gap-2"><Target className="h-4 w-4" /> Rapport Établissement</button>
            <button onClick={() => navigate('/dashboard/reports')} className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-primary-600 text-white hover:bg-primary-700 gap-2"><Layers className="h-4 w-4" /> Rapport par Classe</button>
            <button onClick={() => navigate('/dashboard/reports')} className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-primary-600 text-white hover:bg-primary-700 gap-2"><Users className="h-4 w-4" /> Rapport Élève</button>
          </div>
          <div className="px-6 pb-6 text-sm text-gray-600">
            Utilise les données Supabase (présence, notes, devoirs) pour générer automatiquement des rapports avec points forts, faiblesses et axes d'amélioration. Export en PDF inclus.
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolAdminDashboard;

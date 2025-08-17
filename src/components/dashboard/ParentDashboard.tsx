import React, { useEffect, useMemo, useState } from 'react';
import { User, Calendar, MessageSquare, CreditCard, FileText, BookOpen, Activity, AlertTriangle, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth, type UserWithProfile } from '../../contexts/AuthContext';
import { useParent } from '../../hooks/useParent';
import { useAIBulletin } from '../../hooks/useAIIntegration';

const ParentDashboard: React.FC = () => {
  const { user } = useAuth();
  const typedUser = user as UserWithProfile | null;
  const parentId = typedUser?.id ?? '';

  const { stats, children, messages, payments, loading, error, getChildGrades } = useParent(parentId);
  const [selectedChildId, setSelectedChildId] = useState<string>('');
  const [recentGrades, setRecentGrades] = useState<Array<{ subject: string; grade: number; date: string }>>([]);

  useEffect(() => {
    if (!selectedChildId && children.length > 0) {
      setSelectedChildId(children[0].id);
    }
  }, [children, selectedChildId]);

  useEffect(() => {
    const loadGrades = async () => {
      if (!selectedChildId) return;
      try {
        const grades = await getChildGrades(selectedChildId);
        setRecentGrades(
          grades
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 5)
            .map(g => ({ subject: g.subject, grade: g.value, date: g.date }))
        );
      } catch (_) {
        setRecentGrades([]);
      }
    };
    loadGrades();
  }, [selectedChildId, getChildGrades]);

  const selectedChild = useMemo(() => children.find(c => c.id === selectedChildId) || null, [children, selectedChildId]);

  const quickStats = useMemo(() => [
    { name: 'Présence', value: selectedChild ? `${selectedChild.attendance}%` : '—', icon: Activity, color: 'bg-secondary-600' },
    { name: 'Moyenne récente', value: selectedChild ? `${selectedChild.average}/20` : '—', icon: BookOpen, color: 'bg-primary-600' },
    { name: 'Devoirs/Examens à venir', value: '—', icon: Calendar, color: 'bg-primary-500' },
    { name: 'Frais scolaires', value: stats?.paymentStatus || '—', icon: CreditCard, color: 'bg-secondary-500' },
  ], [selectedChild, stats]);

  // AI Report Generation
  const ai = useAIBulletin();
  const [showAI, setShowAI] = useState(false);
  const [aiParams, setAiParams] = useState({ childId: '', semester: 'S1', year: new Date().getFullYear().toString() });
  const [aiOutput, setAiOutput] = useState<string>('');

  useEffect(() => {
    if (selectedChildId) {
      setAiParams((p) => ({ ...p, childId: selectedChildId }));
    }
  }, [selectedChildId]);

  const handleGenerateAIReport = async () => {
    if (!aiParams.childId) return;
    const res = await ai.generateStudentBulletin(aiParams.childId, aiParams.semester, aiParams.year);
    setAiOutput(res.content);
  };

  const handleExportPDF = () => {
    const w = window.open('', '_blank');
    if (!w) return;
    const content = `
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Rapport - ${selectedChild?.name || ''}</title>
          <style>
            body { font-family: ui-sans-serif, system-ui; padding: 24px; color: #212121; }
            h1 { color: #1E88E5; }
            .muted { color: #616161; }
            pre { white-space: pre-wrap; background: #fafafa; border: 1px solid #eee; padding: 16px; border-radius: 8px; }
          </style>
        </head>
        <body>
          <h1>Rapport de progrès</h1>
          <div class="muted">${new Date().toLocaleDateString('fr-FR')}</div>
          <h2>${selectedChild?.name || ''} • ${aiParams.semester} • ${aiParams.year}</h2>
          <pre>${aiOutput || ''}</pre>
          <script>window.print();</script>
        </body>
      </html>`;
    w.document.write(content);
    w.document.close();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header and child switcher */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: '#212121' }}>Portail Parent</h1>
          <p className="mt-1" style={{ color: '#616161' }}>Suivez les progrès de votre enfant</p>
        </div>
        <div className="flex items-center space-x-3">
          <label className="text-sm" style={{ color: '#616161' }}>Sélectionner l'enfant</label>
          <select
            value={selectedChildId}
            onChange={(e) => setSelectedChildId(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {children.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {quickStats.map((s, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className={`${s.color} rounded-lg p-3`}>
                <s.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium" style={{ color: '#616161' }}>{s.name}</p>
                <p className="text-2xl font-semibold" style={{ color: '#212121' }}>{s.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Widgets grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Announcements / Messages */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold" style={{ color: '#212121' }}>Messages des Enseignants</h2>
            <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: '#FBC02D', color: '#212121' }}>{messages.filter(m => m.isNew).length} nouveaux</span>
          </div>
          <div className="p-6 space-y-4">
            {error && <p className="text-sm text-red-600">{error}</p>}
            {loading && <p className="text-sm" style={{ color: '#616161' }}>Chargement…</p>}
            {!loading && messages.length === 0 && (
              <p className="text-sm" style={{ color: '#616161' }}>Aucun message</p>
            )}
            {messages.map((m) => (
              <div key={m.id} className="border border-gray-200 rounded-lg p-4 hover:shadow transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium" style={{ color: '#212121' }}>{m.teacherName} • {m.subject}</p>
                    <p className="text-xs" style={{ color: '#616161' }}>{new Date(m.timestamp).toLocaleString('fr-FR')}</p>
                  </div>
                  <MessageSquare className="h-5 w-5" style={{ color: '#1E88E5' }} />
                </div>
                <p className="mt-2 text-sm" style={{ color: '#212121' }}>{m.content}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Payment reminders */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold" style={{ color: '#212121' }}>Rappels de Paiement</h2>
            <CreditCard className="h-5 w-5" style={{ color: '#43A047' }} />
          </div>
          <div className="p-6 space-y-3">
            {payments.length === 0 && !loading && (
              <p className="text-sm" style={{ color: '#616161' }}>Aucun rappel</p>
            )}
            {payments.map((p) => (
              <div key={p.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium" style={{ color: '#212121' }}>{p.title}</p>
                  <p className="text-xs" style={{ color: '#616161' }}>{p.dueDate ? new Date(p.dueDate).toLocaleDateString('fr-FR') : '—'}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${p.status === 'paid' ? 'bg-green-100 text-green-800' : p.status === 'overdue' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {p.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent grades for selected child */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold" style={{ color: '#212121' }}>Notes récentes</h2>
          <a href="/dashboard/notes" className="text-sm flex items-center" style={{ color: '#1E88E5' }}>Voir tout <ArrowRight className="h-4 w-4 ml-1" /></a>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentGrades.length === 0 && (
            <p className="text-sm" style={{ color: '#616161' }}>Aucune note récente</p>
          )}
          {recentGrades.map((g, idx) => (
            <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:shadow transition-shadow">
              <p className="text-sm font-medium" style={{ color: '#212121' }}>{g.subject}</p>
              <p className="mt-1 text-xl font-semibold" style={{ color: '#1E88E5' }}>{g.grade}/20</p>
              <p className="text-xs mt-1" style={{ color: '#616161' }}>{new Date(g.date).toLocaleDateString('fr-FR')}</p>
            </div>
          ))}
        </div>
      </div>

      {/* AI Report Generator */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold" style={{ color: '#212121' }}>Générateur de Rapport (IA)</h2>
          <button onClick={() => setShowAI(!showAI)} className="px-3 py-2 rounded-md text-white" style={{ backgroundColor: '#1E88E5' }}>
            {showAI ? 'Fermer' : 'Ouvrir'}
          </button>
        </div>
        {showAI && (
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#616161' }}>Enfant</label>
                <select value={aiParams.childId} onChange={(e) => setAiParams({ ...aiParams, childId: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option value="">Sélectionnez</option>
                  {children.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#616161' }}>Semestre</label>
                <select value={aiParams.semester} onChange={(e) => setAiParams({ ...aiParams, semester: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md">
                  <option value="S1">S1</option>
                  <option value="S2">S2</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#616161' }}>Année</label>
                <input value={aiParams.year} onChange={(e) => setAiParams({ ...aiParams, year: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button onClick={handleGenerateAIReport} disabled={ai.loading || !aiParams.childId} className="px-4 py-2 rounded-md text-white disabled:opacity-50" style={{ backgroundColor: '#43A047' }}>
                <Sparkles className="h-4 w-4 inline mr-2" /> {ai.loading ? 'Génération…' : 'Générer'}
              </button>
              <button onClick={handleExportPDF} disabled={!aiOutput} className="px-4 py-2 rounded-md text-white disabled:opacity-50" style={{ backgroundColor: '#1E88E5' }}>
                <FileText className="h-4 w-4 inline mr-2" /> Exporter en PDF
              </button>
            </div>
            {ai.error && (
              <div className="flex items-center p-3 rounded bg-amber-50 border border-amber-200" style={{ color: '#212121' }}>
                <AlertTriangle className="h-4 w-4 mr-2" style={{ color: '#FBC02D' }} /> {ai.error}
              </div>
            )}
            {aiOutput && (
              <div className="p-4 rounded border border-gray-200 bg-gray-50 whitespace-pre-wrap text-sm" style={{ color: '#212121' }}>
                {aiOutput}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ParentDashboard;

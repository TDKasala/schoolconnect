import React, { useMemo, useRef, useState } from 'react';
import { useAuth, type UserWithProfile } from '../../contexts/AuthContext';
import ReportService, { type StudentReportData } from '../../services/reportService';

const ReportsPage: React.FC = () => {
  const { user } = useAuth();
  const typedUser = user as UserWithProfile | null;

  const [studentId, setStudentId] = useState('');
  const [report, setReport] = useState<StudentReportData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  const role = typedUser?.profile?.role ?? 'teacher';

  const service = useMemo(() => {
    return typedUser ? new ReportService(typedUser) : null;
  }, [typedUser]);

  const calculateAverage = (grades: StudentReportData['grades']) => {
    if (!grades || grades.length === 0) return 0;
    const valid = grades.filter(g => (g.grade ?? 0) > 0 && (g.max_grade ?? 0) > 0);
    if (valid.length === 0) return 0;
    return Math.round(
      (valid.reduce((sum, g) => sum + ((g.grade || 0) / (g.max_grade || 1)) * 20, 0) / valid.length) * 10
    ) / 10;
  };

  const calculateAttendanceRate = (attendance: StudentReportData['attendance']) => {
    if (!attendance || attendance.length === 0) return 100;
    const present = attendance.filter(a => a.status === 'present').length;
    return Math.round((present / attendance.length) * 100);
  };

  const strengthsImprovements = (grades: StudentReportData['grades']) => {
    const avg = calculateAverage(grades);
    const strengths: string[] = [];
    const improvements: string[] = [];
    if (avg >= 16) strengths.push('Excellente performance académique');
    else if (avg >= 14) strengths.push('Très bonne compréhension des matières');
    else if (avg >= 12) strengths.push('Base solide, progression continue');
    else improvements.push("Renforcer la maîtrise des concepts clés");

    // Subject-level hints
    const bySubject = new Map<string, { total: number; count: number }>();
    grades.forEach(g => {
      const s = (g.subject || 'Général').toString();
      if (!bySubject.has(s)) bySubject.set(s, { total: 0, count: 0 });
      const entry = bySubject.get(s)!;
      if ((g.grade ?? 0) > 0 && (g.max_grade ?? 0) > 0) {
        entry.total += ((g.grade || 0) / (g.max_grade || 1)) * 20;
        entry.count += 1;
      }
    });
    const subjectAverages = Array.from(bySubject.entries()).map(([s, v]) => ({
      subject: s,
      avg: v.count ? v.total / v.count : 0,
    }));
    subjectAverages.sort((a, b) => b.avg - a.avg);
    subjectAverages.slice(0, 2).forEach(s => strengths.push(`Point fort: ${s.subject} (${s.avg.toFixed(1)}/20)`));
    subjectAverages.slice(-2).forEach(s => improvements.push(`À améliorer: ${s.subject} (${s.avg.toFixed(1)}/20)`));

    return { strengths, improvements };
  };

  const suggestedNextSteps = (avg: number, attendanceRate: number) => {
    const steps: string[] = [];
    if (attendanceRate < 90) steps.push('Améliorer la régularité de présence');
    if (avg < 12) steps.push('Plan de soutien ciblé sur les matières faibles');
    steps.push('Fixer des objectifs hebdomadaires et suivre la progression');
    steps.push('Encourager la participation active en classe');
    return steps;
  };

  const onGenerate = async () => {
    setError(null);
    setReport(null);
    if (!service || !typedUser) {
      setError("Session invalide. Veuillez vous reconnecter.");
      return;
    }
    if (!studentId) {
      setError("Veuillez saisir l'ID de l'élève.");
      return;
    }
    try {
      setLoading(true);
      const data = await service.getStudentReportData(studentId);
      setReport(data);
    } catch (e: any) {
      setError(e?.message || 'Échec de la génération du rapport');
    } finally {
      setLoading(false);
    }
  };

  const onPrint = () => {
    const node = printRef.current;
    if (!node) return;
    const printContents = node.innerHTML;
    const w = window.open('', 'PRINT', 'height=800,width=1000');
    if (!w) return;
    w.document.write(`<!doctype html><html lang="fr"><head><title>Rapport Élève</title>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <style>
        body { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif; padding: 24px; color: #111827; }
        h1, h2, h3 { margin: 0 0 8px; }
        .card { border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin-bottom: 12px; }
        .muted { color: #6b7280; }
        .grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
        .badge { display:inline-block; padding: 2px 8px; border-radius: 12px; background:#eef2ff; color:#3730a3; font-size:12px; }
        .section-title { font-size: 16px; font-weight: 600; margin-top: 16px; margin-bottom: 8px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { text-align: left; border-bottom: 1px solid #e5e7eb; padding: 6px 4px; font-size: 12px; }
      </style>
    </head><body>`);
    w.document.write(printContents);
    w.document.write('</body></html>');
    w.document.close();
    w.focus();
    w.print();
    w.close();
  };

  const avg = report ? calculateAverage(report.grades) : 0;
  const att = report ? calculateAttendanceRate(report.attendance) : 100;
  const { strengths, improvements } = report ? strengthsImprovements(report.grades) : { strengths: [], improvements: [] };
  const steps = suggestedNextSteps(avg, att);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Rapports d'Élève</h1>
        <p className="text-gray-600">Générez des rapports de progression incluant notes, présence et recommandations.</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">ID Élève</label>
            <input
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder="Entrez l'ID de l'élève"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Rôles: {role === 'school_admin' ? 'Administrateur École' : role === 'teacher' ? 'Enseignant' : role === 'parent' ? 'Parent' : role}
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={onGenerate}
              disabled={loading || !studentId}
              className={`px-4 py-2 rounded-md text-white ${loading || !studentId ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary-600 hover:bg-primary-700'}`}
            >
              {loading ? 'Génération…' : 'Générer le rapport'}
            </button>
            <button
              onClick={onPrint}
              disabled={!report}
              className={`px-4 py-2 rounded-md text-white ${!report ? 'bg-gray-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
            >
              Exporter PDF
            </button>
          </div>
        </div>
        {error && (
          <div className="mt-4 p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
        )}
      </div>

      {/* Report Preview */}
      {report && (
        <div ref={printRef} className="bg-white rounded-lg shadow p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Rapport de Progression</h2>
              <p className="text-gray-600">
                {report.student?.first_name} {report.student?.last_name}
                {report.student?.class?.name ? (
                  <span className="ml-2 badge">{report.student?.class?.name}</span>
                ) : null}
              </p>
            </div>
            <div className="text-right text-sm text-gray-500">
              Généré le {new Date().toLocaleString('fr-FR')}
            </div>
          </div>

          {/* Highlights */}
          <div className="grid md:grid-cols-3 gap-4 mt-4">
            <div className="card">
              <div className="muted">Moyenne Générale</div>
              <div className="text-2xl font-bold text-primary-600">{avg}/20</div>
            </div>
            <div className="card">
              <div className="muted">Taux de Présence</div>
              <div className="text-2xl font-bold text-green-600">{att}%</div>
            </div>
            <div className="card">
              <div className="muted">Devoirs à venir</div>
              <div className="text-2xl font-bold text-purple-600">{report.homework.length}</div>
            </div>
          </div>

          {/* Grades Table */}
          <h3 className="section-title">Notes</h3>
          <div className="card">
            {report.grades.length === 0 ? (
              <div className="text-sm text-gray-500">Aucune note disponible.</div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Matière</th>
                    <th>Note</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {report.grades.slice(0, 20).map((g) => (
                    <tr key={g.id}>
                      <td>{g.subject || '—'}</td>
                      <td>{g.grade}/{g.max_grade}</td>
                      <td>{new Date(g.created_at).toLocaleDateString('fr-FR')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Attendance */}
          <h3 className="section-title">Présence</h3>
          <div className="card">
            {report.attendance.length === 0 ? (
              <div className="text-sm text-gray-500">Aucun enregistrement de présence.</div>
            ) : (
              <div className="text-sm text-gray-700">
                {att}% de présence sur {report.attendance.length} jours suivis.
              </div>
            )}
          </div>

          {/* Strengths & Improvements */}
          <h3 className="section-title">Points Forts</h3>
          <div className="card">
            {strengths.length === 0 ? (
              <div className="text-sm text-gray-500">—</div>
            ) : (
              <ul className="list-disc list-inside text-sm text-gray-700">
                {strengths.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            )}
          </div>

          <h3 className="section-title">Axes d'Amélioration</h3>
          <div className="card">
            {improvements.length === 0 ? (
              <div className="text-sm text-gray-500">—</div>
            ) : (
              <ul className="list-disc list-inside text-sm text-gray-700">
                {improvements.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            )}
          </div>

          {/* Next Steps */}
          <h3 className="section-title">Prochaines Étapes Recommandées</h3>
          <div className="card">
            <ul className="list-disc list-inside text-sm text-gray-700">
              {steps.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;

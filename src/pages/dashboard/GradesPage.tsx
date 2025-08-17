import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { classesService, type SchoolClass } from '../../services/classesService';
import { studentsService, type Student } from '../../services/studentsService';
import { gradesService, type EvaluationType, type GradeRow } from '../../services/gradesService';
import { useToast } from '../../contexts/ToastContext';

type GradeMap = Record<string, number | undefined>; // student_id -> grade

const formatDate = (d: Date) => d.toISOString().slice(0, 10);

const GradesPage: React.FC = () => {
  const { user } = useAuth();
  const toast = useToast();
  const schoolId = (user as any)?.profile?.school_id as string | undefined;
  const teacherId = (user as any)?.id as string | undefined;

  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [subject, setSubject] = useState<string>('');
  const [date, setDate] = useState<string>(formatDate(new Date()));
  const [evaluationType, setEvaluationType] = useState<EvaluationType>('devoir');
  const [students, setStudents] = useState<Student[]>([]);
  const [gradeByStudent, setGradeByStudent] = useState<GradeMap>({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string>('');

  // Load classes (teachers see only their assigned classes)
  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!schoolId) return;
      try {
        setLoading(true);
        const { data } = await classesService.listClasses({ schoolId, limit: 100, offset: 0 });
        if (mounted) {
          const filtered = teacherId ? data.filter((c) => c.teacher_id === teacherId) : data;
          setClasses(filtered);
        }
      } catch (e) {
        console.error('Failed to load classes', e);
      } finally {
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [schoolId]);

  // Load students and existing grades for class+subject+date
  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!schoolId || !selectedClassId || !subject || !date) {
        setStudents([]);
        setGradeByStudent({});
        return;
      }
      try {
        setLoading(true);
        const [stu, grades] = await Promise.all([
          studentsService.listByClass({ schoolId, classId: selectedClassId }),
          gradesService.listByClass({ classId: selectedClassId, subject, fromDate: date, toDate: date }),
        ]);
        if (!mounted) return;
        setStudents(stu);
        const map: GradeMap = {};
        for (const g of grades) map[g.student_id] = g.grade ?? undefined;
        setGradeByStudent(map);
      } catch (e) {
        console.error('Failed to load students/grades', e);
      } finally {
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [schoolId, selectedClassId, subject, date]);

  const handleGradeChange = (studentId: string, value: string) => {
    const num = value === '' ? undefined : Number(value);
    if (num === undefined || (num >= 0 && num <= 20)) {
      setGradeByStudent(prev => ({ ...prev, [studentId]: num }));
    }
  };

  const rowsToSave = useMemo(() => {
    if (!selectedClassId || !subject || !date) return [] as any[];
    return students
      .filter(s => gradeByStudent[s.id] !== undefined)
      .map<Partial<GradeRow>>((s) => ({
        student_id: s.id,
        class_id: selectedClassId,
        subject: subject.trim(),
        grade: gradeByStudent[s.id] as number,
        evaluation_type: evaluationType,
        teacher_id: teacherId!,
        date,
        comment: null,
      })) as any[];
  }, [students, gradeByStudent, selectedClassId, subject, date, evaluationType, teacherId]);

  const handleSave = async () => {
    if (!rowsToSave.length) {
      setMessage('Aucune note à enregistrer.');
      toast.info('Aucune note à enregistrer');
      return;
    }
    try {
      setSaving(true);
      await gradesService.replaceForClassSubjectDate({
        classId: selectedClassId,
        subject: subject.trim(),
        date,
        entries: rowsToSave as any,
      });
      setMessage('Notes enregistrées avec succès.');
      toast.success('Notes enregistrées');
    } catch (e) {
      console.error('Save grades failed', e);
      setMessage("Erreur lors de l'enregistrement des notes.");
      toast.error("Erreur lors de l'enregistrement des notes");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Notes</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Classe</label>
            <select
              className="w-full border rounded-lg px-3 py-2"
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
            >
              <option value="">Sélectionner une classe</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>{c.name}{c.level ? ` - ${c.level}` : ''}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Matière</label>
            <input
              type="text"
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Ex: Mathématiques"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type d'évaluation</label>
            <select
              className="w-full border rounded-lg px-3 py-2"
              value={evaluationType}
              onChange={(e) => setEvaluationType(e.target.value as EvaluationType)}
            >
              {(['devoir','interrogation','composition','examen'] as EvaluationType[]).map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              className="w-full border rounded-lg px-3 py-2"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>

        <div className="mb-4">
          <button
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50"
            onClick={handleSave}
            disabled={saving || !selectedClassId || !subject || !date}
          >
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>

        {message && (
          <div className="mb-4 text-sm text-gray-700">{message}</div>
        )}

        {!selectedClassId ? (
          <p className="text-gray-600">Veuillez sélectionner une classe pour commencer.</p>
        ) : !subject ? (
          <p className="text-gray-600">Veuillez saisir la matière.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Élève</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Note (0-20)</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr><td className="px-4 py-3" colSpan={2}>Chargement...</td></tr>
                ) : students.length === 0 ? (
                  <tr><td className="px-4 py-3" colSpan={2}>Aucun élève dans cette classe.</td></tr>
                ) : (
                  students.map((s) => (
                    <tr key={s.id}>
                      <td className="px-4 py-3 text-sm text-gray-900">{s.last_name} {s.first_name}</td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          min={0}
                          max={20}
                          step={0.5}
                          className="w-28 border rounded-lg px-2 py-1"
                          value={gradeByStudent[s.id] ?? ''}
                          onChange={(e) => handleGradeChange(s.id, e.target.value)}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default GradesPage;

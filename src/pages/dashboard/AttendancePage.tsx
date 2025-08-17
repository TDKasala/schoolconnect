import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { classesService, type SchoolClass } from '../../services/classesService';
import { studentsService, type Student } from '../../services/studentsService';
import { attendanceService, type AttendanceStatus } from '../../services/attendanceService';
import { useToast } from '../../contexts/ToastContext';

type StatusMap = Record<string, AttendanceStatus | undefined>; // key: student_id

const formatDate = (d: Date) => d.toISOString().slice(0, 10);

const AttendancePage: React.FC = () => {
  const { user } = useAuth();
  const toast = useToast();
  const schoolId = (user as any)?.profile?.school_id as string | undefined;
  const teacherId = (user as any)?.id as string | undefined;

  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [date, setDate] = useState<string>(formatDate(new Date()));
  const [students, setStudents] = useState<Student[]>([]);
  const [statusByStudent, setStatusByStudent] = useState<StatusMap>({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string>('');

  // Load classes for the school (teachers see only their assigned classes)
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

  // Load students and existing attendance when class/date changes
  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!schoolId || !selectedClassId || !date) {
        setStudents([]);
        setStatusByStudent({});
        return;
      }
      try {
        setLoading(true);
        const [stu, att] = await Promise.all([
          studentsService.listByClass({ schoolId, classId: selectedClassId }),
          attendanceService.listByClassAndDate({ classId: selectedClassId, date }),
        ]);

        if (!mounted) return;
        setStudents(stu);
        const map: StatusMap = {};
        for (const a of att) map[a.student_id] = a.status;
        setStatusByStudent(map);
      } catch (e) {
        console.error('Failed to load students/attendance', e);
      } finally {
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [schoolId, selectedClassId, date]);

  const handleSetStatus = (studentId: string, status: AttendanceStatus) => {
    setStatusByStudent(prev => ({ ...prev, [studentId]: status }));
  };

  const rowsToSave = useMemo(() => {
    if (!selectedClassId || !date) return [] as any[];
    return students
      .filter(s => statusByStudent[s.id])
      .map(s => ({
        student_id: s.id,
        class_id: selectedClassId,
        date,
        status: statusByStudent[s.id] as AttendanceStatus,
        teacher_id: teacherId ?? null,
        notes: null,
      }));
  }, [students, statusByStudent, selectedClassId, date, teacherId]);

  const handleSave = async () => {
    if (!rowsToSave.length) {
      setMessage('Aucun changement à enregistrer.');
      toast.info('Aucun changement à enregistrer');
      return;
    }
    try {
      setSaving(true);
      await attendanceService.replaceForClassAndDate({
        classId: selectedClassId,
        date,
        entries: rowsToSave as any,
      });
      setMessage('Présences enregistrées avec succès.');
      toast.success('Présences enregistrées');
    } catch (e) {
      console.error('Save attendance failed', e);
      setMessage("Erreur lors de l'enregistrement des présences.");
      toast.error("Erreur lors de l'enregistrement des présences");
    } finally {
      setSaving(false);
      // Refresh existing to reflect DB state
      try {
        const att = await attendanceService.listByClassAndDate({ classId: selectedClassId, date });
        const map: StatusMap = {};
        for (const a of att) map[a.student_id] = a.status;
        setStatusByStudent(map);
      } catch {}
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Présence</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              className="w-full border rounded-lg px-3 py-2"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="flex items-end">
            <button
              className="w-full md:w-auto bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50"
              onClick={handleSave}
              disabled={saving || !selectedClassId || !date}
            >
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </div>

        {message && (
          <div className="mb-4 text-sm text-gray-700">{message}</div>
        )}

        {!selectedClassId ? (
          <p className="text-gray-600">Veuillez sélectionner une classe pour commencer.</p>) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Élève</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Présent</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Absent</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Retard</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Excusé</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr><td className="px-4 py-3" colSpan={5}>Chargement...</td></tr>
                ) : students.length === 0 ? (
                  <tr><td className="px-4 py-3" colSpan={5}>Aucun élève dans cette classe.</td></tr>
                ) : (
                  students.map((s) => (
                    <tr key={s.id}>
                      <td className="px-4 py-3 text-sm text-gray-900">{s.last_name} {s.first_name}</td>
                      {(['present','absent','late','excused'] as AttendanceStatus[]).map(st => (
                        <td key={st} className="px-4 py-3">
                          <input
                            type="radio"
                            name={`status-${s.id}`}
                            checked={statusByStudent[s.id] === st}
                            onChange={() => handleSetStatus(s.id, st)}
                          />
                        </td>
                      ))}
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

export default AttendancePage;

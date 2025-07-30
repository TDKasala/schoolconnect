import { useState, useEffect, useCallback } from 'react';
import PedagogyService, { 
  PedagogyClass, 
  PedagogyStudent, 
  PedagogyGrade, 
  PedagogyAttendance, 
  ClassPerformance, 
  StudentPerformance 
} from '../services/pedagogyService';

export interface UsePedagogyReturn {
  classes: PedagogyClass[];
  students: PedagogyStudent[];
  loading: boolean;
  error: string | null;
  fetchClasses: () => Promise<void>;
  fetchClassStudents: (classId: string) => Promise<void>;
  fetchClassGrades: (classId: string) => Promise<void>;
  fetchClassAttendance: (classId: string, date?: Date) => Promise<void>;
  fetchStudentGrades: (studentId: string) => Promise<void>;
  fetchStudentAttendance: (studentId: string) => Promise<void>;
  addGrade: (gradeData: Omit<PedagogyGrade, 'id' | 'createdAt' | 'updatedAt'>) => Promise<PedagogyGrade>;
  updateGrade: (gradeId: string, gradeData: Partial<PedagogyGrade>) => Promise<PedagogyGrade>;
  recordAttendance: (attendanceData: Omit<PedagogyAttendance, 'id' | 'createdAt' | 'updatedAt'>) => Promise<PedagogyAttendance>;
  fetchClassPerformance: (classId: string) => Promise<ClassPerformance>;
  fetchStudentPerformance: (studentId: string) => Promise<StudentPerformance>;
  fetchStudents: () => Promise<void>;
  fetchStudent: (studentId: string) => Promise<PedagogyStudent>;
}

/**
 * Hook for pedagogy functionality
 */
export const usePedagogy = (userId: string, schoolId: string): UsePedagogyReturn => {
  const [classes, setClasses] = useState<PedagogyClass[]>([]);
  const [students, setStudents] = useState<PedagogyStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const pedagogyService = new PedagogyService(userId, schoolId);

  const fetchClasses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await pedagogyService.getClasses();
      setClasses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch classes');
    } finally {
      setLoading(false);
    }
  }, [userId, schoolId]);

  const fetchClassStudents = useCallback(async (classId: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await pedagogyService.getClassStudents(classId);
      setStudents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch class students');
    } finally {
      setLoading(false);
    }
  }, [userId, schoolId]);

  const fetchClassGrades = useCallback(async (classId: string) => {
    try {
      setError(null);
      // This function doesn't update state directly, but can be used to fetch data
      await pedagogyService.getClassGrades(classId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch class grades');
      throw err;
    }
  }, [userId, schoolId]);

  const fetchClassAttendance = useCallback(async (classId: string, date?: Date) => {
    try {
      setError(null);
      // This function doesn't update state directly, but can be used to fetch data
      await pedagogyService.getClassAttendance(classId, date);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch class attendance');
      throw err;
    }
  }, [userId, schoolId]);

  const fetchStudentGrades = useCallback(async (studentId: string) => {
    try {
      setError(null);
      // This function doesn't update state directly, but can be used to fetch data
      await pedagogyService.getStudentGrades(studentId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch student grades');
      throw err;
    }
  }, [userId, schoolId]);

  const fetchStudentAttendance = useCallback(async (studentId: string) => {
    try {
      setError(null);
      // This function doesn't update state directly, but can be used to fetch data
      await pedagogyService.getStudentAttendance(studentId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch student attendance');
      throw err;
    }
  }, [userId, schoolId]);

  const addGrade = useCallback(async (gradeData: Omit<PedagogyGrade, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setError(null);
      const newGrade = await pedagogyService.addGrade(gradeData);
      return newGrade;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add grade');
      throw err;
    }
  }, [userId, schoolId]);

  const updateGrade = useCallback(async (gradeId: string, gradeData: Partial<PedagogyGrade>) => {
    try {
      setError(null);
      const updatedGrade = await pedagogyService.updateGrade(gradeId, gradeData);
      return updatedGrade;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update grade');
      throw err;
    }
  }, [userId, schoolId]);

  const recordAttendance = useCallback(async (attendanceData: Omit<PedagogyAttendance, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setError(null);
      const newAttendance = await pedagogyService.recordAttendance(attendanceData);
      return newAttendance;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to record attendance');
      throw err;
    }
  }, [userId, schoolId]);

  const fetchClassPerformance = useCallback(async (classId: string) => {
    try {
      setError(null);
      const performance = await pedagogyService.getClassPerformance(classId);
      return performance;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch class performance');
      throw err;
    }
  }, [userId, schoolId]);

  const fetchStudentPerformance = useCallback(async (studentId: string) => {
    try {
      setError(null);
      const performance = await pedagogyService.getStudentPerformance(studentId);
      return performance;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch student performance');
      throw err;
    }
  }, [userId, schoolId]);

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await pedagogyService.getStudents();
      setStudents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch students');
    } finally {
      setLoading(false);
    }
  }, [userId, schoolId]);

  const fetchStudent = useCallback(async (studentId: string) => {
    try {
      setError(null);
      const student = await pedagogyService.getStudent(studentId);
      return student;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch student');
      throw err;
    }
  }, [userId, schoolId]);

  // Fetch initial data
  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  return {
    classes,
    students,
    loading,
    error,
    fetchClasses,
    fetchClassStudents,
    fetchClassGrades,
    fetchClassAttendance,
    fetchStudentGrades,
    fetchStudentAttendance,
    addGrade,
    updateGrade,
    recordAttendance,
    fetchClassPerformance,
    fetchStudentPerformance,
    fetchStudents,
    fetchStudent
  };
};

/**
 * Hook for class management
 */
export const useClassManagement = (userId: string, schoolId: string) => {
  const [classes, setClasses] = useState<PedagogyClass[]>([]);
  const [students, setStudents] = useState<PedagogyStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const pedagogyService = new PedagogyService(userId, schoolId);

  const fetchClasses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await pedagogyService.getClasses();
      setClasses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch classes');
    } finally {
      setLoading(false);
    }
  }, [userId, schoolId]);

  const fetchClassStudents = useCallback(async (classId: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await pedagogyService.getClassStudents(classId);
      setStudents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch class students');
    } finally {
      setLoading(false);
    }
  }, [userId, schoolId]);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  return {
    classes,
    students,
    loading,
    error,
    fetchClasses,
    fetchClassStudents
  };
};

/**
 * Hook for student performance
 */
export const useStudentPerformance = (userId: string, schoolId: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pedagogyService = new PedagogyService(userId, schoolId);

  const fetchStudentPerformance = useCallback(async (studentId: string) => {
    try {
      setLoading(true);
      setError(null);
      const performance = await pedagogyService.getStudentPerformance(studentId);
      return performance;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch student performance');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId, schoolId]);

  const fetchStudentGrades = useCallback(async (studentId: string) => {
    try {
      setError(null);
      const grades = await pedagogyService.getStudentGrades(studentId);
      return grades;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch student grades');
      throw err;
    }
  }, [userId, schoolId]);

  const fetchStudentAttendance = useCallback(async (studentId: string) => {
    try {
      setError(null);
      const attendance = await pedagogyService.getStudentAttendance(studentId);
      return attendance;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch student attendance');
      throw err;
    }
  }, [userId, schoolId]);

  return {
    loading,
    error,
    fetchStudentPerformance,
    fetchStudentGrades,
    fetchStudentAttendance
  };
};

/**
 * Hook for class performance
 */
export const useClassPerformance = (userId: string, schoolId: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pedagogyService = new PedagogyService(userId, schoolId);

  const fetchClassPerformance = useCallback(async (classId: string) => {
    try {
      setLoading(true);
      setError(null);
      const performance = await pedagogyService.getClassPerformance(classId);
      return performance;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch class performance');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId, schoolId]);

  const fetchClassGrades = useCallback(async (classId: string) => {
    try {
      setError(null);
      const grades = await pedagogyService.getClassGrades(classId);
      return grades;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch class grades');
      throw err;
    }
  }, [userId, schoolId]);

  const fetchClassAttendance = useCallback(async (classId: string, date?: Date) => {
    try {
      setError(null);
      const attendance = await pedagogyService.getClassAttendance(classId, date);
      return attendance;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch class attendance');
      throw err;
    }
  }, [userId, schoolId]);

  return {
    loading,
    error,
    fetchClassPerformance,
    fetchClassGrades,
    fetchClassAttendance
  };
};

/**
 * Hook for grades management
 */
export const useGradesManagement = (userId: string, schoolId: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pedagogyService = new PedagogyService(userId, schoolId);

  const addGrade = useCallback(async (gradeData: Omit<PedagogyGrade, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setLoading(true);
      setError(null);
      const newGrade = await pedagogyService.addGrade(gradeData);
      return newGrade;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add grade');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId, schoolId]);

  const updateGrade = useCallback(async (gradeId: string, gradeData: Partial<PedagogyGrade>) => {
    try {
      setLoading(true);
      setError(null);
      const updatedGrade = await pedagogyService.updateGrade(gradeId, gradeData);
      return updatedGrade;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update grade');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId, schoolId]);

  const fetchClassGrades = useCallback(async (classId: string) => {
    try {
      setError(null);
      const grades = await pedagogyService.getClassGrades(classId);
      return grades;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch class grades');
      throw err;
    }
  }, [userId, schoolId]);

  const fetchStudentGrades = useCallback(async (studentId: string) => {
    try {
      setError(null);
      const grades = await pedagogyService.getStudentGrades(studentId);
      return grades;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch student grades');
      throw err;
    }
  }, [userId, schoolId]);

  return {
    loading,
    error,
    addGrade,
    updateGrade,
    fetchClassGrades,
    fetchStudentGrades
  };
};

/**
 * Hook for attendance management
 */
export const useAttendanceManagement = (userId: string, schoolId: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pedagogyService = new PedagogyService(userId, schoolId);

  const recordAttendance = useCallback(async (attendanceData: Omit<PedagogyAttendance, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setLoading(true);
      setError(null);
      const newAttendance = await pedagogyService.recordAttendance(attendanceData);
      return newAttendance;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to record attendance');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId, schoolId]);

  const fetchClassAttendance = useCallback(async (classId: string, date?: Date) => {
    try {
      setError(null);
      const attendance = await pedagogyService.getClassAttendance(classId, date);
      return attendance;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch class attendance');
      throw err;
    }
  }, [userId, schoolId]);

  const fetchStudentAttendance = useCallback(async (studentId: string) => {
    try {
      setError(null);
      const attendance = await pedagogyService.getStudentAttendance(studentId);
      return attendance;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch student attendance');
      throw err;
    }
  }, [userId, schoolId]);

  return {
    loading,
    error,
    recordAttendance,
    fetchClassAttendance,
    fetchStudentAttendance
  };
};

export default usePedagogy;

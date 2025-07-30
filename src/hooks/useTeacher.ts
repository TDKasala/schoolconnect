import { useState, useEffect, useCallback } from 'react';
import TeacherService, {
  TeacherStats,
  ClassWithStats,
  RecentActivity,
  UpcomingTask,
  StudentWithGrades
} from '../services/teacherService';

export interface UseTeacherReturn {
  stats: TeacherStats | null;
  classes: ClassWithStats[];
  activities: RecentActivity[];
  tasks: UpcomingTask[];
  loading: boolean;
  error: string | null;
  refetchAll: () => Promise<void>;
  getStudentsWithGrades: (classId: string) => Promise<StudentWithGrades[]>;
  createHomework: (homeworkData: {
    classId: string;
    title: string;
    description: string;
    dueDate: string;
    subject: string;
  }) => Promise<void>;
  getHomework: (classId: string) => Promise<any[]>;
  updateGrades: (grades: {
    studentId: string;
    homeworkId: string;
    score: number;
    maxScore: number;
  }[]) => Promise<void>;
}

/**
 * Hook for teacher functionality
 */
export const useTeacher = (teacherId: string): UseTeacherReturn => {
  const [stats, setStats] = useState<TeacherStats | null>(null);
  const [classes, setClasses] = useState<ClassWithStats[]>([]);
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [tasks, setTasks] = useState<UpcomingTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const teacherService = new TeacherService(teacherId);

  const fetchStats = useCallback(async () => {
    try {
      const data = await teacherService.getTeacherStats();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stats');
    }
  }, [teacherId]);

  const fetchClasses = useCallback(async () => {
    try {
      const data = await teacherService.getClassesWithStats();
      setClasses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch classes');
    }
  }, [teacherId]);

  const fetchActivities = useCallback(async () => {
    try {
      const data = await teacherService.getRecentActivities();
      setActivities(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch activities');
    }
  }, [teacherId]);

  const fetchTasks = useCallback(async () => {
    try {
      const data = await teacherService.getUpcomingTasks();
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
    }
  }, [teacherId]);

  const getStudentsWithGrades = useCallback(async (classId: string) => {
    try {
      setError(null);
      return await teacherService.getStudentsWithGrades(classId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch students');
      throw err;
    }
  }, [teacherId]);

  const createHomework = useCallback(async (homeworkData: {
    classId: string;
    title: string;
    description: string;
    dueDate: string;
    subject: string;
  }) => {
    try {
      setError(null);
      await teacherService.createHomework(homeworkData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create homework');
      throw err;
    }
  }, [teacherId]);

  const getHomework = useCallback(async (classId: string) => {
    try {
      setError(null);
      return await teacherService.getHomework(classId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch homework');
      throw err;
    }
  }, [teacherId]);

  const updateGrades = useCallback(async (grades: {
    studentId: string;
    homeworkId: string;
    score: number;
    maxScore: number;
  }[]) => {
    try {
      setError(null);
      await teacherService.updateGrades(grades);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update grades');
      throw err;
    }
  }, [teacherId]);

  const refetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([
        fetchStats(),
        fetchClasses(),
        fetchActivities(),
        fetchTasks()
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh data');
    } finally {
      setLoading(false);
    }
  }, [fetchStats, fetchClasses, fetchActivities, fetchTasks]);

  useEffect(() => {
    refetchAll();
  }, [refetchAll]);

  return {
    stats,
    classes,
    activities,
    tasks,
    loading,
    error,
    refetchAll,
    getStudentsWithGrades,
    createHomework,
    getHomework,
    updateGrades
  };
};

/**
 * Hook for teacher statistics
 */
export const useTeacherStats = (teacherId: string) => {
  const [stats, setStats] = useState<TeacherStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const teacherService = new TeacherService(teacherId);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await teacherService.getTeacherStats();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  }, [teacherId]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats
  };
};

/**
 * Hook for teacher classes
 */
export const useTeacherClasses = (teacherId: string) => {
  const [classes, setClasses] = useState<ClassWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const teacherService = new TeacherService(teacherId);

  const fetchClasses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await teacherService.getClassesWithStats();
      setClasses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch classes');
    } finally {
      setLoading(false);
    }
  }, [teacherId]);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  return {
    classes,
    loading,
    error,
    refetch: fetchClasses
  };
};

/**
 * Hook for recent activities
 */
export const useTeacherActivities = (teacherId: string, limit: number = 10) => {
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const teacherService = new TeacherService(teacherId);

  const fetchActivities = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await teacherService.getRecentActivities(limit);
      setActivities(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch activities');
    } finally {
      setLoading(false);
    }
  }, [teacherId, limit]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  return {
    activities,
    loading,
    error,
    refetch: fetchActivities
  };
};

/**
 * Hook for upcoming tasks
 */
export const useTeacherTasks = (teacherId: string) => {
  const [tasks, setTasks] = useState<UpcomingTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const teacherService = new TeacherService(teacherId);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await teacherService.getUpcomingTasks();
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, [teacherId]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    tasks,
    loading,
    error,
    refetch: fetchTasks
  };
};

export default useTeacher;

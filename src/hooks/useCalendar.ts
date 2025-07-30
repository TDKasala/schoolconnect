import { useState, useEffect, useCallback } from 'react';
import CalendarService, { CalendarEvent, CalendarStats } from '../services/calendarService';

export interface UseCalendarReturn {
  events: CalendarEvent[];
  stats: CalendarStats | null;
  loading: boolean;
  error: string | null;
  fetchEventsByDateRange: (startDate: Date, endDate: Date) => Promise<void>;
  fetchMonthlyEvents: () => Promise<void>;
  fetchUpcomingEvents: (limit?: number) => Promise<void>;
  createEvent: (eventData: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>) => Promise<CalendarEvent>;
  updateEvent: (eventId: string, eventData: Partial<CalendarEvent>) => Promise<CalendarEvent>;
  deleteEvent: (eventId: string) => Promise<void>;
  fetchCalendarStats: () => Promise<void>;
  fetchClassEvents: (classId: string) => Promise<void>;
}

/**
 * Hook for calendar functionality
 */
export const useCalendar = (userId: string, schoolId: string): UseCalendarReturn => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [stats, setStats] = useState<CalendarStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const calendarService = new CalendarService(userId, schoolId);

  const fetchEventsByDateRange = useCallback(async (startDate: Date, endDate: Date) => {
    try {
      setLoading(true);
      setError(null);
      const data = await calendarService.getEventsByDateRange(startDate, endDate);
      setEvents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  }, [userId, schoolId]);

  const fetchMonthlyEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await calendarService.getMonthlyEvents();
      setEvents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch monthly events');
    } finally {
      setLoading(false);
    }
  }, [userId, schoolId]);

  const fetchUpcomingEvents = useCallback(async (limit: number = 5) => {
    try {
      setLoading(true);
      setError(null);
      const data = await calendarService.getUpcomingEvents(limit);
      setEvents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch upcoming events');
    } finally {
      setLoading(false);
    }
  }, [userId, schoolId]);

  const createEvent = useCallback(async (eventData: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setError(null);
      const newEvent = await calendarService.createEvent(eventData);
      setEvents(prev => [...prev, newEvent]);
      return newEvent;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create event');
      throw err;
    }
  }, [userId, schoolId]);

  const updateEvent = useCallback(async (eventId: string, eventData: Partial<CalendarEvent>) => {
    try {
      setError(null);
      const updatedEvent = await calendarService.updateEvent(eventId, eventData);
      setEvents(prev => prev.map(event => event.id === eventId ? updatedEvent : event));
      return updatedEvent;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update event');
      throw err;
    }
  }, [userId, schoolId]);

  const deleteEvent = useCallback(async (eventId: string) => {
    try {
      setError(null);
      await calendarService.deleteEvent(eventId);
      setEvents(prev => prev.filter(event => event.id !== eventId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete event');
      throw err;
    }
  }, [userId, schoolId]);

  const fetchCalendarStats = useCallback(async () => {
    try {
      setError(null);
      const data = await calendarService.getCalendarStats();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch calendar stats');
    }
  }, [userId, schoolId]);

  const fetchClassEvents = useCallback(async (classId: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await calendarService.getClassEvents(classId);
      setEvents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch class events');
    } finally {
      setLoading(false);
    }
  }, [userId, schoolId]);

  // Fetch initial data
  useEffect(() => {
    fetchMonthlyEvents();
    fetchCalendarStats();
  }, [fetchMonthlyEvents, fetchCalendarStats]);

  return {
    events,
    stats,
    loading,
    error,
    fetchEventsByDateRange,
    fetchMonthlyEvents,
    fetchUpcomingEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    fetchCalendarStats,
    fetchClassEvents
  };
};

/**
 * Hook for calendar events
 */
export const useCalendarEvents = (userId: string, schoolId: string) => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const calendarService = new CalendarService(userId, schoolId);

  const fetchEvents = useCallback(async (startDate: Date, endDate: Date) => {
    try {
      setLoading(true);
      setError(null);
      const data = await calendarService.getEventsByDateRange(startDate, endDate);
      setEvents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  }, [userId, schoolId]);

  const createEvent = useCallback(async (eventData: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setError(null);
      const newEvent = await calendarService.createEvent(eventData);
      setEvents(prev => [...prev, newEvent]);
      return newEvent;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create event');
      throw err;
    }
  }, [userId, schoolId]);

  const updateEvent = useCallback(async (eventId: string, eventData: Partial<CalendarEvent>) => {
    try {
      setError(null);
      const updatedEvent = await calendarService.updateEvent(eventId, eventData);
      setEvents(prev => prev.map(event => event.id === eventId ? updatedEvent : event));
      return updatedEvent;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update event');
      throw err;
    }
  }, [userId, schoolId]);

  const deleteEvent = useCallback(async (eventId: string) => {
    try {
      setError(null);
      await calendarService.deleteEvent(eventId);
      setEvents(prev => prev.filter(event => event.id !== eventId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete event');
      throw err;
    }
  }, [userId, schoolId]);

  return {
    events,
    loading,
    error,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent
  };
};

/**
 * Hook for calendar statistics
 */
export const useCalendarStats = (userId: string, schoolId: string) => {
  const [stats, setStats] = useState<CalendarStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const calendarService = new CalendarService(userId, schoolId);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await calendarService.getCalendarStats();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  }, [userId, schoolId]);

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

export default useCalendar;

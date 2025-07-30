import { supabase } from '../lib/supabase';
import { Event } from '../types';

export interface CalendarEvent extends Event {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  location?: string;
  eventType: 'meeting' | 'exam' | 'activity' | 'holiday' | 'other';
  createdBy: string;
  schoolId: string;
  classId?: string;
  isAllDay?: boolean;
  color?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CalendarStats {
  totalEvents: number;
  upcomingEvents: number;
  meetings: number;
  exams: number;
  activities: number;
}

export class CalendarService {
  private userId: string;
  private schoolId: string;

  constructor(userId: string, schoolId: string) {
    this.userId = userId;
    this.schoolId = schoolId;
  }

  /**
   * Get events for a specific date range
   */
  async getEventsByDateRange(startDate: Date, endDate: Date): Promise<CalendarEvent[]> {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('school_id', this.schoolId)
        .gte('start_date', startDate.toISOString())
        .lte('end_date', endDate.toISOString())
        .order('start_date', { ascending: true });

      if (error) throw error;

      return data?.map(event => ({
        id: event.id,
        title: event.title,
        description: event.description,
        startDate: new Date(event.start_date),
        endDate: new Date(event.end_date),
        location: event.location,
        eventType: event.event_type,
        createdBy: event.created_by,
        schoolId: event.school_id,
        classId: event.class_id,
        isAllDay: event.is_all_day,
        color: event.color,
        createdAt: new Date(event.created_at),
        updatedAt: new Date(event.updated_at)
      })) || [];
    } catch (error) {
      console.error('Error fetching events:', error);
      throw new Error('Failed to fetch events');
    }
  }

  /**
   * Get events for the current month
   */
  async getMonthlyEvents(): Promise<CalendarEvent[]> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    return this.getEventsByDateRange(startOfMonth, endOfMonth);
  }

  /**
   * Get upcoming events
   */
  async getUpcomingEvents(limit: number = 5): Promise<CalendarEvent[]> {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('school_id', this.schoolId)
        .gte('start_date', new Date().toISOString())
        .order('start_date', { ascending: true })
        .limit(limit);

      if (error) throw error;

      return data?.map(event => ({
        id: event.id,
        title: event.title,
        description: event.description,
        startDate: new Date(event.start_date),
        endDate: new Date(event.end_date),
        location: event.location,
        eventType: event.event_type,
        createdBy: event.created_by,
        schoolId: event.school_id,
        classId: event.class_id,
        isAllDay: event.is_all_day,
        color: event.color,
        createdAt: new Date(event.created_at),
        updatedAt: new Date(event.updated_at)
      })) || [];
    } catch (error) {
      console.error('Error fetching upcoming events:', error);
      throw new Error('Failed to fetch upcoming events');
    }
  }

  /**
   * Create a new event
   */
  async createEvent(eventData: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>): Promise<CalendarEvent> {
    try {
      const { data, error } = await supabase
        .from('events')
        .insert({
          title: eventData.title,
          description: eventData.description,
          start_date: eventData.startDate.toISOString(),
          end_date: eventData.endDate.toISOString(),
          location: eventData.location,
          event_type: eventData.eventType,
          created_by: this.userId,
          school_id: this.schoolId,
          class_id: eventData.classId,
          is_all_day: eventData.isAllDay
        })
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        title: data.title,
        description: data.description,
        startDate: new Date(data.start_date),
        endDate: new Date(data.end_date),
        location: data.location,
        eventType: data.event_type,
        createdBy: data.created_by,
        schoolId: data.school_id,
        classId: data.class_id,
        isAllDay: data.is_all_day,
        color: data.color,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };
    } catch (error) {
      console.error('Error creating event:', error);
      throw new Error('Failed to create event');
    }
  }

  /**
   * Update an existing event
   */
  async updateEvent(eventId: string, eventData: Partial<CalendarEvent>): Promise<CalendarEvent> {
    try {
      const { data, error } = await supabase
        .from('events')
        .update({
          title: eventData.title,
          description: eventData.description,
          start_date: eventData.startDate?.toISOString(),
          end_date: eventData.endDate?.toISOString(),
          location: eventData.location,
          event_type: eventData.eventType,
          class_id: eventData.classId,
          is_all_day: eventData.isAllDay,
          updated_at: new Date().toISOString()
        })
        .eq('id', eventId)
        .eq('school_id', this.schoolId)
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        title: data.title,
        description: data.description,
        startDate: new Date(data.start_date),
        endDate: new Date(data.end_date),
        location: data.location,
        eventType: data.event_type,
        createdBy: data.created_by,
        schoolId: data.school_id,
        classId: data.class_id,
        isAllDay: data.is_all_day,
        color: data.color,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };
    } catch (error) {
      console.error('Error updating event:', error);
      throw new Error('Failed to update event');
    }
  }

  /**
   * Delete an event
   */
  async deleteEvent(eventId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId)
        .eq('school_id', this.schoolId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting event:', error);
      throw new Error('Failed to delete event');
    }
  }

  /**
   * Get calendar statistics
   */
  async getCalendarStats(): Promise<CalendarStats> {
    try {
      // Get total events
      const { count: totalEvents, error: totalError } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true })
        .eq('school_id', this.schoolId);

      if (totalError) throw totalError;

      // Get upcoming events (next 30 days)
      const next30Days = new Date();
      next30Days.setDate(next30Days.getDate() + 30);
      
      const { count: upcomingEvents, error: upcomingError } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true })
        .eq('school_id', this.schoolId)
        .gte('start_date', new Date().toISOString())
        .lte('start_date', next30Days.toISOString());

      if (upcomingError) throw upcomingError;

      // Get event type counts
      const { data: eventTypeData, error: eventTypeError } = await supabase
        .from('events')
        .select('event_type')
        .eq('school_id', this.schoolId);

      if (eventTypeError) throw eventTypeError;

      const meetings = eventTypeData?.filter(e => e.event_type === 'meeting').length || 0;
      const exams = eventTypeData?.filter(e => e.event_type === 'exam').length || 0;
      const activities = eventTypeData?.filter(e => e.event_type === 'activity').length || 0;

      return {
        totalEvents: totalEvents || 0,
        upcomingEvents: upcomingEvents || 0,
        meetings,
        exams,
        activities
      };
    } catch (error) {
      console.error('Error fetching calendar stats:', error);
      throw new Error('Failed to fetch calendar statistics');
    }
  }

  /**
   * Get events for a specific class
   */
  async getClassEvents(classId: string): Promise<CalendarEvent[]> {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('class_id', classId)
        .eq('school_id', this.schoolId)
        .order('start_date', { ascending: true });

      if (error) throw error;

      return data?.map(event => ({
        id: event.id,
        title: event.title,
        description: event.description,
        startDate: new Date(event.start_date),
        endDate: new Date(event.end_date),
        location: event.location,
        eventType: event.event_type,
        createdBy: event.created_by,
        schoolId: event.school_id,
        classId: event.class_id,
        isAllDay: event.is_all_day,
        color: event.color,
        createdAt: new Date(event.created_at),
        updatedAt: new Date(event.updated_at)
      })) || [];
    } catch (error) {
      console.error('Error fetching class events:', error);
      throw new Error('Failed to fetch class events');
    }
  }
}

export default CalendarService;

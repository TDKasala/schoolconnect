export type UserRole = 'platform_admin' | 'school_admin' | 'teacher' | 'parent';

// Core user shape used by services (not Supabase Auth user)
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  schoolId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Role {
  id: string;
  name: string;
  display_name: string;
  description?: string;
  permissions: Record<string, string[]>;
  level: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface School {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  logo?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Class {
  id: string;
  name: string;
  level: string;
  schoolId: string;
  teacherIds: string[];
  studentIds: string[];
  subjects: Subject[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Subject {
  id: string;
  name: string;
  teacherId: string;
  classId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: 'M' | 'F';
  parentId?: string;
  classId: string;
  schoolId: string;
  enrollmentDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Grade {
  id: string;
  studentId: string;
  subjectId: string;
  evaluationType: string;
  score: number;
  maxScore: number;
  date: Date;
  teacherId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  read: boolean;
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage?: Message;
  updatedAt: Date;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: Date;
  startTime?: string;
  endTime?: string;
  type: 'exam' | 'holiday' | 'meeting' | 'event';
  schoolId: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}


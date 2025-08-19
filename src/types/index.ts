// Core types for SchoolConnect

export type UserRole = 'platform_admin' | 'school_admin' | 'teacher' | 'parent'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  schoolId?: string
  createdAt: Date
  updatedAt: Date
}

export interface School {
  id: string
  name: string
  address: string
  phone: string
  email: string
  createdAt: Date
  updatedAt: Date
}

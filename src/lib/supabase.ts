import { createClient } from '@supabase/supabase-js'

// Access environment variables with proper Vite typing
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'

// Create a mock client if no real credentials are provided
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string
          role: 'platform_admin' | 'school_admin' | 'teacher' | 'parent'
          school_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['users']['Insert']>
      }
      schools: {
        Row: {
          id: string
          name: string
          address: string
          phone: string
          email: string
          subscription_type: 'flex' | 'forfait'
          max_students: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['schools']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['schools']['Insert']>
      }
      students: {
        Row: {
          id: string
          school_id: string
          first_name: string
          last_name: string
          class_id: string
          parent_email: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['students']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['students']['Insert']>
      }
      classes: {
        Row: {
          id: string
          school_id: string
          name: string
          level: string
          teacher_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['classes']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['classes']['Insert']>
      }
      grades: {
        Row: {
          id: string
          student_id: string
          subject: string
          grade: number
          evaluation: string
          teacher_id: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['grades']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['grades']['Insert']>
      }
      payments: {
        Row: {
          id: string
          school_id: string
          student_id: string | null
          amount: number
          type: 'school_fee' | 'registration' | 'other'
          status: 'pending' | 'paid' | 'overdue'
          due_date: string
          paid_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['payments']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['payments']['Insert']>
      }
      messages: {
        Row: {
          id: string
          sender_id: string
          receiver_id: string
          content: string
          type: 'direct' | 'group'
          read: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['messages']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['messages']['Insert']>
      }
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

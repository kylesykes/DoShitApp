import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      task_lists: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          user_id: string
          list_id: string | null
          title: string
          description: string | null
          time_bucket: 'S' | 'M' | 'L'
          category: string | null
          difficulty: number | null
          is_completed: boolean
          archived_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          list_id?: string | null
          title: string
          description?: string | null
          time_bucket: 'S' | 'M' | 'L'
          category?: string | null
          difficulty?: number | null
          is_completed?: boolean
          archived_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          list_id?: string | null
          title?: string
          description?: string | null
          time_bucket?: 'S' | 'M' | 'L'
          category?: string | null
          difficulty?: number | null
          is_completed?: boolean
          archived_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      task_sessions: {
        Row: {
          id: string
          user_id: string
          task_id: string
          started_at: string
          completed_at: string | null
          planned_duration: number
          actual_duration: number | null
          was_completed: boolean
          mood_before: 'good' | 'neutral' | 'bad' | null
          mood_after: 'good' | 'neutral' | 'bad' | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          task_id: string
          started_at?: string
          completed_at?: string | null
          planned_duration: number
          actual_duration?: number | null
          was_completed?: boolean
          mood_before?: 'good' | 'neutral' | 'bad' | null
          mood_after?: 'good' | 'neutral' | 'bad' | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          task_id?: string
          started_at?: string
          completed_at?: string | null
          planned_duration?: number
          actual_duration?: number | null
          was_completed?: boolean
          mood_before?: 'good' | 'neutral' | 'bad' | null
          mood_after?: 'good' | 'neutral' | 'bad' | null
          notes?: string | null
          created_at?: string
        }
      }
    }
  }
}
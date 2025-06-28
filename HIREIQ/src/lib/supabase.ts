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
      interview_sessions: {
        Row: {
          id: string
          user_id: string
          job_role: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          job_role: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          job_role?: string
          created_at?: string
          updated_at?: string
        }
      }
      interview_qa: {
        Row: {
          id: string
          session_id: string
          question: string
          answer: string
          clarity_score: number
          confidence_score: number
          relevance_score: number
          feedback: string
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          question: string
          answer: string
          clarity_score: number
          confidence_score: number
          relevance_score: number
          feedback: string
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          question?: string
          answer?: string
          clarity_score?: number
          confidence_score?: number
          relevance_score?: number
          feedback?: string
          created_at?: string
        }
      }
    }
  }
}
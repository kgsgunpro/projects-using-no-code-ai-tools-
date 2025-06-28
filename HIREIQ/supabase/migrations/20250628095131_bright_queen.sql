/*
  # Create interview tables

  1. New Tables
    - `interview_sessions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `job_role` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    - `interview_qa`
      - `id` (uuid, primary key)
      - `session_id` (uuid, references interview_sessions)
      - `question` (text)
      - `answer` (text)
      - `clarity_score` (integer)
      - `confidence_score` (integer)
      - `relevance_score` (integer)
      - `feedback` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own data
*/

-- Create interview_sessions table
CREATE TABLE IF NOT EXISTS interview_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  job_role text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create interview_qa table
CREATE TABLE IF NOT EXISTS interview_qa (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES interview_sessions(id) ON DELETE CASCADE NOT NULL,
  question text NOT NULL,
  answer text NOT NULL,
  clarity_score integer NOT NULL CHECK (clarity_score >= 0 AND clarity_score <= 100),
  confidence_score integer NOT NULL CHECK (confidence_score >= 0 AND confidence_score <= 100),
  relevance_score integer NOT NULL CHECK (relevance_score >= 0 AND relevance_score <= 100),
  feedback text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE interview_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_qa ENABLE ROW LEVEL SECURITY;

-- Create policies for interview_sessions
CREATE POLICY "Users can create their own sessions"
  ON interview_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read their own sessions"
  ON interview_sessions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own sessions"
  ON interview_sessions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sessions"
  ON interview_sessions
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for interview_qa
CREATE POLICY "Users can create QA for their sessions"
  ON interview_qa
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM interview_sessions 
      WHERE id = session_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can read QA from their sessions"
  ON interview_qa
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM interview_sessions 
      WHERE id = session_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update QA from their sessions"
  ON interview_qa
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM interview_sessions 
      WHERE id = session_id AND user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM interview_sessions 
      WHERE id = session_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete QA from their sessions"
  ON interview_qa
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM interview_sessions 
      WHERE id = session_id AND user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_interview_sessions_user_id ON interview_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_interview_sessions_created_at ON interview_sessions(created_at);
CREATE INDEX IF NOT EXISTS idx_interview_qa_session_id ON interview_qa(session_id);
CREATE INDEX IF NOT EXISTS idx_interview_qa_created_at ON interview_qa(created_at);

-- Create updated_at trigger for interview_sessions
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_interview_sessions_updated_at
  BEFORE UPDATE ON interview_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
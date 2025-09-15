-- Enable RLS
ALTER TABLE IF EXISTS public.task_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.task_sessions ENABLE ROW LEVEL SECURITY;

-- Create task_lists table
CREATE TABLE IF NOT EXISTS public.task_lists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  list_id UUID REFERENCES public.task_lists(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  time_bucket TEXT NOT NULL CHECK (time_bucket IN ('S', 'M', 'L')),
  category TEXT,
  difficulty INTEGER CHECK (difficulty >= 1 AND difficulty <= 5),
  is_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create task_sessions table
CREATE TABLE IF NOT EXISTS public.task_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  planned_duration INTEGER NOT NULL, -- in minutes
  actual_duration INTEGER, -- in minutes
  was_completed BOOLEAN DEFAULT FALSE,
  mood_before TEXT CHECK (mood_before IN ('good', 'neutral', 'bad')),
  mood_after TEXT CHECK (mood_after IN ('good', 'neutral', 'bad')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_task_lists_user_id ON public.task_lists(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON public.tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_list_id ON public.tasks(list_id);
CREATE INDEX IF NOT EXISTS idx_tasks_time_bucket ON public.tasks(time_bucket);
CREATE INDEX IF NOT EXISTS idx_tasks_is_completed ON public.tasks(is_completed);
CREATE INDEX IF NOT EXISTS idx_task_sessions_user_id ON public.task_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_task_sessions_task_id ON public.task_sessions(task_id);

-- RLS Policies for task_lists
DROP POLICY IF EXISTS "Users can only see their own task lists" ON public.task_lists;
CREATE POLICY "Users can only see their own task lists" ON public.task_lists
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for tasks
DROP POLICY IF EXISTS "Users can only see their own tasks" ON public.tasks;
CREATE POLICY "Users can only see their own tasks" ON public.tasks
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for task_sessions
DROP POLICY IF EXISTS "Users can only see their own task sessions" ON public.task_sessions;
CREATE POLICY "Users can only see their own task sessions" ON public.task_sessions
  FOR ALL USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to automatically update updated_at
DROP TRIGGER IF EXISTS update_task_lists_updated_at ON public.task_lists;
CREATE TRIGGER update_task_lists_updated_at
  BEFORE UPDATE ON public.task_lists
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_tasks_updated_at ON public.tasks;
CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
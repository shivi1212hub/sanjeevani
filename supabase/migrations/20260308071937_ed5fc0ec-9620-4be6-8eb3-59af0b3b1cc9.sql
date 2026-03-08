
-- Table to track medication dose logs (taken/missed/skipped)
CREATE TABLE public.medication_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  medication_id UUID NOT NULL REFERENCES public.medications(id) ON DELETE CASCADE,
  scheduled_time TEXT NOT NULL,
  scheduled_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('taken', 'missed', 'skipped', 'pending')),
  taken_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.medication_logs ENABLE ROW LEVEL SECURITY;

-- Users can only view their own logs
CREATE POLICY "Users can view own medication logs"
  ON public.medication_logs FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own logs
CREATE POLICY "Users can insert own medication logs"
  ON public.medication_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own logs
CREATE POLICY "Users can update own medication logs"
  ON public.medication_logs FOR UPDATE
  USING (auth.uid() = user_id);

-- Unique constraint to prevent duplicate logs
CREATE UNIQUE INDEX idx_medication_logs_unique 
  ON public.medication_logs(medication_id, scheduled_date, scheduled_time);

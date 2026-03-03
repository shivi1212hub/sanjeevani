
-- Create medications table
CREATE TABLE public.medications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  dosage TEXT,
  schedule_times TEXT[] NOT NULL DEFAULT '{}',
  notes TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.medications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own medications"
ON public.medications FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own medications"
ON public.medications FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own medications"
ON public.medications FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own medications"
ON public.medications FOR DELETE
USING (auth.uid() = user_id);

CREATE TRIGGER update_medications_updated_at
BEFORE UPDATE ON public.medications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

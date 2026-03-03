
-- Add admin to the app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'admin';

-- Create warrior_applications table
CREATE TABLE public.warrior_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  reason TEXT,
  experience TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  reviewed_by UUID,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE public.warrior_applications ENABLE ROW LEVEL SECURITY;

-- Patients can create their own application
CREATE POLICY "Users can insert own application"
ON public.warrior_applications FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can view their own application
CREATE POLICY "Users can view own application"
ON public.warrior_applications FOR SELECT
USING (auth.uid() = user_id);

-- Warriors (acting as admins/senior warriors) can view all applications
CREATE POLICY "Warriors can view all applications"
ON public.warrior_applications FOR SELECT
USING (public.has_role(auth.uid(), 'warrior'));

-- Warriors can update applications (approve/reject)
CREATE POLICY "Warriors can update applications"
ON public.warrior_applications FOR UPDATE
USING (public.has_role(auth.uid(), 'warrior'));

-- Warriors can insert roles when approving
CREATE POLICY "Warriors can grant warrior role"
ON public.user_roles FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'warrior'));

-- Trigger for updated_at
CREATE TRIGGER update_warrior_applications_updated_at
BEFORE UPDATE ON public.warrior_applications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.warrior_applications;

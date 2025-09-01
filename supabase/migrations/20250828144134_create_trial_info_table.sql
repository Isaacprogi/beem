-- Create trial_info table
CREATE TABLE public.trial_info (
  user_id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  trial_started_at TIMESTAMPTZ,
  trial_page_views INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.trial_info ENABLE ROW LEVEL SECURITY;

-- Policies for trial_info
-- Users can view their own trial info
CREATE POLICY "Users can view their own trial info"
ON public.trial_info
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own trial info
CREATE POLICY "Users can insert their own trial info"
ON public.trial_info
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own trial info
CREATE POLICY "Users can update their own trial info"
ON public.trial_info
FOR UPDATE
USING (auth.uid() = user_id);

-- Trigger to update 'updated_at' column
CREATE TRIGGER update_trial_info_updated_at
  BEFORE UPDATE ON public.trial_info
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

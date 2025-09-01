-- Create tracking_events table
CREATE TABLE public.tracking_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_name TEXT NOT NULL,
  path TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  metadata JSONB
);

-- Enable RLS
ALTER TABLE public.tracking_events ENABLE ROW LEVEL SECURITY;

-- Policies for tracking_events
-- Allow authenticated users to insert their own tracking events
CREATE POLICY "Allow authenticated users to insert their own tracking events"
ON public.tracking_events
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Allow anonymous users to insert tracking events (user_id will be null)
CREATE POLICY "Allow anonymous users to insert tracking events"
ON public.tracking_events
FOR INSERT
TO anon
WITH CHECK (user_id IS NULL);

-- Disallow client-side select, update, delete
CREATE POLICY "Disallow select from client"
ON public.tracking_events
FOR SELECT
USING (false);

CREATE POLICY "Disallow update from client"
ON public.tracking_events
FOR UPDATE
USING (false);

CREATE POLICY "Disallow delete from client"
ON public.tracking_events
FOR DELETE
USING (false);

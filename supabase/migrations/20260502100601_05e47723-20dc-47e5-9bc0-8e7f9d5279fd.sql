-- Orders table for service requests
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  service_title TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  customer_phone TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT orders_status_check CHECK (status IN ('pending','in_progress','completed','cancelled')),
  CONSTRAINT orders_name_len CHECK (char_length(customer_name) BETWEEN 1 AND 200),
  CONSTRAINT orders_service_len CHECK (char_length(service_title) BETWEEN 1 AND 200),
  CONSTRAINT orders_notes_len CHECK (notes IS NULL OR char_length(notes) <= 5000)
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Orders: anyone insert"
  ON public.orders FOR INSERT
  WITH CHECK (user_id IS NOT NULL);

CREATE POLICY "Orders: owner read"
  ON public.orders FOR SELECT
  USING ((auth.uid() = user_id) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Orders: owner update"
  ON public.orders FOR UPDATE
  USING ((auth.uid() = user_id) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Orders: owner delete"
  ON public.orders FOR DELETE
  USING ((auth.uid() = user_id) OR has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER orders_set_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_orders_status ON public.orders(status);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;

-- Allow admins to view all profiles & roles for user management
CREATE POLICY "Profiles: admins view all"
  ON public.profiles FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Profiles: admins update all"
  ON public.profiles FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Profiles: admins delete"
  ON public.profiles FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));
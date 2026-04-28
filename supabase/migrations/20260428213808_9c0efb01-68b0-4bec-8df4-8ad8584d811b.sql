
-- Fix function search_path
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

-- Restrict EXECUTE on security definer functions
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;

-- Tighten permissive insert policies with basic anti-abuse checks
DROP POLICY "Messages: anyone insert" ON public.messages;
CREATE POLICY "Messages: anyone insert" ON public.messages
  FOR INSERT WITH CHECK (
    user_id IS NOT NULL
    AND length(sender_name) BETWEEN 1 AND 200
    AND length(content) BETWEEN 1 AND 5000
  );

DROP POLICY "Clicks: anyone insert" ON public.click_logs;
CREATE POLICY "Clicks: anyone insert" ON public.click_logs
  FOR INSERT WITH CHECK (
    user_id IS NOT NULL
    AND (source IS NULL OR length(source) <= 100)
  );

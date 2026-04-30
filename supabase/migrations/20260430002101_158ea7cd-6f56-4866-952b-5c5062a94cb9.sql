-- Site content: editable text content for the public homepage
CREATE TABLE public.site_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  hero_badge TEXT,
  hero_title_1 TEXT,
  hero_title_2 TEXT,
  hero_title_precision TEXT,
  hero_desc TEXT,
  hero_cta_view TEXT,
  hero_cta_start TEXT,
  hero_stat_projects TEXT,
  hero_stat_years TEXT,
  hero_stat_clients TEXT,
  hero_stat_uptime TEXT,
  hero_stat_projects_value TEXT,
  hero_stat_years_value TEXT,
  hero_stat_clients_value TEXT,
  hero_stat_uptime_value TEXT,
  about_title_1 TEXT,
  about_title_2 TEXT,
  about_title_serious TEXT,
  about_p1 TEXT,
  about_p2 TEXT,
  contact_email TEXT,
  contact_location TEXT,
  contact_whatsapp_display TEXT,
  brand_name TEXT,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "SiteContent: public read published" ON public.site_content
  FOR SELECT USING (is_published = true OR auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "SiteContent: owner upsert" ON public.site_content
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "SiteContent: owner update" ON public.site_content
  FOR UPDATE USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "SiteContent: owner delete" ON public.site_content
  FOR DELETE USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER trg_site_content_updated_at
BEFORE UPDATE ON public.site_content
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Site skills (groups + items)
CREATE TABLE public.site_skills (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  group_title TEXT NOT NULL,
  items TEXT[] NOT NULL DEFAULT '{}',
  sort_order INT NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.site_skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "SiteSkills: public read published" ON public.site_skills
  FOR SELECT USING (is_published = true OR auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "SiteSkills: owner insert" ON public.site_skills
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "SiteSkills: owner update" ON public.site_skills
  FOR UPDATE USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "SiteSkills: owner delete" ON public.site_skills
  FOR DELETE USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER trg_site_skills_updated_at
BEFORE UPDATE ON public.site_skills
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Enable realtime
ALTER TABLE public.site_content REPLICA IDENTITY FULL;
ALTER TABLE public.site_skills REPLICA IDENTITY FULL;
ALTER TABLE public.projects REPLICA IDENTITY FULL;
ALTER TABLE public.whatsapp_settings REPLICA IDENTITY FULL;

ALTER PUBLICATION supabase_realtime ADD TABLE public.site_content;
ALTER PUBLICATION supabase_realtime ADD TABLE public.site_skills;
ALTER PUBLICATION supabase_realtime ADD TABLE public.projects;
ALTER PUBLICATION supabase_realtime ADD TABLE public.whatsapp_settings;
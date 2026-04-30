import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export type SiteContent = {
  user_id: string;
  hero_badge: string | null;
  hero_title_1: string | null;
  hero_title_2: string | null;
  hero_title_precision: string | null;
  hero_desc: string | null;
  hero_cta_view: string | null;
  hero_cta_start: string | null;
  hero_stat_projects: string | null;
  hero_stat_years: string | null;
  hero_stat_clients: string | null;
  hero_stat_uptime: string | null;
  hero_stat_projects_value: string | null;
  hero_stat_years_value: string | null;
  hero_stat_clients_value: string | null;
  hero_stat_uptime_value: string | null;
  about_title_1: string | null;
  about_title_2: string | null;
  about_title_serious: string | null;
  about_p1: string | null;
  about_p2: string | null;
  contact_email: string | null;
  contact_location: string | null;
  contact_whatsapp_display: string | null;
  brand_name: string | null;
};

export type SiteSkill = {
  id: string;
  user_id: string;
  group_title: string;
  items: string[];
  sort_order: number;
};

export type SiteProject = {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  link_url: string | null;
  tech_stack: string[] | null;
};

export type SiteWhatsApp = {
  phone_number: string;
  greeting_message: string | null;
  is_enabled: boolean;
};

type Ctx = {
  ownerId: string | null;
  content: SiteContent | null;
  skills: SiteSkill[];
  projects: SiteProject[];
  whatsapp: SiteWhatsApp | null;
  loading: boolean;
};

const SiteContentContext = createContext<Ctx>({
  ownerId: null,
  content: null,
  skills: [],
  projects: [],
  whatsapp: null,
  loading: true,
});

export const SiteContentProvider = ({ children }: { children: ReactNode }) => {
  const [ownerId, setOwnerId] = useState<string | null>(null);
  const [content, setContent] = useState<SiteContent | null>(null);
  const [skills, setSkills] = useState<SiteSkill[]>([]);
  const [projects, setProjects] = useState<SiteProject[]>([]);
  const [whatsapp, setWhatsapp] = useState<SiteWhatsApp | null>(null);
  const [loading, setLoading] = useState(true);

  // Find the site owner (first admin)
  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("user_roles")
        .select("user_id")
        .eq("role", "admin")
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle();
      setOwnerId(data?.user_id ?? null);
    })();
  }, []);

  const loadAll = useCallback(async (uid: string) => {
    const [c, s, p, w] = await Promise.all([
      supabase.from("site_content").select("*").eq("user_id", uid).maybeSingle(),
      supabase.from("site_skills").select("*").eq("user_id", uid).order("sort_order", { ascending: true }),
      supabase.from("projects").select("id,title,description,image_url,link_url,tech_stack").eq("user_id", uid).eq("is_published", true).order("created_at", { ascending: false }),
      supabase.from("whatsapp_settings").select("phone_number,greeting_message,is_enabled").eq("user_id", uid).maybeSingle(),
    ]);
    setContent((c.data as SiteContent) ?? null);
    setSkills((s.data as SiteSkill[]) ?? []);
    setProjects((p.data as SiteProject[]) ?? []);
    setWhatsapp((w.data as SiteWhatsApp) ?? null);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!ownerId) return;
    loadAll(ownerId);

    const channel = supabase
      .channel("site-content-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "site_content", filter: `user_id=eq.${ownerId}` }, () => loadAll(ownerId))
      .on("postgres_changes", { event: "*", schema: "public", table: "site_skills", filter: `user_id=eq.${ownerId}` }, () => loadAll(ownerId))
      .on("postgres_changes", { event: "*", schema: "public", table: "projects", filter: `user_id=eq.${ownerId}` }, () => loadAll(ownerId))
      .on("postgres_changes", { event: "*", schema: "public", table: "whatsapp_settings", filter: `user_id=eq.${ownerId}` }, () => loadAll(ownerId))
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [ownerId, loadAll]);

  return (
    <SiteContentContext.Provider value={{ ownerId, content, skills, projects, whatsapp, loading }}>
      {children}
    </SiteContentContext.Provider>
  );
};

export const useSiteContent = () => useContext(SiteContentContext);

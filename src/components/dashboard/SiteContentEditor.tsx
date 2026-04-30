import { useEffect, useState } from "react";
import { Loader2, Save, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useI18n } from "@/hooks/useI18n";

type Content = Record<string, string>;
type Skill = { id?: string; group_title: string; items: string[]; sort_order: number; _new?: boolean };

const FIELDS = [
  { key: "brand_name", labelKey: "sc.brand", type: "input" },
  { key: "hero_badge", labelKey: "sc.hero.badge", type: "input" },
  { key: "hero_title_1", labelKey: "sc.hero.title1", type: "input" },
  { key: "hero_title_2", labelKey: "sc.hero.title2", type: "input" },
  { key: "hero_title_precision", labelKey: "sc.hero.titlePrecision", type: "input" },
  { key: "hero_desc", labelKey: "sc.hero.desc", type: "textarea" },
  { key: "hero_cta_view", labelKey: "sc.hero.ctaView", type: "input" },
  { key: "hero_cta_start", labelKey: "sc.hero.ctaStart", type: "input" },
  { key: "hero_stat_projects_value", labelKey: "sc.hero.stat1v", type: "input" },
  { key: "hero_stat_projects", labelKey: "sc.hero.stat1l", type: "input" },
  { key: "hero_stat_years_value", labelKey: "sc.hero.stat2v", type: "input" },
  { key: "hero_stat_years", labelKey: "sc.hero.stat2l", type: "input" },
  { key: "hero_stat_clients_value", labelKey: "sc.hero.stat3v", type: "input" },
  { key: "hero_stat_clients", labelKey: "sc.hero.stat3l", type: "input" },
  { key: "hero_stat_uptime_value", labelKey: "sc.hero.stat4v", type: "input" },
  { key: "hero_stat_uptime", labelKey: "sc.hero.stat4l", type: "input" },
  { key: "about_title_1", labelKey: "sc.about.title1", type: "input" },
  { key: "about_title_2", labelKey: "sc.about.title2", type: "input" },
  { key: "about_title_serious", labelKey: "sc.about.titleSerious", type: "input" },
  { key: "about_p1", labelKey: "sc.about.p1", type: "textarea" },
  { key: "about_p2", labelKey: "sc.about.p2", type: "textarea" },
  { key: "contact_email", labelKey: "sc.contact.email", type: "input" },
  { key: "contact_location", labelKey: "sc.contact.location", type: "input" },
  { key: "contact_whatsapp_display", labelKey: "sc.contact.waDisplay", type: "input" },
] as const;

export default function SiteContentEditor({ userId }: { userId: string }) {
  const { t } = useI18n();
  const [content, setContent] = useState<Content>({});
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasRow, setHasRow] = useState(false);

  const load = async () => {
    setLoading(true);
    const [c, s] = await Promise.all([
      supabase.from("site_content").select("*").eq("user_id", userId).maybeSingle(),
      supabase.from("site_skills").select("*").eq("user_id", userId).order("sort_order", { ascending: true }),
    ]);
    if (c.data) {
      const d: Content = {};
      FIELDS.forEach((f) => (d[f.key] = (c.data as any)[f.key] ?? ""));
      setContent(d);
      setHasRow(true);
    } else {
      const d: Content = {};
      FIELDS.forEach((f) => (d[f.key] = ""));
      setContent(d);
      setHasRow(false);
    }
    setSkills(((s.data as any[]) ?? []).map((x) => ({ id: x.id, group_title: x.group_title, items: x.items ?? [], sort_order: x.sort_order })));
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const saveContent = async () => {
    setSaving(true);
    const payload: Record<string, any> = { user_id: userId, is_published: true };
    FIELDS.forEach((f) => (payload[f.key] = content[f.key]?.trim() || null));
    const { error } = hasRow
      ? await supabase.from("site_content").update(payload).eq("user_id", userId)
      : await supabase.from("site_content").insert(payload);
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setHasRow(true);
    toast.success(t("db.toast.saved"));
  };

  const addSkillGroup = () => {
    setSkills([...skills, { group_title: "", items: [], sort_order: skills.length, _new: true }]);
  };

  const updateSkill = (idx: number, patch: Partial<Skill>) => {
    setSkills(skills.map((s, i) => (i === idx ? { ...s, ...patch } : s)));
  };

  const removeSkill = async (idx: number) => {
    const s = skills[idx];
    if (s.id) {
      if (!confirm(t("sc.skills.confirmDel"))) return;
      const { error } = await supabase.from("site_skills").delete().eq("id", s.id);
      if (error) {
        toast.error(error.message);
        return;
      }
    }
    setSkills(skills.filter((_, i) => i !== idx));
    toast.success(t("db.toast.deleted"));
  };

  const saveSkill = async (idx: number) => {
    const s = skills[idx];
    if (!s.group_title.trim()) {
      toast.error(t("sc.skills.titleReq"));
      return;
    }
    const items = (typeof s.items === "string" ? (s.items as any).split(",") : s.items).map((x: string) => x.trim()).filter(Boolean);
    const payload = { user_id: userId, group_title: s.group_title.trim(), items, sort_order: s.sort_order, is_published: true };
    const { data, error } = s.id
      ? await supabase.from("site_skills").update(payload).eq("id", s.id).select().single()
      : await supabase.from("site_skills").insert(payload).select().single();
    if (error) {
      toast.error(error.message);
      return;
    }
    updateSkill(idx, { id: (data as any).id, _new: false, items });
    toast.success(t("db.toast.saved"));
  };

  if (loading) {
    return (
      <div className="grid place-items-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Card className="p-6 glass">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">{t("sc.section.text")}</h3>
          <Button variant="hero" onClick={saveContent} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {t("db.btn.save")}
          </Button>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {FIELDS.map((f) => (
            <div key={f.key} className={f.type === "textarea" ? "sm:col-span-2" : ""}>
              <Label className="text-xs">{t(f.labelKey)}</Label>
              {f.type === "textarea" ? (
                <Textarea
                  rows={3}
                  value={content[f.key] || ""}
                  onChange={(e) => setContent({ ...content, [f.key]: e.target.value })}
                  className="mt-1"
                />
              ) : (
                <Input
                  value={content[f.key] || ""}
                  onChange={(e) => setContent({ ...content, [f.key]: e.target.value })}
                  className="mt-1"
                />
              )}
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 glass">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">{t("sc.section.skills")}</h3>
          <Button variant="outline" onClick={addSkillGroup}>
            <Plus className="h-4 w-4" /> {t("sc.skills.add")}
          </Button>
        </div>
        {skills.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">{t("sc.skills.empty")}</p>
        ) : (
          <div className="space-y-4">
            {skills.map((s, i) => (
              <div key={s.id || `new-${i}`} className="border border-border rounded-xl p-4 space-y-3">
                <div className="flex gap-2">
                  <Input
                    placeholder={t("sc.skills.title")}
                    value={s.group_title}
                    onChange={(e) => updateSkill(i, { group_title: e.target.value })}
                    className="flex-1"
                  />
                  <Button variant="ghost" size="sm" onClick={() => removeSkill(i)} className="text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <Input
                  placeholder={t("sc.skills.items")}
                  value={Array.isArray(s.items) ? s.items.join(", ") : (s.items as any)}
                  onChange={(e) => updateSkill(i, { items: e.target.value.split(",") as any })}
                />
                <Button variant="hero" size="sm" onClick={() => saveSkill(i)}>
                  <Save className="h-3.5 w-3.5" /> {t("db.btn.save")}
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

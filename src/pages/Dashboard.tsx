import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard, FolderKanban, MessageSquare, MessageCircle, BarChart3, Settings,
  LogOut, Code2, Loader2, Plus, Edit, Trash2, ExternalLink, Mail, Phone, CheckCircle2,
  FolderKanban as FolderIcon, MousePointerClick, TrendingUp, Languages, Eye, EyeOff,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useTheme, themes } from "@/hooks/useTheme";
import { useI18n } from "@/hooks/useI18n";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

type Project = { id: string; title: string; description: string | null; image_url: string | null; link_url: string | null; tech_stack: string[] | null; is_published: boolean };
type Msg = { id: string; sender_name: string; sender_email: string | null; sender_phone: string | null; content: string; source: string; is_read: boolean; created_at: string };
type Click = { id: string; created_at: string; country: string | null; source: string | null };

const sections = [
  { id: "overview", labelKey: "db.section.overview", icon: LayoutDashboard },
  { id: "projects", labelKey: "db.section.projects", icon: FolderKanban },
  { id: "messages", labelKey: "db.section.messages", icon: MessageSquare },
  { id: "whatsapp", labelKey: "db.section.whatsapp", icon: MessageCircle },
  { id: "analytics", labelKey: "db.section.analytics", icon: BarChart3 },
  { id: "settings", labelKey: "db.section.settings", icon: Settings },
] as const;

const Stat = ({ icon: Icon, label, value, accent }: any) => (
  <Card className="p-5 glass">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="text-3xl font-bold mt-2">{value}</p>
      </div>
      <div className={`h-10 w-10 rounded-lg grid place-items-center ${accent}`}><Icon className="h-5 w-5" /></div>
    </div>
  </Card>
);

const emptyProject = { title: "", description: "", image_url: "", link_url: "", tech_stack: "" };

export default function Dashboard() {
  const { user, isAdmin, loading, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const { t, lang, toggle } = useI18n();
  const navigate = useNavigate();
  const [section, setSection] = useState<string>("overview");

  // Password change
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);

  // Data
  const [projects, setProjects] = useState<Project[]>([]);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [clicks, setClicks] = useState<Click[]>([]);

  // Project form
  const [pOpen, setPOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [pForm, setPForm] = useState(emptyProject);

  // WhatsApp settings
  const [phone, setPhone] = useState("");
  const [greeting, setGreeting] = useState("Hello! How can I help you?");
  const [enabled, setEnabled] = useState(true);
  const [hasWhats, setHasWhats] = useState(false);

  // Profile
  const [fullName, setFullName] = useState("");

  useEffect(() => {
    if (!loading && !user) navigate("/auth", { replace: true });
  }, [user, loading, navigate]);

  const loadAll = async () => {
    if (!user) return;
    const [p, m, c, w, pr] = await Promise.all([
      supabase.from("projects").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
      supabase.from("messages").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
      supabase.from("click_logs").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(500),
      supabase.from("whatsapp_settings").select("*").eq("user_id", user.id).maybeSingle(),
      supabase.from("profiles").select("full_name").eq("id", user.id).maybeSingle(),
    ]);
    setProjects((p.data as Project[]) ?? []);
    setMessages((m.data as Msg[]) ?? []);
    setClicks((c.data as Click[]) ?? []);
    if (w.data) {
      setPhone(w.data.phone_number);
      setGreeting(w.data.greeting_message ?? "");
      setEnabled(w.data.is_enabled);
      setHasWhats(true);
    }
    setFullName(pr.data?.full_name ?? "");
  };

  useEffect(() => { loadAll(); }, [user]);

  // Project actions
  const openNew = () => { setEditing(null); setPForm(emptyProject); setPOpen(true); };
  const openEdit = (p: Project) => {
    setEditing(p);
    setPForm({
      title: p.title, description: p.description ?? "", image_url: p.image_url ?? "",
      link_url: p.link_url ?? "", tech_stack: (p.tech_stack ?? []).join(", "),
    });
    setPOpen(true);
  };
  const saveProject = async () => {
    if (!user || !pForm.title.trim()) { toast.error(t("db.toast.titleRequired")); return; }
    const payload = {
      user_id: user.id, title: pForm.title.trim(),
      description: pForm.description.trim() || null,
      image_url: pForm.image_url.trim() || null,
      link_url: pForm.link_url.trim() || null,
      tech_stack: pForm.tech_stack ? pForm.tech_stack.split(",").map((s) => s.trim()).filter(Boolean) : null,
    };
    const { error } = editing
      ? await supabase.from("projects").update(payload).eq("id", editing.id)
      : await supabase.from("projects").insert(payload);
    if (error) { toast.error(error.message); return; }
    toast.success(editing ? t("db.toast.projectUpdated") : t("db.toast.projectAdded"));
    setPOpen(false); loadAll();
  };
  const removeProject = async (id: string) => {
    if (!confirm(t("db.toast.confirmDelProject"))) return;
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success(t("db.toast.deleted")); loadAll();
  };

  // Messages
  const markRead = async (id: string) => { await supabase.from("messages").update({ is_read: true }).eq("id", id); loadAll(); };
  const removeMsg = async (id: string) => {
    if (!confirm(t("db.toast.confirmDelMsg"))) return;
    await supabase.from("messages").delete().eq("id", id);
    toast.success(t("db.toast.deleted")); loadAll();
  };

  // WhatsApp
  const saveWhats = async () => {
    if (!user || !phone.trim()) { toast.error(t("db.toast.phoneRequired")); return; }
    const payload = { user_id: user.id, phone_number: phone.trim(), greeting_message: greeting.trim() || null, is_enabled: enabled };
    const { error } = hasWhats
      ? await supabase.from("whatsapp_settings").update(payload).eq("user_id", user.id)
      : await supabase.from("whatsapp_settings").insert(payload);
    if (error) { toast.error(error.message); return; }
    toast.success(t("db.toast.saved")); setHasWhats(true);
  };

  // Profile
  const saveProfile = async () => {
    if (!user) return;
    const { error } = await supabase.from("profiles").update({ full_name: fullName.trim() || null }).eq("id", user.id);
    if (error) { toast.error(error.message); return; }
    toast.success(t("db.toast.profileUpdated"));
  };

  // Password change
  const changePassword = async () => {
    if (newPassword.length < 6) { toast.error(t("db.toast.pwShort")); return; }
    if (newPassword !== confirmPassword) { toast.error(t("db.toast.pwMismatch")); return; }
    setPwLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setPwLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success(t("db.toast.pwUpdated"));
    setNewPassword(""); setConfirmPassword("");
  };

  // Stats
  const unread = messages.filter((m) => !m.is_read).length;
  const days: { date: string; clicks: number }[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    days.push({ date: key.slice(5), clicks: 0 });
  }
  clicks.forEach((c) => {
    const key = c.created_at.slice(5, 10);
    const day = days.find((x) => x.date === key);
    if (day) day.clicks++;
  });
  const countryStats = Object.entries(
    clicks.reduce<Record<string, number>>((acc, c) => { const k = c.country || "Unknown"; acc[k] = (acc[k] || 0) + 1; return acc; }, {})
  ).sort((a, b) => b[1] - a[1]).slice(0, 8);

  if (loading || !user) {
    return <div className="min-h-screen grid place-items-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  const initials = user.email?.[0]?.toUpperCase() ?? "U";

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="container flex items-center justify-between h-14">
          <a href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-primary grid place-items-center shadow-glow">
              <Code2 className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold">Web Store <span className="text-muted-foreground font-normal text-sm">/ Dashboard</span></span>
          </a>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={toggle} title="Language">
              <Languages className="h-4 w-4" /> {lang === "en" ? "العربية" : "English"}
            </Button>
            <Avatar className="h-8 w-8"><AvatarFallback className="bg-primary/20 text-primary text-xs">{initials}</AvatarFallback></Avatar>
            <span className="text-xs text-muted-foreground hidden sm:inline">{user.email}</span>
            <Button variant="ghost" size="sm" onClick={signOut}><LogOut className="h-4 w-4" /> {t("db.signout")}</Button>
          </div>
        </div>
        {/* Section tabs */}
        <div className="container flex gap-1 overflow-x-auto pb-2 -mt-1">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => setSection(s.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-colors ${
                section === s.id ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              <s.icon className="h-4 w-4" /> {t(s.labelKey)}
            </button>
          ))}
        </div>
      </header>

      <main className="container py-8 space-y-10">
        {/* OVERVIEW */}
        <section id="overview" className={section === "overview" ? "" : "hidden"}>
          <div className="mb-6">
            <h1 className="text-3xl font-bold">{t("db.overview.title")}</h1>
            <p className="text-muted-foreground">{t("db.overview.desc")}</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Stat icon={FolderIcon} label={t("db.stat.projects")} value={projects.length} accent="bg-primary/15 text-primary" />
            <Stat icon={MessageSquare} label={t("db.stat.messages")} value={messages.length} accent="bg-accent/15 text-accent-foreground" />
            <Stat icon={TrendingUp} label={t("db.stat.unread")} value={unread} accent="bg-yellow-500/15 text-yellow-500" />
            <Stat icon={MousePointerClick} label={t("db.stat.clicks")} value={clicks.length} accent="bg-emerald-500/15 text-emerald-500" />
          </div>
        </section>

        {/* PROJECTS */}
        <section id="projects" className={section === "projects" ? "" : "hidden"}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold">{t("db.projects.title")}</h2>
              <p className="text-muted-foreground">{t("db.projects.desc")}</p>
            </div>
            <Dialog open={pOpen} onOpenChange={setPOpen}>
              <DialogTrigger asChild><Button variant="hero" onClick={openNew}><Plus className="h-4 w-4" /> {t("db.projects.new")}</Button></DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader><DialogTitle>{editing ? t("db.projects.edit") : t("db.projects.new")}</DialogTitle></DialogHeader>
                <div className="space-y-3">
                  <div><Label>{t("db.f.title")}</Label><Input value={pForm.title} onChange={(e) => setPForm({ ...pForm, title: e.target.value })} /></div>
                  <div><Label>{t("db.f.description")}</Label><Textarea value={pForm.description} onChange={(e) => setPForm({ ...pForm, description: e.target.value })} rows={3} /></div>
                  <div><Label>{t("db.f.image")}</Label><Input value={pForm.image_url} onChange={(e) => setPForm({ ...pForm, image_url: e.target.value })} /></div>
                  <div><Label>{t("db.f.link")}</Label><Input value={pForm.link_url} onChange={(e) => setPForm({ ...pForm, link_url: e.target.value })} /></div>
                  <div><Label>{t("db.f.tech")}</Label><Input value={pForm.tech_stack} onChange={(e) => setPForm({ ...pForm, tech_stack: e.target.value })} placeholder="React, Node, Postgres" /></div>
                  <Button variant="hero" className="w-full" onClick={saveProject}>{editing ? t("db.btn.update") : t("db.btn.create")}</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          {projects.length === 0 ? (
            <Card className="p-12 text-center text-muted-foreground">{t("db.projects.empty")}</Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((p) => (
                <Card key={p.id} className="p-5 glass flex flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-lg">{p.title}</h3>
                    {p.link_url && <a href={p.link_url} target="_blank" rel="noreferrer" className="text-primary"><ExternalLink className="h-4 w-4" /></a>}
                  </div>
                  {p.description && <p className="text-sm text-muted-foreground mt-2 line-clamp-3">{p.description}</p>}
                  {p.tech_stack && p.tech_stack.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">{p.tech_stack.map((tag) => <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>)}</div>
                  )}
                  <div className="flex gap-2 mt-4 pt-4 border-t border-border/60">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(p)}><Edit className="h-3.5 w-3.5" /> {t("db.btn.edit")}</Button>
                    <Button variant="ghost" size="sm" onClick={() => removeProject(p.id)} className="text-destructive"><Trash2 className="h-3.5 w-3.5" /> {t("db.btn.delete")}</Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* MESSAGES */}
        <section id="messages" className={section === "messages" ? "" : "hidden"}>
          <div className="mb-6">
            <h2 className="text-3xl font-bold">{t("db.msg.title")}</h2>
            <p className="text-muted-foreground">{t("db.msg.desc")}</p>
          </div>
          {messages.length === 0 ? (
            <Card className="p-12 text-center text-muted-foreground">{t("db.msg.empty")}</Card>
          ) : (
            <div className="space-y-3">
              {messages.map((m) => (
                <Card key={m.id} className={`p-5 ${!m.is_read ? "border-primary/40" : ""}`}>
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold">{m.sender_name}</h3>
                        {!m.is_read && <Badge className="bg-primary/20 text-primary border-primary/30">{t("db.msg.new")}</Badge>}
                        <Badge variant="outline" className="text-xs">{m.source}</Badge>
                      </div>
                      <div className="flex gap-3 text-xs text-muted-foreground mt-1 flex-wrap">
                        {m.sender_email && <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{m.sender_email}</span>}
                        {m.sender_phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{m.sender_phone}</span>}
                        <span>{formatDistanceToNow(new Date(m.created_at), { addSuffix: true })}</span>
                      </div>
                      <p className="text-sm mt-3 whitespace-pre-wrap">{m.content}</p>
                    </div>
                    <div className="flex gap-2">
                      {!m.is_read && <Button variant="ghost" size="sm" onClick={() => markRead(m.id)}><CheckCircle2 className="h-3.5 w-3.5" /> {t("db.btn.markread")}</Button>}
                      <Button variant="ghost" size="sm" onClick={() => removeMsg(m.id)} className="text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>


        {/* WHATSAPP */}
        <section id="whatsapp" className={section === "whatsapp" ? "" : "hidden"}>
          <div className="mb-6">
            <h2 className="text-3xl font-bold">{t("db.wa.title")}</h2>
            <p className="text-muted-foreground">{t("db.wa.desc")}</p>
          </div>
          <Card className="p-6 space-y-4 glass max-w-2xl">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">{t("db.wa.enable")}</Label>
                <p className="text-xs text-muted-foreground">{t("db.wa.enable.desc")}</p>
              </div>
              <Switch checked={enabled} onCheckedChange={setEnabled} />
            </div>
            <div><Label>{t("db.wa.phone")}</Label><Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+201226601882" /></div>
            <div><Label>{t("db.wa.greet")}</Label><Textarea value={greeting} onChange={(e) => setGreeting(e.target.value)} rows={3} /></div>
            <Button variant="hero" onClick={saveWhats}>{t("db.wa.save")}</Button>
          </Card>
        </section>

        {/* ANALYTICS */}
        <section id="analytics" className={section === "analytics" ? "" : "hidden"}>
          <div className="mb-6">
            <h2 className="text-3xl font-bold">{t("db.an.title")}</h2>
            <p className="text-muted-foreground">{t("db.an.desc")}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3 mb-6">
            <Card className="p-5"><p className="text-xs uppercase text-muted-foreground">{t("db.an.total")}</p><p className="text-3xl font-bold mt-2">{clicks.length}</p></Card>
            <Card className="p-5"><p className="text-xs uppercase text-muted-foreground">{t("db.an.last14")}</p><p className="text-3xl font-bold mt-2">{days.reduce((s, d) => s + d.clicks, 0)}</p></Card>
            <Card className="p-5"><p className="text-xs uppercase text-muted-foreground">{t("db.an.countries")}</p><p className="text-3xl font-bold mt-2">{countryStats.length}</p></Card>
          </div>
          <Card className="p-5 mb-6">
            <h3 className="font-semibold mb-4">{t("db.an.chart")}</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={days}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} allowDecimals={false} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                  <Line type="monotone" dataKey="clicks" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: "hsl(var(--primary))" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
          <Card className="p-5">
            <h3 className="font-semibold mb-4">{t("db.an.top")}</h3>
            {countryStats.length === 0 ? <p className="text-sm text-muted-foreground">{t("db.an.nodata")}</p> : (
              <div className="space-y-2">
                {countryStats.map(([c, n]) => (
                  <div key={c} className="flex items-center justify-between text-sm">
                    <span>{c}</span><span className="font-mono text-muted-foreground">{n}</span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </section>

        {/* SETTINGS */}
        <section id="settings" className={section === "settings" ? "" : "hidden"}>
          <div className="mb-6">
            <h2 className="text-3xl font-bold">{t("db.set.title")}</h2>
            <p className="text-muted-foreground">{t("db.set.desc")}</p>
          </div>

          <div className="grid gap-6 max-w-2xl">
            {/* Profile */}
            <Card className="p-6 space-y-4 glass">
              <h3 className="font-semibold text-lg">{t("db.set.profile")}</h3>
              <div><Label>{t("db.set.email")}</Label><Input value={user.email ?? ""} disabled /></div>
              <div><Label>{t("db.set.fullname")}</Label><Input value={fullName} onChange={(e) => setFullName(e.target.value)} /></div>
              <div><Label>{t("db.set.role")}</Label><Input value={isAdmin ? t("db.set.role.admin") : t("db.set.role.user")} disabled /></div>
              <Button variant="hero" onClick={saveProfile}>{t("db.set.saveProfile")}</Button>
            </Card>

            {/* Password */}
            <Card className="p-6 space-y-4 glass">
              <h3 className="font-semibold text-lg">{t("db.set.password")}</h3>
              <p className="text-xs text-muted-foreground">{t("db.set.password.hint")}</p>
              <div>
                <Label>{t("db.set.password.new")}</Label>
                <div className="relative">
                  <Input type={showPassword ? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••" className="pr-10 rtl:pr-3 rtl:pl-10" />
                  <button type="button" onClick={() => setShowPassword((s) => !s)} className="absolute inset-y-0 end-0 flex items-center px-3 text-muted-foreground hover:text-foreground" aria-label={showPassword ? t("db.set.password.hide") : t("db.set.password.show")}>
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div>
                <Label>{t("db.set.password.confirm")}</Label>
                <div className="relative">
                  <Input type={showPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" className="pr-10 rtl:pr-3 rtl:pl-10" />
                  <button type="button" onClick={() => setShowPassword((s) => !s)} className="absolute inset-y-0 end-0 flex items-center px-3 text-muted-foreground hover:text-foreground" aria-label={showPassword ? t("db.set.password.hide") : t("db.set.password.show")}>
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <Button variant="hero" onClick={changePassword} disabled={pwLoading}>
                {pwLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null} {t("db.set.password.update")}
              </Button>
            </Card>

            {/* Theme */}
            <Card className="p-6 space-y-4 glass">
              <h3 className="font-semibold text-lg">{t("db.set.colors")}</h3>
              <p className="text-xs text-muted-foreground">{t("db.set.colors.desc")}</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {themes.map((th) => {
                  const active = theme === th.key;
                  return (
                    <button
                      key={th.key}
                      onClick={() => setTheme(th.key)}
                      className={`group relative rounded-xl border p-4 text-start transition-all ${
                        active ? "border-primary ring-2 ring-primary/40" : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div
                        className="h-10 w-full rounded-lg mb-3"
                        style={{ background: `linear-gradient(135deg, hsl(${th.swatch}), hsl(${th.swatch} / 0.6))` }}
                      />
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">{th.label}</span>
                        {active && <CheckCircle2 className="h-4 w-4 text-primary" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}

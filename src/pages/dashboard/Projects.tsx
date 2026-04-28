import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, ExternalLink } from "lucide-react";
import { toast } from "sonner";

type Project = {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  link_url: string | null;
  tech_stack: string[] | null;
  is_published: boolean;
};

const empty = { title: "", description: "", image_url: "", link_url: "", tech_stack: "" };

const Projects = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState(empty);

  const load = async () => {
    if (!user) return;
    const { data } = await supabase.from("projects").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    setProjects((data as Project[]) ?? []);
  };

  useEffect(() => { load(); }, [user]);

  const openNew = () => { setEditing(null); setForm(empty); setOpen(true); };
  const openEdit = (p: Project) => {
    setEditing(p);
    setForm({
      title: p.title,
      description: p.description ?? "",
      image_url: p.image_url ?? "",
      link_url: p.link_url ?? "",
      tech_stack: (p.tech_stack ?? []).join(", "),
    });
    setOpen(true);
  };

  const save = async () => {
    if (!user || !form.title.trim()) { toast.error("Title required"); return; }
    const payload = {
      user_id: user.id,
      title: form.title.trim(),
      description: form.description.trim() || null,
      image_url: form.image_url.trim() || null,
      link_url: form.link_url.trim() || null,
      tech_stack: form.tech_stack ? form.tech_stack.split(",").map((s) => s.trim()).filter(Boolean) : null,
    };
    const { error } = editing
      ? await supabase.from("projects").update(payload).eq("id", editing.id)
      : await supabase.from("projects").insert(payload);
    if (error) { toast.error(error.message); return; }
    toast.success(editing ? "Project updated" : "Project added");
    setOpen(false);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Deleted");
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground">Manage your portfolio projects.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="hero" onClick={openNew}><Plus className="h-4 w-4" /> New Project</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>{editing ? "Edit Project" : "New Project"}</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
              <div><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} /></div>
              <div><Label>Image URL</Label><Input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} /></div>
              <div><Label>Link URL</Label><Input value={form.link_url} onChange={(e) => setForm({ ...form, link_url: e.target.value })} /></div>
              <div><Label>Tech stack (comma separated)</Label><Input value={form.tech_stack} onChange={(e) => setForm({ ...form, tech_stack: e.target.value })} placeholder="React, Node, Postgres" /></div>
              <Button variant="hero" className="w-full" onClick={save}>{editing ? "Update" : "Create"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {projects.length === 0 ? (
        <Card className="p-12 text-center text-muted-foreground">No projects yet. Click "New Project" to add one.</Card>
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
                <div className="flex flex-wrap gap-1 mt-3">
                  {p.tech_stack.map((t) => <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>)}
                </div>
              )}
              <div className="flex gap-2 mt-4 pt-4 border-t border-border/60">
                <Button variant="ghost" size="sm" onClick={() => openEdit(p)}><Edit className="h-3.5 w-3.5" /> Edit</Button>
                <Button variant="ghost" size="sm" onClick={() => remove(p.id)} className="text-destructive"><Trash2 className="h-3.5 w-3.5" /> Delete</Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;

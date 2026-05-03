import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

type Role = "admin" | "editor" | "user";
type Profile = { id: string; email: string | null; full_name: string | null; avatar_url: string | null; created_at: string };
type Row = Profile & { role: Role };

export default function UsersManager({ currentUserId }: { currentUserId: string }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const [{ data: profiles, error: pErr }, { data: roles, error: rErr }] = await Promise.all([
      supabase.from("profiles").select("id, email, full_name, avatar_url, created_at").order("created_at", { ascending: false }),
      supabase.from("user_roles").select("user_id, role"),
    ]);
    if (pErr) toast.error(pErr.message);
    if (rErr) toast.error(rErr.message);
    const roleMap = new Map<string, Role>();
    (roles ?? []).forEach((r: any) => {
      const existing = roleMap.get(r.user_id);
      // priority: admin > editor > user
      const rank = (x: Role) => (x === "admin" ? 3 : x === "editor" ? 2 : 1);
      if (!existing || rank(r.role) > rank(existing)) roleMap.set(r.user_id, r.role);
    });
    setRows(((profiles as Profile[]) ?? []).map((p) => ({ ...p, role: roleMap.get(p.id) ?? "user" })));
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const setRole = async (row: Row, next: Role) => {
    if (row.role === next) return;
    if (row.id === currentUserId && row.role === "admin" && next !== "admin"
      && !confirm("Remove your own admin role?")) return;
    // Remove existing role rows for this user, then insert new
    const { error: delErr } = await supabase.from("user_roles").delete().eq("user_id", row.id);
    if (delErr) return toast.error(delErr.message);
    const { error: insErr } = await supabase.from("user_roles").insert({ user_id: row.id, role: next });
    if (insErr) return toast.error(insErr.message);
    toast.success(`Role updated to ${next}`);
    load();
  };

  const removeUser = async (row: Row) => {
    if (row.id === currentUserId) return toast.error("You cannot delete your own account here.");
    if (!confirm(`Delete profile for ${row.email}?`)) return;
    const { error } = await supabase.from("profiles").delete().eq("id", row.id);
    if (error) return toast.error(error.message);
    toast.success("User profile deleted");
    load();
  };

  if (loading) return <div className="grid place-items-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  if (rows.length === 0) return <Card className="p-12 text-center text-muted-foreground">No users found. Admin access required.</Card>;

  const badgeFor = (r: Role) =>
    r === "admin" ? "bg-primary/20 text-primary border-primary/30"
    : r === "editor" ? "bg-accent/30 text-foreground border-accent"
    : "bg-muted text-muted-foreground border-border";

  return (
    <div className="space-y-3">
      {rows.map((u) => (
        <Card key={u.id} className="p-4 flex items-center gap-4 flex-wrap">
          <Avatar className="h-10 w-10">
            {u.avatar_url && <AvatarImage src={u.avatar_url} />}
            <AvatarFallback className="bg-primary/20 text-primary text-xs">
              {(u.full_name ?? u.email ?? "U")[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold truncate">{u.full_name ?? "—"}</span>
              <Badge className={badgeFor(u.role)}>{u.role}</Badge>
              {u.id === currentUserId && <Badge variant="outline">You</Badge>}
            </div>
            <p className="text-xs text-muted-foreground truncate">{u.email}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              Joined {formatDistanceToNow(new Date(u.created_at), { addSuffix: true })}
            </p>
          </div>
          <div className="flex gap-2 items-center">
            <Select value={u.role} onValueChange={(v) => setRole(u, v as Role)}>
              <SelectTrigger className="w-32 h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="editor">Editor</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="ghost" size="sm" className="text-destructive" onClick={() => removeUser(u)} disabled={u.id === currentUserId}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const Settings = () => {
  const { user, isAdmin } = useAuth();
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase.from("profiles").select("full_name").eq("id", user.id).maybeSingle();
      setFullName(data?.full_name ?? "");
      setLoading(false);
    })();
  }, [user]);

  const save = async () => {
    if (!user) return;
    const { error } = await supabase.from("profiles").update({ full_name: fullName.trim() || null }).eq("id", user.id);
    if (error) { toast.error(error.message); return; }
    toast.success("Profile updated");
  };

  if (loading) return <div className="text-muted-foreground">Loading…</div>;

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Account and profile settings.</p>
      </div>
      <Card className="p-6 space-y-4 glass">
        <div><Label>Email</Label><Input value={user?.email ?? ""} disabled /></div>
        <div><Label>Full name</Label><Input value={fullName} onChange={(e) => setFullName(e.target.value)} /></div>
        <div><Label>Role</Label><Input value={isAdmin ? "Admin" : "User"} disabled /></div>
        <Button variant="hero" onClick={save}>Save</Button>
      </Card>
    </div>
  );
};

export default Settings;

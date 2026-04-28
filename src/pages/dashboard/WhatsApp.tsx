import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

const WhatsApp = () => {
  const { user } = useAuth();
  const [phone, setPhone] = useState("");
  const [greeting, setGreeting] = useState("Hello! How can I help you?");
  const [enabled, setEnabled] = useState(true);
  const [hasRow, setHasRow] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase.from("whatsapp_settings").select("*").eq("user_id", user.id).maybeSingle();
      if (data) {
        setPhone(data.phone_number);
        setGreeting(data.greeting_message ?? "");
        setEnabled(data.is_enabled);
        setHasRow(true);
      }
      setLoading(false);
    })();
  }, [user]);

  const save = async () => {
    if (!user) return;
    if (!phone.trim()) { toast.error("Phone number required"); return; }
    const payload = {
      user_id: user.id,
      phone_number: phone.trim(),
      greeting_message: greeting.trim() || null,
      is_enabled: enabled,
    };
    const { error } = hasRow
      ? await supabase.from("whatsapp_settings").update(payload).eq("user_id", user.id)
      : await supabase.from("whatsapp_settings").insert(payload);
    if (error) { toast.error(error.message); return; }
    toast.success("Settings saved");
    setHasRow(true);
  };

  if (loading) return <div className="text-muted-foreground">Loading…</div>;

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold">WhatsApp Settings</h1>
        <p className="text-muted-foreground">Configure the floating WhatsApp button on your site.</p>
      </div>
      <Card className="p-6 space-y-4 glass">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-base">Enable WhatsApp widget</Label>
            <p className="text-xs text-muted-foreground">Show or hide the floating button.</p>
          </div>
          <Switch checked={enabled} onCheckedChange={setEnabled} />
        </div>
        <div>
          <Label>Phone number (international format)</Label>
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+201226601882" />
        </div>
        <div>
          <Label>Default greeting message</Label>
          <Textarea value={greeting} onChange={(e) => setGreeting(e.target.value)} rows={3} />
        </div>
        <Button variant="hero" onClick={save}>Save settings</Button>
      </Card>
    </div>
  );
};

export default WhatsApp;

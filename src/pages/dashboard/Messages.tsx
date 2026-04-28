import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, Trash2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

type Msg = {
  id: string;
  sender_name: string;
  sender_email: string | null;
  sender_phone: string | null;
  content: string;
  source: string;
  is_read: boolean;
  created_at: string;
};

const Messages = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<Msg[]>([]);

  const load = async () => {
    if (!user) return;
    const { data } = await supabase.from("messages").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    setItems((data as Msg[]) ?? []);
  };

  useEffect(() => { load(); }, [user]);

  const markRead = async (id: string) => {
    await supabase.from("messages").update({ is_read: true }).eq("id", id);
    load();
  };
  const remove = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    await supabase.from("messages").delete().eq("id", id);
    toast.success("Deleted");
    load();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Messages</h1>
        <p className="text-muted-foreground">Inbound messages from your contact form and WhatsApp widget.</p>
      </div>

      {items.length === 0 ? (
        <Card className="p-12 text-center text-muted-foreground">No messages yet.</Card>
      ) : (
        <div className="space-y-3">
          {items.map((m) => (
            <Card key={m.id} className={`p-5 ${!m.is_read ? "border-primary/40" : ""}`}>
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold">{m.sender_name}</h3>
                    {!m.is_read && <Badge className="bg-primary/20 text-primary border-primary/30">New</Badge>}
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
                  {!m.is_read && <Button variant="ghost" size="sm" onClick={() => markRead(m.id)}><CheckCircle2 className="h-3.5 w-3.5" /> Mark read</Button>}
                  <Button variant="ghost" size="sm" onClick={() => remove(m.id)} className="text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Messages;

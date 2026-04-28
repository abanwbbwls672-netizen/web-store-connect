import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { FolderKanban, MessageSquare, MousePointerClick, TrendingUp } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Stat = ({ icon: Icon, label, value, accent }: any) => (
  <Card className="p-5 glass">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="text-3xl font-bold mt-2">{value}</p>
      </div>
      <div className={`h-10 w-10 rounded-lg grid place-items-center ${accent}`}>
        <Icon className="h-5 w-5" />
      </div>
    </div>
  </Card>
);

const Overview = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ projects: 0, messages: 0, unread: 0, clicks: 0 });

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [p, m, u, c] = await Promise.all([
        supabase.from("projects").select("id", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("messages").select("id", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("messages").select("id", { count: "exact", head: true }).eq("user_id", user.id).eq("is_read", false),
        supabase.from("click_logs").select("id", { count: "exact", head: true }).eq("user_id", user.id),
      ]);
      setStats({
        projects: p.count ?? 0,
        messages: m.count ?? 0,
        unread: u.count ?? 0,
        clicks: c.count ?? 0,
      });
    })();
  }, [user]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back — here's your activity at a glance.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat icon={FolderKanban} label="Projects" value={stats.projects} accent="bg-primary/15 text-primary" />
        <Stat icon={MessageSquare} label="Messages" value={stats.messages} accent="bg-accent/15 text-accent-foreground" />
        <Stat icon={TrendingUp} label="Unread" value={stats.unread} accent="bg-yellow-500/15 text-yellow-500" />
        <Stat icon={MousePointerClick} label="WhatsApp Clicks" value={stats.clicks} accent="bg-emerald-500/15 text-emerald-500" />
      </div>
      <Card className="p-6">
        <h2 className="font-semibold mb-2">Quick tips</h2>
        <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
          <li>Add or edit your projects from the Projects page.</li>
          <li>Reply to inbound messages in the Messages inbox.</li>
          <li>Configure your WhatsApp number in WhatsApp settings.</li>
          <li>Track engagement and click logs in Analytics.</li>
        </ul>
      </Card>
    </div>
  );
};

export default Overview;

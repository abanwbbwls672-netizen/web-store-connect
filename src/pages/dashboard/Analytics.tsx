import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

type Click = { id: string; created_at: string; country: string | null; source: string | null; ip_address: string | null };

const Analytics = () => {
  const { user } = useAuth();
  const [clicks, setClicks] = useState<Click[]>([]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase.from("click_logs").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(500);
      setClicks((data as Click[]) ?? []);
    })();
  }, [user]);

  // Build last 14 days chart
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
    clicks.reduce<Record<string, number>>((acc, c) => {
      const k = c.country || "Unknown";
      acc[k] = (acc[k] || 0) + 1;
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1]).slice(0, 8);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">WhatsApp click engagement over time.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-5"><p className="text-xs uppercase text-muted-foreground">Total clicks</p><p className="text-3xl font-bold mt-2">{clicks.length}</p></Card>
        <Card className="p-5"><p className="text-xs uppercase text-muted-foreground">Last 14 days</p><p className="text-3xl font-bold mt-2">{days.reduce((s, d) => s + d.clicks, 0)}</p></Card>
        <Card className="p-5"><p className="text-xs uppercase text-muted-foreground">Countries</p><p className="text-3xl font-bold mt-2">{countryStats.length}</p></Card>
      </div>

      <Card className="p-5">
        <h3 className="font-semibold mb-4">Clicks (last 14 days)</h3>
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
        <h3 className="font-semibold mb-4">Top countries</h3>
        {countryStats.length === 0 ? (
          <p className="text-sm text-muted-foreground">No data yet.</p>
        ) : (
          <div className="space-y-2">
            {countryStats.map(([country, count]) => (
              <div key={country} className="flex items-center justify-between text-sm">
                <span>{country}</span>
                <span className="font-mono text-muted-foreground">{count}</span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default Analytics;

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Mail, Phone, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

type Order = {
  id: string;
  service_title: string;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string | null;
  notes: string | null;
  status: "pending" | "in_progress" | "completed" | "cancelled";
  created_at: string;
};

const STATUS_META: Record<Order["status"], { label: string; cls: string }> = {
  pending: { label: "Pending", cls: "bg-yellow-500/15 text-yellow-600 border-yellow-500/30" },
  in_progress: { label: "In Progress", cls: "bg-blue-500/15 text-blue-600 border-blue-500/30" },
  completed: { label: "Completed", cls: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30" },
  cancelled: { label: "Cancelled", cls: "bg-destructive/15 text-destructive border-destructive/30" },
};

export default function OrdersManager({ userId }: { userId: string }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setOrders((data as Order[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
    const channel = supabase
      .channel("orders-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders", filter: `user_id=eq.${userId}` },
        () => load()
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const updateStatus = async (id: string, status: Order["status"]) => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Status updated");
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this order?")) return;
    const { error } = await supabase.from("orders").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Order deleted");
  };

  if (loading) {
    return (
      <div className="grid place-items-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (orders.length === 0) {
    return <Card className="p-12 text-center text-muted-foreground">No orders yet.</Card>;
  }

  return (
    <div className="space-y-3">
      {orders.map((o) => {
        const meta = STATUS_META[o.status];
        return (
          <Card key={o.id} className="p-5">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold">{o.customer_name}</h3>
                  <Badge variant="outline" className={meta.cls}>{meta.label}</Badge>
                </div>
                <p className="text-sm mt-1">
                  <span className="text-muted-foreground">Service: </span>
                  <span className="font-medium">{o.service_title}</span>
                </p>
                <div className="flex gap-3 text-xs text-muted-foreground mt-1 flex-wrap">
                  {o.customer_email && (
                    <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{o.customer_email}</span>
                  )}
                  {o.customer_phone && (
                    <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{o.customer_phone}</span>
                  )}
                  <span>{formatDistanceToNow(new Date(o.created_at), { addSuffix: true })}</span>
                </div>
                {o.notes && (
                  <p className="text-sm text-muted-foreground mt-3 whitespace-pre-wrap border-l-2 border-border pl-3">
                    {o.notes}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Select value={o.status} onValueChange={(v) => updateStatus(o.id, v as Order["status"])}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="ghost" size="sm" onClick={() => remove(o.id)} className="text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

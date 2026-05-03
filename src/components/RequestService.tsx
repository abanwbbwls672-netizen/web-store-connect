import { useState } from "react";
import { z } from "zod";
import { Send, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/hooks/useI18n";
import { useSiteContent } from "@/hooks/useSiteContent";

const schema = z.object({
  service_title: z.string().trim().min(2).max(120),
  customer_name: z.string().trim().min(2).max(80),
  customer_email: z.string().trim().email().max(160).optional().or(z.literal("")),
  customer_phone: z.string().trim().max(40).optional().or(z.literal("")),
  notes: z.string().trim().max(1000).optional().or(z.literal("")),
});

const SERVICES = [
  "Web Design",
  "Web Development",
  "E-commerce Store",
  "Landing Page",
  "SEO Optimization",
  "Maintenance & Support",
  "Other",
];

export const RequestService = () => {
  const { t, dir } = useI18n();
  const { ownerId } = useSiteContent();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    service_title: "",
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    notes: "",
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ownerId) return toast.error("Service unavailable");
    const parsed = schema.safeParse(form);
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);
    setLoading(true);
    const { error } = await supabase.from("orders").insert({
      user_id: ownerId,
      service_title: parsed.data.service_title,
      customer_name: parsed.data.customer_name,
      customer_email: parsed.data.customer_email || null,
      customer_phone: parsed.data.customer_phone || null,
      notes: parsed.data.notes || null,
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success(t("order.success"));
    setForm({ service_title: "", customer_name: "", customer_email: "", customer_phone: "", notes: "" });
  };

  return (
    <section id="request" className="py-24 sm:py-32 relative" dir={dir}>
      <div className="container max-w-3xl">
        <div className="text-center mb-10 animate-fade-up">
          <div className="text-xs font-mono uppercase tracking-[0.2em] text-primary mb-4">
            {t("order.tag")}
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight">
            {t("order.title.1")} <span className="text-gradient">{t("order.title.2")}</span>
          </h2>
          <p className="mt-4 text-muted-foreground">{t("order.desc")}</p>
        </div>

        <form
          onSubmit={submit}
          className="bg-gradient-card border border-border rounded-2xl p-6 sm:p-8 animate-fade-up"
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs font-medium text-muted-foreground">{t("order.f.service")}</label>
              <Select value={form.service_title} onValueChange={(v) => setForm({ ...form, service_title: v })}>
                <SelectTrigger className="mt-1.5 bg-background/60">
                  <SelectValue placeholder={t("order.f.service.ph")} />
                </SelectTrigger>
                <SelectContent>
                  {SERVICES.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">{t("order.f.name")}</label>
              <Input value={form.customer_name} onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
                maxLength={80} className="mt-1.5 bg-background/60" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">{t("order.f.phone")}</label>
              <Input value={form.customer_phone} onChange={(e) => setForm({ ...form, customer_phone: e.target.value })}
                maxLength={40} className="mt-1.5 bg-background/60" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-medium text-muted-foreground">{t("order.f.email")}</label>
              <Input type="email" value={form.customer_email} onChange={(e) => setForm({ ...form, customer_email: e.target.value })}
                maxLength={160} className="mt-1.5 bg-background/60" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-medium text-muted-foreground">{t("order.f.notes")}</label>
              <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={5} maxLength={1000} className="mt-1.5 bg-background/60 resize-none" />
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <Button type="submit" variant="hero" size="lg" disabled={loading}>
              {loading ? t("order.f.sending") : (<><ClipboardList className="h-4 w-4" /> {t("order.f.submit")}</>)}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
};

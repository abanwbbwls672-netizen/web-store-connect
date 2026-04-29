import { useState } from "react";
import { z } from "zod";
import { Mail, MessageCircle, Send, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useI18n } from "@/hooks/useI18n";

const WHATSAPP_NUMBER = "201226601882";

const schema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(160),
  message: z.string().trim().min(10).max(1000),
});

export const Contact = () => {
  const { t } = useI18n();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setForm({ name: "", email: "", message: "" });
      toast.success(t("contact.success"));
    }, 700);
  };

  const waLink = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(t("wa.default"))}`;

  return (
    <section id="contact" className="py-24 sm:py-32 relative">
      <div className="container">
        <div className="grid lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2 animate-fade-up">
            <div className="text-xs font-mono uppercase tracking-[0.2em] text-primary mb-4">{t("contact.tag")}</div>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight">
              {t("contact.title.1")} <span className="text-gradient">{t("contact.title.great")}</span>.
            </h2>
            <p className="mt-5 text-muted-foreground">{t("contact.desc")}</p>

            <div className="mt-8 space-y-3">
              <a href={waLink} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 rounded-xl bg-gradient-card border border-border hover:border-primary/50 transition-colors group">
                <div className="h-10 w-10 rounded-lg bg-primary/10 grid place-items-center text-primary"><MessageCircle className="h-5 w-5" /></div>
                <div>
                  <div className="text-xs text-muted-foreground">{t("contact.whatsapp")}</div>
                  <div className="font-medium">+20 122 660 1882</div>
                </div>
              </a>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-card border border-border">
                <div className="h-10 w-10 rounded-lg bg-primary/10 grid place-items-center text-primary"><Mail className="h-5 w-5" /></div>
                <div>
                  <div className="text-xs text-muted-foreground">{t("contact.email")}</div>
                  <div className="font-medium">hello@webstore.dev</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-card border border-border">
                <div className="h-10 w-10 rounded-lg bg-primary/10 grid place-items-center text-primary"><MapPin className="h-5 w-5" /></div>
                <div>
                  <div className="text-xs text-muted-foreground">{t("contact.location")}</div>
                  <div className="font-medium">{t("contact.location.value")}</div>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}
            className="lg:col-span-3 bg-gradient-card border border-border rounded-2xl p-6 sm:p-8 animate-fade-up"
            style={{ animationDelay: "0.1s" }}>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground">{t("contact.f.name")}</label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder={t("contact.f.name.ph")} maxLength={80} className="mt-1.5 bg-background/60" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">{t("contact.f.email")}</label>
                <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder={t("contact.f.email.ph")} maxLength={160} className="mt-1.5 bg-background/60" />
              </div>
            </div>
            <div className="mt-4">
              <label className="text-xs font-medium text-muted-foreground">{t("contact.f.message")}</label>
              <Textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder={t("contact.f.message.ph")} rows={6} maxLength={1000} className="mt-1.5 bg-background/60 resize-none" />
            </div>
            <div className="mt-6 flex items-center justify-between gap-4 flex-wrap">
              <p className="text-xs text-muted-foreground">{t("contact.f.legal")}</p>
              <Button type="submit" variant="hero" size="lg" disabled={loading}>
                {loading ? t("contact.f.sending") : (<>{t("contact.f.submit")} <Send className="h-4 w-4" /></>)}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

import { useEffect, useState } from "react";
import { MessageCircle, X, Send, Copy, Check, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/hooks/useI18n";
import { toast } from "sonner";

const WHATSAPP_NUMBER = "201226601882";
const DISPLAY_NUMBER = "+20 122 660 1882";

export const WhatsAppWidget = () => {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [pulse, setPulse] = useState(true);
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => { setMessage(t("wa.default")); }, [t]);
  useEffect(() => {
    const tm = setTimeout(() => setPulse(false), 8000);
    return () => clearTimeout(tm);
  }, []);

  const buildWhatsAppUrl = (text: string) => {
    const enc = encodeURIComponent(text);
    return `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${enc}`;
  };

  const trackWhatsAppClick = () => {
    try {
      const key = "wa_clicks";
      const n = Number(localStorage.getItem(key) || "0") + 1;
      localStorage.setItem(key, String(n));
    } catch {}
  };

  const whatsappHref = buildWhatsAppUrl(message.trim() || t("wa.default"));

  const copyMessage = async () => {
    const text = message.trim() || t("wa.default");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success(t("wa.copied"));
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); toast.success(t("wa.copied")); } catch {}
      document.body.removeChild(ta);
    }
  };

  return (
    <>
      <div
        className={cn(
          "fixed z-50 bottom-24 right-4 sm:right-6 rtl:right-auto rtl:left-4 sm:rtl:left-6 w-[min(360px,calc(100vw-2rem))] origin-bottom-right rtl:origin-bottom-left transition-all duration-300",
          open ? "opacity-100 translate-y-0 scale-100 pointer-events-auto" : "opacity-0 translate-y-4 scale-95 pointer-events-none"
        )}
      >
        <div className="glass rounded-2xl shadow-elegant overflow-hidden border-border/80">
          <div className="bg-gradient-primary p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-background/20 grid place-items-center text-primary-foreground font-bold">W</div>
            <div className="flex-1 leading-tight">
              <div className="text-primary-foreground font-semibold">{t("wa.title")}</div>
              <div className="text-[11px] text-primary-foreground/80 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 animate-pulse" />
                {t("wa.subtitle")}
              </div>
            </div>
            <button aria-label="Close chat" onClick={() => setOpen(false)}
              className="h-8 w-8 grid place-items-center rounded-lg text-primary-foreground hover:bg-background/15 transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="p-4 bg-card/80">
            <div className="flex gap-2">
              <div className="h-8 w-8 rounded-full bg-gradient-primary shrink-0 grid place-items-center text-primary-foreground text-xs font-bold">W</div>
              <div className="bg-secondary text-foreground text-sm rounded-2xl rounded-tl-sm px-3.5 py-2.5 max-w-[85%]">
                {t("wa.greet")}
              </div>
            </div>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value.slice(0, 500))}
              placeholder={t("wa.placeholder")}
              rows={3}
              className="mt-4 w-full resize-none rounded-xl bg-background border border-border px-3 py-2.5 text-sm focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all"
            />

            <a href={whatsappHref} target="_blank" rel="noopener noreferrer" onClick={trackWhatsAppClick}
              className="mt-3 w-full bg-gradient-primary text-primary-foreground font-semibold rounded-xl py-3 flex items-center justify-center gap-2 hover:shadow-glow transition-all duration-300">
              <Send className="h-4 w-4" />
              {t("wa.send")}
            </a>

            <button onClick={copyMessage}
              className="mt-2 w-full bg-secondary text-foreground font-medium rounded-xl py-2.5 flex items-center justify-center gap-2 hover:bg-secondary/80 transition-all duration-300 text-sm">
              {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
              {t("wa.copy")}
            </button>

            <div className="mt-3 rounded-xl border border-border bg-background/50 p-3">
              <p className="text-[11px] text-muted-foreground mb-1.5">{t("wa.fallback")}</p>
              <a
                href={`tel:+${WHATSAPP_NUMBER}`}
                className="flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                aria-label={t("wa.number")}
              >
                <Phone className="h-3.5 w-3.5" />
                <span dir="ltr">{DISPLAY_NUMBER}</span>
              </a>
            </div>

            <p className="mt-3 text-[11px] text-muted-foreground text-center">
              {t("wa.powered")} <span className="font-medium text-foreground">Web Store</span>
            </p>
          </div>
        </div>
      </div>

      <button
        aria-label={open ? "Close WhatsApp chat" : "Open WhatsApp chat"}
        onClick={() => { setOpen((v) => !v); setPulse(false); }}
        className={cn(
          "fixed z-50 bottom-5 right-4 sm:right-6 rtl:right-auto rtl:left-4 sm:rtl:left-6 h-14 w-14 rounded-full bg-gradient-primary text-primary-foreground grid place-items-center shadow-glow transition-all duration-300 hover:scale-110",
          pulse && "animate-pulse-glow"
        )}
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
    </>
  );
};

import { useEffect, useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { cn } from "@/lib/utils";

const WHATSAPP_NUMBER = "201226601882";
const DEFAULT_MESSAGE = "Hi! I came from your portfolio and I'd like to discuss a project.";
const AGENT_NAME = "Web Store";

export const WhatsAppWidget = () => {
  const [open, setOpen] = useState(false);
  const [pulse, setPulse] = useState(true);
  const [message, setMessage] = useState(DEFAULT_MESSAGE);

  useEffect(() => {
    const t = setTimeout(() => setPulse(false), 8000);
    return () => clearTimeout(t);
  }, []);

  const sendToWhatsApp = () => {
    const text = encodeURIComponent(message.trim() || DEFAULT_MESSAGE);
    // Lightweight click tracking (will be wired to backend in next iteration)
    try {
      const key = "wa_clicks";
      const n = Number(localStorage.getItem(key) || "0") + 1;
      localStorage.setItem(key, String(n));
    } catch {}
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      {/* Popup chat */}
      <div
        className={cn(
          "fixed z-50 bottom-24 right-4 sm:right-6 w-[min(360px,calc(100vw-2rem))] origin-bottom-right transition-all duration-300",
          open ? "opacity-100 translate-y-0 scale-100 pointer-events-auto" : "opacity-0 translate-y-4 scale-95 pointer-events-none"
        )}
      >
        <div className="glass rounded-2xl shadow-elegant overflow-hidden border-border/80">
          <div className="bg-gradient-primary p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-background/20 grid place-items-center text-primary-foreground font-bold">
              W
            </div>
            <div className="flex-1 leading-tight">
              <div className="text-primary-foreground font-semibold">{AGENT_NAME}</div>
              <div className="text-[11px] text-primary-foreground/80 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 animate-pulse" />
                Typically replies in minutes
              </div>
            </div>
            <button
              aria-label="Close chat"
              onClick={() => setOpen(false)}
              className="h-8 w-8 grid place-items-center rounded-lg text-primary-foreground hover:bg-background/15 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="p-4 bg-card/80">
            <div className="flex gap-2">
              <div className="h-8 w-8 rounded-full bg-gradient-primary shrink-0 grid place-items-center text-primary-foreground text-xs font-bold">W</div>
              <div className="bg-secondary text-foreground text-sm rounded-2xl rounded-tl-sm px-3.5 py-2.5 max-w-[85%]">
                👋 Hi! How can I help you today? Send a message and I'll get back to you on WhatsApp.
              </div>
            </div>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value.slice(0, 500))}
              placeholder="Type your message…"
              rows={3}
              className="mt-4 w-full resize-none rounded-xl bg-background border border-border px-3 py-2.5 text-sm focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all"
            />

            <button
              onClick={sendToWhatsApp}
              className="mt-3 w-full bg-gradient-primary text-primary-foreground font-semibold rounded-xl py-3 flex items-center justify-center gap-2 hover:shadow-glow transition-all duration-300"
            >
              <Send className="h-4 w-4" />
              Send via WhatsApp
            </button>
            <p className="mt-3 text-[11px] text-muted-foreground text-center">
              Powered by <span className="font-medium text-foreground">Web Store</span>
            </p>
          </div>
        </div>
      </div>

      {/* Floating button */}
      <button
        aria-label={open ? "Close WhatsApp chat" : "Open WhatsApp chat"}
        onClick={() => { setOpen((v) => !v); setPulse(false); }}
        className={cn(
          "fixed z-50 bottom-5 right-4 sm:right-6 h-14 w-14 rounded-full bg-gradient-primary text-primary-foreground grid place-items-center shadow-glow transition-all duration-300 hover:scale-110",
          pulse && "animate-pulse-glow"
        )}
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
    </>
  );
};

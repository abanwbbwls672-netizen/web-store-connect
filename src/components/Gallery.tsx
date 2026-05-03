import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Image as ImageIcon, Film, Loader2 } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";
import { useSiteContent } from "@/hooks/useSiteContent";

type Item = { name: string; url: string; type: "image" | "video" };

const STR = {
  en: { tag: "GALLERY", t1: "Visual", t2: "showcase", desc: "A glimpse of the work — images and videos from our portfolio.", empty: "No media yet." },
  ar: { tag: "المعرض", t1: "لمحة", t2: "بصرية", desc: "نظرة على الأعمال — صور وفيديوهات من معرضنا.", empty: "لا توجد وسائط بعد." },
};

export const Gallery = () => {
  const { lang } = useI18n();
  const s = STR[lang as "en" | "ar"] ?? STR.en;
  const dir = lang === "ar" ? "rtl" : "ltr";
  const { ownerId } = useSiteContent();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<Item | null>(null);

  const load = async (uid: string) => {
    setLoading(true);
    const { data, error } = await supabase.storage
      .from("media")
      .list(uid, { limit: 100, sortBy: { column: "created_at", order: "desc" } });
    setLoading(false);
    if (error) return;
    const list: Item[] = (data ?? [])
      .filter((f) => f.name && !f.name.startsWith("."))
      .map((f) => {
        const { data: pub } = supabase.storage.from("media").getPublicUrl(`${uid}/${f.name}`);
        const isVideo = /\.(mp4|webm|mov)$/i.test(f.name);
        return { name: f.name, url: pub.publicUrl, type: isVideo ? "video" : "image" };
      });
    setItems(list);
  };

  useEffect(() => {
    if (!ownerId) return;
    load(ownerId);
    const ch = supabase
      .channel("gallery-storage")
      .on("postgres_changes", { event: "*", schema: "storage", table: "objects" }, () => load(ownerId))
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [ownerId]);

  if (!ownerId) return null;

  return (
    <section id="gallery" className="py-24 sm:py-32 relative" dir={dir}>
      <div className="container">
        <div className="text-center mb-12 animate-fade-up">
          <div className="text-xs font-mono uppercase tracking-[0.2em] text-primary mb-4">{s.tag}</div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight">
            {s.t1} <span className="text-gradient">{s.t2}</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">{s.desc}</p>
        </div>

        {loading ? (
          <div className="grid place-items-center py-16"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
        ) : items.length === 0 ? (
          <Card className="p-12 text-center text-muted-foreground">{s.empty}</Card>
        ) : (
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
            {items.map((item) => (
              <button
                key={item.url}
                onClick={() => setActive(item)}
                className="group relative aspect-square overflow-hidden rounded-xl border border-border bg-muted/30 hover:border-primary/50 transition-all"
              >
                {item.type === "image" ? (
                  <img src={item.url} alt={item.name} loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                ) : (
                  <video src={item.url} muted playsInline preload="metadata"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <Badge variant="secondary" className="absolute top-2 start-2 text-xs gap-1">
                  {item.type === "image" ? <ImageIcon className="h-3 w-3" /> : <Film className="h-3 w-3" />}
                  {item.type}
                </Badge>
              </button>
            ))}
          </div>
        )}
      </div>

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-background">
          {active?.type === "image" ? (
            <img src={active.url} alt={active.name} className="w-full h-auto max-h-[85vh] object-contain" />
          ) : active ? (
            <video src={active.url} controls autoPlay className="w-full h-auto max-h-[85vh]" />
          ) : null}
        </DialogContent>
      </Dialog>
    </section>
  );
};

import { useEffect, useRef, useState, useCallback } from "react";
import { Upload, Trash2, Copy, Image as ImageIcon, Film, Loader2, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { useI18n } from "@/hooks/useI18n";

type MediaItem = {
  name: string;
  path: string;
  url: string;
  size: number;
  type: "image" | "video";
  created_at: string;
};

const MAX_SIZE = 100 * 1024 * 1024; // 100 MB
const ACCEPTED = "image/jpeg,image/png,image/webp,image/gif,image/svg+xml,video/mp4,video/webm,video/quicktime";

const formatSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
};

export default function MediaLibrary({ userId }: { userId: string }) {
  const { t } = useI18n();
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [query, setQuery] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.storage
      .from("media")
      .list(userId, { limit: 200, sortBy: { column: "created_at", order: "desc" } });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    const list: MediaItem[] = (data ?? [])
      .filter((f) => f.name && !f.name.startsWith("."))
      .map((f) => {
        const path = `${userId}/${f.name}`;
        const { data: pub } = supabase.storage.from("media").getPublicUrl(path);
        const isVideo = /\.(mp4|webm|mov)$/i.test(f.name);
        return {
          name: f.name,
          path,
          url: pub.publicUrl,
          size: (f.metadata as any)?.size ?? 0,
          type: isVideo ? "video" : "image",
          created_at: f.created_at ?? "",
        };
      });
    setItems(list);
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  const uploadFiles = async (files: FileList | File[]) => {
    const arr = Array.from(files);
    if (arr.length === 0) return;

    // Validate
    for (const f of arr) {
      if (f.size > MAX_SIZE) {
        toast.error(`${f.name}: ${t("db.media.tooLarge")}`);
        return;
      }
      if (!ACCEPTED.includes(f.type)) {
        toast.error(`${f.name}: ${t("db.media.badType")}`);
        return;
      }
    }

    setUploading(true);
    setProgress(0);
    let done = 0;
    for (const file of arr) {
      const ext = file.name.split(".").pop();
      const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 80);
      const path = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safe}`;
      const { error } = await supabase.storage.from("media").upload(path, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });
      if (error) {
        toast.error(`${file.name}: ${error.message}`);
      }
      done++;
      setProgress(Math.round((done / arr.length) * 100));
    }
    setUploading(false);
    toast.success(t("db.media.uploaded"));
    load();
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files?.length) uploadFiles(e.dataTransfer.files);
  };

  const removeItem = async (item: MediaItem) => {
    if (!confirm(t("db.media.confirmDel"))) return;
    const { error } = await supabase.storage.from("media").remove([item.path]);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(t("db.toast.deleted"));
    load();
  };

  const copyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success(t("db.media.urlCopied"));
    } catch {
      toast.error("Copy failed");
    }
  };

  const filtered = items.filter((i) => i.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="space-y-6">
      {/* Uploader */}
      <Card
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={`p-8 border-2 border-dashed transition-colors text-center ${
          dragOver ? "border-primary bg-primary/5" : "border-border"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED}
          multiple
          className="hidden"
          onChange={(e) => e.target.files && uploadFiles(e.target.files)}
        />
        <div className="flex flex-col items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-primary/15 grid place-items-center text-primary">
            <Upload className="h-6 w-6" />
          </div>
          <div>
            <p className="font-medium">{t("db.media.dropTitle")}</p>
            <p className="text-xs text-muted-foreground mt-1">{t("db.media.dropHint")}</p>
          </div>
          <Button variant="hero" onClick={() => inputRef.current?.click()} disabled={uploading}>
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            {t("db.media.choose")}
          </Button>
          {uploading && (
            <div className="w-full max-w-md">
              <Progress value={progress} />
              <p className="text-xs text-muted-foreground mt-2">{progress}%</p>
            </div>
          )}
        </div>
      </Card>

      {/* Search */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("db.media.search")}
            className="ps-9"
          />
        </div>
        <Badge variant="secondary">{filtered.length}</Badge>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid place-items-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <Card className="p-12 text-center text-muted-foreground">{t("db.media.empty")}</Card>
      ) : (
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((item) => (
            <Card key={item.path} className="overflow-hidden group glass">
              <div className="relative aspect-square bg-muted/40">
                {item.type === "image" ? (
                  <img
                    src={item.url}
                    alt={item.name}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <video
                    src={item.url}
                    className="h-full w-full object-cover"
                    muted
                    playsInline
                    preload="metadata"
                  />
                )}
                <div className="absolute top-2 start-2">
                  <Badge variant="secondary" className="text-xs gap-1">
                    {item.type === "image" ? <ImageIcon className="h-3 w-3" /> : <Film className="h-3 w-3" />}
                    {item.type}
                  </Badge>
                </div>
              </div>
              <div className="p-3 space-y-2">
                <p className="text-xs font-medium truncate" title={item.name}>
                  {item.name}
                </p>
                <p className="text-[10px] text-muted-foreground">{formatSize(item.size)}</p>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" className="flex-1 h-8 text-xs" onClick={() => copyUrl(item.url)}>
                    <Copy className="h-3 w-3" /> {t("db.media.copyUrl")}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-destructive"
                    onClick={() => removeItem(item)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

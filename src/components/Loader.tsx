import { useEffect, useState } from "react";
import { Code2 } from "lucide-react";

export const Loader = () => {
  const [hidden, setHidden] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setHidden(true), 650);
    const t2 = setTimeout(() => setGone(true), 1100);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (gone) return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[100] grid place-items-center bg-background transition-opacity duration-500 ${
        hidden ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="absolute inset-0 rounded-2xl bg-gradient-primary blur-xl opacity-50 animate-pulse-glow" />
          <div className="relative h-14 w-14 rounded-2xl bg-gradient-primary grid place-items-center shadow-glow">
            <Code2 className="h-7 w-7 text-primary-foreground" />
          </div>
        </div>
        <div className="text-xs font-mono text-muted-foreground tracking-widest uppercase">
          Web Store
        </div>
      </div>
    </div>
  );
};

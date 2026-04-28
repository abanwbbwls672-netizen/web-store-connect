import { useEffect, useState } from "react";
import { Menu, X, Code2, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useI18n } from "@/hooks/useI18n";

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { t, lang, toggle } = useI18n();

  const links = [
    { label: t("nav.home"), href: "#home" },
    { label: t("nav.about"), href: "#about" },
    { label: t("nav.projects"), href: "#projects" },
    { label: t("nav.skills"), href: "#skills" },
    { label: t("nav.contact"), href: "#contact" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const LangBtn = (
    <Button variant="ghost" size="sm" onClick={toggle} className="gap-1.5" title="Language">
      <Languages className="h-4 w-4" />
      <span className="font-mono text-xs">{lang === "en" ? "العربية" : "EN"}</span>
    </Button>
  );

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled ? "py-3" : "py-5"
      )}
    >
      <div
        className={cn(
          "container flex items-center justify-between rounded-2xl px-4 sm:px-6 transition-all duration-300",
          scrolled ? "glass shadow-card py-2.5" : "py-3"
        )}
      >
        <a href="#home" className="flex items-center gap-2 group">
          <div className="h-9 w-9 rounded-xl bg-gradient-primary grid place-items-center shadow-glow group-hover:scale-105 transition-transform">
            <Code2 className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="leading-tight">
            <div className="font-bold tracking-tight">Web Store</div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Dev Studio</div>
          </div>
        </a>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          {LangBtn}
          <Button variant="ghost" size="sm" asChild>
            <a href="/dashboard">{t("nav.dashboard")}</a>
          </Button>
          <Button variant="hero" size="sm" asChild>
            <a href="#contact">{t("nav.hire")}</a>
          </Button>
        </div>

        <button
          aria-label="Toggle menu"
          className="md:hidden h-10 w-10 grid place-items-center rounded-lg hover:bg-secondary transition-colors"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden container mt-2">
          <div className="glass rounded-2xl p-3 flex flex-col animate-slide-in">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="px-4 py-3 rounded-lg hover:bg-secondary text-sm"
              >
                {l.label}
              </a>
            ))}
            <div className="flex gap-2 mt-2">
              <Button variant="outline" className="flex-1" onClick={() => { toggle(); setOpen(false); }}>
                <Languages className="h-4 w-4" /> {lang === "en" ? "العربية" : "English"}
              </Button>
              <Button variant="hero" className="flex-1" asChild>
                <a href="#contact" onClick={() => setOpen(false)}>{t("nav.hire")}</a>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

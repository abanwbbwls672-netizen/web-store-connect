import { ArrowRight, Sparkles, Github, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";
import { useI18n } from "@/hooks/useI18n";
import { useSiteContent } from "@/hooks/useSiteContent";

export const Hero = () => {
  const { t } = useI18n();
  const { content } = useSiteContent();

  const v = (key: keyof NonNullable<typeof content>, fallback: string) =>
    (content?.[key] as string) || fallback;

  const stats = [
    { k: v("hero_stat_projects_value", "50+"), v: v("hero_stat_projects", t("hero.stats.projects")) },
    { k: v("hero_stat_years_value", "8+"), v: v("hero_stat_years", t("hero.stats.years")) },
    { k: v("hero_stat_clients_value", "30+"), v: v("hero_stat_clients", t("hero.stats.clients")) },
    { k: v("hero_stat_uptime_value", "99%"), v: v("hero_stat_uptime", t("hero.stats.uptime")) },
  ];

  return (
    <section id="home" className="relative min-h-screen flex items-center pt-28 pb-20 overflow-hidden bg-hero">
      <img src={heroBg} alt="" aria-hidden="true" width={1920} height={1080}
        className="absolute inset-0 w-full h-full object-cover opacity-40 pointer-events-none" />
      <div className="absolute inset-0 grid-pattern opacity-60 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/20 to-background pointer-events-none" />

      <div className="container relative z-10">
        <div className="max-w-3xl mx-auto text-center animate-fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-medium text-muted-foreground mb-6">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            {v("hero_badge", t("hero.badge"))}
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight leading-[1.05]">
            {v("hero_title_1", t("hero.title.1"))} <br className="hidden sm:block" />
            {v("hero_title_2", t("hero.title.2"))} <span className="text-gradient">{v("hero_title_precision", t("hero.title.precision"))}</span>.
          </h1>

          <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            {v("hero_desc", t("hero.desc"))}
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Button variant="hero" size="lg" asChild>
              <a href="#projects">{v("hero_cta_view", t("hero.cta.view"))} <ArrowRight className="h-4 w-4 rtl:rotate-180" /></a>
            </Button>
            <Button variant="glow" size="lg" asChild>
              <a href="#contact">{v("hero_cta_start", t("hero.cta.start"))}</a>
            </Button>
          </div>

          <div className="mt-10 flex items-center justify-center gap-4 text-muted-foreground">
            <a href="#" aria-label="GitHub" className="hover:text-foreground transition-colors"><Github className="h-5 w-5" /></a>
            <a href="#" aria-label="LinkedIn" className="hover:text-foreground transition-colors"><Linkedin className="h-5 w-5" /></a>
            <span className="text-xs font-mono">·  webstore.dev</span>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {stats.map((s, i) => (
            <div key={s.v + i} className="glass rounded-2xl p-5 text-center animate-fade-up" style={{ animationDelay: `${0.1 * (i + 1)}s` }}>
              <div className="text-2xl sm:text-3xl font-bold text-gradient">{s.k}</div>
              <div className="text-xs text-muted-foreground mt-1">{s.v}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

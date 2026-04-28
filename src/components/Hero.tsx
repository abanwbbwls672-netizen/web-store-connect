import { ArrowRight, Sparkles, Github, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";

export const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center pt-28 pb-20 overflow-hidden bg-hero">
      <img
        src={heroBg}
        alt=""
        aria-hidden="true"
        width={1920}
        height={1080}
        className="absolute inset-0 w-full h-full object-cover opacity-40 pointer-events-none"
      />
      <div className="absolute inset-0 grid-pattern opacity-60 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/20 to-background pointer-events-none" />

      <div className="container relative z-10">
        <div className="max-w-3xl mx-auto text-center animate-fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-medium text-muted-foreground mb-6">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Available for new projects · 2026
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight leading-[1.05]">
            Building modern <br className="hidden sm:block" />
            web products with <span className="text-gradient">precision</span>.
          </h1>

          <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Hi — I'm the developer behind <span className="text-foreground font-medium">Web Store</span>.
            I design and ship fast, scalable SaaS apps, dashboards, and digital products
            with clean code and thoughtful UX.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Button variant="hero" size="lg" asChild>
              <a href="#projects">
                View Projects <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
            <Button variant="glow" size="lg" asChild>
              <a href="#contact">Start a Project</a>
            </Button>
          </div>

          <div className="mt-10 flex items-center justify-center gap-4 text-muted-foreground">
            <a href="#" aria-label="GitHub" className="hover:text-foreground transition-colors">
              <Github className="h-5 w-5" />
            </a>
            <a href="#" aria-label="LinkedIn" className="hover:text-foreground transition-colors">
              <Linkedin className="h-5 w-5" />
            </a>
            <span className="text-xs font-mono">·  webstore.dev</span>
          </div>
        </div>

        {/* Floating stats */}
        <div className="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {[
            { k: "50+", v: "Projects shipped" },
            { k: "8+", v: "Years experience" },
            { k: "30+", v: "Happy clients" },
            { k: "99%", v: "Uptime SLA" },
          ].map((s, i) => (
            <div
              key={s.v}
              className="glass rounded-2xl p-5 text-center animate-fade-up"
              style={{ animationDelay: `${0.1 * (i + 1)}s` }}
            >
              <div className="text-2xl sm:text-3xl font-bold text-gradient">{s.k}</div>
              <div className="text-xs text-muted-foreground mt-1">{s.v}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

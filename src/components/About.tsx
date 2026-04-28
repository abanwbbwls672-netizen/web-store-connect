import { Cpu, Layers, Rocket, ShieldCheck } from "lucide-react";

const features = [
  { icon: Rocket, title: "Fast delivery", desc: "From idea to production-ready in weeks, not months." },
  { icon: Layers, title: "Scalable systems", desc: "Architectures designed to grow with your business." },
  { icon: ShieldCheck, title: "Secure by default", desc: "Auth, RLS, and best-practice security baked in." },
  { icon: Cpu, title: "Modern stack", desc: "React, TypeScript, Postgres, edge functions, AI." },
];

export const About = () => {
  return (
    <section id="about" className="py-24 sm:py-32 relative">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          <div className="animate-fade-up">
            <div className="text-xs font-mono uppercase tracking-[0.2em] text-primary mb-4">
              // about
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight">
              A studio of one, <br />
              built for <span className="text-gradient">serious products</span>.
            </h2>
            <p className="mt-6 text-muted-foreground leading-relaxed">
              Web Store is the personal studio of an independent software developer.
              I partner with founders and teams to design, build, and ship modern
              web applications — from MVPs to multi-tenant SaaS platforms.
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              I care deeply about craft: clean architecture, thoughtful UX,
              accessible interfaces, and code that other developers enjoy reading.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {features.map((f, i) => (
              <div
                key={f.title}
                className="bg-gradient-card border border-border rounded-2xl p-6 hover:border-primary/40 hover:shadow-glow transition-all duration-300 animate-fade-up"
                style={{ animationDelay: `${0.1 * (i + 1)}s` }}
              >
                <div className="h-11 w-11 rounded-xl bg-primary/10 border border-primary/20 grid place-items-center mb-4">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="font-semibold">{f.title}</div>
                <div className="text-sm text-muted-foreground mt-1.5">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

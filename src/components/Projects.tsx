import { ArrowUpRight } from "lucide-react";

const projects = [
  {
    title: "Nimbus CRM",
    tag: "SaaS · Multi-tenant",
    desc: "Customer pipeline with realtime collaboration, role-based access, and Stripe billing.",
    tech: ["React", "Postgres", "Edge Functions"],
    color: "from-emerald-500/30 to-cyan-500/10",
  },
  {
    title: "Cartwave Storefront",
    tag: "E-commerce",
    desc: "Headless storefront with sub-second navigation and an admin for inventory & orders.",
    tech: ["Next-style SPA", "Stripe", "PostgreSQL"],
    color: "from-cyan-500/30 to-sky-500/10",
  },
  {
    title: "Pulse Analytics",
    tag: "Dashboard",
    desc: "Realtime product analytics with custom funnels, cohorts, and AI-generated summaries.",
    tech: ["TypeScript", "Recharts", "AI Gateway"],
    color: "from-fuchsia-500/30 to-emerald-500/10",
  },
  {
    title: "Helpdesk by Web Store",
    tag: "Support tool",
    desc: "Lightweight inbox with WhatsApp + email channels, macros, and team performance.",
    tech: ["React", "Realtime", "WhatsApp API"],
    color: "from-amber-500/30 to-emerald-500/10",
  },
  {
    title: "Lumen Docs",
    tag: "Knowledge base",
    desc: "Beautiful Markdown-based documentation engine with versioning and search.",
    tech: ["MDX", "Search", "Edge"],
    color: "from-violet-500/30 to-cyan-500/10",
  },
  {
    title: "Beacon Auth",
    tag: "Open source",
    desc: "Drop-in authentication starter: email, OAuth, magic links, and RLS-ready policies.",
    tech: ["TS", "Postgres", "JWT"],
    color: "from-emerald-500/30 to-teal-500/10",
  },
];

export const Projects = () => {
  return (
    <section id="projects" className="py-24 sm:py-32 relative">
      <div className="container">
        <div className="flex items-end justify-between flex-wrap gap-6 mb-12">
          <div className="animate-fade-up">
            <div className="text-xs font-mono uppercase tracking-[0.2em] text-primary mb-4">
              // selected work
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight">
              Projects that <span className="text-gradient">shipped</span>.
            </h2>
          </div>
          <p className="max-w-md text-muted-foreground">
            A snapshot of recent products — from internal tools to public-facing
            SaaS platforms used by thousands of users.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((p, i) => (
            <article
              key={p.title}
              className="group relative bg-gradient-card border border-border rounded-2xl p-6 overflow-hidden hover:border-primary/40 transition-all duration-300 hover:-translate-y-1 animate-fade-up"
              style={{ animationDelay: `${0.05 * (i + 1)}s` }}
            >
              <div className={`absolute -top-20 -right-20 h-48 w-48 rounded-full bg-gradient-to-br ${p.color} blur-3xl opacity-60 group-hover:opacity-100 transition-opacity`} />
              <div className="relative">
                <div className="flex items-start justify-between gap-4">
                  <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                    {p.tag}
                  </div>
                  <div className="h-9 w-9 rounded-lg border border-border grid place-items-center group-hover:border-primary/60 group-hover:bg-primary/10 transition-colors">
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                  </div>
                </div>
                <h3 className="mt-4 text-xl font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {p.tech.map((t) => (
                    <span key={t} className="text-[11px] font-mono px-2 py-1 rounded-md bg-secondary text-muted-foreground border border-border">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

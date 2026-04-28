const skillGroups = [
  {
    title: "Frontend",
    items: ["React", "TypeScript", "Next-style SPA", "Tailwind CSS", "Framer Motion", "Vite"],
  },
  {
    title: "Backend",
    items: ["Node.js", "Edge Functions", "REST", "GraphQL", "WebSockets", "JWT Auth"],
  },
  {
    title: "Database",
    items: ["PostgreSQL", "Row-Level Security", "Redis", "Prisma", "SQL", "Migrations"],
  },
  {
    title: "DevOps & Tools",
    items: ["Git", "CI/CD", "Docker", "Vercel", "Sentry", "Analytics"],
  },
];

export const Skills = () => {
  return (
    <section id="skills" className="py-24 sm:py-32 relative">
      <div className="container">
        <div className="max-w-2xl mb-12 animate-fade-up">
          <div className="text-xs font-mono uppercase tracking-[0.2em] text-primary mb-4">
            // toolkit
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight">
            The <span className="text-gradient">stack</span> I build with.
          </h2>
          <p className="mt-4 text-muted-foreground">
            A modern, battle-tested stack focused on developer experience,
            performance, and long-term maintainability.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {skillGroups.map((g, gi) => (
            <div
              key={g.title}
              className="bg-gradient-card border border-border rounded-2xl p-6 animate-fade-up"
              style={{ animationDelay: `${0.08 * (gi + 1)}s` }}
            >
              <div className="text-sm font-semibold mb-4 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-glow" />
                {g.title}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {g.items.map((item) => (
                  <span
                    key={item}
                    className="text-xs font-mono px-2.5 py-1.5 rounded-lg bg-secondary border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

import { useI18n } from "@/hooks/useI18n";

export const Skills = () => {
  const { t } = useI18n();
  const skillGroups = [
    { title: t("skills.frontend"), items: ["React", "TypeScript", "Vite", "Tailwind CSS", "Framer Motion"] },
    { title: t("skills.backend"), items: ["Node.js", "Edge Functions", "REST", "GraphQL", "WebSockets", "JWT Auth"] },
    { title: t("skills.database"), items: ["PostgreSQL", "Row-Level Security", "Redis", "Prisma", "SQL"] },
    { title: t("skills.devops"), items: ["Git", "CI/CD", "Docker", "Vercel", "Sentry", "Analytics"] },
  ];
  return (
    <section id="skills" className="py-24 sm:py-32 relative">
      <div className="container">
        <div className="max-w-2xl mb-12 animate-fade-up">
          <div className="text-xs font-mono uppercase tracking-[0.2em] text-primary mb-4">{t("skills.tag")}</div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight">
            {t("skills.title.1")}<span className="text-gradient">{t("skills.title.stack")}</span> {t("skills.title.2")}
          </h2>
          <p className="mt-4 text-muted-foreground">{t("skills.desc")}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {skillGroups.map((g, gi) => (
            <div key={g.title}
              className="bg-gradient-card border border-border rounded-2xl p-6 animate-fade-up"
              style={{ animationDelay: `${0.08 * (gi + 1)}s` }}>
              <div className="text-sm font-semibold mb-4 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-glow" />
                {g.title}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {g.items.map((item) => (
                  <span key={item}
                    className="text-xs font-mono px-2.5 py-1.5 rounded-lg bg-secondary border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors">
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

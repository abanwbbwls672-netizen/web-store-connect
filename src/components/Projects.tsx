import { ArrowUpRight } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";
import { useSiteContent } from "@/hooks/useSiteContent";

const fallbackProjects = [
  { title: "Nimbus CRM", description: "Customer pipeline with realtime collaboration, role-based access, and Stripe billing.", tech_stack: ["React", "Postgres", "Edge Functions"], link_url: null, image_url: null, id: "1" },
  { title: "Cartwave Storefront", description: "Headless storefront with sub-second navigation and an admin for inventory & orders.", tech_stack: ["Next-style SPA", "Stripe", "PostgreSQL"], link_url: null, image_url: null, id: "2" },
  { title: "Pulse Analytics", description: "Realtime product analytics with custom funnels, cohorts, and AI-generated summaries.", tech_stack: ["TypeScript", "Recharts", "AI Gateway"], link_url: null, image_url: null, id: "3" },
];

export const Projects = () => {
  const { t } = useI18n();
  const { projects } = useSiteContent();
  const list = projects.length > 0 ? projects : fallbackProjects;

  return (
    <section id="projects" className="py-24 sm:py-32 relative">
      <div className="container">
        <div className="flex items-end justify-between flex-wrap gap-6 mb-12">
          <div className="animate-fade-up">
            <div className="text-xs font-mono uppercase tracking-[0.2em] text-primary mb-4">{t("projects.tag")}</div>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight">
              {t("projects.title.1")} <span className="text-gradient">{t("projects.title.shipped")}</span>.
            </h2>
          </div>
          <p className="max-w-md text-muted-foreground">{t("projects.desc")}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {list.map((p, i) => {
            const Wrapper: any = p.link_url ? "a" : "article";
            const props = p.link_url ? { href: p.link_url, target: "_blank", rel: "noreferrer" } : {};
            return (
              <Wrapper
                key={p.id}
                {...props}
                className="group relative bg-gradient-card border border-border rounded-2xl p-6 overflow-hidden hover:border-primary/40 transition-all duration-300 hover:-translate-y-1 animate-fade-up block"
                style={{ animationDelay: `${0.05 * (i + 1)}s` }}
              >
                <div className="absolute -top-20 -right-20 h-48 w-48 rounded-full bg-gradient-to-br from-primary/30 to-accent/10 blur-3xl opacity-60 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  {p.image_url && (
                    <img src={p.image_url} alt={p.title} className="mb-4 w-full h-40 object-cover rounded-lg" loading="lazy" />
                  )}
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-xl font-semibold">{p.title}</h3>
                    <div className="h-9 w-9 rounded-lg border border-border grid place-items-center group-hover:border-primary/60 group-hover:bg-primary/10 transition-colors">
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                    </div>
                  </div>
                  {p.description && <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{p.description}</p>}
                  {p.tech_stack && p.tech_stack.length > 0 && (
                    <div className="mt-5 flex flex-wrap gap-1.5">
                      {p.tech_stack.map((tag) => (
                        <span key={tag} className="text-[11px] font-mono px-2 py-1 rounded-md bg-secondary text-muted-foreground border border-border">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Wrapper>
            );
          })}
        </div>
      </div>
    </section>
  );
};

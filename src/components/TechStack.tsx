import { useI18n } from "@/hooks/useI18n";

const stack = [
  "React", "TypeScript", "Next.js", "Vite", "Tailwind CSS", "Node.js",
  "Postgres", "Supabase", "Stripe", "Vercel", "Framer Motion", "OpenAI",
];

export const TechStack = () => {
  const { t } = useI18n();
  // Duplicate for seamless marquee
  const items = [...stack, ...stack];

  return (
    <section className="py-20 sm:py-24 relative border-y border-border/60 bg-card/30">
      <div className="container">
        <div className="max-w-2xl mx-auto text-center mb-10 animate-fade-up">
          <div className="text-xs font-mono text-primary mb-3">{t("stack.tag")}</div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
            {t("stack.title.1")} <span className="text-gradient">{t("stack.title.modern")}</span> {t("stack.title.2")}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground">{t("stack.desc")}</p>
        </div>

        <div
          className="relative overflow-hidden"
          style={{
            maskImage: "linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)",
            WebkitMaskImage: "linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)",
          }}
        >
          <div className="marquee w-max">
            {items.map((s, i) => (
              <div
                key={s + i}
                className="px-5 py-3 rounded-xl glass text-sm font-medium text-foreground/90 whitespace-nowrap"
              >
                {s}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

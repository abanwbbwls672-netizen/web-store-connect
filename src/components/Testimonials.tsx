import { Quote, Star } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";

const data = [
  {
    name: "Sarah Mansour",
    role: "Founder, Lumen Labs",
    quote:
      "Web Store delivered our MVP in 5 weeks. The codebase is clean, documented and our internal team picked it up effortlessly.",
  },
  {
    name: "David Chen",
    role: "CTO, Stackly",
    quote:
      "Senior-level engineering, thoughtful UX decisions, and zero hand-holding required. The only dev studio we'll recommend.",
  },
  {
    name: "Aisha Rahman",
    role: "Product Lead, Northwind",
    quote:
      "From auth to billing to analytics — every detail was production-grade on day one. Our investors noticed immediately.",
  },
];

export const Testimonials = () => {
  const { t } = useI18n();
  return (
    <section id="testimonials" className="py-24 sm:py-28 relative">
      <div className="container">
        <div className="max-w-2xl mx-auto text-center mb-14 animate-fade-up">
          <div className="text-xs font-mono text-primary mb-3">{t("testi.tag")}</div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            {t("testi.title.1")} <span className="text-gradient">{t("testi.title.founders")}</span> {t("testi.title.2")}
          </h2>
          <p className="mt-4 text-muted-foreground">{t("testi.desc")}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {data.map((q, i) => (
            <figure
              key={q.name}
              className="glass rounded-2xl p-6 sm:p-7 flex flex-col hover-lift animate-fade-up"
              style={{ animationDelay: `${0.08 * (i + 1)}s` }}
            >
              <Quote className="h-6 w-6 text-primary/60 mb-4" />
              <blockquote className="text-foreground/90 text-[15px] leading-relaxed flex-1">
                "{q.quote}"
              </blockquote>
              <figcaption className="mt-6 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-sm">{q.name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{q.role}</div>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="h-3.5 w-3.5 fill-primary text-primary" />
                  ))}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};

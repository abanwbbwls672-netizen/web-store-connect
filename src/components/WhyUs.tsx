import { Award, Rocket, ShieldCheck, Heart, BadgeDollarSign, Layers } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";

export const WhyUs = () => {
  const { t } = useI18n();
  const items = [
    { icon: Award, t: t("why.f.1.t"), d: t("why.f.1.d") },
    { icon: Rocket, t: t("why.f.2.t"), d: t("why.f.2.d") },
    { icon: ShieldCheck, t: t("why.f.3.t"), d: t("why.f.3.d") },
    { icon: Heart, t: t("why.f.4.t"), d: t("why.f.4.d") },
    { icon: BadgeDollarSign, t: t("why.f.5.t"), d: t("why.f.5.d") },
    { icon: Layers, t: t("why.f.6.t"), d: t("why.f.6.d") },
  ];

  return (
    <section id="why-us" className="py-24 sm:py-28 relative">
      <div className="container">
        <div className="max-w-2xl mx-auto text-center mb-14 animate-fade-up">
          <div className="text-xs font-mono text-primary mb-3">{t("why.tag")}</div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            {t("why.title.1")} <span className="text-gradient">{t("why.title.choose")}</span> {t("why.title.2")}
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">{t("why.desc")}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {items.map((it, i) => (
            <div
              key={it.t}
              className="glass rounded-2xl p-6 hover-lift animate-fade-up"
              style={{ animationDelay: `${0.05 * (i + 1)}s` }}
            >
              <div className="h-11 w-11 rounded-xl bg-primary/10 border border-primary/20 grid place-items-center mb-4">
                <it.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold text-lg leading-tight">{it.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{it.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

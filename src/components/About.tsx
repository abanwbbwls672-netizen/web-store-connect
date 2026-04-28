import { Cpu, Layers, Rocket, ShieldCheck } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";

export const About = () => {
  const { t } = useI18n();
  const features = [
    { icon: Rocket, title: t("about.f.fast.t"), desc: t("about.f.fast.d") },
    { icon: Layers, title: t("about.f.scale.t"), desc: t("about.f.scale.d") },
    { icon: ShieldCheck, title: t("about.f.secure.t"), desc: t("about.f.secure.d") },
    { icon: Cpu, title: t("about.f.modern.t"), desc: t("about.f.modern.d") },
  ];
  return (
    <section id="about" className="py-24 sm:py-32 relative">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          <div className="animate-fade-up">
            <div className="text-xs font-mono uppercase tracking-[0.2em] text-primary mb-4">{t("about.tag")}</div>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight">
              {t("about.title.1")} <br />
              {t("about.title.2")} <span className="text-gradient">{t("about.title.serious")}</span>.
            </h2>
            <p className="mt-6 text-muted-foreground leading-relaxed">{t("about.p1")}</p>
            <p className="mt-4 text-muted-foreground leading-relaxed">{t("about.p2")}</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {features.map((f, i) => (
              <div key={f.title}
                className="bg-gradient-card border border-border rounded-2xl p-6 hover:border-primary/40 hover:shadow-glow transition-all duration-300 animate-fade-up"
                style={{ animationDelay: `${0.1 * (i + 1)}s` }}>
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

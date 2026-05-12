import { Github, Linkedin, Twitter, Mail, Code2 } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";

export const Footer = () => {
  const { t } = useI18n();

  const socials = [
    { Icon: Github, href: "#", label: "GitHub" },
    { Icon: Linkedin, href: "#", label: "LinkedIn" },
    { Icon: Twitter, href: "#", label: "Twitter" },
    { Icon: Mail, href: "#contact", label: "Email" },
  ];

  const links = [
    {
      title: t("footer.about"),
      items: [
        { label: t("nav.about"), href: "#about" },
        { label: t("nav.skills"), href: "#skills" },
      ],
    },
    {
      title: t("footer.projects"),
      items: [
        { label: t("nav.projects"), href: "#projects" },
        { label: "Testimonials", href: "#testimonials" },
      ],
    },
    {
      title: t("footer.contact"),
      items: [
        { label: t("contact.whatsapp"), href: "#contact" },
        { label: t("contact.email"), href: "#contact" },
      ],
    },
  ];

  return (
    <footer className="border-t border-border/70 mt-16 bg-card/30">
      <div className="container py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <a href="#home" className="inline-flex items-center gap-2.5 group">
              <div className="h-9 w-9 rounded-xl bg-gradient-primary grid place-items-center shadow-glow">
                <Code2 className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="leading-tight">
                <div className="font-bold tracking-tight">Web Store</div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Dev Studio</div>
              </div>
            </a>
            <p className="mt-4 text-sm text-muted-foreground max-w-sm leading-relaxed">
              Building modern, scalable SaaS products with thoughtful UX and clean code.
            </p>
            <div className="mt-5 flex items-center gap-2.5">
              {socials.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="h-10 w-10 grid place-items-center rounded-xl border border-border/70 bg-background/60 text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/5 transition-all"
                >
                  <Icon className="h-4.5 w-4.5" />
                </a>
              ))}
            </div>
          </div>

          {links.map((col) => (
            <div key={col.title}>
              <div className="text-xs font-semibold uppercase tracking-wider text-foreground/80 mb-4">
                {col.title}
              </div>
              <ul className="space-y-2.5">
                {col.items.map((it) => (
                  <li key={it.label}>
                    <a
                      href={it.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {it.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div>© {new Date().getFullYear()} Web Store — {t("footer.rights")}</div>
          <div className="font-mono">webstore.dev</div>
        </div>
      </div>
    </footer>
  );
};

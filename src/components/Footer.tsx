import { useI18n } from "@/hooks/useI18n";

export const Footer = () => {
  const { t } = useI18n();
  return (
    <footer className="border-t border-border py-12 mt-10">
      <div className="container flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-primary grid place-items-center">
            <span className="text-primary-foreground font-bold text-sm">W</span>
          </div>
          <div>
            <div className="font-semibold leading-none">Web Store</div>
            <div className="text-[11px] text-muted-foreground mt-1">© {new Date().getFullYear()} — {t("footer.rights")}</div>
          </div>
        </div>
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <a href="#about" className="hover:text-foreground transition-colors">{t("footer.about")}</a>
          <a href="#projects" className="hover:text-foreground transition-colors">{t("footer.projects")}</a>
          <a href="#contact" className="hover:text-foreground transition-colors">{t("footer.contact")}</a>
        </div>
      </div>
    </footer>
  );
};

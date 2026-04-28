import { Code2 } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t border-border py-12 mt-10">
      <div className="container flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-primary grid place-items-center">
            <Code2 className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <div className="font-semibold leading-none">Web Store</div>
            <div className="text-[11px] text-muted-foreground mt-1">© {new Date().getFullYear()} — All rights reserved.</div>
          </div>
        </div>
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <a href="#about" className="hover:text-foreground transition-colors">About</a>
          <a href="#projects" className="hover:text-foreground transition-colors">Projects</a>
          <a href="#contact" className="hover:text-foreground transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
};

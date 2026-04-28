import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Lang = "en" | "ar";

const dict = {
  en: {
    "nav.home": "Home",
    "nav.about": "About",
    "nav.projects": "Projects",
    "nav.skills": "Skills",
    "nav.contact": "Contact",
    "nav.dashboard": "Dashboard",
    "nav.hire": "Hire Me",

    "hero.badge": "Available for new projects · 2026",
    "hero.title.1": "Building modern",
    "hero.title.2": "web products with",
    "hero.title.precision": "precision",
    "hero.desc": "Hi — I'm the developer behind Web Store. I design and ship fast, scalable SaaS apps, dashboards, and digital products with clean code and thoughtful UX.",
    "hero.cta.view": "View Projects",
    "hero.cta.start": "Start a Project",
    "hero.stats.projects": "Projects shipped",
    "hero.stats.years": "Years experience",
    "hero.stats.clients": "Happy clients",
    "hero.stats.uptime": "Uptime SLA",

    "about.tag": "// about",
    "about.title.1": "A studio of one,",
    "about.title.2": "built for",
    "about.title.serious": "serious products",
    "about.p1": "Web Store is the personal studio of an independent software developer. I partner with founders and teams to design, build, and ship modern web applications — from MVPs to multi-tenant SaaS platforms.",
    "about.p2": "I care deeply about craft: clean architecture, thoughtful UX, accessible interfaces, and code that other developers enjoy reading.",
    "about.f.fast.t": "Fast delivery",
    "about.f.fast.d": "From idea to production-ready in weeks, not months.",
    "about.f.scale.t": "Scalable systems",
    "about.f.scale.d": "Architectures designed to grow with your business.",
    "about.f.secure.t": "Secure by default",
    "about.f.secure.d": "Auth, RLS, and best-practice security baked in.",
    "about.f.modern.t": "Modern stack",
    "about.f.modern.d": "React, TypeScript, Postgres, edge functions, AI.",

    "projects.tag": "// selected work",
    "projects.title.1": "Projects that",
    "projects.title.shipped": "shipped",
    "projects.desc": "A snapshot of recent products — from internal tools to public-facing SaaS platforms used by thousands of users.",

    "skills.tag": "// toolkit",
    "skills.title.1": "The",
    "skills.title.stack": "stack",
    "skills.title.2": "I build with.",
    "skills.desc": "A modern, battle-tested stack focused on developer experience, performance, and long-term maintainability.",
    "skills.frontend": "Frontend",
    "skills.backend": "Backend",
    "skills.database": "Database",
    "skills.devops": "DevOps & Tools",

    "contact.tag": "// contact",
    "contact.title.1": "Let's build something",
    "contact.title.great": "great",
    "contact.desc": "Got a product idea, an MVP to ship, or an existing app to improve? Send a message — I usually reply within a day.",
    "contact.whatsapp": "WhatsApp",
    "contact.email": "Email",
    "contact.location": "Location",
    "contact.location.value": "Remote · Worldwide",
    "contact.f.name": "Name",
    "contact.f.name.ph": "Your name",
    "contact.f.email": "Email",
    "contact.f.email.ph": "you@company.com",
    "contact.f.message": "Project details",
    "contact.f.message.ph": "Tell me about your project, goals, timeline…",
    "contact.f.submit": "Send message",
    "contact.f.sending": "Sending…",
    "contact.f.legal": "By sending you agree to be contacted regarding your inquiry.",
    "contact.success": "Message sent — I'll get back to you within 24 hours.",

    "footer.about": "About",
    "footer.projects": "Projects",
    "footer.contact": "Contact",
    "footer.rights": "All rights reserved.",

    "wa.title": "Web Store",
    "wa.subtitle": "Typically replies in minutes",
    "wa.greet": "👋 Hi! How can I help you today? Send a message and I'll get back to you on WhatsApp.",
    "wa.placeholder": "Type your message…",
    "wa.send": "Send via WhatsApp",
    "wa.powered": "Powered by",
    "wa.default": "Hi! I came from your portfolio and I'd like to discuss a project.",
  },
  ar: {
    "nav.home": "الرئيسية",
    "nav.about": "نبذة",
    "nav.projects": "المشاريع",
    "nav.skills": "المهارات",
    "nav.contact": "تواصل",
    "nav.dashboard": "لوحة التحكم",
    "nav.hire": "وظّفني",

    "hero.badge": "متاح لمشاريع جديدة · 2026",
    "hero.title.1": "نبني منتجات ويب",
    "hero.title.2": "حديثة بكل",
    "hero.title.precision": "إتقان",
    "hero.desc": "مرحبًا — أنا المطور خلف Web Store. أصمم وأطلق تطبيقات SaaS سريعة وقابلة للتوسع ولوحات تحكم ومنتجات رقمية بكود نظيف وتجربة استخدام مدروسة.",
    "hero.cta.view": "عرض المشاريع",
    "hero.cta.start": "ابدأ مشروعًا",
    "hero.stats.projects": "مشروع مكتمل",
    "hero.stats.years": "سنوات خبرة",
    "hero.stats.clients": "عميل سعيد",
    "hero.stats.uptime": "ضمان التشغيل",

    "about.tag": "// نبذة",
    "about.title.1": "استوديو فردي،",
    "about.title.2": "مبني لمنتجات",
    "about.title.serious": "جادّة",
    "about.p1": "Web Store هو استوديو شخصي لمطور برمجيات مستقل. أعمل مع المؤسسين والفرق لتصميم وبناء وإطلاق تطبيقات ويب حديثة — من MVPs إلى منصات SaaS متعددة المستأجرين.",
    "about.p2": "أهتم بالحرفية: معمارية نظيفة، تجربة استخدام مدروسة، واجهات يسهل الوصول إليها، وكود يستمتع المطورون بقراءته.",
    "about.f.fast.t": "تسليم سريع",
    "about.f.fast.d": "من الفكرة إلى الإنتاج خلال أسابيع لا أشهر.",
    "about.f.scale.t": "أنظمة قابلة للتوسع",
    "about.f.scale.d": "معماريات مصممة لتنمو مع عملك.",
    "about.f.secure.t": "آمن افتراضيًا",
    "about.f.secure.d": "مصادقة و RLS وأفضل ممارسات الأمان مدمجة.",
    "about.f.modern.t": "تقنيات حديثة",
    "about.f.modern.d": "React و TypeScript و Postgres وEdge Functions والذكاء الاصطناعي.",

    "projects.tag": "// أعمال مختارة",
    "projects.title.1": "مشاريع تم",
    "projects.title.shipped": "إطلاقها",
    "projects.desc": "لمحة عن منتجات حديثة — من أدوات داخلية إلى منصات SaaS عامة يستخدمها آلاف المستخدمين.",

    "skills.tag": "// الأدوات",
    "skills.title.1": "الـ",
    "skills.title.stack": "تقنيات",
    "skills.title.2": "التي أبني بها.",
    "skills.desc": "حزمة حديثة ومجربة تركز على تجربة المطور والأداء والقابلية للصيانة.",
    "skills.frontend": "الواجهة الأمامية",
    "skills.backend": "الواجهة الخلفية",
    "skills.database": "قاعدة البيانات",
    "skills.devops": "DevOps والأدوات",

    "contact.tag": "// تواصل",
    "contact.title.1": "لنبنِ شيئًا",
    "contact.title.great": "رائعًا",
    "contact.desc": "لديك فكرة منتج أو MVP لإطلاقه أو تطبيق قائم لتطويره؟ أرسل رسالة — عادةً أرد خلال يوم.",
    "contact.whatsapp": "واتساب",
    "contact.email": "البريد الإلكتروني",
    "contact.location": "الموقع",
    "contact.location.value": "عن بُعد · حول العالم",
    "contact.f.name": "الاسم",
    "contact.f.name.ph": "اسمك",
    "contact.f.email": "البريد الإلكتروني",
    "contact.f.email.ph": "you@company.com",
    "contact.f.message": "تفاصيل المشروع",
    "contact.f.message.ph": "أخبرني عن مشروعك وأهدافك والمدة الزمنية…",
    "contact.f.submit": "إرسال الرسالة",
    "contact.f.sending": "جارٍ الإرسال…",
    "contact.f.legal": "بإرسالك توافق على التواصل معك بخصوص طلبك.",
    "contact.success": "تم إرسال الرسالة — سأرد عليك خلال 24 ساعة.",

    "footer.about": "نبذة",
    "footer.projects": "المشاريع",
    "footer.contact": "تواصل",
    "footer.rights": "جميع الحقوق محفوظة.",

    "wa.title": "Web Store",
    "wa.subtitle": "عادةً يرد خلال دقائق",
    "wa.greet": "👋 مرحبًا! كيف يمكنني مساعدتك اليوم؟ أرسل رسالة وسأعود إليك على واتساب.",
    "wa.placeholder": "اكتب رسالتك…",
    "wa.send": "إرسال عبر واتساب",
    "wa.powered": "مدعوم بواسطة",
    "wa.default": "مرحبًا! وصلت من معرض أعمالك وأود مناقشة مشروع.",
  },
} as const;

type Key = keyof typeof dict["en"];

type Ctx = { lang: Lang; t: (k: Key) => string; setLang: (l: Lang) => void; toggle: () => void };
const I18nContext = createContext<Ctx>({ lang: "en", t: (k) => k, setLang: () => {}, toggle: () => {} });

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Lang>(() => (localStorage.getItem("lang") as Lang) || "en");

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    localStorage.setItem("lang", lang);
  }, [lang]);

  const t = (k: Key) => (dict[lang] as Record<string, string>)[k] ?? k;
  const setLang = (l: Lang) => setLangState(l);
  const toggle = () => setLangState((l) => (l === "en" ? "ar" : "en"));

  return <I18nContext.Provider value={{ lang, t, setLang, toggle }}>{children}</I18nContext.Provider>;
};

export const useI18n = () => useContext(I18nContext);

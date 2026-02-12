import { useEffect, useState, useRef } from "react";
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Briefcase,
  GraduationCap,
  Mail,
  MapPin,
  Moon,
  Sun,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Portfolio } from "@/lib/api";

interface LivePreviewPaneProps {
  portfolio: Portfolio;
  onSectionClick?: (section: string) => void;
  highlightedSection?: string | null;
  activeTab?: string;
}

function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const stored = window.localStorage.getItem("theme");
    const preferred =
      stored === "light" || stored === "dark"
        ? stored
        : window.matchMedia?.("(prefers-color-scheme: dark)")?.matches
          ? "dark"
          : "light";

    setTheme(preferred);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    window.localStorage.setItem("theme", theme);
  }, [theme]);

  return {
    theme,
    toggle: () => setTheme((t) => (t === "dark" ? "light" : "dark")),
  };
}

function Anchor({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="focus-ring inline-flex items-center gap-2 rounded-full border bg-card px-3 py-2 text-sm text-foreground/90 shadow-elev-sm transition hover:-translate-y-0.5 hover:shadow-elev"
    >
      {children}
    </a>
  );
}

function SectionHeading({
  eyebrow,
  title,
  id,
}: {
  eyebrow: string;
  title: string;
  id: string;
}) {
  return (
    <div className="mb-6">
      <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-balance font-serif text-2xl font-semibold tracking-[-0.02em] md:text-3xl">
        {title}
      </h2>
    </div>
  );
}

export default function LivePreviewPane({
  portfolio,
  onSectionClick,
  highlightedSection,
  activeTab,
}: LivePreviewPaneProps) {
  const { theme, toggle } = useTheme();
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  // Auto-scroll when activeTab changes
  useEffect(() => {
    if (activeTab && sectionRefs.current[activeTab]) {
      sectionRefs.current[activeTab]?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [activeTab]);

  // Apply dynamic theme colors
  useEffect(() => {
    if (portfolio?.themeColors) {
      const root = document.documentElement;
      if (portfolio.themeColors.primary) {
        root.style.setProperty("--primary", portfolio.themeColors.primary);
      }
      if (portfolio.themeColors.accent) {
        root.style.setProperty("--accent", portfolio.themeColors.accent);
      }
    }
  }, [portfolio?.themeColors]);

  const handleSectionClick = (section: string) => {
    if (onSectionClick) {
      onSectionClick(section);
    }
  };

  return (
    <div className="surface h-full overflow-y-auto">
      <div className="relative">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-28 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-gradient-to-b from-primary/20 to-transparent blur-3xl" />
        </div>

        <div className="relative grain">
          <header className="mx-auto w-full max-w-6xl px-5 pt-5 md:px-8 md:pt-8">
            <nav className="flex items-center justify-between gap-3">
              <div className="focus-ring inline-flex items-center gap-2 rounded-full border bg-card px-3 py-2 shadow-elev-sm">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <BadgeCheck className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="text-sm font-semibold tracking-[-0.01em]">
                  {portfolio.profileName}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  className="rounded-full bg-card/70 backdrop-blur"
                  onClick={toggle}
                >
                  {theme === "dark" ? (
                    <Sun className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Moon className="h-4 w-4" aria-hidden="true" />
                  )}
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </div>
            </nav>
          </header>

          <main className="mx-auto w-full max-w-6xl px-5 pb-20 md:px-8">
            <section
              className={`animate-in pt-10 md:pt-16 cursor-pointer rounded-lg transition-all ${
                activeTab === "profile" ? "ring-2 ring-primary/50 bg-primary/5 p-4" : ""
              }`}
              onClick={() => handleSectionClick("profile")}
              ref={(el) => { sectionRefs.current["profile"] = el; }}
            >
              <div className="mt-8 grid grid-cols-1 items-start gap-12 lg:grid-cols-[1fr_400px] animate-item">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border bg-card/70 px-3 py-2 text-xs text-muted-foreground shadow-elev-sm backdrop-blur animate-item">
                    <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
                    {portfolio.heroStatus}
                  </div>

                  <div className="mt-5 flex items-center gap-3 animate-item">
                    <img
                      src="/favicon.svg"
                      alt="PT"
                      className="h-12 w-12 rounded-lg border-2 transition-colors"
                      style={{ borderColor: 'hsl(var(--primary))' }}
                    />
                    <h1 className="text-balance font-serif text-4xl font-semibold tracking-[-0.03em] md:text-6xl">
                      {portfolio.heroTitle}
                    </h1>
                  </div>

                  <p className="mt-4 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg animate-item">
                    {portfolio.heroSubtitle}
                  </p>

                  <div className="mt-7 flex flex-wrap items-center gap-2 animate-item">
                    <Anchor href={`mailto:${portfolio.profileEmail}`}>
                      <Mail className="h-4 w-4" aria-hidden="true" />
                      {portfolio.profileEmail}
                    </Anchor>
                    <div className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-2 text-sm text-foreground/90 shadow-elev-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                      {portfolio.profileLocation}
                    </div>
                    <a
                      href="#experience"
                      className="focus-ring inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-elev-sm transition hover:-translate-y-0.5 hover:shadow-elev"
                    >
                      View experience
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </a>
                  </div>
                </div>

                <div className="relative mx-auto w-full max-w-sm lg:mx-0 lg:max-w-none animate-item">
                  <div className="aspect-[4/5] overflow-hidden rounded-[2rem] border bg-muted shadow-elev">
                    {portfolio.profileImageUrl ? (
                      <img
                        src={portfolio.profileImageUrl}
                        alt={portfolio.profileName}
                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-muted">
                        <BadgeCheck className="h-16 w-16 text-muted-foreground/50" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3 animate-item">
                <Card className="shadow-elev-sm border bg-card/70 p-5 backdrop-blur">
                  <div className="flex items-start gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Briefcase className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold">Accounting internships</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Practical support across reporting, records, and reconciliations.
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="shadow-elev-sm border bg-card/70 p-5 backdrop-blur">
                  <div className="flex items-start gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <GraduationCap className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold">Economics @ NYU</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Quantitative thinking with a disciplined, structured approach.
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="shadow-elev-sm border bg-card/70 p-5 backdrop-blur">
                  <div className="flex items-start gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <BookOpen className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold">Clear communication</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Structured updates, polished writing, and calm execution.
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </section>

            <section
              id="experience"
              className={`pt-16 md:pt-20 cursor-pointer rounded-lg transition-all ${
                activeTab === "experience" ? "ring-2 ring-primary/50 bg-primary/5 p-4" : ""
              }`}
              onClick={() => handleSectionClick("experience")}
              ref={(el) => { sectionRefs.current["experience"] = el; }}
            >
              <SectionHeading eyebrow="Experience" title="Internships & roles" id="experience" />

              <div className="grid grid-cols-1 gap-4">
                {portfolio.experiences.map((exp, idx) => (
                  <Card
                    key={exp.id}
                    className="shadow-elev-sm border bg-card/70 p-5 backdrop-blur transition hover:-translate-y-0.5 hover:shadow-elev"
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <p className="text-base font-semibold">
                          {exp.role}
                          <span className="text-muted-foreground"> • </span>
                          <span className="text-foreground/85">{exp.company}</span>
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {exp.type} • {exp.location}
                        </p>
                      </div>
                      <div className="inline-flex items-center gap-2 rounded-full border bg-background/40 px-3 py-1.5 text-xs text-muted-foreground">
                        {exp.startDate} — {exp.endDate}
                      </div>
                    </div>

                    <Separator className="my-4" />

                    <ul className="space-y-2 text-sm text-foreground/85">
                      {exp.bullets.map((b, bIdx) => (
                        <li key={bIdx} className="flex gap-2">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" aria-hidden="true" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                ))}
              </div>
            </section>

            <section
              id="education"
              className={`pt-16 md:pt-20 cursor-pointer rounded-lg transition-all ${
                activeTab === "education" ? "ring-2 ring-primary/50 bg-primary/5 p-4" : ""
              }`}
              onClick={() => handleSectionClick("education")}
              ref={(el) => { sectionRefs.current["education"] = el; }}
            >
              <SectionHeading eyebrow="Education" title="Where I study" id="education" />

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {portfolio.education.map((ed, idx) => (
                  <Card
                    key={ed.id}
                    className="shadow-elev-sm border bg-card/70 p-5 backdrop-blur"
                  >
                    <p className="text-sm font-semibold">{ed.school}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{ed.degree}</p>
                    <p className="mt-3 text-xs text-muted-foreground">{ed.dates}</p>
                    {ed.details ? (
                      <p className="mt-3 text-sm text-foreground/80">{ed.details}</p>
                    ) : null}
                  </Card>
                ))}
              </div>
            </section>

            <section
              id="skills"
              className={`pt-16 md:pt-20 cursor-pointer rounded-lg transition-all ${
                activeTab === "skills" ? "ring-2 ring-primary/50 bg-primary/5 p-4" : ""
              }`}
              onClick={() => handleSectionClick("skills")}
              ref={(el) => { sectionRefs.current["skills"] = el; }}
            >
              <SectionHeading eyebrow="Skills" title="Strengths I bring" id="skills" />

              <Card className="shadow-elev-sm border bg-card/70 p-5 backdrop-blur">
                <div className="flex flex-wrap gap-2">
                  {portfolio.skills.map((s) => (
                    <Badge
                      key={s.id}
                      variant="secondary"
                      className="rounded-full border border-border/70 bg-background/60 px-3 py-1.5 text-sm text-foreground/85"
                    >
                      {s.name}
                    </Badge>
                  ))}
                </div>
              </Card>
            </section>

            <section className="pt-16 md:pt-20">
              <Card className="relative overflow-hidden border bg-card/70 p-6 shadow-elev backdrop-blur">
                <div className="pointer-events-none absolute inset-0">
                  <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-primary/15 blur-3xl" />
                </div>

                <div className="relative flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-serif text-2xl font-semibold tracking-[-0.02em]">
                      Let's connect.
                    </p>
                    <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                      If you're hiring for entry-level accounting roles or internships, I'd
                      love to share more context and learn about your team.
                    </p>
                  </div>

                  <a
                    href={`mailto:${portfolio.profileEmail}`}
                    className="focus-ring inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-elev-sm transition hover:-translate-y-0.5 hover:shadow-elev"
                  >
                    Email me
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                </div>
              </Card>
            </section>

            <footer className="pt-14">
              <div className="flex flex-col items-start justify-between gap-4 border-t py-8 md:flex-row md:items-center">
                <p className="text-sm text-muted-foreground">
                  © {new Date().getFullYear()} {portfolio.profileName} • Built with care
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <Anchor href={`mailto:${portfolio.profileEmail}`}>
                    <Mail className="h-4 w-4" aria-hidden="true" />
                    Email
                  </Anchor>
                  <span className="text-xs text-muted-foreground">
                    Live Preview (Draft)
                  </span>
                </div>
              </div>
            </footer>
          </main>
        </div>
      </div>
    </div>
  );
}

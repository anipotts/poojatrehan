import { useEffect, useState, useRef } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Download,
  Mail,
  MapPin,
  Moon,
  Sun,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExperienceCard } from "@/components/ExperienceCard";
import { EducationCard } from "@/components/EducationCard";
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
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to top on mount
  useEffect(() => {
    scrollContainerRef.current?.scrollTo(0, 0);
  }, []);

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
    <div ref={scrollContainerRef} className="surface h-full overflow-y-auto">
      <div className="relative">
        <div className="relative">
          <header className="mx-auto w-full max-w-6xl px-5 pt-5 pb-2 md:px-8 md:pt-8 md:pb-3">
            <nav className="flex items-center justify-between gap-3">
              <a
                href="#top"
                className="focus-ring inline-flex items-center gap-2 rounded-full border bg-card px-3 py-2 shadow-elev-sm"
              >
                <img
                  src="/favicon.svg"
                  alt="PT"
                  className="h-8 w-8 rounded-lg"
                  aria-hidden="true"
                />
                <span className="text-sm font-semibold tracking-[-0.01em]">
                  {portfolio.profileName}
                </span>
              </a>

              <div className="flex items-center gap-2">
                {portfolio.sectionVisibility?.experience !== false && (
                <button
                  onClick={() => {
                    sectionRefs.current["experience"]?.scrollIntoView({ behavior: "smooth", block: "start" });
                    onSectionClick?.("experience");
                  }}
                  className="hidden rounded-full px-3 py-2 text-sm text-muted-foreground transition hover:text-foreground md:inline-flex"
                >
                  Experience
                </button>
                )}
                {portfolio.sectionVisibility?.education !== false && (
                <button
                  onClick={() => {
                    sectionRefs.current["education"]?.scrollIntoView({ behavior: "smooth", block: "start" });
                    onSectionClick?.("education");
                  }}
                  className="hidden rounded-full px-3 py-2 text-sm text-muted-foreground transition hover:text-foreground md:inline-flex"
                >
                  Education
                </button>
                )}
                {portfolio.sectionVisibility?.skills !== false && (
                <button
                  onClick={() => {
                    sectionRefs.current["skills"]?.scrollIntoView({ behavior: "smooth", block: "start" });
                    onSectionClick?.("skills");
                  }}
                  className="hidden rounded-full px-3 py-2 text-sm text-muted-foreground transition hover:text-foreground md:inline-flex"
                >
                  Skills
                </button>
                )}
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

          <main id="top" className="mx-auto w-full max-w-6xl px-5 pb-20 md:px-8">
            <section
              className="animate-in pt-10 md:pt-16"
              onClick={() => handleSectionClick("profile")}
              ref={(el) => { sectionRefs.current["profile"] = el; }}
            >
              <div className="mt-8 flex flex-col gap-6 lg:grid lg:grid-cols-[1fr_400px] lg:items-start lg:gap-12">
                <div className="order-1 lg:order-none flex flex-col">
                  <h1 className="animate-item mt-8 text-balance font-serif text-4xl font-semibold tracking-[-0.03em] md:text-6xl">
                    {portfolio.heroTitle}
                  </h1>

                  <p className="animate-item mt-4 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
                    {portfolio.heroSubtitle}
                  </p>
                </div>

                <div className="order-3 lg:order-none animate-item relative mx-auto w-full max-w-sm lg:mx-0 lg:max-w-none lg:row-span-2">
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

                <div className="order-2 lg:order-none animate-item mt-0 lg:mt-7 flex flex-wrap items-center gap-2">
                  <a
                    href={`mailto:${portfolio.profileEmail}`}
                    className="focus-ring hidden md:inline-flex items-center gap-2 rounded-full border bg-card px-3 py-2 text-sm text-foreground/90 shadow-elev-sm transition hover:-translate-y-0.5 hover:shadow-elev"
                  >
                    <Mail className="h-4 w-4" aria-hidden="true" />
                    {portfolio.profileEmail}
                  </a>
                  <a
                    href="#experience"
                    className="focus-ring inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-elev-sm transition hover:-translate-y-0.5 hover:shadow-elev"
                  >
                    View experience
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                  {portfolio.resumeUrl && (
                    <a
                      href={portfolio.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="focus-ring inline-flex items-center gap-2 rounded-full border bg-card px-3 py-2 text-sm text-foreground/90 shadow-elev-sm transition hover:-translate-y-0.5 hover:shadow-elev"
                    >
                      <Download className="h-4 w-4" aria-hidden="true" />
                      Resume
                    </a>
                  )}
                  <div className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-2 text-sm text-foreground/90 shadow-elev-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    {portfolio.profileLocation}
                  </div>
                </div>
              </div>

            </section>

            {portfolio.sectionVisibility?.experience !== false && (
            <section
              id="experience"
              className="pt-16 md:pt-20"
              onClick={() => handleSectionClick("experience")}
              ref={(el) => { sectionRefs.current["experience"] = el; }}
            >
              <SectionHeading eyebrow="Experience" title="Internships & roles" id="experience" />

              <div className="grid grid-cols-1 gap-4">
                {portfolio.experiences.map((exp, idx) => (
                  <ExperienceCard key={exp.id} experience={exp} index={idx} />
                ))}
              </div>
            </section>
            )}

            {portfolio.sectionVisibility?.education !== false && (
            <section
              id="education"
              className="pt-16 md:pt-20"
              onClick={() => handleSectionClick("education")}
              ref={(el) => { sectionRefs.current["education"] = el; }}
            >
              <SectionHeading eyebrow="Education" title="Academic Background" id="education" />

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {portfolio.education.map((ed, idx) => (
                  <EducationCard key={ed.id} education={ed} index={idx} />
                ))}
              </div>
            </section>
            )}

            {portfolio.sectionVisibility?.skills !== false && (
            <section
              id="skills"
              className="pt-16 md:pt-20"
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
            )}

            {portfolio.sectionVisibility?.cta !== false && (
            <section className="pt-16 md:pt-20">
              <Card className="relative border bg-card/70 p-6 shadow-elev backdrop-blur">
                <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
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
            )}

            <footer className="pt-14">
              <div className="flex items-center justify-between border-t py-8">
                <p className="text-sm text-muted-foreground">
                  © {new Date().getFullYear()} {portfolio.profileName}
                </p>
                <Anchor href={`mailto:${portfolio.profileEmail}`}>
                  <Mail className="h-4 w-4" aria-hidden="true" />
                  Email
                </Anchor>
              </div>
            </footer>
          </main>
        </div>
      </div>
    </div>
  );
}

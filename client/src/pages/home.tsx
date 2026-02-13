import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import {
  ArrowRight,
  BadgeCheck,
  Download,
  Mail,
  MapPin,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArrows } from "@/components/ScrollArrows";
import { ExperienceCard } from "@/components/ExperienceCard";
import { EducationCard } from "@/components/EducationCard";
import { FadeInSection } from "@/components/FadeInSection";
import { useEasterEgg } from "@/hooks/use-easter-egg";
import { portfolioApi } from "@/lib/api";

function Anchor({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="focus-ring inline-flex items-center gap-2 rounded-full border bg-card px-3 py-2 text-sm text-foreground/90 shadow-elev-sm transition hover:-translate-y-0.5 hover:shadow-elev"
      data-testid={`link-${href.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`}
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
      <p
        className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground"
        data-testid={`text-eyebrow-${id}`}
      >
        {eyebrow}
      </p>
      <h2
        className="mt-2 text-balance font-serif text-2xl font-semibold tracking-[-0.02em] md:text-3xl"
        data-testid={`text-heading-${id}`}
      >
        {title}
      </h2>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="surface min-h-dvh">
      <div className="relative">
        <div className="relative">
          <header className="mx-auto w-full max-w-6xl px-5 pt-5 md:px-8 md:pt-8">
            <nav className="flex items-center justify-between gap-3">
              <Skeleton className="h-12 w-40" />
              <Skeleton className="h-10 w-10 rounded-full" />
            </nav>
          </header>

          <main className="mx-auto w-full max-w-6xl px-5 pb-20 md:px-8">
            <section className="pt-10 md:pt-16">
              <div className="mt-8 grid grid-cols-1 items-start gap-12 lg:grid-cols-[1fr_400px]">
                <div>
                  <Skeleton className="h-8 w-64 mb-5" />
                  <Skeleton className="h-16 w-full mb-4" />
                  <Skeleton className="h-24 w-full" />
                </div>
                <Skeleton className="aspect-[4/5] w-full rounded-[2rem]" />
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [, setLocation] = useLocation();

  // Easter egg: type "zazaqueen" anywhere to navigate to admin
  useEasterEgg("zazaqueen", () => {
    setLocation("/admin");
  });

  // Fetch portfolio data
  const { data: portfolio, isLoading, error } = useQuery({
    queryKey: ["portfolio", "published"],
    queryFn: portfolioApi.getPublished,
    staleTime: 0, // Always fetch fresh data to show admin updates immediately
    refetchOnWindowFocus: true, // Refetch when tab is focused
    refetchInterval: 30000, // Check for updates every 30 seconds
  });

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

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error || !portfolio) {
    return (
      <div className="surface flex min-h-dvh items-center justify-center">
        <Card className="p-6 max-w-md text-center">
          <p className="text-lg font-semibold mb-2">Unable to load portfolio</p>
          <p className="text-sm text-muted-foreground">
            Please try refreshing the page or contact support.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="surface min-h-dvh">
      <div className="relative">
        <div className="relative">
          <header className="mx-auto w-full max-w-6xl px-5 pt-5 md:px-8 md:pt-8">
            <nav className="flex items-center justify-between gap-3">
              <a
                href="#top"
                className="focus-ring inline-flex items-center gap-2 rounded-full border bg-card px-3 py-2 shadow-elev-sm"
                data-testid="link-home"
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
                <a
                  href="#experience"
                  className="hidden rounded-full px-3 py-2 text-sm text-muted-foreground transition hover:text-foreground md:inline-flex"
                  data-testid="link-nav-experience"
                >
                  Experience
                </a>
                )}
                {portfolio.sectionVisibility?.education !== false && (
                <a
                  href="#education"
                  className="hidden rounded-full px-3 py-2 text-sm text-muted-foreground transition hover:text-foreground md:inline-flex"
                  data-testid="link-nav-education"
                >
                  Education
                </a>
                )}
                {portfolio.sectionVisibility?.skills !== false && (
                <a
                  href="#skills"
                  className="hidden rounded-full px-3 py-2 text-sm text-muted-foreground transition hover:text-foreground md:inline-flex"
                  data-testid="link-nav-skills"
                >
                  Skills
                </a>
                )}
              </div>
            </nav>
          </header>

          <main id="top" className="mx-auto w-full max-w-6xl px-5 pb-20 md:px-8">
            <section className="animate-in pt-10 md:pt-16">
              <div className="mt-8 flex flex-col gap-6 lg:grid lg:grid-cols-[1fr_400px] lg:items-start lg:gap-12">
                <div className="order-1 lg:order-none flex flex-col">
                  <h1
                    className="animate-item mt-8 text-balance font-serif text-4xl font-semibold tracking-[-0.03em] md:text-6xl"
                    data-testid="text-hero-title"
                  >
                    {portfolio.heroTitle}
                  </h1>

                  <p
                    className="animate-item mt-4 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg"
                    data-testid="text-hero-subtitle"
                  >
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
                    data-testid={`link-mailto-${portfolio.profileEmail.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`}
                  >
                    <Mail className="h-4 w-4" aria-hidden="true" />
                    {portfolio.profileEmail}
                  </a>
                  <a
                    href="#experience"
                    className="focus-ring inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-elev-sm transition hover:-translate-y-0.5 hover:shadow-elev"
                    data-testid="button-view-experience"
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
                      data-testid="button-download-resume"
                    >
                      <Download className="h-4 w-4" aria-hidden="true" />
                      Resume
                    </a>
                  )}
                  <div
                    className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-2 text-sm text-foreground/90 shadow-elev-sm"
                    data-testid="text-location"
                  >
                    <MapPin
                      className="h-4 w-4 text-muted-foreground"
                      aria-hidden="true"
                    />
                    {portfolio.profileLocation}
                  </div>
                </div>
              </div>

            </section>

            {portfolio.sectionVisibility?.experience !== false && (
            <FadeInSection>
            <section id="experience" className="pt-16 md:pt-20">
              <SectionHeading eyebrow="Experience" title="Internships & roles" id="experience" />

              <div className="grid grid-cols-1 gap-4">
                {portfolio.experiences.map((exp, idx) => (
                  <ExperienceCard key={exp.id} experience={exp} index={idx} />
                ))}
              </div>
            </section>
            </FadeInSection>
            )}

            {portfolio.sectionVisibility?.education !== false && (
            <FadeInSection>
            <section id="education" className="pt-16 md:pt-20">
              <SectionHeading eyebrow="Education" title="Academic Background" id="education" />

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {portfolio.education.map((ed, idx) => (
                  <EducationCard key={ed.id} education={ed} index={idx} />
                ))}
              </div>
            </section>
            </FadeInSection>
            )}

            {portfolio.sectionVisibility?.skills !== false && (
            <FadeInSection>
            <section id="skills" className="pt-16 md:pt-20">
              <SectionHeading eyebrow="Skills" title="Strengths I bring" id="skills" />

              <Card
                className="shadow-elev-sm border bg-card/70 p-5 backdrop-blur"
                data-testid="card-skills"
              >
                <div className="flex flex-wrap gap-2">
                  {portfolio.skills.map((s) => (
                    <Badge
                      key={s.id}
                      variant="secondary"
                      className="rounded-full border border-border/70 bg-background/60 px-3 py-1.5 text-sm text-foreground/85"
                      data-testid={`badge-skill-${s.name
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, "-")}`}
                    >
                      {s.name}
                    </Badge>
                  ))}
                </div>
              </Card>
            </section>
            </FadeInSection>
            )}

            {portfolio.sectionVisibility?.cta !== false && (
            <FadeInSection>
            <section className="pt-16 md:pt-20">
              <Card
                className="relative border bg-card/70 p-6 shadow-elev backdrop-blur"
                data-testid="card-cta"
              >
                <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p
                      className="font-serif text-2xl font-semibold tracking-[-0.02em]"
                      data-testid="text-cta-title"
                    >
                      Let's connect.
                    </p>
                    <p
                      className="mt-2 max-w-xl text-sm text-muted-foreground"
                      data-testid="text-cta-desc"
                    >
                      If you're hiring for entry-level accounting roles or internships, I'd
                      love to share more context and learn about your team.
                    </p>
                  </div>

                  <a
                    href={`mailto:${portfolio.profileEmail}`}
                    className="focus-ring inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-elev-sm transition hover:-translate-y-0.5 hover:shadow-elev"
                    data-testid="button-email"
                  >
                    Email me
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                </div>
              </Card>
            </section>
            </FadeInSection>
            )}

            <footer className="pt-14">
              <div className="flex items-center justify-between border-t py-8">
                <p className="text-sm text-muted-foreground" data-testid="text-footer">
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
      <ScrollArrows />
    </div>
  );
}

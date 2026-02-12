import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Briefcase,
  Download,
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

import headshot from "@assets/D7C54CF4-2162-4EF9-AB69-EDCBD55776BE_1770858143120.PNG";

type Experience = {
  company: string;
  role: string;
  type: string;
  location: string;
  start: string;
  end: string;
  bullets: string[];
};

type Education = {
  school: string;
  degree: string;
  dates: string;
  details?: string;
};

type Skill = {
  name: string;
};

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

export default function Home() {
  const reduceMotion = useReducedMotion();
  const { theme, toggle } = useTheme();

  const experiences: Experience[] = useMemo(
    () => [
      {
        company: "Accounting Solutions of NY",
        role: "Accounting Intern",
        type: "Internship",
        location: "New York, NY (On-site)",
        start: "May 2025",
        end: "Aug 2025",
        bullets: [
          "Supported month-end tasks and reconciliations with a strong focus on accuracy.",
          "Assisted with documentation and organized financial records for quick review.",
        ],
      },
      {
        company: "Astatine Investment Partners",
        role: "Finance Intern",
        type: "Internship",
        location: "Connecticut (On-site)",
        start: "May 2024",
        end: "Aug 2024",
        bullets: [
          "Built cash flow and DCF analysis to support investment research and discussions.",
          "Synthesized findings into clear, decision-ready summaries.",
        ],
      },
      {
        company: "Brave",
        role: "Marketing Representative",
        type: "Part-time",
        location: "New York, NY",
        start: "Jan 2024",
        end: "May 2024",
        bullets: [
          "Strengthened communication through outreach and event-style engagement.",
          "Practiced project planning and consistent follow-through.",
        ],
      },
      {
        company: "KK MEHTA LTD",
        role: "Accounting Intern",
        type: "Full-time",
        location: "New York, NY (On-site)",
        start: "May 2023",
        end: "Aug 2023",
        bullets: [
          "Supported financial reporting workflows and maintained organized records.",
          "Assisted with asset tracking and basic reporting tasks.",
        ],
      },
    ],
    [],
  );

  const education: Education[] = useMemo(
    () => [
      {
        school: "New York University",
        degree: "B.A. in Economics",
        dates: "Sep 2022 — May 2026",
      },
      {
        school: "Jericho Senior High School",
        degree: "High School Diploma",
        dates: "Sep 2019 — Jun 2022",
        details: "Activities: Debate, Model UN, Swim",
      },
    ],
    [],
  );

  const skills: Skill[] = useMemo(
    () => [
      { name: "Financial Reporting" },
      { name: "Analytical Skills" },
      { name: "DCF & Cash Flow Modeling" },
      { name: "Reconciliation Support" },
      { name: "Documentation" },
      { name: "Public Speaking" },
      { name: "Project Planning" },
    ],
    [],
  );

  const container = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 12 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.55,
        ease: "easeOut",
        staggerChildren: 0.08,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 10 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="surface min-h-dvh">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-28 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-gradient-to-b from-primary/20 to-transparent blur-3xl" />
        </div>

        <div className="relative grain">
          <header className="mx-auto w-full max-w-6xl px-5 pt-5 md:px-8 md:pt-8">
            <nav className="flex items-center justify-between gap-3">
              <a
                href="#top"
                className="focus-ring inline-flex items-center gap-2 rounded-full border bg-card px-3 py-2 shadow-elev-sm"
                data-testid="link-home"
              >
                <span
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary"
                  data-testid="badge-mark"
                >
                  <BadgeCheck className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="text-sm font-semibold tracking-[-0.01em]">
                  Pooja Trehan
                </span>
              </a>

              <div className="flex items-center gap-2">
                <a
                  href="#experience"
                  className="hidden rounded-full px-3 py-2 text-sm text-muted-foreground transition hover:text-foreground md:inline-flex"
                  data-testid="link-nav-experience"
                >
                  Experience
                </a>
                <a
                  href="#education"
                  className="hidden rounded-full px-3 py-2 text-sm text-muted-foreground transition hover:text-foreground md:inline-flex"
                  data-testid="link-nav-education"
                >
                  Education
                </a>
                <a
                  href="#skills"
                  className="hidden rounded-full px-3 py-2 text-sm text-muted-foreground transition hover:text-foreground md:inline-flex"
                  data-testid="link-nav-skills"
                >
                  Skills
                </a>

                <Button
                  variant="outline"
                  className="rounded-full bg-card/70 backdrop-blur"
                  onClick={toggle}
                  data-testid="button-toggle-theme"
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
            <motion.section
              className="pt-10 md:pt-16"
              variants={container}
              initial="hidden"
              animate="show"
            >
              <motion.div
                variants={item}
                className="mt-8 grid grid-cols-1 items-start gap-12 lg:grid-cols-[1fr_400px]"
              >
                <div>
                  <motion.div
                    variants={item}
                    className="inline-flex items-center gap-2 rounded-full border bg-card/70 px-3 py-2 text-xs text-muted-foreground shadow-elev-sm backdrop-blur"
                    data-testid="badge-status"
                  >
                    <span
                      className="inline-flex h-2 w-2 rounded-full bg-emerald-500"
                      aria-hidden="true"
                    />
                    Senior Economics student at NYU • Pursuing accounting roles
                  </motion.div>

                  <motion.h1
                    variants={item}
                    className="mt-5 text-balance font-serif text-4xl font-semibold tracking-[-0.03em] md:text-6xl"
                    data-testid="text-hero-title"
                  >
                    A precise, modern portfolio — built for trust.
                  </motion.h1>

                  <motion.p
                    variants={item}
                    className="mt-4 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg"
                    data-testid="text-hero-subtitle"
                  >
                    I’m Pooja Trehan (she/her), a senior Economics student at New York
                    University. I’m focused on transitioning into the accounting industry
                    through hands-on internship experience, clear communication, and
                    detail-first work.
                  </motion.p>

                  <motion.div variants={item} className="mt-7 flex flex-wrap items-center gap-2">
                    <Anchor href="mailto:pt2293@nyu.edu">
                      <Mail className="h-4 w-4" aria-hidden="true" />
                      pt2293@nyu.edu
                    </Anchor>
                    <div
                      className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-2 text-sm text-foreground/90 shadow-elev-sm"
                      data-testid="text-location"
                    >
                      <MapPin
                        className="h-4 w-4 text-muted-foreground"
                        aria-hidden="true"
                      />
                      New York, NY
                    </div>
                    <a
                      href="#experience"
                      className="focus-ring inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-elev-sm transition hover:-translate-y-0.5 hover:shadow-elev"
                      data-testid="button-view-experience"
                    >
                      View experience
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </a>
                  </motion.div>
                </div>

                <motion.div
                  variants={item}
                  className="relative mx-auto w-full max-w-sm lg:mx-0 lg:max-w-none"
                >
                  <div className="aspect-[4/5] overflow-hidden rounded-[2rem] border bg-muted shadow-elev">
                    <img
                      src={headshot}
                      alt="Pooja Trehan"
                      className="h-full w-full object-cover grayscale transition duration-700 hover:grayscale-0"
                    />
                  </div>
                </motion.div>
              </motion.div>

              <motion.div
                variants={item}
                className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3"
              >
                <Card
                  className="shadow-elev-sm border bg-card/70 p-5 backdrop-blur"
                  data-testid="card-highlights-1"
                >
                  <div className="flex items-start gap-3">
                    <span
                      className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"
                      data-testid="icon-highlight-1"
                    >
                      <Briefcase className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold" data-testid="text-highlight-title-1">
                        Accounting internships
                      </p>
                      <p
                        className="mt-1 text-sm text-muted-foreground"
                        data-testid="text-highlight-desc-1"
                      >
                        Practical support across reporting, records, and reconciliations.
                      </p>
                    </div>
                  </div>
                </Card>

                <Card
                  className="shadow-elev-sm border bg-card/70 p-5 backdrop-blur"
                  data-testid="card-highlights-2"
                >
                  <div className="flex items-start gap-3">
                    <span
                      className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"
                      data-testid="icon-highlight-2"
                    >
                      <GraduationCap className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold" data-testid="text-highlight-title-2">
                        Economics @ NYU
                      </p>
                      <p
                        className="mt-1 text-sm text-muted-foreground"
                        data-testid="text-highlight-desc-2"
                      >
                        Quantitative thinking with a disciplined, structured approach.
                      </p>
                    </div>
                  </div>
                </Card>

                <Card
                  className="shadow-elev-sm border bg-card/70 p-5 backdrop-blur"
                  data-testid="card-highlights-3"
                >
                  <div className="flex items-start gap-3">
                    <span
                      className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"
                      data-testid="icon-highlight-3"
                    >
                      <BookOpen className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold" data-testid="text-highlight-title-3">
                        Clear communication
                      </p>
                      <p
                        className="mt-1 text-sm text-muted-foreground"
                        data-testid="text-highlight-desc-3"
                      >
                        Structured updates, polished writing, and calm execution.
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </motion.section>

            <section id="experience" className="pt-16 md:pt-20">
              <SectionHeading eyebrow="Experience" title="Internships & roles" id="experience" />

              <div className="grid grid-cols-1 gap-4">
                {experiences.map((exp, idx) => (
                  <Card
                    key={`${exp.company}-${idx}`}
                    className="shadow-elev-sm border bg-card/70 p-5 backdrop-blur transition hover:-translate-y-0.5 hover:shadow-elev"
                    data-testid={`card-experience-${idx}`}
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <p className="text-base font-semibold" data-testid={`text-exp-role-${idx}`}>
                          {exp.role}
                          <span className="text-muted-foreground"> • </span>
                          <span className="text-foreground/85">{exp.company}</span>
                        </p>
                        <p
                          className="mt-1 text-sm text-muted-foreground"
                          data-testid={`text-exp-meta-${idx}`}
                        >
                          {exp.type} • {exp.location}
                        </p>
                      </div>
                      <div
                        className="inline-flex items-center gap-2 rounded-full border bg-background/40 px-3 py-1.5 text-xs text-muted-foreground"
                        data-testid={`text-exp-dates-${idx}`}
                      >
                        {exp.start} — {exp.end}
                      </div>
                    </div>

                    <Separator className="my-4" />

                    <ul className="space-y-2 text-sm text-foreground/85">
                      {exp.bullets.map((b, bIdx) => (
                        <li
                          key={bIdx}
                          className="flex gap-2"
                          data-testid={`text-exp-bullet-${idx}-${bIdx}`}
                        >
                          <span
                            className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60"
                            aria-hidden="true"
                          />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                ))}
              </div>
            </section>

            <section id="education" className="pt-16 md:pt-20">
              <SectionHeading eyebrow="Education" title="Where I study" id="education" />

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {education.map((ed, idx) => (
                  <Card
                    key={`${ed.school}-${idx}`}
                    className="shadow-elev-sm border bg-card/70 p-5 backdrop-blur"
                    data-testid={`card-education-${idx}`}
                  >
                    <p className="text-sm font-semibold" data-testid={`text-edu-school-${idx}`}>
                      {ed.school}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground" data-testid={`text-edu-degree-${idx}`}>
                      {ed.degree}
                    </p>
                    <p className="mt-3 text-xs text-muted-foreground" data-testid={`text-edu-dates-${idx}`}>
                      {ed.dates}
                    </p>
                    {ed.details ? (
                      <p
                        className="mt-3 text-sm text-foreground/80"
                        data-testid={`text-edu-details-${idx}`}
                      >
                        {ed.details}
                      </p>
                    ) : null}
                  </Card>
                ))}
              </div>
            </section>

            <section id="skills" className="pt-16 md:pt-20">
              <SectionHeading eyebrow="Skills" title="Strengths I bring" id="skills" />

              <Card
                className="shadow-elev-sm border bg-card/70 p-5 backdrop-blur"
                data-testid="card-skills"
              >
                <div className="flex flex-wrap gap-2">
                  {skills.map((s) => (
                    <Badge
                      key={s.name}
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

            <section className="pt-16 md:pt-20">
              <Card
                className="relative overflow-hidden border bg-card/70 p-6 shadow-elev backdrop-blur"
                data-testid="card-cta"
              >
                <div className="pointer-events-none absolute inset-0">
                  <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-primary/15 blur-3xl" />
                </div>

                <div className="relative flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p
                      className="font-serif text-2xl font-semibold tracking-[-0.02em]"
                      data-testid="text-cta-title"
                    >
                      Let’s connect.
                    </p>
                    <p
                      className="mt-2 max-w-xl text-sm text-muted-foreground"
                      data-testid="text-cta-desc"
                    >
                      If you’re hiring for entry-level accounting roles or internships, I’d
                      love to share more context and learn about your team.
                    </p>
                  </div>

                  <a
                    href="mailto:pt2293@nyu.edu"
                    className="focus-ring inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-elev-sm transition hover:-translate-y-0.5 hover:shadow-elev"
                    data-testid="button-email"
                  >
                    Email me
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                </div>
              </Card>
            </section>

            <footer className="pt-14">
              <div className="flex flex-col items-start justify-between gap-4 border-t py-8 md:flex-row md:items-center">
                <p className="text-sm text-muted-foreground" data-testid="text-footer">
                  © {new Date().getFullYear()} Pooja Trehan • Built with care
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <Anchor href="mailto:pt2293@nyu.edu">
                    <Mail className="h-4 w-4" aria-hidden="true" />
                    Email
                  </Anchor>
                  <Anchor href="#top">
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    Back to top
                  </Anchor>
                </div>
              </div>
            </footer>
          </main>
        </div>
      </div>
    </div>
  );
}

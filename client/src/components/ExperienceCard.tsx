import { useState } from "react";
import { ChevronDown, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { CompanyLogo } from "@/components/CompanyLogo";
import type { Experience } from "@/lib/api";

interface ExperienceCardProps {
  experience: Experience;
  index: number;
}

export function ExperienceCard({ experience: exp, index }: ExperienceCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card
      className="shadow-elev-sm border bg-card/70 p-5 backdrop-blur"
      data-testid={`card-experience-${index}`}
    >
      {/* Desktop view - always expanded */}
      <div className="hidden md:block">
        <div className="flex items-start gap-4">
          <CompanyLogo logoUrl={exp.logoUrl} companyName={exp.company} />
          <div className="flex-1">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold" data-testid={`text-exp-role-${index}`}>
                  {exp.role}
                </h3>
                <p className="text-sm font-medium text-foreground/75">
                  {exp.company}
                </p>
                <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground" data-testid={`text-exp-meta-${index}`}>
                  {exp.type} <span className="text-muted-foreground/60">|</span> <MapPin className="inline h-3.5 w-3.5" /> {exp.location}
                </p>
              </div>
              <div
                className="inline-flex shrink-0 items-center gap-2 rounded-full border bg-background/40 px-3 py-1.5 text-xs text-muted-foreground"
                data-testid={`text-exp-dates-${index}`}
              >
                {exp.startDate} — {exp.endDate}
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        <ul className="space-y-2 text-sm text-foreground/85">
          {exp.bullets.map((b, bIdx) => (
            <li key={bIdx} className="flex gap-2" data-testid={`text-exp-bullet-${index}-${bIdx}`}>
              <span className="mt-1.5 h-2 w-2 shrink-0 border border-primary/50" aria-hidden="true" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Mobile view - collapsible */}
      <div className="md:hidden">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <button className="flex w-full items-center gap-3 text-left">
              <CompanyLogo logoUrl={exp.logoUrl} companyName={exp.company} size="sm" />
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold truncate">{exp.role}</h3>
                <p className="text-xs text-foreground/75">{exp.company}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {exp.startDate} — {exp.endDate}
                </p>
              </div>
              <ChevronDown
                className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                aria-hidden="true"
              />
            </button>
          </CollapsibleTrigger>

          <CollapsibleContent className="overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
            <div className="mt-3">
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                {exp.type} <span className="text-muted-foreground/60">|</span> <MapPin className="inline h-3 w-3" /> {exp.location}
              </p>

              <Separator className="my-3" />

              <ul className="space-y-2 text-sm text-foreground/85">
                {exp.bullets.map((b, bIdx) => (
                  <li key={bIdx} className="flex gap-2">
                    <span className="mt-1.5 h-2 w-2 shrink-0 border border-primary/50" aria-hidden="true" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </Card>
  );
}

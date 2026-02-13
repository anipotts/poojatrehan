import { useState } from "react";
import { ChevronDown, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import type { Education } from "@/lib/api";

interface EducationCardProps {
  education: Education;
  index: number;
}

export function EducationCard({ education: ed, index }: EducationCardProps) {
  const [coursesOpen, setCoursesOpen] = useState(false);
  const isHighSchool = /high school|diploma/i.test(ed.degree);

  return (
    <Card
      className={`shadow-elev-sm border bg-card/70 p-5 backdrop-blur ${isHighSchool ? "py-4" : ""}`}
      data-testid={`card-education-${index}`}
    >
      <p className={`font-semibold ${isHighSchool ? "text-sm" : "text-base"}`} data-testid={`text-edu-school-${index}`}>
        {ed.school}
      </p>
      <p className={`mt-1 text-muted-foreground ${isHighSchool ? "text-xs" : "text-sm"}`} data-testid={`text-edu-degree-${index}`}>
        {ed.degree}
      </p>
      <p className="mt-2 text-xs text-muted-foreground" data-testid={`text-edu-dates-${index}`}>
        {ed.dates}
      </p>
      {ed.details && (
        <p className={`mt-3 text-foreground/80 ${isHighSchool ? "text-xs" : "text-sm"}`} data-testid={`text-edu-details-${index}`}>
          {ed.details}
        </p>
      )}

      {ed.courses && ed.courses.length > 0 && (
        <Collapsible open={coursesOpen} onOpenChange={setCoursesOpen} className="mt-3">
          <CollapsibleTrigger asChild>
            <button className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
              View Coursework
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform duration-200 ${coursesOpen ? "rotate-180" : ""}`}
              />
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <ul className="mt-2 space-y-1">
              {ed.courses.map((course, cIdx) => (
                <li key={cIdx} className="flex items-center gap-1.5 text-xs text-foreground/80">
                  <span className="h-1.5 w-1.5 shrink-0 border border-primary/50" aria-hidden="true" />
                  {course.url ? (
                    <a
                      href={course.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 hover:underline"
                    >
                      {course.name}
                      <ExternalLink className="h-3 w-3 text-muted-foreground" />
                    </a>
                  ) : (
                    <span>{course.name}</span>
                  )}
                </li>
              ))}
            </ul>
          </CollapsibleContent>
        </Collapsible>
      )}
    </Card>
  );
}

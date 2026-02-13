import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Portfolio } from "@/lib/api";

interface PreviewModalProps {
  portfolio: Portfolio;
  onClose: () => void;
}

export default function PreviewModal({ portfolio, onClose }: PreviewModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
      <Card className="relative w-full max-w-6xl max-h-[90vh] overflow-y-auto p-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="absolute right-4 top-4"
        >
          <X className="h-4 w-4" />
        </Button>

        <div className="space-y-8">
          <div>
            <h1 className="font-serif text-4xl font-semibold">
              {portfolio.heroTitle}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              {portfolio.heroSubtitle}
            </p>
          </div>

          <div>
            <h2 className="mb-4 font-serif text-2xl font-semibold">Profile</h2>
            <div className="grid gap-2 text-sm">
              <p><strong>Name:</strong> {portfolio.profileName}</p>
              <p><strong>Title:</strong> {portfolio.profileTitle}</p>
              <p><strong>Email:</strong> {portfolio.profileEmail}</p>
              <p><strong>Location:</strong> {portfolio.profileLocation}</p>
            </div>
          </div>

          <div>
            <h2 className="mb-4 font-serif text-2xl font-semibold">Experience</h2>
            <div className="space-y-4">
              {portfolio.experiences.map((exp) => (
                <Card key={exp.id} className="p-4">
                  <p className="font-semibold">{exp.role} | {exp.company}</p>
                  <p className="text-sm text-muted-foreground">
                    {exp.type} | {exp.location}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {exp.startDate} — {exp.endDate}
                  </p>
                  <ul className="mt-3 space-y-1 text-sm">
                    {exp.bullets.map((bullet, idx) => (
                      <li key={idx} className="flex gap-2">
                        <span className="mt-1.5 h-2 w-2 shrink-0 border border-primary/50" aria-hidden="true" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <h2 className="mb-4 font-serif text-2xl font-semibold">Education</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {portfolio.education.map((edu) => (
                <Card key={edu.id} className="p-4">
                  <p className="font-semibold">{edu.school}</p>
                  <p className="text-sm text-muted-foreground">{edu.degree}</p>
                  <p className="mt-2 text-xs text-muted-foreground">{edu.dates}</p>
                  {edu.details && <p className="mt-2 text-sm">{edu.details}</p>}
                </Card>
              ))}
            </div>
          </div>

          <div>
            <h2 className="mb-4 font-serif text-2xl font-semibold">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {portfolio.skills.map((skill) => (
                <span
                  key={skill.id}
                  className="rounded-full border bg-secondary px-3 py-1 text-sm"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

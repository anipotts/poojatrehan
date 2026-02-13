import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { portfolioApi, type Portfolio } from "@/lib/api";
import { toast } from "sonner";

interface SectionVisibilityEditorProps {
  portfolio: Portfolio;
}

const SECTIONS = [
  { key: "experience" as const, label: "Experience", description: "Work history and internships" },
  { key: "education" as const, label: "Education", description: "Academic background and degrees" },
  { key: "skills" as const, label: "Skills", description: "Technical and soft skills badges" },
  { key: "cta" as const, label: "Contact CTA", description: "Call-to-action section at bottom" },
];

export default function SectionVisibilityEditor({ portfolio }: SectionVisibilityEditorProps) {
  const queryClient = useQueryClient();
  const [visibility, setVisibility] = useState<NonNullable<Portfolio['sectionVisibility']>>(() => {
    const sv = portfolio.sectionVisibility;
    return {
      experience: sv?.experience !== false,
      education: sv?.education !== false,
      skills: sv?.skills !== false,
      cta: sv?.cta !== false,
    };
  });

  const saveMutation = useMutation({
    mutationFn: (newVisibility: NonNullable<Portfolio['sectionVisibility']>) =>
      portfolioApi.saveDraft({ sectionVisibility: newVisibility }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolio", "draft"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to save visibility settings");
    },
  });

  const handleToggle = (key: string, checked: boolean) => {
    const updated = { ...visibility, [key]: checked };
    setVisibility(updated);
    saveMutation.mutate(updated);
  };

  return (
    <Card className="shadow-elev-sm border bg-card/70 p-6 backdrop-blur">
      <h3 className="mb-4 font-serif text-lg font-semibold tracking-[-0.02em]">
        Section Visibility
      </h3>
      <p className="mb-4 text-sm text-muted-foreground">
        Toggle which sections appear on the public site.
      </p>
      <div className="space-y-4">
        {SECTIONS.map((section) => (
          <div key={section.key} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {visibility[section.key] ? (
                <Eye className="h-4 w-4 text-muted-foreground" />
              ) : (
                <EyeOff className="h-4 w-4 text-muted-foreground/50" />
              )}
              <div>
                <p className="text-sm font-medium">{section.label}</p>
                <p className="text-xs text-muted-foreground">{section.description}</p>
              </div>
            </div>
            <Switch
              checked={visibility[section.key]}
              onCheckedChange={(checked) => handleToggle(section.key, checked)}
            />
          </div>
        ))}
      </div>
    </Card>
  );
}

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { experienceApi, type Portfolio, type Experience } from "@/lib/api";
import { MonthYearPicker } from "@/components/ui/month-year-picker";
import { toast } from "sonner";
import DiffBadge from "./DiffBadge";
import { getExperienceDiffStatus } from "@/lib/diff-utils";

interface ExperienceEditorProps {
  portfolio: Portfolio;
  publishedPortfolio?: Portfolio | null;
  compareMode?: boolean;
}

export default function ExperienceEditor({ portfolio, publishedPortfolio, compareMode }: ExperienceEditorProps) {
  const queryClient = useQueryClient();
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingExp, setEditingExp] = useState<Experience | null>(null);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => experienceApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolio", "draft"] });
      toast.success("Experience deleted");
    },
  });

  return (
    <Card className="shadow-elev-sm border bg-card/70 p-6 backdrop-blur">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-serif text-2xl font-semibold tracking-[-0.02em]">Experience</h2>
        <Button onClick={() => setIsAddingNew(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Experience
        </Button>
      </div>

      <div className="space-y-4">
        {portfolio.experiences.map((exp) => {
          const diffStatus = compareMode && publishedPortfolio
            ? getExperienceDiffStatus(exp, publishedPortfolio.experiences)
            : null;

          return (
          <Card key={exp.id} className="shadow-elev-sm border bg-card/70 p-5 backdrop-blur transition hover:-translate-y-0.5 hover:shadow-elev">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-base font-semibold">
                    {exp.role}
                  </p>
                  {diffStatus && <DiffBadge status={diffStatus} />}
                </div>
                <p className="text-sm font-medium text-foreground/75">{exp.company}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {exp.type} | {exp.location}
                </p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border bg-background/40 px-3 py-1.5 text-xs text-muted-foreground">
                {exp.startDate} — {exp.endDate}
              </div>
            </div>

            <div className="my-4 h-px bg-border" />

            <ul className="space-y-2 text-sm text-foreground/85">
              {exp.bullets.map((b, bIdx) => (
                <li key={bIdx} className="flex gap-2">
                  <span className="mt-1.5 h-2 w-2 shrink-0 border border-primary/50" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            <div className="mt-4 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditingExp(exp)}
              >
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => deleteMutation.mutate(exp.id)}
                disabled={deleteMutation.isPending}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </Card>
          );
        })}

        {portfolio.experiences.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No experience entries yet. Click "Add Experience" to get started.
          </p>
        )}
      </div>

      {/* Add/Edit Dialog */}
      {(isAddingNew || editingExp) && (
        <ExperienceDialog
          experience={editingExp}
          portfolioId={portfolio.id}
          onClose={() => {
            setIsAddingNew(false);
            setEditingExp(null);
          }}
        />
      )}
    </Card>
  );
}

interface ExperienceDialogProps {
  experience: Experience | null;
  portfolioId: string;
  onClose: () => void;
}

function ExperienceDialog({ experience, portfolioId, onClose }: ExperienceDialogProps) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    company: experience?.company || "",
    role: experience?.role || "",
    type: experience?.type || "",
    location: experience?.location || "",
    startDate: experience?.startDate || "",
    endDate: experience?.endDate || "",
    bullets: experience?.bullets || [""],
    logoUrl: experience?.logoUrl || "",
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (experience) {
        return experienceApi.update(experience.id, formData);
      } else {
        return experienceApi.create(portfolioId, { ...formData, order: 0 });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolio", "draft"] });
      toast.success(experience ? "Experience updated" : "Experience added");
      onClose();
    },
  });

  const addBullet = () => {
    setFormData({ ...formData, bullets: [...formData.bullets, ""] });
  };

  const removeBullet = (index: number) => {
    setFormData({
      ...formData,
      bullets: formData.bullets.filter((_, i) => i !== index),
    });
  };

  const updateBullet = (index: number, value: string) => {
    const newBullets = [...formData.bullets];
    newBullets[index] = value;
    setFormData({ ...formData, bullets: newBullets });
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {experience ? "Edit Experience" : "Add Experience"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Company</Label>
              <Input
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              />
            </div>
            <div>
              <Label>Role</Label>
              <Input
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              />
            </div>
            <div>
              <Label>Type</Label>
              <Input
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                placeholder="e.g., Internship, Full-time"
              />
            </div>
            <div>
              <Label>Location</Label>
              <Input
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
            <div>
              <Label>Start Date</Label>
              <MonthYearPicker
                value={formData.startDate}
                onChange={(val) => setFormData({ ...formData, startDate: val })}
              />
            </div>
            <div>
              <Label>End Date</Label>
              <MonthYearPicker
                value={formData.endDate}
                onChange={(val) => setFormData({ ...formData, endDate: val })}
                allowPresent
              />
            </div>
          </div>

          <div>
            <Label>Company Logo URL (optional)</Label>
            <Input
              value={formData.logoUrl}
              onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
              placeholder="https://example.com/logo.png"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Direct link to company logo image
            </p>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <Label>Key Achievements</Label>
              <Button type="button" variant="outline" size="sm" onClick={addBullet}>
                <Plus className="h-4 w-4 mr-1" />
                Add Bullet
              </Button>
            </div>
            <div className="space-y-2">
              {formData.bullets.map((bullet, index) => (
                <div key={index} className="flex gap-2">
                  <Textarea
                    value={bullet}
                    onChange={(e) => updateBullet(index, e.target.value)}
                    placeholder="Describe an achievement..."
                    rows={2}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeBullet(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
              {saveMutation.isPending ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</>
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

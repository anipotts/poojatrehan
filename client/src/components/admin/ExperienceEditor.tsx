import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, GripVertical, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { experienceApi, type Portfolio, type Experience } from "@/lib/api";
import { toast } from "sonner";

interface ExperienceEditorProps {
  portfolio: Portfolio;
}

export default function ExperienceEditor({ portfolio }: ExperienceEditorProps) {
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
    <Card className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-serif text-2xl font-semibold">Experience</h2>
        <Button onClick={() => setIsAddingNew(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Experience
        </Button>
      </div>

      <div className="space-y-4">
        {portfolio.experiences.map((exp) => (
          <Card key={exp.id} className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-semibold">{exp.role}</p>
                    <p className="text-sm text-muted-foreground">{exp.company}</p>
                  </div>
                </div>
                <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                  <p>{exp.type} • {exp.location}</p>
                  <p>{exp.startDate} — {exp.endDate}</p>
                </div>
              </div>
              <div className="flex gap-2">
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
            </div>
          </Card>
        ))}

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
              <Input
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                placeholder="e.g., May 2024"
              />
            </div>
            <div>
              <Label>End Date</Label>
              <Input
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                placeholder="e.g., Aug 2024"
              />
            </div>
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

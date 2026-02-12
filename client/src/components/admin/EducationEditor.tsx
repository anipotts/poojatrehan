import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { educationApi, type Portfolio, type Education } from "@/lib/api";
import { toast } from "sonner";

interface EducationEditorProps {
  portfolio: Portfolio;
}

export default function EducationEditor({ portfolio }: EducationEditorProps) {
  const queryClient = useQueryClient();
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingEdu, setEditingEdu] = useState<Education | null>(null);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => educationApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolio", "draft"] });
      toast.success("Education deleted");
    },
  });

  return (
    <Card className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-serif text-2xl font-semibold">Education</h2>
        <Button onClick={() => setIsAddingNew(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Education
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {portfolio.education.map((edu) => (
          <Card key={edu.id} className="p-4">
            <div>
              <p className="font-semibold">{edu.school}</p>
              <p className="text-sm text-muted-foreground">{edu.degree}</p>
              <p className="mt-2 text-xs text-muted-foreground">{edu.dates}</p>
              {edu.details && (
                <p className="mt-2 text-sm">{edu.details}</p>
              )}
            </div>
            <div className="mt-4 flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setEditingEdu(edu)}>
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => deleteMutation.mutate(edu.id)}
                disabled={deleteMutation.isPending}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}

        {portfolio.education.length === 0 && (
          <p className="col-span-2 py-8 text-center text-sm text-muted-foreground">
            No education entries yet. Click "Add Education" to get started.
          </p>
        )}
      </div>

      {(isAddingNew || editingEdu) && (
        <EducationDialog
          education={editingEdu}
          portfolioId={portfolio.id}
          onClose={() => {
            setIsAddingNew(false);
            setEditingEdu(null);
          }}
        />
      )}
    </Card>
  );
}

interface EducationDialogProps {
  education: Education | null;
  portfolioId: string;
  onClose: () => void;
}

function EducationDialog({ education, portfolioId, onClose }: EducationDialogProps) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    school: education?.school || "",
    degree: education?.degree || "",
    dates: education?.dates || "",
    details: education?.details || "",
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (education) {
        return educationApi.update(education.id, formData);
      } else {
        return educationApi.create(portfolioId, { ...formData, order: 0 });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolio", "draft"] });
      toast.success(education ? "Education updated" : "Education added");
      onClose();
    },
  });

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {education ? "Edit Education" : "Add Education"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>School/Institution</Label>
            <Input
              value={formData.school}
              onChange={(e) => setFormData({ ...formData, school: e.target.value })}
            />
          </div>
          <div>
            <Label>Degree/Program</Label>
            <Input
              value={formData.degree}
              onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
            />
          </div>
          <div>
            <Label>Dates</Label>
            <Input
              value={formData.dates}
              onChange={(e) => setFormData({ ...formData, dates: e.target.value })}
              placeholder="e.g., Sep 2022 — May 2026"
            />
          </div>
          <div>
            <Label>Additional Details (Optional)</Label>
            <Textarea
              value={formData.details || ""}
              onChange={(e) => setFormData({ ...formData, details: e.target.value })}
              placeholder="Activities, honors, etc."
              rows={3}
            />
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

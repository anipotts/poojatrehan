import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MonthYearPicker } from "@/components/ui/month-year-picker";
import { educationApi, type Portfolio, type Education } from "@/lib/api";
import { toast } from "sonner";
import DiffBadge from "./DiffBadge";
import { getEducationDiffStatus } from "@/lib/diff-utils";

interface EducationEditorProps {
  portfolio: Portfolio;
  publishedPortfolio?: Portfolio | null;
  compareMode?: boolean;
}

export default function EducationEditor({ portfolio, publishedPortfolio, compareMode }: EducationEditorProps) {
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
    <Card className="shadow-elev-sm border bg-card/70 p-6 backdrop-blur">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-serif text-2xl font-semibold tracking-[-0.02em]">Education</h2>
        <Button onClick={() => setIsAddingNew(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Education
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {portfolio.education.map((edu) => {
          const diffStatus = compareMode && publishedPortfolio
            ? getEducationDiffStatus(edu, publishedPortfolio.education)
            : null;

          return (
          <Card key={edu.id} className="shadow-elev-sm border bg-card/70 p-5 backdrop-blur transition hover:-translate-y-0.5 hover:shadow-elev">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-semibold">{edu.school}</p>
              {diffStatus && <DiffBadge status={diffStatus} />}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{edu.degree}</p>
            <p className="mt-3 text-xs text-muted-foreground">{edu.dates}</p>
            {edu.details ? (
              <p className="mt-3 text-sm text-foreground/80">{edu.details}</p>
            ) : null}

            {edu.courses && edu.courses.length > 0 && (
              <div className="mt-3">
                <p className="text-xs font-medium text-muted-foreground">
                  {edu.courses.length} course{edu.courses.length !== 1 ? "s" : ""}
                </p>
              </div>
            )}

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
          );
        })}

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

// Parse existing dates like "Sep 2022 — May 2026" into start/end
const parseDates = (dates: string) => {
  const parts = dates.split(/\s*[—–-]\s*/);
  return {
    startDate: parts[0]?.trim() || "",
    endDate: parts[1]?.trim() || "",
  };
};

function EducationDialog({ education, portfolioId, onClose }: EducationDialogProps) {
  const queryClient = useQueryClient();

  const existingDates = education ? parseDates(education.dates) : { startDate: "", endDate: "" };

  const [formData, setFormData] = useState({
    school: education?.school || "",
    degree: education?.degree || "",
    startDate: existingDates.startDate,
    endDate: existingDates.endDate,
    details: education?.details || "",
    courses: education?.courses || [] as { name: string; url?: string }[],
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const saveData = {
        school: formData.school,
        degree: formData.degree,
        dates: formData.endDate ? `${formData.startDate} — ${formData.endDate}` : formData.startDate,
        details: formData.details || null,
        courses: formData.courses.length > 0 ? formData.courses : null,
      };
      if (education) {
        return educationApi.update(education.id, saveData);
      } else {
        return educationApi.create(portfolioId, { ...saveData, order: 0 });
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
          <div className="grid gap-4 md:grid-cols-2">
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
            <Label>Additional Details (Optional)</Label>
            <Textarea
              value={formData.details || ""}
              onChange={(e) => setFormData({ ...formData, details: e.target.value })}
              placeholder="Activities, honors, etc."
              rows={3}
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <Label>Relevant Coursework (Optional)</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setFormData({
                  ...formData,
                  courses: [...formData.courses, { name: "" }],
                })}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Course
              </Button>
            </div>
            <div className="space-y-2">
              {formData.courses.map((course, idx) => (
                <div key={idx} className="flex gap-2">
                  <Input
                    value={course.name}
                    onChange={(e) => {
                      const updated = [...formData.courses];
                      updated[idx] = { ...updated[idx], name: e.target.value };
                      setFormData({ ...formData, courses: updated });
                    }}
                    placeholder="Course name"
                    className="flex-1"
                  />
                  <Input
                    value={course.url || ""}
                    onChange={(e) => {
                      const updated = [...formData.courses];
                      updated[idx] = { ...updated[idx], url: e.target.value || undefined };
                      setFormData({ ...formData, courses: updated });
                    }}
                    placeholder="URL (optional)"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        courses: formData.courses.filter((_, i) => i !== idx),
                      });
                    }}
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

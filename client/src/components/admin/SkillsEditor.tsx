import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { skillsApi, type Portfolio } from "@/lib/api";
import { toast } from "sonner";

interface SkillsEditorProps {
  portfolio: Portfolio;
}

export default function SkillsEditor({ portfolio }: SkillsEditorProps) {
  const queryClient = useQueryClient();
  const [newSkill, setNewSkill] = useState("");

  const addMutation = useMutation({
    mutationFn: async () => {
      if (!newSkill.trim()) {
        throw new Error("Skill name cannot be empty");
      }
      return skillsApi.create(portfolio.id, {
        name: newSkill.trim(),
        order: portfolio.skills.length,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolio", "draft"] });
      toast.success("Skill added");
      setNewSkill("");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => skillsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolio", "draft"] });
      toast.success("Skill removed");
    },
  });

  return (
    <Card className="p-6">
      <h2 className="mb-6 font-serif text-2xl font-semibold">Skills</h2>

      <div className="space-y-6">
        <div>
          <div className="flex gap-2">
            <Input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Enter skill name..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addMutation.mutate();
                }
              }}
            />
            <Button
              onClick={() => addMutation.mutate()}
              disabled={addMutation.isPending || !newSkill.trim()}
            >
              {addMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Press Enter or click + to add
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {portfolio.skills.map((skill) => (
            <Badge
              key={skill.id}
              variant="secondary"
              className="group relative pr-8 text-sm"
            >
              {skill.name}
              <button
                onClick={() => deleteMutation.mutate(skill.id)}
                disabled={deleteMutation.isPending}
                className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full p-1 opacity-0 transition hover:bg-destructive hover:text-destructive-foreground group-hover:opacity-100"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>

        {portfolio.skills.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No skills yet. Add your first skill above.
          </p>
        )}
      </div>
    </Card>
  );
}

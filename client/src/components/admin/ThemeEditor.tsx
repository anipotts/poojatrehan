import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { portfolioApi, type Portfolio } from "@/lib/api";
import { toast } from "sonner";

interface ThemeEditorProps {
  portfolio: Portfolio;
}

export default function ThemeEditor({ portfolio }: ThemeEditorProps) {
  const queryClient = useQueryClient();
  const [themeColors, setThemeColors] = useState({
    primary: portfolio.themeColors?.primary || "#0066cc",
    accent: portfolio.themeColors?.accent || "#ff6b6b",
  });

  const saveMutation = useMutation({
    mutationFn: () => portfolioApi.saveDraft({ themeColors }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolio", "draft"] });
      toast.success("Theme updated successfully!");
    },
  });

  const resetMutation = useMutation({
    mutationFn: () => portfolioApi.saveDraft({ themeColors: null }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolio", "draft"] });
      setThemeColors({ primary: "#0066cc", accent: "#ff6b6b" });
      toast.success("Theme reset to default");
    },
  });

  return (
    <Card className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-serif text-2xl font-semibold">Theme Customization</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => resetMutation.mutate()}
          disabled={resetMutation.isPending}
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset to Default
        </Button>
      </div>

      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <Label htmlFor="primary">Primary Color</Label>
            <div className="mt-2 flex items-center gap-3">
              <input
                id="primary"
                type="color"
                value={themeColors.primary}
                onChange={(e) =>
                  setThemeColors({ ...themeColors, primary: e.target.value })
                }
                className="h-12 w-20 cursor-pointer rounded border"
              />
              <div>
                <p className="text-sm font-medium">{themeColors.primary}</p>
                <p className="text-xs text-muted-foreground">
                  Used for buttons, links, and accents
                </p>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="accent">Accent Color</Label>
            <div className="mt-2 flex items-center gap-3">
              <input
                id="accent"
                type="color"
                value={themeColors.accent}
                onChange={(e) =>
                  setThemeColors({ ...themeColors, accent: e.target.value })
                }
                className="h-12 w-20 cursor-pointer rounded border"
              />
              <div>
                <p className="text-sm font-medium">{themeColors.accent}</p>
                <p className="text-xs text-muted-foreground">
                  Used for highlights and emphasis
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-muted/30 p-4">
          <p className="mb-2 text-sm font-medium">Preview</p>
          <div className="flex flex-wrap gap-2">
            <Button style={{ backgroundColor: themeColors.primary }}>
              Primary Button
            </Button>
            <Button
              variant="outline"
              style={{ borderColor: themeColors.accent, color: themeColors.accent }}
            >
              Accent Button
            </Button>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            onClick={() => saveMutation.mutate()}
            disabled={saveMutation.isPending}
          >
            {saveMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Theme"
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}

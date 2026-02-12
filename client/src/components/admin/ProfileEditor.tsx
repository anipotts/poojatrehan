import { useState, useEffect, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Upload, Loader2, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { portfolioApi, imageApi, type Portfolio } from "@/lib/api";
import { toast } from "sonner";

interface ProfileEditorProps {
  portfolio: Portfolio;
}

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function ProfileEditor({ portfolio }: ProfileEditorProps) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    profileName: portfolio.profileName,
    profileTitle: portfolio.profileTitle,
    profileDescription: portfolio.profileDescription,
    profileEmail: portfolio.profileEmail,
    profileLocation: portfolio.profileLocation,
    heroTitle: portfolio.heroTitle,
    heroSubtitle: portfolio.heroSubtitle,
    heroStatus: portfolio.heroStatus,
  });

  const [uploading, setUploading] = useState(false);
  const [saveState, setSaveState] = useState<'saved' | 'saving' | 'error' | null>(null);

  // Debounce form data for auto-save
  const debouncedFormData = useDebounce(formData, 1000);

  const saveMutation = useMutation({
    mutationFn: () => portfolioApi.saveDraft(formData),
    onMutate: () => {
      setSaveState('saving');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolio", "draft"] });
      setSaveState('saved');
      setTimeout(() => setSaveState(null), 2000);
    },
    onError: (error: Error) => {
      setSaveState('error');
      toast.error(error.message || "Failed to save");
      setTimeout(() => setSaveState(null), 3000);
    },
  });

  // Auto-save when form data changes
  useEffect(() => {
    // Don't auto-save on initial load
    const hasChanged = JSON.stringify(debouncedFormData) !== JSON.stringify({
      profileName: portfolio.profileName,
      profileTitle: portfolio.profileTitle,
      profileDescription: portfolio.profileDescription,
      profileEmail: portfolio.profileEmail,
      profileLocation: portfolio.profileLocation,
      heroTitle: portfolio.heroTitle,
      heroSubtitle: portfolio.heroSubtitle,
      heroStatus: portfolio.heroStatus,
    });

    if (hasChanged) {
      saveMutation.mutate();
    }
  }, [debouncedFormData]);

  // Keyboard shortcut: Cmd/Ctrl + S to save
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        saveMutation.mutate();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [formData]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setUploading(true);

    try {
      const { url } = await imageApi.upload(file);
      await portfolioApi.saveDraft({ profileImageUrl: url });
      queryClient.invalidateQueries({ queryKey: ["portfolio", "draft"] });
      toast.success("Image uploaded successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Auto-save indicator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {saveState === 'saving' && (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Saving...</span>
            </>
          )}
          {saveState === 'saved' && (
            <>
              <Check className="h-4 w-4 text-green-600" />
              <span className="text-green-600">Saved</span>
            </>
          )}
          {saveState === 'error' && (
            <>
              <AlertCircle className="h-4 w-4 text-red-600" />
              <span className="text-red-600">Error saving</span>
            </>
          )}
          {!saveState && (
            <span className="text-xs">Changes save automatically</span>
          )}
        </div>
      </div>

      <Card className="p-6 space-y-6">
        {/* Profile Image */}
        <div>
          <Label>Profile Image</Label>
          <div className="mt-2 flex items-center gap-4">
            {portfolio.profileImageUrl && (
              <img
                src={portfolio.profileImageUrl}
                alt="Profile"
                className="h-20 w-20 rounded-full object-cover border-2"
              />
            )}
            <div>
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={uploading}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => document.getElementById("image-upload")?.click()}
                disabled={uploading}
              >
                {uploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Image
                  </>
                )}
              </Button>
              <p className="mt-1 text-xs text-muted-foreground">
                PNG, JPG up to 5MB
              </p>
            </div>
          </div>
        </div>

        {/* Basic Info */}
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="profileName">Full Name</Label>
            <Input
              id="profileName"
              value={formData.profileName}
              onChange={(e) => handleChange("profileName", e.target.value)}
              placeholder="Your full name"
            />
          </div>

          <div>
            <Label htmlFor="profileTitle">Title</Label>
            <Input
              id="profileTitle"
              value={formData.profileTitle}
              onChange={(e) => handleChange("profileTitle", e.target.value)}
              placeholder="e.g., Economics Student"
            />
          </div>

          <div>
            <Label htmlFor="profileEmail">Email</Label>
            <Input
              id="profileEmail"
              type="email"
              value={formData.profileEmail}
              onChange={(e) => handleChange("profileEmail", e.target.value)}
              placeholder="your@email.com"
            />
          </div>

          <div>
            <Label htmlFor="profileLocation">Location</Label>
            <Input
              id="profileLocation"
              value={formData.profileLocation}
              onChange={(e) => handleChange("profileLocation", e.target.value)}
              placeholder="e.g., New York, NY"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <Label htmlFor="profileDescription">Profile Description</Label>
          <Textarea
            id="profileDescription"
            value={formData.profileDescription}
            onChange={(e) => handleChange("profileDescription", e.target.value)}
            placeholder="Brief introduction about yourself"
            rows={4}
            className="resize-none"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            {formData.profileDescription.length} characters
          </p>
        </div>

        {/* Hero Section */}
        <div className="space-y-4 border-t pt-6">
          <h3 className="font-medium">Hero Section</h3>

          <div>
            <Label htmlFor="heroStatus">Status Badge</Label>
            <Input
              id="heroStatus"
              value={formData.heroStatus}
              onChange={(e) => handleChange("heroStatus", e.target.value)}
              placeholder="e.g., Economics @ NYU"
            />
          </div>

          <div>
            <Label htmlFor="heroTitle">Hero Title</Label>
            <Input
              id="heroTitle"
              value={formData.heroTitle}
              onChange={(e) => handleChange("heroTitle", e.target.value)}
              placeholder="Main headline"
            />
          </div>

          <div>
            <Label htmlFor="heroSubtitle">Hero Subtitle</Label>
            <Textarea
              id="heroSubtitle"
              value={formData.heroSubtitle}
              onChange={(e) => handleChange("heroSubtitle", e.target.value)}
              placeholder="Supporting text"
              rows={3}
              className="resize-none"
            />
          </div>
        </div>
      </Card>
    </div>
  );
}

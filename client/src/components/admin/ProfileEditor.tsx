import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Upload, Loader2 } from "lucide-react";
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

  const saveMutation = useMutation({
    mutationFn: () => portfolioApi.saveDraft(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolio", "draft"] });
      toast.success("Profile updated successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to save");
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setUploading(true);
    try {
      const { url } = await imageApi.upload(file);
      await portfolioApi.saveDraft({ profileImageUrl: url });
      queryClient.invalidateQueries({ queryKey: ["portfolio", "draft"] });
      toast.success("Profile image uploaded!");
    } catch (error: any) {
      toast.error(error.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="mb-6 font-serif text-2xl font-semibold">Profile Information</h2>

      <div className="space-y-6">
        {/* Profile Image */}
        <div>
          <Label>Profile Image</Label>
          <div className="mt-2 flex items-center gap-4">
            {portfolio.profileImageUrl ? (
              <img
                src={portfolio.profileImageUrl}
                alt="Profile"
                className="h-24 w-24 rounded-lg object-cover"
              />
            ) : (
              <div className="h-24 w-24 rounded-lg bg-muted" />
            )}
            <div>
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="hidden"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => document.getElementById("image-upload")?.click()}
                disabled={uploading}
              >
                {uploading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="mr-2 h-4 w-4" />
                )}
                Upload Image
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
              onChange={(e) =>
                setFormData({ ...formData, profileName: e.target.value })
              }
            />
          </div>

          <div>
            <Label htmlFor="profileTitle">Title</Label>
            <Input
              id="profileTitle"
              value={formData.profileTitle}
              onChange={(e) =>
                setFormData({ ...formData, profileTitle: e.target.value })
              }
            />
          </div>

          <div>
            <Label htmlFor="profileEmail">Email</Label>
            <Input
              id="profileEmail"
              type="email"
              value={formData.profileEmail}
              onChange={(e) =>
                setFormData({ ...formData, profileEmail: e.target.value })
              }
            />
          </div>

          <div>
            <Label htmlFor="profileLocation">Location</Label>
            <Input
              id="profileLocation"
              value={formData.profileLocation}
              onChange={(e) =>
                setFormData({ ...formData, profileLocation: e.target.value })
              }
            />
          </div>
        </div>

        <div>
          <Label htmlFor="profileDescription">Profile Description</Label>
          <Textarea
            id="profileDescription"
            rows={3}
            value={formData.profileDescription}
            onChange={(e) =>
              setFormData({ ...formData, profileDescription: e.target.value })
            }
          />
        </div>

        {/* Hero Section */}
        <div className="border-t pt-6">
          <h3 className="mb-4 font-semibold">Hero Section</h3>

          <div className="space-y-4">
            <div>
              <Label htmlFor="heroStatus">Status Badge</Label>
              <Input
                id="heroStatus"
                value={formData.heroStatus}
                onChange={(e) =>
                  setFormData({ ...formData, heroStatus: e.target.value })
                }
              />
            </div>

            <div>
              <Label htmlFor="heroTitle">Hero Title</Label>
              <Input
                id="heroTitle"
                value={formData.heroTitle}
                onChange={(e) =>
                  setFormData({ ...formData, heroTitle: e.target.value })
                }
              />
            </div>

            <div>
              <Label htmlFor="heroSubtitle">Hero Subtitle</Label>
              <Textarea
                id="heroSubtitle"
                rows={3}
                value={formData.heroSubtitle}
                onChange={(e) =>
                  setFormData({ ...formData, heroSubtitle: e.target.value })
                }
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
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
              "Save Changes"
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}

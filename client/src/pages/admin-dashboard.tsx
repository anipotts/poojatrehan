import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  Sparkles,
  User,
  Briefcase,
  GraduationCap,
  Lightbulb,
  Palette,
  Eye,
  Send,
  LogOut,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authApi, portfolioApi } from "@/lib/api";
import { toast } from "sonner";
import ProfileEditor from "@/components/admin/ProfileEditor";
import ExperienceEditor from "@/components/admin/ExperienceEditor";
import EducationEditor from "@/components/admin/EducationEditor";
import SkillsEditor from "@/components/admin/SkillsEditor";
import ThemeEditor from "@/components/admin/ThemeEditor";
import PreviewModal from "@/components/admin/PreviewModal";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("profile");
  const [showPreview, setShowPreview] = useState(false);
  const queryClient = useQueryClient();

  // Check auth
  const { data: authData, isLoading: authLoading } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: authApi.me,
    retry: false,
  });

  // Get draft portfolio
  const { data: portfolio, isLoading: portfolioLoading } = useQuery({
    queryKey: ["portfolio", "draft"],
    queryFn: portfolioApi.getDraft,
    enabled: !!authData,
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      queryClient.clear();
      toast.success("Logged out successfully");
      setLocation("/admin");
    },
  });

  // Publish mutation
  const publishMutation = useMutation({
    mutationFn: portfolioApi.publish,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolio"] });
      toast.success("Portfolio published successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to publish");
    },
  });

  // Redirect if not authenticated
  if (authLoading) {
    return (
      <div className="surface flex min-h-dvh items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!authData) {
    setLocation("/admin");
    return null;
  }

  const isLoading = portfolioLoading;

  return (
    <div className="surface min-h-dvh">
      {/* Top bar */}
      <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-primary" />
            <div>
              <h1 className="font-semibold">Admin Dashboard</h1>
              <p className="text-xs text-muted-foreground">
                Viewing Draft Content
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPreview(true)}
              disabled={!portfolio}
            >
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </Button>
            <Button
              size="sm"
              onClick={() => publishMutation.mutate()}
              disabled={publishMutation.isPending || !portfolio}
            >
              {publishMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}
              Publish
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => logoutMutation.mutate()}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="mx-auto max-w-7xl p-6">
        {isLoading ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : !portfolio ? (
          <Card className="p-6 text-center">
            <p className="text-muted-foreground">
              No portfolio data found. Please contact support.
            </p>
          </Card>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="profile">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </TabsTrigger>
                <TabsTrigger value="experience">
                  <Briefcase className="mr-2 h-4 w-4" />
                  Experience
                </TabsTrigger>
                <TabsTrigger value="education">
                  <GraduationCap className="mr-2 h-4 w-4" />
                  Education
                </TabsTrigger>
                <TabsTrigger value="skills">
                  <Lightbulb className="mr-2 h-4 w-4" />
                  Skills
                </TabsTrigger>
                <TabsTrigger value="theme">
                  <Palette className="mr-2 h-4 w-4" />
                  Theme
                </TabsTrigger>
              </TabsList>

              <TabsContent value="profile">
                <ProfileEditor portfolio={portfolio} />
              </TabsContent>

              <TabsContent value="experience">
                <ExperienceEditor portfolio={portfolio} />
              </TabsContent>

              <TabsContent value="education">
                <EducationEditor portfolio={portfolio} />
              </TabsContent>

              <TabsContent value="skills">
                <SkillsEditor portfolio={portfolio} />
              </TabsContent>

              <TabsContent value="theme">
                <ThemeEditor portfolio={portfolio} />
              </TabsContent>
            </Tabs>
          </motion.div>
        )}
      </div>

      {/* Preview Modal */}
      {showPreview && portfolio && (
        <PreviewModal
          portfolio={portfolio}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
}

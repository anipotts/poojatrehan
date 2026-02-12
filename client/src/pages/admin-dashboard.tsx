import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  User,
  Briefcase,
  GraduationCap,
  Lightbulb,
  Palette,
  Eye,
  Send,
  LogOut,
  Loader2,
  PanelLeftClose,
  PanelLeft,
  GitCompare,
  ExternalLink,
  Check,
  Edit,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { authApi, portfolioApi } from "@/lib/api";
import { toast } from "sonner";
import ProfileEditor from "@/components/admin/ProfileEditor";
import ExperienceEditor from "@/components/admin/ExperienceEditor";
import EducationEditor from "@/components/admin/EducationEditor";
import SkillsEditor from "@/components/admin/SkillsEditor";
import ThemeEditor from "@/components/admin/ThemeEditor";
import PreviewModal from "@/components/admin/PreviewModal";
import LivePreviewPane from "@/components/admin/LivePreviewPane";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("profile");
  const [showPreview, setShowPreview] = useState(false);
  const [showLivePreview, setShowLivePreview] = useState(false); // Start hidden on mobile
  const [compareMode, setCompareMode] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [compareMobileTab, setCompareMobileTab] = useState<'live' | 'draft'>('draft');
  const queryClient = useQueryClient();

  // Show live preview by default on desktop, detect mobile state
  useEffect(() => {
    const checkMobile = () => {
      const isDesktop = window.matchMedia('(min-width: 768px)').matches;
      setIsMobile(!isDesktop);
      setShowLivePreview(isDesktop);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Animation variants
  const container = {
    hidden: { opacity: 0, y: 12 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.55,
        staggerChildren: 0.08,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modKey = isMac ? e.metaKey : e.ctrlKey;

      // Cmd/Ctrl + P: Toggle preview
      if (modKey && e.key === 'p' && !e.shiftKey) {
        e.preventDefault();
        setShowLivePreview((prev) => !prev);
        toast.info(showLivePreview ? 'Preview hidden' : 'Preview shown');
      }

      // Cmd/Ctrl + Shift + C: Toggle compare mode
      if (modKey && e.shiftKey && e.key === 'c') {
        e.preventDefault();
        setCompareMode((prev) => !prev);
        toast.info(compareMode ? 'Compare mode off' : 'Compare mode on');
      }

      // Cmd/Ctrl + S: Already handled in ProfileEditor, but prevent default
      if (modKey && e.key === 's') {
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showLivePreview, compareMode]);

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

  // Get published portfolio for comparison
  const { data: publishedPortfolio } = useQuery({
    queryKey: ["portfolio", "published"],
    queryFn: portfolioApi.getPublished,
    enabled: !!authData && compareMode,
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
      <div className="relative min-h-dvh grain">
        {/* Top bar */}
        <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <img
              src="/favicon.svg"
              alt="PT"
              className="h-8 w-8 rounded border transition-colors"
              style={{ borderColor: 'hsl(var(--primary))' }}
            />
            <div>
              <h1 className="font-semibold">Admin Dashboard</h1>
              <p className="text-xs text-muted-foreground">
                Viewing Draft Content
              </p>
            </div>
          </div>

          <TooltipProvider>
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowLivePreview(!showLivePreview)}
                    disabled={!portfolio}
                  >
                    {showLivePreview ? (
                      <PanelLeftClose className="mr-2 h-4 w-4" />
                    ) : (
                      <PanelLeft className="mr-2 h-4 w-4" />
                    )}
                    <span className="hidden md:inline">{showLivePreview ? "Hide" : "Show"} Preview</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Toggle live preview (Cmd/Ctrl+P)</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPreview(true)}
                    disabled={!portfolio}
                  >
                    <Eye className="h-4 w-4 md:mr-2" />
                    <span className="hidden md:inline">Full Preview</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Open full-screen preview modal</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={compareMode ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCompareMode(!compareMode)}
                    disabled={!portfolio}
                  >
                    <GitCompare className="h-4 w-4 md:mr-2" />
                    <span className="hidden md:inline">Compare</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Compare draft with published (Cmd/Ctrl+Shift+C)</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open('/', '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 md:mr-2" />
                    <span className="hidden md:inline">Live Site</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Open live portfolio in new tab</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    onClick={() => publishMutation.mutate()}
                    disabled={publishMutation.isPending || !portfolio}
                  >
                    {publishMutation.isPending ? (
                      <Loader2 className="h-4 w-4 md:mr-2 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4 md:mr-2" />
                    )}
                    <span className="hidden md:inline">Publish</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Publish draft changes to live site</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => logoutMutation.mutate()}
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Log out</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </div>
      </header>

      {/* Mobile Compare Mode: Tabs */}
      {isMobile && compareMode && portfolio && publishedPortfolio && (
        <div className="fixed top-16 left-0 right-0 z-40 bg-card border-b md:hidden">
          <div className="flex">
            <button
              onClick={() => setCompareMobileTab('live')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition ${
                compareMobileTab === 'live'
                  ? 'bg-green-500/10 text-green-700 border-b-2 border-green-500'
                  : 'text-muted-foreground'
              }`}
            >
              <Check className="inline mr-1 h-3 w-3" /> Live
            </button>
            <button
              onClick={() => setCompareMobileTab('draft')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition ${
                compareMobileTab === 'draft'
                  ? 'bg-yellow-500/10 text-yellow-700 border-b-2 border-yellow-500'
                  : 'text-muted-foreground'
              }`}
            >
              <Edit className="inline mr-1 h-3 w-3" /> Draft
            </button>
          </div>
        </div>
      )}

      {/* Main content */}
      <PanelGroup direction="horizontal" className="flex-1">
        <Panel defaultSize={compareMode ? 50 : (showLivePreview ? 50 : 100)} minSize={30}>
          <div
            className="h-full overflow-y-auto p-6 pb-24 md:pb-6"
            style={{ marginTop: isMobile && compareMode ? '48px' : '0' }}
          >
        {/* Mobile Compare Mode: Show selected preview */}
        {isMobile && compareMode && portfolio && publishedPortfolio ? (
          compareMobileTab === 'live' ? (
            <LivePreviewPane
              portfolio={publishedPortfolio}
              activeTab={activeTab}
              onSectionClick={setActiveTab}
            />
          ) : (
            <LivePreviewPane
              portfolio={portfolio}
              activeTab={activeTab}
              onSectionClick={setActiveTab}
            />
          )
        ) : isLoading ? (
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
            variants={container}
            initial="hidden"
            animate="show"
          >
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="surface mb-6 border shadow-elev-sm p-1">
                <TabsTrigger
                  value="profile"
                  className="data-[state=active]:shadow-elev data-[state=active]:bg-card/70 data-[state=active]:backdrop-blur transition"
                >
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </TabsTrigger>
                <TabsTrigger
                  value="experience"
                  className="data-[state=active]:shadow-elev data-[state=active]:bg-card/70 data-[state=active]:backdrop-blur transition"
                >
                  <Briefcase className="mr-2 h-4 w-4" />
                  Experience
                </TabsTrigger>
                <TabsTrigger
                  value="education"
                  className="data-[state=active]:shadow-elev data-[state=active]:bg-card/70 data-[state=active]:backdrop-blur transition"
                >
                  <GraduationCap className="mr-2 h-4 w-4" />
                  Education
                </TabsTrigger>
                <TabsTrigger
                  value="skills"
                  className="data-[state=active]:shadow-elev data-[state=active]:bg-card/70 data-[state=active]:backdrop-blur transition"
                >
                  <Lightbulb className="mr-2 h-4 w-4" />
                  Skills
                </TabsTrigger>
                <TabsTrigger
                  value="theme"
                  className="data-[state=active]:shadow-elev data-[state=active]:bg-card/70 data-[state=active]:backdrop-blur transition"
                >
                  <Palette className="mr-2 h-4 w-4" />
                  Theme
                </TabsTrigger>
              </TabsList>

              <TabsContent value="profile">
                <motion.div variants={item}>
                  <ProfileEditor portfolio={portfolio} />
                </motion.div>
              </TabsContent>

              <TabsContent value="experience">
                <motion.div variants={item}>
                  <ExperienceEditor
                    portfolio={portfolio}
                    publishedPortfolio={publishedPortfolio}
                    compareMode={compareMode}
                  />
                </motion.div>
              </TabsContent>

              <TabsContent value="education">
                <motion.div variants={item}>
                  <EducationEditor
                    portfolio={portfolio}
                    publishedPortfolio={publishedPortfolio}
                    compareMode={compareMode}
                  />
                </motion.div>
              </TabsContent>

              <TabsContent value="skills">
                <motion.div variants={item}>
                  <SkillsEditor
                    portfolio={portfolio}
                    publishedPortfolio={publishedPortfolio}
                    compareMode={compareMode}
                  />
                </motion.div>
              </TabsContent>

              <TabsContent value="theme">
                <motion.div variants={item}>
                  <ThemeEditor portfolio={portfolio} />
                </motion.div>
              </TabsContent>
            </Tabs>
          </motion.div>
        )}
          </div>
        </Panel>

        {/* Compare Mode: Two Preview Panels (Desktop only) */}
        {compareMode && portfolio && publishedPortfolio && !isMobile && (
          <>
            {/* Live Site Panel */}
            <PanelResizeHandle className="w-1 bg-border hover:bg-primary/50 transition-colors" />
            <Panel defaultSize={25} minSize={15}>
              <div className="h-full overflow-y-auto">
                <div className="sticky top-0 z-10 bg-card/95 backdrop-blur px-4 py-2 border-b">
                  <div className="inline-flex items-center gap-2 rounded-full border bg-green-500/10 text-green-700 border-green-500/20 px-3 py-1 text-xs font-medium">
                    <Check className="h-3 w-3" /> Live
                  </div>
                </div>
                <LivePreviewPane
                  portfolio={publishedPortfolio}
                  activeTab={activeTab}
                  onSectionClick={setActiveTab}
                />
              </div>
            </Panel>

            {/* Draft Site Panel */}
            <PanelResizeHandle className="w-1 bg-border hover:bg-primary/50 transition-colors" />
            <Panel defaultSize={25} minSize={15}>
              <div className="h-full overflow-y-auto">
                <div className="sticky top-0 z-10 bg-card/95 backdrop-blur px-4 py-2 border-b">
                  <div className="inline-flex items-center gap-2 rounded-full border bg-yellow-500/10 text-yellow-700 border-yellow-500/20 px-3 py-1 text-xs font-medium">
                    <Edit className="h-3 w-3" /> Draft
                  </div>
                </div>
                <LivePreviewPane
                  portfolio={portfolio}
                  activeTab={activeTab}
                  onSectionClick={setActiveTab}
                />
              </div>
            </Panel>
          </>
        )}

        {/* Normal Preview (no compare) */}
        {!compareMode && showLivePreview && portfolio && (
          <>
            <PanelResizeHandle className="w-1 bg-border hover:bg-primary/50 transition-colors" />
            <Panel defaultSize={50} minSize={30}>
              <LivePreviewPane
                portfolio={portfolio}
                onSectionClick={(section) => setActiveTab(section)}
                activeTab={activeTab}
              />
            </Panel>
          </>
        )}
      </PanelGroup>

      {/* Mobile sticky bottom navigation */}
      {isMobile && portfolio && (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-card/95 backdrop-blur-lg px-4 py-3 shadow-elev md:hidden">
          <div className="flex items-center justify-between gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPreview(true)}
              className="flex-1"
            >
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </Button>
            <Button
              size="sm"
              onClick={() => publishMutation.mutate()}
              disabled={publishMutation.isPending}
              className="flex-1"
            >
              {publishMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}
              Publish
            </Button>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && portfolio && (
        <PreviewModal
          portfolio={portfolio}
          onClose={() => setShowPreview(false)}
        />
      )}
      </div>
    </div>
  );
}

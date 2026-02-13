import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ScrollArrows() {
  const [scrollState, setScrollState] = useState<"top" | "scrolled">("top");

  useEffect(() => {
    const handleScroll = () => {
      setScrollState(window.scrollY < 100 ? "top" : "scrolled");
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToExperience = () => {
    document.getElementById("experience")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        variant="outline"
        size="icon"
        className={`h-12 w-12 rounded-full bg-card/80 shadow-elev backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:shadow-elev-sm ${
          scrollState === "top" ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={scrollToExperience}
        aria-label="Scroll to experience"
        data-testid="button-scroll-down"
      >
        <ChevronDown className="h-5 w-5" aria-hidden="true" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className={`absolute inset-0 h-12 w-12 rounded-full bg-card/80 shadow-elev backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:shadow-elev-sm ${
          scrollState === "scrolled" ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={scrollToTop}
        aria-label="Scroll to top"
        data-testid="button-scroll-up"
      >
        <ChevronUp className="h-5 w-5" aria-hidden="true" />
      </Button>
    </div>
  );
}

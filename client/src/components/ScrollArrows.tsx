import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ScrollArrows() {
  const [showUpArrow, setShowUpArrow] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if we're on mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    // Show up arrow after scrolling >300px
    const handleScroll = () => {
      setShowUpArrow(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollDown = () => {
    window.scrollBy({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  const scrollUp = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Only show on mobile
  if (!isMobile) return null;

  return (
    <>
      {/* Down arrow - always visible on mobile */}
      <Button
        variant="outline"
        size="icon"
        className="fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full bg-card/80 shadow-elev backdrop-blur transition-opacity hover:-translate-y-0.5 hover:shadow-elev-sm"
        onClick={scrollDown}
        aria-label="Scroll down"
        data-testid="button-scroll-down"
      >
        <ChevronDown className="h-5 w-5" aria-hidden="true" />
      </Button>

      {/* Up arrow - shows after scrolling >300px */}
      {showUpArrow && (
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-24 right-6 z-50 h-12 w-12 rounded-full bg-card/80 shadow-elev backdrop-blur transition-all hover:-translate-y-0.5 hover:shadow-elev-sm"
          onClick={scrollUp}
          aria-label="Scroll to top"
          data-testid="button-scroll-up"
        >
          <ChevronUp className="h-5 w-5" aria-hidden="true" />
        </Button>
      )}
    </>
  );
}

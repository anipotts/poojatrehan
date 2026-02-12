import { useEffect, useRef } from "react";

/**
 * Easter egg hook that listens for a specific keyboard sequence
 * and triggers a callback when the sequence is matched.
 *
 * @param sequence - The sequence of keys to listen for (e.g., "REDACTED")
 * @param onMatch - Callback function to execute when the sequence is matched
 */
export function useEasterEgg(sequence: string, onMatch: () => void) {
  const inputRef = useRef<string>("");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Ignore if typing in an input field
      const target = event.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      // Only track letter keys
      if (event.key.length === 1 && event.key.match(/[a-z]/i)) {
        // Clear existing timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        // Add the key to the input buffer
        inputRef.current += event.key.toLowerCase();

        // Keep only the last N characters (length of sequence)
        if (inputRef.current.length > sequence.length) {
          inputRef.current = inputRef.current.slice(-sequence.length);
        }

        // Check if the sequence matches
        if (inputRef.current === sequence.toLowerCase()) {
          inputRef.current = ""; // Reset
          onMatch();
        }

        // Clear the input buffer after 2 seconds of inactivity
        timeoutRef.current = setTimeout(() => {
          inputRef.current = "";
        }, 2000);
      }
    };

    window.addEventListener("keypress", handleKeyPress);

    return () => {
      window.removeEventListener("keypress", handleKeyPress);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [sequence, onMatch]);
}

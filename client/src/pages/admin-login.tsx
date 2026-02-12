import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Loader2, Check } from "lucide-react";
import { authApi } from "@/lib/api";
import { useDebounce } from "@/hooks/use-debounce";

export default function AdminLogin() {
  const [magicWord, setMagicWord] = useState("");
  const [status, setStatus] = useState<'idle' | 'validating' | 'success' | 'error'>('idle');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [, setLocation] = useLocation();
  const hasAttemptedRef = useRef(false);

  // Preload sound on mount
  useEffect(() => {
    audioRef.current = new Audio('/sounds/success-ding.mp3');
    audioRef.current.load();
  }, []);

  // Debounce magic word input (800ms)
  const debouncedWord = useDebounce(magicWord, 800);

  // Auto-submit when debounced word is ready
  useEffect(() => {
    if (debouncedWord.length >= 3 && !hasAttemptedRef.current) {
      hasAttemptedRef.current = true;
      setStatus('validating');
      loginMutation.mutate(debouncedWord);
    }
  }, [debouncedWord]);

  // Reset attempt ref when user types again
  useEffect(() => {
    if (magicWord !== debouncedWord) {
      hasAttemptedRef.current = false;
    }
  }, [magicWord, debouncedWord]);

  const playSuccessSound = () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (audioRef.current && !prefersReducedMotion) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(err => {
        console.log('Audio playback failed (may be blocked):', err);
      });
    }
  };

  const loginMutation = useMutation({
    mutationFn: authApi.magicLogin,
    onSuccess: () => {
      setStatus('success');
      playSuccessSound();
      // Wait for animation + sound, then navigate
      setTimeout(() => setLocation('/admin/dashboard'), 1200);
    },
    onError: () => {
      setStatus('error');
      // Clear error and allow new attempt after 2 seconds
      setTimeout(() => {
        setStatus('idle');
        hasAttemptedRef.current = false;
      }, 2000);
    },
  });

  return (
    <div className="surface flex min-h-dvh items-center justify-center p-5">
      <div
        className="w-full max-w-md"
        style={{
          animation: 'magic-grow 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards'
        }}
      >
        <div className="text-center">
          <h1 className="font-serif text-3xl font-semibold mb-8">
            What's the magic word?
          </h1>

          <input
            type="text"
            value={magicWord}
            onChange={(e) => setMagicWord(e.target.value)}
            className="w-full text-center text-xl bg-transparent border-0 border-b-2 border-border focus:border-primary rounded-none focus:ring-0 outline-none transition-colors px-4 py-3"
            autoFocus
            disabled={status === 'validating' || status === 'success'}
            placeholder="..."
          />

          {status === 'error' && (
            <p className="mt-4 text-destructive animate-in">
              Sorry, you're not allowed
            </p>
          )}

          {status === 'validating' && (
            <div className="mt-6 flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          )}

          {status === 'success' && (
            <div className="mt-6 flex justify-center">
              <div className="relative h-6 w-6">
                <Loader2 className="h-6 w-6 animate-spin text-primary absolute inset-0" />
                <Check
                  className="h-6 w-6 text-green-500 absolute inset-0"
                  style={{
                    animation: 'success-checkmark 0.4s cubic-bezier(0.22, 1, 0.36, 1) 0.3s forwards',
                    opacity: 0
                  }}
                />
              </div>
            </div>
          )}

          {status === 'idle' && (
            <p className="mt-6 text-sm text-muted-foreground">
              Type and it'll check automatically
            </p>
          )}
        </div>

        <div className="mt-8 text-center">
          <a
            href="/"
            className="text-sm text-muted-foreground transition hover:text-foreground"
          >
            ← Back to portfolio
          </a>
        </div>
      </div>
    </div>
  );
}

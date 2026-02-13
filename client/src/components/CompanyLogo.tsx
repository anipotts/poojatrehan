import { useState } from "react";

interface CompanyLogoProps {
  logoUrl?: string | null;
  companyName: string;
  size?: "sm" | "md";
}

export function CompanyLogo({ logoUrl, companyName, size = "md" }: CompanyLogoProps) {
  const [imgError, setImgError] = useState(false);
  const sizeClasses = size === "sm" ? "h-10 w-10" : "h-12 w-12";
  const textSize = size === "sm" ? "text-sm" : "text-base";
  const initial = companyName.charAt(0).toUpperCase();

  if (logoUrl && !imgError) {
    return (
      <img
        src={logoUrl}
        alt={`${companyName} logo`}
        className={`${sizeClasses} shrink-0 rounded-lg object-cover`}
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses} shrink-0 flex items-center justify-center rounded-lg bg-muted text-muted-foreground font-semibold ${textSize}`}
      aria-hidden="true"
    >
      {initial}
    </div>
  );
}

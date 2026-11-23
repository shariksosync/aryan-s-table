import { useEffect, useState } from "react";

// Image with graceful fallback when the source is missing or broken.
export function SafeImage({ src, alt, className = "", imgClassName = "", loading = "lazy", label }) {
  const [failed, setFailed] = useState(!src);
  useEffect(() => setFailed(!src), [src]);
  if (failed) {
    return (
      <div className={`flex items-center justify-center bg-forest pattern-dots ${className}`} role="img" aria-label={alt}>
        <span className="font-display text-3xl text-accent">{(label || alt || "A").trim().charAt(0)}</span>
      </div>
    );
  }
  return (
    <div className={`overflow-hidden ${className}`}>
      <img src={src} alt={alt} loading={loading} onError={() => setFailed(true)} className={`h-full w-full object-cover ${imgClassName}`} />
    </div>
  );
}

import { useApp } from "../context/AppContext";
import { AppLink } from "./Link";

// CSS text logo; shows an uploaded logo image when admin sets one.
export function Logo({ light = false, compact = false }) {
  const { settings } = useApp();
  const w = settings.website;
  const short = (w.shortName || w.name || "A").replace(/'s$/i, "");
  return (
    <AppLink to="/" className="group flex min-w-0 items-center gap-3" aria-label={`${w.name} — home`}>
      {w.logoImage ? (
        <img src={w.logoImage} alt="" className="h-11 w-11 shrink-0 rounded-xl object-contain" />
      ) : (
        <span className="logo-mark shrink-0">{short.charAt(0)}</span>
      )}
      <span className="flex min-w-0 flex-col leading-none">
        <span className={`truncate font-display text-xl font-semibold tracking-tight sm:text-[1.4rem] ${light ? "text-on-dark" : "text-primary"}`}>
          {w.shortName || w.name}
        </span>
        {!compact ? (
          <span className={`mt-1 truncate text-[0.62rem] font-bold uppercase tracking-[0.2em] ${light ? "text-accent" : "text-secondary"}`}>Family Restaurant &amp; Bar</span>
        ) : null}
      </span>
    </AppLink>
  );
}

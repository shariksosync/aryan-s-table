import { useApp } from "../context/AppContext";
import { AppLink } from "./Link";
import { Icon } from "./Icons";
import { Logo } from "./Logo";
import { NAV_ITEMS } from "./Navbar";

const SOCIALS = [
  ["instagram", "Instagram"],
  ["facebook", "Facebook"],
  ["youtube", "YouTube"],
  ["whatsapp", "WhatsApp"],
];

export function Footer() {
  const { settings, activeCategories } = useApp();
  const w = settings.website;
  const socials = SOCIALS.filter(([k]) => w.social?.[k]);
  return (
    <footer className="relative mt-auto overflow-hidden bg-primary-deep text-on-dark-muted">
      <div className="absolute inset-0 pattern-dots opacity-40" aria-hidden="true" />
      <div className="container-x relative grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.4fr]">
        <div>
          <Logo light />
          <p className="mt-5 max-w-xs text-sm leading-relaxed">{w.footerText}</p>
          {socials.length ? (
            <div className="mt-5 flex gap-2">
              {socials.map(([k, label]) => (
                <a key={k} href={w.social[k]} target="_blank" rel="noopener noreferrer" aria-label={label} className="flex h-10 w-10 items-center justify-center rounded-full border border-on-dark/20 text-on-dark transition-colors hover:border-accent hover:bg-accent hover:text-accent-foreground">
                  <Icon name={k} className="h-[1.1rem] w-[1.1rem]" />
                </a>
              ))}
            </div>
          ) : null}
        </div>
        <div>
          <h3 className="font-display text-lg text-on-dark">Quick Links</h3>
          <div className="gold-rule mt-2" />
          <ul className="mt-4 space-y-2 text-sm">
            {NAV_ITEMS.map((n) => (
              <li key={n.to}><AppLink to={n.to} className="hover:text-accent">{n.label}</AppLink></li>
            ))}
            <li><a href={w.farmHouseUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-accent">Farm House <Icon name="external" className="h-3 w-3" /></a></li>
            <li><AppLink to="/account" className="hover:text-accent">My Account</AppLink></li>
          </ul>
        </div>
        <div>
          <h3 className="font-display text-lg text-on-dark">Our Menu</h3>
          <div className="gold-rule mt-2" />
          <ul className="mt-4 space-y-2 text-sm">
            {activeCategories.map((c) => (
              <li key={c.id}><AppLink to={`/menu?category=${c.id}`} className="hover:text-accent">{c.name}</AppLink></li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-display text-lg text-on-dark">Visit &amp; Contact</h3>
          <div className="gold-rule mt-2" />
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex gap-3"><Icon name="pin" className="mt-0.5 h-4 w-4 shrink-0 text-accent" /><span>{w.address}</span></li>
            <li className="flex gap-3"><Icon name="phone" className="h-4 w-4 shrink-0 text-accent" /><a href={`tel:${w.phone.replace(/\s/g, "")}`} className="hover:text-accent">{w.phone}</a></li>
            <li className="flex gap-3"><Icon name="mail" className="h-4 w-4 shrink-0 text-accent" /><a href={`mailto:${w.email}`} className="break-all hover:text-accent">{w.email}</a></li>
          </ul>
        </div>
      </div>
      <div className="relative border-t border-on-dark/10">
        <div className="container-x flex flex-col items-center justify-between gap-3 py-5 text-xs sm:flex-row">
          <p>© {new Date().getFullYear()} {w.copyright}</p>
          <AppLink to="/admin/login" className="inline-flex items-center gap-1.5 rounded-full border border-on-dark/20 px-3 py-1.5 font-semibold text-on-dark hover:border-accent hover:text-accent">
            <Icon name="lock" className="h-3.5 w-3.5" /> Admin Login
          </AppLink>
        </div>
      </div>
    </footer>
  );
}

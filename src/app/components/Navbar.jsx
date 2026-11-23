import { useEffect, useMemo, useRef, useState } from "react";
import { useApp } from "../context/AppContext";
import { useNavigate, usePathname } from "../utils/routing";
import { inr } from "../utils/format";
import { unitPrice } from "../utils/calculations";
import { AppLink } from "./Link";
import { Icon } from "./Icons";
import { Logo } from "./Logo";

export const NAV_ITEMS = [
  { label: "Home", to: "/" },
  { label: "Menu", to: "/menu" },
  { label: "About Us", to: "/about" },
  { label: "Offers", to: "/offers" },
  { label: "Gallery", to: "/gallery" },
  { label: "Contact Us", to: "/contact" },
];

function isActive(pathname, to) {
  if (to === "/") return pathname === "/";
  if (to === "/menu") return pathname.startsWith("/menu") || pathname.startsWith("/product");
  return pathname.startsWith(to);
}

function SearchBox({ onDone, autoFocus = false }) {
  const { visibleProducts } = useApp();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const results = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return [];
    return visibleProducts.filter((p) => p.name.toLowerCase().includes(t) || p.description.toLowerCase().includes(t)).slice(0, 5);
  }, [q, visibleProducts]);
  const submit = (e) => {
    e.preventDefault();
    navigate(q.trim() ? `/menu?q=${encodeURIComponent(q.trim())}` : "/menu");
    setOpen(false);
    onDone?.();
  };
  return (
    <form onSubmit={submit} className="relative w-full" role="search">
      <label htmlFor={autoFocus ? "search-mobile" : "search-desktop"} className="sr-only">Search dishes</label>
      <Icon name="search" className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        id={autoFocus ? "search-mobile" : "search-desktop"}
        autoFocus={autoFocus}
        value={q}
        onChange={(e) => { setQ(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder="Search biryani, surmai…"
        className="input rounded-full !py-2 pl-10 text-sm"
        autoComplete="off"
      />
      {open && results.length > 0 ? (
        <ul className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-lift)]">
          {results.map((p) => (
            <li key={p.id}>
              <AppLink to={`/product/${p.id}`} onClick={() => { setOpen(false); setQ(""); onDone?.(); }} className="flex items-center gap-3 px-3 py-2 hover:bg-cream">
                <img src={p.image} alt="" className="h-10 w-10 rounded-lg object-cover" />
                <span className="flex-1 truncate text-sm font-semibold">{p.name}</span>
                <span className="text-sm font-bold text-primary">{inr(unitPrice(p))}</span>
              </AppLink>
            </li>
          ))}
          <li>
            <button type="submit" className="w-full bg-cream px-3 py-2 text-left text-xs font-bold text-secondary hover:bg-muted">See all results for “{q}”</button>
          </li>
        </ul>
      ) : null}
    </form>
  );
}

export function Navbar() {
  const { settings, totals, setCartOpen, currentCustomer, hydrated } = useApp();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const farmUrl = settings.website.farmHouseUrl || "https://example.com/farm-house";
  const announcement = settings.homepage.announcement;
  const headerRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => { setMobileOpen(false); setSearchOpen(false); }, [pathname]);

  const count = hydrated ? totals.itemCount : 0;

  return (
    <>
      {announcement ? (
        <div className="bg-secondary text-secondary-foreground">
          <p className="container-x truncate py-2 text-center text-xs font-semibold tracking-wide">
            <Icon name="truck" className="mr-2 inline h-4 w-4 align-[-3px] text-accent" />
            {announcement}
          </p>
        </div>
      ) : null}
      <header ref={headerRef} className={`sticky top-0 z-50 border-b transition-all ${scrolled ? "border-border bg-card/95 shadow-[var(--shadow-soft)] backdrop-blur" : "border-transparent bg-background/90 backdrop-blur"}`}>
        <div className="container-x flex h-[4.5rem] items-center gap-3">
          <div className="min-w-0 flex-1 xl:flex-none"><Logo /></div>

          <nav className="mx-auto hidden items-center gap-0.5 xl:flex" aria-label="Main">
            {NAV_ITEMS.map((item) => {
              const active = isActive(pathname, item.to);
              return (
                <AppLink key={item.to} to={item.to} aria-current={active ? "page" : undefined} className={`relative rounded-full px-3 py-2 text-sm font-bold transition-colors ${active ? "text-primary" : "text-foreground/75 hover:text-primary"}`}>
                  {item.label}
                  {active ? <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-accent" /> : null}
                </AppLink>
              );
            })}
            <a href={farmUrl} target="_blank" rel="noopener noreferrer" className="ml-1 inline-flex items-center gap-1 rounded-full border border-accent/60 px-3 py-1.5 text-sm font-bold text-secondary hover:bg-accent-soft">
              Farm House <Icon name="external" className="h-3.5 w-3.5" />
            </a>
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <div className="hidden w-56 lg:block 2xl:w-64"><SearchBox /></div>
            <button type="button" className="icon-btn lg:hidden" onClick={() => setSearchOpen((v) => !v)} aria-label="Search dishes" aria-expanded={searchOpen}>
              <Icon name="search" />
            </button>
            <button type="button" className="icon-btn" onClick={() => setCartOpen(true)} aria-label={`Open cart, ${count} items`}>
              <Icon name="cart" />
              {count > 0 ? <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-secondary px-1 text-[0.65rem] font-extrabold text-secondary-foreground">{count}</span> : null}
            </button>
            <AppLink to="/account" className="hidden items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:bg-primary-deep sm:inline-flex">
              <Icon name="user" className="h-4 w-4" />
              <span className="max-w-24 truncate">{hydrated && currentCustomer ? currentCustomer.name.split(" ")[0] : "Login"}</span>
            </AppLink>
            <button type="button" className="icon-btn xl:hidden" onClick={() => setMobileOpen((v) => !v)} aria-label="Open menu" aria-expanded={mobileOpen}>
              <Icon name={mobileOpen ? "x" : "menu"} />
            </button>
          </div>
        </div>

        {searchOpen ? (
          <div className="container-x pb-3 lg:hidden"><SearchBox autoFocus onDone={() => setSearchOpen(false)} /></div>
        ) : null}

        {mobileOpen ? (
          <nav className="animate-fade-up border-t border-border bg-card xl:hidden" aria-label="Mobile">
            <div className="container-x flex flex-col py-3">
              {NAV_ITEMS.map((item) => {
                const active = isActive(pathname, item.to);
                return (
                  <AppLink key={item.to} to={item.to} className={`flex items-center justify-between rounded-xl px-3 py-3 text-base font-bold ${active ? "bg-accent-soft text-primary" : "text-foreground hover:bg-muted"}`}>
                    {item.label}
                    <Icon name="chevronRight" className="h-4 w-4 opacity-50" />
                  </AppLink>
                );
              })}
              <a href={farmUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between rounded-xl px-3 py-3 text-base font-bold text-secondary hover:bg-muted">
                Farm House <Icon name="external" className="h-4 w-4" />
              </a>
              <AppLink to="/account" className="btn btn-primary mt-3 sm:hidden">
                <Icon name="user" className="h-4 w-4" /> {hydrated && currentCustomer ? "My Account" : "Login / Register"}
              </AppLink>
            </div>
          </nav>
        ) : null}
      </header>
    </>
  );
}

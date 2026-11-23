import { useEffect, useMemo, useState } from "react";
import { useApp } from "../context/AppContext";
import { ProductCard } from "../components/ProductCard";
import { Icon } from "../components/Icons";
import { EmptyState } from "../components/ui";
import { useNavigate, useSearchParams } from "../utils/routing";
import { unitPrice } from "../utils/calculations";
import { inr } from "../utils/format";

const SORTS = [
  ["popularity", "Popularity"],
  ["price-asc", "Price: Low to High"],
  ["price-desc", "Price: High to Low"],
  ["name", "Name (A–Z)"],
];

export default function Menu() {
  const { visibleProducts, activeCategories } = useApp();
  const search = useSearchParams();
  const navigate = useNavigate();
  const urlCategory = typeof search.category === "string" ? search.category : "all";
  const urlQ = search.q != null ? String(search.q) : "";

  const maxPossible = useMemo(() => Math.max(100, ...visibleProducts.map((p) => unitPrice(p))), [visibleProducts]);
  const [q, setQ] = useState(urlQ);
  const [type, setType] = useState("all");
  const [sort, setSort] = useState("popularity");
  const [maxPrice, setMaxPrice] = useState(null);
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  useEffect(() => setQ(urlQ), [urlQ]);

  const category = activeCategories.some((c) => c.id === urlCategory) ? urlCategory : "all";
  const priceCap = maxPrice ?? maxPossible;

  const setCategory = (id) => {
    const params = new URLSearchParams();
    if (id !== "all") params.set("category", id);
    if (q.trim()) params.set("q", q.trim());
    const qs = params.toString();
    navigate(`/menu${qs ? `?${qs}` : ""}`, { replace: true });
  };

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    let list = visibleProducts.filter((p) => {
      if (category !== "all" && p.category !== category) return false;
      if (type !== "all" && p.type !== type) return false;
      if (onlyAvailable && !p.available) return false;
      if (unitPrice(p) > priceCap) return false;
      if (term && !(`${p.name} ${p.description}`.toLowerCase().includes(term))) return false;
      return true;
    });
    list = [...list].sort((a, b) => {
      if (sort === "price-asc") return unitPrice(a) - unitPrice(b);
      if (sort === "price-desc") return unitPrice(b) - unitPrice(a);
      if (sort === "name") return a.name.localeCompare(b.name);
      return (Number(b.popularity) || 0) - (Number(a.popularity) || 0);
    });
    return list;
  }, [visibleProducts, category, type, onlyAvailable, priceCap, q, sort]);

  const filtersActive = category !== "all" || type !== "all" || onlyAvailable || maxPrice !== null || q.trim() !== "" || sort !== "popularity";
  const clearAll = () => {
    setQ(""); setType("all"); setSort("popularity"); setMaxPrice(null); setOnlyAvailable(false);
    navigate("/menu", { replace: true });
  };
  const activeCat = activeCategories.find((c) => c.id === category);

  return (
    <div>
      <section className="relative overflow-hidden bg-forest">
        <div className="absolute inset-0 pattern-dots opacity-30" aria-hidden="true" />
        <div className="container-x relative py-12 sm:py-14">
          <p className="eyebrow eyebrow-gold ornament">Order online</p>
          <h1 className="mt-3 text-4xl font-semibold text-on-dark sm:text-5xl">{activeCat ? activeCat.name : "Our Menu"}</h1>
          <p className="mt-3 max-w-2xl text-on-dark-muted">{activeCat ? activeCat.description : "Konkan seafood, dum biryanis, Maharashtrian Kala Masala, tandoor grills and more — freshly prepared and delivered free."}</p>
        </div>
      </section>

      <div className="sticky top-[4.5rem] z-30 border-b border-border bg-background/95 backdrop-blur">
        <div className="container-x no-scrollbar flex gap-2 overflow-x-auto py-3" role="tablist" aria-label="Categories">
          <button type="button" role="tab" aria-selected={category === "all"} onClick={() => setCategory("all")} className={`chip ${category === "all" ? "chip-active" : ""}`}>All dishes</button>
          {activeCategories.map((c) => (
            <button key={c.id} type="button" role="tab" aria-selected={category === c.id} onClick={() => setCategory(c.id)} className={`chip ${category === c.id ? "chip-active" : ""}`}>{c.name}</button>
          ))}
        </div>
      </div>

      <div className="container-x grid gap-8 py-8 lg:grid-cols-[17rem_1fr]">
        <aside className={`${showFilters ? "block" : "hidden"} lg:block`} aria-label="Filters">
          <div className="card space-y-6 p-5 lg:sticky lg:top-40">
            <div>
              <label htmlFor="menu-search" className="label">Search dishes</label>
              <div className="relative">
                <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input id="menu-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="e.g. biryani" className="input pl-9" />
              </div>
            </div>
            <div>
              <p className="label">Food type</p>
              <div className="grid grid-cols-3 gap-1 rounded-full bg-muted p-1">
                {[["all", "All"], ["veg", "Veg"], ["nonveg", "Non-Veg"]].map(([v, l]) => (
                  <button key={v} type="button" onClick={() => setType(v)} aria-pressed={type === v} className={`rounded-full px-2 py-1.5 text-xs font-bold transition-colors ${type === v ? (v === "veg" ? "bg-success text-on-dark" : v === "nonveg" ? "bg-sale text-on-dark" : "bg-primary text-primary-foreground") : "text-foreground/70 hover:text-foreground"}`}>{l}</button>
                ))}
              </div>
            </div>
            <div>
              <label htmlFor="menu-sort" className="label">Sort by</label>
              <select id="menu-sort" value={sort} onChange={(e) => setSort(e.target.value)} className="input">
                {SORTS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="menu-price" className="label">Max price</label>
                <span className="text-sm font-extrabold text-primary">{inr(priceCap)}</span>
              </div>
              <input id="menu-price" type="range" min={0} max={maxPossible} step={10} value={priceCap} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full accent-[var(--primary)]" />
              <div className="flex justify-between text-xs text-muted-foreground"><span>₹0</span><span>{inr(maxPossible)}</span></div>
            </div>
            <label className="flex cursor-pointer items-center justify-between gap-3 text-sm font-bold">
              Available for delivery only
              <input type="checkbox" checked={onlyAvailable} onChange={(e) => setOnlyAvailable(e.target.checked)} className="h-4 w-4 accent-[var(--primary)]" />
            </label>
            <button type="button" onClick={clearAll} disabled={!filtersActive} className="btn btn-outline w-full">Clear all filters</button>
          </div>
        </aside>

        <div>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground"><span className="font-extrabold text-foreground">{results.length}</span> dish{results.length === 1 ? "" : "es"} found{q.trim() ? <> for “<span className="font-bold text-foreground">{q.trim()}</span>”</> : null}</p>
            <button type="button" onClick={() => setShowFilters((v) => !v)} className="btn btn-outline btn-sm lg:hidden" aria-expanded={showFilters}>
              <Icon name="filter" className="h-4 w-4" /> {showFilters ? "Hide filters" : "Filters & sort"}
            </button>
          </div>
          {results.length === 0 ? (
            <EmptyState icon="search" title="No dishes match your filters" text="Try a different search term, category or price range." action={<button type="button" onClick={clearAll} className="btn btn-primary">Clear all filters</button>} />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

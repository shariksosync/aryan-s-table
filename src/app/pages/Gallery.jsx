import { useCallback, useEffect, useMemo, useState } from "react";
import { useApp } from "../context/AppContext";
import { Icon } from "../components/Icons";
import { EmptyState, PageHero } from "../components/ui";
import { GALLERY_CATEGORIES } from "../data/mockContent";
import { IMG } from "../data/images";

export default function Gallery() {
  const { gallery } = useApp();
  const items = useMemo(() => gallery.filter((g) => g.active).sort((a, b) => a.order - b.order), [gallery]);
  const cats = GALLERY_CATEGORIES.filter((c) => items.some((i) => i.category === c));
  const [filter, setFilter] = useState("All");
  const [index, setIndex] = useState(null);
  const shown = filter === "All" ? items : items.filter((i) => i.category === filter);

  const close = useCallback(() => setIndex(null), []);
  const step = useCallback((d) => setIndex((i) => (i === null ? i : (i + d + shown.length) % shown.length)), [shown.length]);
  useEffect(() => {
    if (index === null) return;
    const onKey = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [index, close, step]);
  const current = index !== null ? shown[index] : null;

  return (
    <div>
      <PageHero eyebrow="Gallery" title="A look inside Aryan's" sub="Food, seating, celebrations and the warm glow of our dining rooms." image={IMG.familySeating} />
      <section className="container-x py-12">
        <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-2">
          {["All", ...cats].map((c) => (
            <button key={c} type="button" onClick={() => setFilter(c)} aria-pressed={filter === c} className={`chip ${filter === c ? "chip-active" : ""}`}>{c}</button>
          ))}
        </div>
        {shown.length === 0 ? (
          <div className="mt-8"><EmptyState icon="image" title="No photos yet" text="Gallery images added by the restaurant will appear here." /></div>
        ) : (
          <div className="mt-8 columns-1 gap-4 sm:columns-2 lg:columns-3">
            {shown.map((g, i) => (
              <button key={g.id} type="button" onClick={() => setIndex(i)} className="group relative mb-4 block w-full overflow-hidden rounded-3xl text-left shadow-[var(--shadow-soft)] break-inside-avoid" aria-label={`Open ${g.title}`}>
                <img src={g.image} alt={g.title} loading="lazy" className={`w-full object-cover transition-transform duration-700 group-hover:scale-105 ${i % 3 === 0 ? "aspect-[4/5]" : i % 3 === 1 ? "aspect-square" : "aspect-[4/3]"}`} onError={(e) => { e.currentTarget.style.visibility = "hidden"; }} />
                <div className="absolute inset-0 card-fade opacity-80 transition-opacity group-hover:opacity-100" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <span className="badge badge-gold">{g.category}</span>
                  <p className="mt-2 font-display text-lg font-semibold text-on-dark">{g.title}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>
      {current ? (
        <div className="fixed inset-0 z-[95] flex items-center justify-center bg-primary-deep/95 p-4" role="dialog" aria-modal="true" aria-label={current.title} onMouseDown={(e) => e.target === e.currentTarget && close()}>
          <button type="button" onClick={close} className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-on-dark/10 text-on-dark hover:bg-on-dark/20" aria-label="Close preview"><Icon name="x" /></button>
          <button type="button" onClick={() => step(-1)} className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-on-dark/10 text-on-dark hover:bg-on-dark/20 sm:left-6" aria-label="Previous image"><Icon name="chevronLeft" /></button>
          <button type="button" onClick={() => step(1)} className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-on-dark/10 text-on-dark hover:bg-on-dark/20 sm:right-6" aria-label="Next image"><Icon name="chevronRight" /></button>
          <figure className="animate-fade-up max-w-5xl text-center">
            <img src={current.image} alt={current.title} className="mx-auto max-h-[76vh] rounded-2xl object-contain" />
            <figcaption className="mt-4">
              <p className="font-display text-2xl text-on-dark">{current.title}</p>
              {current.description ? <p className="mt-1 text-sm text-on-dark-muted">{current.description}</p> : null}
              <p className="mt-1 text-xs text-accent">{index + 1} / {shown.length}</p>
            </figcaption>
          </figure>
        </div>
      ) : null}
    </div>
  );
}

import { Icon } from "./Icons";

export function VegMark({ type, withLabel = false }) {
  const veg = type === "veg";
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-bold ${veg ? "text-veg" : "text-nonveg"}`} title={veg ? "Vegetarian" : "Non-vegetarian"}>
      <span className={`veg-mark ${veg ? "" : "nonveg-mark"}`} aria-hidden="true" />
      {withLabel ? (veg ? "Veg" : "Non-Veg") : <span className="sr-only">{veg ? "Vegetarian" : "Non-vegetarian"}</span>}
    </span>
  );
}

export function QtyStepper({ qty, onChange, size = "md", label = "item" }) {
  const s = size === "sm" ? "h-8 w-8" : "h-10 w-10";
  return (
    <div className="inline-flex items-center rounded-full border-[1.5px] border-primary bg-card">
      <button type="button" className={`${s} flex items-center justify-center rounded-full text-primary hover:bg-muted`} onClick={() => onChange(qty - 1)} aria-label={`Decrease ${label} quantity`}>
        <Icon name="minus" className="h-4 w-4" strokeWidth={2.4} />
      </button>
      <span className="min-w-7 text-center text-sm font-extrabold text-primary" aria-live="polite">{qty}</span>
      <button type="button" className={`${s} flex items-center justify-center rounded-full text-primary hover:bg-muted`} onClick={() => onChange(qty + 1)} aria-label={`Increase ${label} quantity`}>
        <Icon name="plus" className="h-4 w-4" strokeWidth={2.4} />
      </button>
    </div>
  );
}

export function SectionHeading({ eyebrow, title, sub, align = "center", light = false, action }) {
  return (
    <div className={`mb-10 flex flex-col gap-4 ${align === "center" ? "items-center text-center" : "md:flex-row md:items-end md:justify-between"}`}>
      <div className={align === "center" ? "max-w-2xl" : "max-w-2xl"}>
        {eyebrow ? <p className={`eyebrow ornament ${light ? "eyebrow-gold" : ""}`}>{eyebrow}</p> : null}
        <h2 className={`mt-3 text-3xl font-semibold leading-tight sm:text-4xl md:text-[2.6rem] ${light ? "text-on-dark" : "text-primary"}`}>{title}</h2>
        {sub ? <p className={`mt-3 text-base ${light ? "text-on-dark-muted" : "text-muted-foreground"}`}>{sub}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function Stars({ rating, className = "h-4 w-4" }) {
  return (
    <span className="inline-flex gap-0.5 text-accent" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Icon key={i} name="star" className={className} filled={i <= rating} strokeWidth={1.5} />
      ))}
    </span>
  );
}

export function PageHero({ eyebrow, title, sub, image }) {
  return (
    <section className="relative overflow-hidden bg-forest">
      {image ? <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" /> : null}
      <div className="absolute inset-0 hero-overlay" />
      <div className="container-x relative py-16 sm:py-20">
        {eyebrow ? <p className="eyebrow eyebrow-gold ornament">{eyebrow}</p> : null}
        <h1 className="mt-3 max-w-3xl text-4xl font-semibold leading-tight text-on-dark sm:text-5xl">{title}</h1>
        {sub ? <p className="mt-4 max-w-2xl text-base text-on-dark-muted sm:text-lg">{sub}</p> : null}
      </div>
    </section>
  );
}

export function Field({ label, error, children, hint, id }) {
  return (
    <div>
      {label ? <label className="label" htmlFor={id}>{label}</label> : null}
      {children}
      {hint && !error ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
      {error ? <p className="field-error" role="alert">{error}</p> : null}
    </div>
  );
}

export function EmptyState({ icon = "bag", title, text, action }) {
  return (
    <div className="flex flex-col items-center rounded-3xl border border-dashed border-border bg-card px-6 py-14 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-soft text-primary">
        <Icon name={icon} className="h-7 w-7" />
      </span>
      <h3 className="mt-4 text-xl font-semibold text-primary">{title}</h3>
      {text ? <p className="mt-2 max-w-sm text-sm text-muted-foreground">{text}</p> : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

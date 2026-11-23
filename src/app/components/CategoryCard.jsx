import { AppLink } from "./Link";
import { Icon } from "./Icons";
import { SafeImage } from "./SafeImage";

export function CategoryCard({ category, count }) {
  return (
    <AppLink to={`/menu?category=${category.id}`} className="group relative block overflow-hidden rounded-3xl shadow-[var(--shadow-soft)] focus-visible:ring-2" aria-label={`Explore ${category.name}`}>
      <SafeImage src={category.image} alt={category.name} className="aspect-[4/5] w-full" imgClassName="transition-transform duration-700 group-hover:scale-110" />
      <div className="absolute inset-0 card-fade" />
      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
        {typeof count === "number" ? <span className="badge badge-gold mb-2">{count} dishes</span> : null}
        <h3 className="text-lg font-semibold leading-tight text-on-dark sm:text-xl">{category.name}</h3>
        <p className="mt-1 line-clamp-2 text-xs text-on-dark-muted sm:text-sm">{category.description}</p>
        <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-accent">
          Explore <Icon name="arrowRight" className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </AppLink>
  );
}

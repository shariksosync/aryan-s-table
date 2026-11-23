import { useApp } from "../context/AppContext";
import { inr } from "../utils/format";
import { hasDiscount, unitPrice } from "../utils/calculations";
import { AppLink } from "./Link";
import { Icon } from "./Icons";
import { SafeImage } from "./SafeImage";
import { QtyStepper, VegMark } from "./ui";

export function ProductCard({ product }) {
  const { addToCart, setQty, cartQty, wishlist, toggleWishlist, hydrated } = useApp();
  const qty = hydrated ? cartQty(product.id) : 0;
  const wished = hydrated && wishlist.includes(product.id);
  const discounted = hasDiscount(product);
  return (
    <article className="card card-hover group flex flex-col overflow-hidden">
      <div className="relative">
        <AppLink to={`/product/${product.id}`} aria-label={`View ${product.name}`}>
          <SafeImage src={product.image} alt={product.name} className="aspect-[4/3] w-full" imgClassName="transition-transform duration-700 group-hover:scale-105" />
        </AppLink>
        <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {product.bestseller ? <span className="badge badge-gold"><Icon name="flame" className="h-3 w-3" /> Bestseller</span> : null}
          {discounted ? <span className="badge badge-sale">Save {inr(product.price - unitPrice(product))}</span> : null}
        </div>
        <button type="button" onClick={() => toggleWishlist(product.id)} aria-pressed={wished} aria-label={wished ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`} className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-card/95 shadow-[var(--shadow-soft)] transition-transform hover:scale-110 ${wished ? "text-sale" : "text-foreground"}`}>
          <Icon name="heart" className="h-[1.1rem] w-[1.1rem]" filled={wished} />
        </button>
        {!product.available ? (
          <div className="absolute inset-x-0 bottom-0 bg-primary-deep/85 py-1.5 text-center text-xs font-bold uppercase tracking-wider text-on-dark">Currently unavailable</div>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center justify-between gap-2">
          <VegMark type={product.type} withLabel />
          <span className="text-xs text-muted-foreground">{product.serves}</span>
        </div>
        <AppLink to={`/product/${product.id}`} className="mt-2">
          <h3 className="text-lg font-semibold leading-snug text-foreground transition-colors hover:text-primary">{product.name}</h3>
        </AppLink>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{product.description}</p>
        <div className="mt-auto flex items-end justify-between gap-2 pt-4">
          <div className="leading-tight">
            <span className="text-xl font-extrabold text-primary">{inr(unitPrice(product))}</span>
            {discounted ? <span className="ml-2 text-sm text-muted-foreground line-through">{inr(product.price)}</span> : null}
          </div>
          {!product.available ? (
            <span className="badge badge-muted">Unavailable</span>
          ) : qty > 0 ? (
            <QtyStepper size="sm" qty={qty} onChange={(q) => setQty(product.id, q)} label={product.name} />
          ) : (
            <button type="button" className="btn btn-primary btn-sm" onClick={() => addToCart(product.id)}>
              <Icon name="plus" className="h-4 w-4" strokeWidth={2.4} /> Add
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

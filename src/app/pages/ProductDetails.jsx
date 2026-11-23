import { useEffect, useState } from "react";
import { useApp } from "../context/AppContext";
import { AppLink } from "../components/Link";
import { Icon } from "../components/Icons";
import { ProductCard } from "../components/ProductCard";
import { SafeImage } from "../components/SafeImage";
import { QtyStepper, VegMark, EmptyState } from "../components/ui";
import { hasDiscount, unitPrice } from "../utils/calculations";
import { inr } from "../utils/format";

export default function ProductDetails({ id }) {
  const { products, categories, visibleProducts, addToCart, wishlist, toggleWishlist, hydrated, delivery, setCartOpen } = useApp();
  const product = products.find((p) => p.id === id);
  const [qty, setQty] = useState(1);
  useEffect(() => setQty(1), [id]);

  if (!product) {
    return (
      <div className="container-x py-20">
        <EmptyState icon="search" title="Dish not found" text="This dish may have been removed from the menu." action={<AppLink to="/menu" className="btn btn-primary">Back to menu</AppLink>} />
      </div>
    );
  }
  const category = categories.find((c) => c.id === product.category);
  const related = visibleProducts.filter((p) => p.category === product.category && p.id !== product.id).sort((a, b) => b.popularity - a.popularity).slice(0, 4);
  const wished = hydrated && wishlist.includes(product.id);
  const discounted = hasDiscount(product);

  return (
    <div>
      <div className="container-x pt-6">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
          <AppLink to="/" className="hover:text-primary">Home</AppLink>
          <Icon name="chevronRight" className="h-3.5 w-3.5" />
          <AppLink to="/menu" className="hover:text-primary">Menu</AppLink>
          {category ? <><Icon name="chevronRight" className="h-3.5 w-3.5" /><AppLink to={`/menu?category=${category.id}`} className="hover:text-primary">{category.name}</AppLink></> : null}
          <Icon name="chevronRight" className="h-3.5 w-3.5" />
          <span className="font-semibold text-foreground">{product.name}</span>
        </nav>
      </div>
      <section className="container-x grid gap-8 py-8 lg:grid-cols-2 lg:gap-14">
        <div className="relative">
          <SafeImage src={product.image} alt={product.name} loading="eager" className="aspect-square w-full rounded-[2rem] shadow-[var(--shadow-lift)]" />
          <div className="absolute left-4 top-4 flex flex-col gap-2">
            {product.bestseller ? <span className="badge badge-gold"><Icon name="flame" className="h-3 w-3" /> Bestseller</span> : null}
            {discounted ? <span className="badge badge-sale">Special price</span> : null}
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex flex-wrap items-center gap-3">
            <VegMark type={product.type} withLabel />
            {category ? <span className="badge badge-muted">{category.name}</span> : null}
            {product.available ? <span className="badge badge-green"><Icon name="check" className="h-3 w-3" /> Available</span> : <span className="badge badge-red">Currently unavailable</span>}
          </div>
          <h1 className="mt-4 text-4xl font-semibold leading-tight text-primary sm:text-5xl">{product.name}</h1>
          <p className="mt-4 text-base leading-relaxed text-foreground/80">{product.longDescription || product.description}</p>
          <div className="mt-6 flex items-end gap-3">
            <span className="text-4xl font-extrabold text-primary">{inr(unitPrice(product))}</span>
            {discounted ? <span className="pb-1 text-lg text-muted-foreground line-through">{inr(product.price)}</span> : null}
            {discounted ? <span className="badge badge-sale mb-2">Save {inr(product.price - unitPrice(product))}</span> : null}
          </div>
          <dl className="mt-6 grid grid-cols-3 gap-3">
            {[["users", "Serving", product.serves], ["clock", "Prep time", product.prepTime], ["truck", "Delivery", delivery.estimatedTime]].map(([icon, label, val]) => (
              <div key={label} className="rounded-2xl border border-border bg-card p-3">
                <Icon name={icon} className="h-5 w-5 text-accent" />
                <dt className="mt-2 text-[0.65rem] font-bold uppercase tracking-wider text-muted-foreground">{label}</dt>
                <dd className="text-sm font-bold">{val || "—"}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            {product.available ? (
              <>
                <QtyStepper qty={qty} onChange={(q) => setQty(Math.max(1, Math.min(50, q)))} label={product.name} />
                <button type="button" className="btn btn-primary btn-lg flex-1 sm:flex-none" onClick={() => { if (addToCart(product.id, qty, { silent: true })) { setCartOpen(true); } }}>
                  <Icon name="cart" className="h-5 w-5" /> Add to Cart · {inr(unitPrice(product) * qty)}
                </button>
              </>
            ) : (
              <p className="rounded-2xl bg-muted px-4 py-3 text-sm font-semibold text-muted-foreground">This item is not available for delivery right now.</p>
            )}
            <button type="button" onClick={() => toggleWishlist(product.id)} aria-pressed={wished} className={`btn btn-lg ${wished ? "btn-maroon" : "btn-outline"}`}>
              <Icon name="heart" className="h-5 w-5" filled={wished} /> {wished ? "Saved" : "Wishlist"}
            </button>
          </div>
        </div>
      </section>
      {related.length ? (
        <section className="container-x pb-20 pt-6">
          <h2 className="text-3xl font-semibold text-primary">You may also like</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      ) : null}
    </div>
  );
}

import { useEffect } from "react";
import { useApp } from "../context/AppContext";
import { inr } from "../utils/format";
import { AppLink } from "./Link";
import { Icon } from "./Icons";
import { QtyStepper, VegMark } from "./ui";

export function CartDrawer() {
  const { cartOpen, setCartOpen, totals, setQty, removeFromCart, delivery } = useApp();
  useEffect(() => {
    if (!cartOpen) return;
    const onKey = (e) => e.key === "Escape" && setCartOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [cartOpen, setCartOpen]);
  if (!cartOpen) return null;
  const close = () => setCartOpen(false);
  return (
    <div className="fixed inset-0 z-[80]">
      <button type="button" className="absolute inset-0 h-full w-full bg-primary-deep/50 backdrop-blur-sm" onClick={close} aria-label="Close cart" />
      <aside className="animate-slide-in-right absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-background shadow-[var(--shadow-lift)]" role="dialog" aria-label="Your cart">
        <div className="flex items-center justify-between border-b border-border bg-card px-5 py-4">
          <div>
            <h2 className="text-xl font-semibold text-primary">Your Order</h2>
            <p className="text-xs text-muted-foreground">{totals.itemCount} item{totals.itemCount === 1 ? "" : "s"}</p>
          </div>
          <button type="button" onClick={close} className="icon-btn" aria-label="Close cart"><Icon name="x" /></button>
        </div>
        {totals.lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-accent-soft text-primary"><Icon name="bag" className="h-9 w-9" /></span>
            <h3 className="mt-4 text-xl font-semibold text-primary">Your cart is empty</h3>
            <p className="mt-2 text-sm text-muted-foreground">Add a biryani, some Kala Masala or a seafood favourite to get started.</p>
            <AppLink to="/menu" onClick={close} className="btn btn-primary mt-5">Browse the menu</AppLink>
          </div>
        ) : (
          <>
            <ul className="flex-1 space-y-3 overflow-y-auto p-4">
              {totals.lines.map((l) => (
                <li key={l.product.id} className="flex gap-3 rounded-2xl border border-border bg-card p-3">
                  <img src={l.product.image} alt={l.product.name} className="h-20 w-20 shrink-0 rounded-xl object-cover" />
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5"><VegMark type={l.product.type} /><p className="truncate text-sm font-bold">{l.product.name}</p></div>
                        <p className="mt-0.5 text-xs text-muted-foreground">{inr(l.price)} each</p>
                      </div>
                      <button type="button" onClick={() => removeFromCart(l.product.id)} className="text-muted-foreground hover:text-sale" aria-label={`Remove ${l.product.name}`}><Icon name="trash" className="h-4 w-4" /></button>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <QtyStepper size="sm" qty={l.qty} onChange={(q) => setQty(l.product.id, q)} label={l.product.name} />
                      <span className="font-extrabold text-primary">{inr(l.lineTotal)}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t border-border bg-card p-5">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="font-bold">{inr(totals.subtotal)}</span></div>
                {totals.discount > 0 ? <div className="flex justify-between text-success"><span>Coupon ({totals.coupon?.code})</span><span className="font-bold">− {inr(totals.discount)}</span></div> : null}
                <div className="flex justify-between"><span className="text-muted-foreground">Delivery</span><span className="font-bold">{totals.deliveryFee === 0 ? <span className="text-success">FREE</span> : inr(totals.deliveryFee)}</span></div>
                <div className="flex justify-between border-t border-dashed border-border pt-2 text-base"><span className="font-bold">Total</span><span className="font-extrabold text-primary">{inr(totals.total)}</span></div>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Estimated delivery: {delivery.estimatedTime}</p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <AppLink to="/cart" onClick={close} className="btn btn-outline">View cart</AppLink>
                <AppLink to="/checkout" onClick={close} className="btn btn-primary">Checkout</AppLink>
              </div>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

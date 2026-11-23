import { useState } from "react";
import { useApp } from "../context/AppContext";
import { AppLink } from "../components/Link";
import { Icon } from "../components/Icons";
import { EmptyState, QtyStepper, VegMark } from "../components/ui";
import { SafeImage } from "../components/SafeImage";
import { inr } from "../utils/format";
import { localDateStr } from "../utils/calculations";

export function OrderSummary({ totals, children, title = "Order summary" }) {
  return (
    <div className="card p-5 sm:p-6">
      <h2 className="text-xl font-semibold text-primary">{title}</h2>
      <dl className="mt-4 space-y-2.5 text-sm">
        <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal ({totals.itemCount} items)</dt><dd className="font-bold">{inr(totals.subtotal)}</dd></div>
        <div className="flex justify-between"><dt className="text-muted-foreground">Discount{totals.discount > 0 && totals.coupon ? ` (${totals.coupon.code})` : ""}</dt><dd className={`font-bold ${totals.discount > 0 ? "text-success" : ""}`}>{totals.discount > 0 ? `− ${inr(totals.discount)}` : inr(0)}</dd></div>
        <div className="flex justify-between"><dt className="text-muted-foreground">Delivery fee</dt><dd className="font-bold">{totals.deliveryFee === 0 ? <span className="text-success">FREE</span> : inr(totals.deliveryFee)}</dd></div>
        <div className="flex justify-between border-t border-dashed border-border pt-3 text-lg"><dt className="font-bold">Grand total</dt><dd className="font-extrabold text-primary">{inr(totals.total)}</dd></div>
      </dl>
      {children}
    </div>
  );
}

export function CouponBox() {
  const { appliedCoupon, applyCoupon, removeCoupon, totals, coupons } = useApp();
  const [code, setCode] = useState("");
  const today = localDateStr();
  const available = coupons.filter((c) => c.active && (!c.validTo || c.validTo >= today) && (!c.validFrom || c.validFrom <= today));
  return (
    <div className="mt-5 rounded-2xl border border-dashed border-accent bg-accent-soft/40 p-4">
      <p className="flex items-center gap-2 text-sm font-bold text-primary"><Icon name="tag" className="h-4 w-4" /> Apply coupon</p>
      {appliedCoupon ? (
        <div className="mt-3">
          <div className="flex items-center justify-between gap-2 rounded-xl bg-card px-3 py-2">
            <span className="text-sm font-extrabold tracking-widest text-primary">{appliedCoupon}</span>
            <button type="button" onClick={removeCoupon} className="text-xs font-bold text-sale hover:underline">Remove</button>
          </div>
          {totals.couponResult && !totals.couponResult.ok ? <p className="field-error">{totals.couponResult.reason}</p> : <p className="mt-1.5 text-xs font-semibold text-success">You save {inr(totals.discount)} on this order.</p>}
        </div>
      ) : (
        <form className="mt-3 flex gap-2" onSubmit={(e) => { e.preventDefault(); if (code.trim()) { const r = applyCoupon(code); if (r.ok) setCode(""); } }}>
          <label htmlFor="coupon" className="sr-only">Coupon code</label>
          <input id="coupon" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="Enter code" className="input !py-2 uppercase tracking-widest" />
          <button type="submit" className="btn btn-primary btn-sm" disabled={!code.trim()}>Apply</button>
        </form>
      )}
      {!appliedCoupon && available.length ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {available.map((c) => (
            <button key={c.id} type="button" onClick={() => applyCoupon(c.code)} className="rounded-full border border-accent bg-card px-3 py-1 text-xs font-bold text-secondary hover:bg-accent-soft" title={c.description}>
              {c.code}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default function Cart() {
  const { totals, setQty, removeFromCart, clearCart, confirm, delivery, hydrated } = useApp();
  if (!hydrated) return <div className="container-x py-24 text-center text-muted-foreground">Loading your cart…</div>;
  return (
    <div className="container-x py-10 sm:py-14">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow">Your order</p>
          <h1 className="mt-2 text-4xl font-semibold text-primary">Shopping Cart</h1>
        </div>
        {totals.lines.length ? (
          <button type="button" className="btn btn-ghost text-sale" onClick={async () => { if (await confirm({ title: "Clear your cart?", message: "All items and any applied coupon will be removed.", confirmText: "Clear cart" })) clearCart(); }}>
            <Icon name="trash" className="h-4 w-4" /> Clear cart
          </button>
        ) : null}
      </div>
      {totals.lines.length === 0 ? (
        <div className="mt-8">
          <EmptyState title="Your cart is empty" text="Looks like you haven't added anything yet. Our biryanis and Konkan seafood are waiting!" action={<AppLink to="/menu" className="btn btn-primary">Browse the menu</AppLink>} />
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_24rem]">
          <div>
            <ul className="space-y-3">
              {totals.lines.map((l) => (
                <li key={l.product.id} className="card flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                  <AppLink to={`/product/${l.product.id}`} className="shrink-0"><SafeImage src={l.product.image} alt={l.product.name} className="h-24 w-full rounded-2xl sm:w-24" /></AppLink>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2"><VegMark type={l.product.type} /><AppLink to={`/product/${l.product.id}`} className="truncate text-lg font-semibold hover:text-primary">{l.product.name}</AppLink></div>
                    <p className="text-sm text-muted-foreground">{inr(l.price)} each · {l.product.serves}</p>
                    {!l.product.available ? <p className="field-error">This item is now unavailable — please remove it.</p> : null}
                  </div>
                  <div className="flex items-center justify-between gap-4 sm:justify-end">
                    <QtyStepper qty={l.qty} onChange={(q) => setQty(l.product.id, q)} label={l.product.name} />
                    <span className="w-20 text-right text-lg font-extrabold text-primary">{inr(l.lineTotal)}</span>
                    <button type="button" onClick={() => removeFromCart(l.product.id)} className="icon-btn text-muted-foreground hover:text-sale" aria-label={`Remove ${l.product.name}`}><Icon name="trash" className="h-4 w-4" /></button>
                  </div>
                </li>
              ))}
            </ul>
            <AppLink to="/menu" className="btn btn-outline mt-6"><Icon name="arrowLeft" className="h-4 w-4" /> Continue shopping</AppLink>
          </div>
          <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <OrderSummary totals={totals}>
              <CouponBox />
              {totals.freeDeliveryGap > 0 ? <p className="mt-4 rounded-xl bg-accent-soft px-3 py-2 text-xs font-semibold text-primary">Add {inr(totals.freeDeliveryGap)} more for free delivery.</p> : null}
              <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground"><Icon name="truck" className="h-4 w-4 text-accent" /> Estimated delivery: {delivery.estimatedTime}</p>
              <AppLink to="/checkout" className="btn btn-primary btn-lg mt-5 w-full">Proceed to checkout <Icon name="arrowRight" className="h-5 w-5" /></AppLink>
            </OrderSummary>
          </div>
        </div>
      )}
    </div>
  );
}

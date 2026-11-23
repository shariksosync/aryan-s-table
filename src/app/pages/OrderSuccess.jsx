import { useApp } from "../context/AppContext";
import { AppLink } from "../components/Link";
import { Icon } from "../components/Icons";
import { EmptyState } from "../components/ui";
import { useSearchParams } from "../utils/routing";
import { fmtDateTime, inr, statusBadge } from "../utils/format";

export default function OrderSuccess() {
  const { orders, hydrated, delivery } = useApp();
  const search = useSearchParams();
  const id = search.id != null ? String(search.id) : "";
  if (!hydrated) return <div className="container-x py-24 text-center text-muted-foreground">Loading your order…</div>;
  const order = orders.find((o) => o.id === id);
  if (!order) {
    return (
      <div className="container-x py-16">
        <EmptyState icon="clipboard" title="Order not found" text="We couldn't find that order on this device." action={<AppLink to="/menu" className="btn btn-primary">Back to menu</AppLink>} />
      </div>
    );
  }
  const c = order.customer;
  return (
    <div className="container-x max-w-4xl py-12 sm:py-16">
      <div className="animate-fade-up text-center">
        <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-success text-on-dark shadow-[var(--shadow-lift)]"><Icon name="check" className="h-10 w-10" strokeWidth={2.6} /></span>
        <p className="eyebrow mt-6">Thank you, {c.name.split(" ")[0]}!</p>
        <h1 className="mt-2 text-4xl font-semibold text-primary sm:text-5xl">Your order is placed</h1>
        <p className="mt-3 text-muted-foreground">Order <span className="font-extrabold tracking-wider text-foreground">{order.id}</span> · {fmtDateTime(order.createdAt)}</p>
        <p className="mt-1 text-sm text-muted-foreground">Estimated delivery: {order.estimatedTime || delivery.estimatedTime}</p>
      </div>
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        <section className="card p-5">
          <div className="flex items-center justify-between"><h2 className="text-lg font-semibold text-primary">Order summary</h2><span className={`badge ${statusBadge(order.status)}`}>{order.status}</span></div>
          <ul className="mt-4 space-y-2 text-sm">
            {order.items.map((i) => (
              <li key={i.productId} className="flex justify-between gap-3"><span>{i.name} <span className="text-muted-foreground">× {i.qty}</span></span><span className="font-semibold">{inr(i.price * i.qty)}</span></li>
            ))}
          </ul>
          <dl className="mt-4 space-y-1.5 border-t border-dashed border-border pt-3 text-sm">
            <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd>{inr(order.subtotal)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Discount{order.couponCode ? ` (${order.couponCode})` : ""}</dt><dd className="text-success">− {inr(order.discount)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Delivery</dt><dd>{order.deliveryFee ? inr(order.deliveryFee) : "FREE"}</dd></div>
            <div className="flex justify-between text-base font-extrabold"><dt>Total</dt><dd className="text-primary">{inr(order.total)}</dd></div>
          </dl>
        </section>
        <section className="card p-5">
          <h2 className="text-lg font-semibold text-primary">Delivery details</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div><dt className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Name</dt><dd className="font-semibold">{c.name}</dd></div>
            <div><dt className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Mobile</dt><dd className="font-semibold">+91 {c.mobile}</dd></div>
            {c.email ? <div><dt className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email</dt><dd className="font-semibold">{c.email}</dd></div> : null}
            <div><dt className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Address</dt><dd className="font-semibold">{c.address}{c.landmark ? `, near ${c.landmark}` : ""}, {c.city} – {c.pincode}</dd></div>
            <div><dt className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Payment method</dt><dd className="font-semibold">{order.paymentMethod}</dd></div>
          </dl>
        </section>
      </div>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <AppLink to="/account?tab=orders" className="btn btn-primary"><Icon name="clipboard" className="h-4 w-4" /> Track in My Orders</AppLink>
        <AppLink to="/menu" className="btn btn-outline">Order something else</AppLink>
      </div>
    </div>
  );
}

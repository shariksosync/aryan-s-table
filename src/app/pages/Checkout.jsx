import { useEffect, useMemo, useState } from "react";
import { useApp } from "../context/AppContext";
import { AppLink } from "../components/Link";
import { Icon } from "../components/Icons";
import { EmptyState, Field, VegMark } from "../components/ui";
import { OrderSummary } from "./Cart";
import { useNavigate } from "../utils/routing";
import { computeTotals, isFirstOrderFor, isValidEmail, isValidMobile, isValidPincode, normalizeMobile } from "../utils/calculations";
import { inr } from "../utils/format";

const PAYMENTS = [
  { id: "Cash on Delivery", title: "Cash on Delivery", text: "Pay in cash or UPI when your food arrives.", icon: "truck" },
  { id: "UPI (Demo)", title: "UPI", text: "Demo option — no real payment is taken.", icon: "phone", demo: true },
  { id: "Online Payment (Demo)", title: "Online Payment", text: "Demo option — cards/net-banking are simulated.", icon: "lock", demo: true },
];

const EMPTY = { name: "", mobile: "", email: "", address: "", landmark: "", city: "Pune", pincode: "" };

export default function Checkout() {
  const { cart, products, coupons, appliedCoupon, delivery, orders, currentCustomer, placeOrder, hydrated, toast } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [payment, setPayment] = useState("Cash on Delivery");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (currentCustomer) {
      setForm((f) => ({
        ...f,
        name: f.name || currentCustomer.name,
        mobile: f.mobile || currentCustomer.mobile,
        email: f.email || currentCustomer.email || "",
        address: f.address || currentCustomer.address?.line || "",
        landmark: f.landmark || currentCustomer.address?.landmark || "",
        city: currentCustomer.address?.city || f.city,
        pincode: f.pincode || currentCustomer.address?.pincode || "",
      }));
    }
  }, [currentCustomer]);

  const mobile = normalizeMobile(form.mobile);
  const isFirstOrder = isFirstOrderFor(orders, { customerId: currentCustomer?.id, mobile: mobile.length === 10 ? mobile : null });
  const totals = useMemo(() => computeTotals({ cart, products, coupons, couponCode: appliedCoupon, delivery, isFirstOrder }), [cart, products, coupons, appliedCoupon, delivery, isFirstOrder]);

  if (!hydrated) return <div className="container-x py-24 text-center text-muted-foreground">Loading checkout…</div>;
  if (totals.lines.length === 0) {
    return (
      <div className="container-x py-16">
        <EmptyState title="Your cart is empty" text="Add some dishes before checking out." action={<AppLink to="/menu" className="btn btn-primary">Browse the menu</AppLink>} />
      </div>
    );
  }

  const set = (k) => (e) => { setForm({ ...form, [k]: e.target.value }); if (errors[k]) setErrors({ ...errors, [k]: undefined }); };
  const validate = () => {
    const e = {};
    if (!form.name.trim() || form.name.trim().length < 2) e.name = "Please enter your full name.";
    if (!form.mobile.trim()) e.mobile = "Mobile number is required.";
    else if (!isValidMobile(form.mobile)) e.mobile = "Enter a valid 10-digit Indian mobile number.";
    if (form.email.trim() && !isValidEmail(form.email)) e.email = "Enter a valid email address.";
    if (!form.address.trim() || form.address.trim().length < 8) e.address = "Please enter your full delivery address.";
    if (!form.city.trim()) e.city = "City is required.";
    if (!form.pincode.trim()) e.pincode = "Pincode is required.";
    else if (!isValidPincode(form.pincode)) e.pincode = "Enter a valid 6-digit pincode.";
    return e;
  };
  const unavailable = totals.lines.filter((l) => !l.product.available);
  const belowMin = (Number(delivery.minOrder) || 0) > totals.subtotal;

  const submit = (ev) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) {
      toast("Please fix the highlighted fields.", "error");
      const first = document.getElementById(`co-${Object.keys(e)[0]}`);
      first?.focus();
      return;
    }
    if (!delivery.enabled) { toast("Online delivery is paused right now. Please call the restaurant.", "error"); return; }
    if (unavailable.length) { toast(`Remove unavailable items: ${unavailable.map((l) => l.product.name).join(", ")}`, "error"); return; }
    if (belowMin) { toast(`Minimum order for delivery is ${inr(delivery.minOrder)}.`, "error"); return; }
    setSubmitting(true);
    const order = placeOrder(form, payment, totals);
    navigate(`/order-success?id=${order.id}`);
  };

  return (
    <div className="container-x py-10 sm:py-14">
      <AppLink to="/cart" className="inline-flex items-center gap-1.5 text-sm font-bold text-secondary hover:underline"><Icon name="arrowLeft" className="h-4 w-4" /> Back to cart</AppLink>
      <h1 className="mt-3 text-4xl font-semibold text-primary">Checkout</h1>
      {!delivery.enabled ? <p className="mt-4 rounded-2xl bg-sale/10 px-4 py-3 text-sm font-semibold text-sale">Online delivery is currently paused. You can still call us on the number in the footer.</p> : null}
      <form noValidate onSubmit={submit} className="mt-8 grid gap-8 lg:grid-cols-[1fr_26rem]">
        <div className="space-y-6">
          <section className="card p-5 sm:p-6">
            <h2 className="flex items-center gap-2 text-xl font-semibold text-primary"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">1</span> Delivery details</h2>
            {!currentCustomer ? <p className="mt-2 text-sm text-muted-foreground">Have an account? <AppLink to="/account" className="font-bold text-secondary hover:underline">Log in</AppLink> to see this order in your history.</p> : null}
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label="Full name *" error={errors.name} id="co-name"><input id="co-name" className={`input ${errors.name ? "input-error" : ""}`} value={form.name} onChange={set("name")} autoComplete="name" /></Field>
              <Field label="Mobile number *" error={errors.mobile} id="co-mobile"><input id="co-mobile" inputMode="numeric" className={`input ${errors.mobile ? "input-error" : ""}`} value={form.mobile} onChange={set("mobile")} placeholder="10-digit mobile" autoComplete="tel" /></Field>
              <div className="sm:col-span-2"><Field label="Email address" hint="Optional — for your order confirmation." error={errors.email} id="co-email"><input id="co-email" type="email" className={`input ${errors.email ? "input-error" : ""}`} value={form.email} onChange={set("email")} autoComplete="email" /></Field></div>
              <div className="sm:col-span-2"><Field label="Delivery address *" error={errors.address} id="co-address"><textarea id="co-address" rows={3} className={`input ${errors.address ? "input-error" : ""}`} value={form.address} onChange={set("address")} placeholder="House / flat, building, street, area" autoComplete="street-address" /></Field></div>
              <Field label="Landmark" id="co-landmark"><input id="co-landmark" className="input" value={form.landmark} onChange={set("landmark")} /></Field>
              <Field label="City *" error={errors.city} id="co-city"><input id="co-city" className={`input ${errors.city ? "input-error" : ""}`} value={form.city} onChange={set("city")} autoComplete="address-level2" /></Field>
              <Field label="Pincode *" error={errors.pincode} id="co-pincode"><input id="co-pincode" inputMode="numeric" maxLength={6} className={`input ${errors.pincode ? "input-error" : ""}`} value={form.pincode} onChange={set("pincode")} autoComplete="postal-code" /></Field>
            </div>
          </section>
          <section className="card p-5 sm:p-6">
            <h2 className="flex items-center gap-2 text-xl font-semibold text-primary"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">2</span> Payment method</h2>
            <div className="mt-5 grid gap-3" role="radiogroup" aria-label="Payment method">
              {PAYMENTS.map((p) => (
                <label key={p.id} className={`flex cursor-pointer items-start gap-3 rounded-2xl border-[1.5px] p-4 transition-colors ${payment === p.id ? "border-primary bg-accent-soft/40" : "border-border hover:border-accent"}`}>
                  <input type="radio" name="payment" value={p.id} checked={payment === p.id} onChange={() => setPayment(p.id)} className="mt-1 h-4 w-4 accent-[var(--primary)]" />
                  <Icon name={p.icon} className="mt-0.5 h-5 w-5 text-accent" />
                  <span className="flex-1">
                    <span className="flex items-center gap-2 font-bold">{p.title}{p.demo ? <span className="badge badge-amber">Demo</span> : null}</span>
                    <span className="text-sm text-muted-foreground">{p.text}</span>
                  </span>
                </label>
              ))}
            </div>
            {payment !== "Cash on Delivery" ? <p className="mt-3 rounded-xl bg-muted px-3 py-2 text-xs text-muted-foreground">This is a demonstration website — no money will be charged. Your order will be recorded as “{payment}”.</p> : null}
          </section>
        </div>
        <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <OrderSummary totals={totals} title="Your order">
            <ul className="mt-4 max-h-64 space-y-3 overflow-y-auto border-t border-border pt-4">
              {totals.lines.map((l) => (
                <li key={l.product.id} className="flex items-center gap-3 text-sm">
                  <img src={l.product.image} alt="" className="h-11 w-11 rounded-lg object-cover" />
                  <span className="min-w-0 flex-1"><span className="flex items-center gap-1.5"><VegMark type={l.product.type} /><span className="truncate font-semibold">{l.product.name}</span></span><span className="text-xs text-muted-foreground">Qty {l.qty} × {inr(l.price)}</span></span>
                  <span className="font-bold">{inr(l.lineTotal)}</span>
                </li>
              ))}
            </ul>
            {appliedCoupon && totals.couponResult && !totals.couponResult.ok ? <p className="field-error mt-3">Coupon {appliedCoupon}: {totals.couponResult.reason}</p> : null}
            <button type="submit" disabled={submitting} className="btn btn-gold btn-lg mt-5 w-full">{submitting ? "Placing order…" : `Place order · ${inr(totals.total)}`}</button>
            <p className="mt-3 text-center text-xs text-muted-foreground">Estimated delivery: {delivery.estimatedTime}</p>
          </OrderSummary>
        </div>
      </form>
    </div>
  );
}

import { useApp } from "../context/AppContext";
import { Icon } from "../components/Icons";
import { EmptyState, PageHero } from "../components/ui";
import { OfferCard } from "./Home";
import { fmtDate, inr } from "../utils/format";
import { localDateStr } from "../utils/calculations";
import { IMG } from "../data/images";

export default function Offers() {
  const { offers, coupons, toast } = useApp();
  const list = offers.filter((o) => o.active).sort((a, b) => a.order - b.order);
  const today = localDateStr();
  const activeCoupons = coupons.filter((c) => c.active && (!c.validTo || c.validTo >= today));
  const copy = async (code) => {
    try { await navigator.clipboard.writeText(code); toast(`Coupon ${code} copied`); } catch { toast(`Use code ${code} at checkout`, "info"); }
  };
  return (
    <div>
      <PageHero eyebrow="Offers & coupons" title="Specials worth celebrating" sub="Combo deals, weekend festivals and coupon codes — applied right in your cart." image={IMG.biryaniFestival} />
      <section className="container-x py-14">
        {list.length === 0 ? (
          <EmptyState icon="gift" title="No active offers right now" text="Check back soon — new offers are added regularly." />
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {list.map((o, i) => (
              <div key={o.id} className={i === 0 && list.length % 2 === 1 ? "lg:col-span-2" : ""}>
                <OfferCard offer={o} large={i === 0} />
                {o.validity ? <p className="mt-2 flex items-center gap-1.5 px-2 text-xs text-muted-foreground"><Icon name="calendar" className="h-3.5 w-3.5" /> Valid till {fmtDate(o.validity)}</p> : null}
              </div>
            ))}
          </div>
        )}
      </section>
      <section className="container-x pb-20">
        <h2 className="text-3xl font-semibold text-primary">Coupon codes</h2>
        <p className="mt-1 text-sm text-muted-foreground">Enter a code in your cart. Conditions are checked automatically.</p>
        {activeCoupons.length === 0 ? (
          <p className="mt-6 text-muted-foreground">No coupon codes are active at the moment.</p>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {activeCoupons.map((c) => (
              <div key={c.id} className="relative overflow-hidden rounded-3xl border-2 border-dashed border-accent bg-card p-5">
                <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-accent-soft" aria-hidden="true" />
                <p className="relative text-2xl font-extrabold tracking-widest text-primary">{c.code}</p>
                <p className="relative mt-1 text-sm font-bold text-secondary">{c.type === "percent" ? `${c.value}% OFF${c.maxDiscount ? ` (up to ${inr(c.maxDiscount)})` : ""}` : `${inr(c.value)} OFF`}</p>
                <p className="mt-2 text-sm text-muted-foreground">{c.description}</p>
                <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
                  <li>Minimum order: {inr(c.minOrder)}</li>
                  {c.firstOrderOnly ? <li>First order only</li> : null}
                  {c.validTo ? <li>Valid till {fmtDate(c.validTo)}</li> : null}
                </ul>
                <button type="button" onClick={() => copy(c.code)} className="btn btn-outline btn-sm mt-4"><Icon name="tag" className="h-4 w-4" /> Copy code</button>
              </div>
            ))}
          </div>
        )}
        <p className="mt-6 text-xs text-muted-foreground">Offers are promotional and may be changed or withdrawn by the restaurant at any time.</p>
      </section>
    </div>
  );
}

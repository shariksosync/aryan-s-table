import { useMemo } from "react";
import { useApp } from "../context/AppContext";
import { AppLink } from "../components/Link";
import { Icon } from "../components/Icons";
import { ProductCard } from "../components/ProductCard";
import { CategoryCard } from "../components/CategoryCard";
import { SafeImage } from "../components/SafeImage";
import { SectionHeading, Stars } from "../components/ui";
import { inr, initials } from "../utils/format";
import { unitPrice } from "../utils/calculations";

const HIGHLIGHT_ICONS = ["fish", "truck", "users"];

function Hero() {
  const { settings } = useApp();
  const h = settings.homepage;
  return (
    <section className="relative isolate overflow-hidden bg-primary-deep">
      <img src={h.heroImage} alt="A table of Konkan seafood, dum biryani, Maharashtrian curries and tandoori chicken" className="animate-slow-zoom absolute inset-0 -z-10 h-full w-full object-cover object-[70%_center]" />
      <div className="hero-overlay absolute inset-0 -z-10" />
      <div className="container-x flex min-h-[560px] flex-col justify-end py-14 sm:min-h-[620px] md:justify-center lg:min-h-[calc(100vh-7rem)] lg:max-h-[860px]">
        <div className="max-w-2xl">
          <p className="animate-fade-up eyebrow eyebrow-gold ornament">Mundhwa · Pune</p>
          <h1 className="animate-fade-up delay-1 mt-4 text-[2.6rem] font-semibold leading-[1.05] text-on-dark sm:text-6xl lg:text-7xl">{h.heroHeading}</h1>
          <p className="animate-fade-up delay-2 mt-5 max-w-xl text-base leading-relaxed text-on-dark-muted sm:text-lg">{h.heroSub}</p>
          <div className="animate-fade-up delay-3 mt-8 flex flex-wrap gap-3">
            <AppLink to={h.heroBtn1Link || "/menu"} className="btn btn-gold btn-lg">
              <Icon name="bag" className="h-5 w-5" /> {h.heroBtn1Text}
            </AppLink>
            <AppLink to={h.heroBtn2Link || "/menu"} className="btn btn-ghost-light btn-lg">
              {h.heroBtn2Text} <Icon name="arrowRight" className="h-5 w-5" />
            </AppLink>
          </div>
        </div>
        <ul className="animate-fade-up delay-3 mt-10 grid max-w-3xl gap-3 sm:grid-cols-3">
          {h.highlights.filter(Boolean).map((text, i) => (
            <li key={i} className="flex items-center gap-3 rounded-2xl border border-on-dark/15 bg-on-dark/5 px-4 py-3 backdrop-blur-md">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-grad text-accent-foreground"><Icon name={HIGHLIGHT_ICONS[i % 3]} className="h-[1.1rem] w-[1.1rem]" /></span>
              <span className="text-sm font-bold text-on-dark">{text}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Categories() {
  const { activeCategories, visibleProducts } = useApp();
  const cats = activeCategories.filter((c) => c.showOnHome);
  if (!cats.length) return null;
  return (
    <section className="container-x py-20">
      <SectionHeading eyebrow="Explore the menu" title="From the coast, the tandoor & the handi" sub="Eight kitchens of flavour — choose a category and order in a few taps." />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
        {cats.map((c) => (
          <CategoryCard key={c.id} category={c} count={visibleProducts.filter((p) => p.category === c.id).length} />
        ))}
      </div>
    </section>
  );
}

function ChefPicks() {
  const { visibleProducts, addToCart } = useApp();
  const picks = visibleProducts.filter((p) => p.featured && p.available).sort((a, b) => b.popularity - a.popularity).slice(0, 4);
  if (!picks.length) return null;
  return (
    <section className="bg-cream-deep py-20">
      <div className="container-x">
        <SectionHeading align="left" eyebrow="Chef's signature picks" title="Dishes our regulars come back for" action={<AppLink to="/menu" className="btn btn-outline">Full menu <Icon name="arrowRight" className="h-4 w-4" /></AppLink>} />
        <div className="grid gap-4 md:grid-cols-2">
          {picks.map((p) => (
            <div key={p.id} className="card flex items-center gap-4 p-3 sm:p-4">
              <AppLink to={`/product/${p.id}`} className="shrink-0">
                <SafeImage src={p.image} alt={p.name} className="h-24 w-24 rounded-2xl sm:h-28 sm:w-28" />
              </AppLink>
              <div className="min-w-0 flex-1">
                <AppLink to={`/product/${p.id}`}><h3 className="text-lg font-semibold leading-snug hover:text-primary">{p.name}</h3></AppLink>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{p.description}</p>
                <div className="mt-2 flex items-center justify-between gap-2">
                  <span className="font-extrabold text-primary">{inr(unitPrice(p))}</span>
                  <button type="button" onClick={() => addToCart(p.id)} className="btn btn-sm btn-maroon"><Icon name="plus" className="h-4 w-4" /> Add</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Bestsellers() {
  const { visibleProducts, settings } = useApp();
  const list = useMemo(() => visibleProducts.filter((p) => p.bestseller).sort((a, b) => b.popularity - a.popularity).slice(0, 8), [visibleProducts]);
  if (!list.length) return null;
  return (
    <section className="container-x py-20">
      <SectionHeading eyebrow="Most loved" title={settings.homepage.bestsellerHeading} sub={settings.homepage.promoText} />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {list.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
      <div className="mt-10 text-center">
        <AppLink to="/menu" className="btn btn-primary btn-lg">View Full Menu <Icon name="arrowRight" className="h-5 w-5" /></AppLink>
      </div>
    </section>
  );
}

const WHY = [
  { icon: "fish", title: "Authentic Konkan Taste", text: "Coastal recipes with house-ground masalas, kokum and fresh coconut." },
  { icon: "chef", title: "Freshly Prepared Food", text: "Biryanis on dum, breads from the tandoor and gravies cooked to order." },
  { icon: "truck", title: "Free Home Delivery", text: "Hot, carefully packed food delivered from our kitchen to your door." },
  { icon: "users", title: "Perfect Family Dining", text: "Tree-view family seating and banquet spaces for every celebration." },
];

function WhyUs() {
  return (
    <section className="relative overflow-hidden bg-forest py-20">
      <div className="absolute inset-0 pattern-dots opacity-30" aria-hidden="true" />
      <div className="container-x relative">
        <SectionHeading light eyebrow="Why Aryan's" title="Hospitality you can taste" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {WHY.map((w) => (
            <div key={w.title} className="rounded-3xl border border-accent/25 bg-on-dark/5 p-6 backdrop-blur transition-colors hover:border-accent/60">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-grad text-accent-foreground shadow-[var(--shadow-gold)]"><Icon name={w.icon} className="h-6 w-6" /></span>
              <h3 className="mt-5 text-xl font-semibold text-on-dark">{w.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-on-dark-muted">{w.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function OfferCard({ offer, large = false }) {
  const { toast } = useApp();
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(offer.couponCode);
      toast(`Coupon ${offer.couponCode} copied`);
    } catch {
      toast(`Use code ${offer.couponCode} at checkout`, "info");
    }
  };
  return (
    <article className={`group relative isolate flex overflow-hidden rounded-3xl shadow-[var(--shadow-lift)] ${large ? "min-h-[420px]" : "min-h-[300px]"}`}>
      <SafeImage src={offer.image} alt={offer.title} className="absolute inset-0 -z-10 h-full w-full" imgClassName="transition-transform duration-700 group-hover:scale-105" />
      <div className="absolute inset-0 -z-10 card-fade" />
      <div className="mt-auto w-full p-6 sm:p-7">
        <div className="flex flex-wrap items-center gap-2">
          {offer.tag ? <span className="badge badge-maroon">{offer.tag}</span> : null}
          <span className="badge badge-gold">{offer.benefit}</span>
        </div>
        <h3 className={`mt-3 font-semibold leading-tight text-on-dark ${large ? "text-3xl sm:text-4xl" : "text-2xl"}`}>{offer.title}</h3>
        <p className="mt-2 max-w-md text-sm text-on-dark-muted">{offer.description}</p>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <AppLink to={offer.link || "/menu"} className="btn btn-gold">Order Now</AppLink>
          {offer.couponCode ? (
            <button type="button" onClick={copy} className="inline-flex items-center gap-2 rounded-full border border-dashed border-accent px-4 py-2 text-sm font-extrabold tracking-widest text-accent hover:bg-accent/10" aria-label={`Copy coupon code ${offer.couponCode}`}>
              <Icon name="tag" className="h-4 w-4" /> {offer.couponCode}
            </button>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function Offers() {
  const { offers } = useApp();
  const list = offers.filter((o) => o.active).sort((a, b) => a.order - b.order).slice(0, 3);
  if (!list.length) return null;
  return (
    <section className="container-x py-20">
      <SectionHeading align="left" eyebrow="Special offers" title="Feast more, spend less" action={<AppLink to="/offers" className="btn btn-outline">All offers <Icon name="arrowRight" className="h-4 w-4" /></AppLink>} />
      <div className="grid gap-5 lg:grid-cols-2">
        <OfferCard offer={list[0]} large />
        <div className="grid gap-5">
          {list.slice(1).map((o) => <OfferCard key={o.id} offer={o} />)}
        </div>
      </div>
      <p className="mt-4 text-xs text-muted-foreground">Offers are promotional and may change. Coupon conditions are checked at checkout.</p>
    </section>
  );
}

function Experience() {
  const { settings } = useApp();
  const h = settings.homepage;
  const items = h.experience || [];
  return (
    <section className="bg-primary-deep py-20">
      <div className="container-x">
        <SectionHeading light eyebrow="Dine with us" title={h.experienceHeading} sub={h.experienceSub} />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {items.map((e, i) => (
            <article key={e.id || i} className={`group relative overflow-hidden rounded-3xl ${i % 2 === 1 ? "lg:mt-10" : ""}`}>
              <SafeImage src={e.image} alt={e.title} className="aspect-[3/4] w-full" imgClassName="transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 card-fade" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <h3 className="text-xl font-semibold text-on-dark">{e.title}</h3>
                <p className="mt-1.5 text-sm text-on-dark-muted">{e.text}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <AppLink to="/about" className="btn btn-gold">Our story</AppLink>
          <AppLink to="/contact" className="btn btn-ghost-light">Plan a celebration</AppLink>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const { testimonials } = useApp();
  const list = testimonials.filter((t) => t.published).sort((a, b) => a.order - b.order);
  if (!list.length) return null;
  return (
    <section className="container-x py-20">
      <SectionHeading eyebrow="Guest stories" title="What families say about Aryan's" sub="Sample reviews shown for demonstration — managed from the admin panel." />
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {list.slice(0, 8).map((t) => (
          <figure key={t.id} className="card relative flex flex-col p-6">
            <Icon name="quote" className="h-8 w-8 text-accent" strokeWidth={2.2} />
            <Stars rating={t.rating} />
            <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-foreground/85">“{t.text}”</blockquote>
            <figcaption className="mt-5 flex items-center gap-3 border-t border-border pt-4">
              {t.avatar ? <img src={t.avatar} alt="" className="h-11 w-11 rounded-full object-cover" /> : <span className="flex h-11 w-11 items-center justify-center rounded-full bg-forest font-display text-sm font-bold text-accent">{initials(t.name)}</span>}
              <span>
                <span className="block text-sm font-bold">{t.name}</span>
                <span className="text-xs text-muted-foreground">Demo review</span>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

function CallBand() {
  const { settings, delivery } = useApp();
  return (
    <section className="container-x pb-20">
      <div className="relative overflow-hidden rounded-[2rem] bg-maroon-grad px-6 py-10 sm:px-12 sm:py-14">
        <div className="absolute inset-0 pattern-dots opacity-30" aria-hidden="true" />
        <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <p className="eyebrow eyebrow-gold">Hungry already?</p>
            <h2 className="mt-2 text-3xl font-semibold text-on-dark sm:text-4xl">Hot food at your door in {delivery.estimatedTime}.</h2>
            <p className="mt-2 text-on-dark-muted">Order online or call us on {settings.website.phone}.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <AppLink to="/menu" className="btn btn-gold btn-lg">Order Now</AppLink>
            <a href={`tel:${settings.website.phone.replace(/\s/g, "")}`} className="btn btn-ghost-light btn-lg"><Icon name="phone" className="h-5 w-5" /> Call</a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <Categories />
      <ChefPicks />
      <Bestsellers />
      <WhyUs />
      <Offers />
      <Experience />
      <Testimonials />
      <CallBand />
    </>
  );
}

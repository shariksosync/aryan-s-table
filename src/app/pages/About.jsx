import { useApp } from "../context/AppContext";
import { AppLink } from "../components/Link";
import { Icon } from "../components/Icons";
import { SafeImage } from "../components/SafeImage";
import { PageHero, SectionHeading } from "../components/ui";
import { IMG } from "../data/images";

const PILLARS = [
  { icon: "fish", title: "Authentic Konkan flavours", text: "Kokum, coconut and coastal masalas — recipes carried from the Konkan shore." },
  { icon: "leaf", title: "Traditional Maharashtrian cuisine", text: "Kala Masala gravies, tambda-pandhra rassa and hand-patted jowar bhakri." },
  { icon: "utensils", title: "Coastal seafood specialties", text: "Surmai, bombil, bangda and prawns — fried, curried or tandoor-roasted." },
  { icon: "chef", title: "Signature biryanis", text: "Chicken, mutton and veg biryanis sealed in handis and slow-cooked on dum." },
  { icon: "flame", title: "Tandoor specialties", text: "Kebabs, tikkas, lollipops and breads fired fresh in our clay tandoor." },
  { icon: "drink", title: "Signature shots & bar", text: "House favourites like our Jamun Shot for an evening with friends." },
];

const BANQUET = ["Basic decoration", "Couple sofa", "Maharaja chair", "VIP chairs for guests", "Sound system", "Event manager", "Staff", "Buffet", "Event hall", "Dining hall", "Lift", "Changing room", "Separate parking", "Karaoke music"];

export default function About() {
  const { settings } = useApp();
  const a = settings.about;
  return (
    <div>
      <PageHero eyebrow="About us" title={a.heading} sub="Hospitality, family dining and beverages — the Aryan's way." image={IMG.diningAmbience} />

      <section className="container-x grid items-center gap-10 py-20 lg:grid-cols-2 lg:gap-16">
        <div className="relative">
          <SafeImage src={a.image1} alt="Tree-view family seating at Aryan's" className="aspect-[4/5] w-full rounded-[2rem] shadow-[var(--shadow-lift)]" />
          <SafeImage src={a.image2} alt="Maharashtrian thali" className="absolute -bottom-8 -right-4 hidden aspect-square w-48 rounded-3xl border-[6px] border-background shadow-[var(--shadow-lift)] sm:block lg:-right-10 lg:w-56" />
        </div>
        <div>
          <p className="eyebrow ornament">Our story</p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight text-primary sm:text-4xl">Passion for hospitality, served with every plate.</h2>
          <p className="mt-5 leading-relaxed text-foreground/85">{a.intro}</p>
          <p className="mt-4 leading-relaxed text-foreground/85">{a.story}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <AppLink to="/menu" className="btn btn-primary">Explore the menu</AppLink>
            <AppLink to="/contact" className="btn btn-outline">Visit us</AppLink>
          </div>
        </div>
      </section>

      <section className="bg-cream-deep py-20">
        <div className="container-x">
          <SectionHeading eyebrow="What we serve" title="The flavours that define Aryan's" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {PILLARS.map((p) => (
              <div key={p.title} className="card card-hover p-6">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-forest text-accent"><Icon name={p.icon} className="h-6 w-6" /></span>
                <h3 className="mt-4 text-xl font-semibold text-primary">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-x grid items-center gap-10 py-20 lg:grid-cols-2">
        <div className="order-2 lg:order-1">
          <p className="eyebrow ornament">Family dining &amp; ambience</p>
          <h2 className="mt-3 text-3xl font-semibold text-primary sm:text-4xl">Dine under the tree canopy</h2>
          <p className="mt-4 leading-relaxed text-foreground/85">Our special family seating places you amidst lush greenery with peaceful tree and jungle views, a comfortable breeze and spacious tables tailored for family privacy. Warm lantern light and brass serveware complete a relaxed, unhurried evening.</p>
        </div>
        <SafeImage src={IMG.diningAmbience} alt="Restaurant ambience with lanterns and greenery" className="order-1 aspect-[3/2] w-full rounded-[2rem] shadow-[var(--shadow-lift)] lg:order-2" />
      </section>

      <section className="bg-primary-deep py-20">
        <div className="container-x grid items-center gap-10 lg:grid-cols-2">
          <SafeImage src={a.image3} alt="Decorated banquet hall" className="aspect-[3/2] w-full rounded-[2rem]" />
          <div>
            <p className="eyebrow eyebrow-gold ornament">Banquet facilities</p>
            <h2 className="mt-3 text-3xl font-semibold text-on-dark sm:text-4xl">Celebrate weddings, birthdays &amp; family occasions</h2>
            <p className="mt-4 text-on-dark-muted">A decorated event space with dining and event support.</p>
            <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm text-on-dark">
              {BANQUET.map((b) => <li key={b} className="flex items-center gap-2"><Icon name="check" className="h-4 w-4 shrink-0 text-accent" strokeWidth={2.4} />{b}</li>)}
            </ul>
            <AppLink to="/contact" className="btn btn-gold mt-8">Enquire about your event</AppLink>
          </div>
        </div>
      </section>
    </div>
  );
}

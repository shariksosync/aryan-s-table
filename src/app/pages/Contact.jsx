import { useState } from "react";
import { useApp } from "../context/AppContext";
import { Icon } from "../components/Icons";
import { Field, PageHero } from "../components/ui";
import { genId } from "../utils/format";
import { isValidEmail, isValidMobile } from "../utils/calculations";
import { IMG } from "../data/images";

const EMPTY = { name: "", mobile: "", email: "", subject: "", message: "" };

export default function Contact() {
  const { settings, update, toast } = useApp();
  const w = settings.website;
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);
  const set = (k) => (e) => { setForm({ ...form, [k]: e.target.value }); if (errors[k]) setErrors({ ...errors, [k]: undefined }); };
  const submit = (ev) => {
    ev.preventDefault();
    const e = {};
    if (!form.name.trim()) e.name = "Please enter your name.";
    if (!form.mobile.trim()) e.mobile = "Mobile number is required.";
    else if (!isValidMobile(form.mobile)) e.mobile = "Enter a valid 10-digit mobile number.";
    if (!form.email.trim()) e.email = "Email is required.";
    else if (!isValidEmail(form.email)) e.email = "Enter a valid email address.";
    if (!form.subject.trim()) e.subject = "Please add a subject.";
    if (!form.message.trim() || form.message.trim().length < 10) e.message = "Please write a message (at least 10 characters).";
    setErrors(e);
    if (Object.keys(e).length) return;
    update("messages", (list) => [{ id: genId("msg"), ...form, createdAt: new Date().toISOString() }, ...list]);
    setForm(EMPTY);
    setSent(true);
    toast("Thank you! Your message has been received.");
  };
  const tel = w.phone.replace(/\s/g, "");
  return (
    <div>
      <PageHero eyebrow="Contact us" title="We'd love to hear from you" sub="Table bookings, banquet enquiries, feedback or delivery questions — reach out any time." image={IMG.banquetHallKonkan} />
      <section className="container-x grid gap-8 py-14 lg:grid-cols-[1fr_1.3fr]">
        <div className="space-y-4">
          <a href={`tel:${tel}`} className="card card-hover flex items-start gap-4 p-5">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-forest text-accent"><Icon name="phone" /></span>
            <span><span className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">Call us</span><span className="text-lg font-bold text-primary">{w.phone}</span></span>
          </a>
          <a href={`mailto:${w.email}`} className="card card-hover flex items-start gap-4 p-5">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-forest text-accent"><Icon name="mail" /></span>
            <span className="min-w-0"><span className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">Email</span><span className="break-all font-bold text-primary">{w.email}</span></span>
          </a>
          <div className="card flex items-start gap-4 p-5">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-forest text-accent"><Icon name="pin" /></span>
            <span><span className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">Address</span><span className="text-sm font-semibold leading-relaxed">{w.address}</span></span>
          </div>
          <div className="card p-5">
            <div className="flex items-center gap-3"><Icon name="clock" className="h-5 w-5 text-accent" /><h2 className="text-lg font-semibold text-primary">Opening hours</h2></div>
            <dl className="mt-3 space-y-2 text-sm">
              {w.hours.map((h, i) => <div key={i} className="flex justify-between gap-3 border-b border-dashed border-border pb-2 last:border-0"><dt className="text-muted-foreground">{h.label}</dt><dd className="font-bold">{h.value}</dd></div>)}
            </dl>
            {w.hoursNote ? <p className="mt-2 text-xs text-muted-foreground">{w.hoursNote}</p> : null}
          </div>
          <div className="relative overflow-hidden rounded-3xl bg-forest p-6">
            <div className="absolute inset-0 pattern-dots opacity-40" aria-hidden="true" />
            <div className="relative">
              <Icon name="pin" className="h-8 w-8 text-accent" />
              <p className="mt-3 font-display text-xl text-on-dark">Find us on Manjari Village Road, Mundhwa</p>
              <a href={w.mapUrl} target="_blank" rel="noopener noreferrer" className="btn btn-gold btn-sm mt-4">Open in Google Maps <Icon name="external" className="h-4 w-4" /></a>
            </div>
          </div>
        </div>
        <div className="card p-6 sm:p-8">
          <h2 className="text-2xl font-semibold text-primary">Send us a message</h2>
          <p className="mt-1 text-sm text-muted-foreground">We usually reply within a day.</p>
          {sent ? <p className="mt-4 flex items-center gap-2 rounded-2xl bg-success/10 px-4 py-3 text-sm font-semibold text-success" role="status"><Icon name="check" className="h-4 w-4" /> Message received — thank you! The restaurant will get back to you soon.</p> : null}
          <form noValidate onSubmit={submit} className="mt-6 grid gap-4 sm:grid-cols-2">
            <Field label="Name *" error={errors.name} id="ct-name"><input id="ct-name" className={`input ${errors.name ? "input-error" : ""}`} value={form.name} onChange={set("name")} autoComplete="name" /></Field>
            <Field label="Mobile number *" error={errors.mobile} id="ct-mobile"><input id="ct-mobile" inputMode="numeric" className={`input ${errors.mobile ? "input-error" : ""}`} value={form.mobile} onChange={set("mobile")} autoComplete="tel" /></Field>
            <div className="sm:col-span-2"><Field label="Email *" error={errors.email} id="ct-email"><input id="ct-email" type="email" className={`input ${errors.email ? "input-error" : ""}`} value={form.email} onChange={set("email")} autoComplete="email" /></Field></div>
            <div className="sm:col-span-2"><Field label="Subject *" error={errors.subject} id="ct-subject"><input id="ct-subject" className={`input ${errors.subject ? "input-error" : ""}`} value={form.subject} onChange={set("subject")} placeholder="e.g. Banquet booking for 80 guests" /></Field></div>
            <div className="sm:col-span-2"><Field label="Message *" error={errors.message} id="ct-message"><textarea id="ct-message" rows={5} className={`input ${errors.message ? "input-error" : ""}`} value={form.message} onChange={set("message")} /></Field></div>
            <div className="sm:col-span-2"><button type="submit" className="btn btn-primary btn-lg w-full sm:w-auto">Send message <Icon name="arrowRight" className="h-5 w-5" /></button></div>
          </form>
        </div>
      </section>
    </div>
  );
}

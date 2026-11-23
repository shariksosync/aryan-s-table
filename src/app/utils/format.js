export const inr = (n) => `₹${Math.round(Number(n) || 0).toLocaleString("en-IN")}`;

export const fmtDate = (iso) => {
  try { return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }); } catch { return ""; }
};
export const fmtDateTime = (iso) => {
  try { return new Date(iso).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" }); } catch { return ""; }
};

// Only call from event handlers (never at module scope).
export const genId = (prefix = "id") => `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

export const genOrderId = () => `ARY-${Date.now().toString(36).toUpperCase().slice(-5)}${Math.random().toString(36).slice(2, 4).toUpperCase()}`;

export const slugify = (s) => String(s).toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export const initials = (name = "") => name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("");

export const ORDER_STATUSES = ["New Order", "Confirmed", "Preparing", "Out for Delivery", "Delivered", "Cancelled"];

export const statusBadge = (s) => ({
  "New Order": "badge-blue",
  Confirmed: "badge-purple",
  Preparing: "badge-amber",
  "Out for Delivery": "badge-gold",
  Delivered: "badge-green",
  Cancelled: "badge-red",
}[s] || "badge-muted");

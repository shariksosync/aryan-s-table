// Safe localStorage helpers. Data here is a frontend demo store, not secure storage.
export const KEYS = {
  products: "aryan_products",
  categories: "aryan_categories",
  coupons: "aryan_coupons",
  offers: "aryan_offers",
  testimonials: "aryan_testimonials",
  gallery: "aryan_gallery",
  settings: "aryan_website_settings",
  delivery: "aryan_delivery_settings",
  orders: "aryan_orders",
  customers: "aryan_customers",
  currentCustomerId: "aryan_current_customer",
  adminSession: "aryan_admin_session",
  cart: "aryan_cart",
  wishlist: "aryan_wishlist",
  media: "aryan_media",
  messages: "aryan_messages",
  appliedCoupon: "aryan_applied_coupon",
};

export function loadKey(key) {
  if (typeof window === "undefined") return undefined;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw == null) return undefined;
    return JSON.parse(raw);
  } catch {
    return undefined;
  }
}

export function saveKey(key, value) {
  try {
    if (value === undefined || value === null) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, JSON.stringify(value));
    return { ok: true };
  } catch (error) {
    return { ok: false, error };
  }
}

export function clearAllKeys() {
  Object.values(KEYS).forEach((k) => {
    try { window.localStorage.removeItem(k); } catch { /* ignore */ }
  });
}

// Accept saved data only when it has the expected shape.
export function sameShape(saved, fallback) {
  if (saved === undefined) return false;
  if (Array.isArray(fallback)) return Array.isArray(saved);
  if (fallback !== null && typeof fallback === "object") return saved !== null && typeof saved === "object" && !Array.isArray(saved);
  return true;
}

export function storageUsageKB() {
  try {
    let total = 0;
    Object.values(KEYS).forEach((k) => { total += (window.localStorage.getItem(k) || "").length; });
    return Math.round((total * 2) / 1024);
  } catch {
    return 0;
  }
}

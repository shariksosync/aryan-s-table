// Pure price, coupon and delivery calculations shared by cart, checkout and admin.

export function unitPrice(product) {
  const price = Number(product.price) || 0;
  const d = Number(product.discountPrice);
  return d > 0 && d < price ? d : price;
}

export function hasDiscount(product) {
  return unitPrice(product) < (Number(product.price) || 0);
}

export function localDateStr(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function cartLines(cart, products) {
  return cart
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) return null;
      const price = unitPrice(product);
      return { product, qty: item.qty, price, lineTotal: price * item.qty };
    })
    .filter(Boolean);
}

export function findCoupon(coupons, code) {
  if (!code) return null;
  const c = String(code).trim().toUpperCase();
  return coupons.find((x) => String(x.code).toUpperCase() === c) || null;
}

// Returns { ok, discount, reason }
export function validateCoupon(coupon, { subtotal, today = new Date(), isFirstOrder = true }) {
  if (!coupon) return { ok: false, discount: 0, reason: "This coupon code doesn't exist." };
  if (!coupon.active) return { ok: false, discount: 0, reason: "This coupon is not active right now." };
  const t = localDateStr(today);
  if (coupon.validFrom && t < coupon.validFrom) return { ok: false, discount: 0, reason: "This coupon is not valid yet." };
  if (coupon.validTo && t > coupon.validTo) return { ok: false, discount: 0, reason: "This coupon has expired." };
  const min = Number(coupon.minOrder) || 0;
  if (subtotal < min) return { ok: false, discount: 0, reason: `Add ₹${min - subtotal} more to use ${coupon.code} (minimum order ₹${min}).` };
  if (coupon.firstOrderOnly && !isFirstOrder) return { ok: false, discount: 0, reason: `${coupon.code} is valid on your first order only.` };
  let discount = coupon.type === "percent" ? Math.floor((subtotal * Number(coupon.value)) / 100) : Number(coupon.value) || 0;
  const cap = Number(coupon.maxDiscount);
  if (coupon.type === "percent" && cap > 0) discount = Math.min(discount, cap);
  discount = Math.max(0, Math.min(discount, subtotal));
  return { ok: true, discount, reason: "" };
}

export function deliveryFeeFor(amountAfterDiscount, delivery, hasItems = true) {
  if (!hasItems) return 0;
  if (delivery.freeDeliveryEnabled && amountAfterDiscount >= (Number(delivery.freeDeliveryMin) || 0)) return 0;
  return Number(delivery.charge) || 0;
}

export function computeTotals({ cart, products, coupons, couponCode, delivery, isFirstOrder = true, today = new Date() }) {
  const lines = cartLines(cart, products);
  const itemCount = lines.reduce((s, l) => s + l.qty, 0);
  const subtotal = lines.reduce((s, l) => s + l.lineTotal, 0);
  let discount = 0;
  let couponResult = null;
  const coupon = findCoupon(coupons, couponCode);
  if (couponCode) {
    couponResult = validateCoupon(coupon, { subtotal, today, isFirstOrder });
    if (couponResult.ok) discount = couponResult.discount;
  }
  const afterDiscount = subtotal - discount;
  const deliveryFee = deliveryFeeFor(afterDiscount, delivery, lines.length > 0);
  const total = afterDiscount + deliveryFee;
  const freeDeliveryGap = delivery.freeDeliveryEnabled ? Math.max(0, (Number(delivery.freeDeliveryMin) || 0) - afterDiscount) : null;
  return { lines, itemCount, subtotal, discount, coupon, couponResult, deliveryFee, total, freeDeliveryGap };
}

export function isFirstOrderFor(orders, { customerId, mobile }) {
  return !orders.some((o) => o.status !== "Cancelled" && ((customerId && o.customerId === customerId) || (mobile && o.customer?.mobile === mobile)));
}

// Validation helpers
export const isValidMobile = (v) => /^[6-9]\d{9}$/.test(String(v).replace(/\D/g, "").replace(/^91(?=\d{10}$)/, ""));
export const normalizeMobile = (v) => String(v).replace(/\D/g, "").replace(/^91(?=\d{10}$)/, "");
export const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v).trim());
export const isValidPincode = (v) => /^[1-9]\d{5}$/.test(String(v).trim());

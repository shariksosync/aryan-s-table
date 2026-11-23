import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { mockCategories } from "../data/mockCategories";
import { mockProducts } from "../data/mockProducts";
import { createDefaultSettings, createMockCoupons, createMockOffers, defaultDelivery, mockGallery, mockTestimonials } from "../data/mockContent";
import { createMockCustomers, createMockOrders } from "../data/mockOrders";
import { KEYS, clearAllKeys, loadKey, sameShape, saveKey } from "../utils/storage";
import { computeTotals, findCoupon, isFirstOrderFor, normalizeMobile, validateCoupon } from "../utils/calculations";
import { genId, genOrderId } from "../utils/format";

const AppContext = createContext(null);

function createSeed() {
  const customers = createMockCustomers();
  return {
    products: mockProducts.map((p) => ({ ...p })),
    categories: mockCategories.map((c) => ({ ...c })),
    coupons: createMockCoupons(),
    offers: createMockOffers(),
    testimonials: mockTestimonials.map((t) => ({ ...t })),
    gallery: mockGallery.map((g) => ({ ...g })),
    settings: createDefaultSettings(),
    delivery: { ...defaultDelivery },
    orders: createMockOrders(customers),
    customers,
    currentCustomerId: null,
    adminSession: null,
    cart: [],
    wishlist: [],
    media: [],
    messages: [],
    appliedCoupon: null,
  };
}

function mergeSettings(saved, defaults) {
  const out = { ...defaults };
  Object.keys(defaults).forEach((section) => {
    if (saved && typeof saved[section] === "object" && saved[section] !== null) {
      out[section] = { ...defaults[section], ...saved[section] };
      if (section === "website") out.website.social = { ...defaults.website.social, ...(saved.website.social || {}) };
      if (section === "homepage" && !Array.isArray(saved.homepage.experience)) out.homepage.experience = defaults.homepage.experience;
    }
  });
  return out;
}

function reducer(state, action) {
  switch (action.type) {
    case "HYDRATE":
      return { ...state, ...action.data };
    case "SET":
      return { ...state, [action.key]: action.value };
    case "UPDATE":
      return { ...state, [action.key]: action.fn(state[action.key], state) };
    case "RESET":
      return action.seed;
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, null, createSeed);
  const [hydrated, setHydrated] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [confirmState, setConfirmState] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const lastSaved = useRef({});
  const stateRef = useRef(state);
  stateRef.current = state;

  // ---------- toasts & confirm ----------
  const toast = useCallback((message, type = "success") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t.slice(-3), { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), type === "error" ? 5200 : 3200);
  }, []);
  const dismissToast = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), []);

  const confirm = useCallback((opts) => new Promise((resolve) => {
    setConfirmState({ title: "Are you sure?", message: "", confirmText: "Confirm", danger: true, ...opts, resolve });
  }), []);
  const closeConfirm = (result) => {
    confirmState?.resolve(result);
    setConfirmState(null);
  };

  // ---------- hydrate from localStorage ----------
  useEffect(() => {
    const seed = createSeed();
    const data = {};
    Object.entries(KEYS).forEach(([field, key]) => {
      const saved = loadKey(key);
      if (field === "settings") {
        data.settings = saved && typeof saved === "object" ? mergeSettings(saved, seed.settings) : seed.settings;
      } else if (field === "delivery") {
        data.delivery = saved && typeof saved === "object" ? { ...seed.delivery, ...saved } : seed.delivery;
      } else if (field === "currentCustomerId" || field === "appliedCoupon") {
        data[field] = typeof saved === "string" ? saved : null;
      } else if (field === "adminSession") {
        data[field] = saved && typeof saved === "object" && saved.username ? saved : null;
      } else {
        data[field] = sameShape(saved, seed[field]) ? saved : seed[field];
      }
    });
    if (Array.isArray(data.cart)) data.cart = data.cart.filter((i) => i && typeof i.productId === "string" && Number(i.qty) > 0);
    dispatch({ type: "HYDRATE", data });
    setHydrated(true);
  }, []);

  // ---------- persist changed keys ----------
  useEffect(() => {
    if (!hydrated) return;
    const failures = [];
    Object.entries(KEYS).forEach(([field, key]) => {
      if (lastSaved.current[field] === state[field]) return;
      const res = saveKey(key, state[field]);
      if (res.ok) lastSaved.current[field] = state[field];
      else failures.push(field);
    });
    if (failures.length) {
      toast("Couldn't save changes — browser storage is full. Use smaller images or remove unused uploads in Image Management.", "error");
    }
  }, [state, hydrated, toast]);

  // ---------- generic helpers ----------
  const setValue = useCallback((key, value) => dispatch({ type: "SET", key, value }), []);
  const update = useCallback((key, fn) => dispatch({ type: "UPDATE", key, fn }), []);
  const upsert = useCallback((key, item, prefix = "id") => {
    const withId = item.id ? item : { ...item, id: genId(prefix) };
    dispatch({ type: "UPDATE", key, fn: (list) => (list.some((x) => x.id === withId.id) ? list.map((x) => (x.id === withId.id ? { ...x, ...withId } : x)) : [...list, withId]) });
    return withId;
  }, []);
  const patch = useCallback((key, id, partial) => dispatch({ type: "UPDATE", key, fn: (list) => list.map((x) => (x.id === id ? { ...x, ...partial } : x)) }), []);
  const remove = useCallback((key, id) => dispatch({ type: "UPDATE", key, fn: (list) => list.filter((x) => x.id !== id) }), []);
  const updateSettings = useCallback((section, partial) => dispatch({ type: "UPDATE", key: "settings", fn: (s) => ({ ...s, [section]: { ...s[section], ...partial } }) }), []);

  // ---------- derived ----------
  const currentCustomer = useMemo(() => state.customers.find((c) => c.id === state.currentCustomerId) || null, [state.customers, state.currentCustomerId]);
  const activeCategories = useMemo(() => [...state.categories].filter((c) => c.active).sort((a, b) => a.order - b.order), [state.categories]);
  const visibleProducts = useMemo(() => {
    const activeIds = new Set(activeCategories.map((c) => c.id));
    return state.products.filter((p) => activeIds.has(p.category));
  }, [state.products, activeCategories]);
  const isFirstOrder = useMemo(() => (currentCustomer ? isFirstOrderFor(state.orders, { customerId: currentCustomer.id, mobile: currentCustomer.mobile }) : true), [currentCustomer, state.orders]);
  const totals = useMemo(() => computeTotals({ cart: state.cart, products: state.products, coupons: state.coupons, couponCode: state.appliedCoupon, delivery: state.delivery, isFirstOrder }), [state.cart, state.products, state.coupons, state.appliedCoupon, state.delivery, isFirstOrder]);

  // ---------- cart ----------
  const addToCart = useCallback((productId, qty = 1, { silent = false } = {}) => {
    const product = stateRef.current.products.find((p) => p.id === productId);
    if (!product) return false;
    if (!product.available) {
      toast(`${product.name} is currently unavailable for delivery.`, "error");
      return false;
    }
    dispatch({ type: "UPDATE", key: "cart", fn: (cart) => {
      const existing = cart.find((i) => i.productId === productId);
      if (existing) return cart.map((i) => (i.productId === productId ? { ...i, qty: Math.min(50, i.qty + qty) } : i));
      return [...cart, { productId, qty }];
    } });
    if (!silent) toast(`${product.name} added to cart`);
    return true;
  }, [toast]);
  const setQty = useCallback((productId, qty) => {
    dispatch({ type: "UPDATE", key: "cart", fn: (cart) => (qty <= 0 ? cart.filter((i) => i.productId !== productId) : cart.map((i) => (i.productId === productId ? { ...i, qty: Math.min(50, qty) } : i))) });
  }, []);
  const removeFromCart = useCallback((productId) => dispatch({ type: "UPDATE", key: "cart", fn: (cart) => cart.filter((i) => i.productId !== productId) }), []);
  const clearCart = useCallback(() => { setValue("cart", []); setValue("appliedCoupon", null); }, [setValue]);
  const cartQty = useCallback((productId) => state.cart.find((i) => i.productId === productId)?.qty || 0, [state.cart]);

  const applyCoupon = useCallback((code) => {
    const s = stateRef.current;
    const coupon = findCoupon(s.coupons, code);
    const subtotal = computeTotals({ cart: s.cart, products: s.products, coupons: s.coupons, couponCode: null, delivery: s.delivery }).subtotal;
    const res = validateCoupon(coupon, { subtotal, isFirstOrder });
    if (res.ok) {
      setValue("appliedCoupon", coupon.code);
      toast(`Coupon ${coupon.code} applied — you save ₹${res.discount}`);
    } else {
      toast(res.reason, "error");
    }
    return res;
  }, [isFirstOrder, setValue, toast]);
  const removeCoupon = useCallback(() => setValue("appliedCoupon", null), [setValue]);

  // ---------- wishlist ----------
  const toggleWishlist = useCallback((productId) => {
    const inList = stateRef.current.wishlist.includes(productId);
    dispatch({ type: "UPDATE", key: "wishlist", fn: (w) => (inList ? w.filter((x) => x !== productId) : [...w, productId]) });
    toast(inList ? "Removed from wishlist" : "Saved to wishlist", "info");
  }, [toast]);

  // ---------- orders ----------
  const placeOrder = useCallback((form, paymentMethod, orderTotals) => {
    const s = stateRef.current;
    const mobile = normalizeMobile(form.mobile);
    let customerId = s.currentCustomerId;
    if (!customerId) customerId = s.customers.find((c) => c.mobile === mobile)?.id || null;
    const order = {
      id: genOrderId(),
      createdAt: new Date().toISOString(),
      status: "New Order",
      paymentMethod,
      customerId,
      customer: { name: form.name.trim(), mobile, email: form.email.trim(), address: form.address.trim(), landmark: form.landmark.trim(), city: form.city.trim(), pincode: form.pincode.trim() },
      items: orderTotals.lines.map((l) => ({ productId: l.product.id, name: l.product.name, price: l.price, qty: l.qty, type: l.product.type, image: l.product.image })),
      subtotal: orderTotals.subtotal,
      discount: orderTotals.discount,
      couponCode: orderTotals.discount > 0 ? orderTotals.coupon?.code || null : null,
      deliveryFee: orderTotals.deliveryFee,
      total: orderTotals.total,
      estimatedTime: s.delivery.estimatedTime,
      statusHistory: [{ status: "New Order", at: new Date().toISOString() }],
    };
    dispatch({ type: "UPDATE", key: "orders", fn: (orders) => [order, ...orders] });
    dispatch({ type: "UPDATE", key: "products", fn: (products) => products.map((p) => {
      const line = order.items.find((i) => i.productId === p.id);
      return line ? { ...p, popularity: (Number(p.popularity) || 0) + line.qty } : p;
    }) });
    setValue("cart", []);
    setValue("appliedCoupon", null);
    return order;
  }, [setValue]);

  const updateOrderStatus = useCallback((id, status) => {
    dispatch({ type: "UPDATE", key: "orders", fn: (orders) => orders.map((o) => (o.id === id ? { ...o, status, statusHistory: [...(o.statusHistory || []), { status, at: new Date().toISOString() }] } : o)) });
  }, []);

  // ---------- customer auth (demo only) ----------
  const registerCustomer = useCallback(({ name, mobile, email, password }) => {
    const s = stateRef.current;
    const m = normalizeMobile(mobile);
    if (s.customers.some((c) => c.mobile === m)) return { ok: false, error: "An account with this mobile number already exists. Please log in." };
    if (email && s.customers.some((c) => c.email && c.email.toLowerCase() === email.trim().toLowerCase())) return { ok: false, error: "An account with this email already exists." };
    const customer = { id: genId("cu"), name: name.trim(), mobile: m, email: email.trim(), password, createdAt: new Date().toISOString(), address: { line: "", landmark: "", city: "Pune", pincode: "" } };
    dispatch({ type: "UPDATE", key: "customers", fn: (list) => [...list, customer] });
    setValue("currentCustomerId", customer.id);
    return { ok: true, customer };
  }, [setValue]);
  const loginCustomer = useCallback((identifier, password) => {
    const id = String(identifier).trim().toLowerCase();
    const m = normalizeMobile(identifier);
    const c = stateRef.current.customers.find((x) => (x.mobile === m || (x.email && x.email.toLowerCase() === id)));
    if (!c || c.password !== password) return { ok: false, error: "Mobile/email or password is incorrect." };
    setValue("currentCustomerId", c.id);
    return { ok: true, customer: c };
  }, [setValue]);
  const logoutCustomer = useCallback(() => setValue("currentCustomerId", null), [setValue]);

  // ---------- admin auth (demo only) ----------
  const adminLogin = useCallback((username, password) => {
    const a = stateRef.current.settings.admin;
    if (username.trim() === a.username && password === a.password) {
      setValue("adminSession", { username: a.username, at: new Date().toISOString() });
      return true;
    }
    return false;
  }, [setValue]);
  const adminLogout = useCallback(() => setValue("adminSession", null), [setValue]);

  const resetDemo = useCallback(() => {
    clearAllKeys();
    lastSaved.current = {};
    const seed = createSeed();
    seed.adminSession = stateRef.current.adminSession;
    dispatch({ type: "RESET", seed });
  }, []);

  const value = {
    ...state, state, hydrated, dispatch,
    toast, confirm, toasts, dismissToast, confirmState, closeConfirm,
    cartOpen, setCartOpen,
    setValue, update, upsert, patch, remove, updateSettings,
    currentCustomer, activeCategories, visibleProducts, totals, isFirstOrder,
    addToCart, setQty, removeFromCart, clearCart, cartQty, applyCoupon, removeCoupon,
    toggleWishlist, placeOrder, updateOrderStatus,
    registerCustomer, loginCustomer, logoutCustomer, adminLogin, adminLogout, resetDemo,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}

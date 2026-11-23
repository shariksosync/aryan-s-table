// Demo customers and orders so the admin dashboard has data on first load.
const isoAgo = (days, hours = 0) => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(d.getHours() - hours);
  return d.toISOString();
};

export const createMockCustomers = () => [
  { id: "cu-demo", name: "Demo Customer", mobile: "9876543210", email: "demo@aryans.test", password: "demo123", createdAt: isoAgo(40), address: { line: "Flat 12, Green Valley, Keshav Nagar", landmark: "Near Z-Corner", city: "Pune", pincode: "411036" } },
  { id: "cu-2", name: "Kavita More", mobile: "9822012345", email: "kavita.more@example.com", password: "kavita123", createdAt: isoAgo(25), address: { line: "B-4, Amanora Park", landmark: "", city: "Pune", pincode: "411028" } },
  { id: "cu-3", name: "Sachin Pawar", mobile: "9890098900", email: "", password: "sachin123", createdAt: isoAgo(9), address: { line: "Lane 3, Mundhwa Road", landmark: "Opp. temple", city: "Pune", pincode: "411036" } },
];

const line = (productId, name, price, qty, type) => ({ productId, name, price, qty, type });
const order = (id, days, hours, customer, items, status, payment, coupon = null, discount = 0) => {
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  return {
    id, createdAt: isoAgo(days, hours), status, paymentMethod: payment,
    customerId: customer.id || null,
    customer: { name: customer.name, mobile: customer.mobile, email: customer.email || "", address: customer.address.line, landmark: customer.address.landmark || "", city: customer.address.city, pincode: customer.address.pincode },
    items, subtotal, discount, couponCode: coupon, deliveryFee: 0, total: subtotal - discount,
    statusHistory: [{ status, at: isoAgo(days, hours) }],
  };
};

export const createMockOrders = (customers) => {
  const [a, b, c] = customers;
  const guest = { id: null, name: "Neha Shinde", mobile: "9765432109", email: "neha.s@example.com", address: { line: "Row House 7, Magarpatta", landmark: "", city: "Pune", pincode: "411013" } };
  return [
    order("ARY-24A7K1", 0, 1, a, [line("chicken-dum-biryani", "Chicken Dum Biryani", 249, 2, "nonveg"), line("sol-kadhi", "Sol Kadhi", 79, 2, "veg")], "New Order", "Cash on Delivery"),
    order("ARY-24A6M9", 0, 3, b, [line("kala-masala-chicken", "Kala Masala Chicken", 279, 1, "nonveg"), line("bhakri", "Jowar Bhakri", 40, 4, "veg")], "Preparing", "UPI (Demo)"),
    order("ARY-24A5Q2", 1, 2, guest, [line("surmai-fish-fry", "Surmai Fish Fry", 369, 1, "nonveg"), line("prawns-masala", "Prawns Masala", 349, 1, "nonveg"), line("tandoori-roti", "Tandoori Roti", 30, 4, "veg")], "Out for Delivery", "Online Payment (Demo)"),
    order("ARY-24A3T5", 2, 5, c, [line("mutton-dum-biryani", "Mutton Dum Biryani", 329, 2, "nonveg"), line("paneer-tikka", "Paneer Tikka", 229, 1, "veg")], "Delivered", "Cash on Delivery", "BIRYANI15", 120),
    order("ARY-24A1B8", 3, 4, a, [line("maharashtrian-chicken-thali", "Maharashtrian Chicken Thali", 299, 3, "nonveg"), line("masala-papad", "Masala Papad", 69, 2, "veg")], "Delivered", "UPI (Demo)"),
    order("ARY-249ZC3", 5, 2, b, [line("chicken-tandoori", "Chicken Tandoori", 349, 1, "nonveg"), line("dal-tadka", "Dal Tadka", 169, 1, "veg"), line("tandoori-roti", "Tandoori Roti", 30, 6, "veg")], "Delivered", "Cash on Delivery"),
    order("ARY-249W11", 6, 6, guest, [line("veg-dum-biryani", "Veg Dum Biryani", 199, 2, "veg")], "Cancelled", "Cash on Delivery"),
  ];
};

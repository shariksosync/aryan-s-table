import { IMG } from "./images";

const dayStr = (offsetDays) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
};

// Coupons are demo promotions — admin decides what is offered.
export const createMockCoupons = () => [
  { id: "c-welcome10", code: "WELCOME10", type: "percent", value: 10, maxDiscount: 150, minOrder: 199, validFrom: dayStr(-30), validTo: dayStr(120), firstOrderOnly: true, active: true, description: "10% off your first order (up to ₹150)." },
  { id: "c-family150", code: "FAMILY150", type: "fixed", value: 150, maxDiscount: null, minOrder: 999, validFrom: dayStr(-30), validTo: dayStr(120), firstOrderOnly: false, active: true, description: "₹150 off family orders above ₹999." },
  { id: "c-biryani15", code: "BIRYANI15", type: "percent", value: 15, maxDiscount: 120, minOrder: 499, validFrom: dayStr(-7), validTo: dayStr(60), firstOrderOnly: false, active: true, description: "15% off biryani feasts above ₹499 (up to ₹120)." },
];

export const createMockOffers = () => [
  { id: "o-first", title: "Flat 10% OFF on your first order", description: "New to Aryan's? Taste the Konkan coast at home with 10% off your very first online order.", benefit: "10% OFF", couponCode: "WELCOME10", image: IMG.seafoodKonkan, validity: dayStr(120), tag: "New customers", active: true, order: 1, link: "/menu" },
  { id: "o-family", title: "Family Combo Specials", description: "Ordering for the whole family? Save ₹150 on orders above ₹999 — curries, tandoor, breads and more.", benefit: "₹150 OFF", couponCode: "FAMILY150", image: IMG.familyCombo, validity: dayStr(120), tag: "Combo", active: true, order: 2, link: "/menu" },
  { id: "o-biryani", title: "Weekend Biryani Festival", description: "Slow-cooked chicken, mutton and veg dum biryanis — enjoy 15% off biryani orders above ₹499.", benefit: "15% OFF", couponCode: "BIRYANI15", image: IMG.biryaniFestival, validity: dayStr(60), tag: "Weekend special", active: true, order: 3, link: "/menu?category=biryani" },
];

export const mockTestimonials = [
  { id: "t1", name: "Priya Deshmukh", rating: 5, text: "The Kala Masala chicken with bhakri tasted exactly like home. Delivery was quick and the food was still piping hot.", avatar: "", published: true, order: 1 },
  { id: "t2", name: "Rohan Kulkarni", rating: 5, text: "Surmai fry and sol kadhi — proper Konkan flavours in Pune. The tree-view family seating is lovely for weekend lunches.", avatar: "", published: true, order: 2 },
  { id: "t3", name: "Sneha Patil", rating: 4, text: "We celebrated my parents' anniversary in the banquet hall. Great service and the mutton biryani was the highlight.", avatar: "", published: true, order: 3 },
  { id: "t4", name: "Amit Joshi", rating: 5, text: "Chicken tandoori lollipop and dum biryani are our Friday-night regulars now. Generous portions for a family.", avatar: "", published: true, order: 4 },
];

export const GALLERY_CATEGORIES = [
  "Food Photography", "Seafood Specialties", "Biryani", "Maharashtrian Cuisine",
  "Tandoor Preparation", "Restaurant Interior", "Family Seating", "Banquet Events", "Beverages",
];

const g = (id, title, category, image, description, order) => ({ id, title, category, image, description, active: true, order });
export const mockGallery = [
  g("g1", "Konkan Seafood Platter", "Seafood Specialties", IMG.seafoodKonkan, "Bombil, prawns and fish curry with coastal spices.", 1),
  g("g2", "Tree-View Family Section", "Family Seating", IMG.familySeating, "Our jungle-themed family seating amidst greenery.", 2),
  g("g3", "Dum Biryani", "Biryani", IMG.dumBiryani, "Aromatic biryani slow-cooked dum style.", 3),
  g("g4", "Banquet Hall", "Banquet Events", IMG.banquetHallKonkan, "Decorated banquet space for weddings and celebrations.", 4),
  g("g5", "Maharashtrian Thali", "Maharashtrian Cuisine", IMG.maharashtrianThali, "Kala masala gravies, rassa and jowar bhakri.", 5),
  g("g6", "Tandoor Platter", "Tandoor Preparation", IMG.tandoorPlatter, "Smoky tandoori chicken straight from the clay oven.", 6),
  g("g7", "Jamun Shot", "Beverages", IMG.jamunShot, "Our house signature shot.", 7),
  g("g8", "Bombil Kurkure", "Seafood Specialties", IMG.bombilKurkure, "Crispy Bombay duck in spiced rava.", 8),
  g("g9", "Evening Ambience", "Restaurant Interior", IMG.diningAmbience, "Warm lantern light and lush greenery.", 9),
  g("g10", "Chicken Kala Masala", "Maharashtrian Cuisine", IMG.chickenKalaMasala, "Our legendary black-spice gravy.", 10),
  g("g11", "Tandoori Lollipop", "Tandoor Preparation", IMG.chickenTandooriLollipop, "Charred over red-hot coals.", 11),
  g("g12", "Prawns Koliwada", "Seafood Specialties", IMG.prawnsKoliwada, "Jumbo prawns in crisp batter.", 12),
  g("g13", "Mutton Dum Biryani", "Biryani", IMG.muttonBiryani, "Sealed handi, saffron rice, tender mutton.", 13),
  g("g14", "Jäger Bomb Shots", "Beverages", IMG.jagerbomb, "A bar favourite for the evening.", 14),
  g("g15", "Paneer Jafrani", "Food Photography", IMG.vegMaharaja, "Saffron and cashew gravy with soft paneer.", 15),
  g("g16", "Bangda Tandoori", "Seafood Specialties", IMG.bangdaTandoori, "Whole mackerel with coastal rub.", 16),
  g("g17", "Soya Chaap", "Tandoor Preparation", IMG.soyaChaap, "Charcoal-grilled vegetarian special.", 17),
  g("g18", "A Family Feast", "Food Photography", IMG.heroFeast, "Seafood, biryani and tandoor on one table.", 18),
];

export const createDefaultSettings = () => ({
  website: {
    name: "Aryan's Family Restaurant & Bar",
    shortName: "Aryan's",
    tagline: "Family Restaurant & Bar · Pune",
    logoImage: "",
    phone: "+91 9130009130",
    email: "aryansfamilyrestorant@gmail.com",
    address: "32/2/6, Sr No 26/3 B, Manjari Village Road, Lonkar Wasti, Keshav Nagar, Mundhwa, Mundhwa - Manjari Rd, Lonkar Nagar, Sade Satra Nali, Pune, Maharashtra 411036",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Aryan's+Family+Restaurant+%26+Bar+Manjari+Road+Mundhwa+Pune",
    description: "Coastal Konkan seafood, slow-cooked biryanis, Maharashtrian Kala Masala specialties and tandoor grills — with free home delivery, tree-view family seating and banquet spaces.",
    footerText: "Serving authentic Konkan and Maharashtrian flavours to Pune families, at our tables and at your doorstep.",
    copyright: "Aryan's Family Restaurant & Bar. All rights reserved.",
    farmHouseUrl: "https://example.com/farm-house",
    social: {
      instagram: "https://www.instagram.com/aryansfamilyofficial",
      facebook: "https://www.facebook.com/legendaryans/",
      youtube: "",
      whatsapp: "",
    },
    hours: [
      { label: "Monday – Friday", value: "11:30 AM – 11:00 PM" },
      { label: "Saturday – Sunday", value: "11:00 AM – 11:30 PM" },
    ],
    hoursNote: "Demo hours — please confirm with the restaurant.",
  },
  about: {
    heading: "A family table, rooted in Konkan and Maharashtra.",
    intro: "Aryan's Family Restaurant & Bar is working in the field of hospitality, family dining, and beverages. Aryan's Family Restaurant & Bar is into serving coastal Konkan seafood, slow-cooked biryanis, traditional Maharashtrian specialties such as Kala Masala and bhakri, tandoor grills, signature shots, and free home delivery, along with tree-view family seating and banquet spaces for celebrations.",
    story: "Every dish at Aryan's begins with a simple idea: food should taste like it was cooked for family. Our kitchen grinds its own masalas, slow-cooks biryanis on dum and fires the tandoor fresh through the day — so whether you dine under our tree canopy or order to your door, the flavour stays honest.",
    image1: IMG.familySeating,
    image2: IMG.maharashtrianThali,
    image3: IMG.banquetHallKonkan,
  },
  homepage: {
    announcement: "Free home delivery — call +91 9130009130 or order online.",
    heroHeading: "Authentic Flavours. Unforgettable Moments.",
    heroSub: "From the Konkan coast to your dining table, experience authentic flavours, delicious biryanis and traditional Maharashtrian hospitality.",
    heroImage: IMG.heroFeast,
    heroBtn1Text: "Order Now",
    heroBtn1Link: "/menu",
    heroBtn2Text: "Explore Our Menu",
    heroBtn2Link: "/menu",
    highlights: ["Authentic Konkan Cuisine", "Free Home Delivery", "Family Dining Experience"],
    bestsellerHeading: "Bestsellers from our kitchen",
    promoText: "Order your favourites from Aryan's kitchen — freshly prepared, delivered hot.",
    experienceHeading: "More Than a Meal, It's an Experience.",
    experienceSub: "Tree-view family seating, a decorated banquet hall and warm hospitality — Aryan's is where Pune families come together.",
    experience: [
      { id: "e1", title: "Tree-View Family Seating", text: "Dine amidst lush greenery with peaceful tree-canopy views and spacious tables for family privacy.", image: IMG.familySeating },
      { id: "e2", title: "Banquet Facilities", text: "A decorated event space for weddings, birthdays and family occasions, with dining and event support.", image: IMG.banquetHallKonkan },
      { id: "e3", title: "Family Celebrations", text: "Shared platters, big handis of biryani and generous thalis — made for celebrating together.", image: IMG.familyCombo },
      { id: "e4", title: "Restaurant Ambience", text: "Warm lantern light, brass serveware and a jungle-inspired setting for relaxed evenings.", image: IMG.diningAmbience },
    ],
  },
  admin: { username: "admin", password: "admin123", displayName: "Restaurant Admin", email: "aryansfamilyrestorant@gmail.com" },
});

export const defaultDelivery = {
  enabled: true,
  charge: 40,
  freeDeliveryEnabled: true,
  freeDeliveryMin: 0,
  estimatedTime: "35–45 minutes",
  minOrder: 0,
  note: "Free home delivery across nearby areas of Mundhwa, Keshav Nagar and Manjari (demo setting).",
};

// Built-in image library offered whenever admin chooses an image.
export const BUILTIN_LIBRARY = [
  ["Homepage feast (created)", IMG.heroFeast], ["Konkan seafood", IMG.seafoodKonkan], ["Dum biryani", IMG.dumBiryani],
  ["Mutton biryani (created)", IMG.muttonBiryani], ["Veg biryani (created)", IMG.vegBiryani], ["Maharashtrian thali", IMG.maharashtrianThali],
  ["Chicken kala masala", IMG.chickenKalaMasala], ["Tandoor platter", IMG.tandoorPlatter], ["Tandoori lollipop", IMG.chickenTandooriLollipop],
  ["Bangda tandoori", IMG.bangdaTandoori], ["Bombil kurkure", IMG.bombilKurkure], ["Prawns koliwada", IMG.prawnsKoliwada],
  ["Prawns masala (created)", IMG.prawnsMasala], ["Surmai fish fry (created)", IMG.surmaiFishFry], ["Malvani chicken (created)", IMG.malvaniChicken],
  ["Jeera chicken", IMG.jeeraChicken], ["Paneer jafrani", IMG.vegMaharaja], ["Soya chaap", IMG.soyaChaap],
  ["Paneer tikka (created)", IMG.paneerTikka], ["Tandoori roti (created)", IMG.tandooriRoti], ["Bhakri (created)", IMG.bhakri],
  ["Dal tadka (created)", IMG.dalTadka], ["Masala papad (created)", IMG.masalaPapad], ["Mutton sukka (created)", IMG.muttonSukka],
  ["Mutton rassa (created)", IMG.muttonRassa], ["Sol kadhi (created)", IMG.solKadhi], ["Masala chaas (created)", IMG.masalaChaas],
  ["Jamun shot", IMG.jamunShot], ["Jäger bomb", IMG.jagerbomb], ["Family seating", IMG.familySeating],
  ["Banquet hall", IMG.banquetHallKonkan], ["Dining ambience (created)", IMG.diningAmbience], ["Family combo (created)", IMG.familyCombo],
  ["Biryani festival (created)", IMG.biryaniFestival], ["Original Aryan's logo", IMG.logoClean],
].map(([title, url], i) => ({ id: `lib-${i}`, title, url, builtin: true }));

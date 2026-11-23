import { IMG } from "./images";

// Initial food categories. Admin can add, edit, reorder and hide these.
export const mockCategories = [
  { id: "seafood", name: "Seafood Specials", description: "Fresh Konkan catch — surmai, bombil, bangda and prawns in coastal masalas.", image: IMG.seafoodKonkan, active: true, showOnHome: true, order: 1 },
  { id: "chicken", name: "Chicken Delights", description: "Malvani, jeera and home-style chicken curries cooked low and slow.", image: IMG.jeeraChicken, active: true, showOnHome: true, order: 2 },
  { id: "mutton", name: "Mutton Specials", description: "Rich, robust mutton sukka and rassa with roasted spices.", image: IMG.muttonSukka, active: true, showOnHome: true, order: 3 },
  { id: "biryani", name: "Dum Biryani", description: "Slow-cooked dum biryanis sealed in handis, served with raita.", image: IMG.dumBiryani, active: true, showOnHome: true, order: 4 },
  { id: "maharashtrian", name: "Maharashtrian Cuisine", description: "Kala Masala gravies, thalis and piping-hot jowar bhakri.", image: IMG.maharashtrianThali, active: true, showOnHome: true, order: 5 },
  { id: "tandoor", name: "Tandoor Specials", description: "Smoky kebabs, tikkas and breads from the clay tandoor.", image: IMG.tandoorPlatter, active: true, showOnHome: true, order: 6 },
  { id: "veg", name: "Veg Delights", description: "Paneer, dal and vegetable favourites for the whole family.", image: IMG.vegMaharaja, active: true, showOnHome: true, order: 7 },
  { id: "beverages", name: "Beverages", description: "Cooling sol kadhi, chaas and our signature bar shots.", image: IMG.jamunShot, active: true, showOnHome: true, order: 8 },
];

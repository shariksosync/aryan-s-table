import { IMG } from "./images";

const p = (id, name, category, price, type, image, extra = {}) => ({
  id, name, category, price, type, image,
  discountPrice: null, available: true, bestseller: false, featured: false,
  popularity: 50, serves: "Serves 1", prepTime: "20–25 min",
  description: "", longDescription: "",
  ...extra,
});

// Initial demo menu. Prices are demo values and can be changed by admin.
export const mockProducts = [
  p("malvani-chicken-curry", "Malvani Chicken Curry", "chicken", 299, "nonveg", IMG.malvaniChicken, {
    bestseller: true, featured: true, popularity: 88, serves: "Serves 1–2",
    description: "Coastal chicken curry in roasted coconut and Malvani masala.",
    longDescription: "A Konkan coast classic. Bone-in chicken simmered in a deep, aromatic gravy of slow-roasted coconut, onions and our house-ground Malvani masala. Best enjoyed with vade, bhakri or steamed rice.",
  }),
  p("surmai-fish-fry", "Surmai Fish Fry", "seafood", 399, "nonveg", IMG.surmaiFishFry, {
    discountPrice: 369, bestseller: true, featured: true, popularity: 95, serves: "2 steaks",
    description: "Kingfish steaks in red Konkan masala, rava-crusted and pan-fried.",
    longDescription: "Thick-cut fresh surmai marinated in kokum, red chilli and ginger-garlic, coated in coarse rava and shallow-fried until the edges are crisp and golden. Served with onion, lemon and green chutney.",
  }),
  p("prawns-masala", "Prawns Masala", "seafood", 349, "nonveg", IMG.prawnsMasala, {
    popularity: 80, serves: "Serves 1–2",
    description: "Juicy prawns in a thick coconut and red chilli masala.",
    longDescription: "Fresh prawns tossed in a fiery Konkan masala of coconut, kokum and Bedgi chillies, finished with coriander. Pairs beautifully with steamed rice or tandoori roti.",
  }),
  p("chicken-dum-biryani", "Chicken Dum Biryani", "biryani", 249, "nonveg", IMG.dumBiryani, {
    bestseller: true, featured: true, popularity: 98, serves: "Serves 1", prepTime: "25–30 min",
    description: "Aromatic basmati layered with spiced chicken, slow-cooked dum style.",
    longDescription: "Long-grain basmati rice layered with marinated chicken, caramelised onions, mint and warming biryani masala, sealed and slow-cooked on dum. Served with cooling raita.",
  }),
  p("mutton-dum-biryani", "Mutton Dum Biryani", "biryani", 349, "nonveg", IMG.muttonBiryani, {
    discountPrice: 329, bestseller: true, featured: true, popularity: 92, serves: "Serves 1", prepTime: "30–35 min",
    description: "Tender mutton and saffron basmati sealed in a handi.",
    longDescription: "Tender, bone-in mutton marinated overnight, layered with saffron basmati and fried onions, then sealed with dough and slow-cooked until every grain is fragrant. Served with raita and a boiled egg.",
  }),
  p("veg-dum-biryani", "Veg Dum Biryani", "biryani", 199, "veg", IMG.vegBiryani, {
    popularity: 70, serves: "Serves 1",
    description: "Garden vegetables, paneer and cashews in fragrant dum rice.",
    longDescription: "Basmati rice slow-cooked with carrots, beans, peas, paneer and cashews in a mild biryani masala, topped with crisp onions and mint. Served with raita.",
  }),
  p("maharashtrian-chicken-thali", "Maharashtrian Chicken Thali", "maharashtrian", 299, "nonveg", IMG.maharashtrianThali, {
    bestseller: true, featured: true, popularity: 90, serves: "Full meal for 1",
    description: "Chicken rassa, sukka, bhakri, rice, solkadhi and accompaniments.",
    longDescription: "A complete home-style Maharashtrian meal: chicken rassa, dry chicken sukka, dal, steamed rice, jowar bhakri, salad, thecha and pickle — the way it is served in Pune homes.",
  }),
  p("kala-masala-chicken", "Kala Masala Chicken", "maharashtrian", 279, "nonveg", IMG.chickenKalaMasala, {
    bestseller: true, featured: true, popularity: 93, serves: "Serves 1–2",
    description: "Our house special — chicken in traditional roasted black spices.",
    longDescription: "Slow-cooked chicken in a dark, smoky gravy of dry-roasted coconut, onions and the legendary Maharashtrian kala masala. Irresistible with hot bhakri.",
  }),
  p("bhakri", "Jowar Bhakri", "maharashtrian", 40, "veg", IMG.bhakri, {
    popularity: 75, serves: "1 piece", prepTime: "10 min",
    description: "Hand-patted jowar flatbread, roasted on an iron tawa.",
    longDescription: "Traditional gluten-free jowar bhakri, hand-patted and roasted on a hot tawa. The perfect partner for Kala Masala and rassa gravies.",
  }),
  p("paneer-tikka", "Paneer Tikka", "tandoor", 229, "veg", IMG.paneerTikka, {
    popularity: 82, serves: "6 pieces",
    description: "Cottage cheese, peppers and onion charred in the tandoor.",
    longDescription: "Fresh paneer cubes marinated in hung curd and tandoori spices, skewered with capsicum and onion and charred in the clay oven. Served with mint chutney.",
  }),
  p("chicken-tandoori", "Chicken Tandoori", "tandoor", 349, "nonveg", IMG.tandoorPlatter, {
    bestseller: true, popularity: 89, serves: "Half (4 pcs)",
    description: "Classic bone-in chicken roasted over flaming charcoal.",
    longDescription: "Chicken marinated overnight in yogurt, Kashmiri chilli and garam masala, roasted in the tandoor until smoky and succulent. Served with onions, lemon and green chutney.",
  }),
  p("tandoori-roti", "Tandoori Roti", "tandoor", 30, "veg", IMG.tandooriRoti, {
    popularity: 72, serves: "1 piece", prepTime: "10 min",
    description: "Whole-wheat flatbread baked against the tandoor wall.",
    longDescription: "Soft, blistered whole-wheat roti baked fresh in the tandoor and brushed with ghee on request.",
  }),
  p("dal-tadka", "Dal Tadka", "veg", 169, "veg", IMG.dalTadka, {
    popularity: 68, serves: "Serves 1–2",
    description: "Yellow dal tempered with ghee, cumin, garlic and red chilli.",
    longDescription: "Comforting yellow lentils finished with a sizzling tadka of ghee, cumin, garlic and dried red chillies.",
  }),
  p("masala-papad", "Masala Papad", "veg", 69, "veg", IMG.masalaPapad, {
    popularity: 60, serves: "2 pieces", prepTime: "5–10 min",
    description: "Roasted papad topped with onion, tomato and chaat masala.",
    longDescription: "A crunchy starter: roasted papad loaded with chopped onion, tomato, green chilli, coriander and tangy chaat masala.",
  }),
  p("bombil-kurkure", "Bombil Kurkure", "seafood", 299, "nonveg", IMG.bombilKurkure, {
    bestseller: true, popularity: 91, serves: "Serves 1–2",
    description: "Crispy Bombay duck fillets in spiced rava, fried golden.",
    longDescription: "Fresh bombil fillets coated with coarse semolina and Konkan spices, fried to a golden crunch. Served with lime and chutney.",
  }),
  p("bangda-tandoori", "Bangda Tandoori", "seafood", 279, "nonveg", IMG.bangdaTandoori, {
    popularity: 78, serves: "1 whole fish",
    description: "Whole mackerel in a ginger-garlic coastal rub, tandoor roasted.",
    longDescription: "Whole fresh mackerel infused with a spicy ginger-garlic coastal rub and roasted in the tandoor with charred edges.",
  }),
  p("prawns-koliwada", "Prawns Koliwada", "seafood", 379, "nonveg", IMG.prawnsKoliwada, {
    popularity: 84, serves: "Serves 1–2",
    description: "Jumbo prawns in crisp, spicy Koliwada batter.",
    longDescription: "Jumbo prawns dipped in a crisp, spicy Koliwada batter and fried, or skewered in smoky tandoori seasoning on request.",
  }),
  p("chicken-tandoori-lollipop", "Chicken Tandoori Lollipop", "tandoor", 289, "nonveg", IMG.chickenTandooriLollipop, {
    bestseller: true, popularity: 87, serves: "6 pieces",
    description: "Chicken drumettes in spicy tandoori marinade, charred on coals.",
    longDescription: "Chicken lollipops brushed with a spicy tandoori marinade and charred over red-hot coals.",
  }),
  p("jeera-chicken", "Jeera Chicken", "chicken", 289, "nonveg", IMG.jeeraChicken, {
    popularity: 74, serves: "Serves 1–2",
    description: "Chicken tossed with roasted cumin and cracked black pepper.",
    longDescription: "Tender chicken pieces tossed with roasted cumin seeds, freshly cracked pepper and rich Indian spices.",
  }),
  p("soya-chaap-tandoori", "Soya Chaap Tandoori", "tandoor", 219, "veg", IMG.soyaChaap, {
    popularity: 66, serves: "4 sticks",
    description: "Protein-rich soya chaap, yogurt-marinated and charcoal grilled.",
    longDescription: "Tender soya chaap skewers marinated in yogurt and tandoori masala, grilled over charcoal.",
  }),
  p("paneer-jafrani", "Paneer Jafrani Masala", "veg", 259, "veg", IMG.vegMaharaja, {
    popularity: 71, serves: "Serves 1–2",
    description: "Soft paneer in a velvety saffron and cashew gravy.",
    longDescription: "Velvety saffron-infused cashew gravy simmered with soft paneer cubes. Also available as Veg Jafrani on request.",
  }),
  p("mutton-sukka", "Mutton Sukka", "mutton", 379, "nonveg", IMG.muttonSukka, {
    bestseller: true, popularity: 86, serves: "Serves 1–2",
    description: "Dry-roasted mutton coated in kala masala and coconut.",
    longDescription: "Bone-in mutton slow-cooked and then roasted dry with kala masala, coconut and curry leaves.",
  }),
  p("konkan-seafood-platter", "Konkan Seafood Platter", "seafood", 649, "nonveg", IMG.seafoodKonkan, {
    discountPrice: 599, featured: true, popularity: 85, serves: "Serves 2", prepTime: "30–35 min",
    description: "Bombil, masala prawns and fish curry — a coastal feast to share.",
    longDescription: "A sharing platter of crispy bombil, masala prawns and a bowl of coastal fish curry, served with lime and chutney.",
  }),
  p("mutton-rassa", "Kolhapuri Mutton Rassa", "mutton", 359, "nonveg", IMG.muttonRassa, {
    popularity: 79, serves: "Serves 1–2",
    description: "Fiery tambda rassa with tender mutton, served with pandhra rassa.",
    longDescription: "Tender mutton in a bold, thin red Kolhapuri curry with a glossy layer of chilli oil, served alongside soothing pandhra (white) rassa. Best with bhakri.",
  }),
  p("sol-kadhi", "Sol Kadhi", "beverages", 79, "veg", IMG.solKadhi, {
    popularity: 69, serves: "1 glass", prepTime: "5 min",
    description: "Cooling Konkan drink of kokum and fresh coconut milk.",
    longDescription: "The classic Konkan digestive — kokum and fresh coconut milk with a hint of garlic, green chilli and coriander. The perfect partner for seafood.",
  }),
  p("masala-chaas", "Masala Chaas", "beverages", 59, "veg", IMG.masalaChaas, {
    popularity: 62, serves: "1 glass", prepTime: "5 min",
    description: "Chilled spiced buttermilk with roasted cumin and mint.",
    longDescription: "Chilled, lightly salted buttermilk churned with roasted cumin, mint and coriander.",
  }),
  p("jamun-shot", "Jamun Shot", "beverages", 350, "veg", IMG.jamunShot, {
    available: false, popularity: 64, serves: "1 shot", prepTime: "Bar",
    description: "House signature shot with real jamun pulp and black salt.",
    longDescription: "Crafted with real wild black plum (jamun) pulp, black salt and a chilled spirit punch. Bar item — served at the restaurant only, not available for delivery.",
  }),
  p("jager-bomb", "Jäger Bomb Shots", "beverages", 450, "veg", IMG.jagerbomb, {
    available: false, popularity: 58, serves: "1 serve", prepTime: "Bar",
    description: "Jägermeister dropped into chilled energy drink.",
    longDescription: "The timeless party favourite. Bar item — served at the restaurant only, not available for delivery.",
  }),
];

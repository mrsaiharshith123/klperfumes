import { supabase, isSupabaseConfigured } from './supabase';

export const demoProducts = [
  {
    id: 'attar-1',
    name: 'Oud Al Malik',
    brand: 'KL Perfumes Atelier',
    category: 'Pure Oud',
    description: 'A regal distillation of aged Assam agarwood and smoked birch. Deep, balsamic, and commanding with a dry honeyed undertone. A signature attar fit for kings.',
    price: 3499,
    original_price: 4200,
    stock_quantity: 6,
    size: '12ml (1 Tola)',
    sizes: ['3ml (Quarter Tola)', '6ml (Half Tola)', '12ml (1 Tola)'],
    fragrance_type: 'Royal Agarwood & Leather',
    notes: {
      top: 'Aged Assam Agarwood, Saffron Petals',
      heart: 'Smoked Leather, Birch Resin, Tonka Bean',
      base: 'Dark Ambergris Accord, Black Musk'
    },
    image_url: 'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=900&q=85',
    featured: true,
    published: true
  },
  {
    id: 'attar-2',
    name: 'White Musk',
    brand: 'KL Perfumes Atelier',
    category: 'Musk',
    description: 'The epitome of tranquility and ethereal grace. A whisper-soft white musk that merges seamlessly with natural skin warmth, creating a clean, powdery veil that lasts all day.',
    price: 1299,
    original_price: 1650,
    stock_quantity: 14,
    size: '6ml (Half Tola)',
    sizes: ['3ml (Quarter Tola)', '6ml (Half Tola)', '12ml (1 Tola)'],
    fragrance_type: 'Velvet Floral Musk',
    notes: {
      top: 'Morning Lily, White Lotus',
      heart: 'Florentine Iris, Velvet White Musk',
      base: 'Soft Amber Crystals, Clean Cotton Blossom'
    },
    image_url: 'https://images.unsplash.com/photo-1608571424266-edeb9bbefdec?auto=format&fit=crop&w=900&q=85',
    featured: true,
    published: true
  },
  {
    id: 'attar-3',
    name: 'Royal Amber',
    brand: 'KL Perfumes Atelier',
    category: 'Amber & Woods',
    description: 'Ancient amber resin slowly hydro-macerated with Bourbon vanilla and labdanum. Radiates an intoxicating golden warmth that wraps you in rich comfort.',
    price: 2699,
    original_price: 3200,
    stock_quantity: 9,
    size: '12ml (1 Tola)',
    sizes: ['3ml (Quarter Tola)', '6ml (Half Tola)', '12ml (1 Tola)'],
    fragrance_type: 'Oriental Golden Amber',
    notes: {
      top: 'Cistus Labdanum, Sweet Orange Peel',
      heart: 'Warm Benzoin, Aged Madagascar Vanilla',
      base: 'Fossilized Amber, Cedarwood Essence'
    },
    image_url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=900&q=85',
    featured: true,
    published: true
  },
  {
    id: 'attar-4',
    name: 'Dehn Al Oud',
    brand: 'KL Perfumes Atelier',
    category: 'Pure Oud',
    description: 'Pure, unadulterated artisanal agarwood oil distilled from wild Trat Aquilaria trees. Intensely complex, woodsy, and deeply spiritual with an incomparable longevity.',
    price: 4999,
    original_price: 5999,
    stock_quantity: 4,
    size: '3ml (Quarter Tola)',
    sizes: ['3ml (Quarter Tola)', '6ml (Half Tola)', '12ml (1 Tola)'],
    fragrance_type: 'Pure Agarwood Oil',
    notes: {
      top: 'Wild Trat Agarwood Essence',
      heart: 'Sun-Dried Hay, Honeyed Bark, Resinous Wood',
      base: 'Earthy Balsam, Deep Animalic Warmth'
    },
    image_url: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=900&q=85',
    featured: true,
    published: true
  },
  {
    id: 'attar-5',
    name: 'Rose Taifi',
    brand: 'KL Perfumes Atelier',
    category: 'Floral',
    description: 'Prized Taif roses gathered at daybreak from Saudi Arabia’s mountain terraces. Hydro-distilled into a crisp, dew-drenched floral attar layered with sweet honeycomb undertones.',
    price: 2199,
    original_price: 2799,
    stock_quantity: 8,
    size: '6ml (Half Tola)',
    sizes: ['3ml (Quarter Tola)', '6ml (Half Tola)', '12ml (1 Tola)'],
    fragrance_type: 'Mountain Taif Rose',
    notes: {
      top: 'Taif Rose Petals, Green Dew',
      heart: 'Damask Rose Absolute, Sweet Geranium',
      base: 'Wild Honeycomb, Sandalwood Fixative'
    },
    image_url: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=900&q=85',
    featured: true,
    published: true
  },
  {
    id: 'attar-6',
    name: 'Sandalwood',
    brand: 'KL Perfumes Atelier',
    category: 'Amber & Woods',
    description: 'Classical pure Santalum Album distilled using traditional deg & bhapka methods. Incomparably creamy, soothing, and buttery with an enduring sacred stillness.',
    price: 3199,
    original_price: 3800,
    stock_quantity: 11,
    size: '12ml (1 Tola)',
    sizes: ['3ml (Quarter Tola)', '6ml (Half Tola)', '12ml (1 Tola)'],
    fragrance_type: 'Pure Mysore Sandalwood',
    notes: {
      top: 'Sweet Cardamom, Green Cypress',
      heart: 'Creamy Mysore Sandalwood Heartwood',
      base: 'Balsamic Resins, Warm Driftwood'
    },
    image_url: 'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&w=900&q=85',
    featured: true,
    published: true
  },
  {
    id: 'attar-7',
    name: 'Musk Al Tahara',
    brand: 'KL Perfumes Atelier',
    category: 'Musk',
    description: 'The celebrated thick white cream attar of Arabian bridal traditions. Luxurious, milky, and intensely comforting. Clean, pristine, and exceptionally long-lasting on skin and robes.',
    price: 999,
    original_price: 1350,
    stock_quantity: 18,
    size: '6ml (Half Tola)',
    sizes: ['3ml (Quarter Tola)', '6ml (Half Tola)', '12ml (1 Tola)'],
    fragrance_type: 'Pure White Cream Musk',
    notes: {
      top: 'White Lotus, Delicate Lilac',
      heart: 'Creamy Vanilla, Powdery Rice Starch',
      base: 'Pristine Royal White Musk, Soft Cashmere'
    },
    image_url: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=900&q=85',
    featured: true,
    published: true
  },
  {
    id: 'attar-8',
    name: 'Black Oud',
    brand: 'KL Perfumes Atelier',
    category: 'Pure Oud',
    description: 'A dense, nocturnal attar evoking fragrant bakhoor embers and smoky Cambodian agarwood. Dark, hypnotic, and commanding an unforgettable presence in any room.',
    price: 3899,
    original_price: 4600,
    stock_quantity: 5,
    size: '12ml (1 Tola)',
    sizes: ['3ml (Quarter Tola)', '6ml (Half Tola)', '12ml (1 Tola)'],
    fragrance_type: 'Smoked Dark Oud',
    notes: {
      top: 'Indonesian Black Agarwood, Clove Bud',
      heart: 'Frankincense Smoke, Roasted Cedar',
      base: 'Dark Amber, Earthy Patchouli, Castoreum Accord'
    },
    image_url: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=900&q=85',
    featured: false,
    published: true
  },
  {
    id: 'attar-9',
    name: 'Arabian Nights',
    brand: 'KL Perfumes Atelier',
    category: 'Special Blends',
    description: 'An opulent royal mukhallat harmonizing saffron stigmas, Damascus rose, and vintage oud. Evokes starlit palace courtyards with rich, lingering trails of perfume.',
    price: 2899,
    original_price: 3400,
    stock_quantity: 7,
    size: '12ml (1 Tola)',
    sizes: ['3ml (Quarter Tola)', '6ml (Half Tola)', '12ml (1 Tola)'],
    fragrance_type: 'Oriental Spicy Mukhallat',
    notes: {
      top: 'Saffron Threads, Bergamot, Mandarin',
      heart: 'Damascus Rose, Spiced Nutmeg, Oud Oil',
      base: 'Ambergris Accord, Black Musk, Patchouli'
    },
    image_url: 'https://images.unsplash.com/photo-1615634260167-c8cdede054de?auto=format&fit=crop&w=900&q=85',
    featured: true,
    published: true
  },
  {
    id: 'attar-10',
    name: 'Majestic Oud',
    brand: 'KL Perfumes Atelier',
    category: 'Pure Oud',
    description: 'Refined oud oil softened by golden spices and precious woods. An aristocratic, smooth composition tailored for both daily refinement and sacred occasions.',
    price: 2499,
    original_price: 2999,
    stock_quantity: 10,
    size: '6ml (Half Tola)',
    sizes: ['3ml (Quarter Tola)', '6ml (Half Tola)', '12ml (1 Tola)'],
    fragrance_type: 'Ambered Oud',
    notes: {
      top: 'Zesty Bergamot, Fresh Coriander',
      heart: 'Sweet Cambodian Oud, Virginia Cedar',
      base: 'Golden Benzoin, Oakmoss, Amber'
    },
    image_url: 'https://images.unsplash.com/photo-1620916297397-a4a5402a3c6c?auto=format&fit=crop&w=900&q=85',
    featured: false,
    published: true
  },
  {
    id: 'attar-11',
    name: 'Green Apple Attar',
    brand: 'KL Perfumes Atelier',
    category: 'Citrus & Fresh',
    description: 'A contemporary fresh attar fusing crisp orchard green apple, fresh mint leaves, and white musk. Vivacious, uplifting, and beautifully persistent in warm weather.',
    price: 1199,
    original_price: null,
    stock_quantity: 15,
    size: '6ml (Half Tola)',
    sizes: ['3ml (Quarter Tola)', '6ml (Half Tola)', '12ml (1 Tola)'],
    fragrance_type: 'Crisp Fruity Fresh',
    notes: {
      top: 'Granny Smith Apple, Crushed Mint',
      heart: 'Dewy Lily of the Valley, Green Tea',
      base: 'Light Sandalwood, Transparent White Musk'
    },
    image_url: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=900&q=85',
    featured: false,
    published: true
  },
  {
    id: 'attar-12',
    name: 'Blue Musk',
    brand: 'KL Perfumes Atelier',
    category: 'Musk',
    description: 'The cool serenity of ocean breeze blended into concentrated perfume oil. Crisp, mineral, and invigorating with an intimate musk aura that keeps you refreshed for hours.',
    price: 1399,
    original_price: 1750,
    stock_quantity: 12,
    size: '6ml (Half Tola)',
    sizes: ['3ml (Quarter Tola)', '6ml (Half Tola)', '12ml (1 Tola)'],
    fragrance_type: 'Aquatic Mineral Musk',
    notes: {
      top: 'Coastal Sea Air Accord, Ozone',
      heart: 'Blue Lotus, French Lavender',
      base: 'Sun-Bleached Driftwood, Pure Skin Musk'
    },
    image_url: 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&w=900&q=85',
    featured: false,
    published: true
  },
  {
    id: 'attar-13',
    name: 'Saffron Oud',
    brand: 'KL Perfumes Atelier',
    category: 'Pure Oud',
    description: 'Fine Kashmiri saffron stigmas married with aged Dehn Al Oud. Rich, intoxicating, and warm with golden leathery facets that evoke ancient caravan trading routes.',
    price: 3299,
    original_price: 3950,
    stock_quantity: 6,
    size: '12ml (1 Tola)',
    sizes: ['3ml (Quarter Tola)', '6ml (Half Tola)', '12ml (1 Tola)'],
    fragrance_type: 'Warm Spicy Oud',
    notes: {
      top: 'Pure Kashmiri Saffron, Pink Pepper',
      heart: 'Indian Dehn Al Oud, Dry Papyrus',
      base: 'Balsamic Amber, Aged Guaiac Wood'
    },
    image_url: 'https://images.unsplash.com/photo-1546554137-f86b9593a222?auto=format&fit=crop&w=900&q=85',
    featured: true,
    published: true
  },
  {
    id: 'attar-14',
    name: 'White Oudh',
    brand: 'KL Perfumes Atelier',
    category: 'Pure Oud',
    description: 'An ethereal, luminous oud crafted for everyday elegance. Bright white florals and white pepper open into a soft, airy woody resonance that never overwhelms.',
    price: 1899,
    original_price: 2300,
    stock_quantity: 9,
    size: '6ml (Half Tola)',
    sizes: ['3ml (Quarter Tola)', '6ml (Half Tola)', '12ml (1 Tola)'],
    fragrance_type: 'Light Ethereal Oud',
    notes: {
      top: 'White Pepper, Sicilian Bergamot',
      heart: 'Delicate Pale Oud, White Magnolia',
      base: 'Crystalline Amber, Soft Cashmere Woods'
    },
    image_url: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=900&q=85',
    featured: false,
    published: true
  },
  {
    id: 'attar-15',
    name: 'Jasmine Bloom',
    brand: 'KL Perfumes Atelier',
    category: 'Floral',
    description: 'Indian Motia (Jasmine Sambac) blossoms harvested before twilight and traditionally infused into sandalwood oil. Intensely heady, romantic, and deeply comforting.',
    price: 1799,
    original_price: 2150,
    stock_quantity: 11,
    size: '6ml (Half Tola)',
    sizes: ['3ml (Quarter Tola)', '6ml (Half Tola)', '12ml (1 Tola)'],
    fragrance_type: 'Pure Jasmine Sambac',
    notes: {
      top: 'Night-Blooming Jasmine Sambac',
      heart: 'Neroli, Sweet Orange Blossom, Ylang Ylang',
      base: 'Pure Sandalwood Oil Base'
    },
    image_url: 'https://images.unsplash.com/photo-1528740561666-dc2479dc08ab?auto=format&fit=crop&w=900&q=85',
    featured: false,
    published: true
  },
  {
    id: 'attar-16',
    name: 'Velvet Amber',
    brand: 'KL Perfumes Atelier',
    category: 'Amber & Woods',
    description: 'A decadent balsamic amber laced with spiced cinnamon, honeyed plum, and sweet Madagascar vanilla pods. Smooth as silk velvet, comforting as an antique shawl.',
    price: 2599,
    original_price: 3100,
    stock_quantity: 8,
    size: '12ml (1 Tola)',
    sizes: ['3ml (Quarter Tola)', '6ml (Half Tola)', '12ml (1 Tola)'],
    fragrance_type: 'Balsamic Sweet Amber',
    notes: {
      top: 'Ceylon Cinnamon Bark, Honeyed Plum',
      heart: 'Dark Amber Resin, Roasted Tonka',
      base: 'Madagascar Vanilla Pods, Dark Cocoa'
    },
    image_url: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?auto=format&fit=crop&w=900&q=85',
    featured: false,
    published: true
  }
];

export async function getProducts() {
  if (!isSupabaseConfigured || !supabase) return demoProducts;
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false });
    if (error || !data || !data.length) return demoProducts;
    return data;
  } catch {
    return demoProducts;
  }
}

export async function getSettings() {
  const defaultSettings = {
    business_name: 'KL PERFUMES',
    whatsapp_number: '919876543210',
    phone_number: '+91 98765 43210',
    contact_email: 'concierge@klperfumes.com',
    instagram_url: 'https://instagram.com/klperfumes',
    announcement: 'Artisanal Traditional Attars & Pure Fragrance Oils · 100% Alcohol-Free',
    store_description: 'KL Perfumes is dedicated to traditional Arabic and Indian attar perfumery. Hand-distilled pure oils, rare oud, and royal amber crafted for fragrance connoisseurs.'
  };

  if (!isSupabaseConfigured || !supabase) {
    return defaultSettings;
  }

  try {
    const { data, error } = await supabase
      .from('store_settings')
      .select('*')
      .eq('id', 1)
      .maybeSingle();
    if (error || !data) return defaultSettings;
    return {
      ...defaultSettings,
      ...data,
      whatsapp_number: data.whatsapp_number || defaultSettings.whatsapp_number
    };
  } catch {
    return defaultSettings;
  }
}

export const money = (n) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(Number(n || 0));

export function whatsappUrl(number, product) {
  const clean = String(number || '919876543210').replace(/\D/g, '');
  const productName = product?.name || 'attar';
  const msg = `Hello KL Perfumes! I'm interested in ${productName} attar. Could you share its availability and details?`;
  return `https://wa.me/${clean}?text=${encodeURIComponent(msg)}`;
}

export function generalWhatsappUrl(number, customMsg) {
  const clean = String(number || '919876543210').replace(/\D/g, '');
  const msg =
    customMsg ||
    "Hello KL Perfumes! I'd like to enquire about your luxury attars and fragrance oils.";
  return `https://wa.me/${clean}?text=${encodeURIComponent(msg)}`;
}

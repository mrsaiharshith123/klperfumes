import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, X, SlidersHorizontal, ArrowLeft, MessageCircle } from 'lucide-react';
import { getProducts, getSettings, generalWhatsappUrl } from '../lib/data';
import ProductCard from '../components/ProductCard';

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [settings, setSettings] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();

  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [sortBy, setSortBy] = useState('featured');
  const [loading, setLoading] = useState(true);

  // Sync category or q from URL params
  useEffect(() => {
    const urlCategory = searchParams.get('category');
    const urlQ = searchParams.get('q');
    if (urlCategory) setCategory(urlCategory);
    if (urlQ) setSearchQuery(urlQ);
  }, [searchParams]);

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      setLoading(true);
      try {
        const [p, s] = await Promise.all([getProducts(), getSettings()]);
        if (!cancelled) {
          setProducts(p);
          setSettings(s);
        }
      } catch (err) {
        console.error('Failed to load shop products:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadData();

    return () => {
      cancelled = true;
    };
  }, []);

  const categories = [
    'All',
    'Pure Oud',
    'Musk',
    'Amber & Woods',
    'Floral',
    'Special Blends',
    'Citrus & Fresh'
  ];

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    if (cat === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (!val.trim()) {
      searchParams.delete('q');
    } else {
      searchParams.set('q', val);
    }
    setSearchParams(searchParams);
  };

  const clearAllFilters = () => {
    setCategory('All');
    setSearchQuery('');
    setSortBy('featured');
    setSearchParams({});
  };

  // Filter products
  const filtered = products
    .filter((p) => {
      if (category !== 'All' && p.category !== category) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesCategory = p.category?.toLowerCase().includes(query);
        const matchesType = p.fragrance_type?.toLowerCase().includes(query);
        const matchesTopNotes = p.notes?.top?.toLowerCase().includes(query);
        const matchesHeartNotes = p.notes?.heart?.toLowerCase().includes(query);
        return matchesName || matchesCategory || matchesType || matchesTopNotes || matchesHeartNotes;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return Number(a.price) - Number(b.price);
      if (sortBy === 'price-high') return Number(b.price) - Number(a.price);
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });

  const whatsappHref = generalWhatsappUrl(
    settings.whatsapp_number,
    "Hello KL Perfumes! I'm browsing your online shop and would like assistance selecting an attar."
  );

  return (
    <main className="shop-page">
      {/* Shop Header Banner */}
      <section className="shop-hero">
        <div className="shop-hero-inner">
          <span className="eyebrow">THE COMPLETE CATALOGUE</span>
          <h1>
            Shop <em>Attars.</em>
          </h1>
          <p>
            16 artisanal fragrance oils, pure dehn al oud, and royal musk compositions.
            Crafted for connoisseurs seeking authentic, alcohol-free fragrance longevity.
          </p>
        </div>
      </section>

      {/* Filter & Controls Bar */}
      <section className="shop-controls-section">
        <div className="shop-controls-wrap">
          {/* Search Box */}
          <div className="shop-search-box">
            <Search size={18} className="shop-search-icon" />
            <input
              type="text"
              placeholder="Search by attar name, note or family..."
              value={searchQuery}
              onChange={handleSearchChange}
              aria-label="Search attars"
            />
            {searchQuery && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={() => handleSearchChange({ target: { value: '' } })}
                aria-label="Clear search"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="shop-sort-wrap">
            <SlidersHorizontal size={15} />
            <label htmlFor="shop-sort" className="sr-only">
              Sort by
            </label>
            <select
              id="shop-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="shop-sort-select"
            >
              <option value="featured">Featured First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="shop-categories-scroll">
          <div className="shop-category-pills">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`category-pill ${category === cat ? 'active' : ''}`}
                onClick={() => handleCategoryChange(cat)}
              >
                {cat === 'All' ? 'All Attars (16)' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Active Filters Summary */}
        <div className="shop-status-row">
          <span>
            SHOWING <b>{filtered.length.toString().padStart(2, '0')} ATTARS</b>
            {category !== 'All' && ` · ${category}`}
            {searchQuery && ` · Matching "${searchQuery}"`}
          </span>

          {(category !== 'All' || searchQuery || sortBy !== 'featured') && (
            <button type="button" className="reset-filters-btn" onClick={clearAllFilters}>
              RESET FILTERS <X size={13} />
            </button>
          )}
        </div>
      </section>

      {/* Product Grid Area */}
      <section className="shop-grid-section">
        {loading ? (
          <div className="page-state">Loading attar collection…</div>
        ) : filtered.length === 0 ? (
          <div className="empty-shop-state">
            <span className="eyebrow">NO MATCHES FOUND</span>
            <h2>No attars matched your search.</h2>
            <p>
              We couldn't find any attars matching "{searchQuery}". Try searching for generic
              notes like "Oud", "Musk", "Rose", or "Amber".
            </p>
            <button type="button" className="button button-gold" onClick={clearAllFilters}>
              VIEW FULL 16 ATTARS
            </button>
          </div>
        ) : (
          <div className="product-grid">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} settings={settings} />
            ))}
          </div>
        )}
      </section>

      {/* Advisory Bottom Banner */}
      <section className="shop-advisory-banner">
        <div className="shop-advisory-inner">
          <div>
            <h3>Need Bespoke Recommendations?</h3>
            <p>
              Our fragrance specialists can help you select the ideal attar for weddings,
              daily wear, meditation, or gifting.
            </p>
          </div>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="button button-gold"
          >
            <MessageCircle size={16} /> ENQUIRE ON WHATSAPP
          </a>
        </div>
      </section>
    </main>
  );
}

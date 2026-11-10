import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  MessageCircle,
  Sparkles,
  ShieldCheck,
  Droplets,
  Flame,
  Award,
  Compass
} from 'lucide-react';
import { getProducts, getSettings, generalWhatsappUrl } from '../lib/data';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [settings, setSettings] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadHomeData() {
      try {
        const [p, s] = await Promise.all([getProducts(), getSettings()]);
        if (!cancelled) {
          setProducts(p);
          setSettings(s);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e?.message || 'Failed to load attar collection');
        }
      }
    }

    loadHomeData();

    return () => {
      cancelled = true;
    };
  }, []);

  const whatsappHref = generalWhatsappUrl(
    settings.whatsapp_number,
    "Hello KL Perfumes! I'd like to enquire about your luxury attars and fragrance oils."
  );

  const categories = ['All', 'Pure Oud', 'Musk', 'Amber & Woods', 'Floral', 'Special Blends'];

  const filteredProducts =
    selectedCategory === 'All'
      ? products
      : products.filter((p) => p.category === selectedCategory);

  return (
    <>
      {/* ===================== HERO SECTION ===================== */}
      <section className="hero-attar">
        <div className="hero-container">
          {/* Hero Copy (Desktop & Mobile Unified Flow) */}
          <div className="hero-content">
            <div className="hero-eyebrow-wrap">
              <span className="hero-eyebrow">
                <i className="gold-dot" /> TRADITIONAL ARABIC &amp; INDIAN PERFUMERY
              </span>
              <span className="hero-badge-pill">100% ALCOHOL-FREE</span>
            </div>

            <h1 className="hero-heading">
              Discover the <br />
              <em>Art of Attar.</em>
            </h1>

            {/* Mobile Integrated Scent Artwork Preview */}
            <div className="hero-mobile-visual" aria-hidden="true">
              <div className="hero-mobile-image-frame">
                <img
                  src="https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=900&q=85"
                  alt="Artisanal Oud Al Malik Attar in warm amber glow"
                />
                <div className="hero-mobile-overlay-gradient" />
                <span className="hero-mobile-stamp">
                  <b>PURE OIL</b>
                  <small>HAND-POURED</small>
                </span>
              </div>
            </div>

            <p className="hero-description">
              Experience timeless fragrances, crafted through the richness of oud,
              musk, amber and traditional fragrance oils.
            </p>

            {/* Action Buttons */}
            <div className="hero-cta-group">
              <Link to="/shop" className="button button-gold hero-primary-btn">
                <span>EXPLORE ATTARS</span>
                <ArrowUpRight size={17} />
              </Link>

              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="button button-outline-gold hero-whatsapp-btn"
              >
                <MessageCircle size={17} />
                <span>ENQUIRE ON WHATSAPP</span>
              </a>
            </div>

            {/* Micro Pillars */}
            <div className="hero-credentials">
              <div className="cred-item">
                <Droplets size={16} className="cred-icon" />
                <div>
                  <strong>Pure Concentrated Oils</strong>
                  <small>Zero alcohol · Uncut sillage</small>
                </div>
              </div>
              <div className="cred-item">
                <Flame size={16} className="cred-icon" />
                <div>
                  <strong>Aged Rare Agarwood</strong>
                  <small>Assam, Trat &amp; Cambodian Oud</small>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Visual Artistry */}
          <div className="hero-artwork-desktop">
            <div className="artwork-composition">
              <div className="artwork-shadow-halo" />
              <div className="artwork-card">
                <img
                  src="https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=1000&q=90"
                  alt="Luxury Oud Al Malik attar flacon under sculptural amber lighting"
                  className="artwork-image"
                />
                <div className="artwork-vignette" />
                <div className="artwork-stamp">
                  <span>ATELIER</span>
                  <b>KL</b>
                  <small>EST. ATELIER</small>
                </div>
                <div className="artwork-caption">
                  <span className="caption-tag">FEATURED ATTAR</span>
                  <h4>Oud Al Malik · Dahn Al Oud</h4>
                  <p>Aged Assam agarwood &amp; smoked birch in crystal tola</p>
                </div>
              </div>
              <div className="artwork-accent-card">
                <Sparkles size={18} className="accent-icon" />
                <div>
                  <b>12+ Hours Sillage</b>
                  <small>Intimately merges with skin warmth</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== HERITAGE STRIP ===================== */}
      <section className="heritage-strip" aria-label="Brand heritage highlights">
        <div className="heritage-strip-inner">
          <div className="heritage-item">
            <ShieldCheck size={18} />
            <span>100% ALCOHOL-FREE OILS</span>
          </div>
          <span className="heritage-separator">✳</span>
          <div className="heritage-item">
            <Droplets size={18} />
            <span>HYDRO-DISTILLED BOTANICALS</span>
          </div>
          <span className="heritage-separator">✳</span>
          <div className="heritage-item">
            <Flame size={18} />
            <span>NATURAL OUD &amp; RARE MUSK</span>
          </div>
          <span className="heritage-separator">✳</span>
          <div className="heritage-item">
            <Award size={18} />
            <span>ARTISANAL DEG &amp; BHAPKA PROCESS</span>
          </div>
        </div>
      </section>

      {/* ===================== ATTAR COLLECTION GRID ===================== */}
      <section id="collection" className="section collection-section">
        <div className="section-header-editorial">
          <div className="header-left">
            <span className="eyebrow">THE ATELIER EDIT</span>
            <h2>
              The Attar <em>Collection.</em>
            </h2>
          </div>
          <p className="header-desc">
            Hand-poured into glass tolas and roll-on vials. Each concentrated oil
            blooms uniquely on your skin without the sharp evaporation of alcohol.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="filter-tabs-row" role="tablist">
          {categories.map((cat) => (
            <button
              key={cat}
              role="tab"
              aria-selected={selectedCategory === cat}
              className={`filter-tab ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat === 'All' ? 'All Attars' : cat}
            </button>
          ))}
        </div>

        {error && <p className="notice notice-error">{error}</p>}

        {/* Product Grid */}
        <div className="product-grid">
          {filteredProducts.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} settings={settings} />
          ))}
        </div>

        {/* View All Shop Link */}
        <div className="collection-bottom-cta">
          <Link to="/shop" className="button button-gold">
            <span>EXPLORE ALL 16 ATTARS IN SHOP</span>
            <ArrowRight size={16} />
          </Link>
          <p className="collection-note">
            Available in 3ml (Quarter Tola), 6ml (Half Tola), and 12ml (1 Full Tola) formats.
          </p>
        </div>
      </section>

      {/* ===================== THE ART OF ATTAR (EDITORIAL STORY) ===================== */}
      <section className="editorial-story-section">
        <div className="story-container">
          <div className="story-image-wrap">
            <img
              src="https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&w=1200&q=85"
              alt="Artisanal oil distillation with precious woods and botanicals"
            />
            <div className="story-quote-card">
              <span className="quote-mark">“</span>
              <p>Attar does not announce you loudly; it draws people closer in reverent curiosity.</p>
              <small>— Master Scent Artisan</small>
            </div>
          </div>

          <div className="story-text-wrap">
            <span className="eyebrow">THE CRAFT OF CONCENTRATION</span>
            <h2>
              Pure Botanical Resonance.<br />
              <em>Zero Alcohol.</em>
            </h2>
            <p className="lead-paragraph">
              Unlike modern Western colognes diluted with 80% alcohol, traditional attar is pure,
              undiluted perfume oil. Distilled from petals, woods, and resins directly into Mysore
              sandalwood or pure oil bases, it becomes an intimate second skin.
            </p>
            <p>
              As your pulse warms the oil, the scent deepens, revealing complex layers over 12 to 24 hours.
              From wild Trat Dehn Al Oud to creamy Musk Al Tahara, each bottle is a celebration of centuries-old
              Eastern perfumery heritage.
            </p>

            <div className="story-features-list">
              <div className="feature-row">
                <span className="feature-bullet">✳</span>
                <div>
                  <strong>Subtle, Intimate Sillage</strong>
                  <p>Smells divine up close without overpowering a room or triggering allergies.</p>
                </div>
              </div>
              <div className="feature-row">
                <span className="feature-bullet">✳</span>
                <div>
                  <strong>True Longevity</strong>
                  <p>Oils adhere naturally to skin lipids and textile fibers for sustained radiance.</p>
                </div>
              </div>
            </div>

            <div className="story-cta-wrap">
              <Link to="/about" className="button button-outline-dark">
                <span>OUR FRAGRANCE PHILOSOPHY</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== RITUAL GUIDE ===================== */}
      <section className="ritual-section">
        <div className="section-header-centered">
          <span className="eyebrow">THE ART OF WEARING ATTAR</span>
          <h2>
            How to Apply <em>Concentrated Oil.</em>
          </h2>
          <p>A few precious drops are all you need for an enduring scent signature.</p>
        </div>

        <div className="ritual-grid">
          <div className="ritual-card">
            <span className="step-num">01</span>
            <h3>Swipe on Pulse Points</h3>
            <p>
              Use the glass dip wand or roll-on applicator to place a drop on your inner wrists,
              behind your earlobes, and the collarbone.
            </p>
          </div>
          <div className="ritual-card highlight">
            <span className="step-num">02</span>
            <h3>Warm, Never Rub</h3>
            <p>
              Gently tap your wrists together to awaken the volatile notes. Never aggressively rub,
              as friction crushes the delicate floral headnotes.
            </p>
          </div>
          <div className="ritual-card">
            <span className="step-num">03</span>
            <h3>Touch to Garments</h3>
            <p>
              Gently graze the palms over your cuffs, collar, or scarf. Pure attar oils hold
              magnificently on wool, linen, and silk for days.
            </p>
          </div>
        </div>
      </section>

      {/* ===================== WHATSAPP ADVISORY BANNER ===================== */}
      <section className="concierge-banner">
        <div className="concierge-inner">
          <div className="concierge-symbol">
            <MessageCircle size={36} />
          </div>
          <div className="concierge-copy">
            <span className="eyebrow">BESPOKE FRAGRANCE CONCIERGE</span>
            <h2>Unsure Which Attar Suits Your Aura?</h2>
            <p>
              Connect directly with our scent advisory over WhatsApp. Share your preferred scent
              family—woody, floral, musk, or sweet—and receive personalized recommendations.
            </p>
          </div>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="button button-gold concierge-btn"
          >
            <MessageCircle size={18} />
            <span>CHAT ON WHATSAPP</span>
          </a>
        </div>
      </section>
    </>
  );
}

import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  MessageCircle,
  ShieldCheck,
  Droplets,
  Sparkles,
  Clock,
  Compass,
  CheckCircle2,
  Share2
} from 'lucide-react';
import { getProducts, getSettings, money, whatsappUrl, generalWhatsappUrl } from '../lib/data';
import ProductCard from '../components/ProductCard';

export default function Product() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadProductData() {
      setLoading(true);
      try {
        const [products, storeSettings] = await Promise.all([getProducts(), getSettings()]);
        if (!cancelled) {
          const found = products.find((x) => String(x.id) === String(id)) || null;
          setProduct(found);
          setAllProducts(products);
          setSettings(storeSettings);
          if (found) {
            setSelectedSize(found.size || '12ml (1 Tola)');
          }
        }
      } catch (err) {
        console.error('Failed to load fragrance details:', err);
        if (!cancelled) {
          setProduct(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProductData();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="page-state">
        <span className="eyebrow">KL PERFUMES ATELIER</span>
        <h2>Loading fragrance oil…</h2>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="page-state not-found-state">
        <span className="eyebrow">ATTAR NOT FOUND</span>
        <h2>This fragrance is currently unavailable.</h2>
        <p>The attar you are looking for may have been archived or renamed.</p>
        <Link to="/shop" className="button button-gold">
          RETURN TO ATTAR COLLECTION
        </Link>
      </div>
    );
  }

  const out = Number(product.stock_quantity) <= 0;
  const isLowStock = Number(product.stock_quantity) > 0 && Number(product.stock_quantity) <= 5;
  const whatsappHref = whatsappUrl(settings.whatsapp_number, product);

  const availableSizes = product.sizes || ['3ml (Quarter Tola)', '6ml (Half Tola)', '12ml (1 Tola)'];

  // Calculate proportional price based on size if selectedSize differs
  const calculatePrice = () => {
    const base = Number(product.price);
    if (selectedSize.includes('3ml')) return Math.round(base * 0.45);
    if (selectedSize.includes('6ml')) return Math.round(base * 0.7);
    return base;
  };

  const currentPrice = calculatePrice();

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${product.name} Attar — KL Perfumes`,
        text: `Explore ${product.name} luxury attar at KL Perfumes`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Related products
  const related = allProducts
    .filter((p) => p.id !== product.id && (p.category === product.category || p.featured))
    .slice(0, 4);

  return (
    <main className="product-detail-page">
      {/* Breadcrumbs */}
      <div className="breadcrumb-bar">
        <div className="breadcrumb-inner">
          <Link to="/" className="breadcrumb-link">
            Home
          </Link>
          <span className="breadcrumb-sep">/</span>
          <Link to="/shop" className="breadcrumb-link">
            Shop Attars
          </Link>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-current">{product.name}</span>
        </div>
      </div>

      <div className="product-detail-container">
        {/* Back Link */}
        <Link to="/shop" className="back-link">
          <ArrowLeft size={16} /> BACK TO ATTARS
        </Link>

        {/* 2-Column Product Layout */}
        <div className="detail-grid">
          {/* Left Column: Large Product Imagery */}
          <div className="detail-media-wrap">
            <div className="detail-image-card">
              <img
                src={
                  product.image_url ||
                  'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=900&q=85'
                }
                alt={`${product.name} pure attar bottle`}
                className="detail-main-image"
              />
              <div className="detail-image-vignette" />
              <div className="detail-image-stamp">
                <span>100% PURE OIL</span>
                <b>ALCOHOL FREE</b>
              </div>
            </div>

            <div className="detail-trust-pills">
              <div className="trust-pill">
                <ShieldCheck size={16} />
                <span>100% Alcohol-Free</span>
              </div>
              <div className="trust-pill">
                <Clock size={16} />
                <span>12+ Hour Longevity</span>
              </div>
              <div className="trust-pill">
                <Droplets size={16} />
                <span>Hand-Poured Glass Tola</span>
              </div>
            </div>
          </div>

          {/* Right Column: Information, Notes & Purchase Actions */}
          <div className="detail-copy-wrap">
            <div className="detail-eyebrow-row">
              <span className="eyebrow">
                {product.brand || 'KL PERFUMES ATELIER'} · {product.category || 'PURE ATTAR'}
              </span>
              <button
                type="button"
                className="share-button"
                onClick={handleShare}
                title="Share this attar"
              >
                <Share2 size={15} />
                <span>{copied ? 'Link Copied!' : 'Share'}</span>
              </button>
            </div>

            <h1 className="detail-title">{product.name}</h1>
            <p className="detail-fragrance-type">{product.fragrance_type || 'Concentrated Fragrance Oil'}</p>

            {/* Price Line */}
            <div className="detail-price-box">
              <div className="detail-price-line">
                <b className="detail-current-price">{money(currentPrice)}</b>
                {product.original_price && selectedSize.includes('12ml') && (
                  <del className="detail-orig-price">{money(product.original_price)}</del>
                )}
              </div>
              <span className="tax-inclusive-tag">Inclusive of all taxes · Express shipping across India</span>
            </div>

            {/* Stock Availability Indicator */}
            <div className="detail-stock-indicator">
              {out ? (
                <span className="stock-pill stock-out">
                  <i className="status-dot red" /> Currently Out of Stock
                </span>
              ) : isLowStock ? (
                <span className="stock-pill stock-low">
                  <i className="status-dot orange" /> Only {product.stock_quantity} bottles remaining in this batch
                </span>
              ) : (
                <span className="stock-pill stock-in">
                  <i className="status-dot green" /> In Stock · Hand-Poured &amp; Ready to Dispatch
                </span>
              )}
            </div>

            {/* Size Selector */}
            <div className="size-selector-block">
              <div className="size-label-row">
                <span className="spec-label">SELECT BOTTLE SIZE:</span>
                <span className="selected-size-name">{selectedSize}</span>
              </div>
              <div className="size-options-grid">
                {availableSizes.map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    className={`size-button ${selectedSize === sz ? 'active' : ''}`}
                    onClick={() => setSelectedSize(sz)}
                  >
                    <span>{sz}</span>
                  </button>
                ))}
              </div>
              <small className="size-tip">
                * Traditional crystal tolas are 12ml. 6ml is a half-tola vial, and 3ml is an artisanal pocket roll-on.
              </small>
            </div>

            {/* Sensory Description */}
            <div className="detail-description-block">
              <h3>Fragrance Character</h3>
              <p>{product.description}</p>
            </div>

            {/* Fragrance Notes Breakdown */}
            {product.notes && (
              <div className="fragrance-pyramid-block">
                <h3>Olfactory Architecture</h3>
                <div className="pyramid-cards">
                  <div className="pyramid-card">
                    <span className="pyramid-level">TOP NOTES</span>
                    <p>{product.notes.top}</p>
                  </div>
                  <div className="pyramid-card highlight-card">
                    <span className="pyramid-level">HEART NOTES</span>
                    <p>{product.notes.heart}</p>
                  </div>
                  <div className="pyramid-card">
                    <span className="pyramid-level">BASE NOTES</span>
                    <p>{product.notes.base}</p>
                  </div>
                </div>
              </div>
            )}

            {/* WhatsApp Enquiry Call-to-Action */}
            <div className="detail-actions-block">
              <a
                className={`button button-whatsapp-primary ${out ? 'disabled' : ''}`}
                href={out ? '#' : whatsappHref}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => out && e.preventDefault()}
              >
                <MessageCircle size={20} />
                <span>
                  {out
                    ? 'CURRENTLY UNAVAILABLE'
                    : `ENQUIRE ABOUT ${product.name.toUpperCase()} ON WHATSAPP`}
                </span>
              </a>

              <p className="enquiry-helper-text">
                <CheckCircle2 size={15} /> Clicking opens a pre-filled WhatsApp message directly to our fragrance concierge.
              </p>
            </div>

            {/* Application & Care Guide */}
            <div className="oil-care-block">
              <h4>Artisanal Attar Care</h4>
              <ul>
                <li>
                  <b>Pure Concentrate:</b> No alcohol diluent. A single swipe on pulse points lasts 12–24 hours.
                </li>
                <li>
                  <b>Storage:</b> Store bottle upright at room temperature away from direct sunlight to preserve delicate floral and resinous top notes.
                </li>
                <li>
                  <b>Skin &amp; Fabrics:</b> Beautifully safe on skin and linen. For light-colored silks, test on an inner hem first.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Attars Section */}
      {related.length > 0 && (
        <section className="related-attars-section">
          <div className="related-header">
            <span className="eyebrow">DISCOVER HARMONIOUS BLENDS</span>
            <h2>You May Also Cherish</h2>
          </div>
          <div className="product-grid">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} settings={settings} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

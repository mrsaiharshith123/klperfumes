import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  Search,
  MessageCircle,
  Instagram,
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { generalWhatsappUrl, demoProducts, money } from '../lib/data';

export function Header({ settings = {} }) {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const whatsappHref = generalWhatsappUrl(
    settings.whatsapp_number,
    "Hello KL Perfumes! I'd like to enquire about your luxury attars and fragrance oils."
  );

  // Close mobile drawer on route change or resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 960) setOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Filter products for quick search modal
  const searchResults = searchQuery.trim()
    ? demoProducts
        .filter(
          (p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.fragrance_type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.notes?.top?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.notes?.heart?.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5)
    : [];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchOpen(false);
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      <header className="site-header">
        {/* Topline Announcement */}
        <div className="topline">
          <div className="topline-inner">
            <span className="topline-badge">ARTISANAL OILS</span>
            <span>{settings.announcement || 'Traditional Pure Attars · 100% Alcohol-Free · Handcrafted Scent Oils'}</span>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="topline-chat-link"
            >
              <MessageCircle size={12} /> Scent Advisory
            </a>
          </div>
        </div>

        {/* Main Navigation Bar */}
        <div className="nav-wrap">
          {/* Brandmark */}
          <Link to="/" className="brandmark" onClick={() => setOpen(false)}>
            <span className="brand-monogram">KL</span>
            <span className="brand-text">
              <b>KL PERFUMES</b>
              <small>TRADITIONAL ATTARS &amp; LUXURY OILS</small>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="nav-links desktop-nav">
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
            >
              Home
            </NavLink>
            <NavLink
              to="/shop"
              className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
            >
              Shop Attars
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
            >
              About Us
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
            >
              Contact Us
            </NavLink>
            <NavLink
              to="/find-us"
              className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
            >
              Find Us
            </NavLink>
          </nav>

          {/* Header Action Icons */}
          <div className="header-actions">
            <button
              type="button"
              className="icon-button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search attars"
              title="Search attar collection"
            >
              <Search size={18} />
            </button>

            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="header-whatsapp-pill"
              title="Chat with our fragrance specialist on WhatsApp"
            >
              <MessageCircle size={15} />
              <span className="whatsapp-label">Enquire</span>
            </a>

            <button
              type="button"
              className="mobile-menu"
              onClick={() => setOpen(!open)}
              aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-Out Drawer */}
        <div className={`mobile-drawer ${open ? 'open' : ''}`}>
          <div className="mobile-drawer-header">
            <span className="brand-monogram-sm">KL</span>
            <span className="mobile-drawer-title">KL PERFUMES ATELIER</span>
            <button
              className="mobile-drawer-close"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>

          <div className="mobile-drawer-search">
            <form onSubmit={handleSearchSubmit}>
              <Search size={16} />
              <input
                type="text"
                placeholder="Search oud, musk, amber..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>

          <nav className="mobile-nav-links">
            <NavLink to="/" onClick={() => setOpen(false)}>
              <span>Home</span>
              <ArrowRight size={14} />
            </NavLink>
            <NavLink to="/shop" onClick={() => setOpen(false)}>
              <span>Shop Attars</span>
              <span className="drawer-badge">16 Blends</span>
            </NavLink>
            <NavLink to="/about" onClick={() => setOpen(false)}>
              <span>About Us</span>
              <ArrowRight size={14} />
            </NavLink>
            <NavLink to="/contact" onClick={() => setOpen(false)}>
              <span>Contact Us</span>
              <ArrowRight size={14} />
            </NavLink>
            <NavLink to="/find-us" onClick={() => setOpen(false)}>
              <span>Find Us</span>
              <ArrowRight size={14} />
            </NavLink>
          </nav>

          <div className="mobile-drawer-footer">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="button button-gold mobile-whatsapp-cta"
            >
              <MessageCircle size={16} /> ENQUIRE ON WHATSAPP
            </a>
            <div className="drawer-note">
              <ShieldCheck size={14} /> 100% Pure Alcohol-Free Fragrance Oils
            </div>
          </div>
        </div>
        {open && <div className="drawer-backdrop" onClick={() => setOpen(false)} />}
      </header>

      {/* Quick Search Modal */}
      {searchOpen && (
        <div className="search-modal-backdrop" onClick={() => setSearchOpen(false)}>
          <div
            className="search-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="search-modal-top">
              <Search size={20} className="modal-search-icon" />
              <input
                type="text"
                autoFocus
                placeholder="Search by attar name, note, or family (e.g. Oud, Musk, Rose, Amber)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSearchSubmit(e);
                  if (e.key === 'Escape') setSearchOpen(false);
                }}
              />
              <button
                className="search-modal-close"
                onClick={() => setSearchOpen(false)}
                aria-label="Close search"
              >
                <X size={18} />
              </button>
            </div>

            <div className="search-modal-body">
              {searchQuery.trim() === '' ? (
                <div className="search-modal-suggestions">
                  <span className="eyebrow">POPULAR ATTAR SEARCHES</span>
                  <div className="suggestion-tags">
                    {['Oud Al Malik', 'White Musk', 'Rose Taifi', 'Royal Amber', 'Dehn Al Oud', 'Musk Al Tahara'].map(
                      (tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => setSearchQuery(tag)}
                        >
                          {tag}
                        </button>
                      )
                    )}
                  </div>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="search-modal-results">
                  <span className="eyebrow">MATCHING ATTARS ({searchResults.length})</span>
                  {searchResults.map((product) => (
                    <Link
                      key={product.id}
                      to={`/product/${product.id}`}
                      className="search-result-item"
                      onClick={() => setSearchOpen(false)}
                    >
                      <img src={product.image_url} alt={product.name} />
                      <div className="result-info">
                        <h4>{product.name}</h4>
                        <span className="result-type">{product.fragrance_type || product.category}</span>
                        {product.notes?.top && (
                          <small className="result-notes">Notes: {product.notes.top}</small>
                        )}
                      </div>
                      <b className="result-price">{money(product.price)}</b>
                    </Link>
                  ))}
                  <button
                    type="button"
                    className="view-all-results-btn"
                    onClick={handleSearchSubmit}
                  >
                    View full results in Shop <ArrowRight size={14} />
                  </button>
                </div>
              ) : (
                <div className="search-empty">
                  <p>No attars found matching "{searchQuery}".</p>
                  <small>Try searching for "Oud", "Musk", "Rose", "Amber", or "Sandalwood".</small>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function Footer({ settings = {} }) {
  const currentYear = new Date().getFullYear();
  const whatsappHref = generalWhatsappUrl(
    settings.whatsapp_number,
    "Hello KL Perfumes! I'd like to enquire about your traditional attars and fragrance oils."
  );

  return (
    <footer className="footer">
      <div className="footer-main">
        {/* Brand Column */}
        <div className="footer-brand-col">
          <Link to="/" className="brandmark footer-brand">
            <span className="brand-monogram">KL</span>
            <span className="brand-text">
              <b>KL PERFUMES</b>
              <small>TRADITIONAL ATTARS &amp; LUXURY OILS</small>
            </span>
          </Link>
          <p className="footer-bio">
            KL Perfumes honors the timeless legacy of Arabian and Indian artisanal attars.
            Pure, 100% alcohol-free concentrated fragrance oils hand-poured with sacred agarwood,
            rare amber, and precious floral essences.
          </p>
          <div className="footer-heritage-badge">
            <Sparkles size={14} />
            <span>Pure Concentrated Perfume Oils · Artisanal Quality</span>
          </div>
        </div>

        {/* Navigation Column */}
        <div className="footer-nav-col">
          <h4>EXPLORE</h4>
          <Link to="/">Home</Link>
          <Link to="/shop">Shop Attars</Link>
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact Us</Link>
          <Link to="/find-us">Find Us</Link>
        </div>

        {/* Traditional Collections Column */}
        <div className="footer-collections-col">
          <h4>COLLECTIONS</h4>
          <Link to="/shop?category=Pure%20Oud">Pure Dehn Al Oud</Link>
          <Link to="/shop?category=Musk">Royal Musk &amp; Tahara</Link>
          <Link to="/shop?category=Amber%20%26%20Woods">Golden Amber &amp; Woods</Link>
          <Link to="/shop?category=Floral">Rose Taifi &amp; Jasmine</Link>
          <Link to="/shop?category=Special%20Blends">Oriental Mukhallats</Link>
        </div>

        {/* Connect & Concierge Column */}
        <div className="footer-contact-col">
          <h4>CONCIERGE &amp; INQUIRIES</h4>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="footer-contact-item highlight"
          >
            <MessageCircle size={15} /> WhatsApp Consultation
          </a>
          {settings.contact_email && (
            <a
              href={`mailto:${settings.contact_email}`}
              className="footer-contact-item"
            >
              <Mail size={15} /> {settings.contact_email}
            </a>
          )}
          {settings.instagram_url && (
            <a
              href={settings.instagram_url}
              target="_blank"
              rel="noreferrer"
              className="footer-contact-item"
            >
              <Instagram size={15} /> Instagram
            </a>
          )}
          <div className="footer-hours">
            <Clock size={14} />
            <span>Mon – Sat: 11:00 AM – 9:00 PM</span>
          </div>
          <Link to="/admin" className="admin-portal-link">
            Atelier Portal
          </Link>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <span>
          © {currentYear} KL Perfumes. All rights reserved. Handcrafted for fragrance connoisseurs.
        </span>
        <span className="footer-motto">AUTHENTIC ATTAR PERFUMERY · 100% ALCOHOL-FREE</span>
      </div>
    </footer>
  );
}

export function FloatingWhatsApp({ settings = {} }) {
  const whatsappHref = generalWhatsappUrl(
    settings.whatsapp_number,
    "Hello KL Perfumes! I'd like to enquire about your luxury attars and fragrance oils."
  );

  return (
    <aside
      className="floating-whatsapp-wrap"
      aria-label="Contact KL Perfumes on WhatsApp"
    >
      <a
        href={whatsappHref}
        target="_blank"
        rel="noreferrer"
        className="floating-whatsapp-btn"
        aria-label="Chat on WhatsApp"
      >
        <span className="floating-pulse-ring" />
        <MessageCircle size={24} />
        <span className="floating-tooltip">Enquire on WhatsApp</span>
      </a>
    </aside>
  );
}

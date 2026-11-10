import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, MessageCircle } from 'lucide-react';
import { money, whatsappUrl } from '../lib/data';

export default function ProductCard({ product, settings = {} }) {
  const out = Number(product.stock_quantity) <= 0;
  const whatsappHref = whatsappUrl(settings.whatsapp_number, product);

  return (
    <article className="product-card group">
      <Link to={`/product/${product.id}`} className="product-image">
        <img
          src={
            product.image_url ||
            'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=900&q=85'
          }
          alt={product.name}
          loading="lazy"
        />
        <div className="image-overlay-vignette" />
        {product.original_price && !out && (
          <span className="image-tag gold-tag">SPECIAL PRICE</span>
        )}
        {out ? (
          <span className="image-tag sold-tag">SOLD OUT</span>
        ) : (
          <span className="image-tag size-tag">{product.size || 'PURE ATTAR'}</span>
        )}
        <span className="quick-view" title="View details">
          <ArrowUpRight size={16} />
        </span>
      </Link>

      <div className="product-meta">
        <div className="product-family">
          <span>{product.fragrance_type || product.category || 'CONCENTRATED ATTAR'}</span>
          <span className="pure-oil-indicator">PURE OIL</span>
        </div>

        <Link to={`/product/${product.id}`} className="product-title-link">
          <h3>{product.name}</h3>
        </Link>

        {product.notes?.top && (
          <p className="product-notes-preview">
            <b>Key notes:</b> {product.notes.top}
          </p>
        )}

        <div className="product-card-bottom">
          <div className="price-line">
            <b>{money(product.price)}</b>
            {product.original_price && <del>{money(product.original_price)}</del>}
          </div>

          <a
            href={out ? '#' : whatsappHref}
            target="_blank"
            rel="noreferrer"
            className={`card-whatsapp-btn ${out ? 'disabled' : ''}`}
            onClick={(e) => out && e.preventDefault()}
            title="Enquire on WhatsApp"
            aria-label={`Enquire about ${product.name} on WhatsApp`}
          >
            <MessageCircle size={15} />
            <span>Enquire</span>
          </a>
        </div>
      </div>
    </article>
  );
}

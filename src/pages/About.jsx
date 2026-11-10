import React from 'react';
import { Link } from 'react-router-dom';
import {
  Droplets,
  ShieldCheck,
  Flame,
  Sparkles,
  ArrowRight,
  MessageCircle,
  Clock,
  Compass
} from 'lucide-react';
import { generalWhatsappUrl } from '../lib/data';

export default function About({ settings = {} }) {
  const whatsappHref = generalWhatsappUrl(
    settings.whatsapp_number,
    "Hello KL Perfumes! I've been reading your story on the website and would love to consult with your fragrance specialist."
  );

  return (
    <main className="about-page">
      {/* Hero Header */}
      <section className="about-hero">
        <div className="about-hero-inner">
          <span className="eyebrow">THE ATELIER MANIFESTO</span>
          <h1>
            The Ancient Art of Attar, <br />
            <em>Refined for Today.</em>
          </h1>
          <p>
            At KL Perfumes, we hold reverence for the ancient Eastern craft of pure fragrance oils.
            No alcohol diluents, no synthetic shortcuts—only the sacred warmth of nature's finest essences.
          </p>
        </div>
      </section>

      {/* Editorial Intro with Photography */}
      <section className="about-story-section">
        <div className="about-story-grid">
          <div className="about-story-media">
            <div className="about-image-card">
              <img
                src="https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&w=1100&q=85"
                alt="Traditional botanical distillation and precious fragrance oils"
              />
              <div className="about-stamp">
                <b>100%</b>
                <span>ALCOHOL FREE</span>
              </div>
            </div>
            <div className="about-quote-box">
              <p>
                “Fragrance is not meant to project an illusion; it is meant to become an indelible part of your skin’s own story.”
              </p>
            </div>
          </div>

          <div className="about-story-text">
            <span className="eyebrow">OUR DEVOTION</span>
            <h2>
              Why Traditional Attars Matter in a <em>Modern World.</em>
            </h2>
            <p className="lead-text">
              In an era dominated by mass-produced Western colognes—where up to 85% of a bottle is
              industrial ethanol—KL Perfumes returns to the meditative purity of concentrated fragrance oils.
            </p>
            <p>
              Attar is an intimate, ancient olfactory tradition originating in the fragrant valleys of
              Kannauj, the rose mountains of Taif, and the agarwood forests of Assam and Southeast Asia.
              Flowers, roots, spices, and resins are gently hydro-distilled in sealed copper vessels,
              capturing their true soul in an oil base.
            </p>
            <p>
              When applied with a traditional glass wand, the oil does not abruptly evaporate into the room.
              Instead, it melts into your pulse points, radiating softly and blooming richer as your body
              temperature shifts throughout the hours.
            </p>

            <div className="about-stats-row">
              <div className="stat-card">
                <b>0%</b>
                <span>Alcohol Dilution</span>
              </div>
              <div className="stat-card">
                <b>12–24h</b>
                <span>Skin Persistence</span>
              </div>
              <div className="stat-card">
                <b>100%</b>
                <span>Pure Oil Essence</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Pillars */}
      <section className="philosophy-section">
        <div className="section-header-centered">
          <span className="eyebrow">OUR THREE CORNERSTONES</span>
          <h2>The KL Perfumes Philosophy</h2>
          <p>Guided by authenticity, botanical respect, and enduring scent craftsmanship.</p>
        </div>

        <div className="philosophy-grid">
          <div className="philosophy-card">
            <div className="pillar-icon-box">
              <Droplets size={26} />
            </div>
            <h3>Purity Over Projection</h3>
            <p>
              We reject harsh chemical dispersants and loud, synthetic opening notes that cause
              headaches. Our attars stay close to the skin, creating an alluring, intimate aura
              noticed only by those you invite into your personal space.
            </p>
          </div>

          <div className="philosophy-card highlight">
            <div className="pillar-icon-box">
              <Flame size={26} />
            </div>
            <h3>Sacred Ingredients</h3>
            <p>
              From aged Assam Dehn Al Oud to pure mountain Taif roses, Mysore sandalwood heartwood,
              and sun-cured vanilla resins, our collection features noble raw materials chosen for
              their depth, soul, and spiritual tranquility.
            </p>
          </div>

          <div className="philosophy-card">
            <div className="pillar-icon-box">
              <ShieldCheck size={26} />
            </div>
            <h3>Hand-Poured With Care</h3>
            <p>
              Every crystal tola and roll-on vial is inspected and hand-poured in small artisanal
              batches. We ensure that every customer receives fresh, unadulterated perfume oil
              prepared with uncompromising integrity.
            </p>
          </div>
        </div>
      </section>

      {/* The Difference: Attar vs Spray Perfume */}
      <section className="comparison-section">
        <div className="comparison-container">
          <div className="section-header-editorial">
            <div className="header-left">
              <span className="eyebrow">AN HONEST COMPARISON</span>
              <h2>
                Traditional Attar vs. <em>Commercial Spray Perfumes.</em>
              </h2>
            </div>
            <p className="header-desc">
              Understanding why discerning scent enthusiasts are moving away from alcohol sprays and
              embracing the time-tested richness of oil attars.
            </p>
          </div>

          <div className="comparison-table-wrap">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>CHARACTERISTIC</th>
                  <th className="highlight-th">KL PERFUMES TRADITIONAL ATTARS</th>
                  <th>ORDINARY SPRAY COLOGNES</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <b>Base Carrier</b>
                  </td>
                  <td className="highlight-td">
                    <span className="check-badge">✓</span> 100% Pure Botanical &amp; Fragrance Oil Base
                  </td>
                  <td>75% – 90% Industrial Denatured Alcohol</td>
                </tr>
                <tr>
                  <td>
                    <b>Skin Experience</b>
                  </td>
                  <td className="highlight-td">
                    <span className="check-badge">✓</span> Non-drying, nourishing, gentle on sensitive skin
                  </td>
                  <td>Can cause dryness, sting, and alcohol irritation</td>
                </tr>
                <tr>
                  <td>
                    <b>Longevity</b>
                  </td>
                  <td className="highlight-td">
                    <span className="check-badge">✓</span> 12 to 24+ Hours (Oils adhere naturally to skin lipids)
                  </td>
                  <td>2 to 5 Hours (Rapid evaporative loss)</td>
                </tr>
                <tr>
                  <td>
                    <b>Sillage Character</b>
                  </td>
                  <td className="highlight-td">
                    <span className="check-badge">✓</span> Intimate, dignified, evolves with your body heat
                  </td>
                  <td>Loud initial chemical blast, quickly dissipates</td>
                </tr>
                <tr>
                  <td>
                    <b>Spiritual Purity</b>
                  </td>
                  <td className="highlight-td">
                    <span className="check-badge">✓</span> 100% Halal / Alcohol-Free for prayers &amp; meditation
                  </td>
                  <td>Contains alcohol diluents</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="about-cta-section">
        <div className="about-cta-inner">
          <span className="eyebrow">YOUR SIGNATURE JOURNEY</span>
          <h2>
            Find the Attar that Feels Like <em>You.</em>
          </h2>
          <p>
            Explore our curated 16-attar collection or speak directly with our perfumery concierge
            to match a scent to your personality and occasions.
          </p>
          <div className="about-cta-buttons">
            <Link to="/shop" className="button button-gold">
              EXPLORE ATTAR CATALOGUE <ArrowRight size={16} />
            </Link>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="button button-outline-gold"
            >
              <MessageCircle size={16} /> CONCIERGE ON WHATSAPP
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

import React from 'react';
import {
  MapPin,
  Clock,
  Navigation,
  MessageCircle,
  Phone,
  Sparkles,
  Building2,
  CalendarCheck
} from 'lucide-react';
import { generalWhatsappUrl } from '../lib/data';

export default function FindUs({ settings = {} }) {
  const hasConfiguredAddress = Boolean(settings.address && settings.maps_embed_url);
  const whatsappNumber = settings.whatsapp_number || '919876543210';
  const displayPhone = settings.phone_number || `+${whatsappNumber}`;

  const appointmentWhatsappHref = generalWhatsappUrl(
    whatsappNumber,
    "Hello KL Perfumes! I would like to enquire about visiting your boutique showroom or scheduling a private scent consultation."
  );

  return (
    <main className="find-us-page">
      {/* Hero Header */}
      <section className="find-us-hero">
        <div className="find-us-hero-inner">
          <span className="eyebrow">BOUTIQUE ATELIER &amp; SHOWROOM</span>
          <h1>
            Find <em>KL Perfumes.</em>
          </h1>
          <p>
            Experience the tactile warmth of pure attar oils, hand-carved sandalwood wands,
            and crystal tola flacons.
          </p>
        </div>
      </section>

      <section className="find-us-content-section">
        <div className="find-us-container">
          {/* Main Showroom Card */}
          <div className="location-card-grid">
            {/* Left: Location Details or Professional Placeholder */}
            <div className="location-info-panel">
              <div className="location-status-badge">
                <Sparkles size={14} />
                <span>
                  {hasConfiguredAddress
                    ? 'FLAGSHIP BOUTIQUE'
                    : 'FLAGSHIP SHOWROOM · LOCATION UPDATE IN PROGRESS'}
                </span>
              </div>

              <h2>KL Perfumes Flagship Atelier</h2>

              {hasConfiguredAddress ? (
                <div className="configured-address-block">
                  <div className="info-row">
                    <MapPin size={22} className="info-icon" />
                    <div>
                      <strong>Boutique Address</strong>
                      <p>{settings.address}</p>
                    </div>
                  </div>

                  <a
                    href={settings.maps_directions_url || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="button button-gold directions-btn"
                  >
                    <Navigation size={16} />
                    <span>GET DIRECTIONS ON GOOGLE MAPS</span>
                  </a>
                </div>
              ) : (
                <div className="location-placeholder-block">
                  <div className="placeholder-alert">
                    <Building2 size={24} className="placeholder-icon" />
                    <div>
                      <strong>Showroom Address Announcement Coming Soon</strong>
                      <p>
                        We are currently preparing our dedicated flagship showroom for private olfactory
                        tastings. Exact street coordinates and embedded map navigation will be updated here shortly.
                      </p>
                    </div>
                  </div>

                  <div className="placeholder-dispatch-note">
                    <span className="bullet-star">✳</span>
                    <p>
                      <b>Online Orders &amp; Nationwide Delivery Active:</b> All 16 attars and luxury
                      tolas are available for express, secure courier dispatch across India.
                    </p>
                  </div>

                  <div className="placeholder-actions">
                    <a
                      href={appointmentWhatsappHref}
                      target="_blank"
                      rel="noreferrer"
                      className="button button-gold appointment-btn"
                    >
                      <CalendarCheck size={16} />
                      <span>REQUEST PRIVATE APPOINTMENT</span>
                    </a>
                  </div>
                </div>
              )}

              {/* Hours of Operation */}
              <div className="showroom-hours-block">
                <div className="hours-header">
                  <Clock size={18} />
                  <h3>Store &amp; Consultation Hours</h3>
                </div>
                <div className="hours-table">
                  <div className="hours-row">
                    <span>Monday – Friday</span>
                    <b>11:00 AM – 9:00 PM IST</b>
                  </div>
                  <div className="hours-row">
                    <span>Saturday</span>
                    <b>11:00 AM – 9:00 PM IST</b>
                  </div>
                  <div className="hours-row highlight-hours">
                    <span>Sunday</span>
                    <b>12:00 PM – 8:00 PM IST</b>
                  </div>
                </div>
              </div>

              {/* Telephone & Inquiries */}
              <div className="showroom-phone-block">
                <Phone size={18} />
                <div>
                  <span>Boutique Inquiries &amp; Orders:</span>
                  <a href={`tel:${displayPhone}`}><b>{displayPhone}</b></a>
                </div>
              </div>
            </div>

            {/* Right: Map Embed or Professional Architectural Map Frame */}
            <div className="location-map-panel">
              {hasConfiguredAddress && settings.maps_embed_url ? (
                <div className="map-frame-wrap">
                  <iframe
                    title="KL Perfumes Boutique Location"
                    src={settings.maps_embed_url}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              ) : (
                <div className="map-placeholder-frame">
                  <div className="map-placeholder-inner">
                    <div className="compass-visual">
                      <div className="compass-ring">
                        <Navigation size={32} className="compass-pointer" />
                      </div>
                    </div>
                    <h3>Interactive Map Integration</h3>
                    <p>
                      Precise GPS coordinates and interactive Google Maps directions will be enabled
                      upon public showroom unveiling.
                    </p>
                    <div className="map-status-pill">
                      <span className="live-dot" /> Showroom Details Being Finalized
                    </div>
                    <a
                      href={appointmentWhatsappHref}
                      target="_blank"
                      rel="noreferrer"
                      className="button button-outline-gold map-placeholder-cta"
                    >
                      <MessageCircle size={15} />
                      <span>INQUIRE VIA WHATSAPP</span>
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

import React, { useState } from 'react';
import {
  MessageCircle,
  Phone,
  Mail,
  Instagram,
  Clock,
  Send,
  CheckCircle2,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { generalWhatsappUrl } from '../lib/data';

export default function Contact({ settings = {} }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    scentPreference: 'Oud & Resins',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const whatsappNumber = settings.whatsapp_number || '919876543210';
  const email = settings.contact_email || 'concierge@klperfumes.com';
  const instagram = settings.instagram_url || 'https://instagram.com/klperfumes';
  const displayPhone = settings.phone_number || (whatsappNumber ? `+${whatsappNumber}` : '+91 98765 43210');

  const mainWhatsappHref = generalWhatsappUrl(
    whatsappNumber,
    "Hello KL Perfumes! I'd like to consult with your fragrance specialist regarding your attar collection."
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const formattedMsg = `Hello KL Perfumes! My name is ${formData.name || 'a customer'}. I am interested in ${formData.scentPreference} attars. ${formData.message ? `Notes: ${formData.message}` : ''}`;
    const url = generalWhatsappUrl(whatsappNumber, formattedMsg);
    setSubmitted(true);
    window.open(url, '_blank');
  };

  return (
    <main className="contact-page">
      {/* Hero Header */}
      <section className="contact-hero">
        <div className="contact-hero-inner">
          <span className="eyebrow">PERSONAL FRAGRANCE ADVISORY</span>
          <h1>
            Contact Our <em>Concierge.</em>
          </h1>
          <p>
            Whether you seek personal scent recommendations, bespoke bridal tolas,
            or guidance on traditional oud application, our team is at your service.
          </p>
        </div>
      </section>

      <section className="contact-main-section">
        <div className="contact-layout-grid">
          {/* Left Column: Direct Contact Channels */}
          <div className="contact-cards-col">
            {/* Primary WhatsApp Card */}
            <div className="contact-card primary-whatsapp-card">
              <div className="card-top-icon">
                <MessageCircle size={28} />
              </div>
              <span className="eyebrow">FASTEST RESPONSE</span>
              <h2>WhatsApp Consultation</h2>
              <p>
                Connect instantly with our master scent advisor for immediate stock confirmation,
                personalized olfactory advice, and private ordering.
              </p>
              <a
                href={mainWhatsappHref}
                target="_blank"
                rel="noreferrer"
                className="button button-gold contact-card-btn"
              >
                <MessageCircle size={18} />
                <span>CHAT ON WHATSAPP</span>
              </a>
              <small className="availability-hint">
                <i className="status-dot green" /> Typically replies within 15 minutes
              </small>
            </div>

            {/* Contact Details Grid */}
            <div className="contact-details-grid">
              {/* Phone */}
              <div className="detail-item-box">
                <Phone size={20} className="detail-icon" />
                <div>
                  <span className="detail-label">DIRECT CONCIERGE LINE</span>
                  <a href={`tel:${displayPhone}`} className="detail-value">
                    {displayPhone}
                  </a>
                  <small>Available during boutique hours</small>
                </div>
              </div>

              {/* Email */}
              <div className="detail-item-box">
                <Mail size={20} className="detail-icon" />
                <div>
                  <span className="detail-label">ELECTRONIC INQUIRIES</span>
                  <a href={`mailto:${email}`} className="detail-value">
                    {email}
                  </a>
                  <small>For bespoke corporate &amp; bridal gifting</small>
                </div>
              </div>

              {/* Instagram */}
              <div className="detail-item-box">
                <Instagram size={20} className="detail-icon" />
                <div>
                  <span className="detail-label">OFFICIAL INSTAGRAM</span>
                  <a
                    href={instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="detail-value"
                  >
                    @klperfumes
                  </a>
                  <small>Behind the scenes &amp; distillation videos</small>
                </div>
              </div>

              {/* Hours */}
              <div className="detail-item-box">
                <Clock size={20} className="detail-icon" />
                <div>
                  <span className="detail-label">BOUTIQUE ADVISORY HOURS</span>
                  <p className="detail-value text-small">
                    Monday – Saturday: 11:00 AM – 9:00 PM <br />
                    Sunday: 12:00 PM – 8:00 PM (IST)
                  </p>
                  <small>Online orders dispatched daily</small>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Scent Consultation Request Form */}
          <div className="contact-form-col">
            <div className="form-shell-card">
              <span className="eyebrow">SCHEDULE A CONSULTATION</span>
              <h2>Send an Olfactory Inquiry</h2>
              <p>
                Fill in your preferences below to launch a structured consultation with our
                fragrance specialists over WhatsApp.
              </p>

              {submitted && (
                <div className="form-success-banner">
                  <CheckCircle2 size={18} />
                  <span>
                    Your inquiry has been opened in WhatsApp! We look forward to guiding your
                    scent discovery.
                  </span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="contact-form">
                <label className="form-label">
                  Your Full Name *
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tariq Khan"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </label>

                <label className="form-label">
                  WhatsApp Contact Number *
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </label>

                <label className="form-label">
                  Preferred Scent Profile
                  <select
                    value={formData.scentPreference}
                    onChange={(e) =>
                      setFormData({ ...formData, scentPreference: e.target.value })
                    }
                  >
                    <option value="Pure Aged Oud (Assam / Trat)">Pure Aged Oud (Assam / Trat)</option>
                    <option value="Velvet Musk & Cream Tahara">Velvet Musk &amp; Cream Tahara</option>
                    <option value="Golden Amber & Resins">Golden Amber &amp; Resins</option>
                    <option value="Taif Rose & Jasmine Florals">Taif Rose &amp; Jasmine Florals</option>
                    <option value="Sandalwood & Precious Woods">Sandalwood &amp; Precious Woods</option>
                    <option value="Custom Royal Mukhallat">Custom Royal Mukhallat</option>
                  </select>
                </label>

                <label className="form-label">
                  Tell Us About Your Requirement
                  <textarea
                    rows="4"
                    placeholder="Looking for a signature daily attar, wedding gift, meditation oil, or guidance on notes..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </label>

                <button type="submit" className="button button-gold form-submit-btn">
                  <Send size={16} />
                  <span>START CONSULTATION ON WHATSAPP</span>
                </button>

                <div className="form-security-note">
                  <ShieldCheck size={14} />
                  <span>Your contact details are strictly used for personalized scent consultation.</span>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

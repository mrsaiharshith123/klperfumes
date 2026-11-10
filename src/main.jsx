import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Product from './pages/Product';
import About from './pages/About';
import Contact from './pages/Contact';
import FindUs from './pages/FindUs';
import Admin from './pages/Admin';
import { Header, Footer, FloatingWhatsApp } from './components/Layout';
import { getSettings } from './lib/data';
import './style.css';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function StorePage({ settings, children }) {
  return (
    <>
      <Header settings={settings} />
      {children}
      <Footer settings={settings} />
      <FloatingWhatsApp settings={settings} />
    </>
  );
}

function Site() {
  const [settings, setSettings] = useState({});

  useEffect(() => {
    let cancelled = false;

    async function loadSettings() {
      try {
        const storeSettings = await getSettings();
        if (!cancelled) {
          setSettings(storeSettings);
        }
      } catch (error) {
        console.error('Could not load store settings:', error);
      }
    }

    loadSettings();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<StorePage settings={settings}><Home /></StorePage>} />
        <Route path="/shop" element={<StorePage settings={settings}><Shop /></StorePage>} />
        <Route path="/product/:id" element={<StorePage settings={settings}><Product /></StorePage>} />
        <Route path="/about" element={<StorePage settings={settings}><About settings={settings} /></StorePage>} />
        <Route path="/contact" element={<StorePage settings={settings}><Contact settings={settings} /></StorePage>} />
        <Route path="/find-us" element={<StorePage settings={settings}><FindUs settings={settings} /></StorePage>} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('KL Perfumes render error:', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <main style={{ minHeight: '100vh', padding: '48px 7%', background: '#241A16', color: '#F5EFE5', fontFamily: 'sans-serif' }}>
          <p style={{ letterSpacing: '.18em', fontSize: 11, color: '#B39462' }}>KL PERFUMES ATELIER · NOTICE</p>
          <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, color: '#F5EFE5' }}>The storefront encountered an issue.</h1>
          <p style={{ color: '#DCCBB3' }}>Open the browser developer console (F12 → Console) for technical diagnostics.</p>
          <pre style={{ whiteSpace: 'pre-wrap', background: '#352520', color: '#DCCBB3', padding: 16, overflowWrap: 'anywhere', border: '1px solid #493328' }}>
            {String(this.state.error.message || this.state.error)}
          </pre>
        </main>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppErrorBoundary>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Site />
      </BrowserRouter>
    </AppErrorBoundary>
  </React.StrictMode>
);

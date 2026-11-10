import React, { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { money } from '../lib/data';
import {
  Package,
  Tag,
  Settings,
  LogOut,
  Plus,
  Edit2,
  Trash2,
  ImagePlus,
  X,
  Save,
  AlertCircle
} from 'lucide-react';

const blank = {
  name: '',
  brand: 'KL Perfumes Atelier',
  category: 'Pure Oud',
  description: '',
  price: '',
  original_price: '',
  stock_quantity: 10,
  size: '12ml (1 Tola)',
  fragrance_type: '',
  image_url: '',
  featured: false,
  published: true
};

export default function Admin() {
  const [session, setSession] = useState(null);
  const [allowed, setAllowed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tab, setTab] = useState('products');
  const [showForm, setShowForm] = useState(false);
  const [products, setProducts] = useState([]);
  const [offers, setOffers] = useState([]);
  const [settings, setSettings] = useState({});
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(blank);
  const [offerForm, setOfferForm] = useState({
    title: '',
    description: '',
    starts_at: '',
    ends_at: '',
    active: true
  });
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  async function loadAll() {
    if (!supabase) return;
    try {
      const [p, o, s] = await Promise.all([
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('offers').select('*').order('created_at', { ascending: false }),
        supabase.from('store_settings').select('*').eq('id', 1).maybeSingle()
      ]);
      if (!p.error) setProducts(p.data || []);
      if (!o.error) setOffers(o.data || []);
      if (!s.error) setSettings(s.data || {});
    } catch (err) {
      console.error('Failed to load admin data:', err);
    }
  }

  async function checkAdminStatus() {
    if (!supabase) {
      setChecking(false);
      return false;
    }
    setChecking(true);
    try {
      const { data, error } = await supabase.rpc('is_admin');
      const isAdmin = !error && data === true;
      setAllowed(isAdmin);
      setChecking(false);
      if (isAdmin) {
        await loadAll();
      }
      return isAdmin;
    } catch (err) {
      console.error('Check admin failed:', err);
      setAllowed(false);
      setChecking(false);
      return false;
    }
  }

  useEffect(() => {
    let cancelled = false;

    if (!supabase) {
      setChecking(false);
      return;
    }

    async function initSession() {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (cancelled) return;
        if (error) {
          console.error('Get session error:', error);
          setChecking(false);
          return;
        }
        setSession(data?.session || null);
        if (data?.session) {
          await checkAdminStatus();
        } else {
          setChecking(false);
        }
      } catch (err) {
        console.error('Auth error:', err);
        if (!cancelled) setChecking(false);
      }
    }

    initSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, s) => {
      if (cancelled) return;
      setSession(s);
      if (s) {
        checkAdminStatus();
      } else {
        setAllowed(false);
        setChecking(false);
      }
    });

    return () => {
      cancelled = true;
      if (authListener?.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  async function login(e) {
    e.preventDefault();
    setBusy(true);
    setMessage('');
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setMessage(error.message);
      }
    } catch (err) {
      setMessage(err.message || 'Login failed');
    } finally {
      setBusy(false);
    }
  }

  async function saveProduct(e) {
    e.preventDefault();
    setBusy(true);
    setMessage('');

    const payload = {
      ...form,
      price: Number(form.price),
      original_price: form.original_price ? Number(form.original_price) : null,
      stock_quantity: Number(form.stock_quantity)
    };
    delete payload.id;

    try {
      const result = editing
        ? await supabase.from('products').update(payload).eq('id', editing)
        : await supabase.from('products').insert(payload);

      if (result.error) {
        setMessage(result.error.message);
      } else {
        setMessage('Product saved successfully.');
        setEditing(null);
        setShowForm(false);
        setForm(blank);
        await loadAll();
      }
    } catch (err) {
      setMessage(err.message || 'Failed to save product.');
    } finally {
      setBusy(false);
    }
  }

  async function uploadImage(file) {
    if (!file) return;
    setBusy(true);
    const ext = file.name.split('.').pop();
    const uniqueId =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : Math.random().toString(36).substring(2) + Date.now().toString(36);
    const path = `${uniqueId}.${ext}`;

    try {
      const { error } = await supabase.storage.from('product-images').upload(path, file, { upsert: false });
      if (error) {
        setMessage(error.message);
      } else {
        const { data } = supabase.storage.from('product-images').getPublicUrl(path);
        setForm((f) => ({ ...f, image_url: data.publicUrl }));
      }
    } catch (err) {
      setMessage(err.message || 'Failed to upload image.');
    } finally {
      setBusy(false);
    }
  }

  async function deleteProduct(id) {
    if (!confirm('Delete this product? This cannot be undone.')) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) setMessage(error.message);
    else loadAll();
  }

  async function saveOffer(e) {
    e.preventDefault();
    setBusy(true);
    try {
      const { error } = await supabase.from('offers').insert({
        ...offerForm,
        starts_at: new Date(offerForm.starts_at).toISOString(),
        ends_at: new Date(offerForm.ends_at).toISOString()
      });
      setMessage(error ? error.message : 'Offer created.');
      if (!error) {
        setOfferForm({ title: '', description: '', starts_at: '', ends_at: '', active: true });
        loadAll();
      }
    } catch (err) {
      setMessage(err.message || 'Failed to save offer.');
    } finally {
      setBusy(false);
    }
  }

  async function toggleOffer(o) {
    const { error } = await supabase.from('offers').update({ active: !o.active }).eq('id', o.id);
    setMessage(error ? error.message : 'Offer status updated.');
    if (!error) loadAll();
  }

  async function deleteOffer(id) {
    if (!confirm('Delete this offer?')) return;
    const { error } = await supabase.from('offers').delete().eq('id', id);
    setMessage(error ? error.message : 'Offer deleted.');
    if (!error) loadAll();
  }

  async function saveSettings(e) {
    e.preventDefault();
    setBusy(true);
    try {
      const { error } = await supabase.from('store_settings').upsert({ ...settings, id: 1 });
      setMessage(error ? error.message : 'Store settings updated.');
    } catch (err) {
      setMessage(err.message || 'Failed to update store settings.');
    } finally {
      setBusy(false);
    }
  }

  if (!isSupabaseConfigured) {
    return (
      <main className="admin-shell">
        <div className="admin-login">
          <span className="eyebrow">KL PERFUMES · ATELIER ADMIN</span>
          <h1>Connect your<br /><em>store database.</em></h1>
          <p>
            The admin dashboard is ready, but Supabase credentials are missing. Add your project URL and anon key to <code>.env</code>, then restart the dev server.
          </p>
          <div className="notice">See README.md and supabase/schema.sql for setup instructions.</div>
          <a className="back-link" href="/">← Return to boutique</a>
        </div>
      </main>
    );
  }

  if (checking) {
    return <div className="page-state">Checking administrator access…</div>;
  }

  if (!session) {
    return (
      <main className="admin-shell">
        <form className="admin-login" onSubmit={login}>
          <span className="eyebrow">KL PERFUMES · ATELIER ACCESS</span>
          <h1>Welcome<br /><em>back.</em></h1>
          <p>Sign in to manage your attar catalogue, stock and boutique information.</p>
          <label>
            Email address
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label>
            Password
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>
          {message && <p className="form-message">{message}</p>}
          <button className="button button-gold" disabled={busy}>
            {busy ? 'SIGNING IN…' : 'SIGN IN TO ATELIER'}
          </button>
          <a className="back-link" href="/">← Return to boutique</a>
        </form>
      </main>
    );
  }

  if (!allowed) {
    return (
      <main className="admin-shell">
        <div className="admin-login">
          <AlertCircle size={30} />
          <h1>Access<br /><em>restricted.</em></h1>
          <p>
            This account is signed in but is not authorized as a KL Perfumes administrator. Ask the project owner to add your user ID to the admins table.
          </p>
          <button className="button button-dark" onClick={() => supabase && supabase.auth.signOut()}>
            SIGN OUT
          </button>
          <a className="back-link" href="/">← Return to boutique</a>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-layout">
      <aside className="admin-sidebar">
        <a href="/" className="brandmark">
          <span className="brand-monogram">KL</span>
          <span><b>KL PERFUMES</b><small>ATELIER STUDIO</small></span>
        </a>
        <div className="admin-nav">
          <button
            className={tab === 'products' ? 'active' : ''}
            onClick={() => { setTab('products'); setEditing(null); }}
          >
            <Package /> Attar Catalogue
          </button>
          <button
            className={tab === 'offers' ? 'active' : ''}
            onClick={() => setTab('offers')}
          >
            <Tag /> Promotions
          </button>
          <button
            className={tab === 'settings' ? 'active' : ''}
            onClick={() => setTab('settings')}
          >
            <Settings /> Boutique Settings
          </button>
        </div>
        <button className="signout" onClick={() => supabase && supabase.auth.signOut()}>
          <LogOut /> Sign out
        </button>
      </aside>

      <section className="admin-content">
        <div className="admin-top">
          <div>
            <span className="eyebrow">BOUTIQUE MANAGEMENT</span>
            <h1>
              {tab === 'products' ? 'Attar Catalogue' : tab === 'offers' ? 'Promotions' : 'Boutique Settings'}
            </h1>
          </div>
          <span className="admin-live"><i /> CONNECTED</span>
        </div>

        {message && (
          <div className="notice admin-notice">
            {message}
            <button onClick={() => setMessage('')} aria-label="Dismiss notice">
              <X size={15} />
            </button>
          </div>
        )}

        {tab === 'products' && (
          <>
            <div className="stats-grid">
              <div>
                <span>TOTAL ATTARS</span>
                <b>{products.length}</b>
              </div>
              <div>
                <span>IN STOCK</span>
                <b>{products.filter((p) => Number(p.stock_quantity) > 0).length}</b>
              </div>
              <div>
                <span>OUT OF STOCK</span>
                <b>{products.filter((p) => Number(p.stock_quantity) <= 0).length}</b>
              </div>
              <div>
                <span>FEATURED</span>
                <b>{products.filter((p) => p.featured).length}</b>
              </div>
            </div>

            <div className="admin-panel">
              <div className="panel-heading">
                <div>
                  <h2>{editing ? 'Edit Attar' : 'Attar Collection'}</h2>
                  <p>Manage traditional attars, tola sizes, and stock availability.</p>
                </div>
                <button
                  className="button button-gold small-button"
                  onClick={() => { setEditing(null); setForm(blank); setShowForm(true); }}
                >
                  <Plus size={15} /> NEW ATTAR
                </button>
              </div>

              {(editing !== null || showForm) && (
                <form className="product-form" onSubmit={saveProduct}>
                  <div className="form-grid">
                    <label>
                      Attar Name *
                      <input
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="e.g. Oud Al Malik"
                      />
                    </label>
                    <label>
                      Brand / Line
                      <input
                        value={form.brand}
                        onChange={(e) => setForm({ ...form, brand: e.target.value })}
                        placeholder="KL Perfumes Atelier"
                      />
                    </label>
                    <label>
                      Category
                      <select
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                      >
                        <option value="Pure Oud">Pure Oud</option>
                        <option value="Musk">Musk</option>
                        <option value="Amber & Woods">Amber & Woods</option>
                        <option value="Floral">Floral</option>
                        <option value="Special Blends">Special Blends</option>
                        <option value="Citrus & Fresh">Citrus & Fresh</option>
                        <option value="Unisex">Unisex</option>
                      </select>
                    </label>
                    <label>
                      Default Size
                      <input
                        value={form.size}
                        onChange={(e) => setForm({ ...form, size: e.target.value })}
                        placeholder="12ml (1 Tola) or 6ml (Half Tola)"
                      />
                    </label>
                    <label>
                      Price (INR) *
                      <input
                        type="number"
                        min="0"
                        required
                        value={form.price}
                        onChange={(e) => setForm({ ...form, price: e.target.value })}
                      />
                    </label>
                    <label>
                      Original Price (INR)
                      <input
                        type="number"
                        min="0"
                        value={form.original_price || ''}
                        onChange={(e) => setForm({ ...form, original_price: e.target.value })}
                      />
                    </label>
                    <label>
                      Stock Quantity (Bottles) *
                      <input
                        type="number"
                        min="0"
                        required
                        value={form.stock_quantity}
                        onChange={(e) => setForm({ ...form, stock_quantity: e.target.value })}
                      />
                    </label>
                    <label>
                      Fragrance Family
                      <input
                        value={form.fragrance_type}
                        onChange={(e) => setForm({ ...form, fragrance_type: e.target.value })}
                        placeholder="e.g. Royal Agarwood & Leather"
                      />
                    </label>
                  </div>

                  <label>
                    Description &amp; Notes
                    <textarea
                      rows="3"
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      placeholder="Sensory description of botanical distillation, sillage and character..."
                    />
                  </label>

                  <label>
                    Attar Bottle Image URL
                    <input
                      value={form.image_url}
                      onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                      placeholder="https://images.unsplash.com/…"
                    />
                  </label>

                  <label className="upload-label">
                    <ImagePlus size={16} /> Upload Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => uploadImage(e.target.files?.[0])}
                    />
                  </label>

                  <div className="check-row">
                    <label>
                      <input
                        type="checkbox"
                        checked={form.featured}
                        onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                      /> Featured on Homepage
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        checked={form.published}
                        onChange={(e) => setForm({ ...form, published: e.target.checked })}
                      /> Published in Boutique
                    </label>
                  </div>

                  <div className="form-actions">
                    <button className="button button-gold" disabled={busy}>
                      <Save size={15} /> {busy ? 'SAVING…' : 'SAVE ATTAR'}
                    </button>
                    <button
                      type="button"
                      className="text-button"
                      onClick={() => { setEditing(null); setShowForm(false); setForm(blank); }}
                    >
                      CANCEL
                    </button>
                  </div>
                </form>
              )}

              {!products.length ? (
                <p className="empty-state">No attars found in database. Add your first fragrance oil.</p>
              ) : (
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>ATTAR</th>
                        <th>CATEGORY</th>
                        <th>PRICE</th>
                        <th>STOCK</th>
                        <th>STATUS</th>
                        <th>ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((p) => (
                        <tr key={p.id}>
                          <td>
                            <div className="table-product">
                              {p.image_url && <img src={p.image_url} alt="" />}
                              <span>
                                <b>{p.name}</b>
                                <small>{p.size || p.fragrance_type}</small>
                              </span>
                            </div>
                          </td>
                          <td>{p.category}</td>
                          <td>{money(p.price)}</td>
                          <td>{p.stock_quantity} tolas</td>
                          <td>
                            <span className={p.published ? 'status-pill' : 'status-pill inactive'}>
                              {p.published ? 'Published' : 'Hidden'}
                            </span>
                          </td>
                          <td>
                            <div className="table-actions">
                              <button
                                aria-label="Edit"
                                onClick={() => {
                                  setEditing(p.id);
                                  setShowForm(true);
                                  setForm({ ...p });
                                  window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                              >
                                <Edit2 size={15} />
                              </button>
                              <button
                                aria-label="Delete"
                                onClick={() => deleteProduct(p.id)}
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {tab === 'offers' && (
          <div className="admin-panel">
            <div className="panel-heading">
              <div>
                <h2>Create Promotion / Seasonal Feature</h2>
                <p>Promotions display on the storefront while active and within their dates.</p>
              </div>
            </div>

            <form className="product-form" onSubmit={saveOffer}>
              <div className="form-grid">
                <label>
                  Promotion Title *
                  <input
                    required
                    value={offerForm.title}
                    onChange={(e) => setOfferForm({ ...offerForm, title: e.target.value })}
                  />
                </label>
                <label>
                  Start Date &amp; Time *
                  <input
                    required
                    type="datetime-local"
                    value={offerForm.starts_at}
                    onChange={(e) => setOfferForm({ ...offerForm, starts_at: e.target.value })}
                  />
                </label>
                <label>
                  End Date &amp; Time *
                  <input
                    required
                    type="datetime-local"
                    value={offerForm.ends_at}
                    onChange={(e) => setOfferForm({ ...offerForm, ends_at: e.target.value })}
                  />
                </label>
              </div>
              <label>
                Description
                <textarea
                  rows="3"
                  value={offerForm.description}
                  onChange={(e) => setOfferForm({ ...offerForm, description: e.target.value })}
                />
              </label>
              <button className="button button-gold" disabled={busy}>
                <Plus size={15} /> CREATE PROMOTION
              </button>
            </form>

            <div className="offer-list">
              {offers.map((o) => (
                <div className="offer-row" key={o.id}>
                  <div>
                    <b>{o.title}</b>
                    <p>{o.description}</p>
                    <small>
                      {new Date(o.starts_at).toLocaleString()} — {new Date(o.ends_at).toLocaleString()}
                    </small>
                  </div>
                  <div className="offer-actions">
                    <button className="text-button" onClick={() => toggleOffer(o)}>
                      {o.active ? 'DEACTIVATE' : 'ACTIVATE'}
                    </button>
                    <button
                      className="action-btn-icon"
                      onClick={() => deleteOffer(o.id)}
                      aria-label="Delete offer"
                    >
                      <Trash2 size={15} />
                    </button>
                    <span className={o.active ? 'status-pill' : 'status-pill inactive'}>
                      {o.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'settings' && (
          <div className="admin-panel">
            <div className="panel-heading">
              <div>
                <h2>Boutique Information &amp; Contacts</h2>
                <p>These details are used across the customer website, header, footer and WhatsApp links.</p>
              </div>
            </div>

            <form className="product-form" onSubmit={saveSettings}>
              <label>
                Business Name
                <input
                  value={settings.business_name || ''}
                  onChange={(e) => setSettings({ ...settings, business_name: e.target.value })}
                />
              </label>
              <label>
                WhatsApp Business Number (Include country code, e.g. 919876543210)
                <input
                  placeholder="919876543210"
                  value={settings.whatsapp_number || ''}
                  onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
                />
              </label>
              <label>
                Contact Email
                <input
                  type="email"
                  value={settings.contact_email || ''}
                  onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                />
              </label>
              <label>
                Instagram URL
                <input
                  value={settings.instagram_url || ''}
                  onChange={(e) => setSettings({ ...settings, instagram_url: e.target.value })}
                />
              </label>
              <label>
                Announcement Bar Text
                <input
                  value={settings.announcement || ''}
                  onChange={(e) => setSettings({ ...settings, announcement: e.target.value })}
                />
              </label>
              <label>
                Store Description
                <textarea
                  rows="3"
                  value={settings.store_description || ''}
                  onChange={(e) => setSettings({ ...settings, store_description: e.target.value })}
                />
              </label>
              <button className="button button-gold" disabled={busy}>
                <Save size={15} /> SAVE BOUTIQUE SETTINGS
              </button>
            </form>
          </div>
        )}
      </section>
    </main>
  );
}

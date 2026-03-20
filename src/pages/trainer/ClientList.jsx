import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ChevronRight, UserPlus, ArrowLeft, Activity } from 'lucide-react';
import { supabase, TABLES } from '../../lib/supabase';
import Avatar from '../../components/Avatar';

export default function ClientList() {
  const navigate = useNavigate();
  const [clients, setClients]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [showInvite, setShowInvite] = useState(false);
  const [newClient, setNewClient] = useState({ name: '', username: '', password: '' });
  const [saving, setSaving]       = useState(false);
  const [msg, setMsg]             = useState('');

  useEffect(() => { loadClients(); }, []);

  async function loadClients() {
    const { data } = await supabase
      .from(TABLES.PROFILES)
      .select('id, name, username, profile_photo_url, subscription_tier')
      .eq('role', 'client')
      .order('name');

    // Enrich with last activity
    const enriched = await Promise.all((data || []).map(async c => {
      const { data: wl } = await supabase
        .from(TABLES.WORKOUT_LOGS)
        .select('created_at')
        .eq('client_id', c.id)
        .order('created_at', { ascending: false })
        .limit(1);

      const { data: fl } = await supabase
        .from(TABLES.FOOD_LOGS)
        .select('created_at')
        .eq('client_id', c.id)
        .order('created_at', { ascending: false })
        .limit(1);

      const lastW = wl?.[0]?.created_at;
      const lastF = fl?.[0]?.created_at;
      const lastAny = [lastW, lastF].filter(Boolean).sort().reverse()[0];
      const daysAgo = lastAny
        ? Math.floor((Date.now() - new Date(lastAny)) / 86400000)
        : null;

      // Workout compliance: logs in last 7 days vs target 5
      const { data: weekLogs } = await supabase
        .from(TABLES.WORKOUT_LOGS)
        .select('id')
        .eq('client_id', c.id)
        .gte('created_at', new Date(Date.now() - 7 * 86400000).toISOString());

      return {
        ...c,
        lastActive: daysAgo,
        compliance: Math.min(100, Math.round(((weekLogs?.length ?? 0) / 5) * 100)),
      };
    }));

    setClients(enriched);
    setLoading(false);
  }

  async function handleAddClient(e) {
    e.preventDefault();
    setSaving(true);
    setMsg('');
    const { data, error } = await supabase
      .from(TABLES.PROFILES)
      .insert([{
        name: newClient.name,
        username: newClient.username.toLowerCase(),
        password: newClient.password,
        role: 'client',
      }])
      .select()
      .single();

    if (error) {
      setMsg('Error: ' + error.message);
    } else {
      setClients(prev => [...prev, { ...data, lastActive: null, compliance: 0 }]);
      setNewClient({ name: '', username: '', password: '' });
      setShowInvite(false);
      setMsg(`✓ ${data.name} added successfully`);
    }
    setSaving(false);
  }

  const filtered = clients.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.username?.toLowerCase().includes(search.toLowerCase())
  );

  const compColor = v => v >= 80 ? 'var(--color-success, #1d9e75)' : v >= 50 ? '#f59e0b' : '#ef4444';

  return (
    <div className="trainer-dashboard">
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <Link to="/trainer-dashboard" style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-text-dim)', fontSize: 13, textDecoration: 'none', marginBottom: 8 }}>
              <ArrowLeft size={14} /> Trainer Dashboard
            </Link>
            <h2 className="text-gradient" style={{ fontSize: '2rem', margin: 0 }}>All Clients</h2>
          </div>
          <button
            onClick={() => setShowInvite(v => !v)}
            className="primary-button"
            style={{ display: 'flex', alignItems: 'center', gap: 8 }}
          >
            <UserPlus size={16} /> Add Client
          </button>
        </div>

        {/* Add client form */}
        {showInvite && (
          <div className="glass-panel fade-in" style={{ padding: '1.5rem', marginBottom: '1.5rem', borderRadius: 16 }}>
            <h4 style={{ marginBottom: '1rem', color: 'var(--color-primary)' }}>Register New Athlete</h4>
            <form onSubmit={handleAddClient} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '1rem', alignItems: 'flex-end' }}>
              {[
                { label: 'Name', key: 'name', placeholder: 'Rahul Sharma' },
                { label: 'Username', key: 'username', placeholder: 'rahul_s' },
                { label: 'Password', key: 'password', placeholder: 'welcome123', type: 'password' },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ display: 'block', fontSize: 12, color: 'var(--color-text-dim)', marginBottom: 4 }}>{f.label}</label>
                  <input
                    className="glass-input"
                    style={{ width: '100%' }}
                    type={f.type || 'text'}
                    placeholder={f.placeholder}
                    value={newClient[f.key]}
                    onChange={e => setNewClient(p => ({ ...p, [f.key]: e.target.value }))}
                    required
                  />
                </div>
              ))}
              <button type="submit" className="primary-button" disabled={saving} style={{ height: 42 }}>
                {saving ? '…' : 'Add'}
              </button>
            </form>
          </div>
        )}

        {msg && <p style={{ color: msg.startsWith('Error') ? '#ef4444' : 'var(--color-primary)', marginBottom: '1rem', fontSize: 14 }}>{msg}</p>}

        {/* Search */}
        <div className="search-box" style={{ marginBottom: '1.5rem', maxWidth: 360 }}>
          <Search size={16} />
          <input placeholder="Search clients…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        {/* Client table */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: 'var(--color-text-dim)' }}>
            <div className="loader" style={{ margin: '0 auto' }} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem' }}>
            <Activity size={40} style={{ opacity: 0.3, marginBottom: 12 }} />
            <p style={{ color: 'var(--color-text-dim)' }}>
              {clients.length === 0 ? 'No clients yet. Add your first athlete above.' : 'No clients match your search.'}
            </p>
          </div>
        ) : (
          <div className="glass-panel" style={{ padding: 0, overflow: 'hidden', borderRadius: 16 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                  {['Athlete', 'Username', 'Last Active', 'Compliance', ''].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--color-text-dim)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => (
                  <tr key={c.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', cursor: 'pointer', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    onClick={() => navigate(`/trainer/clients/${c.id}`)}
                  >
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Avatar url={c.profile_photo_url} name={c.name} size="sm" />
                        <span style={{ fontWeight: 500 }}>{c.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', color: 'var(--color-text-dim)' }}>
                      <code style={{ fontSize: 12 }}>@{c.username}</code>
                    </td>
                    <td style={{ padding: '14px 16px', color: 'var(--color-text-dim)', fontSize: 13 }}>
                      {c.lastActive === null ? '—' : c.lastActive === 0 ? 'Today' : `${c.lastActive}d ago`}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ height: 4, width: 56, background: 'rgba(255,255,255,0.07)', borderRadius: 2, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${c.compliance}%`, background: compColor(c.compliance), borderRadius: 2 }} />
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 600, color: compColor(c.compliance) }}>{c.compliance}%</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <ChevronRight size={16} style={{ color: 'var(--color-text-dim)' }} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

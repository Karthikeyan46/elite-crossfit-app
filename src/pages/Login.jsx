import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, ShieldCheck, Mail, Phone, ArrowRight, X as CloseIcon } from 'lucide-react';
import { supabase, TABLES } from '../lib/supabase';
import './Dashboard.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showDemoModal, setShowDemoModal] = useState(false);
    const [leadForm, setLeadForm] = useState({ name: '', email: '', phone: '' });
    const [submittingLead, setSubmittingLead] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        localStorage.removeItem('isDemoMode'); // Clear any demo state

        try {
            const { data, error: fetchError } = await supabase
                .from('client_profiles')
                .select('*')
                .eq('username', username.toLowerCase())
                .eq('password', password)
                .single();

            if (fetchError || !data) {
                setError('Invalid username or password. Please try again.');
                return;
            }

            const isTrainer = data.role === 'trainer';

            localStorage.setItem('isClientLoggedIn', 'true');
            localStorage.setItem('isTrainer', isTrainer ? 'true' : 'false');
            localStorage.setItem('username', data.username);
            localStorage.setItem('clientId', data.id);
            localStorage.setItem('clientName', data.name);

            if (isTrainer) {
                navigate('/trainer-dashboard');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            setError('Connection error. Please try again.');
        }
    };

    const handleDemoStart = async (e) => {
        e.preventDefault();
        setSubmittingLead(true);
        try {
            // 1. Check if email or phone already used the demo
            const { data: existingLead, error: checkError } = await supabase
                .from(TABLES.LEADS)
                .select('id')
                .or(`email.eq.${leadForm.email},phone.eq.${leadForm.phone}`)
                .maybeSingle();

            if (existingLead) {
                alert("This email or mobile number has already used the free demo. Please contact us for a full account!");
                setShowDemoModal(false);
                return;
            }

            // 2. Insert new lead
            const { error: leadError } = await supabase
                .from(TABLES.LEADS)
                .insert([leadForm]);

            if (leadError) throw leadError;

            localStorage.setItem('isDemoMode', 'true');
            localStorage.setItem('clientName', leadForm.name || 'Demo User');
            navigate('/dashboard'); // We'll handle the scan trigger in Dashboard for better flow
        } catch (err) {
            console.error('Lead Save Error:', err);
            // Even if lead fails, let them try the demo for UX
            localStorage.setItem('isDemoMode', 'true');
            navigate('/dashboard');
        } finally {
            setSubmittingLead(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card glass-panel fade-in">
                <div className="auth-header">
                    <h2>Member Portal</h2>
                    <p className="text-dim">Log in to track your progress</p>
                </div>

                <form className="auth-form" onSubmit={handleLogin}>
                    <div className="form-group">
                        <label className="text-dim">Username</label>
                        <div className="input-with-icon" style={{ position: 'relative' }}>
                            <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }} />
                            <input
                                type="text"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                style={{ paddingLeft: '40px' }}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group" style={{ marginTop: '1rem' }}>
                        <label className="text-dim">Password</label>
                        <div className="input-with-icon" style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }} />
                            <input
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{ paddingLeft: '40px' }}
                                required
                            />
                        </div>
                    </div>

                    {error && <p style={{ color: '#ff4444', fontSize: '0.9rem', textAlign: 'center', marginTop: '1rem' }}>{error}</p>}

                    <button type="submit" className="primary-button w-full" style={{ marginTop: '1.5rem' }}>
                        Enter Dashboard
                    </button>

                    <p className="text-dim text-center" style={{ fontSize: '0.8rem', marginTop: '1rem' }}>
                        Need an account? Contact your trainer.
                    </p>

                    <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                        <button 
                            type="button" 
                            className="glass-panel w-full" 
                            onClick={() => setShowDemoModal(true)}
                            style={{ 
                                padding: '1rem', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'space-between',
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid var(--primary-dark)',
                                borderRadius: '12px'
                            }}
                        >
                            <div style={{ textAlign: 'left' }}>
                                <p style={{ fontWeight: 700, margin: 0, color: 'var(--primary)' }}>Try Free Demo</p>
                                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', margin: 0 }}>Scan one meal & see results</p>
                            </div>
                            <ArrowRight size={20} color="var(--primary)" />
                        </button>
                        {localStorage.getItem('demo_used_v1') && (
                            <p className="text-dim text-center" style={{ fontSize: '0.7rem', marginTop: '0.5rem' }}>
                                (Demo already used on this device)
                            </p>
                        )}
                    </div>
                </form>
            </div>

            {/* Lead Capture Modal */}
            {showDemoModal && (
                <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
                    <div className="glass-panel animate-scale-in" style={{ width: '100%', maxWidth: '400px', padding: '2rem', position: 'relative' }}>
                        <button 
                            onClick={() => setShowDemoModal(false)}
                            style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', color: 'var(--color-text-dim)' }}
                        >
                            <CloseIcon size={20} />
                        </button>
                        
                        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Experience the Magic</h3>
                            <p style={{ color: 'var(--color-text-dim)', fontSize: '0.9rem' }}>Enter your details to start your one-time free AI scan demo.</p>
                        </div>

                        <form onSubmit={handleDemoStart} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div className="form-group">
                                <label style={{ fontSize: '0.8rem', color: 'var(--color-text-dim)', marginBottom: '5px', display: 'block' }}>Name</label>
                                <div className="input-with-icon" style={{ position: 'relative' }}>
                                    <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }} />
                                    <input 
                                        type="text" 
                                        required 
                                        placeholder="Your full name"
                                        value={leadForm.name}
                                        onChange={e => setLeadForm(p => ({ ...p, name: e.target.value }))}
                                        style={{ width: '100%', paddingLeft: '40px' }}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label style={{ fontSize: '0.8rem', color: 'var(--color-text-dim)', marginBottom: '5px', display: 'block' }}>Email</label>
                                <div className="input-with-icon" style={{ position: 'relative' }}>
                                    <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }} />
                                    <input 
                                        type="email" 
                                        required 
                                        placeholder="Email address"
                                        value={leadForm.email}
                                        onChange={e => setLeadForm(p => ({ ...p, email: e.target.value }))}
                                        style={{ width: '100%', paddingLeft: '40px' }}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label style={{ fontSize: '0.8rem', color: 'var(--color-text-dim)', marginBottom: '5px', display: 'block' }}>Mobile</label>
                                <div className="input-with-icon" style={{ position: 'relative' }}>
                                    <Phone size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }} />
                                    <input 
                                        type="tel" 
                                        required 
                                        placeholder="Mobile number"
                                        value={leadForm.phone}
                                        onChange={e => setLeadForm(p => ({ ...p, phone: e.target.value }))}
                                        style={{ width: '100%', paddingLeft: '40px' }}
                                    />
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                className="primary-button w-full" 
                                style={{ marginTop: '1rem' }}
                                disabled={submittingLead}
                            >
                                {submittingLead ? 'Starting...' : 'Start My Free Scan'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Login;

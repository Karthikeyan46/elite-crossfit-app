import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Users,
    Activity,
    Utensils,
    Calendar,
    Search,
    ChevronRight,
    LogOut,
    Dumbbell,
    UserPlus,
    X
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { hasPermission } from '../lib/auth_utils';
import Avatar from '../components/Avatar';
import './TrainerDashboard.css';

const TrainerDashboard = () => {
    const [clients, setClients] = useState([]);
    const [recentWorkouts, setRecentWorkouts] = useState([]);
    const [recentFood, setRecentFood] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddClient, setShowAddClient] = useState(false);
    const [newClientName, setNewClientName] = useState('');
    const [newClientUsername, setNewClientUsername] = useState('');
    const [newClientPassword, setNewClientPassword] = useState('');
    const [selectedClient, setSelectedClient] = useState(null);
    const [tempNote, setTempNote] = useState('');
    const [subscriptionTier, setSubscriptionTier] = useState('free');
    const [isLoadingTier, setIsLoadingTier] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const isTrainer = localStorage.getItem('isTrainer') === 'true';
        const clientId = localStorage.getItem('clientId');
        
        if (!isTrainer) {
            navigate('/login');
        } else {
            checkSubscription(clientId);
            fetchDashboardData();
        }
    }, [navigate]);

    const checkSubscription = async (clientId) => {
        try {
            const { data } = await supabase
                .from('client_profiles')
                .select('subscription_tier')
                .eq('id', clientId)
                .single();
            setSubscriptionTier(data?.subscription_tier || 'free');
        } catch (error) {
            console.error('Error checking subscription:', error);
        } finally {
            setIsLoadingTier(false);
        }
    };

    const fetchDashboardData = async () => {
        try {
            // Fetch all clients (excluding trainers)
            const { data: clientData } = await supabase
                .from('client_profiles')
                .select('*')
                .eq('role', 'client')
                .order('name');
            setClients(clientData || []);

            // Fetch recent workouts with client names
            const { data: workoutData } = await supabase
                .from('workout_logs')
                .select(`
                    *,
                    client_profiles!inner (name, role)
                `)
                .eq('client_profiles.role', 'client')
                .order('created_at', { ascending: false })
                .limit(20);
            setRecentWorkouts(workoutData || []);

            // Fetch recent food logs
            const { data: foodData } = await supabase
                .from('food_logs')
                .select(`
                    *,
                    client_profiles!inner (name, role)
                `)
                .eq('client_profiles.role', 'client')
                .order('created_at', { ascending: false })
                .limit(20);
            setRecentFood(foodData || []);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    const handleAddClient = async (e) => {
        e.preventDefault();
        if (!newClientName || !newClientUsername || !newClientPassword) return;

        try {
            const { data, error } = await supabase
                .from('client_profiles')
                .insert([{
                    name: newClientName,
                    username: newClientUsername.toLowerCase(),
                    password: newClientPassword,
                    role: 'client'
                }])
                .select()
                .single();

            if (!error && data) {
                setClients([...clients, data]);
                setNewClientName('');
                setNewClientUsername('');
                setNewClientPassword('');
                setShowAddClient(false);
            } else {
                alert(error.message);
            }
        } catch (error) {
            console.error('Error adding client:', error);
        }
    };

    const handleUpdateNote = async () => {
        if (!selectedClient || !tempNote) return;

        try {
            const { error } = await supabase
                .from('client_profiles')
                .update({ trainer_note: tempNote })
                .eq('id', selectedClient.id);

            if (!error) {
                setClients(clients.map(c => c.id === selectedClient.id ? { ...c, trainer_note: tempNote } : c));
                alert(`Workout instructions updated for ${selectedClient.name}`);
                setSelectedClient(null);
            }
        } catch (error) {
            console.error('Error updating note:', error);
        }
    };

    const filteredClients = clients.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.username && c.username.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (isLoadingTier) {
        return (
            <div className="trainer-dashboard flex-center" style={{ height: '80vh' }}>
                <div className="loader"></div>
            </div>
        );
    }

    if (!hasPermission(subscriptionTier, 'canAccessTrainerDashboard')) {
        return (
            <div className="trainer-dashboard">
                 <div className="upgrade-overlay glass-panel fade-in">
                    <div className="upgrade-content">
                        <Dumbbell className="text-gradient" size={64} style={{ marginBottom: '1.5rem' }} />
                        <h2 className="text-gradient">Upgrade to Trainer Pro</h2>
                        <p className="text-dim">Unlock the ability to manage your elite athletes, track their progress, and set daily WODs.</p>
                        
                        <div className="pricing-info">
                            <div className="price-tag">
                                <span className="currency">$</span>
                                <span className="amount">29</span>
                                <span className="period">/month</span>
                            </div>
                        </div>

                        <ul className="benefit-list">
                            <li><Activity size={18} className="primary" /> Manage up to 20 clients</li>
                            <li><Utensils size={18} className="primary" /> Real-time Nutrition monitoring</li>
                            <li><Calendar size={18} className="primary" /> Direct Daily Instructions (WOD)</li>
                        </ul>

                        <button className="primary-button w-full" onClick={() => alert("Redirecting to payment gateway...")}>
                            Start Coaching Now
                        </button>
                        
                        <button className="logout-btn" onClick={handleLogout} style={{ marginTop: '1rem', width: '100%', justifyContent: 'center' }}>
                            <LogOut size={18} /> Logout
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="trainer-dashboard">
            <div className="trainer-grid">
                {/* Sidebar */}
                <aside className="trainer-sidebar glass-panel">
                    <div className="trainer-logo">
                        <Dumbbell className="text-gradient" size={32} />
                        <h3>Trainer Dashboard</h3>
                    </div>

                    <div className="search-box">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Find client..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="client-list">
                        <h4>Management</h4>
                        {[
                          { icon: Users, label: 'Athlete Roster', to: '/trainer/clients' },
                          { icon: Dumbbell, label: 'Workout Plans', to: '/trainer/workouts' },
                          { icon: Calendar, label: 'Weekly Check-ins', to: '/trainer/checkins' },
                          { icon: Activity, label: 'SaaS Settings', to: '/trainer/settings' },
                        ].map(item => (
                          <div key={item.to} className="client-nav-item" onClick={() => navigate(item.to)}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%' }}>
                              <item.icon size={18} color="var(--color-primary)" />
                              <span>{item.label}</span>
                            </div>
                          </div>
                        ))}
                    </div>

                    <button className="logout-btn" onClick={handleLogout} style={{ marginTop: 'auto' }}>
                        <LogOut size={20} /> Logout
                    </button>
                </aside>

                {/* Main Content */}
                <main className="trainer-main">
                    <header className="trainer-header">
                        <h1>Welcome back, <span className="text-gradient">Coach</span></h1>
                        <p>Here's what your athletes have been doing today.</p>
                    </header>

                    {selectedClient && (
                        <div className="trainer-wod-card glass-panel fade-in" style={{ marginBottom: 'var(--spacing-6)', padding: 'var(--spacing-6)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-4)' }}>
                                <h3>Set Daily WOD for <span className="primary">{selectedClient.name}</span></h3>
                                <button className="close-btn" onClick={() => setSelectedClient(null)}>
                                    <X size={20} />
                                </button>
                            </div>
                            <textarea
                                className="glass-input"
                                style={{ width: '100%', minHeight: '100px', marginBottom: 'var(--spacing-4)', borderRadius: 'var(--radius-md)' }}
                                value={tempNote}
                                onChange={(e) => setTempNote(e.target.value)}
                                placeholder="Enter workout instructions..."
                            />
                            <button className="primary-button" onClick={handleUpdateNote}>
                                Save Daily Instructions
                            </button>
                        </div>
                    )}

                    <div className="feed-grid">
                        {/* Workouts Feed */}
                        <div className="feed-card glass-panel">
                            <div className="feed-header">
                                <Activity size={24} className="primary" />
                                <h3>Recent Workouts</h3>
                            </div>
                            <div className="feed-list">
                                {recentWorkouts.map(log => (
                                    <div key={log.id} className="feed-item">
                                        <div className="feed-client-info" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <Avatar url={log.client_profiles?.profile_photo_url} name={log.client_profiles?.name} size="sm" />
                                            <div>
                                                <strong style={{ display: 'block' }}>{log.client_profiles?.name}</strong>
                                                <span className="text-dim" style={{ fontSize: '0.8rem' }}>
                                                    {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="feed-activity">
                                            <p>{log.exercise} - <span className="primary">{log.value}</span></p>
                                            <span className="burnt-tag">{log.calories_burnt} kcal burnt</span>
                                        </div>
                                    </div>
                                ))}
                                {recentWorkouts.length === 0 && <p className="text-dim">No workouts logged yet.</p>}
                            </div>
                        </div>

                        {/* Nutrition Feed */}
                        <div className="feed-card glass-panel">
                            <div className="feed-header">
                                <Utensils size={24} className="primary" />
                                <h3>Nutrition Logs</h3>
                            </div>
                            <div className="feed-list">
                                {recentFood.map(log => (
                                    <div key={log.id} className="feed-item">
                                        <div className="feed-client-info" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <Avatar url={log.client_profiles?.profile_photo_url} name={log.client_profiles?.name} size="sm" />
                                            <div>
                                                <strong style={{ display: 'block' }}>{log.client_profiles?.name}</strong>
                                                <span className="text-dim" style={{ fontSize: '0.8rem' }}>
                                                    {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="feed-activity">
                                            <p>{log.name} - <span className="primary">{log.calories} kcal</span></p>
                                            <span className="macros text-dim">P: {log.protein}g | C: {log.carbs}g | F: {log.fats}g</span>
                                        </div>
                                    </div>
                                ))}
                                {recentFood.length === 0 && <p className="text-dim">No meals logged yet.</p>}
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Add Client Modal */}
            {showAddClient && (
                <div className="modal-overlay">
                    <div className="modal-content glass-panel fade-in">
                        <div className="modal-header">
                            <h3>Register New Athlete</h3>
                            <button className="close-btn" onClick={() => setShowAddClient(false)}>
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleAddClient} className="add-client-form">
                            <div className="form-group">
                                <label>Athlete Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Rahul Sharma"
                                    value={newClientName}
                                    onChange={(e) => setNewClientName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Username</label>
                                <input
                                    type="text"
                                    placeholder="e.g. rahul_s"
                                    value={newClientUsername}
                                    onChange={(e) => setNewClientUsername(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Initial Password</label>
                                <input
                                    type="password"
                                    placeholder="e.g. welcome123"
                                    value={newClientPassword}
                                    onChange={(e) => setNewClientPassword(e.target.value)}
                                    required
                                />
                                <small className="text-dim">They can change this in their settings.</small>
                            </div>
                            <button type="submit" className="primary-button w-full">
                                Create Profile
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TrainerDashboard;

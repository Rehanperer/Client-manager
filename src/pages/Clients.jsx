import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Filter,
    Plus,
    Instagram,
    MessageCircle,
    Phone,
    Link as LinkIcon,
    Mail,
    Globe,
    Trash2,
    Edit2,
    User,
    AlertCircle
} from 'lucide-react';
import { getClients, deleteClient } from '../utils/storage';
import { useNavigate } from 'react-router-dom';

const Clients = () => {
    const [clients, setClients] = useState([]);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('All');
    const [isDeleting, setIsDeleting] = useState(null);
    const navigate = useNavigate();

    const refreshClients = async () => {
        const data = await getClients();
        setClients(data);
    };

    useEffect(() => {
        refreshClients();
    }, []);

    const formatLKR = (val) => {
        return new Intl.NumberFormat('en-LK', {
            style: 'currency',
            currency: 'LKR',
            maximumFractionDigits: 0
        }).format(val).replace('LKR', 'Rs.');
    };

    const filteredClients = clients.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.contact.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === 'All' || c.status === filter;
        return matchesSearch && matchesFilter;
    });

    const handleDelete = async (id) => {
        await deleteClient(id);
        await refreshClients();
        setIsDeleting(null);
    };

    const statusColors = {
        'Live': 'var(--accent)',
        'Development': 'var(--primary)',
        'Designing': 'var(--warning)',
        'Discovery': '#8b5cf6',
        'Lead': 'var(--text-dim)',
        'Testing': '#ec4899'
    };

    const ClientCard = ({ client, index }) => (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="glass glass-hover"
            style={{
                padding: '1.25rem',
                marginBottom: '1rem',
                borderLeft: `5px solid ${statusColors[client.status] || 'var(--border)'}`,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>{client.name}</h3>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <User size={12} /> {client.contact}
                    </div>
                </div>
                <div className="badge" style={{
                    background: `${statusColors[client.status]}15`,
                    color: statusColors[client.status],
                    border: `1px solid ${statusColors[client.status]}30`
                }}>
                    {client.status}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '10px' }}>
                <div style={{ fontSize: '0.75rem' }}>
                    <div style={{ color: 'var(--text-dim)', marginBottom: '2px' }}>Project Fee</div>
                    <div style={{ fontWeight: 600 }}>{formatLKR(client.price)}</div>
                </div>
                <div style={{ fontSize: '0.75rem' }}>
                    <div style={{ color: 'var(--text-dim)', marginBottom: '2px' }}>Monthly</div>
                    <div style={{ fontWeight: 600, color: 'var(--primary)' }}>{formatLKR(client.recurring)}</div>
                </div>
            </div>

            {/* New Social & Contact Info for Mobile */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '0.25rem' }}>
                {client.phone && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Phone size={14} />
                        <span>{client.phone} <small style={{ opacity: 0.6 }}>({client.phoneOwner || 'Owner'})</small></span>
                    </div>
                )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                    {client.instagram && (
                        <a href={`https://instagram.com/${client.instagram}`} target="_blank" rel="noreferrer" style={{ color: '#E1306C' }}><Instagram size={20} /></a>
                    )}
                    {client.socials && (
                        <a href={client.socials.startsWith('http') ? client.socials : `https://${client.socials}`} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)' }}><LinkIcon size={20} /></a>
                    )}
                    <a href={`mailto:${client.email}`} style={{ color: 'var(--text-dim)' }}><Mail size={20} /></a>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn-icon" style={{ color: 'var(--text-dim)' }}><Edit2 size={18} /></button>
                    <button onClick={() => setIsDeleting(client.id)} className="btn-icon" style={{ color: 'var(--danger)' }}><Trash2 size={18} /></button>
                </div>
            </div>
        </motion.div>
    );

    return (
        <div className="clients-container">
            <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: '1.75rem' }}>Client Base</h1>
                    <p style={{ fontSize: '0.85rem' }}>Tracking {filteredClients.length} business partners</p>
                </div>
                <button className="btn btn-primary btn-round" onClick={() => navigate('/add')}>
                    <Plus size={24} />
                    <span className="desktop-only">New Partnership</span>
                </button>
            </header>

            <div className="search-filter-stack" style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem' }}>
                <div style={{ flex: 1, position: 'relative' }}>
                    <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                    <input
                        type="text"
                        placeholder="Search partners..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="search-input"
                        style={{
                            width: '100%',
                            padding: '0.85rem 1rem 0.85rem 3rem',
                            background: 'var(--bg-card)',
                            border: '1px solid var(--border)',
                            borderRadius: '14px',
                            color: 'var(--text-main)',
                            outline: 'none',
                            fontSize: '0.9rem'
                        }}
                    />
                </div>
                <button className="glass" style={{ width: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '14px', border: '1px solid var(--border)' }}>
                    <Filter size={20} color="var(--text-dim)" />
                </button>
            </div>

            {/* Desktop Table */}
            <div className="desktop-clients-view glass desktop-only" style={{ overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ background: 'rgba(255,255,255,0.02)' }}>
                        <tr>
                            <th style={{ padding: '1rem' }}>Partner</th>
                            <th style={{ padding: '1rem' }}>Contact & Phone</th>
                            <th style={{ padding: '1rem' }}>Revenue (LKR)</th>
                            <th style={{ padding: '1rem' }}>Status</th>
                            <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <AnimatePresence>
                            {filteredClients.map((client, i) => (
                                <motion.tr
                                    key={client.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    style={{ borderTop: '1px solid var(--border)' }}
                                >
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ fontWeight: 600 }}>{client.name}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{client.domain || 'N/A'}</div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ fontWeight: 500 }}>{client.contact}</div>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{client.phone || 'No Phone'}</div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ fontWeight: 600 }}>{formatLKR(client.price)}</div>
                                        {client.recurring > 0 && <div style={{ fontSize: '0.7rem', color: 'var(--accent)' }}>+{formatLKR(client.recurring)}/mo</div>}
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <div className="badge" style={{ background: `${statusColors[client.status]}15`, color: statusColors[client.status] }}>{client.status}</div>
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                                        <button onClick={() => setIsDeleting(client.id)} className="btn-icon danger"><Trash2 size={16} /></button>
                                    </td>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="mobile-clients-view" style={{ display: 'none' }}>
                {filteredClients.length > 0 ? (
                    filteredClients.map((client, i) => (
                        <ClientCard key={client.id} client={client} index={i} />
                    ))
                ) : (
                    <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-dim)' }}>
                        <AlertCircle size={40} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                        <p>No matches found</p>
                    </div>
                )}
            </div>

            {/* Delete Confirmation */}
            <AnimatePresence>
                {isDeleting && (
                    <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="glass" style={{ width: '100%', maxWidth: '400px', padding: '2rem', textAlign: 'center' }}>
                            <AlertCircle size={50} color="var(--danger)" style={{ marginBottom: '1.5rem' }} />
                            <h3>Terminate Partnership?</h3>
                            <p style={{ margin: '1rem 0 2rem' }}>This will remove the client record. This action is permanent.</p>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setIsDeleting(null)}>Cancel</button>
                                <button className="btn btn-primary" style={{ flex: 1, background: 'var(--danger)' }} onClick={() => handleDelete(isDeleting)}>Confirm</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <style dangerouslySetInnerHTML={{
                __html: `
        @media (max-width: 768px) {
          .mobile-clients-view { display: block !important; }
          .desktop-only { display: none !important; }
        }
      `}} />
        </div>
    );
};

export default Clients;

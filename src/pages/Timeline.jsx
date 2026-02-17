import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    History,
    Search,
    ChevronRight,
    Plus,
    Calendar,
    Trash2,
    CheckCircle2,
    Clock,
    AlertCircle,
    Palette,
    Code,
    Rocket,
    Search as SearchIcon,
    Flag
} from 'lucide-react';
import { getClients, saveClient } from '../utils/storage';

const Timeline = () => {
    const [clients, setClients] = useState([]);
    const [activeClient, setActiveClient] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [search, setSearch] = useState('');
    const [newStage, setNewStage] = useState({
        stage: 'Development',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        notes: '',
        status: 'Planned'
    });

    const stages = ['Discovery', 'Design', 'Development', 'Testing', 'Launch', 'Maintenance'];
    const statusOptions = ['Planned', 'In Progress', 'Completed', 'Delayed'];

    const stageIcons = {
        'Discovery': <SearchIcon size={20} />,
        'Design': <Palette size={20} />,
        'Development': <Code size={20} />,
        'Testing': <AlertCircle size={20} />,
        'Launch': <Rocket size={20} />,
        'Maintenance': <Clock size={20} />
    };

    const statusColors = {
        'Planned': 'var(--text-dim)',
        'In Progress': 'var(--primary)',
        'Completed': 'var(--accent)',
        'Delayed': 'var(--danger)'
    };

    useEffect(() => {
        setClients(getClients());
    }, []);

    const filteredClients = clients.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase())
    );

    const calculateDays = (start, end) => {
        const diffTime = Math.abs(new Date(end) - new Date(start));
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const getDaysRemaining = (endDate) => {
        const diff = new Date(endDate) - new Date();
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        return days > 0 ? days : 0;
    };

    const handleAddStage = (e) => {
        e.preventDefault();
        const clientToUpdate = clients.find(c => c.id === activeClient.id);
        const stageData = {
            id: Date.now().toString(),
            ...newStage
        };

        const updatedClient = {
            ...clientToUpdate,
            timeline: [...(clientToUpdate.timeline || []), stageData].sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
        };

        saveClient(updatedClient);
        updateLocalState(activeClient.id);
        setShowAddForm(false);
        setNewStage({
            stage: 'Development',
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            notes: '',
            status: 'Planned'
        });
    };

    const updateLocalState = (clientId) => {
        const updatedClients = getClients();
        setClients(updatedClients);
        setActiveClient(updatedClients.find(c => c.id === clientId));
    };

    const handleUpdateDeadline = (newDate) => {
        const updatedClient = { ...activeClient, finalDeadline: newDate };
        saveClient(updatedClient);
        updateLocalState(activeClient.id);
    };

    const removeStage = (stageId) => {
        const updatedTimeline = activeClient.timeline.filter(s => s.id !== stageId);
        const updatedClient = { ...activeClient, timeline: updatedTimeline };
        saveClient(updatedClient);
        updateLocalState(activeClient.id);
    };

    const isDeadlineSoon = (date) => {
        const days = getDaysRemaining(date);
        return days < 7 && days > 0;
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="timeline-page"
        >
            <header style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Mission Control</h1>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>Project delivery & strict deadlines</p>
            </header>

            <div className="timeline-layout" style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
            }}>
                {/* Client Selector - Premium Horizontal Scroll */}
                <div style={{
                    margin: '0 -1.5rem',
                    padding: '0 1.5rem 0.5rem',
                    overflowX: 'auto',
                    display: 'flex',
                    gap: '0.75rem',
                    WebkitOverflowScrolling: 'touch',
                    scrollbarWidth: 'none'
                }}>
                    {filteredClients.map(c => (
                        <button
                            key={c.id}
                            onClick={() => {
                                setActiveClient(c);
                                setShowAddForm(false);
                            }}
                            style={{
                                flex: '0 0 auto',
                                padding: '0.8rem 1.25rem',
                                background: activeClient?.id === c.id ? 'var(--primary)' : 'rgba(255,255,255,0.03)',
                                border: activeClient?.id === c.id ? 'none' : '1px solid var(--border)',
                                borderRadius: '100px',
                                color: 'white',
                                fontSize: '0.85rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'var(--transition)',
                                boxShadow: activeClient?.id === c.id ? '0 4px 15px var(--primary-glow)' : 'none'
                            }}
                        >
                            {c.name}
                        </button>
                    ))}
                </div>

                {/* Timeline View */}
                <AnimatePresence mode="wait">
                    {activeClient ? (
                        <motion.div
                            key={activeClient.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            style={{ padding: '0 0 2rem' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <div>
                                    <h2 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 800 }}>{activeClient.name}</h2>
                                    <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem', marginTop: '2px' }}>{activeClient.niche} Management</p>
                                </div>
                                {!showAddForm && (
                                    <motion.button
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => setShowAddForm(true)}
                                        style={{
                                            width: '45px',
                                            height: '45px',
                                            borderRadius: '50%',
                                            background: 'var(--primary)',
                                            border: 'none',
                                            color: 'white',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            boxShadow: '0 4px 12px var(--primary-glow)'
                                        }}
                                    >
                                        <Plus size={24} />
                                    </motion.button>
                                )}
                            </div>

                            {/* Deadline Summary Card */}
                            {activeClient.finalDeadline && (
                                <div className="glass" style={{
                                    padding: '1rem',
                                    marginBottom: '2rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    border: isDeadlineSoon(activeClient.finalDeadline) ? '1px solid var(--danger)' : '1px solid var(--border)',
                                    background: isDeadlineSoon(activeClient.finalDeadline) ? 'rgba(239, 68, 68, 0.05)' : 'rgba(255,255,255,0.02)'
                                }}>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '10px',
                                        background: isDeadlineSoon(activeClient.finalDeadline) ? 'var(--danger)' : 'var(--primary)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <Rocket size={20} color="white" />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 700, opacity: 0.6 }}>Launch Goal</div>
                                        <div style={{ fontSize: '1rem', fontWeight: 700 }}>{activeClient.finalDeadline}</div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '1.25rem', fontWeight: 900, lineHeight: 1 }}>{getDaysRemaining(activeClient.finalDeadline)}</div>
                                        <div style={{ fontSize: '0.6rem', opacity: 0.5 }}>DAYS LEFT</div>
                                    </div>
                                </div>
                            )}

                            {showAddForm && (
                                <motion.form
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    onSubmit={handleAddStage}
                                    className="glass"
                                    style={{ padding: '1.5rem', marginBottom: '2.5rem', overflow: 'hidden' }}
                                >
                                    <div style={{ marginBottom: '1rem' }}>
                                        <label style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '0.5rem', display: 'block' }}>Phase Name</label>
                                        <select
                                            value={newStage.stage}
                                            onChange={(e) => setNewStage({ ...newStage, stage: e.target.value })}
                                            style={{ width: '100%', padding: '0.8rem', background: 'var(--bg-sidebar)', border: '1px solid var(--border)', borderRadius: '12px', color: 'white' }}
                                        >
                                            {stages.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>

                                    <div className="timeline-form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                                        <div>
                                            <label style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '0.5rem', display: 'block' }}>Starts</label>
                                            <input
                                                type="date"
                                                value={newStage.startDate}
                                                onChange={(e) => setNewStage({ ...newStage, startDate: e.target.value })}
                                                style={{ width: '100%', padding: '0.8rem', background: 'var(--bg-sidebar)', border: '1px solid var(--border)', borderRadius: '12px', color: 'white', fontSize: '0.8rem' }}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '0.5rem', display: 'block' }}>Finish</label>
                                            <input
                                                type="date"
                                                value={newStage.endDate}
                                                onChange={(e) => setNewStage({ ...newStage, endDate: e.target.value })}
                                                style={{ width: '100%', padding: '0.8rem', background: 'var(--bg-sidebar)', border: '1px solid var(--border)', borderRadius: '12px', color: 'white', fontSize: '0.8rem' }}
                                            />
                                        </div>
                                    </div>

                                    <div style={{ marginBottom: '1rem' }}>
                                        <label style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '0.5rem', display: 'block' }}>Phase Notes</label>
                                        <input
                                            type="text"
                                            placeholder="Special focus, deliverables..."
                                            value={newStage.notes}
                                            onChange={(e) => setNewStage({ ...newStage, notes: e.target.value })}
                                            style={{ width: '100%', padding: '0.8rem', background: 'var(--bg-sidebar)', border: '1px solid var(--border)', borderRadius: '12px', color: 'white', fontSize: '0.8rem' }}
                                        />
                                    </div>

                                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                                        <button type="submit" className="btn btn-primary" style={{ flex: 1, height: '48px' }}>Add Phase</button>
                                        <button type="button" onClick={() => setShowAddForm(false)} className="btn glass" style={{ height: '48px' }}>Cancel</button>
                                    </div>
                                </motion.form>
                            )}

                            {/* VERTICAL TIMELINE - MOBILE PERFECT */}
                            <div className="vertical-timeline" style={{ position: 'relative', paddingLeft: '2.5rem' }}>
                                <div style={{
                                    position: 'absolute',
                                    left: '11px',
                                    top: '10px',
                                    bottom: '10px',
                                    width: '3px',
                                    background: 'linear-gradient(to bottom, var(--primary), var(--accent), var(--border))',
                                    borderRadius: '10px',
                                    opacity: 0.2
                                }} />

                                {activeClient.timeline?.map((s, idx) => (
                                    <motion.div
                                        key={s.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        style={{ position: 'relative', marginBottom: '2.5rem' }}
                                    >
                                        <div style={{
                                            position: 'absolute',
                                            left: '-32px',
                                            top: '2px',
                                            width: '26px',
                                            height: '26px',
                                            borderRadius: '50%',
                                            background: s.status === 'Completed' ? 'var(--accent)' : 'var(--bg-sidebar)',
                                            border: `2px solid ${statusColors[s.status]}`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            zIndex: 2,
                                            boxShadow: s.status === 'In Progress' ? '0 0 10px var(--primary-glow)' : 'none'
                                        }}>
                                            {s.status === 'Completed' ? <CheckCircle2 size={12} color="white" /> :
                                                React.cloneElement(stageIcons[s.stage] || <Flag size={12} />, { size: 12, color: statusColors[s.status] })}
                                        </div>

                                        <div className="glass" style={{ padding: '1.25rem', border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.015)' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                                <div style={{ fontSize: '0.65rem', color: statusColors[s.status], fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
                                                    {s.status}
                                                </div>
                                                <div style={{ fontSize: '0.85rem', fontWeight: 800, opacity: 0.8 }}>
                                                    {calculateDays(s.startDate, s.endDate)} Days
                                                </div>
                                            </div>

                                            <h3 style={{ margin: '0 0 10px', fontSize: '1.1rem', fontWeight: 700 }}>{s.stage} Phase</h3>

                                            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', color: 'var(--text-dim)', fontSize: '0.75rem' }}>
                                                <Calendar size={12} />
                                                <span>{s.startDate}</span>
                                                <ChevronRight size={10} style={{ opacity: 0.4 }} />
                                                <span>{s.endDate}</span>
                                            </div>

                                            {s.notes && (
                                                <div style={{
                                                    marginTop: '1rem',
                                                    padding: '0.75rem',
                                                    background: 'rgba(0,0,0,0.2)',
                                                    borderRadius: '10px',
                                                    fontSize: '0.75rem',
                                                    color: 'var(--text-muted)',
                                                    lineHeight: '1.4'
                                                }}>
                                                    {s.notes}
                                                </div>
                                            )}

                                            <button
                                                onClick={() => removeStage(s.id)}
                                                style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: 'var(--danger)', opacity: 0.2 }}
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}

                                {/* Launch Indicator - NOW WITH EDITABLE DEADLINE */}
                                <div style={{
                                    position: 'relative',
                                    padding: '1.25rem',
                                    background: isDeadlineSoon(activeClient.finalDeadline) ? 'var(--danger)' : 'var(--primary)',
                                    borderRadius: '16px',
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    boxShadow: isDeadlineSoon(activeClient.finalDeadline) ? '0 8px 25px rgba(239, 68, 68, 0.3)' : '0 8px 25px var(--primary-glow)',
                                    transition: '0.3s'
                                }}>
                                    <div style={{
                                        position: 'absolute', left: '-32px', top: '50%', transform: 'translateY(-50%)',
                                        width: '26px', height: '26px', borderRadius: '50%', background: isDeadlineSoon(activeClient.finalDeadline) ? 'var(--danger)' : 'var(--primary)',
                                        border: '2px solid white', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}>
                                        <Rocket size={14} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', opacity: 0.8 }}>Mission Destination</div>
                                        <div style={{ fontSize: '1.1rem', fontWeight: 900 }}>PROJECT LAUNCH</div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ position: 'relative' }}>
                                            <input
                                                type="date"
                                                value={activeClient.finalDeadline || ''}
                                                onChange={(e) => handleUpdateDeadline(e.target.value)}
                                                style={{
                                                    background: 'transparent',
                                                    border: 'none',
                                                    color: 'white',
                                                    fontSize: '1.1rem',
                                                    fontWeight: 900,
                                                    textAlign: 'right',
                                                    padding: 0,
                                                    margin: 0,
                                                    cursor: 'pointer',
                                                    outline: 'none',
                                                    width: '130px'
                                                }}
                                            />
                                            <div style={{ fontSize: '0.6rem', opacity: 0.8, textTransform: 'uppercase' }}>Update Target Date</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="glass" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem', opacity: 0.5, textAlign: 'center' }}>
                            <History size={60} style={{ marginBottom: '1.5rem' }} />
                            <h3>Mission Control</h3>
                            <p>Select a business to view its timeline</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
        .timeline-page {
          max-width: 600px;
          margin: 0 auto;
        }
        @media (max-width: 768px) {
          .timeline-page {
            padding: 0 0.5rem;
          }
        }
      `}} />
        </motion.div>
    );
};

export default Timeline;

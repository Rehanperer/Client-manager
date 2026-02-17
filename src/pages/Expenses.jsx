import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Receipt,
    Plus,
    ChevronRight,
    Trash2,
    AlertCircle,
    Search,
    Wallet,
    Tag,
    Calendar,
    Layers,
    Edit3
} from 'lucide-react';
import { getClients, saveClient } from '../utils/storage';

const Expenses = () => {
    const [clients, setClients] = useState([]);
    const [activeClient, setActiveClient] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [search, setSearch] = useState('');
    const [newExpense, setNewExpense] = useState({
        type: 'Hosting',
        customType: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        note: ''
    });

    const categories = ['Hosting', 'Domain', 'Premium Plugin', 'API Feed', 'Outsourcing', 'Ad Spend', 'Custom'];

    useEffect(() => {
        setClients(getClients());
    }, []);

    const formatLKR = (val) => {
        return new Intl.NumberFormat('en-LK', {
            style: 'currency',
            currency: 'LKR',
            maximumFractionDigits: 0
        }).format(val).replace('LKR', 'Rs.');
    };

    const filteredClients = clients.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleAddExpense = (e) => {
        e.preventDefault();
        const clientToUpdate = clients.find(c => c.id === activeClient.id);
        const expenseData = {
            id: Date.now().toString(),
            type: newExpense.type === 'Custom' ? newExpense.customType : newExpense.type,
            amount: parseFloat(newExpense.amount) || 0,
            date: newExpense.date,
            note: newExpense.note
        };

        const updatedClient = {
            ...clientToUpdate,
            expenses: [...(clientToUpdate.expenses || []), expenseData]
        };

        saveClient(updatedClient);
        const updatedClients = getClients();
        setClients(updatedClients);
        setActiveClient(updatedClients.find(c => c.id === activeClient.id));
        setShowAddForm(false);
        setNewExpense({
            type: 'Hosting',
            customType: '',
            amount: '',
            date: new Date().toISOString().split('T')[0],
            note: ''
        });
    };

    const removeExpense = (expenseId) => {
        const updatedExpenses = activeClient.expenses.filter(e => e.id !== expenseId);
        const updatedClient = { ...activeClient, expenses: updatedExpenses };
        saveClient(updatedClient);
        const updatedClients = getClients();
        setClients(updatedClients);
        setActiveClient(updatedClients.find(c => c.id === activeClient.id));
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="expenses-container"
        >
            <header style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Expense Management</h1>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>Track operational costs per partnership</p>
            </header>

            <div className="expenses-layout" style={{
                display: 'grid',
                gridTemplateColumns: activeClient ? '320px 1fr' : '1fr',
                gap: '1.5rem',
                transition: '0.3s'
            }}>
                {/* Client Selector List */}
                <div className="glass" style={{ padding: '1rem', height: 'fit-content' }}>
                    <div style={{ position: 'relative', marginBottom: '1rem' }}>
                        <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
                        <input
                            type="text"
                            placeholder="Filter clients..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.6rem 0.6rem 0.6rem 2.5rem',
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid var(--border)',
                                borderRadius: '10px',
                                color: 'white',
                                fontSize: '0.85rem'
                            }}
                        />
                    </div>

                    <div className="client-scroll-list" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                        {filteredClients.map(c => (
                            <button
                                key={c.id}
                                onClick={() => setActiveClient(c)}
                                style={{
                                    width: '100%',
                                    padding: '1rem',
                                    marginBottom: '0.5rem',
                                    background: activeClient?.id === c.id ? 'var(--primary)' : 'rgba(255,255,255,0.02)',
                                    border: 'none',
                                    borderRadius: '12px',
                                    color: 'white',
                                    textAlign: 'left',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    transition: '0.2s'
                                }}
                            >
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{c.name}</div>
                                    <div style={{ fontSize: '0.7rem', opacity: 0.7 }}>{c.expenses?.length || 0} items</div>
                                </div>
                                <ChevronRight size={16} />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Selected Client Expenses Details */}
                <AnimatePresence mode="wait">
                    {activeClient ? (
                        <motion.div
                            key={activeClient.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="glass"
                            style={{ padding: '2rem' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                <div>
                                    <h2 style={{ fontSize: '1.4rem', margin: 0 }}>{activeClient.name}</h2>
                                    <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>Total Cost: {formatLKR(activeClient.expenses?.reduce((sum, e) => sum + e.amount, 0) || 0)}</p>
                                </div>
                                {!showAddForm && (
                                    <button
                                        onClick={() => setShowAddForm(true)}
                                        className="btn btn-primary"
                                        style={{ padding: '0.7rem 1.2rem', borderRadius: '12px' }}
                                    >
                                        <Plus size={18} /> Add Bill
                                    </button>
                                )}
                            </div>

                            {showAddForm ? (
                                <motion.form
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    onSubmit={handleAddExpense}
                                    className="glass"
                                    style={{ padding: '1.5rem', border: '1px solid var(--primary)', marginBottom: '2rem' }}
                                >
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                                        <div>
                                            <label style={{ fontSize: '0.8rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.5rem' }}>Category</label>
                                            <select
                                                value={newExpense.type}
                                                onChange={(e) => setNewExpense({ ...newExpense, type: e.target.value })}
                                                style={{ width: '100%', padding: '0.8rem', background: 'var(--bg-sidebar)', border: '1px solid var(--border)', borderRadius: '10px', color: 'white' }}
                                            >
                                                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                            </select>
                                        </div>

                                        {newExpense.type === 'Custom' && (
                                            <div>
                                                <label style={{ fontSize: '0.8rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.5rem' }}>Custom Title</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={newExpense.customType}
                                                    onChange={(e) => setNewExpense({ ...newExpense, customType: e.target.value })}
                                                    placeholder="Ex: Printing"
                                                    style={{ width: '100%', padding: '0.8rem', background: 'var(--bg-sidebar)', border: '1px solid var(--border)', borderRadius: '10px', color: 'white' }}
                                                />
                                            </div>
                                        )}

                                        <div>
                                            <label style={{ fontSize: '0.8rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.5rem' }}>Amount (Rs.)</label>
                                            <input
                                                type="number"
                                                required
                                                value={newExpense.amount}
                                                onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                                                placeholder="0.00"
                                                style={{ width: '100%', padding: '0.8rem', background: 'var(--bg-sidebar)', border: '1px solid var(--border)', borderRadius: '10px', color: 'white' }}
                                            />
                                        </div>
                                    </div>

                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <label style={{ fontSize: '0.8rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.5rem' }}>Note (Optional)</label>
                                        <input
                                            type="text"
                                            value={newExpense.note}
                                            onChange={(e) => setNewExpense({ ...newExpense, note: e.target.value })}
                                            placeholder="Renewal date, provider, etc."
                                            style={{ width: '100%', padding: '0.8rem', background: 'var(--bg-sidebar)', border: '1px solid var(--border)', borderRadius: '10px', color: 'white' }}
                                        />
                                    </div>

                                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                                        <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Confirm Expense</button>
                                        <button type="button" onClick={() => setShowAddForm(false)} className="btn glass" style={{ flex: 0.5 }}>Cancel</button>
                                    </div>
                                </motion.form>
                            ) : null}

                            <div className="expense-list" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {activeClient.expenses?.length > 0 ? (
                                    activeClient.expenses.map(exp => (
                                        <div key={exp.id} className="expense-item" style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            padding: '1rem',
                                            background: 'rgba(255,255,255,0.02)',
                                            borderRadius: '14px',
                                            border: '1px solid rgba(255,255,255,0.05)'
                                        }}>
                                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}>
                                                    <Receipt size={20} />
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{exp.type}</div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{exp.note || 'No notes'} • {exp.date}</div>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                <div style={{ fontWeight: 700, color: 'white' }}>-{formatLKR(exp.amount)}</div>
                                                <button
                                                    onClick={() => removeExpense(exp.id)}
                                                    style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '5px', opacity: 0.5 }}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div style={{ textAlign: 'center', padding: '4rem 1rem', opacity: 0.5 }}>
                                        <AlertCircle size={40} style={{ marginBottom: '1rem' }} />
                                        <p>No expenses recorded for this client.</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ) : (
                        <div className="glass" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem', opacity: 0.5 }}>
                            <Receipt size={60} style={{ marginBottom: '1.5rem' }} />
                            <h3>Select a client to manage bills</h3>
                            <p>Profit = Revenue - Expenses</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
        @media (max-width: 900px) {
          .expenses-layout {
            grid-template-columns: 1fr !important;
          }
          .client-scroll-list {
            display: flex !important;
            overflow-x: auto !important;
            max-height: none !important;
            padding-bottom: 0.5rem;
          }
          .client-scroll-list button {
            flex: 0 0 160px !important;
            margin-bottom: 0 !important;
            margin-right: 0.5rem !important;
          }
        }
      `}} />
        </motion.div>
    );
};

export default Expenses;

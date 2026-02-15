import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Save,
    Globe,
    DollarSign,
    User,
    Mail,
    Layers,
    Server,
    Briefcase,
    Clock,
    ChevronRight,
    ShieldCheck,
    Rocket
} from 'lucide-react';
import { saveClient } from '../utils/storage';

const AddClient = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        contact: '',
        email: '',
        status: 'Lead',
        type: 'Project',
        price: '',
        recurring: '0',
        domain: '',
        niche: 'SaaS',
        hosting: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        saveClient({
            ...formData,
            price: parseFloat(formData.price) || 0,
            recurring: parseFloat(formData.recurring) || 0
        });
        navigate('/clients');
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const InputField = ({ icon, label, name, type = "text", placeholder, options = null }) => (
        <div className="input-group" style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem', color: 'var(--text-dim)', fontWeight: 500 }}>
                {label}
            </label>
            <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)', opacity: 0.8 }}>
                    {icon}
                </div>
                {options ? (
                    <select
                        name={name}
                        value={formData[name]}
                        onChange={handleChange}
                        style={{
                            width: '100%',
                            padding: '1rem 1rem 1rem 3rem',
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid var(--border)',
                            borderRadius: '16px',
                            color: 'var(--text-main)',
                            fontSize: '1rem',
                            outline: 'none',
                            appearance: 'none'
                        }}
                    >
                        {options.map(opt => <option key={opt} value={opt} style={{ background: 'var(--bg-sidebar)' }}>{opt}</option>)}
                    </select>
                ) : (
                    <input
                        type={type}
                        name={name}
                        placeholder={placeholder}
                        value={formData[name]}
                        onChange={handleChange}
                        style={{
                            width: '100%',
                            padding: '1rem 1rem 1rem 3rem',
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid var(--border)',
                            borderRadius: '16px',
                            color: 'var(--text-main)',
                            fontSize: '1rem',
                            outline: 'none'
                        }}
                        required={name === 'name' || name === 'email'}
                    />
                )}
            </div>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="add-client-container"
        >
            <header style={{ marginBottom: '2rem' }}>
                <button onClick={() => navigate(-1)} className="btn-icon" style={{ marginBottom: '0.5rem', padding: '0 0' }}>
                    <ArrowLeft size={24} />
                </button>
                <h1 style={{ fontSize: '1.75rem', marginTop: '0.5rem' }}>New Onboarding</h1>
                <p style={{ fontSize: '0.9rem' }}>Capture project scope and financial details.</p>
            </header>

            <form onSubmit={handleSubmit}>
                {/* Step Indicator - Mobile Friendly */}
                <div className="form-steps-nav glass" style={{
                    display: 'flex', gap: '0.5rem', padding: '0.5rem', marginBottom: '2rem', borderRadius: '14px'
                }}>
                    {[1, 2, 3].map(s => (
                        <div
                            key={s}
                            onClick={() => setStep(s)}
                            style={{
                                flex: 1, height: '6px', borderRadius: '3px',
                                background: step >= s ? 'var(--primary)' : 'var(--border)',
                                transition: 'var(--transition)',
                                cursor: 'pointer'
                            }}
                        />
                    ))}
                </div>

                <div className="form-content" style={{ minHeight: '400px' }}>
                    {step === 1 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                                <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '8px', borderRadius: '10px' }}><User size={20} color="var(--primary)" /></div>
                                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Identity</h3>
                            </div>
                            <InputField icon={<Briefcase size={18} />} label="Company Name" name="name" placeholder="Tesla, SpaceX, etc." />
                            <InputField icon={<User size={18} />} label="Point of Contact" name="contact" placeholder="Elon Musk" />
                            <InputField icon={<Mail size={18} />} label="Email" name="email" type="email" placeholder="elon@x.com" />
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                                <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '8px', borderRadius: '10px' }}><DollarSign size={20} color="var(--accent)" /></div>
                                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Financials</h3>
                            </div>
                            <InputField icon={<Layers size={18} />} label="Service Type" name="type" options={['Full Website', 'Landing Page', 'Maintenance', 'E-commerce UI']} />
                            <InputField icon={<DollarSign size={18} />} label="Project Budget ($)" name="price" type="number" placeholder="5000" />
                            <InputField icon={<Clock size={18} />} label="Monthly Recurring ($)" name="recurring" type="number" placeholder="250" />
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                                <div style={{ background: 'rgba(139, 92, 246, 0.1)', padding: '8px', borderRadius: '10px' }}><Globe size={20} color="#8b5cf6" /></div>
                                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Technical</h3>
                            </div>
                            <InputField icon={<Globe size={18} />} label="Primary Domain" name="domain" placeholder="domain.com" />
                            <InputField icon={<Rocket size={18} />} label="Project Niche" name="niche" options={['E-commerce', 'SaaS', 'Portfolio', 'Corporate', 'Blog', 'Booking']} />
                            <InputField icon={<Server size={18} />} label="Hosting" name="hosting" placeholder="Vercel, AWS, Hostinger" />
                            <InputField icon={<ShieldCheck size={18} />} label="Project Phase" name="status" options={['Lead', 'Discovery', 'Designing', 'Development', 'Testing', 'Live']} />
                        </motion.div>
                    )}
                </div>

                <footer style={{ marginTop: '2rem' }}>
                    {step < 3 ? (
                        <button
                            type="button"
                            onClick={() => setStep(step + 1)}
                            className="btn btn-primary"
                            style={{ width: '100%', padding: '1.1rem', justifyContent: 'center', fontSize: '1rem', borderRadius: '18px' }}
                        >
                            <span>Next Step</span> <ChevronRight size={20} />
                        </button>
                    ) : (
                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ width: '100%', padding: '1.1rem', justifyContent: 'center', fontSize: '1rem', borderRadius: '18px', background: 'var(--accent)', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)' }}
                        >
                            <Save size={20} />
                            <span>Launch Onboarding</span>
                        </button>
                    )}
                </footer>
            </form>

            <style dangerouslySetInnerHTML={{
                __html: `
        @media (max-width: 768px) {
          .add-client-container { padding: 0.5rem !important; }
          .add-client-container h1 { font-size: 1.5rem !important; }
        }
      `}} />
        </motion.div>
    );
};

export default AddClient;

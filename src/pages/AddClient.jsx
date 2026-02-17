import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
    Rocket,
    Instagram,
    Phone,
    Hash,
    Share2
} from 'lucide-react';
import { saveClient } from '../utils/storage';

const InputField = ({ icon, label, name, type = "text", placeholder, options = null, prefix = null, value, onChange }) => (
    <div className="input-group" style={{ marginBottom: '1.25rem' }}>
        <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.4rem', color: 'var(--text-dim)', fontWeight: 500 }}>
            {label}
        </label>
        <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)', opacity: 0.7, zIndex: 2 }}>
                {icon}
            </div>

            {prefix && (
                <div style={{ position: 'absolute', left: '2.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)', fontSize: '0.9rem', fontWeight: 600, zIndex: 2 }}>
                    {prefix}
                </div>
            )}

            {options ? (
                <select
                    name={name}
                    value={value}
                    onChange={onChange}
                    style={{
                        width: '100%',
                        padding: '1rem 1rem 1rem 3rem',
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid var(--border)',
                        borderRadius: '16px',
                        color: 'var(--text-main)',
                        fontSize: '1rem',
                        outline: 'none',
                        appearance: 'none',
                        cursor: 'pointer'
                    }}
                >
                    {options.map(opt => <option key={opt} value={opt} style={{ background: 'var(--bg-sidebar)' }}>{opt}</option>)}
                </select>
            ) : (
                <input
                    type={type}
                    name={name}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    style={{
                        width: '100%',
                        padding: `1rem 1rem 1rem ${prefix ? (prefix.length * 0.6 + 3.2) : 3}rem`,
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

const AddClient = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        contact: '',
        email: '',
        phone: '',
        phoneOwner: '',
        instagram: '',
        socials: '',
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

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="add-client-container"
            style={{ paddingBottom: '2rem' }}
        >
            <header style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button onClick={() => navigate(-1)} className="btn-icon" style={{ padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 style={{ fontSize: '1.5rem', margin: 0 }}>Step {step} of 4</h1>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                        {step === 1 && "Identity & Contact"}
                        {step === 2 && "Social Footprint"}
                        {step === 3 && "Financial Scope (LKR)"}
                        {step === 4 && "System Config"}
                    </p>
                </div>
            </header>

            {/* Progress Bar */}
            <div style={{ display: 'flex', gap: '6px', marginBottom: '2rem' }}>
                {[1, 2, 3, 4].map(s => (
                    <div key={s} style={{ flex: 1, height: '4px', borderRadius: '2px', background: step >= s ? 'var(--primary)' : 'var(--border)', transition: '0.3s' }} />
                ))}
            </div>

            <form onSubmit={handleSubmit}>
                <div className="form-content" style={{ minHeight: '380px' }}>
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div key="st1" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                                <InputField icon={<Briefcase size={18} />} label="Company Name" name="name" placeholder="Ex: Apex Studio" value={formData.name} onChange={handleChange} />
                                <InputField icon={<User size={18} />} label="Primary Person" name="contact" placeholder="Ex: Rehan Perera" value={formData.contact} onChange={handleChange} />
                                <InputField icon={<Mail size={18} />} label="Official Email" name="email" type="email" placeholder="contact@apex.lk" value={formData.email} onChange={handleChange} />
                                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '0.75rem' }}>
                                    <InputField icon={<Phone size={18} />} label="Contact Number" name="phone" placeholder="077123..." value={formData.phone} onChange={handleChange} />
                                    <InputField icon={<User size={18} />} label="Belongs To" name="phoneOwner" placeholder="Owner" value={formData.phoneOwner} onChange={handleChange} />
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div key="st2" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                                <InputField icon={<Instagram size={18} />} label="Instagram Handle" name="instagram" prefix="@" placeholder="rehan_perera" value={formData.instagram} onChange={handleChange} />
                                <InputField icon={<Share2 size={18} />} label="Other Social Link" name="socials" placeholder="linkedin.com/in/..." value={formData.socials} onChange={handleChange} />
                                <InputField icon={<Globe size={18} />} label="Client Website" name="domain" placeholder="example.lk" value={formData.domain} onChange={handleChange} />
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div key="st3" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                                <InputField icon={<Layers size={18} />} label="Project Nature" name="type" options={['Full Website', 'E-commerce', 'Portfolio', 'Maintenance', 'SEO Plan']} value={formData.type} onChange={handleChange} />
                                <InputField icon={<DollarSign size={18} />} label="Development Fee (LKR)" name="price" type="number" prefix="Rs." placeholder="150000" value={formData.price} onChange={handleChange} />
                                <InputField icon={<Clock size={18} />} label="Monthly Recurring (LKR)" name="recurring" type="number" prefix="Rs." placeholder="10000" value={formData.recurring} onChange={handleChange} />
                            </motion.div>
                        )}

                        {step === 4 && (
                            <motion.div key="st4" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                                <InputField icon={<Rocket size={18} />} label="Website Niche" name="niche" options={['SaaS', 'E-commerce', 'Portfolio', 'Corporate', 'Professional', 'Other']} value={formData.niche} onChange={handleChange} />
                                <InputField icon={<Server size={18} />} label="Hosting Engine" name="hosting" placeholder="Vercel, AWS, Namecheap" value={formData.hosting} onChange={handleChange} />
                                <InputField icon={<ShieldCheck size={18} />} label="Onboarding Status" name="status" options={['Lead', 'Discovery', 'Designing', 'Development', 'Testing', 'Live']} value={formData.status} onChange={handleChange} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <footer style={{ marginTop: '2rem', display: 'flex', gap: '0.75rem' }}>
                    {step > 1 && (
                        <button type="button" onClick={() => setStep(step - 1)} className="btn glass" style={{ padding: '1rem', borderRadius: '16px' }}>
                            <ArrowLeft size={20} />
                        </button>
                    )}
                    {step < 4 ? (
                        <button
                            type="button"
                            onClick={() => setStep(step + 1)}
                            className="btn btn-primary"
                            style={{ flex: 1, padding: '1.1rem', justifyContent: 'center', borderRadius: '18px' }}
                        >
                            <span>Continue</span> <ChevronRight size={20} />
                        </button>
                    ) : (
                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ flex: 1, padding: '1.1rem', justifyContent: 'center', borderRadius: '18px', background: 'var(--accent)', boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)' }}
                        >
                            <Save size={20} />
                            <span>Save Partnership</span>
                        </button>
                    )}
                </footer>
            </form>

            <style dangerouslySetInnerHTML={{
                __html: `
        @media (max-width: 768px) {
          .add-client-container { padding: env(safe-area-inset-top) 0.5rem 2rem !important; }
        }
      `}} />
        </motion.div>
    );
};

export default AddClient;

import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import {
    LayoutDashboard,
    Users,
    PlusCircle,
    BarChart3,
    Menu,
    X,
    Bell
} from 'lucide-react';

const Layout = ({ children }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location]);

    const navItems = [
        { icon: <LayoutDashboard size={24} />, label: 'Home', path: '/' },
        { icon: <Users size={24} />, label: 'Clients', path: '/clients' },
        { icon: <PlusCircle size={24} />, label: 'Add', path: '/add' },
        { icon: <BarChart3 size={24} />, label: 'Data', path: '/analytics' },
    ];

    return (
        <div className="app-container">
            {/* Desktop Sidebar */}
            <div className="desktop-only">
                <Sidebar />
            </div>

            {/* Mobile Top Header */}
            <header className="mobile-header glass" style={{
                display: 'none',
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                height: '60px',
                zIndex: 1000,
                padding: '0 1.25rem',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid var(--border)',
                borderRadius: 0
            }}>
                <div style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--primary)' }}>ClientPro</div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <Bell size={20} color="var(--text-dim)" />
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--border)' }}></div>
                </div>
            </header>

            <main className="main-content">
                {children}
            </main>

            {/* Mobile Bottom Navigation */}
            <nav className="mobile-nav glass" style={{
                position: 'fixed',
                bottom: '0',
                left: '0',
                right: '0',
                height: '75px',
                zIndex: 1001,
                display: 'none',
                justifyContent: 'space-around',
                alignItems: 'center',
                padding: '0 1rem',
                borderTop: '1px solid var(--border)',
                borderRadius: '0',
                paddingBottom: 'env(safe-area-inset-bottom)'
            }}>
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        style={({ isActive }) => ({
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '4px',
                            color: isActive ? 'var(--primary)' : 'var(--text-dim)',
                            textDecoration: 'none',
                            fontSize: '0.7rem',
                            fontWeight: isActive ? 600 : 400,
                            transition: 'var(--transition)',
                            position: 'relative',
                            width: '25%'
                        })}
                    >
                        {({ isActive }) => (
                            <>
                                <motion.div
                                    animate={{ scale: isActive ? 1.1 : 1 }}
                                    style={{ color: isActive ? 'var(--primary)' : 'inherit' }}
                                >
                                    {item.icon}
                                </motion.div>
                                <span>{item.label}</span>
                                {isActive && (
                                    <motion.div
                                        layoutId="mobile-nav-indicator"
                                        style={{
                                            position: 'absolute',
                                            top: '-15px',
                                            width: '40px',
                                            height: '4px',
                                            background: 'var(--primary)',
                                            borderRadius: '2px',
                                            boxShadow: '0 0 10px var(--primary-glow)'
                                        }}
                                    />
                                )}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Global CSS for Mobile Transformation */}
            <style dangerouslySetInnerHTML={{
                __html: `
        @media (max-width: 768px) {
          .desktop-only { display: none; }
          .mobile-header { display: flex !important; }
          .mobile-nav { display: flex !important; }
          .main-content { 
            margin-left: 0 !important; 
            padding-top: 80px !important;
            padding-bottom: 100px !important;
          }
        }
      `}} />
        </div>
    );
};

// Simple motion wrapper just in case framer-motion isn't available in this specific direct import context
// Though it is installed and used elsewhere.
import { motion } from 'framer-motion';

export default Layout;

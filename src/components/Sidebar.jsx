import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    BarChart3,
    Users,
    PlusCircle,
    LayoutDashboard,
    Settings,
    Globe,
    Receipt,
    History,
    LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
    const { signOut } = useAuth();
    const navigate = useNavigate();
    const navItems = [
        { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/' },
        { icon: <Users size={20} />, label: 'Clients', path: '/clients' },
        { icon: <PlusCircle size={20} />, label: 'Add Client', path: '/add' },
        { icon: <History size={20} />, label: 'Timeline', path: '/timeline' },
        { icon: <Receipt size={20} />, label: 'Expenses', path: '/expenses' },
        { icon: <BarChart3 size={20} />, label: 'Analytics', path: '/analytics' },
    ];

    return (
        <div className="sidebar glass" style={{
            width: '260px',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            padding: '2rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 100,
            borderRight: '1px solid var(--border)',
            borderTopRightRadius: '0',
            borderBottomRightRadius: '0'
        }}>
            <div className="logo" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '3rem',
                padding: '0 0.5rem'
            }}>
                <div style={{
                    width: '40px',
                    height: '40px',
                    background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 15px var(--primary-glow)'
                }}>
                    <Globe color="white" size={24} />
                </div>
                <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>ClientPro</span>
            </div>

            <nav style={{ flex: 1 }}>
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        style={({ isActive }) => ({
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            padding: '0.875rem 1rem',
                            borderRadius: '12px',
                            color: isActive ? 'var(--text-main)' : 'var(--text-muted)',
                            backgroundColor: isActive ? 'var(--border)' : 'transparent',
                            textDecoration: 'none',
                            marginBottom: '0.5rem',
                            fontWeight: isActive ? 600 : 400,
                            transition: 'var(--transition)'
                        })}
                        className="nav-link"
                    >
                        {item.icon}
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-footer" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <NavLink
                    to="/settings"
                    style={({ isActive }) => ({
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        padding: '0.875rem 1rem',
                        color: 'var(--text-muted)',
                        textDecoration: 'none',
                        fontSize: '0.9rem',
                        transition: 'var(--transition)'
                    })}
                >
                    <Settings size={20} />
                    <span>Settings</span>
                </NavLink>

                <button
                    onClick={async () => {
                        await signOut();
                        navigate('/login');
                    }}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        padding: '0.875rem 1rem',
                        color: 'var(--danger)',
                        background: 'transparent',
                        border: 'none',
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        width: '100%',
                        textAlign: 'left',
                        transition: 'var(--transition)'
                    }}
                    className="nav-link logout-btn"
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;

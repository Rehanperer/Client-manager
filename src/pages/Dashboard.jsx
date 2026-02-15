import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    DollarSign,
    Briefcase,
    TrendingUp,
    PieChart as PieChartIcon,
    Timeline,
    ChevronRight,
    Target,
    ArrowUpRight,
    Zap,
    LayoutDashboard
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    Cell,
    PieChart,
    Pie,
    AreaChart,
    Area,
    Legend
} from 'recharts';
import { getClients } from '../utils/storage';

const Dashboard = () => {
    const [clients, setClients] = useState([]);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        setClients(getClients());
    }, []);

    const totalRevenue = clients.reduce((acc, c) => acc + (c.price || 0), 0);
    const mrr = clients.reduce((acc, c) => acc + (c.recurring || 0), 0);
    const activeProjects = clients.filter(c => c.status !== 'Live').length;
    const avgLTV = clients.length > 0 ? (totalRevenue + (mrr * 12)) / clients.length : 0;

    // Revenue by Niche Analysis
    const nicheDataMap = clients.reduce((acc, c) => {
        const niche = c.niche || 'Other';
        acc[niche] = (acc[niche] || 0) + (c.price || 0);
        return acc;
    }, {});

    const nicheData = Object.entries(nicheDataMap).map(([name, value]) => ({ name, value }));

    // Dynamic Forecasting logic (simplified linear growth)
    const forecastData = [
        { name: 'Jan', revenue: 4200, mrr: 800 },
        { name: 'Feb', revenue: totalRevenue, mrr: mrr },
        { name: 'Mar', revenue: totalRevenue * 1.15, mrr: mrr * 1.1 },
        { name: 'Apr', revenue: totalRevenue * 1.3, mrr: mrr * 1.25 },
        { name: 'May', revenue: totalRevenue * 1.5, mrr: mrr * 1.4 },
        { name: 'Jun', revenue: totalRevenue * 1.8, mrr: mrr * 1.6 },
    ];

    const StatCard = ({ icon, label, value, subtext, color, delay }) => (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay }}
            whileHover={{ y: -5 }}
            className="glass"
            style={{
                padding: '1.25rem',
                flex: 1,
                minWidth: '160px',
                borderLeft: `4px solid ${color}`,
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            <div style={{ position: 'absolute', right: '-10px', top: '-10px', opacity: 0.05 }}>
                {React.cloneElement(icon, { size: 80 })}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div style={{ color: color }}>{icon}</div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 500 }}>{label}</span>
            </div>
            <h2 style={{ marginBottom: '0.25rem', fontSize: '1.5rem', fontWeight: 700 }}>{value}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--accent)' }}>
                <ArrowUpRight size={14} />
                <span>{subtext}</span>
            </div>
        </motion.div>
    );

    const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="dashboard-container"
        >
            <header className="page-header" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 style={{ marginBottom: '0.25rem', fontSize: '1.75rem' }}>Analytics Engine</h1>
                    <p style={{ fontSize: '0.9rem' }}>Project performance and financial forecasting.</p>
                </div>

                <div className="glass" style={{ padding: '4px', borderRadius: '12px', display: 'flex' }}>
                    {['overview', 'charts', 'forecast'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            style={{
                                padding: '0.5rem 1rem',
                                borderRadius: '8px',
                                border: 'none',
                                background: activeTab === tab ? 'var(--primary)' : 'transparent',
                                color: activeTab === tab ? 'white' : 'var(--text-muted)',
                                fontSize: '0.85rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'var(--transition)'
                            }}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>
            </header>

            <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                <StatCard icon={<DollarSign size={20} />} label="Gross Revenue" value={`$${totalRevenue.toLocaleString()}`} subtext="+18% growth" color="#3b82f6" delay={0.1} />
                <StatCard icon={<TrendingUp size={20} />} label="Current MRR" value={`$${mrr.toLocaleString()}`} subtext="Recurring health" color="#10b981" delay={0.2} />
                <StatCard icon={<Zap size={20} />} label="Customer LTV" value={`$${Math.round(avgLTV).toLocaleString()}`} subtext="Life-time value" color="#8b5cf6" delay={0.3} />
                <StatCard icon={<Target size={20} />} label="Pipeline" value={activeProjects} subtext="Active builds" color="#f59e0b" delay={0.4} />
            </div>

            <div className="content-grid" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' }}>
                {/* Main Projection / Forecast Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="glass main-chart-box"
                    style={{ padding: '1.5rem', minHeight: '400px' }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <div>
                            <h3 style={{ fontSize: '1.1rem' }}>Growth Projections</h3>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Expected revenue curve for H1 2024</p>
                        </div>
                        <div className="badge badge-success" style={{ padding: '4px 12px' }}>FORECASTING ON</div>
                    </div>

                    <div style={{ width: '100%', height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={forecastData}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorMRR" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="name" stroke="var(--text-dim)" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="var(--text-dim)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                                <Tooltip
                                    contentStyle={{ background: 'var(--bg-sidebar)', border: '1px solid var(--border)', borderRadius: '12px', backdropFilter: 'blur(10px)' }}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRev)" strokeWidth={3} />
                                <Area type="monotone" dataKey="mrr" stroke="#10b981" fillOpacity={1} fill="url(#colorMRR)" strokeWidth={2} />
                                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Niche Breakdown / Pie Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="glass pie-chart-box"
                    style={{ padding: '1.5rem', minHeight: '400px' }}
                >
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>Niche Performance</h3>
                    <div style={{ width: '100%', height: '240px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={nicheData.length > 0 ? nicheData : [{ name: 'No Data', value: 1 }]}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                    animationDuration={1500}
                                >
                                    {nicheData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ background: 'var(--bg-sidebar)', border: '1px solid var(--border)', borderRadius: '12px' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="legend-list" style={{ marginTop: '1rem' }}>
                        {nicheData.map((item, i) => (
                            <div key={item.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: COLORS[i % COLORS.length] }}></div>
                                    <span>{item.name}</span>
                                </div>
                                <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>${item.value.toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
        @media (max-width: 1024px) {
          .content-grid {
            grid-template-columns: 1fr !important;
          }
          .main-chart-box, .pie-chart-box {
            min-height: 350px !important;
          }
        }
        @media (max-width: 480px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .dashboard-container h1 {
            font-size: 1.5rem !important;
          }
        }
      `}} />
        </motion.div>
    );
};

export default Dashboard;

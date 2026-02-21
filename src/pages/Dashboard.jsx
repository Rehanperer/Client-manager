import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    DollarSign,
    Briefcase,
    TrendingUp,
    PieChart as PieChartIcon,
    ChevronRight,
    Target,
    ArrowUpRight,
    Zap,
    LayoutDashboard,
    Wallet,
    Receipt,
    MinusCircle
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
        const fetchClients = async () => {
            const data = await getClients();
            setClients(data);
        };
        fetchClients();
    }, []);

    const totalRevenue = clients.reduce((acc, c) => acc + (c.price || 0), 0);
    const mrr = clients.reduce((acc, c) => acc + (c.recurring || 0), 0);
    const totalExpenses = clients.reduce((acc, c) => {
        const clientExpenses = (c.expenses || []).reduce((sum, exp) => sum + exp.amount, 0);
        return acc + clientExpenses;
    }, 0);
    const netProfit = totalRevenue - totalExpenses;

    const activeProjects = clients.filter(c => c.status !== 'Live').length;
    const avgLTV = clients.length > 0 ? (totalRevenue + (mrr * 12)) / clients.length : 0;

    // LKR Formatter
    const formatLKR = (val) => {
        return new Intl.NumberFormat('en-LK', {
            style: 'currency',
            currency: 'LKR',
            maximumFractionDigits: 0
        }).format(val).replace('LKR', 'Rs.');
    };

    // Revenue by Niche Analysis
    const nicheDataMap = clients.reduce((acc, c) => {
        const niche = c.niche || 'Other';
        acc[niche] = (acc[niche] || 0) + (c.price || 0);
        return acc;
    }, {});

    const nicheData = Object.entries(nicheDataMap).map(([name, value]) => ({ name, value }));

    // Dynamic Forecasting logic (using profit as well)
    const forecastData = [
        { name: 'Jan', revenue: totalRevenue * 0.7, expenses: totalExpenses * 0.8, profit: (totalRevenue * 0.7) - (totalExpenses * 0.8) },
        { name: 'Feb', revenue: totalRevenue, expenses: totalExpenses, profit: netProfit },
        { name: 'Mar', revenue: totalRevenue * 1.15, expenses: totalExpenses * 1.05, profit: (totalRevenue * 1.15) - (totalExpenses * 1.05) },
        { name: 'Apr', revenue: totalRevenue * 1.3, expenses: totalExpenses * 1.1, profit: (totalRevenue * 1.3) - (totalExpenses * 1.1) },
        { name: 'May', revenue: totalRevenue * 1.5, expenses: totalExpenses * 1.2, profit: (totalRevenue * 1.5) - (totalExpenses * 1.2) },
        { name: 'Jun', revenue: totalRevenue * 1.8, expenses: totalExpenses * 1.4, profit: (totalRevenue * 1.8) - (totalExpenses * 1.4) },
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
            <h2 style={{ marginBottom: '0.25rem', fontSize: '1.25rem', fontWeight: 700 }}>{value}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: subtext.startsWith('-') ? 'var(--danger)' : 'var(--accent)' }}>
                <ArrowUpRight size={14} style={{ transform: subtext.startsWith('-') ? 'rotate(90deg)' : 'none' }} />
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
                    <h1 style={{ marginBottom: '0.25rem', fontSize: '1.75rem' }}>Management Dashboard</h1>
                    <p style={{ fontSize: '0.9rem' }}>Financial health overview in LKR</p>
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

            <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                <StatCard icon={<Wallet size={20} />} label="Total Revenue" value={formatLKR(totalRevenue)} subtext="+12% growth" color="#3b82f6" delay={0.1} />
                <StatCard icon={<Receipt size={20} />} label="Operational Costs" value={formatLKR(totalExpenses)} subtext="Expenses tracked" color="#ef4444" delay={0.2} />
                <StatCard icon={<TrendingUp size={20} />} label="Net Profit" value={formatLKR(netProfit)} subtext="Actual earnings" color="#10b981" delay={0.3} />
                <StatCard icon={<Zap size={20} />} label="LTV Forecast" value={formatLKR(avgLTV)} subtext="Projected avg." color="#8b5cf6" delay={0.4} />
            </div>

            <div className="content-grid" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="glass main-chart-box"
                    style={{ padding: '1.5rem', minHeight: '400px' }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <div>
                            <h3 style={{ fontSize: '1.1rem' }}>Profit vs Revenue Curve</h3>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Net earnings projection</p>
                        </div>
                        <div className="badge badge-success" style={{ padding: '4px 12px' }}>LIVE ANALYTICS</div>
                    </div>

                    <div style={{ width: '100%', height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={forecastData}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="name" stroke="var(--text-dim)" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="var(--text-dim)" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `Rs.${v / 1000}k`} />
                                <Tooltip
                                    formatter={(value) => formatLKR(value)}
                                    contentStyle={{ background: 'var(--bg-sidebar)', border: '1px solid var(--border)', borderRadius: '12px', backdropFilter: 'blur(10px)' }}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRev)" strokeWidth={3} />
                                <Area type="monotone" dataKey="profit" stroke="#10b981" fillOpacity={1} fill="url(#colorProfit)" strokeWidth={2} />
                                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="glass pie-chart-box"
                    style={{ padding: '1.5rem', minHeight: '400px' }}
                >
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>Revenue Breakdown</h3>
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
                                    formatter={(value) => formatLKR(value)}
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
                                <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{formatLKR(item.value)}</span>
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
          .stats-grid h2 {
            font-size: 1.1rem !important;
          }
        }
      `}} />
        </motion.div>
    );
};

export default Dashboard;

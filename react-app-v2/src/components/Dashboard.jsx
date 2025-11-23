import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SEO from './SEO';

const Dashboard = () => {
    const [visitors, setVisitors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:3001/api/visitors')
            .then(res => res.json())
            .then(data => {
                setVisitors(data.reverse()); // Show newest first
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch visitors', err);
                setLoading(false);
            });
    }, []);

    return (
        <div className="container" style={{ paddingTop: '100px', color: 'var(--text-primary)' }}>
            <SEO
                title="Visitor Dashboard | Muneeb's Portfolio"
                description="View real-time visitor statistics for Muneeb's Portfolio."
                keywords="Dashboard, Analytics, Visitor Tracking"
            />
            <h1 style={{ textAlign: 'center', marginBottom: '30px', color: 'var(--primary-color)' }}>Visitor Dashboard</h1>

            {loading ? (
                <p style={{ textAlign: 'center' }}>Loading data...</p>
            ) : (
                <div>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-around',
                        marginBottom: '40px',
                        backgroundColor: '#112240',
                        padding: '20px',
                        borderRadius: '8px'
                    }}>
                        <div style={{ textAlign: 'center' }}>
                            <h3 style={{ color: 'var(--primary-color)', fontSize: '2rem' }}>{visitors.length}</h3>
                            <p>Total Visits</p>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <h3 style={{ color: '#64ffda', fontSize: '2rem' }}>
                                {new Set(visitors.map(v => v.ip)).size}
                            </h3>
                            <p>Unique Visitors</p>
                        </div>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--text-secondary)', textAlign: 'left' }}>
                                    <th style={{ padding: '15px', color: 'var(--primary-color)' }}>Time</th>
                                    <th style={{ padding: '15px', color: 'var(--primary-color)' }}>IP Address</th>
                                    <th style={{ padding: '15px', color: 'var(--primary-color)' }}>User Agent</th>
                                </tr>
                            </thead>
                            <tbody>
                                {visitors.map((visitor, index) => (
                                    <motion.tr
                                        key={index}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        style={{ borderBottom: '1px solid #233554' }}
                                    >
                                        <td style={{ padding: '15px', color: 'var(--text-secondary)' }}>
                                            {new Date(visitor.timestamp).toLocaleString()}
                                        </td>
                                        <td style={{ padding: '15px', color: 'var(--text-secondary)' }}>{visitor.ip}</td>
                                        <td style={{ padding: '15px', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                                            {visitor.userAgent}
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;

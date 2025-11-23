import React from 'react';
import { motion } from 'framer-motion';

const Experience = ({ data }) => {
    return (
        <section id="experience">
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                style={{ display: 'flex', alignItems: 'center', gap: '20px' }}
            >
                <span style={{ color: 'var(--primary-color)', fontSize: '1.5rem' }}>01.</span> Experience
                <span style={{ height: '1px', backgroundColor: 'var(--text-secondary)', flex: 1, maxWidth: '300px' }}></span>
            </motion.h2>

            <div style={{ marginTop: '50px' }}>
                {data.map((job, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.2, duration: 0.5 }}
                        style={{ marginBottom: '40px', paddingLeft: '20px', borderLeft: '2px solid var(--text-secondary)' }}
                    >
                        <h3 style={{ fontSize: '1.5rem', color: 'var(--text-primary)' }}>
                            {job.role} <span style={{ color: 'var(--primary-color)' }}>@ {job.company}</span>
                        </h3>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '10px', fontSize: '0.9rem' }}>
                            {job.start} - {job.end} | {job.location}
                        </p>

                        <ul style={{ color: 'var(--text-secondary)', listStyleType: 'disc', paddingLeft: '20px' }}>
                            {job.highlights.map((highlight, i) => (
                                <li key={i} style={{ marginBottom: '5px' }}>{highlight}</li>
                            ))}
                        </ul>

                        <div style={{ marginTop: '10px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                            {job.technologies && job.technologies.map((tech, i) => (
                                <span key={i} style={{ fontSize: '0.8rem', fontFamily: 'monospace', color: 'var(--primary-color)' }}>
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default Experience;

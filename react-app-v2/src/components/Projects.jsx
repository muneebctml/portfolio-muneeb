import React from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';

const Projects = ({ data }) => {
    return (
        <section id="projects">
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                style={{ display: 'flex', alignItems: 'center', gap: '20px' }}
            >
                <span style={{ color: 'var(--primary-color)', fontSize: '1.5rem' }}>02.</span> Projects
                <span style={{ height: '1px', backgroundColor: 'var(--text-secondary)', flex: 1, maxWidth: '300px' }}></span>
            </motion.h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginTop: '50px' }}>
                {data.map((project, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        style={{
                            backgroundColor: '#112240',
                            padding: '2rem',
                            borderRadius: '4px',
                            transition: 'transform 0.3s ease',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between'
                        }}
                        whileHover={{ y: -10 }}
                    >
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <div style={{ fontSize: '3rem', color: 'var(--primary-color)' }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                                </div>
                                <div style={{ display: 'flex', gap: '15px' }}>
                                    {project.repo && (
                                        <a href={project.repo} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-primary)', fontSize: '1.2rem' }}>
                                            <FaGithub />
                                        </a>
                                    )}
                                    {project.url && (
                                        <a href={project.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-primary)', fontSize: '1.2rem' }}>
                                            <FaExternalLinkAlt />
                                        </a>
                                    )}
                                </div>
                            </div>
                            <h3 style={{ fontSize: '1.4rem', color: 'var(--text-primary)', marginBottom: '10px' }}>{project.name}</h3>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>{project.description}</p>
                        </div>

                        <ul style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 'auto' }}>
                            {project.technologies && project.technologies.map((tech, i) => (
                                <li key={i} style={{ fontFamily: 'monospace' }}>{tech}</li>
                            ))}
                        </ul>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default Projects;

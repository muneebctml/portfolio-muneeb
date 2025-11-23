import React from 'react';
import { motion } from 'framer-motion';

const Contact = ({ data }) => {
    return (
        <section id="contact" style={{ textAlign: 'center', marginBottom: '100px' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
            >
                <p style={{ color: 'var(--primary-color)', fontSize: '1.2rem', marginBottom: '20px' }}>03. What's Next?</p>
                <h2 style={{ fontSize: '3rem', color: 'var(--text-primary)', marginBottom: '20px' }}>Get In Touch</h2>
                <p style={{ maxWidth: '600px', margin: '0 auto 50px', color: 'var(--text-secondary)' }}>
                    I'm currently looking for new opportunities, my inbox is always open. Whether you have a question or just want to say hi, I'll try my best to get back to you!
                </p>
                <a
                    href={`mailto:${data.email}`}
                    style={{
                        display: 'inline-block',
                        padding: '20px 30px',
                        border: '1px solid var(--primary-color)',
                        borderRadius: '4px',
                        color: 'var(--primary-color)',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        transition: 'all 0.3s ease'
                    }}
                >
                    Say Hello
                </a>
            </motion.div>

            <footer style={{ marginTop: '100px', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                <p>Designed & Built by {data.name}</p>
            </footer>
        </section>
    );
};

export default Contact;

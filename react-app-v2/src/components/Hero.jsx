import React from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaEnvelope, FaFilePdf } from 'react-icons/fa';

const Hero = ({ data }) => {
    // Animation variants for background objects
    const circleVariants = {
        animate: {
            y: [0, -20, 0],
            x: [0, 10, 0],
            transition: {
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    const squareVariants = {
        animate: {
            rotate: [0, 180, 360],
            transition: {
                duration: 10,
                repeat: Infinity,
                ease: "linear"
            }
        }
    };

    return (
        <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', paddingTop: '0' }}>
            {/* Background Animated Objects */}
            <motion.div
                variants={circleVariants}
                animate="animate"
                style={{
                    position: 'absolute',
                    top: '20%',
                    left: '10%',
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(100, 255, 218, 0.1)',
                    zIndex: -1
                }}
            />
            <motion.div
                variants={squareVariants}
                animate="animate"
                style={{
                    position: 'absolute',
                    bottom: '20%',
                    right: '10%',
                    width: '80px',
                    height: '80px',
                    backgroundColor: 'rgba(136, 146, 176, 0.1)',
                    zIndex: -1
                }}
            />
            <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 8, repeat: Infinity }}
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: '300px',
                    height: '300px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(10, 25, 47, 0.5)',
                    border: '1px solid rgba(100, 255, 218, 0.05)',
                    transform: 'translate(-50%, -50%)',
                    zIndex: -1
                }}
            />

            <div className="container" style={{ textAlign: 'center', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                {/* Profile Image */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    style={{ marginBottom: '30px' }}
                >
                    <img
                        src={data.photo}
                        alt={data.name}
                        style={{
                            width: '150px',
                            height: '150px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            border: '2px solid var(--primary-color)',
                            boxShadow: '0 0 20px rgba(100, 255, 218, 0.3)'
                        }}
                    />
                </motion.div>

                <motion.h4
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    style={{ color: 'var(--primary-color)', fontSize: '1.2rem', marginBottom: '20px' }}
                >
                    Hi, my name is
                </motion.h4>
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    style={{ fontSize: '4rem', fontWeight: 'bold', marginBottom: '10px', color: 'var(--text-primary)' }}
                >
                    {data.name}.
                </motion.h1>
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '20px', color: 'var(--text-secondary)' }}
                >
                    {data.title}
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    style={{ maxWidth: '600px', margin: '0 auto 40px', color: 'var(--text-secondary)', fontSize: '1.1rem' }}
                >
                    {data.summary}
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0 }}
                    style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}
                >
                    <a href={data.github} target="_blank" rel="noopener noreferrer" style={{ fontSize: '2rem', color: 'var(--text-primary)' }}>
                        <FaGithub />
                    </a>
                    <a href={data.linkedin} target="_blank" rel="noopener noreferrer" style={{ fontSize: '2rem', color: 'var(--text-primary)' }}>
                        <FaLinkedin />
                    </a>
                    <a href={`mailto:${data.email}`} style={{ fontSize: '2rem', color: 'var(--text-primary)' }}>
                        <FaEnvelope />
                    </a>
                    <a href={data.resume} target="_blank" rel="noopener noreferrer" style={{ fontSize: '2rem', color: 'var(--text-primary)' }} title="Download Resume">
                        <FaFilePdf />
                    </a>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;

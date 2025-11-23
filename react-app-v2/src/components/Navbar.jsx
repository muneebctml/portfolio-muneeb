import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const links = [
        { name: 'Home', path: '/' },
        { name: 'Games', path: '/games' },
        { name: 'Dashboard', path: '/dashboard' },
    ];

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <nav style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            zIndex: 100,
            backgroundColor: 'rgba(10, 25, 47, 0.85)',
            backdropFilter: 'blur(10px)',
            padding: '20px 0'
        }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                    Muneeb.
                </Link>

                {/* Desktop Menu */}
                <ul style={{ display: 'none', md: { display: 'flex' }, gap: '30px' }} className="desktop-menu">
                    {links.map((link) => (
                        <li key={link.name}>
                            <Link
                                to={link.path}
                                style={{
                                    color: location.pathname === link.path ? 'var(--primary-color)' : 'var(--text-primary)',
                                    fontWeight: location.pathname === link.path ? 'bold' : 'normal'
                                }}
                            >
                                <span style={{ color: 'var(--primary-color)', marginRight: '5px' }}>0{links.indexOf(link) + 1}.</span>
                                {link.name}
                            </Link>
                        </li>
                    ))}
                </ul>

                {/* Mobile Menu Button */}
                <div className="mobile-menu-btn" onClick={toggleMenu} style={{ fontSize: '1.5rem', color: 'var(--primary-color)', cursor: 'pointer' }}>
                    {isOpen ? <FaTimes /> : <FaBars />}
                </div>

                {/* Mobile Menu Overlay */}
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 100 }}
                        style={{
                            position: 'fixed',
                            top: 0,
                            right: 0,
                            width: '70%',
                            height: '100vh',
                            backgroundColor: '#112240',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            boxShadow: '-10px 0px 30px -15px rgba(2,12,27,0.7)'
                        }}
                    >
                        <div style={{ position: 'absolute', top: '20px', right: '20px', fontSize: '2rem', color: 'var(--primary-color)', cursor: 'pointer' }} onClick={toggleMenu}>
                            <FaTimes />
                        </div>
                        <ul style={{ display: 'flex', flexDirection: 'column', gap: '30px', textAlign: 'center' }}>
                            {links.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        to={link.path}
                                        onClick={toggleMenu}
                                        style={{
                                            color: location.pathname === link.path ? 'var(--primary-color)' : 'var(--text-primary)',
                                            fontSize: '1.2rem'
                                        }}
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                )}
            </div>
            <style>{`
        @media (min-width: 768px) {
          .desktop-menu { display: flex !important; }
          .mobile-menu-btn { display: none !important; }
        }
      `}</style>
        </nav>
    );
};

export default Navbar;

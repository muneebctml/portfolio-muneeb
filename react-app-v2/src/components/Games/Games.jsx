import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Snake from './Snake';
import Game2048 from './Game2048';
import TicTacToe from './TicTacToe';
import Memory from './Memory';
import Clicker from './Clicker';
import SEO from '../SEO';

const GameCard = ({ title, path, color }) => (
    <Link to={path} style={{ textDecoration: 'none' }}>
        <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
                backgroundColor: '#112240',
                padding: '2rem',
                borderRadius: '10px',
                textAlign: 'center',
                border: `2px solid ${color}`,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer'
            }}
        >
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '10px' }}>{title}</h3>
            <div style={{ width: '50px', height: '50px', backgroundColor: color, borderRadius: '50%', marginBottom: '10px' }}></div>
            <p style={{ color: 'var(--text-secondary)' }}>Play Now</p>
        </motion.div>
    </Link>
);

const GamesList = () => (
    <div className="container" style={{ paddingTop: '100px' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '50px', color: 'var(--primary-color)' }}>Arcade Zone</h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px' }}>
            <GameCard title="Snake" path="/games/snake" color="#64ffda" />
            <GameCard title="2048" path="/games/2048" color="#f1c40f" />
            <GameCard title="Tic Tac Toe" path="/games/tictactoe" color="#e74c3c" />
            <GameCard title="Memory Match" path="/games/memory" color="#9b59b6" />
            <GameCard title="Reflex Clicker" path="/games/clicker" color="#3498db" />
        </div>
    </div>
);

const Games = () => {
    return (
        <>
            <SEO
                title="Arcade Zone | Muneeb's Portfolio"
                description="Play classic games like Snake, 2048, and Tic-Tac-Toe in the Arcade Zone."
                keywords="Games, Snake, 2048, Tic-Tac-Toe, React Games"
            />
            <Routes>
                <Route path="/" element={<GamesList />} />
                <Route path="/snake" element={<Snake />} />
                <Route path="/2048" element={<Game2048 />} />
                <Route path="/tictactoe" element={<TicTacToe />} />
                <Route path="/memory" element={<Memory />} />
                <Route path="/clicker" element={<Clicker />} />
            </Routes>
        </>
    );
};

export default Games;

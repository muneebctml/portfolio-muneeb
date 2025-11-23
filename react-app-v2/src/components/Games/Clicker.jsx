import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { motion } from 'framer-motion';

const Clicker = () => {
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(10);
    const [isActive, setIsActive] = useState(false);
    const [highScore, setHighScore] = useState(Cookies.get('clicker_highscore') || 0);

    useEffect(() => {
        let interval = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            if (score > highScore) {
                setHighScore(score);
                Cookies.set('clicker_highscore', score, { expires: 365 });
            }
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft, score, highScore]);

    const startGame = () => {
        setScore(0);
        setTimeLeft(10);
        setIsActive(true);
    };

    const handleClick = () => {
        if (isActive) {
            setScore(score + 1);
        }
    };

    return (
        <div style={{ paddingTop: '100px', textAlign: 'center', color: 'var(--text-primary)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h1 style={{ color: 'var(--primary-color)' }}>Reflex Clicker</h1>
            <p style={{ marginBottom: '20px' }}>Click as fast as you can in 10 seconds!</p>

            <div style={{ marginBottom: '20px', fontSize: '1.5rem' }}>
                <div style={{ marginBottom: '10px' }}>Time Left: <span style={{ color: timeLeft < 3 ? '#e74c3c' : 'var(--primary-color)' }}>{timeLeft}s</span></div>
                <div>Score: {score}</div>
                <div style={{ fontSize: '1rem', marginTop: '10px', color: 'var(--text-secondary)' }}>High Score: {highScore}</div>
            </div>

            {!isActive && timeLeft === 0 && (
                <h2 style={{ color: 'var(--primary-color)', marginBottom: '20px' }}>Time's Up! Final Score: {score}</h2>
            )}

            {!isActive ? (
                <button
                    onClick={startGame}
                    style={{
                        padding: '15px 30px',
                        fontSize: '1.5rem',
                        backgroundColor: 'var(--primary-color)',
                        color: 'var(--bg-color)',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}
                >
                    {timeLeft === 0 ? 'Try Again' : 'Start Game'}
                </button>
            ) : (
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={handleClick}
                    style={{
                        width: '200px',
                        height: '200px',
                        borderRadius: '50%',
                        backgroundColor: '#e74c3c',
                        color: '#fff',
                        fontSize: '2rem',
                        fontWeight: 'bold',
                        border: 'none',
                        cursor: 'pointer',
                        boxShadow: '0 0 20px rgba(231, 76, 60, 0.5)'
                    }}
                >
                    CLICK!
                </motion.button>
            )}
        </div>
    );
};

export default Clicker;

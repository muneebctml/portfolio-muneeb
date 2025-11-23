import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { motion } from 'framer-motion';

const Memory = () => {
    const [cards, setCards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [solved, setSolved] = useState([]);
    const [moves, setMoves] = useState(0);
    const [bestScore, setBestScore] = useState(Cookies.get('memory_best') || 'N/A');
    const [disabled, setDisabled] = useState(false);

    const emojis = ['🎮', '🎲', '🎯', '🎨', '🚀', '💻', '🎧', '📷'];

    useEffect(() => {
        initializeGame();
    }, []);

    const initializeGame = () => {
        const shuffled = [...emojis, ...emojis]
            .sort(() => Math.random() - 0.5)
            .map((emoji, id) => ({ id, emoji }));
        setCards(shuffled);
        setFlipped([]);
        setSolved([]);
        setMoves(0);
        setDisabled(false);
    };

    const handleClick = (id) => {
        if (disabled || flipped.includes(id) || solved.includes(id)) return;

        if (flipped.length === 0) {
            setFlipped([id]);
            return;
        }

        if (flipped.length === 1) {
            setDisabled(true);
            setFlipped([...flipped, id]);
            setMoves(prev => prev + 1);

            const firstCard = cards.find(card => card.id === flipped[0]);
            const secondCard = cards.find(card => card.id === id);

            if (firstCard.emoji === secondCard.emoji) {
                setSolved([...solved, flipped[0], id]);
                setFlipped([]);
                setDisabled(false);
            } else {
                setTimeout(() => {
                    setFlipped([]);
                    setDisabled(false);
                }, 1000);
            }
        }
    };

    useEffect(() => {
        if (solved.length === cards.length && cards.length > 0) {
            const currentBest = Cookies.get('memory_best');
            if (!currentBest || moves < parseInt(currentBest)) {
                Cookies.set('memory_best', moves, { expires: 365 });
                setBestScore(moves);
            }
        }
    }, [solved, moves, cards]);

    return (
        <div style={{ paddingTop: '100px', textAlign: 'center', color: 'var(--text-primary)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h1 style={{ color: 'var(--primary-color)' }}>Memory Match</h1>
            <div style={{ marginBottom: '20px', fontSize: '1.2rem' }}>
                <span style={{ marginRight: '20px' }}>Moves: {moves}</span>
                <span>Best Score (Lowest Moves): {bestScore}</span>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 80px)',
                gap: '10px',
                marginBottom: '20px'
            }}>
                {cards.map((card) => (
                    <motion.div
                        key={card.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleClick(card.id)}
                        animate={{ rotateY: flipped.includes(card.id) || solved.includes(card.id) ? 180 : 0 }}
                        style={{
                            width: '80px',
                            height: '80px',
                            backgroundColor: flipped.includes(card.id) || solved.includes(card.id) ? '#64ffda' : '#112240',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            fontSize: '2rem',
                            cursor: 'pointer',
                            borderRadius: '8px',
                            color: '#0a192f'
                        }}
                    >
                        {(flipped.includes(card.id) || solved.includes(card.id)) ? card.emoji : '?'}
                    </motion.div>
                ))}
            </div>

            {solved.length === cards.length && cards.length > 0 && (
                <button
                    onClick={initializeGame}
                    style={{
                        padding: '10px 20px',
                        fontSize: '1.2rem',
                        backgroundColor: 'var(--primary-color)',
                        color: 'var(--bg-color)',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}
                >
                    Play Again
                </button>
            )}
        </div>
    );
};

export default Memory;

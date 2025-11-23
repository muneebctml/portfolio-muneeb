import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { motion } from 'framer-motion';

const TicTacToe = () => {
    const [board, setBoard] = useState(Array(9).fill(null));
    const [isXNext, setIsXNext] = useState(true);
    const [winner, setWinner] = useState(null);
    const [score, setScore] = useState({ X: 0, O: 0 });

    useEffect(() => {
        const savedScore = Cookies.get('tictactoe_score');
        if (savedScore) setScore(JSON.parse(savedScore));
    }, []);

    useEffect(() => {
        Cookies.set('tictactoe_score', JSON.stringify(score), { expires: 365 });
    }, [score]);

    const handleClick = (index) => {
        if (board[index] || winner) return;

        const newBoard = [...board];
        newBoard[index] = isXNext ? 'X' : 'O';
        setBoard(newBoard);
        setIsXNext(!isXNext);

        const calculatedWinner = calculateWinner(newBoard);
        if (calculatedWinner) {
            setWinner(calculatedWinner);
            setScore(prev => ({ ...prev, [calculatedWinner]: prev[calculatedWinner] + 1 }));
        } else if (!newBoard.includes(null)) {
            setWinner('Draw');
        }
    };

    const calculateWinner = (squares) => {
        const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];
        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                return squares[a];
            }
        }
        return null;
    };

    const resetGame = () => {
        setBoard(Array(9).fill(null));
        setIsXNext(true);
        setWinner(null);
    };

    return (
        <div style={{ paddingTop: '100px', textAlign: 'center', color: 'var(--text-primary)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h1 style={{ color: 'var(--primary-color)' }}>Tic Tac Toe</h1>
            <div style={{ marginBottom: '20px', fontSize: '1.2rem' }}>
                <span style={{ marginRight: '20px', color: '#64ffda' }}>Player X: {score.X}</span>
                <span style={{ color: '#e74c3c' }}>Player O: {score.O}</span>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 100px)',
                gap: '10px',
                marginBottom: '20px'
            }}>
                {board.map((square, i) => (
                    <motion.div
                        key={i}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleClick(i)}
                        style={{
                            width: '100px',
                            height: '100px',
                            backgroundColor: '#112240',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            fontSize: '3rem',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            color: square === 'X' ? '#64ffda' : '#e74c3c',
                            borderRadius: '8px'
                        }}
                    >
                        {square}
                    </motion.div>
                ))}
            </div>

            {winner && (
                <div style={{ marginBottom: '20px' }}>
                    <h2 style={{ color: 'var(--text-primary)' }}>
                        {winner === 'Draw' ? "It's a Draw!" : `Winner: ${winner}`}
                    </h2>
                    <button
                        onClick={resetGame}
                        style={{
                            marginTop: '10px',
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
                </div>
            )}
            {!winner && <p style={{ color: 'var(--text-secondary)' }}>Next Player: {isXNext ? 'X' : 'O'}</p>}
        </div>
    );
};

export default TicTacToe;

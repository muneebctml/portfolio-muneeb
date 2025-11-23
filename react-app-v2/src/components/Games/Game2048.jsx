import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { motion } from 'framer-motion';

const Game2048 = () => {
    const [board, setBoard] = useState(Array(4).fill().map(() => Array(4).fill(0)));
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(Cookies.get('2048_highscore') || 0);
    const [gameOver, setGameOver] = useState(false);

    useEffect(() => {
        initializeGame();
    }, []);

    useEffect(() => {
        if (score > highScore) {
            setHighScore(score);
            Cookies.set('2048_highscore', score, { expires: 365 });
        }
    }, [score, highScore]);

    const initializeGame = () => {
        const newBoard = Array(4).fill().map(() => Array(4).fill(0));
        addRandomTile(newBoard);
        addRandomTile(newBoard);
        setBoard(newBoard);
        setScore(0);
        setGameOver(false);
    };

    const addRandomTile = (currentBoard) => {
        const emptyTiles = [];
        currentBoard.forEach((row, r) => {
            row.forEach((val, c) => {
                if (val === 0) emptyTiles.push({ r, c });
            });
        });

        if (emptyTiles.length > 0) {
            const { r, c } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
            currentBoard[r][c] = Math.random() < 0.9 ? 2 : 4;
        }
    };

    const move = (direction) => {
        if (gameOver) return;

        let newBoard = JSON.parse(JSON.stringify(board));
        let moved = false;
        let addedScore = 0;

        const rotateBoard = (b) => {
            const N = b.length;
            const res = Array(N).fill().map(() => Array(N).fill(0));
            for (let r = 0; r < N; r++) {
                for (let c = 0; c < N; c++) {
                    res[c][N - 1 - r] = b[r][c];
                }
            }
            return res;
        };

        let rotated = newBoard;
        let rotations = 0;

        if (direction === 'ArrowLeft') rotations = 0;
        else if (direction === 'ArrowDown') rotations = 1;
        else if (direction === 'ArrowRight') rotations = 2;
        else if (direction === 'ArrowUp') rotations = 3;

        for (let i = 0; i < rotations; i++) rotated = rotateBoard(rotated);

        // Shift and merge logic (Left)
        for (let r = 0; r < 4; r++) {
            let row = rotated[r].filter(val => val !== 0);
            for (let c = 0; c < row.length - 1; c++) {
                if (row[c] === row[c + 1]) {
                    row[c] *= 2;
                    addedScore += row[c];
                    row.splice(c + 1, 1);
                }
            }
            while (row.length < 4) row.push(0);
            if (JSON.stringify(rotated[r]) !== JSON.stringify(row)) moved = true;
            rotated[r] = row;
        }

        // Rotate back
        for (let i = 0; i < (4 - rotations) % 4; i++) rotated = rotateBoard(rotated);
        newBoard = rotated;

        if (moved) {
            addRandomTile(newBoard);
            setBoard(newBoard);
            setScore(prev => prev + addedScore);
            if (checkGameOver(newBoard)) setGameOver(true);
        }
    };

    const checkGameOver = (currentBoard) => {
        // Check for empty cells
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                if (currentBoard[r][c] === 0) return false;
            }
        }
        // Check for possible merges
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                if (c < 3 && currentBoard[r][c] === currentBoard[r][c + 1]) return false;
                if (r < 3 && currentBoard[r][c] === currentBoard[r + 1][c]) return false;
            }
        }
        return true;
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                e.preventDefault();
                move(e.key);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [board, gameOver]);

    const getTileColor = (value) => {
        const colors = {
            0: '#cdc1b4',
            2: '#eee4da',
            4: '#ede0c8',
            8: '#f2b179',
            16: '#f59563',
            32: '#f67c5f',
            64: '#f65e3b',
            128: '#edcf72',
            256: '#edcc61',
            512: '#edc850',
            1024: '#edc53f',
            2048: '#edc22e'
        };
        return colors[value] || '#3c3a32';
    };

    return (
        <div style={{ paddingTop: '100px', textAlign: 'center', color: 'var(--text-primary)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h1 style={{ color: 'var(--primary-color)' }}>2048</h1>
            <div style={{ marginBottom: '20px', fontSize: '1.2rem' }}>
                <span style={{ marginRight: '20px' }}>Score: {score}</span>
                <span>High Score: {highScore}</span>
            </div>

            <div style={{
                backgroundColor: '#bbada0',
                padding: '10px',
                borderRadius: '5px',
                position: 'relative'
            }}>
                {board.map((row, r) => (
                    <div key={r} style={{ display: 'flex' }}>
                        {row.map((val, c) => (
                            <motion.div
                                key={`${r}-${c}`}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                style={{
                                    width: '80px',
                                    height: '80px',
                                    backgroundColor: getTileColor(val),
                                    margin: '5px',
                                    borderRadius: '3px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    fontSize: '2rem',
                                    fontWeight: 'bold',
                                    color: val > 4 ? '#f9f6f2' : '#776e65'
                                }}
                            >
                                {val !== 0 && val}
                            </motion.div>
                        ))}
                    </div>
                ))}
                {gameOver && (
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(238, 228, 218, 0.73)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: '5px'
                    }}>
                        <h2 style={{ color: '#776e65', fontSize: '3rem', marginBottom: '20px' }}>Game Over!</h2>
                        <button
                            onClick={initializeGame}
                            style={{
                                padding: '10px 20px',
                                fontSize: '1.2rem',
                                backgroundColor: '#8f7a66',
                                color: '#f9f6f2',
                                border: 'none',
                                borderRadius: '3px',
                                cursor: 'pointer',
                                fontWeight: 'bold'
                            }}
                        >
                            Try Again
                        </button>
                    </div>
                )}
            </div>
            <p style={{ marginTop: '20px', color: 'var(--text-secondary)' }}>Use Arrow Keys to Move</p>
        </div>
    );
};

export default Game2048;

import React, { useState, useEffect, useRef } from 'react';
import Cookies from 'js-cookie';

const Snake = () => {
    const canvasRef = useRef(null);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(Cookies.get('snake_highscore') || 0);
    const [gameOver, setGameOver] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);

    const GRID_SIZE = 20;
    const SPEED = 100;

    useEffect(() => {
        if (score > highScore) {
            setHighScore(score);
            Cookies.set('snake_highscore', score, { expires: 365 });
        }
    }, [score, highScore]);

    useEffect(() => {
        if (!gameStarted) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        let snake = [{ x: 10, y: 10 }];
        let food = { x: 15, y: 15 };
        let dx = 1;
        let dy = 0;
        let intervalId;

        const draw = () => {
            // Clear canvas
            ctx.fillStyle = '#0a192f';
            ctx.fillRect(0, 0, width, height);

            // Draw Snake
            ctx.fillStyle = '#64ffda';
            snake.forEach(segment => {
                ctx.fillRect(segment.x * GRID_SIZE, segment.y * GRID_SIZE, GRID_SIZE - 2, GRID_SIZE - 2);
            });

            // Draw Food
            ctx.fillStyle = '#e74c3c';
            ctx.fillRect(food.x * GRID_SIZE, food.y * GRID_SIZE, GRID_SIZE - 2, GRID_SIZE - 2);
        };

        const move = () => {
            const head = { x: snake[0].x + dx, y: snake[0].y + dy };

            // Wall collision
            if (head.x < 0 || head.x >= width / GRID_SIZE || head.y < 0 || head.y >= height / GRID_SIZE) {
                endGame();
                return;
            }

            // Self collision
            if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
                endGame();
                return;
            }

            snake.unshift(head);

            // Eat food
            if (head.x === food.x && head.y === food.y) {
                setScore(prev => prev + 10);
                generateFood();
            } else {
                snake.pop();
            }

            draw();
        };

        const generateFood = () => {
            food = {
                x: Math.floor(Math.random() * (width / GRID_SIZE)),
                y: Math.floor(Math.random() * (height / GRID_SIZE))
            };
            // Ensure food doesn't spawn on snake
            if (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
                generateFood();
            }
        };

        const endGame = () => {
            clearInterval(intervalId);
            setGameOver(true);
            setGameStarted(false);
        };

        const handleKeyDown = (e) => {
            switch (e.key) {
                case 'ArrowUp': if (dy !== 1) { dx = 0; dy = -1; } break;
                case 'ArrowDown': if (dy !== -1) { dx = 0; dy = 1; } break;
                case 'ArrowLeft': if (dx !== 1) { dx = -1; dy = 0; } break;
                case 'ArrowRight': if (dx !== -1) { dx = 1; dy = 0; } break;
                default: break;
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        intervalId = setInterval(move, SPEED);

        return () => {
            clearInterval(intervalId);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [gameStarted]);

    const startGame = () => {
        setScore(0);
        setGameOver(false);
        setGameStarted(true);
    };

    return (
        <div style={{ paddingTop: '100px', textAlign: 'center', color: 'var(--text-primary)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h1 style={{ color: 'var(--primary-color)' }}>Snake</h1>
            <div style={{ marginBottom: '20px', fontSize: '1.2rem' }}>
                <span style={{ marginRight: '20px' }}>Score: {score}</span>
                <span>High Score: {highScore}</span>
            </div>

            <div style={{ position: 'relative', border: '2px solid var(--text-secondary)', borderRadius: '4px' }}>
                <canvas
                    ref={canvasRef}
                    width={400}
                    height={400}
                    style={{ display: 'block', backgroundColor: '#0a192f' }}
                />
                {(!gameStarted || gameOver) && (
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(10, 25, 47, 0.8)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        {gameOver && <h2 style={{ color: '#e74c3c', marginBottom: '20px' }}>Game Over!</h2>}
                        <button
                            onClick={startGame}
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
                            {gameOver ? 'Try Again' : 'Start Game'}
                        </button>
                        <p style={{ marginTop: '10px', color: 'var(--text-secondary)' }}>Use Arrow Keys to Move</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Snake;

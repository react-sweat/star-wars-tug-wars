import { useState, useEffect } from 'react';
import { socket } from '../socket';

interface GameProps {
    playerTeam: 'red' | 'blue';
    character: string;
    onRestart: () => void;
}

export default function Game({ playerTeam, onRestart }: GameProps) {
    const [score, setScore] = useState(0);
    const [winner, setWinner] = useState<'red' | 'blue' | null>(null);
    const [cooldown, setCooldown] = useState(false);

    useEffect(() => {
        socket.on('update_score', (newScore: number) => {
            setScore(newScore);
        });

        return () => {
            socket.off('update_score');
        };
    }, []);

    useEffect(() => {
        if (score >= 100) setWinner('red');
        if (score <= -100) setWinner('blue');
    }, [score]);

    const handlePull = () => {
        if (winner || cooldown) return;

        socket.emit('pull', playerTeam);

        setCooldown(true);
        setTimeout(() => setCooldown(false), 500);
    };

    const handleRestartGame = () => {
        socket.emit('reset');
        onRestart();
    };

    const calculateProgress = () => {
        return ((score + 100) / 200) * 100;
    };

    return (
        <div className="game-container">
            <h1 className="star-wars-title">TUG OF WAR</h1>

            {winner && (
                <div className="winner-overlay">
                    <div className="winner-text" style={{ color: winner === 'red' ? '#ff3333' : '#3333ff' }}>
                        {winner === 'red' ? 'THE DARK SIDE' : 'THE LIGHT SIDE'} WINS
                    </div>
                    <button onClick={handleRestartGame}>PLAY AGAIN</button>
                </div>
            )}

            <div className="score-board">
                Score: {score}
            </div>

            <div className="progress-container">
                <div className="center-marker"></div>
                <div
                    className={`progress-bar ${score > 0 ? 'progress-red' : 'progress-blue'}`}
                    style={{ width: `${calculateProgress()}%` }}
                >
                </div>
            </div>

            <div className="controls">
                <button
                    className={`pull-btn ${playerTeam === 'red' ? 'btn-red' : 'btn-blue'}`}
                    onClick={handlePull}
                    disabled={cooldown || !!winner}
                    style={{ opacity: cooldown ? 0.5 : 1 }}
                >
                    {cooldown ? 'CHARGING...' : 'PULL!'}
                </button>
            </div>

            <p style={{ marginTop: '20px', opacity: 0.7 }}>
                You are playing as {playerTeam === 'red' ? 'The Dark Side' : 'The Light Side'}
            </p>
        </div>
    );
}

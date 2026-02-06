import { useState, useEffect } from 'react';
import { socket } from '../socket';
import { CHARACTERS } from '../characters';

interface GameProps {
    roomCode: string;
    playerTeam: 'red' | 'blue';
    characterIds: { red: string; blue: string };
    onRestart: () => void;
}

export default function Game({ roomCode, playerTeam, characterIds, onRestart }: GameProps) {
    const [score, setScore] = useState(0);
    const [playerCounts, setPlayerCounts] = useState({ red: 0, blue: 0 });
    const [winner, setWinner] = useState<'red' | 'blue' | null>(null);
    const [cooldown, setCooldown] = useState(false);

    useEffect(() => {
        socket.on('update_score', (newScore: number) => {
            setScore(newScore);
        });

        socket.on('room_update', (config) => {
            setPlayerCounts(config.playerCounts);
        });

        return () => {
            socket.off('update_score');
            socket.off('room_update');
        };
    }, []);

    useEffect(() => {
        if (score >= 100) setWinner('red');
        if (score <= -100) setWinner('blue');
    }, [score]);

    const handlePull = () => {
        if (winner || cooldown) return;

        socket.emit('pull', { roomCode, team: playerTeam });

        setCooldown(true);
        setTimeout(() => setCooldown(false), 500);
    };

    const handleRestartGame = () => {
        socket.emit('reset', roomCode);
        onRestart();
    };

    const calculateProgress = () => {
        return ((score + 100) / 200) * 100;
    };

    const redChar = CHARACTERS.find(c => c.id === characterIds.red);
    const blueChar = CHARACTERS.find(c => c.id === characterIds.blue);

    return (
        <div className="game-container">
            <h1 className="star-wars-title smaller">TUG OF WAR</h1>
            <h2 className="room-display">ROOM: {roomCode}</h2>

            {winner && (
                <div className="winner-overlay">
                    <div className="winner-text" style={{ color: winner === 'red' ? '#ff3333' : '#3333ff' }}>
                        {winner === 'red' ? 'THE DARK SIDE' : 'THE LIGHT SIDE'} WINS
                    </div>
                    <button onClick={handleRestartGame}>BACK TO LOBBY</button>
                </div>
            )}

            <div className="battlefield compact">
                <div className="team-stats blue-stats">
                    <img src={blueChar?.image} alt="Jedi" className={`game-char-img ${score <= 0 && score > -100 ? 'pulling' : ''}`} />
                    <div className="char-name">{blueChar?.name}</div>
                    <div className="player-count">Ps: {playerCounts.blue}</div>
                </div>

                <div className="tug-area">
                    <div className="score-board">Score: {score}</div>
                    <div className="progress-container">
                        <div className="center-marker"></div>
                        <div
                            className={`progress-bar ${score > 0 ? 'progress-red' : 'progress-blue'}`}
                            style={{ width: `${calculateProgress()}%` }}
                        >
                        </div>
                    </div>
                </div>

                <div className="team-stats red-stats">
                    <img src={redChar?.image} alt="Sith" className={`game-char-img ${score >= 0 && score < 100 ? 'pulling' : ''}`} />
                    <div className="char-name">{redChar?.name}</div>
                    <div className="player-count">Ps: {playerCounts.red}</div>
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
                You are playing for {playerTeam === 'red' ? 'The Dark Side' : 'The Light Side'}
            </p>
        </div>
    );
}

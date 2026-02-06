import { useState, useEffect } from 'react';
import { socket } from '../socket';
import { CHARACTERS } from '../characters';

interface TeamSelectionProps {
    roomCode: string;
    isCreator: boolean;
    onSelectTeam: (team: 'red' | 'blue' | null, charIds: { red: string; blue: string }) => void;
}

export default function TeamSelection({ roomCode, isCreator, onSelectTeam }: TeamSelectionProps) {
    const [config, setConfig] = useState({
        characters: { red: 'darth_vader', blue: 'luke_skywalker' },
        playerCounts: { red: 0, blue: 0 }
    });
    const [selectedTeam, setSelectedTeam] = useState<'red' | 'blue' | null>(null);

    useEffect(() => {
        socket.on('room_update', (newConfig) => {
            setConfig(newConfig);
        });

        socket.on('team_joined', (response) => {
            if (response.success) {
                setSelectedTeam(response.team);
                onSelectTeam(response.team, config.characters);
            }
        });

        // Get initial config if joining
        socket.on('room_joined', ({ config: initialConfig }) => {
            if (initialConfig) setConfig(initialConfig);
        });

        return () => {
            socket.off('room_update');
            socket.off('team_joined');
            socket.off('room_joined');
        };
    }, [onSelectTeam, config.characters]);

    const handleJoin = (team: 'red' | 'blue') => {
        socket.emit('join_team', { roomCode, team });
    };

    const handleStartGame = () => {
        socket.emit('start_game', roomCode);
    };

    const handleCharChange = (team: 'red' | 'blue', charId: string) => {
        if (!isCreator) return;
        const newChars = { ...config.characters, [team]: charId };
        socket.emit('update_config', { roomCode, characters: newChars });
    };

    const darkChars = CHARACTERS.filter(c => c.side === 'dark');
    const lightChars = CHARACTERS.filter(c => c.side === 'light');

    return (
        <div className="selection-container">
            <h1 className="star-wars-title">ROOM: {roomCode}</h1>
            <p className="subtitle">Choose Your Side</p>

            <div className="team-selection">
                {/* BLUE SIDE */}
                <div className="team-column">
                    <div className="character-picker">
                        {isCreator ? (
                            <select
                                className="char-select"
                                value={config.characters.blue}
                                onChange={(e) => handleCharChange('blue', e.target.value)}
                            >
                                {lightChars.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        ) : (
                            <h3 className="char-name-display">{CHARACTERS.find(c => c.id === config.characters.blue)?.name}</h3>
                        )}
                        <img
                            src={CHARACTERS.find(c => c.id === config.characters.blue)?.image}
                            alt="Jedi"
                            className={`selection-img ${selectedTeam === 'blue' ? 'selected-team' : ''}`}
                        />
                    </div>
                    <button
                        className={`join-btn btn-blue ${selectedTeam === 'blue' ? 'active' : ''}`}
                        onClick={() => handleJoin('blue')}
                    >
                        {selectedTeam === 'blue' ? 'JOINED BLUE SIDE' : `JOIN LIGHT SIDE (${config.playerCounts.blue})`}
                    </button>
                </div>

                <div className="vs-divider">VS</div>

                {/* RED SIDE */}
                <div className="team-column">
                    <div className="character-picker">
                        {isCreator ? (
                            <select
                                className="char-select"
                                value={config.characters.red}
                                onChange={(e) => handleCharChange('red', e.target.value)}
                            >
                                {darkChars.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        ) : (
                            <h3 className="char-name-display">{CHARACTERS.find(c => c.id === config.characters.red)?.name}</h3>
                        )}
                        <img
                            src={CHARACTERS.find(c => c.id === config.characters.red)?.image}
                            alt="Sith"
                            className={`selection-img ${selectedTeam === 'red' ? 'selected-team' : ''}`}
                        />
                    </div>
                    <button
                        className={`join-btn btn-red ${selectedTeam === 'red' ? 'active' : ''}`}
                        onClick={() => handleJoin('red')}
                    >
                        {selectedTeam === 'red' ? 'JOINED RED SIDE' : `JOIN DARK SIDE (${config.playerCounts.red})`}
                    </button>
                </div>
            </div>

            <div className="lobby-controls">
                {isCreator ? (
                    <button
                        className="start-game-btn"
                        onClick={handleStartGame}
                        disabled={!selectedTeam}
                    >
                        START GAME
                    </button>
                ) : (
                    <div className="waiting-msg">
                        {selectedTeam ? "WAITING FOR CREATOR TO START..." : "SELECT A SIDE TO CONTINUE"}
                    </div>
                )}
            </div>
        </div>
    );
}

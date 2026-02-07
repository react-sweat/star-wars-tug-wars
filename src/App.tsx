import { useState, useEffect } from 'react';
import './index.css';
import RoomEntry from './components/RoomEntry';
import TeamSelection from './components/TeamSelection';
import Game from './components/Game';
import { socket } from './socket';

function App() {
  const [roomCode, setRoomCode] = useState('');
  const [isCreator, setIsCreator] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [gameState, setGameState] = useState<{
    team: 'red' | 'blue' | null;
    characterIds: { red: string; blue: string };
    playerCounts: { red: number; blue: number };
  }>({
    team: null,
    characterIds: { red: 'darth_vader', blue: 'luke_skywalker' },
    playerCounts: { red: 0, blue: 0 },
  });

  const handleJoinedRoom = (code: string, creator: boolean, started: boolean, config?: any) => {
    setRoomCode(code);
    setIsCreator(creator);
    setGameStarted(started);
    setShowCountdown(false); // No countdown for late joiners
    if (config?.characters) {
      setGameState(prev => ({
        ...prev,
        characterIds: config.characters,
        playerCounts: config.playerCounts || prev.playerCounts
      }));
    }
  };

  const handleSelectTeam = (team: 'red' | 'blue' | null, charIds: { red: string; blue: string }) => {
    setGameState(prev => ({ ...prev, team, characterIds: charIds }));
  };

  useEffect(() => {
    socket.on('game_started', () => {
      setGameStarted(true);
      setShowCountdown(true);
    });

    socket.on('room_update', (config) => {
      if (config.playerCounts) {
        setGameState(prev => ({ ...prev, playerCounts: config.playerCounts }));
      }
      if (config.characters) {
        setGameState(prev => ({ ...prev, characterIds: config.characters }));
      }
    });

    return () => {
      socket.off('game_started');
      socket.off('room_update');
    };
  }, []);

  const handleRestart = () => {
    setRoomCode('');
    setIsCreator(false);
    setGameStarted(false);
    setGameState({
      team: null,
      characterIds: { red: 'darth_vader', blue: 'luke_skywalker' },
      playerCounts: { red: 0, blue: 0 }
    });
  };

  return (
    <div className="app">
      {!roomCode ? (
        <RoomEntry onJoined={handleJoinedRoom} />
      ) : !gameStarted ? (
        <TeamSelection
          roomCode={roomCode}
          isCreator={isCreator}
          initialCharacters={gameState.characterIds}
          initialPlayerCounts={gameState.playerCounts}
          onSelectTeam={handleSelectTeam}
        />
      ) : (
        <Game
          roomCode={roomCode}
          playerTeam={gameState.team || 'blue'}
          characterIds={gameState.characterIds}
          initialPlayerCounts={gameState.playerCounts}
          onRestart={handleRestart}
          showCountdown={showCountdown}
        />
      )}
    </div>
  );
}

export default App;

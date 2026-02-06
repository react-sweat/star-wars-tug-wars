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
  const [gameState, setGameState] = useState<{
    team: 'red' | 'blue' | null;
    characterIds: { red: string; blue: string };
  }>({
    team: null,
    characterIds: { red: 'darth_vader', blue: 'luke_skywalker' },
  });

  const handleJoinedRoom = (code: string, creator: boolean, started: boolean) => {
    setRoomCode(code);
    setIsCreator(creator);
    setGameStarted(started);
  };

  const handleSelectTeam = (team: 'red' | 'blue' | null, charIds: { red: string; blue: string }) => {
    setGameState({ team, characterIds: charIds });
  };

  useEffect(() => {
    socket.on('game_started', () => {
      setGameStarted(true);
    });

    return () => {
      socket.off('game_started');
    };
  }, []);

  const handleRestart = () => {
    setRoomCode('');
    setIsCreator(false);
    setGameStarted(false);
    setGameState({ team: null, characterIds: { red: 'darth_vader', blue: 'luke_skywalker' } });
  };

  return (
    <div className="app">
      {!roomCode ? (
        <RoomEntry onJoined={handleJoinedRoom} />
      ) : !gameStarted ? (
        <TeamSelection
          roomCode={roomCode}
          isCreator={isCreator}
          onSelectTeam={handleSelectTeam}
        />
      ) : (
        <Game
          roomCode={roomCode}
          playerTeam={gameState.team || 'blue'}
          characterIds={gameState.characterIds}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}

export default App;

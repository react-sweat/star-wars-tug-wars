import { useState } from 'react';
import './index.css';
import RoomEntry from './components/RoomEntry';
import TeamSelection from './components/TeamSelection';
import Game from './components/Game';

function App() {
  const [roomCode, setRoomCode] = useState('');
  const [isCreator, setIsCreator] = useState(false);
  const [gameState, setGameState] = useState<{
    team: 'red' | 'blue' | null;
    characterIds: { red: string; blue: string };
  }>({
    team: null,
    characterIds: { red: 'darth_vader', blue: 'luke_skywalker' },
  });

  const handleJoinedRoom = (code: string, creator: boolean) => {
    setRoomCode(code);
    setIsCreator(creator);
  };

  const handleSelectTeam = (team: 'red' | 'blue' | null, charIds: { red: string; blue: string }) => {
    setGameState({ team, characterIds: charIds });
  };

  const handleRestart = () => {
    setRoomCode('');
    setIsCreator(false);
    setGameState({ team: null, characterIds: { red: 'darth_vader', blue: 'luke_skywalker' } });
  };

  return (
    <div className="app">
      {!roomCode ? (
        <RoomEntry onJoined={handleJoinedRoom} />
      ) : !gameState.team ? (
        <TeamSelection
          roomCode={roomCode}
          isCreator={isCreator}
          onSelectTeam={handleSelectTeam}
        />
      ) : (
        <Game
          roomCode={roomCode}
          playerTeam={gameState.team}
          characterIds={gameState.characterIds}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}

export default App;

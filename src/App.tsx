import { useState } from 'react';
import './index.css';
import TeamSelection from './components/TeamSelection';
import Game from './components/Game';

function App() {
  const [gameState, setGameState] = useState<{
    team: 'red' | 'blue' | null;
    character: string;
  }>({
    team: null,
    character: '',
  });

  const handleSelectTeam = (team: 'red' | 'blue' | null, character: string) => {
    setGameState({ team, character });
  };

  const handleRestart = () => {
    setGameState({ team: null, character: '' });
  };

  return (
    <>
      {!gameState.team ? (
        <TeamSelection onSelectTeam={handleSelectTeam} />
      ) : (
        <Game
          playerTeam={gameState.team}
          character={gameState.character}
          onRestart={handleRestart}
        />
      )}
    </>
  );
}

export default App;

import { useState, useEffect } from 'react';
import { socket } from '../socket';

interface TeamSelectionProps {
    onSelectTeam: (team: 'red' | 'blue' | null, character: string) => void;
}

export default function TeamSelection({ onSelectTeam }: TeamSelectionProps) {
    const [takenTeams, setTakenTeams] = useState<{ red: string | null, blue: string | null }>({ red: null, blue: null });

    useEffect(() => {
        socket.on('team_update', (teams) => {
            setTakenTeams(teams);
        });

        socket.on('team_joined', (response) => {
            if (response.success) {
                onSelectTeam(response.team, response.team === 'red' ? 'Sith Lord' : 'Jedi Knight');
            }
        });

        return () => {
            socket.off('team_update');
            socket.off('team_joined');
        };
    }, [onSelectTeam]);

    const handleJoin = (team: 'red' | 'blue') => {
        if (!takenTeams[team]) {
            socket.emit('join_team', team);
        }
    };

    return (
        <div>
            <h1 className="star-wars-title">Choose Your Side</h1>

            <div className="team-container">
                <div
                    className={`team-card team-blue ${takenTeams.blue ? 'disabled' : ''}`}
                    onClick={() => handleJoin('blue')}
                    style={{ opacity: takenTeams.blue ? 0.5 : 1, cursor: takenTeams.blue ? 'not-allowed' : 'pointer' }}
                >
                    <h2>The Light Side</h2>
                    <p>{takenTeams.blue ? '(Taken)' : 'Peace & Justice'}</p>
                </div>

                <div
                    className={`team-card team-red ${takenTeams.red ? 'disabled' : ''}`}
                    onClick={() => handleJoin('red')}
                    style={{ opacity: takenTeams.red ? 0.5 : 1, cursor: takenTeams.red ? 'not-allowed' : 'pointer' }}
                >
                    <h2>The Dark Side</h2>
                    <p>{takenTeams.red ? '(Taken)' : 'Power & Passion'}</p>
                </div>
            </div>
        </div>
    );
}

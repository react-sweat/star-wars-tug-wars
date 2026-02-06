import { useState, useEffect } from 'react';
import { socket } from '../socket';
import logo from '../assets/logo.png';

interface RoomEntryProps {
    onJoined: (roomCode: string, isCreator: boolean, isStarted: boolean, config?: any) => void;
}

export default function RoomEntry({ onJoined }: RoomEntryProps) {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        socket.on('room_created', ({ roomCode, isCreator, isStarted, config }) => {
            onJoined(roomCode, isCreator, isStarted || false, config);
        });

        socket.on('room_joined', ({ roomCode, isCreator, isStarted, config }) => {
            onJoined(roomCode, isCreator, isStarted || false, config);
        });

        socket.on('error', ({ message }) => {
            setError(message);
        });

        return () => {
            socket.off('room_created');
            socket.off('room_joined');
            socket.off('error');
        };
    }, [onJoined]);

    const handleCreate = () => {
        socket.emit('create_room');
    };

    const handleJoin = (e: React.FormEvent) => {
        e.preventDefault();
        if (code.trim()) {
            socket.emit('join_room', code.toUpperCase());
        }
    };

    return (
        <div className="room-entry-container">
            <img src={logo} alt="Star Wars Tug Wars" className="logo" />

            <div className="entry-card">
                <button className="primary-btn" onClick={handleCreate}>
                    CREATE PARTY
                </button>

                <div className="divider">OR</div>

                <form onSubmit={handleJoin} className="join-form">
                    <input
                        type="text"
                        placeholder="ENTER ROOM CODE"
                        value={code}
                        onChange={(e) => setCode(e.target.value.toUpperCase())}
                        maxLength={6}
                    />
                    <button type="submit" className="secondary-btn">JOIN PARTY</button>
                </form>

                {error && <p className="error-message">{error}</p>}
            </div>
        </div>
    );
}

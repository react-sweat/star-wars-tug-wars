import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// rooms[roomCode] = {
//   score: 0,
//   creator: socketId,
//   isStarted: false,
//   players: [{ id: socketId, name: string }],
//   teams: { red: [], blue: [] },
//   characters: { red: 'darth_vader', blue: 'luke_skywalker' }
// }
let rooms = {};

function generateRoomCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('create_room', () => {
        const roomCode = generateRoomCode();
        rooms[roomCode] = {
            score: 0,
            creator: socket.id,
            isStarted: false,
            players: [{ id: socket.id }],
            teams: { red: [], blue: [] },
            characters: { red: 'darth_vader', blue: 'luke_skywalker' }
        };
        socket.join(roomCode);
        socket.emit('room_created', {
            roomCode,
            isCreator: true,
            isStarted: false,
            config: {
                characters: rooms[roomCode].characters,
                score: rooms[roomCode].score,
                playerCounts: { red: 0, blue: 0 }
            }
        });
        io.to(roomCode).emit('player_list_update', rooms[roomCode].players);
        console.log(`Room created: ${roomCode} by ${socket.id}`);
    });

    socket.on('join_room', (roomCode) => {
        if (rooms[roomCode]) {
            socket.join(roomCode);
            rooms[roomCode].players.push({ id: socket.id });
            socket.emit('room_joined', {
                roomCode,
                isCreator: rooms[roomCode].creator === socket.id,
                isStarted: rooms[roomCode].isStarted,
                config: {
                    characters: rooms[roomCode].characters,
                    score: rooms[roomCode].score,
                    playerCounts: {
                        red: rooms[roomCode].teams.red.length,
                        blue: rooms[roomCode].teams.blue.length
                    }
                }
            });
            io.to(roomCode).emit('player_list_update', rooms[roomCode].players);
            console.log(`Socket ${socket.id} joined room ${roomCode}`);
        } else {
            socket.emit('error', { message: 'Room not found' });
        }
    });

    socket.on('join_team', ({ roomCode, team }) => {
        const room = rooms[roomCode];
        if (!room) return;

        // Remove from existing team if any
        room.teams.red = room.teams.red.filter(id => id !== socket.id);
        room.teams.blue = room.teams.blue.filter(id => id !== socket.id);

        room.teams[team].push(socket.id);

        io.to(roomCode).emit('room_update', {
            characters: room.characters,
            score: room.score,
            playerCounts: {
                red: room.teams.red.length,
                blue: room.teams.blue.length
            }
        });

        socket.emit('team_joined', { success: true, team });
    });

    socket.on('update_config', ({ roomCode, characters }) => {
        const room = rooms[roomCode];
        if (!room || room.creator !== socket.id) return;

        room.characters = characters;
        io.to(roomCode).emit('room_update', {
            characters: room.characters,
            score: room.score,
            playerCounts: {
                red: room.teams.red.length,
                blue: room.teams.blue.length
            }
        });
    });

    socket.on('start_game', (roomCode) => {
        const room = rooms[roomCode];
        if (!room || room.creator !== socket.id) return;

        room.isStarted = true;
        io.to(roomCode).emit('game_started');
    });

    socket.on('pull', ({ roomCode, team }) => {
        const room = rooms[roomCode];
        if (!room) return;

        // Verify player is on the team
        if (!room.teams[team].includes(socket.id)) return;

        const change = team === 'red' ? 5 : -5;
        room.score = Math.min(100, Math.max(-100, room.score + change));

        io.to(roomCode).emit('update_score', room.score);
    });

    socket.on('reset', (roomCode) => {
        const room = rooms[roomCode];
        if (!room) return;

        room.score = 0;
        io.to(roomCode).emit('update_score', 0);
        console.log(`Room ${roomCode} reset`);
    });

    socket.on('disconnecting', () => {
        for (const roomCode of socket.rooms) {
            const room = rooms[roomCode];
            if (room) {
                room.players = room.players.filter(p => p.id !== socket.id);
                room.teams.red = room.teams.red.filter(id => id !== socket.id);
                room.teams.blue = room.teams.blue.filter(id => id !== socket.id);

                io.to(roomCode).emit('player_list_update', room.players);

                io.to(roomCode).emit('room_update', {
                    characters: room.characters,
                    score: room.score,
                    playerCounts: {
                        red: room.teams.red.length,
                        blue: room.teams.blue.length
                    }
                });

                // If creator leaves, we might want to close or assign new creator
                // For now, if everyone leaves, delete room
                const totalPlayers = room.teams.red.length + room.teams.blue.length;
                if (totalPlayers === 0 && room.creator === socket.id) {
                    // This is simple cleanup, ideally we'd check if any socket is still in room
                    // but io.in(roomCode).fetchSockets() is async.
                    // For now, let's just leave it or use a timeout.
                }
            }
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

const PORT = 3000;
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

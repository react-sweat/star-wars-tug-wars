import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

let gameState = {
    score: 0
};

let teams = {
    red: null,
    blue: null
};

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.emit('update_score', gameState.score);
    socket.emit('team_update', teams);

    socket.on('join_team', (team) => {
        if (teams[team] === null) {
            teams[team] = socket.id;
            socket.emit('team_joined', { success: true, team });
            io.emit('team_update', teams);
            console.log(`Socket ${socket.id} joined team ${team}`);
        } else {
            socket.emit('team_joined', { success: false, message: 'Team is taken' });
        }
    });

    socket.on('pull', (team) => {
        if (teams[team] !== socket.id) return;

        const change = team === 'red' ? 5 : -5;
        const newScore = Math.min(100, Math.max(-100, gameState.score + change));

        if (newScore !== gameState.score) {
            gameState.score = newScore;
            io.emit('update_score', gameState.score);
        }
    });

    socket.on('reset', () => {
        gameState.score = 0;
        teams.red = null;
        teams.blue = null;
        io.emit('update_score', 0);
        io.emit('team_update', teams);
        console.log('Game reset');
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        if (teams.red === socket.id) teams.red = null;
        if (teams.blue === socket.id) teams.blue = null;
        io.emit('team_update', teams);
    });
});

const PORT = 3000;
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
